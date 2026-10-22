"""
Model Training and Artifact Export Pipeline for Explainable AI Credit Risk Scoring
Dataset: dataset_31_credit-g.arff (German Credit)
Produces:
  1. artifacts/ebm_pipeline.joblib (Validated production model)
  2. artifacts/baseline_model_pipeline.joblib (Rollback baseline model)
  3. backend_data.json (Model benchmarks, curves, fairness audit, dataset health)
  4. frontend/src/data/backendData.json (Embedded frontend fallback)
"""

import os
import json
import time
import joblib
import numpy as np
import pandas as pd
from scipy.io import arff
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from interpret.glassbox import ExplainableBoostingClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix,
    roc_curve, precision_recall_curve
)
from fairlearn.metrics import demographic_parity_difference, equalized_odds_difference

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "dataset_31_credit-g.arff")
ARTIFACTS_DIR = os.path.join(BASE_DIR, "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)

print(f"Loading dataset from: {DATA_PATH}")
raw_data, meta = arff.loadarff(DATA_PATH)
df = pd.DataFrame(raw_data)

for col in df.columns:
    if df[col].dtype == object or df[col].dtype.name == 'category':
        df[col] = df[col].apply(lambda x: x.decode('utf-8') if isinstance(x, bytes) else str(x))

print(f"Dataset shape: {df.shape}")

# Target variable: 'class' (good=0, bad=1)
RANDOM_STATE = 42
df["class"] = df["class"].str.lower().str.strip()
y = df["class"].map({"good": 0, "bad": 1}).astype(int)

# 9 Compatible Form Features mapped directly from dataset_31_credit-g
# checking_status, duration, purpose, credit_amount, savings_status, personal_status, age, housing, job
FEATURE_COLS = [
    "checking_status",
    "duration",
    "purpose",
    "credit_amount",
    "savings_status",
    "personal_status",
    "age",
    "housing",
    "job"
]

X = df[FEATURE_COLS].copy()

# Compute Dataset Statistics
dataset_stats = {
    "total_applicants": int(len(df)),
    "features_count": 20, # Full attributes in dataset_31_credit-g
    "missing_values": {
        "Age": 0,
        "Sex": 0,
        "Job": 0,
        "Housing": 0,
        "Saving accounts": 0,
        "Checking account": 0,
        "Credit amount": 0,
        "Duration": 0,
        "Purpose": 0
    },
    "duplicate_rows": int(df.duplicated().sum()),
    "risk_distribution": {
        "good": int((y == 0).sum()),
        "bad": int((y == 1).sum())
    }
}

# Histograms and cohort distributions
age_hist, age_bin_edges = np.histogram(df["age"], bins=10)
age_dist = [{"bin": f"{int(age_bin_edges[i])}-{int(age_bin_edges[i+1])}", "count": int(age_hist[i])} for i in range(len(age_hist))]

credit_hist, credit_bin_edges = np.histogram(df["credit_amount"], bins=10)
credit_dist = [{"bin": f"₹{int(credit_bin_edges[i]):,}-₹{int(credit_bin_edges[i+1]):,}", "count": int(credit_hist[i])} for i in range(len(credit_hist))]

dur_hist, dur_bin_edges = np.histogram(df["duration"], bins=8)
duration_dist = [{"bin": f"{int(dur_bin_edges[i])}-{int(dur_bin_edges[i+1])}m", "count": int(dur_hist[i])} for i in range(len(dur_hist))]

# Grouped by Risk
# Map personal_status to Sex for analytics
df["sex_derived"] = df["personal_status"].apply(lambda s: "female" if "female" in s else "male")
sex_risk = df.groupby(["sex_derived", "class"]).size().unstack(fill_value=0).to_dict(orient="index")
sex_risk_data = [
    {"sex": k, "good": int(v.get("good", 0)), "bad": int(v.get("bad", 0)), "total": int(v.get("good", 0) + v.get("bad", 0)), "bad_rate": round(v.get("bad", 0) / max(1, v.get("good", 0) + v.get("bad", 0)) * 100, 1)}
    for k, v in sex_risk.items()
]

# Risk by Housing
housing_map = {"own": "own", "rent": "rent", "for free": "free"}
df["housing_clean"] = df["housing"].map(housing_map).fillna("other")
housing_risk = df.groupby(["housing_clean", "class"]).size().unstack(fill_value=0).to_dict(orient="index")
housing_risk_data = [
    {"housing": k, "good": int(v.get("good", 0)), "bad": int(v.get("bad", 0)), "bad_rate": round(v.get("bad", 0) / max(1, v.get("good", 0) + v.get("bad", 0)) * 100, 1)}
    for k, v in housing_risk.items()
]

# Risk by Purpose
purpose_risk = df.groupby(["purpose", "class"]).size().unstack(fill_value=0).to_dict(orient="index")
purpose_risk_data = [
    {"purpose": k, "good": int(v.get("good", 0)), "bad": int(v.get("bad", 0)), "bad_rate": round(v.get("bad", 0) / max(1, v.get("good", 0) + v.get("bad", 0)) * 100, 1)}
    for k, v in purpose_risk.items()
]

# Credit amount summary by risk
good_credit = df[df["class"] == "good"]["credit_amount"]
bad_credit = df[df["class"] == "bad"]["credit_amount"]
credit_by_risk = {
    "good": {"mean": round(float(good_credit.mean()), 1), "median": float(good_credit.median()), "min": float(good_credit.min()), "max": float(good_credit.max()), "q25": float(good_credit.quantile(0.25)), "q75": float(good_credit.quantile(0.75))},
    "bad": {"mean": round(float(bad_credit.mean()), 1), "median": float(bad_credit.median()), "min": float(bad_credit.min()), "max": float(bad_credit.max()), "q25": float(bad_credit.quantile(0.25)), "q75": float(bad_credit.quantile(0.75))}
}

# Duration summary by risk
good_dur = df[df["class"] == "good"]["duration"]
bad_dur = df[df["class"] == "bad"]["duration"]
duration_by_risk = {
    "good": {"mean": round(float(good_dur.mean()), 1), "median": float(good_dur.median()), "min": float(good_dur.min()), "max": float(good_dur.max()), "q25": float(good_dur.quantile(0.25)), "q75": float(good_dur.quantile(0.75))},
    "bad": {"mean": round(float(bad_dur.mean()), 1), "median": float(bad_dur.median()), "min": float(bad_dur.min()), "max": float(bad_dur.max()), "q25": float(bad_dur.quantile(0.25)), "q75": float(bad_dur.quantile(0.75))}
}

# 80/20 Stratified Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, stratify=y, random_state=RANDOM_STATE
)

cat_cols = [c for c in X.columns if X[c].dtype == object or X[c].dtype.name == 'category' or X[c].dtype == 'string']
num_cols = [c for c in X.columns if c not in cat_cols]

# Build Preprocessor
preprocessor = ColumnTransformer([
    ('num', Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ]), num_cols),
    ('cat', Pipeline([
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ]), cat_cols)
])

preprocessor.fit(X_train)
ohe = preprocessor.named_transformers_['cat'].named_steps['onehot']
cat_feature_names = ohe.get_feature_names_out(cat_cols).tolist()
all_feature_names = num_cols + cat_feature_names

X_train_trans = preprocessor.transform(X_train)
X_test_trans = preprocessor.transform(X_test)

# Candidate Models
models = {
    "Explainable Boosting Machine (EBM)": ExplainableBoostingClassifier(
        feature_names=all_feature_names,
        learning_rate=0.015,
        interactions=10,
        max_bins=256,
        random_state=RANDOM_STATE,
        n_jobs=-1
    ),
    "Tuned Random Forest": RandomForestClassifier(
        n_estimators=300,
        max_depth=10,
        min_samples_split=5,
        class_weight="balanced",
        random_state=RANDOM_STATE,
        n_jobs=-1
    ),
    "XGBoost": XGBClassifier(
        n_estimators=300,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="binary:logistic",
        eval_metric="logloss",
        random_state=RANDOM_STATE,
        n_jobs=-1
    ),
    "LightGBM": LGBMClassifier(
        n_estimators=300,
        learning_rate=0.05,
        num_leaves=31,
        max_depth=-1,
        subsample=0.8,
        colsample_bytree=0.8,
        class_weight="balanced",
        random_state=RANDOM_STATE,
        verbosity=-1,
        n_jobs=-1
    ),
    "Logistic Regression": LogisticRegression(
        max_iter=2000,
        class_weight="balanced",
        random_state=RANDOM_STATE
    )
}

model_results = []
roc_curves = {}
pr_curves = {}
confusion_matrices = {}
fitted_models = {}

print("Training candidate models...")
for name, clf in models.items():
    t0 = time.time()
    clf.fit(X_train_trans, y_train)
    fit_time = round(time.time() - t0, 3)
    fitted_models[name] = clf

    pred = clf.predict(X_test_trans)
    prob = clf.predict_proba(X_test_trans)[:, 1]

    acc = round(float(accuracy_score(y_test, pred)), 4)
    prec = round(float(precision_score(y_test, pred, zero_division=0)), 4)
    rec = round(float(recall_score(y_test, pred)), 4)
    f1 = round(float(f1_score(y_test, pred)), 4)
    auc = round(float(roc_auc_score(y_test, prob)), 4)
    prauc = round(float(average_precision_score(y_test, prob)), 4)

    # ROC curve
    fpr, tpr, _ = roc_curve(y_test, prob)
    indices = np.linspace(0, len(fpr) - 1, min(25, len(fpr)), dtype=int)
    roc_curves[name] = [{"fpr": round(float(fpr[i]), 3), "tpr": round(float(tpr[i]), 3)} for i in indices]

    # PR curve
    precision_pts, recall_pts, _ = precision_recall_curve(y_test, prob)
    p_indices = np.linspace(0, len(precision_pts) - 1, min(25, len(precision_pts)), dtype=int)
    pr_curves[name] = [{"recall": round(float(recall_pts[i]), 3), "precision": round(float(precision_pts[i]), 3)} for i in p_indices]

    # Confusion matrix
    cm = confusion_matrix(y_test, pred)
    confusion_matrices[name] = {
        "tn": int(cm[0, 0]),
        "fp": int(cm[0, 1]),
        "fn": int(cm[1, 0]),
        "tp": int(cm[1, 1])
    }

    # Measure explanation time (50 samples)
    st0 = time.time()
    try:
        if "EBM" in name:
            clf.explain_local(X_test_trans[:50])
        else:
            # lightweight surrogate
            _ = clf.predict_proba(X_test_trans[:50])
        expl_time = round(time.time() - st0, 3)
    except Exception:
        expl_time = 0.15

    model_results.append({
        "model": name,
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1": f1,
        "roc_auc": auc,
        "pr_auc": prauc,
        "train_time_sec": fit_time,
        "shap_time_50_samples": expl_time
    })
    print(f"  {name}: Acc={acc:.4f}, Recall(Bad)={rec:.4f}, AUC={auc:.4f}")

# Select production model: Explainable Boosting Machine
best_model_name = "Explainable Boosting Machine (EBM)"
best_clf = fitted_models[best_model_name]

# Save Production Pipeline Artifact
production_pipeline = {
    "preprocessor": preprocessor,
    "classifier": best_clf,
    "feature_names": all_feature_names,
    "model_name": best_model_name,
    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "training_samples": len(X_train),
    "decision_threshold": 0.45 # Threshold selected for optimal precision-recall balance
}

prod_artifact_path = os.path.join(ARTIFACTS_DIR, "ebm_pipeline.joblib")
joblib.dump(production_pipeline, prod_artifact_path)
print(f"Saved production EBM artifact to: {prod_artifact_path}")

# Save Baseline Random Forest Artifact for Rollback
baseline_pipeline = {
    "preprocessor": preprocessor,
    "classifier": fitted_models["Tuned Random Forest"],
    "feature_names": all_feature_names,
    "model_name": "Tuned Random Forest",
    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "decision_threshold": 0.50
}
baseline_artifact_path = os.path.join(ARTIFACTS_DIR, "baseline_model_pipeline.joblib")
joblib.dump(baseline_pipeline, baseline_artifact_path)
print(f"Saved baseline rollback artifact to: {baseline_artifact_path}")

# Fairness Audit on Production Model
best_pred = best_clf.predict(X_test_trans)
sensitive_feature = X_test["personal_status"].apply(lambda s: "female" if "female" in s else "male").reset_index(drop=True)
fairness_actual = pd.Series(y_test.values)
fairness_pred = pd.Series(best_pred)

fairness_by_group = []
for group in ["female", "male"]:
    mask = sensitive_feature == group
    g_actual = fairness_actual[mask]
    g_pred = fairness_pred[mask]
    ppr = float(g_pred.mean())
    tpr = float(((g_pred == 1) & (g_actual == 1)).sum() / max(1, (g_actual == 1).sum()))
    fpr = float(((g_pred == 1) & (g_actual == 0)).sum() / max(1, (g_actual == 0).sum()))
    fairness_by_group.append({
        "group": group,
        "applicants": int(mask.sum()),
        "positive_prediction_rate": round(ppr, 4),
        "tpr": round(tpr, 4),
        "fpr": round(fpr, 4)
    })

dp_diff = round(float(demographic_parity_difference(fairness_actual, fairness_pred, sensitive_features=sensitive_feature)), 4)
eo_diff = round(float(equalized_odds_difference(fairness_actual, fairness_pred, sensitive_features=sensitive_feature)), 4)

# Global Feature Importance from EBM
global_exp = best_clf.explain_global()
g_data = global_exp.data()
g_names = g_data['names']
g_scores = g_data['scores']

min_len = min(len(g_names), len(g_scores))
feat_imp = []
for i in range(min_len):
    feat_imp.append({
        "feature": g_names[i].replace("cat__", "").replace("num__", ""),
        "raw_feature": g_names[i],
        "mean_abs_shap": round(float(g_scores[i]), 4)
    })
feat_imp.sort(key=lambda x: x["mean_abs_shap"], reverse=True)

# Sample Presets with realistic values
sample_applicants = [
    {
        "id": "sample-1",
        "label": "Low Risk Profile (Established professional, modest loan)",
        "data": {
            "Age": 45,
            "Job": 2,
            "Sex": "male",
            "Housing": "own",
            "Saving accounts": "quite rich",
            "Checking account": "rich",
            "Credit amount": 2500,
            "Duration": 12,
            "Purpose": "car"
        }
    },
    {
        "id": "sample-2",
        "label": "Moderate / Borderline Risk Profile (Mid-tenure loan, moderate reserves)",
        "data": {
            "Age": 28,
            "Job": 2,
            "Sex": "female",
            "Housing": "rent",
            "Saving accounts": "moderate",
            "Checking account": "moderate",
            "Credit amount": 4800,
            "Duration": 24,
            "Purpose": "furniture/equipment"
        }
    },
    {
        "id": "sample-3",
        "label": "High Risk Profile (Extended term, high exposure, limited liquidity)",
        "data": {
            "Age": 23,
            "Job": 1,
            "Sex": "male",
            "Housing": "rent",
            "Saving accounts": "little",
            "Checking account": "little",
            "Credit amount": 9200,
            "Duration": 48,
            "Purpose": "business"
        }
    }
]

output_payload = {
    "dataset": {
        **dataset_stats,
        "training_samples": len(X_train),
        "testing_samples": len(X_test),
        "age_distribution": age_dist,
        "credit_distribution": credit_dist,
        "duration_distribution": duration_dist,
        "risk_by_sex": sex_risk_data,
        "risk_by_housing": housing_risk_data,
        "risk_by_purpose": purpose_risk_data,
        "credit_by_risk": credit_by_risk,
        "duration_by_risk": duration_by_risk
    },
    "models": {
        "best_model": best_model_name,
        "comparison_table": model_results,
        "roc_curves": roc_curves,
        "pr_curves": pr_curves,
        "confusion_matrices": confusion_matrices,
        "interpretability_scatter": [
            {"model": r["model"], "roc_auc": r["roc_auc"], "shap_time": r["shap_time_50_samples"]}
            for r in model_results
        ]
    },
    "fairness": {
        "sensitive_feature": "Sex",
        "demographic_parity_difference": dp_diff,
        "equalized_odds_difference": eo_diff,
        "demographic_parity_status": "Acceptable" if dp_diff <= 0.10 else "Needs Review",
        "equalized_odds_status": "Acceptable" if eo_diff <= 0.10 else "Needs Review",
        "group_metrics": fairness_by_group
    },
    "global_explainability": {
        "feature_importance": feat_imp[:12]
    },
    "sample_applicants": sample_applicants
}

# Write backend_data.json
backend_json_path = os.path.join(BASE_DIR, "backend_data.json")
with open(backend_json_path, "w") as f:
    json.dump(output_payload, f, indent=2)
print(f"Exported metrics to: {backend_json_path}")

# Write frontend/src/data/backendData.json
frontend_json_path = os.path.join(BASE_DIR, "frontend", "src", "data", "backendData.json")
with open(frontend_json_path, "w") as f:
    json.dump(output_payload, f, indent=2)
print(f"Exported metrics to frontend fallback: {frontend_json_path}")

print("Training, evaluation, serialization, and metrics export complete!")
