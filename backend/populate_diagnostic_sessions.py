import os
import json
import urllib.request
import numpy as np
import pandas as pd
import joblib
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')

# Load trained models & artifacts
models_dir = os.path.join(os.path.dirname(__file__), 'app', 'models')
preprocessor = joblib.load(os.path.join(models_dir, 'preprocessor.joblib'))
model_cad = joblib.load(os.path.join(models_dir, 'model_cad.joblib'))
model_lad = joblib.load(os.path.join(models_dir, 'model_lad.joblib'))
model_lcx = joblib.load(os.path.join(models_dir, 'model_lcx.joblib'))
model_rca = joblib.load(os.path.join(models_dir, 'model_rca.joblib'))
shap_cad = joblib.load(os.path.join(models_dir, 'shap_explainer_cad.joblib'))

feature_names = preprocessor['feature_names']
scaler = preprocessor['scaler']
optimal_thresholds = preprocessor['optimal_thresholds']
baseline_profile = preprocessor['baseline_profile']

print(f"Loaded ML artifacts. {len(feature_names)} features, thresholds: {optimal_thresholds}")

# Load patient names
names_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'data', 'patientNames.json')
with open(names_path, 'r') as f:
    patient_names = json.load(f)

# 1. Fetch all patients from Supabase
print("Fetching 303 patients from Supabase...")
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/patients?select=*&order=id.asc", headers={
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Range': '0-999'
})

with urllib.request.urlopen(req) as resp:
    raw_patients = json.loads(resp.read().decode())

print(f"Retrieved {len(raw_patients)} patient records from Supabase.")

binary_map = {
    'y': 1.0, 'yes': 1.0, 'n': 0.0, 'no': 0.0,
    'male': 1.0, 'fmale': 0.0, 'female': 0.0,
    'positive': 1.0, 'negative': 0.0, 'present': 1.0, 'absent': 0.0
}

authoritative_patients = []
diagnostic_sessions_to_insert = []

for p in raw_patients:
    pid = p['id']
    code = p['patient_code'] or f"PT-{pid:03d}"
    name = patient_names.get(code) or patient_names.get(str(pid)) or f"Patient {code}"

    # Build feature row
    row = baseline_profile.copy()
    for k, v in p.items():
        if v is None:
            continue
        k_clean = k.lower().strip()
        for fn in feature_names:
            if fn.lower() == k_clean:
                if isinstance(v, str):
                    row[fn] = binary_map.get(v.lower().strip(), 0.0)
                else:
                    row[fn] = float(v)
                break

    # Handle one-hot encoded columns (bbb_n, bbb_rbbb, vhd_moderate, vhd_n, vhd_severe)
    bbb_val = str(p.get('bbb', '')).strip().lower()
    if 'bbb_n' in row:
        row['bbb_n'] = 1.0 if bbb_val in ['n', 'no', 'none'] else 0.0
    if 'bbb_rbbb' in row:
        row['bbb_rbbb'] = 1.0 if bbb_val == 'rbbb' else 0.0

    vhd_val = str(p.get('vhd', '')).strip().lower()
    if 'vhd_n' in row:
        row['vhd_n'] = 1.0 if vhd_val in ['n', 'no', 'normal'] else 0.0
    if 'vhd_moderate' in row:
        row['vhd_moderate'] = 1.0 if vhd_val in ['moderate', 'mod'] else 0.0
    if 'vhd_severe' in row:
        row['vhd_severe'] = 1.0 if vhd_val in ['severe', 'sev'] else 0.0

    # Sex encoding
    sex_val = str(p.get('sex', '')).strip().lower()
    if 'sex' in row:
        row['sex'] = 1.0 if sex_val == 'male' else 0.0

    df_single = pd.DataFrame([row])[feature_names]
    scaled = scaler.transform(df_single)
    df_scaled = pd.DataFrame(scaled, columns=feature_names)

    # Deterministic model predictions
    p_cad_raw = float(model_cad.predict_proba(df_scaled)[0, 1])
    p_lad = float(model_lad.predict_proba(df_scaled)[0, 1])
    p_lcx = float(model_lcx.predict_proba(df_scaled)[0, 1])
    p_rca = float(model_rca.predict_proba(df_scaled)[0, 1])

    # Biological consistency: CAD risk >= max vessel probability
    max_vessel = max(p_lad, p_lcx, p_rca)
    p_cad = max(p_cad_raw, max_vessel)

    cad_pct = int(round(p_cad * 100))
    lad_pct = int(round(p_lad * 100))
    lcx_pct = int(round(p_lcx * 100))
    rca_pct = int(round(p_rca * 100))

    # Binary stenosis based on optimal thresholds
    is_lad_blocked = p_lad >= optimal_thresholds['lad']
    is_lcx_blocked = p_lcx >= optimal_thresholds['lcx']
    is_rca_blocked = p_rca >= optimal_thresholds['rca']

    blocked_count = int(is_lad_blocked) + int(is_lcx_blocked) + int(is_rca_blocked)
    vessel_stage = 'TVD' if blocked_count == 3 else ('DVD' if blocked_count == 2 else ('SVD' if blocked_count == 1 else '0-VD'))

    # Ground truth vessel label for display (e.g. 'LAD Severe Stenosis', 'Triple-Vessel CAD')
    if blocked_count == 3:
        vessel_label = 'Triple-Vessel CAD (TVD)'
    elif blocked_count == 2:
        if is_lad_blocked and is_lcx_blocked:
            vessel_label = 'LAD + LCX Bifurcation (DVD)'
        elif is_lad_blocked and is_rca_blocked:
            vessel_label = 'LAD + RCA Occlusion (DVD)'
        else:
            vessel_label = 'LCX + RCA Disease (DVD)'
    elif blocked_count == 1:
        if is_lad_blocked:
            vessel_label = 'LAD Stenosis (≥50%)'
        elif is_lcx_blocked:
            vessel_label = 'LCX Circumflex Stenosis (≥50%)'
        else:
            vessel_label = 'RCA Coronary Stenosis (≥50%)'
    else:
        vessel_label = 'Patent Vessels / No Critical Stenosis'

    # Strict Triage Tiering:
    # Critical: Multivessel disease (TVD/DVD) OR CAD risk >= 75%
    # Moderate: Single vessel disease (SVD) OR CAD risk >= 50%
    # Stable: 0-VD AND CAD risk < 50%
    if blocked_count >= 2 or cad_pct >= 75:
        triage_tier = 'critical'
    elif blocked_count == 1 or cad_pct >= 50:
        triage_tier = 'moderate'
    else:
        triage_tier = 'stable'

    # SHAP explanations (top 5 factors)
    try:
        shap_vals = shap_cad(df_scaled).values[0]
        top_idx = np.argsort(np.abs(shap_vals))[::-1][:5]
        shap_factors = []
        for idx in top_idx:
            fn = feature_names[idx]
            impact = float(shap_vals[idx])
            shap_factors.append({
                'feature': fn,
                'display_name': fn.replace('_', ' ').title(),
                'raw_value': round(float(df_single[fn].iloc[0]), 2),
                'shap_impact': round(impact, 4),
                'direction': 'Elevates Risk' if impact > 0 else 'Protective',
                'percentage_weight': round(abs(impact) * 100.0, 1)
            })
    except Exception as e:
        shap_factors = []

    # Build authoritative object
    merged = {
        **p,
        'id': pid,
        'patient_code': code,
        'name': name,
        'cad_risk_pct': cad_pct,
        'lad_risk_pct': lad_pct,
        'lcx_risk_pct': lcx_pct,
        'rca_risk_pct': rca_pct,
        'is_lad_blocked': is_lad_blocked,
        'is_lcx_blocked': is_lcx_blocked,
        'is_rca_blocked': is_rca_blocked,
        'blocked_count': blocked_count,
        'vessel_stage': vessel_stage,
        'vessel': vessel_label,
        '_triage': triage_tier,
        'shap_factors': shap_factors,
    }
    authoritative_patients.append(merged)

    # Diagnostic session record for Supabase
    diagnostic_sessions_to_insert.append({
        'patient_id': pid,
        'cad_risk_pct': cad_pct,
        'lad_risk_pct': lad_pct,
        'lcx_risk_pct': lcx_pct,
        'rca_risk_pct': rca_pct,
        'cad_classification': 'CAD Positive' if cad_pct >= 65 else 'Normal',
        'lad_status': 'Stenotic' if is_lad_blocked else 'Normal',
        'lcx_status': 'Stenotic' if is_lcx_blocked else 'Normal',
        'rca_status': 'Stenotic' if is_rca_blocked else 'Normal',
        'shap_explanations': shap_factors,
        'input_snapshot': {
            'bp': p.get('bp'),
            'ldl': p.get('ldl'),
            'ef_tte': p.get('ef_tte'),
            'fbs': p.get('fbs'),
            'pr': p.get('pr')
        },
        'clinician_notes': f"Automated calibrated ML baseline diagnosis for {name} ({code})."
    })

print(f"Processed all {len(authoritative_patients)} patients with calibrated models.")

# Write authoritativePatients.json for frontend
out_json = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'data', 'authoritativePatients.json')
with open(out_json, 'w') as f:
    json.dump(authoritative_patients, f, indent=2)

print(f"✓ Saved authoritative patient dataset to {out_json}")

# Batch insert into Supabase diagnostic_sessions table (in chunks of 50)
print("Inserting diagnostic sessions into Supabase...")
chunk_size = 50
inserted = 0

for i in range(0, len(diagnostic_sessions_to_insert), chunk_size):
    chunk = diagnostic_sessions_to_insert[i:i + chunk_size]
    data_bytes = json.dumps(chunk).encode('utf-8')
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/diagnostic_sessions", data=data_bytes, headers={
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
    }, method='POST')

    try:
        with urllib.request.urlopen(req) as resp:
            inserted += len(chunk)
            print(f"  Inserted chunk {i//chunk_size + 1}: {len(chunk)} records (Total: {inserted}/{len(diagnostic_sessions_to_insert)})")
    except Exception as e:
        print(f"  Warning inserting chunk {i//chunk_size + 1}: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode())

print(f"✓ Completed Supabase diagnostic_sessions population: {inserted} records inserted.")
