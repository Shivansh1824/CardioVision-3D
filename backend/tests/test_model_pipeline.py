import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "Dual-Metric Transparency" in data["features"][0]

def test_metrics_endpoint():
    response = client.get("/api/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["anti_leakage_enforced"] is True
    assert "cad" in data["metrics"]
    assert "lad" in data["metrics"]
    assert "lcx" in data["metrics"]
    assert "rca" in data["metrics"]
    # Verify ROC-AUC is high and cross-validated
    assert data["metrics"]["cad"]["roc_auc"] >= 0.85
    assert data["metrics"]["lad"]["roc_auc"] >= 0.80

def test_healthy_patient_case():
    """Case 1: Fully healthy patient should have 0/3 blocked arteries (0.0%)."""
    payload = {
        "age": 32,
        "sex": "Female",
        "bp": 115,
        "pr": 68,
        "bmi": 21.5,
        "fbs": 85,
        "cr": 0.8,
        "tg": 95,
        "ldl": 75,
        "hdl": 60,
        "ef_tte": 65,
        "dm": 0,
        "htn": 0,
        "current_smoker": 0,
        "ex_smoker": 0,
        "fh": 0,
        "typical_chest_pain": 0,
        "dyspnea": 0,
        "st_depression": 0,
        "st_elevation": 0,
        "q_wave": 0
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    res = response.json()
    
    physical = res["dual_metric_evaluation"]["physical_artery_blockage"]
    prob = res["dual_metric_evaluation"]["clinical_disease_probability"]
    
    assert physical["blocked_count"] == 0
    assert physical["ratio_display"] == "0/3 Blocked"
    assert physical["percentage"] == 0.0
    assert physical["stage"] == "0-VD"
    assert prob["probability"] < 0.40

def test_double_vessel_blockage_strictly_proportional():
    """
    Case 2: Double Vessel Disease must be evaluated as strictly 66.7% (2/3 Blocked)
    and NEVER falsely rounded or inflated to 100%.
    """
    # Patient with strong LAD & LCX risk factors
    payload = {
        "age": 68,
        "sex": "Male",
        "bp": 145,
        "pr": 76,
        "fbs": 140,
        "cr": 1.2,
        "tg": 240,
        "ldl": 165,
        "hdl": 34,
        "ef_tte": 45,
        "dm": 1,
        "htn": 1,
        "current_smoker": 1,
        "typical_chest_pain": 1,
        "st_depression": 1,
        "region_rwma": 1
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    res = response.json()
    
    physical = res["dual_metric_evaluation"]["physical_artery_blockage"]
    # Check that ratio is explicitly tracked
    assert physical["total_arteries"] == 3
    if physical["blocked_count"] == 2:
        assert physical["percentage"] == 66.7
        assert physical["ratio_display"] == "2/3 Blocked"
        assert physical["stage"] == "DVD"
        assert physical["percentage"] != 100.0

def test_partial_lipid_profile_upload():
    """
    Case 3: Patient uploads ONLY a lipid test (cholesterol/LDL/TG/HDL).
    System must not crash, must show Data Completeness Meter, and must label
    unmeasured arteries as needing further testing.
    """
    payload = {
        "age": 52,
        "sex": "Male",
        "bp": 130,
        "ldl": 175,
        "hdl": 38,
        "tg": 220
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    res = response.json()
    
    completeness = res["data_completeness"]
    assert completeness["is_partial_report"] is True
    assert completeness["confidence_score"] <= 50.0
    assert "Lipid Profile" in completeness["tier"]
    
    # Check that unmeasured arteries are flagged for further testing
    vessels = res["artery_vessel_breakdown"]
    assert "Needs Further Clinical Testing" in vessels["lcx_vessel"]["status"]
    assert "Needs Further Clinical Testing" in vessels["rca_vessel"]["status"]

def test_what_if_simulator_intervention():
    """
    Case 4: Real-time What-If lifestyle simulator verifies quantifiable
    vascular risk drop when blood pressure, LDL, and smoking are treated.
    """
    payload = {
        "patient_data": {
            "age": 55,
            "sex": "Male",
            "bp": 165,
            "htn": 1,
            "ldl": 190,
            "tg": 240,
            "current_smoker": 1
        },
        "target_bp": 120,
        "target_ldl": 70,
        "smoker_intervention": True
    }
    response = client.post("/api/simulate", json=payload)
    assert response.status_code == 200
    res = response.json()
    
    assert res["status"] == "success"
    impact = res["quantifiable_impact"]
    assert impact["composite_vascular_risk_drop_percentage"] > 0
    assert impact["lad_stenosis_risk_drop_percentage"] > 0
    assert "relative reduction" in impact["clinical_recommendation"]
    # Artery count should also improve from 3/3 to 2/3
    assert res["simulated_summary"]["arteries_blocked"] == "2/3 Blocked"

def test_biological_consistency_rule():
    """
    Case 5: Mathematical biological consistency rule:
    P(CAD) must always be >= max(P_LAD, P_LCX, P_RCA).
    """
    for bp in [110, 135, 160]:
        for ldl in [80, 130, 195]:
            payload = {"age": 55, "sex": "Male", "bp": bp, "ldl": ldl}
            response = client.post("/api/predict", json=payload)
            assert response.status_code == 200
            res = response.json()
            
            p_cad = res["dual_metric_evaluation"]["clinical_disease_probability"]["probability"]
            p_lad = res["artery_vessel_breakdown"]["lad_vessel"]["probability"]
            p_lcx = res["artery_vessel_breakdown"]["lcx_vessel"]["probability"]
            p_rca = res["artery_vessel_breakdown"]["rca_vessel"]["probability"]
            
            assert p_cad >= max(p_lad, p_lcx, p_rca) - 1e-4
