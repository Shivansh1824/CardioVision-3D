# CardioVision 3D — Backend Deployment Guide

## Why Railway (not Vercel) for FastAPI + ML Models

Vercel serverless functions have a 250 MB bundle limit, a **10s timeout**, and no persistent memory between invocations. Our 4 XGBoost models + 4 SHAP explainers total ~18 MB of `joblib` files that take 2–3s just to load into memory. With Vercel, every cold start would timeout.

**Railway** gives you a persistent Python process (like a real server), free tier with 500 hours/month, and deploys directly from a GitHub subfolder in 3 minutes.

---

## Step-by-Step: Deploy Backend to Railway

### Prerequisites
- A [Railway account](https://railway.app) (free, sign in with GitHub)
- The project pushed to GitHub (you already have a repo)

### Steps

**1. Go to [railway.app](https://railway.app) → "New Project" → "Deploy from GitHub repo"**

**2. Select your `Multimodal-AI-Hackathon-CardioVision-3D` repository**

**3. When asked for the root directory, set it to:**
```
backend
```
(This tells Railway to look inside `/backend` for `requirements.txt` and the app)

**4. Railway auto-detects Python + `requirements.txt` and builds with nixpacks**

**5. After deploy, click your service → "Settings" → "Networking" → "Generate Domain"**
You'll get a URL like: `https://cardiovision-backend-production.up.railway.app`

**6. Copy that URL → paste into your frontend `.env.local`:**
```
VITE_API_URL=https://cardiovision-backend-production.up.railway.app
```

**7. Redeploy Vercel frontend (it will pick up the new env var)**

---

## Environment Variables on Railway (if needed)

If your backend `.env` has secrets (Supabase URL, keys), add them in:
Railway Dashboard → Your Service → "Variables" tab → Add them there.

Check `/backend/.env` for what to copy over.

---

## Verify the Deployment

Once live, open:
- `https://your-railway-url.up.railway.app/` → should return the JSON health check
- `https://your-railway-url.up.railway.app/api/metrics` → should return model accuracy stats
