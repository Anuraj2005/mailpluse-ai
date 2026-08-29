1. Project OverviewMailPulse AI is a full-stack, AI-enhanced email productivity application designed to reduce inbox clutter, accelerate response times, and provide automated email insights. Utilizing Google OAuth 2.0, users securely delegate email management without handing over credentials. The platform syncs Gmail threads, generates context-aware summaries using Large Language Models (LLMs), draft intelligent replies with customizable tones, extracts actionable deadlines, and prioritizes critical messages.2. Tech StackLayerTechnology / LibraryPurposeFrontend FrameworkReact.js / Next.js (App Router)Client UI rendering and route managementStyling & UI ComponentsTailwind CSS, Lucide Icons, Shadcn UIResponsive design, accessibility, and modern layout componentsState ManagementTanStack Query (React Query) + ZustandAsync state caching, cache invalidation, and global UI stateBackend FrameworkNode.js + Express.jsRESTful API server, OAuth flow handling, and worker dispatchingDatabaseMongoDB Atlas (via Mongoose ORM)Document storage for users, metadata, draft history, and analyticsAuthentication & OAuthGoogle OAuth 2.0 (googleapis SDK)Secure user authentication and scoped Gmail API accessAI LayerOpenAI API (GPT-4o-mini / Text Embeddings)Summarization, reply generation, entity extraction, tone controlCaching / SessionsRedis (Upstash)Token storage, rate limiting, and session cachingDeploymentVercel (Frontend), Render (Backend API)Cloud hosting with automated CI/CD pipelines3. Core & Bonus Features Breakdown🎯 Core (Must-Have) FeaturesGoogle OAuth 2.0 Auth: Passwordless login with restricted scopes (gmail.readonly, gmail.send, gmail.modify).Live Email Dashboard & Thread Viewer: Interactive UI displaying thread structures, sender details, HTML body sanitation, and attachments metadata.Basic Mail Operations: Toggle Read/Unread, Star/Unstar, Archive, and Soft-Delete directly syncing back to Gmail servers.AI Thread Summarization: Single-click TL;DR summary extraction highlighting core message intent.Contextual Reply Generator: Intelligent draft synthesis based on thread context with manual inline modification before sending.Rich Compose & Dispatch Engine: Full-fledged editor for drafting and sending emails via the backend API.🚀 Bonus FeaturesSmart Priority & Spam Detection: Automated tagging based on urgency and sender trust factors.Action Item & Deadline Extraction: Automatic extraction of actionable tasks and event dates into structured JSON badges.Tone-Shift Reply Generator: Toggle options for Professional, Friendly, Formal, and Concise draft variations.Explain This Email: Layman breakdown of complex legal, technical, or confusing emails.Semantic Vector Search: Natural language search powered by text embeddings over cached message bodies.4. Authentication & Security Flow🔒 OAuth 2.0 Protocol SequenceInitiate Login: User clicks "Connect Gmail". Frontend calls GET /api/v1/auth/google/url.Consent Redirect: Server returns Google Consent URL with scopes:openid, profile, email[https://www.googleapis.com/auth/gmail.modify](https://www.googleapis.com/auth/gmail.modify)[https://www.googleapis.com/auth/gmail.send](https://www.googleapis.com/auth/gmail.send)Authorization Callback: Google redirects to GET /api/v1/auth/google/callback?code=AUTHORIZATION_CODE.Token Exchange: Backend exchanges authorization code with Google OAuth server for access_token and refresh_token.Token Storage & Encryption: Tokens are encrypted using AES-256-GCM before persistence in MongoDB Atlas.Session Management: Backend issues an HTTP-Only, SameSite=Strict, Secure JWT Cookie to the frontend client.[ User UI ] ---> (1) Click Login ---> [ Backend API ]
                                            |
[ Google OAuth ] <--- (2) Auth Redirect <---|
       |
 (User Consents)
       |
[ Backend API ] <--- (3) Auth Code Call --- [ Google OAuth ]
       |
 (4) AES-256 Encrypt Tokens & Save to MongoDB
       |
[ User UI ] <--- (5) Return HTTP-Only JWT Cookie --- [ Backend API ]
5. Frontend Pages & Routing/ — Landing Page: Feature highlights, CTA for Google Login, security disclosures./auth/callback — OAuth Handshake: Loading state handling token authorization response./dashboard/inbox — Primary Workspace: Split panel showing list of emails on the left and selected thread viewer on the right./dashboard/search — Smart Search Interface: Search bar supporting structured filters and semantic natural language queries./dashboard/analytics — Email Insights: Visual overview of email volume, response latency, and AI-derived productivity metrics./dashboard/settings — Preferences: System configurations, AI defaults (preferred default tone), and connected Google accounts.6. Backend Architecture & Database Schema🏗 Architecture PatternThe backend follows a Layered Architecture (Controller-Service-Repository) pattern with modular service decoupling.       ┌────────────────────────────────────────────────────────┐
       │                  Express HTTP Server                   │
       └───────────────────────────┬────────────────────────────┘
                                   │
       ┌───────────────────────────▼────────────────────────────┐
       │             Routes & JWT Middleware                    │
       └───────────────────────────┬────────────────────────────┘
                                   │
      ┌────────────────────────────┼────────────────────────────┐
      │                            │                            │
┌─────▼──────────┐         ┌───────▼────────┐          ┌────────▼─────────┐
│ Auth Controller│         │ Mail Controller│          │  AI Controller   │
└─────┬──────────┘         └───────┬────────┘          └────────┬─────────┘
      │                            │                            │
┌─────▼──────────┐         ┌───────▼────────┐          ┌────────▼─────────┐
│ OAuth Service  │         │  Gmail Service │          │   LLM Service    │
└─────┬──────────┘         └───────┬────────┘          └────────┬─────────┘
      │                            │                            │
      └────────────────────────────┼────────────────────────────┘
                                   │
                       ┌───────────▼───────────┐
                       │  MongoDB Atlas DB     │
                       └───────────────────────┘
🗄 MongoDB Collections SchemaCollection: usersJSON{
  "_id": "ObjectId",
  "googleId": "String (Unique)",
  "email": "String (Indexed)",
  "displayName": "String",
  "avatarUrl": "String",
  "tokens": {
    "accessToken": "String (Encrypted)",
    "refreshToken": "String (Encrypted)",
    "expiryDate": "Number"
  },
  "settings": {
    "defaultTone": "String (default: 'Professional')",
    "autoSummarize": "Boolean"
  },
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
Collection: email_metadataJSON{
  "_id": "ObjectId",
  "userId": "ObjectId (Ref: users)",
  "threadId": "String (Indexed)",
  "messageId": "String (Unique)",
  "sender": { "name": "String", "email": "String" },
  "recipients": [{ "name": "String", "email": "String" }],
  "subject": "String",
  "snippet": "String",
  "isRead": "Boolean",
  "isStarred": "Boolean",
  "labels": ["String"],
  "receivedAt": "ISODate",
  "aiAnalysis": {
    "summary": "String",
    "priority": "String (High/Medium/Low)",
    "actionItems": ["String"],
    "deadlines": ["ISODate"]
  }
}
7. API Endpoints SpecificationAuthentication ModuleGET /api/v1/auth/google/url — Returns Google Consent screen OAuth URL.GET /api/v1/auth/google/callback — Handles OAuth redirect, exchanges tokens, generates JWT session.POST /api/v1/auth/logout — Clears JWT session cookie.Email Operations ModuleGET /api/v1/emails — List synced email threads with pagination (page, limit, label).GET /api/v1/emails/:threadId — Retrieve full message contents and metadata for a specific thread.PATCH /api/v1/emails/:messageId/modify — Update label states (Read, Star, Archive, Trash).POST /api/v1/emails/send — Send new outbound email or reply via Gmail API.AI Engine ModulePOST /api/v1/ai/summarize — Generate concise summary from body payload or thread ID.POST /api/v1/ai/generate-reply — Synthesize contextual email response based on thread context and selected tone.POST /api/v1/ai/explain — Produce layman breakdown for legal or technical email text.POST /api/v1/ai/extract-insights — Parse text to extract key dates, obligations, and action items.8. Directory Folder Structuremailpulse-ai/
├── client/                     # Frontend Application (Next.js / React)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components (Shadcn UI)
│   │   │   ├── ui/             # Core UI elements (Buttons, Dialogs)
│   │   │   ├── dashboard/      # Thread view, inbox list, search bar
│   │   │   └── ai/             # Summary cards, tone selectors
│   │   ├── hooks/              # Custom React hooks (useGmail, useAI)
│   │   ├── lib/                # API client (Axios/Fetch), utility functions
│   │   ├── pages/              # Routing views / pages
│   │   ├── store/              # Global Zustand state stores
│   │   └── styles/             # Global CSS & Tailwind setups
│   ├── package.json
│   └── tailwind.config.js
│
└── server/                     # Backend Application (Express Node.js)
    ├── src/
    │   ├── config/             # DB connection, OAuth setup, Environment setup
    │   ├── controllers/        # Auth, Email, and AI endpoint handlers
    │   ├── middlewares/        # Auth verification, rate limiters, error handlers
    │   ├── models/             # Mongoose schemas (User, EmailMetadata)
    │   ├── routes/             # REST API routes declarations
    │   ├── services/           # Google API SDK wrappers, OpenAI integrations
    │   └── utils/              # AES-256 Encryption utilities, loggers
    ├── .env.example
    ├── package.json
    └── server.js               # Entrypoint file
9. Development Phases & MilestonesPhase 1: Foundation (Days 1-3) ──► Phase 2: Core Email Engine (Days 4-7)
                                                │
Phase 4: Production Deployment ◄── Phase 3: AI Engine Integration (Days 8-10)
Phase 1: Setup & Authentication (Days 1–3)Set up GCP Console project, configure OAuth Credentials & redirect URIs.Develop Express server boilerplate, MongoDB connection, and Google auth routes.Implement AES-256 encryption for access/refresh tokens.Phase 2: Core Email Dashboard Engine (Days 4–7)Integrate Google API Client (googleapis) for email fetching and sending.Create responsive frontend split panel layout with TanStack Query.Build Gmail manipulation handlers (Star, Archive, Mark Read, Trash).Phase 3: AI Engine Integration (Days 8–10)Integrate OpenAI API for prompt-based summarization and reply synthesis.Create interactive reply workspace with dynamic tone selector.Implement action item and deadline extraction components.Phase 4: Security Hardening & Deployment (Days 11–14)Configure Vercel frontend deployment with proper environment routing.Deploy backend to Render, configure CORS, and restrict MongoDB IP access.Conduct security audits for API secret leakages and CSRF vulnerabilities.10. UI & UX Design RequirementsLayout Structure: High-density split view (List column on the left, Reader pane on the right).Feedback & Loading States: Skeleton shimmer loaders during email sync and AI generation runs.Inline AI Assistance: Floating actions inside draft editors allowing tone conversion with 1-click apply.Theme Support: Dark mode default with accessible contrast ratios for readable long-form emails.11. Security Requirements & Best PracticesZero Raw Password Storage: Absolute requirement to use OAuth 2.0; the application never collects or stores user passwords.Token Encryption at Rest: Store all Google access tokens and refresh tokens in MongoDB encrypted using AES-256-GCM with a secret key stored in environment variables.Environment Isolation: frontend repository must NEVER expose backend environment credentials (OPENAI_API_KEY, GOOGLE_CLIENT_SECRET, JWT_SECRET).CORS Policy Restrictions: Express server must configure strict CORS headers allowing requests exclusively from the designated Vercel production domain.Secure Cookie Configuration: Authentication JWTs must be transmitted exclusively over HTTPS using HTTP-Only cookies to protect against XSS token extraction.12. Final Expected Deliverable OutcomeA fully operational, deployed full-stack Web Application where:A user can log in with Google securely without exposing password details.The inbox populates in real-time with cached Gmail threads.Clicking any thread renders an automated AI-generated summary alongside extracted action items.Generating a reply creates an editable draft tailored to the selected tone (e.g., Professional, Formal), which can be sent directly to the recipient via Gmail.All deployments are active across Vercel (Frontend), Render (Backend API), and MongoDB Atlas (Database), connected through GitHub integration pipelines.1.Initialize Project Repositories:Setup client & server directories.Set up root repositories, install dependencies for frontend (Next.js, Tailwind CSS, TanStack Query) and backend (Express, Mongoose, googleapis, openai), and configure basic environment templates (.env.example).2.Configure Google Cloud OAuth Console:Generate client IDs & secrets.Register a new project on the Google Cloud Console, configure the OAuth Consent Screen with standard Gmail scopes (gmail.modify, gmail.send), and register local and production callback URIs.3.Build Auth Layer & Token Encryption:Implement AES-256 & JWT Cookie flows.Write backend routes for OAuth URL generation and callback processing. Implement AES-256-GCM encryption for persistent token storage in MongoDB and issue secure HTTP-Only JWT session cookies.4.Develop Dashboard UI & Gmail Sync Services:Construct split-pane inbox layout.Integrate googleapis SDK to fetch inbox lists, render threads, and handle standard email operations (star, archive, delete). Connect front-end state management for seamless sync.5.Integrate AI Engine & Response Features:Connect OpenAI endpoints.Build backend services for LLM prompts handling summarization, entity extraction (dates/deadlines), and multi-tone reply drafting with inline UI preview controls.