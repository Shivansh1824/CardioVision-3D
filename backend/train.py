import os
import json
import numpy as np
import pandas as pd
import joblib

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
print("=" * 70)

# 1. Load Dataset
data_path = os.path.join(os.path.dirname(__file__), "..", "data", "raw", "extention of Z-Alizadeh sani dataset.xlsx")
if not os.path.exists(data_path):
    raise FileNotFoundError(f"Dataset not found at {data_path}")

df = pd.read_excel(data_path)
print(f"Loaded dataset: {df.shape[0]} patients, {df.shape[1]} raw columns.")

# 2. Define Targets and Strict Anti-Leakage Guards
target_cols = ['Cath', 'LAD', 'LCX', 'RCA']

y_cad = (df['Cath'].astype(str).str.strip().str.upper() == 'CAD').astype(int).values
y_lad = (df['LAD'].astype(str).str.strip().str.capitalize() == 'Stenotic').astype(int).values
y_lcx = (df['LCX'].astype(str).str.strip().str.capitalize() == 'Stenotic').astype(int).values
y_rca = (df['RCA'].astype(str).str.strip().str.capitalize() == 'Stenotic').astype(int).values

targets = {
    'cad': y_cad,
    'lad': y_lad,
    'lcx': y_lcx,
    'rca': y_rca
}

for name, y in targets.items():
    pos_count = int(np.sum(y))
    print(f"  Target [{name.upper()}]: {pos_count} positive ({pos_count/len(y)*100:.1f}%), {len(y)-pos_count} negative")

# Strictly drop targets from feature matrix (Hackathon Rule 1d)
X_raw = df.drop(columns=target_cols).copy()
print(f"\nFeature matrix X shape after strictly excluding targets: {X_raw.shape}")

# 3. Clean and Encode Features
binary_map = {
    'y': 1.0, 'yes': 1.0, 'n': 0.0, 'no': 0.0,
    'male': 1.0, 'fmale': 0.0, 'female': 0.0
}

X_processed = pd.DataFrame(index=X_raw.index)
feature_meta = {}

for col in X_raw.columns:
    col_data = X_raw[col]
    # Check if column is string/categorical
    if pd.api.types.is_string_dtype(col_data) or col_data.dtype == 'object':
        cleaned = col_data.astype(str).str.strip().str.lower()
        unique_vals = set(cleaned.unique())
        # Check if all unique values match binary map
        if unique_vals.issubset(set(binary_map.keys())):
            mapped = cleaned.map(binary_map).astype(float)
            X_processed[col] = mapped
            feature_meta[col] = {"type": "binary", "default": float(mapped.median())}
        else:
            # Multi-category string (e.g. BBB, VHD)
            dummies = pd.get_dummies(cleaned, prefix=col, drop_first=True, dtype=float)
            for dcol in dummies.columns:
                X_processed[dcol] = dummies[dcol]
                feature_meta[dcol] = {"type": "dummy", "default": float(dummies[dcol].median())}
    else:
        # Numeric column
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
print(f"Engineered {len(feature_names)} numerical features for model input.")

# Baseline profile for 3-tier imputation
baseline_profile = {col: meta.get("default", 0.0) for col, meta in feature_meta.items()}

# Fit Standard Scaler
scaler = StandardScaler()
X_scaled = pd.DataFrame(scaler.fit_transform(X_processed), columns=feature_names)

# 4. Training Calibrated Multi-Model Ensembles with Sweet-Spot Thresholds
models_dir = os.path.join(os.path.dirname(__file__), "app", "models")
os.makedirs(models_dir, exist_ok=True)

metrics_summary = {}
trained_models = {}
shap_explainers = {}
optimal_thresholds = {}

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

for target_name, y in targets.items():
    print(f"\n" + "-" * 50)
    print(f"Training Calibrated Ensemble for: [{target_name.upper()}]")
    print("-" * 50)
    
    oof_preds = np.zeros(len(y))
    oof_probs = np.zeros(len(y))
    fold_aucs = []
    
    for fold, (train_idx, val_idx) in enumerate(skf.split(X_scaled, y)):
        X_train, y_train = X_scaled.iloc[train_idx], y[train_idx]
        X_val, y_val = X_scaled.iloc[val_idx], y[val_idx]
        
        xgb = XGBClassifier(
            n_estimators=100,
            max_depth=3,
            learning_rate=0.05,
            subsample=0.85,
            colsample_bytree=0.8,
            random_state=42 + fold,
            eval_metric="logloss"
        )
        lgbm = LGBMClassifier(
            n_estimators=100,
            max_depth=3,
            learning_rate=0.05,
            subsample=0.85,
            colsample_bytree=0.8,
            random_state=42 + fold,
            verbosity=-1
        )
        rf = RandomForestClassifier(
            n_estimators=100,
            max_depth=4,
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
    
    print(f"  • Cross-Validation ROC-AUC: {overall_auc:.4f} (±{np.std(fold_aucs):.4f})")
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
    final_xgb = XGBClassifier(n_estimators=120, max_depth=3, learning_rate=0.04, subsample=0.85, colsample_bytree=0.8, random_state=42, eval_metric="logloss")
    final_lgbm = LGBMClassifier(n_estimators=120, max_depth=3, learning_rate=0.04, subsample=0.85, colsample_bytree=0.8, random_state=42, verbosity=-1)
    final_rf = RandomForestClassifier(n_estimators=120, max_depth=4, random_state=42)
    
    final_ensemble = VotingClassifier(
        estimators=[('xgb', final_xgb), ('lgbm', final_lgbm), ('rf', final_rf)],
        voting='soft'
    )
    final_calibrated = CalibratedClassifierCV(estimator=final_ensemble, method='sigmoid', cv=5)
    final_calibrated.fit(X_scaled, y)
    
    # Save model
    model_save_path = os.path.join(models_dir, f"model_{target_name}.joblib")
    joblib.dump(final_calibrated, model_save_path)
    trained_models[target_name] = final_calibrated
    
    # Fit standalone XGBoost on full data for SHAP TreeExplainer
    final_xgb.fit(X_scaled, y)
    explainer = shap.TreeExplainer(final_xgb)
    shap_save_path = os.path.join(models_dir, f"shap_explainer_{target_name}.joblib")
    joblib.dump(explainer, shap_save_path)
    print(f"  Saved calibrated model & SHAP explainer to {model_save_path}")

# 5. Save Preprocessor & Metadata
preprocessor_payload = {
    "feature_names": feature_names,
    "feature_meta": feature_meta,
    "baseline_profile": baseline_profile,
    "scaler": scaler,
    "optimal_thresholds": optimal_thresholds
}
joblib.dump(preprocessor_payload, os.path.join(models_dir, "preprocessor.joblib"))

with open(os.path.join(models_dir, "metrics_summary.json"), "w") as f:
    json.dump(metrics_summary, f, indent=2)

with open(os.path.join(models_dir, "baseline_profile.json"), "w") as f:
    json.dump(baseline_profile, f, indent=2)

print("\n" + "=" * 70)
print("TRAINING COMPLETE & VERIFIED!")
print(f"All artifacts saved to: {models_dir}")
print("=" * 70)
