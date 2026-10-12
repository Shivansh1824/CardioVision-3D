# CardioVision 3D — Backend Deployment Guide (Render)

## Active Deployment Platform: Render.com

The FastAPI backend and calibrated machine learning models are deployed as a free Web Service on **Render.com**:
- **Live Backend URL:** `https://cardiovision-3d.onrender.com`
- **Blueprint Config:** Defined in root [`render.yaml`](../render.yaml)

---

## Service Configuration

- **Environment:** Python 3 (configured via `runtime.txt`)
- **Root Directory:** `backend`
- **Build Command:** `pip install --upgrade pip && pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

## Live Verification Endpoints

1. **Health Check:** `https://cardiovision-3d.onrender.com/`
2. **Clinical Validation Metrics:** `https://cardiovision-3d.onrender.com/api/metrics`
3. **ML Inference:** `POST https://cardiovision-3d.onrender.com/api/predict`
4. **Interactive Simulator:** `POST https://cardiovision-3d.onrender.com/api/simulate`

---

## Frontend Integration

The Vercel frontend connects to this backend via:
```
VITE_API_URL=https://cardiovision-3d.onrender.com
```
Configured in Vercel Project Settings → Environment Variables.
