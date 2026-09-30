# CardioVision 3D - AI Context & Project Specification

## 1. Project Identity
- **Project Name:** CardioVision 3D (Interactive 3D Cardiovascular Risk Visualization & Explainable Multi-Vessel Stenosis Prediction)
- **Competition:** Multimodal AI Hackathon 2026 (IIT Mandi, Augli.ai, PurpleRain Tech, LDV Labs)
- **Track:** Track A – Cardiovascular Risk Visualization & Prediction
- **Submission Deadline:** October 14, 2026
- **Target Deliverables:**
  1. Web-based software prototype (React + React Three Fiber 3D Canvas + FastAPI Backend + Supabase)
  2. Trained predictive pipeline & weights (Multi-vessel CAD, LAD, LCX, RCA stenosis classification with SHAP)
  3. Interactive clinical dashboard with "What-If" treatment simulator
  4. 6-page maximum technical report
  5. 3 to 10-minute YouTube video demonstration
  6. Public GitHub repository with documentation

## 2. Dataset & Clinical Context
- **Dataset:** Extension of Z-Alizadeh Sani Dataset (UCI Machine Learning Repository ID: 411)
- **Records:** 303 patients, 59 attributes, zero missing values.
- **Targets:**
  - `Cath`: Binary CAD diagnosis (CAD: 216, Normal: 87)
  - `LAD`: Left Anterior Descending artery stenosis >= 50% (Stenotic: 177, Normal: 126)
  - `LCX`: Left Circumflex artery stenosis >= 50% (Stenotic: 119, Normal: 184)
  - `RCA`: Right Coronary Artery stenosis >= 50% (Stenotic: 114, Normal: 189)
- **Strict Anti-Leakage Rule:** `Cath`, `LAD`, `LCX`, and `RCA` must NEVER be used as input features for any model.

## 3. Architectural Blueprint
- **Frontend (`/frontend`):**
  - React 18 + Vite
  - React Three Fiber (R3F) + Three.js + Drei for 3D human torso/heart rendering
  - Custom GLSL / emissive shaders for dynamic artery status colors (Green -> Amber -> Red glow)
  - Supabase client integration for patient management and session saving
  - Modern, high-conversion UI with clinical safety disclaimers and PDF export
- **Machine Learning & Explainability (`/backend`):**
  - Python 3.14 + FastAPI
  - XGBoost / LightGBM / Random Forest calibrated classifiers
  - SHAP (TreeExplainer) for local & global feature attributions
  - Sub-30ms inference for real-time slider updates
- **Database & Cloud (`Supabase`):**
  - PostgreSQL tables: `patients`, `diagnostic_history`, `treatment_simulations`, `audit_logs`
  - Storage bucket for exported PDF reports

## 4. Engineering Principles
- Surgical, clean, modular code (< 600 lines per file).
- No speculative abstractions or unnecessary boilerplate.
- Test-driven and scientifically verified evaluation metrics (ROC-AUC, Precision, Recall, F1).
