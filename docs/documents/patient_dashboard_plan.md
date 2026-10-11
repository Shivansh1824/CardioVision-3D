# CardioVision 3D — Patient Companion Plan ("My Digital Heart Twin")
**Focus: Pure Heart Health, Interactive 3D Anatomy & Grounded AI Companion**  
*Multimodal AI Hackathon 2026 (Track A: Cardiovascular Risk)*

---

## 1. Executive Vision: A Calm, Empowering Experience

The Patient Dashboard has one single mission: **to help a person understand their own heart without medical confusion or panic, and empower them to heal.**

### Core Philosophy:
* **Strictly Focused on the Heart:** Zero hospital administrative clutter. The entire experience is centered around the patient's **3D Heart Twin** and their personal **HeartTwin AI Companion**.
* **Zero Medical Jargon:** No terrifying acronyms like *"LAD Occlusion"*, *"STEMI"*, or *"Log-Odds"*. Everything is explained in warm, everyday conversational English.
* **Psychological Safety (No Threatening Alerts):** Constructive, calming guidance: **"Area Needing Gentle Care 💛"** and **"High Potential for Recovery"**.
* **Total Privacy:** The patient can **only see their own data**. Zero access to other patients' records or raw hospital logs.

---

## 2. The 4 Core Pillars of the Patient Dashboard

The entire patient workspace consists of just **4 essential, streamlined components**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE 4 PATIENT PILLARS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  🫀 PILLAR 1: My 3D Heart Twin                                              │
│  • Interactive 3D WebGL centerpiece with gentle 72 BPM resting pulse.       │
│  • Warm, soothing color indicators (Green = Patent, Amber = Gentle Care).   │
│  • 1-Click touch controls: [ Front Artery ] [ Side Artery ] [ Right Artery ].│
│                                                                             │
│  🤖 PILLAR 2: HeartTwin AI Companion (Grounded Chatbot)                     │
│  • Powered by Gemini with Google Search Grounding & patient data grounding. │
│  • Answers the 4 Big Questions in natural, conversational English:          │
│    - What is affecting my heart?                                            │
│    - What part is affected?                                                 │
│    - Why is it affected?                                                    │
│    - How can I improve it?                                                  │
│  • Dynamically generates personalized questions for their next doctor visit.│
│  • Full chat history persistence (saved in Supabase).                       │
│                                                                             │
│  📄 PILLAR 3: Medical Reports Vault                                         │
│  • Clean list of uploaded diagnostic files (Lipid Panel, 12-lead ECG, Echo).│
│  • 1-Click button: "[ + Upload New Lab / ECG Report ]"                      │
│                                                                             │
│  📈 PILLAR 4: Recovery Tracker & Chartboard                                 │
│  • Visual trend charts: Blood Pressure progress, LDL cholesterol drop.      │
│  • Past vs. Current report side-by-side comparison.                         │
│  • Positive milestone badges ("Heart Strain Down 28%! 🎉").                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. The Grounded AI Companion (Chatbot Deep Dive)

### How It Operates:
1. **Patient Data Grounding:** When the patient asks a question, the companion reads the values from their latest uploaded lab and ECG reports (e.g., BP 142/90, LDL 162 mg/dL).
2. **Web Grounding (Gemini with Google Search Grounding):** When the patient asks about diet, exercises, or prescribed medications, the AI uses search grounding to provide accurate, verified, evidence-based recommendations.
3. **Conversational Memory:** Chat sessions are saved in Supabase so the patient can refer back to past guidance at any time.

### Example Interaction:
> **Patient:** *"Why does the front artery of my 3D heart look amber?"*  
> **HeartTwin AI:** *"Looking at your recent lab report from October 8th, your LDL cholesterol was 162 mg/dL and your blood pressure was running around 142/90 mmHg.  
> When cholesterol runs slightly high, it creates a bit of friction in the front main artery (LAD). The great news is that this is in the early stages! Walking 30 minutes daily and taking your prescribed cholesterol pill will help smooth out the vessel walls and keep blood flowing freely.  
> Would you like me to prepare 3 questions you can ask your doctor about this?"*

---

## 4. The Recovery Tracker & Chartboard (Report Comparison)

The chartboard gives the patient visual, tangible proof that their lifestyle habits are working:

```
┌─────────────────────────────────────────────────────────────────────────┐
│              📊 MY HEART RECOVERY PROGRESS (Report Comparison)          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   [ Past Report: 3 Months Ago ]      VS      [ Current Report: Today ]  │
│   • Blood Pressure: 155/95 mmHg              • Blood Pressure: 132/85   │
│   • LDL Cholesterol: 168 mg/dL               • LDL Cholesterol: 112     │
│   • Heart Strain: Elevated                   • Heart Strain: Down 28%!  │
│                                                                         │
│   🎉 GREAT PROGRESS!                                                    │
│   Your daily walks and medication are actively helping your heart heal. │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. First-Time vs. Returning Patient Flow

* **First-Time Sign In:**
  * Greeting: *"Welcome, [Patient Name] 👋"*
  * Welcoming starter card: `[ 📄 Upload My Lab / ECG Report ]` or `[ ⚡ Explore Sample Heart Twin ]`
  * Instant 1-second preview for hackathon judges via the Sample Twin option.
* **Returning Patient:**
  * Greeting: *"Welcome back, [Patient Name] 👋"*
  * Immediately opens to their saved 3D heart, latest recovery progress, and previous AI chat history.
