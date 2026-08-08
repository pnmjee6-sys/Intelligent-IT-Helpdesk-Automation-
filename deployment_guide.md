# Production Deployment Guide (Vercel + Render + Supabase)

Comprehensive guide for deploying the **Intelligent IT Helpdesk Automation Platform** across **Supabase** (Database), **Render** (Backend API), and **Vercel** (Frontend SPA).

---

## 🏗️ Architecture Overview

```
Frontend (Vercel) --------> Backend (Render) --------> Supabase PostgreSQL (pgvector)
                          |                       |
                          v                       v
                   Gemini AI API              Redis Cache
```

---

## 🗄️ Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project
1. Log in to [Supabase Console](https://database.new) and create a new PostgreSQL project.
2. Note down your **Database Password** and **Project Reference**.

### 1.2 Enable `pgvector` & `uuid-ossp` Extensions
Navigate to the **SQL Editor** in Supabase dashboard and run:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 1.3 Obtain Supabase Connection Strings
In Supabase Project Settings > Database:
- **Connection String (Transaction Pooler - Port 6543)**:
  `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true`
- **Direct Connection String (Port 5432)**:
  `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`

---

## ⚙️ Step 2: Backend Deployment (Render)

### 2.1 Create Render Web Service
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `pnmjee6-sys/Intelligent-IT-Helpdesk-Automation-`.

### 2.2 Configure Render Web Service Settings

| Setting | Value |
| :--- | :--- |
| **Name** | `intelligent-it-helpdesk-backend` |
| **Environment** | `Node` |
| **Region** | `Singapore` (or nearest region to Supabase) |
| **Branch** | `main` |
| **Build Command** | `npm install && npx prisma generate` |
| **Start Command** | `npm run start:server` |
| **Health Check Path** | `/health` |

### 2.3 Set Render Environment Variables

Add the following environment variables under **Environment** in Render:

| Variable | Description & Example Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `10000` (or `3000`) |
| `DATABASE_URL` | Your Supabase pooled connection URL |
| `GEMINI_API_KEY` | Your Google Gemini API Key |
| `JWT_SECRET` | Secret key (min 32 chars) for signing tokens |
| `JWT_EXPIRES_IN` | `1d` |
| `APP_URL` | Your Vercel frontend URL (e.g. `https://my-app.vercel.app`) |

### 2.4 Run Initial Database Migration on Supabase
From your local terminal, point `DATABASE_URL` to Supabase and run:
```bash
npx prisma migrate deploy
npx ts-node prisma/seed.ts
```

---

## 🚀 Step 3: Frontend Deployment (Vercel)

### 3.1 Deploy Project on Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/new).
2. Import repository `pnmjee6-sys/Intelligent-IT-Helpdesk-Automation-`.

### 3.2 Configure Vercel Project Settings

| Setting | Value |
| :--- | :--- |
| **Framework Preset** | `Vite` |
| **Root Directory** | `./` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 3.3 Configure `vercel.json` API Proxy
Ensure `vercel.json` proxies API requests to your live Render backend URL:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/v1/:path*",
      "destination": "https://intelligent-it-helpdesk-backend.onrender.com/api/v1/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📋 Summary of Commands

### Build Commands

| Environment | Build Command |
| :--- | :--- |
| **Render (Backend)** | `npm install && npx prisma generate` |
| **Vercel (Frontend)** | `npm run build` |
| **Local Verification** | `npx prisma generate && npx tsc --noEmit && npm run build` |

### Start Commands

| Environment | Start Command |
| :--- | :--- |
| **Render (Backend)** | `npm run start:server` |
| **Vercel (Frontend)** | Automatically served from `dist/` SPA output |
| **Local Server** | `npx tsx server.ts` |

---

## 🚨 Common Deployment Errors & Troubleshooting

### 1. **CORS Network Error (`Access-Control-Allow-Origin`)**
- **Symptom**: Browser blocks requests from Vercel frontend to Render backend.
- **Cause**: Backend CORS origin header missing Vercel production domain.
- **Solution**: Set `APP_URL` in Render environment variables to your Vercel URL (`https://your-app.vercel.app`). `server.ts` is configured with `cors({ origin: true, credentials: true })`.

---

### 2. **Prisma Engine Binary Error on Render (`Query engine binary not found`)**
- **Symptom**: Render logs show `PrismaClientInitializationError: Unable to require(...)`.
- **Cause**: Missing Linux binary target in Prisma schema.
- **Solution**: Ensure `prisma/schema.prisma` includes:
  ```prisma
  generator client {
    provider      = "prisma-client-js"
    binaryTargets = ["native", "debian-openssl-3.0.x"]
  }
  ```

---

### 3. **Supabase Connection Limit Exceeded (`max_user_connections`)**
- **Symptom**: `FATAL: remaining connection slots are reserved for non-replication superuser connections`.
- **Cause**: Serverless backend creating too many direct PostgreSQL connections.
- **Solution**: Use Supabase **Transaction Pooler URL** (Port `6543`) with `pgbouncer=true` parameter in `DATABASE_URL`.

---

### 4. **JWT Verification Error (`secretOrPrivateKey must have a value`)**
- **Symptom**: 500 error on `/api/v1/auth/login` or `/api/v1/auth/register`.
- **Cause**: `JWT_SECRET` environment variable is undefined or empty string on Render.
- **Solution**: Set `JWT_SECRET` in Render environment settings with a strong string. `config/env.ts` includes safe fallback defaults.

---

### 5. **Vercel 404 on Page Refresh (Single Page Application Routing)**
- **Symptom**: Navigating directly to `/dashboard` or refreshing page returns Vercel 404 error.
- **Cause**: Static file web server attempting to find a physical `/dashboard/index.html` file.
- **Solution**: Included rewrite rule in `vercel.json`:
  ```json
  { "source": "/(.*)", "destination": "/index.html" }
  ```
