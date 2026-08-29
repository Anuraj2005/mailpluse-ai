# MailPulse AI ⚡

> **Intelligent Executive Email Management & Insights Platform**  
> Full-stack AI-enhanced productivity application featuring Google OAuth 2.0 authentication, Gmail sync, automated thread summarization, tone-shift reply generation, and structured deadline extraction.

---

## 📑 Table of Contents
- [✨ Core & Advanced Features](#-core--advanced-features)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [📁 Directory Structure](#-directory-structure)
- [🚀 Quick Start (Local Setup)](#-quick-start-local-setup)
  - [Prerequisites](#prerequisites)
  - [1. Backend Server Setup](#1-backend-server-setup)
  - [2. Frontend Client Setup](#2-frontend-client-setup)
- [🔒 Google Cloud OAuth 2.0 Configuration Guide](#-google-cloud-oauth-20-configuration-guide)
- [🤖 OpenAI API Key Configuration](#-openai-api-key-configuration)
- [📡 REST API Endpoints Specification](#-rest-api-endpoints-specification)
- [🛡️ Security Best Practices](#️-security-best-practices)
- [🧪 Testing & Verification](#-testing--verification)

---

## ✨ Core & Advanced Features

- 🔒 **Google OAuth 2.0 Auth**: Passwordless login with restricted scopes (`gmail.modify`, `gmail.send`, `openid`, `profile`, `email`) and AES-256-GCM token encryption at rest.
- 📬 **Live Split-Pane Dashboard**: Modern high-density email inbox with thread view, HTML sanitization, star/archive/read toggles, and status badges.
- ⚡ **AI Thread Summarization**: 1-click TL;DR summaries and priority detection (High, Medium, Low).
- ✍️ **Tone-Shift Reply Generator**: Contextual reply drafting with dynamic tone variations (**Professional**, **Friendly**, **Formal**, **Concise**) and inline Gmail dispatch.
- 📅 **Action Item & Deadline Extraction**: Automatic parsing of obligations and ISO-dated deadlines with interactive checklists.
- 💡 **Explain This Email**: Instant layman translation of confusing, technical, or legal emails into 5th-grade plain English.
- 🔍 **Smart & Semantic Search**: Natural language search query interface with keyword filters.
- 📊 **Productivity Analytics**: Visual breakdown of email velocity, AI reply automation rates, and priority distribution.
- ⚡ **Zero-Config First Run**: Out-of-the-box Interactive Live Demo fallback mode so you can test all UI & AI workflows immediately before setting up GCP credentials.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, TanStack Query (React Query), Zustand |
| **Backend** | Node.js, Express.js, RESTful API |
| **Authentication** | Google OAuth 2.0 (`googleapis` SDK), JWT Sessions (HTTP-Only cookies), AES-256-GCM Encryption |
| **Database** | MongoDB Atlas via Mongoose ORM |
| **AI Engine** | OpenAI API (`gpt-4o-mini`, text completion & insights extraction) |

---

## 📁 Directory Structure

```
mailpulse-ai/
├── client/                     # Frontend Application (React / Vite / Tailwind)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Badge, Button, Modal, Skeleton loaders
│   │   │   ├── dashboard/      # Sidebar, EmailList, ThreadView
│   │   │   ├── ai/             # AISummaryCard, ToneSelector, ActionItemsBadge, ExplainModal
│   │   │   ├── compose/        # ComposeModal with AI Assist
│   │   │   ├── search/         # SmartSearch view
│   │   │   ├── analytics/      # AnalyticsView metrics and volume charts
│   │   │   ├── settings/       # SettingsView preferences
│   │   │   └── landing/        # LandingPage & OAuth hero
│   │   ├── hooks/              # Custom data and theme hooks
│   │   ├── lib/                # Axios API client
│   │   ├── store/              # Zustand global state (useMailStore)
│   │   ├── index.css           # Tailwind base styles & glassmorphism
│   │   ├── App.jsx             # Main application router & layout
│   │   └── main.jsx            # React root entrypoint
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                     # Backend API (Express.js)
│   ├── src/
│   │   ├── config/             # MongoDB connection, OAuth credentials, env parser
│   │   ├── controllers/        # Auth, Email, and AI endpoint handlers
│   │   ├── middlewares/        # JWT auth verification, error handler
│   │   ├── models/             # User (AES-256 encrypted tokens), EmailMetadata schemas
│   │   ├── routes/             # REST API routes (/auth, /emails, /ai)
│   │   ├── services/           # GmailService, LLMService, OAuthService, MockDataStore
│   │   └── utils/              # AES-256-GCM encryption helper, logger
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express application entrypoint
│
├── spec.md                     # Single Source of Truth Project Specification
└── README.md                   # This documentation guide
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- **Node.js**: v18.0.0 or later installed (`node -v`)
- **npm**: v9.0.0 or later installed (`npm -v`)
- **MongoDB** (Optional for live persistence; automatic fallback in-memory store is included for zero-config testing).

---

### 1. Backend Server Setup

1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - On Windows PowerShell:
     ```powershell
     Copy-Item .env.example .env
     ```
   - Update `.env` with your preferred ports and keys (see sections below for Google OAuth and OpenAI).

4. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   > 🚀 The server will launch on `http://localhost:5000`.

---

### 2. Frontend Client Setup

1. Open a second terminal window and navigate to the `client/` directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > 🌐 The web application will open on `http://localhost:5173`.

4. Open your browser at `http://localhost:5173`:
   - Click **"Explore Live Demo"** or **"Launch Workspace Demo"** to immediately test all features (AI Summaries, Tone-Shift Replies, Plain English Explanations, Compose, Analytics, and Search).
   - Click **"Sign in with Google"** to connect your live Gmail account once GCP credentials are configured.

---

## 🔒 Google Cloud OAuth 2.0 Configuration Guide

To enable live synchronization and dispatch with your actual Google / Gmail account:

1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named **MailPulse AI**.
3. Navigate to **APIs & Services > Library**, search for **Gmail API**, and click **Enable**.
4. Navigate to **APIs & Services > OAuth consent screen**:
   - Select **External** user type and fill in app name and support email.
   - Under **Scopes**, add:
     - `https://www.googleapis.com/auth/gmail.modify`
     - `https://www.googleapis.com/auth/gmail.send`
     - `openid`, `profile`, `email`
   - Under **Test Users**, add your Gmail address.
5. Navigate to **APIs & Services > Credentials**:
   - Click **Create Credentials > OAuth Client ID**.
   - Application Type: **Web application**.
   - Name: `MailPulse Local Dev`.
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:5000`
   - Authorized redirect URIs:
     - `http://localhost:5000/api/v1/auth/google/callback`
6. Copy your **Client ID** and **Client Secret** into `server/.env`:
   ```env
   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/api/v1/auth/google/callback
   ```

---

## 🤖 OpenAI API Key Configuration

To enable live OpenAI responses instead of the built-in fallback heuristics:

1. Create or access your account at [OpenAI Platform](https://platform.openai.com/api-keys).
2. Generate a secret API key.
3. Paste the key into `server/.env`:
   ```env
   OPENAI_API_KEY=sk-...your_key_here...
   ```

---

## 📡 REST API Endpoints Specification

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/google/url` | Generates Google OAuth 2.0 consent URL |
| `GET` | `/google/callback` | Exchanges code for tokens and issues session cookie |
| `GET` | `/me` | Returns current user profile & settings |
| `POST` | `/logout` | Clears JWT session cookie |
| `POST` | `/settings` | Updates default tone and auto-summarize preferences |

### Email Operations (`/api/v1/emails`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | List email threads with pagination (`page`, `limit`, `label`, `search`) |
| `GET` | `/:threadId` | Fetch complete thread contents and metadata |
| `PATCH` | `/:messageId/modify` | Update label states (`isRead`, `isStarred`, `addLabels`, `removeLabels`) |
| `POST` | `/send` | Dispatch outbound email or thread reply via Gmail API |

### AI Engine (`/api/v1/ai`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/summarize` | Generates concise TL;DR bullet summary and priority level |
| `POST` | `/generate-reply` | Synthesizes contextual replies with tone control (`Professional`, `Friendly`, `Formal`, `Concise`) |
| `POST` | `/explain` | Translates technical/legal email text into plain English |
| `POST` | `/extract-insights` | Extracts action tasks, obligations, and ISO deadline dates |

---

## 🛡️ Security Best Practices

- **Zero Password Storage**: Uses Google OAuth 2.0 with scoped delegation.
- **Token Encryption at Rest**: Access and refresh tokens are encrypted using **AES-256-GCM** before saving to the database.
- **HTTP-Only Cookies**: Authentication session tokens are stored in `HttpOnly`, `SameSite=Strict` cookies.
- **Environment Isolation**: Client never receives raw OAuth secrets or OpenAI keys.

---

## 🧪 Testing & Verification

### Running Server Tests & Health Check
```bash
curl http://localhost:5000/api/health
# Returns: {"status":"healthy","service":"MailPulse AI API Engine"}
```

### Running Frontend Build Verification
```bash
cd client
npm run build
```
