<img width="1917" height="876" alt="Screenshot 2026-08-30 115917" src="https://github.com/user-attachments/assets/944c15e9-885a-46a2-a093-e6615afd0302" />
# MailPulse AI

MailPulse AI is an AI-powered inbox assistant that helps users process email faster, stay organized, and respond with better context. It combines Google OAuth authentication, Gmail integration, and AI-generated summaries, action items, and reply drafts into a single productivity dashboard.

## 1. Project Name

MailPulse AI

## 2. Problem Statement

Professionals and teams are overwhelmed by high email volume, missed follow-ups, and slow response cycles. MailPulse AI solves this by automatically summarizing long threads, identifying action items and deadlines, explaining confusing messages in plain language, and generating polished replies in different tones. This makes email management more efficient, less stressful, and more actionable.

## 3. Features

- Google OAuth sign-in with secure Gmail access
- Split-panel inbox and thread viewer
- AI-powered email summaries and priority detection
- Tone-based reply generation for professional, friendly, formal, and concise responses
- Action item and deadline extraction from email content
- Plain-English explanation for complex or technical emails
- Smart search for locating important messages faster
- Analytics dashboard for email activity and productivity insights
- Optional demo mode for testing without live credentials

## 4. Technology Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose
- Authentication: Google OAuth 2.0
- AI Services: Gemini / OpenAI-based language models
- APIs: Gmail API, Google Identity services
- Other libraries: Axios, Zustand, React Query, Helmet, JWT, cookie-parser

## 5. Screenshots

![Landing Page]<img width="1917" height="876" alt="Screenshot 2026-08-30 115917" src="https://github.com/user-attachments/assets/adaddc5b-a7c8-42ac-a883-72f8d3a7a4c6" />


![Inbox Dashboard]<img width="1902" height="867" alt="Screenshot 2026-08-30 120137" src="https://github.com/user-attachments/assets/94239838-445f-42a6-b62c-8bcb88dac0a8" />



![AI Summary and Reply Panel]
<img width="1897" height="860" alt="Screenshot 2026-08-30 120224" src="https://github.com/user-attachments/assets/44bc2462-dbd9-444c-be3d-fac2eef54cf6" />


## 6. Live Demo

Frontend URL: mailpluse-ai.vercel.app

## 7. Backend

Backend/API URL: https://mailpluse-ai.onrender.com

## 8. Setup Instructions

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas account or local MongoDB instance
- Google Cloud project with Gmail API enabled
- AI API key from Google AI Studio or OpenAI

### Local Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd project
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Create a `.env` file in the `server` folder and add the required environment variables.

4. Start the backend server:
   ```bash
   npm run dev
   ```

5. In a second terminal, install and start the frontend:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

6. Open the app in the browser at:
   ```text
   http://localhost:5173
   ```

## 9. Environment Variables

Add the following variables to the `server/.env` file. Do not commit actual secret values.

- PORT
- NODE_ENV
- CLIENT_URL
- JWT_SECRET
- ENCRYPTION_KEY
- MONGODB_URI
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI
- GEMINI_API_KEY

> Important: Never commit API keys, passwords, OAuth secrets, access tokens, or other sensitive credentials to GitHub.

---


### Running Frontend Build Verification
```bash
cd client
npm run build
```
