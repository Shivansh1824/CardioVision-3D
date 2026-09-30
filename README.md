# CardioVision 3D 🫀
> **Interactive 3D Cardiovascular Risk Visualization & Multi-Vessel Stenosis Prediction with Explainable AI**
> 
> *Developed for the Multimodal AI Hackathon 2026 (IIT Mandi, Augli.ai, PurpleRain Tech, LDV Labs) — Track A*

---

## 🎯 Overview
CardioVision 3D bridges the critical gap between statistical machine learning and clinical intuition. Rather than presenting clinicians and patients with abstract risk percentages, the system:
1. **Predicts Multi-Vessel Stenosis:** Evaluates patient clinical biomarkers across 4 predictive models: overall Coronary Artery Disease (CAD), and vessel-specific stenosis for the **LAD**, **LCX**, and **RCA** arteries.
2. **Projects Risk onto an Interactive 3D Heart:** Color-codes coronary vessels dynamically in real time (Emerald Green = Normal, Amber = Moderate, Crimson Pulse = Stenotic).
3. **Explains the *Why* via SHAP:** Breaks down exactly which physiological factors (e.g. ST Elevation, echo RWMA, LDL) drive each vessel's score.
4. **Enables "What-If" Life-Saving Simulations:** Allows clinicians to simulate lifestyle and medication adjustments (e.g. BP reduction) and observe the 3D heart risk recalibrate live.

---

## 📂 Project Structure
```
Multimodal-AI-Hackathon-CardioVision-3D/
├── data/
│   └── raw/
│       └── extention of Z-Alizadeh sani dataset.xlsx   # UCI 303-patient dataset
├── backend/                                           # Python FastAPI + ML + SHAP service
├── frontend/                                          # React + React Three Fiber 3D app
└── ai-context.md                                      # AI and technical context
```
