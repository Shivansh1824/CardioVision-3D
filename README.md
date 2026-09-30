# CardioVision 3D 🫀
### *Interactive 3D Cardiovascular Risk Visualization & Multi-Vessel Stenosis Prediction with Explainable AI*

[![Hackathon](https://img.shields.io/badge/Competition-Multimodal%20AI%20Hackathon%202026-blue?style=for-the-badge)](https://unstop.com/hackathons/multimodal-ai-hackathon-2026-iit-mandi-1755408)
[![Track](https://img.shields.io/badge/Track-A%3A%20Cardiovascular%20Risk%20Visualization-red?style=for-the-badge)](https://unstop.com/hackathons/multimodal-ai-hackathon-2026-iit-mandi-1755408)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Stack: React + Three.js](https://img.shields.io/badge/Frontend-React%20%7C%20Three.js%20%7C%20R3F-06b6d4?style=for-the-badge)](https://threejs.org/)
[![AI: XGBoost + SHAP](https://img.shields.io/badge/ML%20Engine-XGBoost%20%7C%20SHAP-10b981?style=for-the-badge)](https://shap.readthedocs.io/)
[![Database: Supabase](https://img.shields.io/badge/Cloud-Supabase%20PostgreSQL-3ecf8e?style=for-the-badge)](https://supabase.com/)

---

## 📌 Table of Contents
1. [Executive Summary & Problem Statement](#-executive-summary--problem-statement)
2. [Key Innovations & Features](#-key-innovations--features)
3. [Dual Persona Architecture (Doctor vs. Patient)](#-dual-persona-architecture-doctor-vs-patient)
4. [System Architecture](#-system-architecture)
5. [Dataset & Anti-Leakage Compliance](#-dataset--anti-leakage-compliance)
6. [Machine Learning & Explainability Pipeline](#-machine-learning--explainability-pipeline)
7. [Prerequisites & Dependencies](#-prerequisites--dependencies)
8. [Quick Start & Setup Instructions](#-quick-start--setup-instructions)
9. [Evaluation & Performance Metrics](#-evaluation--performance-metrics)
10. [Clinical Safety Disclaimer](#-clinical-safety-disclaimer)
11. [Project Directory Layout](#-project-directory-layout)
12. [Demo Video & Submission Links](#-demo-video--submission-links)

---

## 🎯 Executive Summary & Problem Statement

Cardiovascular disease (CVD) remains the leading cause of mortality worldwide. In clinical cardiology, statistical algorithms routinely generate risk percentages, but raw numerical figures fail to give clinicians or patients an intuitive spatial understanding of **where** and **how** pathology is developing inside the coronary anatomy.

Patients receive complex laboratory printouts (Lipid Panels, 12-lead ECGs, 2D Echocardiograms) that generate confusion and anxiety rather than treatment adherence. Simultaneously, clinicians lack an interactive visual tool to simulate the physical benefits of medication and lifestyle changes.

**CardioVision 3D solves this by bridging the gap between statistical machine learning and spatial anatomical intuition:**
* It predicts both overall **Coronary Artery Disease (CAD)** and vessel-specific stenosis across the three major coronary arteries: **LAD** (Left Anterior Descending), **LCX** (Left Circumflex), and **RCA** (Right Coronary Artery).
* It projects these probabilities onto a **living, interactive 3D human heart and torso model**, color-coding vessels in real time (Green = Normal, Amber = Moderate Risk, Pulsing Red = Critical Stenosis).
* It mathematically explains the underlying drivers using **SHAP (SHapley Additive exPlanations)** feature attribution.
* It features a **"What-If" Life-Saving Simulator**, allowing doctors and patients to adjust blood pressure or cholesterol and watch the 3D heart dynamically cool from red to green in real time.

---

## 🌟 Key Innovations & Features

* **Anatomical 3D Digital Twin (React Three Fiber & Three.js):** 360-degree rotation, pinch-to-zoom, pan, and individual coronary vessel inspection with custom GLSL/emissive glowing pulse shaders.
* **Multi-Vessel Calibrated AI:** 4 distinct machine learning classifiers predicting overall CAD, LAD, LCX, and RCA stenosis with sub-25ms inference speed.
* **SHAP Explainability Engine:** Eliminates "black box" AI by decomposing each vessel's risk into tangible clinical drivers (e.g. ST-elevation, echo wall motion abnormalities, LDL cholesterol).
* **Live "What-If" Clinical Simulator:** Real-time parameter tweaking with immediate dynamic 3D color shifts, proving the value of preventive lifestyle changes and medical therapy.
* **Smart Document Extraction Ready:** Capable of mapping values from standard hospital blood work, ECG findings, and echo ultrasound reports.
* **Supabase Cloud Synchronization:** Full persistence for patient history, diagnostic checkups, simulation treatment plans, and audit logs.
* **Printable Clinical Summary PDF:** 1-click generation of hospital-ready diagnostic summaries with clinical safety disclaimers.

---

## 👥 Dual Persona Architecture (Doctor vs. Patient)

CardioVision 3D features a unified workspace with an instant **1-Click Persona Switcher** (`[Doctor View] | [Patient View]`):

| Feature / Dimension | 🩺 Doctor View (Clinical Decision Support) | 👤 Patient View (My Digital Heart Twin) |
| :--- | :--- | :--- |
| **Primary Mission** | Diagnostic risk confirmation & catheterization triaging. | Health empowerment, anxiety reduction & medication adherence. |
| **Language & Terminology** | Medical: *LAD Stenosis (85%), ST-Elevation, Echo RWMA, NYHA Class*. | Plain English: *Front Main Artery (High Alert ⚠️), irregular rhythm*. |
| **Data Scope & Access** | Full multi-patient hospital queue (303 records) + new intake form. | Private single-user view strictly focused on *My Heart*. |
| **AI Explanation (SHAP)** | Technical feature attribution waterfall plots (log-odds contributions). | *"Top 3 Things Affecting My Heart"* actionable bullet breakdown. |
| **"What-If" Framing** | Clinical drug simulation (ACE Inhibitors, High-Intensity Statins). | Daily lifestyle habits (30-min brisk walk, low-salt diet, daily pill). |
| **Export Output** | Official Cardiology Clinical Summary PDF with doctor signature line. | *"My Heart Health Passport"* take-home action guide. |

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (User Interface)                       │
│  • React 18 + Vite                                                     │
│  • React Three Fiber (R3F) & Three.js (3D Heart Mesh, Shaders, Glow)   │
│  • Lucide Icons & Tailwind / Modern Glassmorphism CSS                  │
│  • Supabase JavaScript Client (Instant Cloud Sync & Auth)              │
└───────────────────▲────────────────────────────────▲───────────────────┘
                    │                                │
             REST / JSON API                 Direct Database SDK
                    │                                │
┌───────────────────▼──────────────────┐   ┌─────────▼───────────────────┐
│     AI INFERENCE & SHAP ENGINE       │   │      SUPABASE CLOUD         │
│          (Python / FastAPI)          │   │      (PostgreSQL)           │
│  • Preprocessing & Encoders          │   │  • Table: patients          │
│  • 4x Trained XGBoost/LightGBM       │   │  • Table: diagnostic_runs   │
│  • SHAP TreeExplainer Cache          │   │  • Table: treatment_plans   │
│  • Anti-Leakage Pipeline Enforcer    │   │  • Storage: PDF Reports     │
└──────────────────────────────────────┘   └─────────────────────────────┘
```

---

## 📊 Dataset & Anti-Leakage Compliance

### Primary Dataset
The predictive models are trained on the **Extension of Z-Alizadeh Sani Dataset** from the official **UCI Machine Learning Repository** (Dataset ID: 411).
* **Records:** 303 verified clinical patients.
* **Attributes:** 59 total columns (55 physiological biomarkers + 4 target labels).
* **Missing Values:** Exactly 0 (complete hospital dataset).

### Target Variables
1. `Cath`: Binary ground-truth for Coronary Artery Disease (CAD: 216, Normal: 87).
2. `LAD`: Stenosis status of Left Anterior Descending artery (Stenotic: 177, Normal: 126).
3. `LCX`: Stenosis status of Left Circumflex artery (Stenotic: 119, Normal: 184).
4. `RCA`: Stenosis status of Right Coronary Artery (Stenotic: 114, Normal: 189).

### 🛡️ Strict Anti-Leakage Rule (Hackathon Rule 1d)
To ensure absolute scientific validity and prevent data leakage:
* `Cath`, `LAD`, `LCX`, and `RCA` are **strictly excluded** from all model input feature sets.
* Models rely exclusively on non-invasive biomarkers (Demographics, Symptoms, ECG, Blood Labs, and Echocardiography).

---

## ⚙️ Prerequisites & Dependencies

### Hardware Requirements
* **Standard Modern Web Browser:** Chrome, Edge, Safari, or Firefox with WebGL support.
* **No dedicated GPU required:** 3D rendering and ML inference are optimized for consumer laptops.

### Software Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher
* **Python:** v3.10 to v3.14
* **Git:** Latest version

---

## 🚀 Quick Start & Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Shivansh1824/CardioVision-3D.git
cd CardioVision-3D
```

### 2. Set Up & Run the Backend ML Engine
```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS / Linux:
source venv/bin/activate
# On Windows:
# .\venv\Scripts\activate

# Install required dependencies
pip install -r requirements.txt

# Run the FastAPI server
python -m uvicorn main:app --reload --port 8000
```
* Backend API will be live at: `http://localhost:8000`
* Interactive API Documentation (Swagger): `http://localhost:8000/docs`

### 3. Set Up & Run the Frontend 3D Application
```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install frontend dependencies
npm install

# Start development dev server
npm run dev
```
* Open your browser and navigate to: `http://localhost:5173`

---

## 📈 Evaluation & Performance Metrics

Models are evaluated using 5-fold cross-validation adhering to the hackathon evaluation rubrics:
* **Metrics Tracked:** ROC-AUC, Accuracy, Precision, Recall, and F1-Score.
* **Interpretability:** Evaluated using SHAP TreeExplainer consistency and local feature attribution fidelity.
* **Latency:** End-to-end inference and SHAP generation completed in under 30 milliseconds.

---

## ⚠️ Clinical Safety Disclaimer

> **IMPORTANT MEDICAL NOTICE:**  
> CardioVision 3D is an artificial intelligence-driven research and clinical decision support prototype developed for educational and screening assistance during the Multimodal AI Hackathon 2026. Predictions and 3D visual risk mappings generated by this software do **NOT** constitute definitive medical diagnoses, prescriptions, or clinical guarantees. This system is **not** a substitute for formal clinical diagnostic imaging (such as coronary angiography or CT coronary angiogram) or direct consultation with a qualified board-certified cardiologist. Always seek the advice of a physician regarding any medical condition.

---

## 📁 Project Directory Layout

```
Multimodal-AI-Hackathon-CardioVision-3D/
├── data/
│   └── raw/
│       └── extention of Z-Alizadeh sani dataset.xlsx   # Official UCI 303-patient dataset
├── docs/
│   ├── track_a_requirements.txt                       # Official challenge requirements
│   ├── submission_guidelines.txt                      # Submission specifications
│   └── profile_comparison_reference.html              # Interactive HTML specification
├── backend/
│   ├── app/
│   │   ├── models/                                    # Trained model weights (.pkl / .json)
│   │   ├── pipelines/                                 # Feature encoding & anti-leakage logic
│   │   ├── routes/                                    # Prediction & SHAP API endpoints
│   │   └── main.py                                    # FastAPI application entry point
│   ├── requirements.txt                               # Python dependencies
│   └── train.py                                       # Reproducible model training script
├── frontend/
│   ├── src/
│   │   ├── components/                                # 3D Heart, Dashboard, What-If Slider
│   │   ├── lib/                                       # Supabase client & API services
│   │   └── App.jsx                                    # Main application layout
│   ├── package.json                                   # Frontend dependencies
│   └── vite.config.js                                 # Vite configuration
├── profile_comparison.html                            # Interactive Doctor vs Patient spec
├── ai-context.md                                      # AI coding context & guidelines
└── README.md                                          # Master project documentation
```

---

## 🎥 Demo Video & Submission Links

* **Live Demo Video (YouTube):** *[Link to 3–10 minute demonstration video]*
* **Devpost Project Page:** *[Link to Devpost submission]*
* **Public GitHub Repository:** [https://github.com/Shivansh1824/CardioVision-3D](https://github.com/Shivansh1824/CardioVision-3D)
* **Organizers:** KamandPrompt (Programming Club of IIT Mandi) in collaboration with Augli.ai, PurpleRain Tech, and LDV Labs.

---

*CardioVision 3D • Multimodal AI Hackathon 2026 (Track A) • Developed with precision and care.*
