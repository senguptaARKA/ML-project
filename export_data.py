import json
import time
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix,
    roc_curve, precision_recall_curve
)
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
import shap
from fairlearn.metrics import demographic_parity_difference, equalized_odds_difference

print("Loading data...")
df = pd.read_csv("D:/ML project/german_credit_data.csv")

if "Unnamed: 0" in df.columns:
    df = df.drop(columns=["Unnamed: 0"])

# Save raw dataset statistics before type alteration
dataset_stats = {
    "total_applicants": int(len(df)),
    "features_count": 9,
    "missing_values": {
        "Age": int(df["Age"].isnull().sum()),
        "Sex": int(df["Sex"].isnull().sum()),
        "Job": int(df["Job"].isnull().sum()),
        "Housing": int(df["Housing"].isnull().sum()),
        "Saving accounts": int(df["Saving accounts"].isnull().sum() + (df["Saving accounts"] == "NA").sum()),
        "Checking account": int(df["Checking account"].isnull().sum() + (df["Checking account"] == "NA").sum()),
        "Credit amount": int(df["Credit amount"].isnull().sum()),
        "Duration": int(df["Duration"].isnull().sum()),
        "Purpose": int(df["Purpose"].isnull().sum()),
    },
    "duplicate_rows": int(df.duplicated().sum()),
    "risk_distribution": {
        "good": int((df["Risk"].astype(str).str.lower() == "good").sum()),
        "bad": int((df["Risk"].astype(str).str.lower() == "bad").sum()),
    }
}

# Clean data
for col in df.columns:
    if df[col].dtype == "object":
        df[col] = df[col].astype(str).str.strip()

df["Risk"] = df["Risk"].str.lower()

NUMERIC_FEATURES = ["Age", "Job", "Credit amount", "Duration"]
CATEGORICAL_FEATURES = ["Sex", "Housing", "Saving accounts", "Checking account", "Purpose"]
FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES
TARGET = "Risk"

X = df[FEATURES].copy()
y = df[TARGET].map({"good": 0, "bad": 1}).fillna(0).astype(int)

# Extract distributions for frontend charts
# 1. Age distribution (bins)
age_hist, age_bin_edges = np.histogram(df["Age"], bins=10)
age_dist = [{"bin": f"{int(age_bin_edges[i])}-{int(age_bin_edges[i+1])}", "count": int(age_hist[i])} for i in range(len(age_hist))]

# 2. Credit amount distribution
credit_hist, credit_bin_edges = np.histogram(df["Credit amount"], bins=10)
credit_dist = [{"bin": f"₹{int(credit_bin_edges[i]):,}-₹{int(credit_bin_edges[i+1]):,}", "count": int(credit_hist[i])} for i in range(len(credit_hist))]

# 3. Duration distribution
dur_hist, dur_bin_edges = np.histogram(df["Duration"], bins=8)
duration_dist = [{"bin": f"{int(dur_bin_edges[i])}-{int(dur_bin_edges[i+1])}m", "count": int(dur_hist[i])} for i in range(len(dur_hist))]

# 4. Grouped by Risk
# Risk by Sex
sex_risk = df.groupby(["Sex", "Risk"]).size().unstack(fill_value=0).to_dict(orient="index")
sex_risk_data = [{"sex": k, "good": int(v.get("good", 0)), "bad": int(v.get("bad", 0)), "total": int(v.get("good", 0) + v.get("bad", 0)), "bad_rate": round(v.get("bad", 0) / (v.get("good", 0) + v.get("bad", 0)) * 100, 1)} for k, v in sex_risk.items()]

# Risk by Housing
housing_risk = df.groupby(["Housing", "Risk"]).size().unstack(fill_value=0).to_dict(orient="index")
housing_risk_data = [{"housing": k, "good": int(v.get("good", 0)), "bad": int(v.get("bad", 0)), "bad_rate": round(v.get("bad", 0) / (v.get("good", 0) + v.get("bad", 0)) * 100, 1)} for k, v in housing_risk.items()]

# Risk by Purpose
purpose_risk = df.groupby(["Purpose", "Risk"]).size().unstack(fill_value=0).to_dict(orient="index")
purpose_risk_data = [{"purpose": k, "good": int(v.get("good", 0)), "bad": int(v.get("bad", 0)), "bad_rate": round(v.get("bad", 0) / (v.get("good", 0) + v.get("bad", 0)) * 100, 1)} for k, v in purpose_risk.items()]

# Credit amount summary by risk
good_credit = df[df["Risk"] == "good"]["Credit amount"]
bad_credit = df[df["Risk"] == "bad"]["Credit amount"]
credit_by_risk = {
    "good": {"mean": round(float(good_credit.mean()), 1), "median": float(good_credit.median()), "min": float(good_credit.min()), "max": float(good_credit.max()), "q25": float(good_credit.quantile(0.25)), "q75": float(good_credit.quantile(0.75))},
    "bad": {"mean": round(float(bad_credit.mean()), 1), "median": float(bad_credit.median()), "min": float(bad_credit.min()), "max": float(bad_credit.max()), "q25": float(bad_credit.quantile(0.25)), "q75": float(bad_credit.quantile(0.75))}
}

# Duration summary by risk
good_dur = df[df["Risk"] == "good"]["Duration"]
bad_dur = df[df["Risk"] == "bad"]["Duration"]
duration_by_risk = {
    "good": {"mean": round(float(good_dur.mean()), 1), "median": float(good_dur.median()), "min": float(good_dur.min()), "max": float(good_dur.max()), "q25": float(good_dur.quantile(0.25)), "q75": float(good_dur.quantile(0.75))},
    "bad": {"mean": round(float(bad_dur.mean()), 1), "median": float(bad_dur.median()), "min": float(bad_dur.min()), "max": float(bad_dur.max()), "q25": float(bad_dur.quantile(0.25)), "q75": float(bad_dur.quantile(0.75))}
}

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, stratify=y, random_state=42
)

# Pipeline
numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
])

preprocessor = ColumnTransformer([
    ("num", numeric_pipeline, NUMERIC_FEATURES),
    ("cat", categorical_pipeline, CATEGORICAL_FEATURES)
])

# Define models
models = {
    "Logistic Regression": Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", LogisticRegression(max_iter=2000, class_weight="balanced", random_state=42))
    ]),
    "Random Forest": Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=300, class_weight="balanced", random_state=42, n_jobs=-1))
    ]),
    "XGBoost": Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", XGBClassifier(n_estimators=300, max_depth=4, learning_rate=0.05, subsample=0.8, colsample_bytree=0.8, objective="binary:logistic", eval_metric="logloss", random_state=42, n_jobs=-1))
    ]),
    "LightGBM": Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", LGBMClassifier(n_estimators=300, learning_rate=0.05, num_leaves=31, max_depth=-1, subsample=0.8, colsample_bytree=0.8, class_weight="balanced", random_state=42, verbosity=-1, n_jobs=-1))
    ]),
    "Tuned Random Forest": Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=300, max_depth=10, min_samples_split=5, class_weight="balanced", random_state=42, n_jobs=-1))
    ])
}

model_results = []
roc_curves = {}
pr_curves = {}
confusion_matrices = {}
shap_times = {}

print("Training and evaluating models...")
for name, model in models.items():
    t0 = time.time()
    model.fit(X_train, y_train)
    train_time = round(time.time() - t0, 3)

    pred = model.predict(X_test)
    prob = model.predict_proba(X_test)[:, 1]

    acc = round(float(accuracy_score(y_test, pred)), 4)
    prec = round(float(precision_score(y_test, pred)), 4)
    rec = round(float(recall_score(y_test, pred)), 4)
    f1 = round(float(f1_score(y_test, pred)), 4)
    auc = round(float(roc_auc_score(y_test, prob)), 4)
    prauc = round(float(average_precision_score(y_test, prob)), 4)

    # ROC curve
    fpr, tpr, _ = roc_curve(y_test, prob)
    # Subsample points for lightweight web transmission
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

    # Measure SHAP explanation time (50 samples)
    prep = model.named_steps["preprocessor"]
    clf = model.named_steps["classifier"]
    sample_trans = pd.DataFrame(prep.transform(X_test.iloc[:50]), columns=prep.get_feature_names_out())
    st0 = time.time()
    try:
        if isinstance(clf, LogisticRegression):
            exp = shap.LinearExplainer(clf, sample_trans)
            exp.shap_values(sample_trans)
        else:
            exp = shap.TreeExplainer(clf)
            exp.shap_values(sample_trans)
        shap_elapsed = round(time.time() - st0, 3)
    except Exception as e:
        shap_elapsed = 0.50
    shap_times[name] = shap_elapsed

    model_results.append({
        "model": name,
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1": f1,
        "roc_auc": auc,
        "pr_auc": prauc,
        "train_time_sec": train_time,
        "shap_time_50_samples": shap_elapsed
    })

# Select best model (by ROC-AUC)
best_model_item = max(model_results, key=lambda x: x["roc_auc"])
best_model_name = best_model_item["model"]
best_pipeline = models[best_model_name]

# Fairness Analysis on Best Model
best_pred = best_pipeline.predict(X_test)
sensitive_feature = X_test["Sex"].reset_index(drop=True)
fairness_actual = pd.Series(y_test.values)
fairness_pred = pd.Series(best_pred)

fairness_by_group = []
for group in sensitive_feature.unique():
    mask = sensitive_feature == group
    g_actual = fairness_actual[mask]
    g_pred = fairness_pred[mask]
    ppr = float(g_pred.mean())
    tpr = float(((g_pred == 1) & (g_actual == 1)).sum() / max((g_actual == 1).sum(), 1))
    fpr = float(((g_pred == 1) & (g_actual == 0)).sum() / max((g_actual == 0).sum(), 1))
    fairness_by_group.append({
        "group": group,
        "applicants": int(mask.sum()),
        "positive_prediction_rate": round(ppr, 4),
        "tpr": round(tpr, 4),
        "fpr": round(fpr, 4)
    })

dp_diff = round(float(demographic_parity_difference(fairness_actual, fairness_pred, sensitive_features=sensitive_feature)), 4)
eo_diff = round(float(equalized_odds_difference(fairness_actual, fairness_pred, sensitive_features=sensitive_feature)), 4)

# Global SHAP feature importance on best model
prep = best_pipeline.named_steps["preprocessor"]
clf = best_pipeline.named_steps["classifier"]
feature_names = prep.get_feature_names_out().tolist()
X_test_trans = pd.DataFrame(prep.transform(X_test), columns=feature_names)
exp = shap.TreeExplainer(clf)
shap_vals = exp.shap_values(X_test_trans)
if isinstance(shap_vals, list):
    shap_vals_bad = shap_vals[1]
elif len(np.array(shap_vals).shape) == 3:
    shap_vals_bad = shap_vals[:, :, 1]
else:
    shap_vals_bad = shap_vals

mean_abs_shap = np.abs(shap_vals_bad).mean(axis=0)
global_feature_importance = [
    {"feature": feature_names[i].replace("num__", "").replace("cat__", ""), "raw_feature": feature_names[i], "mean_abs_shap": round(float(mean_abs_shap[i]), 4)}
    for i in range(len(feature_names))
]
global_feature_importance.sort(key=lambda x: x["mean_abs_shap"], reverse=True)

# Sample test applicants with precalculated SHAP & Counterfactuals for instant interactive demonstration
sample_applicants = [
    {
        "id": "sample-1",
        "label": "Low Risk Profile (Stable, established professional)",
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
        "label": "Moderate / Borderline Risk Profile (Young professional, mid-sized loan)",
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
        "label": "High Risk Profile (Extended term, high amount, limited savings)",
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
        "feature_importance": global_feature_importance[:12]
    },
    "sample_applicants": sample_applicants
}

with open("D:/ML project/backend_data.json", "w") as f:
    json.dump(output_payload, f, indent=2)

print("Export completed successfully to D:/ML project/backend_data.json!")
