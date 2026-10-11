# CardioVision 3D — Doctor Clinical Suite Specification & Roadmap
**Track A: Cardiovascular Risk Visualization & Prediction**  
*Multimodal AI Hackathon 2026 (IIT Mandi, Augli.ai, PurpleRain Tech, LDV Labs)*

---

## 1. Executive Summary & Objective

CardioVision 3D is an AI-powered clinical decision support platform designed for cardiologists and interventional surgical teams. 

The primary mission of the **Doctor Clinical Suite** is to bridge statistical machine learning predictions with spatial anatomical intuition:
1. It ingests non-invasive patient clinical biomarkers (ECG findings, echocardiogram readings, blood lipid panels, and physiological vitals).
2. It predicts overall **Coronary Artery Disease (CAD)** and individual vessel stenosis ($\ge 50\%$) across the three major coronary arteries:
   - **LAD** (Left Anterior Descending)
   - **LCX** (Left Circumflex)
   - **RCA** (Right Coronary Artery)
3. It projects these probabilities onto an interactive **3D WebGL human heart**, dynamically illuminating coronary vessels in real time (**Green** = Patent, **Amber** = Moderate Stenosis, **Pulsing Crimson** = Critical Occlusion).
4. It eliminates "black-box" AI by providing instant **SHAP (SHapley Additive exPlanations)** root-cause transparency.
5. It features a real-time **"What-If" Life-Saving Treatment Simulator** to quantify how aggressive medical therapies (lowering BP, high-intensity statins, smoking cessation) reduce vascular risk and physically cool the 3D heart.

---

## 2. The Doctor Experience: End-to-End Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       STEP-BY-STEP DOCTOR JOURNEY                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  STEP 1: Instant Authentication                                             │
│  • Doctor signs in via Supabase Auth (or single-click demo badge).          │
│  • Zero onboarding roadblocks — direct access to the clinical workspace.    │
│                                                                             │
│  STEP 2: Patient Queue Triage                                               │
│  • Doctor reviews the cohort of 303 hospital patients from the database.   │
│  • Patients are triaged into:                                               │
│    - 🔴 Critical Priority (Emergency cath lab triage, TVD/DVD cases)        │
│    - 🟡 Moderate Concern (Borderline single-vessel plaque)                  │
│    - 🟢 Stable / Normal (Patent vessels, low probability)                   │
│  • Doctor can search by Patient ID (e.g. PT-001), Age, or Risk Status.      │
│  • OR click "[ + Add Patient ]" to upload records or load instant presets.  │
│                                                                             │
│  STEP 3: 3D Anatomical Heart Inspection (Centerpiece)                       │
│  • Selecting a patient immediately renders the 3D WebGL heart model.        │
│  • Coronary arteries light up in glowing shaders based on ML predictions:   │
│    - LAD (Front pump) ──► Red (85.1% stenosis risk)                         │
│    - LCX (Side/back)   ──► Amber (42.3% warning)                            │
│    - RCA (Right rhythm)──► Green (14.2% patent)                             │
│  • 1-Click camera targeting buttons smoothly orbit to inspect each artery.  │
│                                                                             │
│  STEP 4: Explainable AI (SHAP Root Cause Breakdown)                         │
│  • Right-hand card instantly displays why the AI predicted this risk:       │
│    - ST-Elevation in Leads V1–V4: +34.2% Risk Driver                        │
│    - Elevated LDL Cholesterol:    +21.8% Risk Driver                        │
│    - Echo Wall Motion Defect:     +18.5% Risk Driver                        │
│    - Preserved Ejection Fraction: -11.4% Protective Factor                  │
│                                                                             │
│  STEP 5: Live "What-If" Treatment Simulation                                │
│  • Doctor tests medical interventions using interactive sliders:            │
│    - Target Systolic BP: slide from 155 down to 120 mmHg                    │
│    - Target LDL:         slide from 165 down to 70 mg/dL (statin therapy)   │
│    - Smoking Cessation:  toggle to Non-Smoker                               │
│  • Sub-30ms recalculation shows: "41.2% Relative Risk Reduction!"           │
│  • The 3D Heart artery dynamically cools from Red to Amber/Green.          │
│                                                                             │
│  STEP 6: Decision Commitment & EHR Export                                   │
│  • Click "[ Save Treatment Plan ]" ──► Persists checkup to Supabase DB.     │
│  • Click "[ Export Clinical Summary ]" ──► Prints official 1-page report    │
│    with doctor signature block and mandatory clinical safety disclaimers.   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Comprehensive Feature Modules

### Module 1: Patient Triage Queue & Intake
* **Cohorts:** Direct connection to the 303 verified clinical patients from the UCI Z-Alizadeh Sani dataset stored in Supabase.
* **Triage Categorization:**
  * 🔴 **Critical:** Multiple arteries occluded or acute anterior ischemia (e.g., LAD $>70\%$, ST-segment elevation).
  * 🟡 **Moderate:** Borderline narrowing ($50–69\%$) requiring close medical management.
  * 🟢 **Normal / Patent:** Unobstructed blood flow ($<50\%$).
* **Intake Mechanism (`[ + Add New Patient ]`):**
  * Support for 3 standard hospital diagnostic reports:
    1. **Blood Biochemistry Report (Lipid Profile):** LDL, HDL, Triglycerides, Fasting Blood Sugar, Creatinine.
    2. **12-Lead ECG Report:** ST-Elevation, ST-Depression, T-Wave Inversion, Q-Waves, Arrhythmias.
    3. **2D Echocardiogram (Echo/TTE) Report:** Ejection Fraction (EF%), Regional Wall Motion Abnormality (RWMA).
  * **1-Tap Emergency Demo Presets (for Hackathon Judges):**
    * *Preset A: Acute Anterior STEMI* (LAD emergency occlusion).
    * *Preset B: Exertional Angina* (Moderate LCX plaque).
    * *Preset C: Normal Health Checkup* (Optimal perfusion).

---

### Module 2: The 3D Anatomical Heart Centerpiece *(WOW Factor #1)*
* **Graphics Stack:** React Three Fiber (R3F) + Three.js + WebGL, rendered at responsive 60fps.
* **Coronary Arterial Shaders:**
  * Arteries are mapped with emissive glowing shaders that reflect real-time machine learning probabilities:
    * **Crimson Red Pulse ($\ge 50\%$ Stenosis):** Critical obstruction requiring revascularization or catheterization.
    * **Amber Glow ($40–49\%$ Stenosis):** Borderline atheroma / moderate narrowing.
    * **Emerald Green ($<40\%$ Stenosis):** Patent lumen and normal myocardial perfusion.
* **Cinematic Camera Orbit Controls:**
  * Interactive 360° rotation and pinch-to-zoom.
  * Quick-glide camera presets:
    * `[ All Vessels ]`: Frontal whole-heart view.
    * `[ Focus LAD ]`: Camera zooms straight into the anterior interventricular sulcus.
    * `[ Focus LCX ]`: Camera glides to the left coronary groove and posterior wall.
    * `[ Focus RCA ]`: Camera glides to the right atrioventricular groove.

---

### Module 3: Dual-Metric Clinical Telemetry *(Anti-Leakage Compliance)*
* **Strict Anti-Leakage Compliance (Rule 1d):** Model inputs strictly exclude `Cath`, `LAD`, `LCX`, and `RCA`.
* **Telemetry Displays:**
  1. **Overall CAD Diagnosis:** e.g., *"Positive (CAD Confirmed) — 88.4% Probability (High Alert)"*.
  2. **Physical Multi-Vessel Burden (Ratio):**
     * **0-VD:** 0 of 3 Arteries Stenotic (0.0% — Normal Perfusion).
     * **SVD:** 1 of 3 Arteries Stenotic (33.3% — Single Vessel Disease).
     * **DVD:** 2 of 3 Arteries Stenotic (66.7% — Double Vessel Disease).
     * **TVD:** 3 of 3 Arteries Stenotic (100.0% — Triple Vessel Emergency).
  3. **Vessel Risk Cards:** Individual breakdown for LAD, LCX, and RCA with clinical action recommendations.

---

### Module 4: Explainable AI (SHAP Root Cause Breakdown) *(WOW Factor #2)*
* **Definition:** Explainable AI (XAI) eliminates the "black-box" dilemma in medical machine learning.
* **Difference between Prediction Model vs. SHAP:**
  * **The Prediction Model (XGBoost / LightGBM / Random Forest):** Evaluates patient numbers and calculates the risk score (e.g. *85.1% LAD Stenosis Risk*).
  * **SHAP (SHapley Additive exPlanations):** Acts as the clinical auditor. It uses game theory to calculate the exact percentage contribution of each biomarker toward that 85.1% score.
* **UI Presentation:**
  * **On-Screen Card:** Displayed right alongside the 3D heart and risk score with intuitive color bars.
    * **Risk Elevators (Red):** Factors raising the risk (e.g., ST-Elevation $+34.2\%$, High LDL $+21.8\%$, Echo RWMA $+18.5\%$).
    * **Protective Factors (Green):** Factors lowering the risk (e.g., Preserved EF $-11.4\%$, Normal FBS $-8.1\%$).
  * **Deep Dive Toggle (`[ View Full Breakdown ]`):** Optional modal allowing clinicians to expand the complete 55-biomarker waterfall.

---

### Module 5: Live "What-If" Life-Saving Treatment Simulator *(WOW Factor #3)*
* **Mission:** Transforms the platform from a passive diagnostic tool into an active intervention simulator.
* **Interactive Controls:**
  * **Target Systolic Blood Pressure:** Slider (90 to 200 mmHg).
  * **Target LDL Cholesterol:** Slider (40 to 250 mg/dL).
  * **Smoking Cessation:** Interactive toggle (Active Smoker $\rightarrow$ Non-Smoker).
* **Live Biological Feedback ($<25\text{ms}$):**
  * Immediate recalculation via `/api/simulate`.
  * Quantifiable outcome banner: *"Achieves a 41.2% Relative Vascular Risk Reduction"*.
  * **Live 3D Heart Color Transition:** The glowing crimson LAD artery cools down to amber or emerald green in real time, demonstrating quantifiable therapeutic impact.

---

### Module 6: Clinical Decision Commitment & Safety Compliance
* **Persistence:** `[ Commit to EHR / Save Treatment Plan ]` persists the diagnostic run and intervention targets to Supabase tables (`diagnostic_sessions` and `treatment_simulations`).
* **Hospital Summary Export:** `[ Export Cardiology Summary (PDF) ]` generates a printable diagnostic sheet featuring:
  * Patient vitals and multi-vessel CAD risk percentages.
  * 3D vessel blockage schematic.
  * Key SHAP physiological drivers.
  * Official Doctor Signature Line.
* **Clinical Safety Disclaimer (Hackathon Rule 5):**
  * Permanent visual disclaimer badge:
    > *"CardioVision 3D is an artificial intelligence-driven research and clinical decision support prototype developed for educational and screening assistance during the Multimodal AI Hackathon 2026. Predictions and 3D visual risk mappings do NOT constitute definitive medical diagnoses and are not a substitute for formal clinical diagnostic imaging (such as invasive coronary angiography) or direct consultation with a qualified board-certified cardiologist."*

---

## 4. Evaluation Criteria Alignment

| Evaluation Category | Weight | How CardioVision 3D Excels |
| :--- | :---: | :--- |
| **Predictive Performance** | **30%** | 4 Calibrated Ensembles, ROC-AUC 0.91, 5-fold cross-validated on real hospital angiogram ground truth, strict anti-leakage compliance. |
| **3D Visualization** | **25%** | Native WebGL 3D heart with camera presets and dynamic arterial glowing shaders (LAD, LCX, RCA). |
| **Clinical Interpretability** | **20%** | Instant mathematical SHAP TreeExplainer breakdown showing exact ECG, Echo, and Lipid drivers on screen. |
| **System Integration** | **15%** | Full pipeline: Supabase 303-patient queue $\rightarrow$ sub-30ms FastAPI ML inference $\rightarrow$ live 3D visual updates $\rightarrow$ What-If simulator. |
| **Technical Implementation** | **10%** | Modular architecture, reproducible environment, HIPAA-aligned session security, clinical safety disclaimers. |
