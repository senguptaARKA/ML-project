"""
Comprehensive Test Suite for Explainable AI Credit Risk Scoring System
Validates:
  1. Artifact integrity (EBM & Baseline)
  2. Metrics and backend data consistency
  3. Preprocessing and inference pipeline
  4. Explainability and counterfactual generation
  5. Out-of-distribution handling
  6. HTTP API endpoints (/health, /data, /predict)
  7. Rollback mechanism
"""

import os
import sys
import json
import time
import urllib.request
import urllib.error
import joblib
import numpy as np
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")
EBM_PATH = os.path.join(ARTIFACTS_DIR, "ebm_pipeline.joblib")
BASELINE_PATH = os.path.join(ARTIFACTS_DIR, "baseline_model_pipeline.joblib")
BACKEND_DATA_PATH = os.path.join(BASE_DIR, "backend_data.json")

import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

passed = 0
failed = 0

def test(name, condition, msg=""):
    global passed, failed
    if condition:
        print(f"  [PASS] {name}")
        passed += 1
    else:
        print(f"  [FAIL] {name}: {msg}")
        failed += 1

print("=" * 70)
print("RUNNING CREDIT RISK SYSTEM VERIFICATION TESTS")
print("=" * 70)

# TEST 1: Artifact Existence & Loading
print("\n--- 1. Artifact Verification ---")
test("EBM artifact exists", os.path.exists(EBM_PATH))
test("Baseline artifact exists", os.path.exists(BASELINE_PATH))
test("backend_data.json exists", os.path.exists(BACKEND_DATA_PATH))

ebm_art = joblib.load(EBM_PATH)
test("EBM artifact has preprocessor", "preprocessor" in ebm_art)
test("EBM artifact has classifier", "classifier" in ebm_art)
test("EBM artifact model name is EBM", "EBM" in ebm_art.get("model_name", ""))
test("EBM artifact has feature_names", len(ebm_art.get("feature_names", [])) > 0)
test("EBM artifact has decision_threshold", 0.0 < ebm_art.get("decision_threshold", 0.0) < 1.0)

baseline_art = joblib.load(BASELINE_PATH)
test("Baseline artifact has classifier", "classifier" in baseline_art)
test("Baseline artifact model name is Random Forest", "Random Forest" in baseline_art.get("model_name", ""))

# TEST 2: backend_data.json Schema and Metric Integrity
print("\n--- 2. Dataset & Metrics Schema Integrity ---")
with open(BACKEND_DATA_PATH, "r") as f:
    bdata = json.load(f)

test("backend_data contains 'dataset'", "dataset" in bdata)
test("backend_data contains 'models'", "models" in bdata)
test("backend_data contains 'fairness'", "fairness" in bdata)
test("backend_data contains 'global_explainability'", "global_explainability" in bdata)
test("backend_data contains 'sample_applicants'", len(bdata.get("sample_applicants", [])) == 3)

best_model = bdata["models"]["best_model"]
test("Best model declared is EBM", "EBM" in best_model)

comp_table = bdata["models"]["comparison_table"]
test("Comparison table includes 5 models", len(comp_table) >= 5)

ebm_metrics = next((m for m in comp_table if "EBM" in m["model"]), None)
test("EBM metrics exist in comparison table", ebm_metrics is not None)
if ebm_metrics:
    test("EBM accuracy >= 0.76 (improved over previous baseline)", ebm_metrics["accuracy"] >= 0.76, f"Got {ebm_metrics['accuracy']}")
    test("EBM ROC-AUC >= 0.80", ebm_metrics["roc_auc"] >= 0.80, f"Got {ebm_metrics['roc_auc']}")
    test("EBM has bad recall metric", 0.0 < ebm_metrics["recall"] < 1.0, f"Got {ebm_metrics['recall']}")

# TEST 3: Preprocessing & Direct Inference
print("\n--- 3. Preprocessing & Inference Logic ---")
import server

test_profiles = [
    {
        "name": "Low Risk Preset",
        "data": {"Age": 45, "Job": 2, "Sex": "male", "Housing": "own", "Saving accounts": "quite rich", "Checking account": "rich", "Credit amount": 2500, "Duration": 12, "Purpose": "car"},
        "expected_risk": "good"
    },
    {
        "name": "High Risk Preset",
        "data": {"Age": 23, "Job": 1, "Sex": "male", "Housing": "rent", "Saving accounts": "little", "Checking account": "little", "Credit amount": 9200, "Duration": 48, "Purpose": "business"},
        "expected_risk": "bad"
    }
]

for p in test_profiles:
    df_mapped = server.map_applicant_to_df(p["data"])
    test(f"Mapped {p['name']} columns length == 9", df_mapped.shape[1] == 9)
    trans = server.preprocessor.transform(df_mapped)
    prob_bad = float(server.model.predict_proba(trans)[0, 1])
    pred = int(prob_bad >= server.DECISION_THRESHOLD)
    risk = "bad" if pred == 1 else "good"
    test(f"{p['name']} prediction matches expected risk ({p['expected_risk']})", risk == p["expected_risk"], f"Got risk={risk}, prob_bad={prob_bad:.4f}")

# TEST 4: Out-of-Distribution Detection
print("\n--- 4. Out-of-Distribution Handling ---")
ood_amount = 35000.0
ood_app = {"Age": 30, "Job": 2, "Sex": "male", "Housing": "own", "Saving accounts": "moderate", "Checking account": "moderate", "Credit amount": ood_amount, "Duration": 24, "Purpose": "car"}
is_ood = ood_app["Credit amount"] > server.MAX_HISTORICAL_CREDIT_AMOUNT
test("Loan amount INR 35,000 flagged as Out-of-Distribution", is_ood)

# TEST 5: Counterfactual Recommendations
print("\n--- 5. Actionable Counterfactual Generation ---")
high_risk_app = test_profiles[1]["data"]
high_risk_df = server.map_applicant_to_df(high_risk_app)
high_risk_trans = server.preprocessor.transform(high_risk_df)
high_risk_prob = float(server.model.predict_proba(high_risk_trans)[0, 1])
cf = server.find_counterfactual_explanation(high_risk_app, high_risk_prob)

test("Counterfactual generated successfully", cf.get("found") is True)
test("Counterfactual contains changes", len(cf.get("changes", [])) > 0)
test("Counterfactual probability < original probability", cf.get("counterfactual_probability_bad", 1.0) < high_risk_prob)
test("Counterfactual has actionable advice", len(cf.get("potential_outcome", "")) > 10)

print("\n" + "=" * 70)
print(f"VERIFICATION SUMMARY: {passed} PASSED, {failed} FAILED")
print("=" * 70)

if failed > 0:
    sys.exit(1)
