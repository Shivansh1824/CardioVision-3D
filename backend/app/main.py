import os
import time
import json
import joblib
import numpy as np
import pandas as pd
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Initialize FastAPI App
app = FastAPI(
    title="CardioVision 3D — Dual-Metric Multi-Vessel ML Service",
    description="Deterministic, Zero-Hallucination Machine Learning & SHAP Decision Support Engine for CAD, LAD, LCX, RCA",
    version="2.0.0"
)

# Enable CORS for Frontend & Local Dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Load Trained Models and Dynamic Artifacts
models_dir = os.path.join(os.path.dirname(__file__), "models")

try:
    preprocessor = joblib.load(os.path.join(models_dir, "preprocessor.joblib"))
    model_cad = joblib.load(os.path.join(models_dir, "model_cad.joblib"))
    model_lad = joblib.load(os.path.join(models_dir, "model_lad.joblib"))
    model_lcx = joblib.load(os.path.join(models_dir, "model_lcx.joblib"))
    model_rca = joblib.load(os.path.join(models_dir, "model_rca.joblib"))
    
    shap_cad = joblib.load(os.path.join(models_dir, "shap_explainer_cad.joblib"))
    shap_lad = joblib.load(os.path.join(models_dir, "shap_explainer_lad.joblib"))
    shap_lcx = joblib.load(os.path.join(models_dir, "shap_explainer_lcx.joblib"))
    shap_rca = joblib.load(os.path.join(models_dir, "shap_explainer_rca.joblib"))
    
    with open(os.path.join(models_dir, "metrics_summary.json"), "r") as f:
        metrics_summary = json.load(f)
        
    feature_names = preprocessor["feature_names"]
    feature_meta = preprocessor["feature_meta"]
    baseline_profile = preprocessor["baseline_profile"]
    scaler = preprocessor["scaler"]
    optimal_thresholds = preprocessor["optimal_thresholds"]
    multi_vessel_stages = preprocessor.get("multi_vessel_stages", {})
    total_feature_count = len(feature_names)
    print(f"✓ All 4 Calibrated Ensembles, SHAP Explainers, and {total_feature_count} dynamic features loaded.")
except Exception as e:
    raise RuntimeError(f"Failed to load ML artifacts from {models_dir}: {e}")

# Mapping for binary categorical columns
binary_map = {
    'y': 1.0, 'yes': 1.0, 'n': 0.0, 'no': 0.0,
    'male': 1.0, 'fmale': 0.0, 'female': 0.0,
    'positive': 1.0, 'negative': 0.0, 'present': 1.0, 'absent': 0.0
}

# Input Schema for Patient Biomarkers
class PatientVitalsInput(BaseModel):
    patient_id: Optional[str] = "Anonymous"
    age: Optional[float] = None
    sex: Optional[str] = None
    bp: Optional[float] = Field(None, description="Blood Pressure (Systolic, mmHg)")
    pr: Optional[float] = Field(None, description="Pulse Rate (bpm)")
    bmi: Optional[float] = None
    weight: Optional[float] = None
    length: Optional[float] = None
    fbs: Optional[float] = Field(None, description="Fasting Blood Sugar (mg/dL)")
    cr: Optional[float] = Field(None, description="Creatinine (mg/dL)")
    tg: Optional[float] = Field(None, description="Triglycerides (mg/dL)")
    ldl: Optional[float] = Field(None, description="LDL Cholesterol (mg/dL)")
    hdl: Optional[float] = Field(None, description="HDL Cholesterol (mg/dL)")
    bun: Optional[float] = None
    esr: Optional[float] = None
    hb: Optional[float] = None
    k: Optional[float] = None
    na: Optional[float] = None
    wbc: Optional[float] = None
    lymph: Optional[float] = None
    neut: Optional[float] = None
    plt: Optional[float] = None
    ef_tte: Optional[float] = Field(None, description="Ejection Fraction (%)")
    dm: Optional[float] = Field(None, description="Diabetes Mellitus (1/0)")
    htn: Optional[float] = Field(None, description="Hypertension (1/0)")
    current_smoker: Optional[float] = None
    ex_smoker: Optional[float] = None
    fh: Optional[float] = Field(None, description="Family History of CAD (1/0)")
    obesity: Optional[float] = None
    crf: Optional[float] = None
    cva: Optional[float] = None
    airway_disease: Optional[float] = None
    thyroid_disease: Optional[float] = None
    chf: Optional[float] = None
    dlp: Optional[float] = None
    edema: Optional[float] = None
    weak_peripheral_pulse: Optional[float] = None
    lung_rales: Optional[float] = None
    systolic_murmur: Optional[float] = None
    diastolic_murmur: Optional[float] = None
    typical_chest_pain: Optional[float] = None
    dyspnea: Optional[float] = None
    function_class: Optional[float] = None
    atypical: Optional[float] = None
    nonanginal: Optional[float] = None
    exertional_cp: Optional[float] = None
    lowth_ang: Optional[float] = None
    q_wave: Optional[float] = None
    st_elevation: Optional[float] = None
    st_depression: Optional[float] = None
    tinversion: Optional[float] = None
    lvh: Optional[float] = None
    poor_r_progression: Optional[float] = None
    region_rwma: Optional[float] = None
    bbb: Optional[str] = None
    vhd: Optional[str] = None
    additional_biomarkers: Optional[Dict[str, Any]] = None

class SimulationInput(BaseModel):
    patient_data: PatientVitalsInput
    target_bp: Optional[float] = None
    target_ldl: Optional[float] = None
    smoker_intervention: Optional[bool] = False

# Helper: Feature Preprocessing & Confidence-Aware Imputation
def prepare_feature_vector(patient: PatientVitalsInput):
    p_dict = patient.model_dump()
    raw_user_inputs = {}
    
    for k, v in p_dict.items():
        if k in ["patient_id", "additional_biomarkers"]:
            continue
        if v is not None:
            raw_user_inputs[k.lower()] = v
            
    if patient.additional_biomarkers:
        for k, v in patient.additional_biomarkers.items():
            if v is not None:
                raw_user_inputs[k.lower()] = v
                
    full_row = baseline_profile.copy()
    filled_count = 0
    
    for k, v in raw_user_inputs.items():
        matched_key = None
        for fn in feature_names:
            if fn.lower() == k.lower():
                matched_key = fn
                break
                
        if matched_key:
            filled_count += 1
            if isinstance(v, str):
                v_clean = v.strip().lower()
                full_row[matched_key] = binary_map.get(v_clean, 0.0)
            else:
                full_row[matched_key] = float(v)
                
    # Detect report type dynamically
    lipid_markers = {'ldl', 'hdl', 'tg', 'cholesterol'}
    user_keys = set(raw_user_inputs.keys())
    is_lipid_only = user_keys.issubset(lipid_markers.union({'age', 'sex', 'bp'})) and len(user_keys.intersection(lipid_markers)) > 0
    
    # Calculate Data Confidence dynamically from total available features
    completeness_pct = round(min(100.0, (filled_count / float(total_feature_count)) * 100.0), 1)
    
    df_single = pd.DataFrame([full_row])[feature_names]
    scaled_array = scaler.transform(df_single)
    df_scaled = pd.DataFrame(scaled_array, columns=feature_names)
    
    tier = "Full Clinical Diagnostic" if completeness_pct >= 80.0 else ("Preliminary Screening" if not is_lipid_only else "Lipid Profile Screening Only")
    
    return df_single, df_scaled, completeness_pct, filled_count, is_lipid_only, tier

# Helper: Deterministic SHAP Root Cause Extraction
def extract_shap_explanation(explainer, df_scaled, df_raw, top_k=5):
    shap_res = explainer(df_scaled)
    vals = shap_res.values[0]
    
    top_indices = np.argsort(np.abs(vals))[::-1][:top_k]
    factors = []
    
    for idx in top_indices:
        fname = feature_names[idx]
        raw_val = float(df_raw[fname].iloc[0])
        impact = float(vals[idx])
        
        friendly_desc = fname.replace("_", " ").title()
        direction = "Elevates Risk" if impact > 0 else "Protective / Lowers Risk"
            
        factors.append({
            "feature": fname,
            "display_name": friendly_desc,
            "raw_value": round(raw_val, 2),
            "shap_impact": round(impact, 4),
            "direction": direction,
            "percentage_weight": round(abs(impact) * 100.0, 1)
        })
        
    return factors

# Helper: Dynamic vessel color coding based on learned optimal threshold
def get_vessel_color(prob: float, threshold: float) -> str:
    if prob >= threshold:
        return "crimson"
    elif prob >= (threshold * 0.75):
        return "amber"
    return "emerald"

# API Endpoints
@app.get("/")
def root():
    return {
        "service": "CardioVision 3D ML Decision Support Service",
        "competition": "Multimodal AI Hackathon 2026 (Track A: Cardiovascular Risk)",
        "features": [
            "Dual-Metric Transparency (Physical Artery Ratio + Clinical Probability)",
            "Confidence-Aware Progressive Scoring",
            "Zero Hallucination Deterministic Ensembles",
            "SHAP Root-Cause Explanations",
            "Real-Time What-If Lifestyle Simulator"
        ],
        "status": "online"
    }

@app.get("/api/metrics")
def get_metrics():
    return {
        "status": "success",
        "validation_method": "5-Fold Stratified Cross-Validation",
        "dataset": "UCI Extension of Z-Alizadeh Sani Dataset (303 hospital patients, 59 biomarkers)",
        "anti_leakage_enforced": True,
        "metrics": metrics_summary,
        "optimal_thresholds": optimal_thresholds,
        "multi_vessel_stages": multi_vessel_stages
    }

@app.post("/api/predict")
def predict_cardiac_risk(patient: PatientVitalsInput):
    t0 = time.time()
    
    # 1. Preprocess with confidence-aware imputation
    df_raw, df_scaled, completeness_pct, filled_count, is_lipid_only, tier = prepare_feature_vector(patient)
    
    # 2. Deterministic ML Inference
    p_cad_raw = float(model_cad.predict_proba(df_scaled)[0, 1])
    p_lad = float(model_lad.predict_proba(df_scaled)[0, 1])
    p_lcx = float(model_lcx.predict_proba(df_scaled)[0, 1])
    p_rca = float(model_rca.predict_proba(df_scaled)[0, 1])
    
    # 3. Biological Consistency Enforcement Rule: P(CAD) >= max(P_LAD, P_LCX, P_RCA)
    max_vessel_risk = max(p_lad, p_lcx, p_rca)
    p_cad = max(p_cad_raw, max_vessel_risk)
    
    # 4. Binary Stenosis Status based on Mathematically Learned Optimal Thresholds
    cad_thresh = optimal_thresholds["cad"]
    lad_thresh = optimal_thresholds["lad"]
    lcx_thresh = optimal_thresholds["lcx"]
    rca_thresh = optimal_thresholds["rca"]
    
    is_lad_blocked = p_lad >= lad_thresh
    is_lcx_blocked = p_lcx >= lcx_thresh
    is_rca_blocked = p_rca >= rca_thresh
    
    # 5. Dual-Metric Proportional Transparency Calculation
    blocked_count = int(is_lad_blocked) + int(is_lcx_blocked) + int(is_rca_blocked)
    total_arteries = 3
    blocked_ratio_pct = round((blocked_count / float(total_arteries)) * 100.0, 1)
    
    stage_info = {
        0: {"stage": "0-VD", "name": "Normal (Zero Vessel Disease)", "severity": "Normal / Optimal", "ratio_desc": "0 of 3 Arteries Stenotic (0.0%)"},
        1: {"stage": "SVD", "name": "Single Vessel Disease (SVD)", "severity": "Moderate Concern", "ratio_desc": "1 of 3 Arteries Stenotic (33.3%)"},
        2: {"stage": "DVD", "name": "Double Vessel Disease (DVD)", "severity": "High Alert", "ratio_desc": "2 of 3 Arteries Stenotic (66.7%)"},
        3: {"stage": "TVD", "name": "Triple Vessel Disease (TVD)", "severity": "Critical Multi-Vessel Emergency", "ratio_desc": "3 of 3 Arteries Stenotic (100.0%)"}
    }[blocked_count]
    
    # 6. Status Labels & Handling Partial Report Edge Cases
    if is_lipid_only:
        lad_status = "Stenosis Suspected (Needs Angio/Echo Confirmation)" if is_lad_blocked else "Low Atherogenic Risk"
        lcx_status = "Needs Further Clinical Testing (ECG / Angio)"
        rca_status = "Needs Further Clinical Testing (ECG / Angio)"
    else:
        lad_status = "Stenotic (Blocked >= 50%)" if is_lad_blocked else "Normal / Patent"
        lcx_status = "Stenotic (Blocked >= 50%)" if is_lcx_blocked else "Normal / Patent"
        rca_status = "Stenotic (Blocked >= 50%)" if is_rca_blocked else "Normal / Patent"
        
    cad_status = "Positive (CAD Confirmed)" if p_cad >= cad_thresh else "Normal / Low CAD Probability"
    
    # 7. Extract SHAP Explanations
    shap_drivers = {
        "cad": extract_shap_explanation(shap_cad, df_scaled, df_raw),
        "lad": extract_shap_explanation(shap_lad, df_scaled, df_raw),
        "lcx": extract_shap_explanation(shap_lcx, df_scaled, df_raw),
        "rca": extract_shap_explanation(shap_rca, df_scaled, df_raw),
    }
    
    elapsed_ms = round((time.time() - t0) * 1000.0, 2)
    
    # 8. High-Level Severity Classification dynamically derived from learned thresholds
    if blocked_count >= 2 or p_cad >= cad_thresh:
        overall_severity = "High Alert"
        color_code = "crimson"
    elif blocked_count == 1 or p_cad >= (cad_thresh * 0.70):
        overall_severity = "Moderate Warning"
        color_code = "amber"
    else:
        overall_severity = "Optimal / Low Risk"
        color_code = "emerald"
        
    return {
        "status": "success",
        "execution_time_ms": elapsed_ms,
        "data_completeness": {
            "confidence_score": completeness_pct,
            "filled_fields": filled_count,
            "total_biomarkers": total_feature_count,
            "tier": tier,
            "is_partial_report": is_lipid_only,
            "notice": "Only partial lipid/vital markers detected. Missing arteries flagged for further clinical testing." if is_lipid_only else "Sufficient biomarkers provided for multi-vessel assessment."
        },
        "dual_metric_evaluation": {
            "physical_artery_blockage": {
                "blocked_count": blocked_count,
                "total_arteries": total_arteries,
                "ratio_display": f"{blocked_count}/{total_arteries} Blocked",
                "percentage": blocked_ratio_pct,
                "stage": stage_info["stage"],
                "stage_name": stage_info["name"],
                "severity": stage_info["severity"],
                "note": "2 of 3 blocked is strictly evaluated as 66.7% (DVD) and never artificially rounded to 100%."
            },
            "clinical_disease_probability": {
                "probability": round(p_cad, 4),
                "percentage": round(p_cad * 100.0, 1),
                "threshold": cad_thresh,
                "status": cad_status,
                "severity": overall_severity,
                "color": color_code
            }
        },
        "artery_vessel_breakdown": {
            "lad_vessel": {
                "name": "Left Anterior Descending (LAD)",
                "probability": round(p_lad, 4),
                "percentage": round(p_lad * 100.0, 1),
                "threshold": lad_thresh,
                "is_stenotic": bool(is_lad_blocked),
                "status": lad_status,
                "color": get_vessel_color(p_lad, lad_thresh)
            },
            "lcx_vessel": {
                "name": "Left Circumflex (LCX)",
                "probability": round(p_lcx, 4),
                "percentage": round(p_lcx * 100.0, 1),
                "threshold": lcx_thresh,
                "is_stenotic": bool(is_lcx_blocked),
                "status": lcx_status,
                "color": get_vessel_color(p_lcx, lcx_thresh)
            },
            "rca_vessel": {
                "name": "Right Coronary Artery (RCA)",
                "probability": round(p_rca, 4),
                "percentage": round(p_rca * 100.0, 1),
                "threshold": rca_thresh,
                "is_stenotic": bool(is_rca_blocked),
                "status": rca_status,
                "color": get_vessel_color(p_rca, rca_thresh)
            }
        },
        "shap_explanations": shap_drivers,
        "disclaimer": "CardioVision 3D clinical decision support prototype. Not a substitute for formal coronary angiography."
    }

@app.post("/api/simulate")
def simulate_what_if_intervention(sim: SimulationInput):
    """
    Life-Saving 'What-If' Lifestyle Simulator:
    Demonstrates quantifiable risk reduction when patient lowers BP, reduces LDL, or stops smoking.
    """
    baseline_res = predict_cardiac_risk(sim.patient_data)
    
    sim_patient = sim.patient_data.model_copy(deep=True)
    if sim.target_bp is not None:
        sim_patient.bp = sim.target_bp
        # If target BP achieves normal baseline BP from population reference, htn flag clears
        if sim.target_bp <= baseline_profile.get("bp", 120.0):
            sim_patient.htn = 0.0
            
    if sim.target_ldl is not None:
        orig_ldl = max(1.0, float(sim.patient_data.ldl or baseline_profile.get("ldl", 130.0)))
        sim_patient.ldl = sim.target_ldl
        # If triglycerides exist, proportionally scale them by LDL improvement factor
        if sim_patient.tg is not None and orig_ldl > 0:
            reduction_ratio = max(0.5, sim.target_ldl / orig_ldl)
            sim_patient.tg = round(sim_patient.tg * reduction_ratio, 1)
            
    if sim.smoker_intervention is True:
        sim_patient.current_smoker = 0.0
        sim_patient.ex_smoker = 1.0
        
    sim_res = predict_cardiac_risk(sim_patient)
    
    base_cad = baseline_res["dual_metric_evaluation"]["clinical_disease_probability"]["probability"]
    sim_cad = sim_res["dual_metric_evaluation"]["clinical_disease_probability"]["probability"]
    cad_reduction_pct = round(max(0.0, (base_cad - sim_cad) / max(0.01, base_cad) * 100.0), 1)
    
    base_lad = baseline_res["artery_vessel_breakdown"]["lad_vessel"]["probability"]
    sim_lad = sim_res["artery_vessel_breakdown"]["lad_vessel"]["probability"]
    lad_reduction_pct = round(max(0.0, (base_lad - sim_lad) / max(0.01, base_lad) * 100.0), 1)

    base_lcx = baseline_res["artery_vessel_breakdown"]["lcx_vessel"]["probability"]
    sim_lcx = sim_res["artery_vessel_breakdown"]["lcx_vessel"]["probability"]
    lcx_reduction_pct = round(max(0.0, (base_lcx - sim_lcx) / max(0.01, base_lcx) * 100.0), 1)

    base_rca = baseline_res["artery_vessel_breakdown"]["rca_vessel"]["probability"]
    sim_rca = sim_res["artery_vessel_breakdown"]["rca_vessel"]["probability"]
    rca_reduction_pct = round(max(0.0, (base_rca - sim_rca) / max(0.01, base_rca) * 100.0), 1)

    composite_risk_drop_pct = round(max(cad_reduction_pct, (lad_reduction_pct + lcx_reduction_pct + rca_reduction_pct) / 3.0), 1)
    
    return {
        "status": "success",
        "interventions_applied": {
            "target_bp": sim.target_bp,
            "target_ldl": sim.target_ldl,
            "smoking_cessation": sim.smoker_intervention
        },
        "baseline_summary": {
            "cad_percentage": round(base_cad * 100.0, 1),
            "arteries_blocked": baseline_res["dual_metric_evaluation"]["physical_artery_blockage"]["ratio_display"]
        },
        "simulated_summary": {
            "cad_percentage": round(sim_cad * 100.0, 1),
            "arteries_blocked": sim_res["dual_metric_evaluation"]["physical_artery_blockage"]["ratio_display"]
        },
        "quantifiable_impact": {
            "cad_risk_drop_percentage": cad_reduction_pct,
            "composite_vascular_risk_drop_percentage": composite_risk_drop_pct,
            "lad_stenosis_risk_drop_percentage": lad_reduction_pct,
            "lcx_stenosis_risk_drop_percentage": lcx_reduction_pct,
            "rca_stenosis_risk_drop_percentage": rca_reduction_pct,
            "clinical_recommendation": f"Achieving these clinical targets delivers a {composite_risk_drop_pct}% relative reduction in vascular stenosis risk."
        }
    }
