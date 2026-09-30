import os
import json
import numpy as np
import pandas as pd
import joblib
from dotenv import load_dotenv

from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import roc_auc_score, accuracy_score, precision_score, recall_score, f1_score, roc_curve
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
import shap

print("=" * 70)
print("CardioVision 3D — Advanced Multi-Vessel ML Training Pipeline")
print("Multimodal AI Hackathon 2026 (Track A: Cardiovascular Risk)")
print("Dual-Metric Transparency | Hybrid Supabase Sync | Zero Hallucination")
print("=" * 70)

# 1. Load Data via Hybrid Supabase Sync (with Local Fallback)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")

df = None
if supabase_url and supabase_key:
    try:
        from supabase import create_client
        client = create_client(supabase_url, supabase_key)
        print("Connecting to Supabase Cloud Database...")
        # Fetch all patient records (303 rows)
        res = client.table("patients").select("*").limit(1000).execute()
        if res.data and len(res.data) > 0:
            df = pd.DataFrame(res.data)
            print(f"✓ Successfully loaded {len(df)} patient records from Supabase 'patients' table.")
    except Exception as e:
        print(f"Notice: Supabase fetch encountered: {e}. Falling back to local dataset.")

if df is None or len(df) == 0:
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "raw", "extention of Z-Alizadeh sani dataset.xlsx")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Neither Supabase nor local dataset available at {data_path}")
    df = pd.read_excel(data_path)
    print(f"✓ Loaded {len(df)} patient records from local master dataset.")

# Normalize column names to lowercase stripped strings
df.columns = [c.strip().lower() for c in df.columns]

# Drop Supabase metadata columns if present
meta_cols_to_drop = [c for c in ['id', 'patient_code', 'created_at'] if c in df.columns]
if meta_cols_to_drop:
    df = df.drop(columns=meta_cols_to_drop)

# Identify Target Columns in dataset
# Dataset can have 'cath', 'lad' (or 'lad_ground_truth'), 'lcx' ('lcx_ground_truth'), 'rca' ('rca_ground_truth')
col_cad = 'cath'
col_lad = 'lad_ground_truth' if 'lad_ground_truth' in df.columns else 'lad'
col_lcx = 'lcx_ground_truth' if 'lcx_ground_truth' in df.columns else 'lcx'
col_rca = 'rca_ground_truth' if 'rca_ground_truth' in df.columns else 'rca'

target_cols = [col_cad, col_lad, col_lcx, col_rca]

# 2. Extract Ground Truth Targets
y_cad = (df[col_cad].astype(str).str.strip().str.upper() == 'CAD').astype(int).values
y_lad = (df[col_lad].astype(str).str.strip().str.capitalize() == 'Stenotic').astype(int).values
y_lcx = (df[col_lcx].astype(str).str.strip().str.capitalize() == 'Stenotic').astype(int).values
y_rca = (df[col_rca].astype(str).str.strip().str.capitalize() == 'Stenotic').astype(int).values

# Compute Multi-Vessel Disease Burden (0, 1, 2, or 3 blocked arteries)
vessel_blockage_count = y_lad + y_lcx + y_rca
print("\nMulti-Vessel Disease Distribution:")
print(f"  • 0-VD (Normal / No Blockages):   {int(np.sum(vessel_blockage_count == 0))} patients (0.0% vessel ratio)")
print(f"  • SVD (Single Vessel Blocked):    {int(np.sum(vessel_blockage_count == 1))} patients (33.3% vessel ratio)")
print(f"  • DVD (Double Vessels Blocked):   {int(np.sum(vessel_blockage_count == 2))} patients (66.7% vessel ratio)")
print(f"  • TVD (Triple Vessels Blocked):   {int(np.sum(vessel_blockage_count == 3))} patients (100.0% vessel ratio)")

targets = {
    'cad': y_cad,
    'lad': y_lad,
    'lcx': y_lcx,
    'rca': y_rca
}

for name, y in targets.items():
    pos_count = int(np.sum(y))
    print(f"  Target [{name.upper()}]: {pos_count} positive ({pos_count/len(y)*100:.1f}%), {len(y)-pos_count} negative")

# 3. Clean and Encode Features (Strict Anti-Leakage: All 4 targets dropped from X)
X_raw = df.drop(columns=target_cols).copy()
print(f"\nFeature matrix X shape after strictly excluding all targets: {X_raw.shape}")

binary_map = {
    'y': 1.0, 'yes': 1.0, 'n': 0.0, 'no': 0.0,
    'male': 1.0, 'fmale': 0.0, 'female': 0.0
}

X_processed = pd.DataFrame(index=X_raw.index)
feature_meta = {}

for col in X_raw.columns:
    col_data = X_raw[col]
    if pd.api.types.is_string_dtype(col_data) or col_data.dtype == 'object':
        cleaned = col_data.astype(str).str.strip().str.lower()
        unique_vals = set(cleaned.unique())
        if unique_vals.issubset(set(binary_map.keys())):
            mapped = cleaned.map(binary_map).astype(float)
            X_processed[col] = mapped
            feature_meta[col] = {"type": "binary", "default": float(mapped.median())}
        else:
            # Multi-category strings (e.g. bbb, vhd)
            dummies = pd.get_dummies(cleaned, prefix=col, drop_first=True, dtype=float)
            for dcol in dummies.columns:
                X_processed[dcol] = dummies[dcol]
                feature_meta[dcol] = {"type": "dummy", "default": float(dummies[dcol].median())}
    else:
        num_vals = col_data.astype(float)
        X_processed[col] = num_vals
        feature_meta[col] = {
            "type": "numeric",
            "min": float(num_vals.min()),
            "max": float(num_vals.max()),
            "mean": float(num_vals.mean()),
            "median": float(num_vals.median()),
            "std": float(num_vals.std()),
            "default": float(num_vals.median())
        }

feature_names = list(X_processed.columns)
print(f"Engineered {len(feature_names)} numerical clinical biomarkers for model input.")

# Baseline profile for progressive imputation
baseline_profile = {col: meta.get("default", 0.0) for col, meta in feature_meta.items()}

# Fit Standard Scaler
scaler = StandardScaler()
X_scaled = pd.DataFrame(scaler.fit_transform(X_processed), columns=feature_names)

# 4. Train Calibrated Ensembles with Balanced Cost-Sensitive Weights
models_dir = os.path.join(os.path.dirname(__file__), "app", "models")
os.makedirs(models_dir, exist_ok=True)

metrics_summary = {}
trained_models = {}
shap_explainers = {}
optimal_thresholds = {}

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

for target_name, y in targets.items():
    print(f"\n" + "-" * 50)
    print(f"Training Calibrated Balanced Ensemble: [{target_name.upper()}]")
    print("-" * 50)
    
    pos_count = np.sum(y)
    neg_count = len(y) - pos_count
    scale_pos = float(neg_count / max(1, pos_count))
    
    oof_preds = np.zeros(len(y))
    oof_probs = np.zeros(len(y))
    fold_aucs = []
    
    for fold, (train_idx, val_idx) in enumerate(skf.split(X_scaled, y)):
        X_train, y_train = X_scaled.iloc[train_idx], y[train_idx]
        X_val, y_val = X_scaled.iloc[val_idx], y[val_idx]
        
        xgb = XGBClassifier(
            n_estimators=120,
            max_depth=3,
            learning_rate=0.04,
            scale_pos_weight=scale_pos,
            subsample=0.85,
            colsample_bytree=0.8,
            random_state=42 + fold,
            eval_metric="logloss"
        )
        lgbm = LGBMClassifier(
            n_estimators=120,
            max_depth=3,
            learning_rate=0.04,
            scale_pos_weight=scale_pos,
            subsample=0.85,
            colsample_bytree=0.8,
            random_state=42 + fold,
            verbosity=-1
        )
        rf = RandomForestClassifier(
            n_estimators=150,
            max_depth=4,
            class_weight="balanced",
            random_state=42 + fold
        )
        
        ensemble = VotingClassifier(
            estimators=[('xgb', xgb), ('lgbm', lgbm), ('rf', rf)],
            voting='soft'
        )
        
        calibrated_model = CalibratedClassifierCV(estimator=ensemble, method='sigmoid', cv=3)
        calibrated_model.fit(X_train, y_train)
        
        probs_val = calibrated_model.predict_proba(X_val)[:, 1]
        oof_probs[val_idx] = probs_val
        fold_auc = roc_auc_score(y_val, probs_val)
        fold_aucs.append(fold_auc)
    
    # Calculate Youden's J-statistic Sweet Spot threshold
    fpr, tpr, thresholds = roc_curve(y, oof_probs)
    j_scores = tpr - fpr
    optimal_idx = np.argmax(j_scores)
    optimal_threshold = float(thresholds[optimal_idx])
    optimal_threshold = max(0.35, min(0.65, optimal_threshold))
    optimal_thresholds[target_name] = round(optimal_threshold, 4)
    
    binary_preds = (oof_probs >= optimal_threshold).astype(int)
    overall_auc = roc_auc_score(y, oof_probs)
    acc = accuracy_score(y, binary_preds)
    prec = precision_score(y, binary_preds, zero_division=0)
    rec = recall_score(y, binary_preds)
    f1 = f1_score(y, binary_preds)
    
    print(f"  • 5-Fold Cross-Validation ROC-AUC: {overall_auc:.4f} (±{np.std(fold_aucs):.4f})")
    print(f"  • Optimal Sweet-Spot Threshold: {optimal_threshold:.4f}")
    print(f"  • Accuracy: {acc*100:.2f}% | Precision: {prec*100:.2f}% | Recall: {rec*100:.2f}% | F1-Score: {f1:.4f}")
    
    metrics_summary[target_name] = {
        "roc_auc": round(float(overall_auc), 4),
        "roc_auc_std": round(float(np.std(fold_aucs)), 4),
        "optimal_threshold": round(optimal_threshold, 4),
        "accuracy": round(float(acc), 4),
        "precision": round(float(prec), 4),
        "recall": round(float(rec), 4),
        "f1_score": round(float(f1), 4)
    }
    
    # Fit final calibrated model on full dataset
    final_xgb = XGBClassifier(n_estimators=150, max_depth=3, learning_rate=0.03, scale_pos_weight=scale_pos, subsample=0.85, colsample_bytree=0.8, random_state=42, eval_metric="logloss")
    final_lgbm = LGBMClassifier(n_estimators=150, max_depth=3, learning_rate=0.03, scale_pos_weight=scale_pos, subsample=0.85, colsample_bytree=0.8, random_state=42, verbosity=-1)
    final_rf = RandomForestClassifier(n_estimators=180, max_depth=4, class_weight="balanced", random_state=42)
    
    final_ensemble = VotingClassifier(
        estimators=[('xgb', final_xgb), ('lgbm', final_lgbm), ('rf', final_rf)],
        voting='soft'
    )
    final_calibrated = CalibratedClassifierCV(estimator=final_ensemble, method='sigmoid', cv=5)
    final_calibrated.fit(X_scaled, y)
    
    model_save_path = os.path.join(models_dir, f"model_{target_name}.joblib")
    joblib.dump(final_calibrated, model_save_path)
    trained_models[target_name] = final_calibrated
    
    # Fit standalone XGBoost on full data for SHAP TreeExplainer
    final_xgb.fit(X_scaled, y)
    explainer = shap.TreeExplainer(final_xgb)
    shap_save_path = os.path.join(models_dir, f"shap_explainer_{target_name}.joblib")
    joblib.dump(explainer, shap_save_path)
    print(f"  ✓ Saved calibrated model & SHAP explainer to {model_save_path}")

# 5. Save Artifacts & Multi-Vessel Threshold Configuration
preprocessor_payload = {
    "feature_names": feature_names,
    "feature_meta": feature_meta,
    "baseline_profile": baseline_profile,
    "scaler": scaler,
    "optimal_thresholds": optimal_thresholds,
    "multi_vessel_stages": {
        "0": {"name": "0-VD (Normal)", "ratio": 0.0, "severity": "Normal"},
        "1": {"name": "SVD (Single Vessel Disease)", "ratio": 33.3, "severity": "Moderate Concern"},
        "2": {"name": "DVD (Double Vessel Disease)", "ratio": 66.7, "severity": "High Alert"},
        "3": {"name": "TVD (Triple Vessel Disease)", "ratio": 100.0, "severity": "Critical Multi-Vessel Emergency"}
    }
}
joblib.dump(preprocessor_payload, os.path.join(models_dir, "preprocessor.joblib"))

with open(os.path.join(models_dir, "metrics_summary.json"), "w") as f:
    json.dump(metrics_summary, f, indent=2)

with open(os.path.join(models_dir, "baseline_profile.json"), "w") as f:
    json.dump(baseline_profile, f, indent=2)

print("\n" + "=" * 70)
print("TRAINING PIPELINE COMPLETE & READY FOR TESTING!")
print(f"All artifacts saved to: {models_dir}")
print("=" * 70)
