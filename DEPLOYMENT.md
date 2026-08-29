# MailPulse AI — Deployment Guide

> **Stack**: React (Vite) → **Vercel** · Node/Express → **Render** · MongoDB → **MongoDB Atlas**

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Push to GitHub](#2-push-to-github)
3. [Set Up MongoDB Atlas](#3-set-up-mongodb-atlas)
4. [Deploy Backend to Render](#4-deploy-backend-to-render)
5. [Deploy Frontend to Vercel](#5-deploy-frontend-to-vercel)
6. [Update Google OAuth Credentials](#6-update-google-oauth-credentials)
7. [Environment Variables Reference](#7-environment-variables-reference)
8. [Post-Deployment Checklist](#8-post-deployment-checklist)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

- [x] GitHub account — [github.com](https://github.com)
- [x] Render account (free) — [render.com](https://render.com)
- [x] Vercel account (free) — [vercel.com](https://vercel.com)
- [x] MongoDB Atlas account (free) — [mongodb.com/atlas](https://www.mongodb.com/atlas)
- [x] Google Cloud Console project with OAuth 2.0 credentials
- [x] Google AI Studio API key — [aistudio.google.com](https://aistudio.google.com/app/apikey)

---

## 2. Push to GitHub

### First-time setup

```bash
# Navigate to the project root
cd project

# Initialise git
git init

# Stage all files (.env is already in .gitignore — safe!)
git add .
git commit -m "feat: initial MailPulse AI deployment"

# Create a new repository on GitHub (do NOT initialise with README)
# Then link it:
git remote add origin https://github.com/YOUR_USERNAME/mailpulse-ai.git
git branch -M main
git push -u origin main
```

> ⚠️ **Double-check**: Run `git status` and confirm `.env` is **NOT** listed. Only committed files appear.

---

## 3. Set Up MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → **Create a free cluster** (M0, any region).
2. Under **Database Access** → Add a new database user (username + strong password). Note them down.
3. Under **Network Access** → Add IP address → **Allow access from anywhere** (`0.0.0.0/0`) for Render.
4. Click **Connect** → **Connect your application** → copy the URI, e.g.:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/mailpulse?retryWrites=true&w=majority
   ```
5. Save this — you'll paste it in Render as `MONGODB_URI`.

---

## 4. Deploy Backend to Render

### A. Create a new Web Service

1. Log in to [render.com](https://render.com) → **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Set the following **Build & Deploy** settings:

| Setting | Value |
|---|---|
| **Root Directory** | `server` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

### B. Add Environment Variables

Go to **Environment** tab and add each variable:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `CLIENT_URL` | *(leave blank for now — fill after Vercel deploy)* |
| `JWT_SECRET` | *(click "Generate" or use a 32-char random string)* |
| `ENCRYPTION_KEY` | *(64 hex chars — see generator below)* |
| `MONGODB_URI` | *(your Atlas connection string from Step 3)* |
| `GOOGLE_CLIENT_ID` | *(from Google Cloud Console)* |
| `GOOGLE_CLIENT_SECRET` | *(from Google Cloud Console)* |
| `GOOGLE_REDIRECT_URI` | `https://YOUR-SERVICE.onrender.com/api/v1/auth/google/callback` |
| `GEMINI_API_KEY` | *(from Google AI Studio)* |

> **Generate ENCRYPTION_KEY**: Run this in PowerShell:
> ```powershell
> -join ((48..57) + (97..102) | Get-Random -Count 64 | % {[char]$_})
> ```

4. Click **Create Web Service** and wait for the deploy (2–5 min).
5. Note your service URL: `https://mailpulse-ai-server.onrender.com`

---

## 5. Deploy Frontend to Vercel

### A. Update `vercel.json`

Open [`client/vercel.json`](./client/vercel.json) and replace the placeholder with your **actual Render URL**:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://mailpulse-ai-server.onrender.com/api/$1"
    }
  ]
}
```

Commit and push this change:
```bash
git add client/vercel.json
git commit -m "chore: set Render backend URL in vercel.json"
git push
```

### B. Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo.
2. Set the **Root Directory** to `client`.
3. Vercel auto-detects Vite — leave Build settings as-is.
4. Click **Deploy**.
5. Note your frontend URL, e.g.: `https://mailpulse-ai.vercel.app`

### C. Set `CLIENT_URL` in Render

Go back to Render → Your service → **Environment** → update:

| Key | Value |
|---|---|
| `CLIENT_URL` | `https://mailpulse-ai.vercel.app` |

Click **Save Changes** → Render will auto-redeploy.

---

## 6. Update Google OAuth Credentials

You **must** update your Google Cloud Console to allow the new production URLs.

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → **APIs & Services** → **Credentials**.
2. Click your **OAuth 2.0 Client ID**.
3. Under **Authorized JavaScript origins**, add:
   ```
   https://mailpulse-ai.vercel.app
   ```
4. Under **Authorized redirect URIs**, add:
   ```
   https://mailpulse-ai-server.onrender.com/api/v1/auth/google/callback
   ```
5. Click **Save**.

> If your app is still in **Testing** mode, also go to **OAuth consent screen** → **Test users** and add the Gmail accounts you want to allow. To allow anyone, publish the app (requires Google verification for sensitive scopes).

---

## 7. Environment Variables Reference

### Backend (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` (local) / `10000` (Render) |
| `NODE_ENV` | Environment | `development` / `production` |
| `CLIENT_URL` | Frontend origin for CORS | `https://mailpulse-ai.vercel.app` |
| `JWT_SECRET` | JWT signing secret | `random-32-char-string` |
| `ENCRYPTION_KEY` | Token encryption key | `64 hex characters` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-...` |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL | `https://...onrender.com/api/v1/auth/google/callback` |
| `GEMINI_API_KEY` | Google AI Studio key | `AIzaSy...` |

### Frontend — Vercel Environment Variables (optional)

No frontend env vars are required. The `vercel.json` rewrite proxy handles API routing.

---

## 8. Post-Deployment Checklist

- [ ] Backend health check returns `200`: `https://YOUR-SERVICE.onrender.com/api/health`
- [ ] Frontend loads without errors: `https://mailpulse-ai.vercel.app`
- [ ] Google Sign In completes successfully
- [ ] Gmail emails load (not mock data)
- [ ] AI Reply / Summarize / Explain features work
- [ ] Logout redirects to landing page

---

## 9. Troubleshooting

### `CORS blocked` error in browser

- Ensure `CLIENT_URL` in Render exactly matches your Vercel URL (no trailing slash).
- Redeploy Render after updating env vars.

### `Error 403: access_denied` on Google Sign In

- Add your email to **Test users** in Google Cloud Console → OAuth consent screen.
- Or publish your OAuth app for production use.

### `Insufficient Permission` for Gmail API

- Sign out and sign in again — the new consent screen will ask for Gmail permissions.
- Ensure all Gmail scopes are in your OAuth client's authorized scopes.

### Render service sleeps after 15 min (Free tier)

- The free Render tier spins down after inactivity. First request may take ~30s to wake up.
- Upgrade to Starter ($7/mo) for always-on, or use [UptimeRobot](https://uptimerobot.com) to ping `/api/health` every 10 min to keep it warm.

### MongoDB connection refused

- Check Atlas **Network Access** — IP `0.0.0.0/0` must be whitelisted.
- Verify your Atlas username/password are URL-encoded in the connection string.

---

*Built with ❤️ using Google Gemini AI, Google OAuth, Gmail API, React, and Express.*
