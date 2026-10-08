

# %%
# ============================================================
# CHUNK 2: IMPORT LIBRARIES
# ============================================================

import os
import time
import warnings
from pathlib import Path

import numpy as np
import pandas as pd

import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    GridSearchCV
)

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from sklearn.preprocessing import (
    OneHotEncoder,
    StandardScaler
)

from sklearn.impute import SimpleImputer

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix,
    classification_report,
    roc_curve,
    precision_recall_curve
)

from xgboost import XGBClassifier
from lightgbm import LGBMClassifier

import shap
from lime.lime_tabular import LimeTabularExplainer

from scipy.stats import spearmanr

from fairlearn.metrics import (
    demographic_parity_difference,
    equalized_odds_difference
)

warnings.filterwarnings("ignore")

sns.set_theme(style="whitegrid")

print("Libraries imported successfully.")

# %%
# ============================================================
# CHUNK 4: READ UPLOADED DATASET
# ============================================================



df = pd.read_csv("D:/ML project/german_credit_data.csv")
print("Dataset loaded successfully!")

print("\nShape:")
print(df.shape)

print("\nFirst 5 rows:")
display(df.head())

# %%
# ============================================================
# CHUNK 5: INITIAL DATA INSPECTION
# ============================================================

print("=" * 70)
print("DATASET INFORMATION")
print("=" * 70)

print("\nShape:")
print(df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nData types:")
display(df.dtypes.to_frame("Data Type"))

print("\nMissing values:")
display(df.isnull().sum().to_frame("Missing Values"))

print("\nDuplicate rows:")
print(df.duplicated().sum())

print("\nRisk distribution:")
display(df["Risk"].value_counts())

# %%
# ============================================================
# CHUNK 6: BASIC DATA CLEANING
# ============================================================

# Remove ID/index column
if "Unnamed: 0" in df.columns:
    df = df.drop(columns=["Unnamed: 0"])

# Clean column values
for column in df.columns:
    if df[column].dtype == "object":
        df[column] = df[column].astype(str).str.strip()

# Normalize target
df["Risk"] = df["Risk"].str.lower()

print("Cleaning completed.")

print("\nColumns after cleaning:")
print(df.columns.tolist())

print("\nTarget values:")
print(df["Risk"].value_counts())

# %%
# ============================================================
# CHUNK 7: DEFINE FEATURES AND TARGET
# ============================================================

NUMERIC_FEATURES = [
    "Age",
    "Job",
    "Credit amount",
    "Duration"
]

CATEGORICAL_FEATURES = [
    "Sex",
    "Housing",
    "Saving accounts",
    "Checking account",
    "Purpose"
]

FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES

TARGET = "Risk"

X = df[FEATURES].copy()

y = df[TARGET].map({
    "good": 0,
    "bad": 1
})

print("Features:")
print(FEATURES)

print("\nTarget encoding:")
print("good = 0")
print("bad  = 1")

print("\nX shape:", X.shape)
print("y shape:", y.shape)

# %%
# ============================================================
# CHUNK 8: TRAIN / TEST SPLIT
# ============================================================

# Ensure y has no NaN values before splitting
y = y.fillna(0).astype(int)

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    stratify=y,
    random_state=42
)

print("Training data:", X_train.shape)
print("Testing data :", X_test.shape)

print("\nTraining target distribution:")
print(y_train.value_counts(normalize=True))

print("\nTesting target distribution:")
print(y_test.value_counts(normalize=True))

# %%
# ============================================
# CHUNK 9 - EXPLORATORY DATA ANALYSIS
# ============================================

print("=" * 70)
print("EXPLORATORY DATA ANALYSIS")
print("=" * 70)

# -----------------------------
# 1. Target distribution
# -----------------------------
plt.figure(figsize=(7, 5))

sns.countplot(data=df, x="Risk")

plt.title("Credit Risk Distribution")
plt.xlabel("Risk")
plt.ylabel("Number of Applicants")

plt.show()


# -----------------------------
# 2. Age distribution
# -----------------------------
plt.figure(figsize=(8, 5))

sns.histplot(
    data=df,
    x="Age",
    bins=20,
    kde=True
)

plt.title("Age Distribution")
plt.xlabel("Age")
plt.ylabel("Number of Applicants")

plt.show()


# -----------------------------
# 3. Credit amount distribution
# -----------------------------
plt.figure(figsize=(8, 5))

sns.histplot(
    data=df,
    x="Credit amount",
    bins=30,
    kde=True
)

plt.title("Credit Amount Distribution")
plt.xlabel("Credit Amount")
plt.ylabel("Number of Applicants")

plt.show()


# -----------------------------
# 4. Credit amount by risk
# -----------------------------
plt.figure(figsize=(8, 5))

sns.boxplot(
    data=df,
    x="Risk",
    y="Credit amount"
)

plt.title("Credit Amount by Credit Risk")
plt.xlabel("Risk")
plt.ylabel("Credit Amount")

plt.show()


# -----------------------------
# 5. Duration by risk
# -----------------------------
plt.figure(figsize=(8, 5))

sns.boxplot(
    data=df,
    x="Risk",
    y="Duration"
)

plt.title("Loan Duration by Credit Risk")
plt.xlabel("Risk")
plt.ylabel("Duration (months)")

plt.show()


# -----------------------------
# 6. Risk by sex
# -----------------------------
plt.figure(figsize=(8, 5))

sns.countplot(
    data=df,
    x="Sex",
    hue="Risk"
)

plt.title("Credit Risk by Sex")
plt.xlabel("Sex")
plt.ylabel("Number of Applicants")

plt.show()


# -----------------------------
# 7. Risk by housing
# -----------------------------
plt.figure(figsize=(8, 5))

sns.countplot(
    data=df,
    x="Housing",
    hue="Risk"
)

plt.title("Credit Risk by Housing Type")
plt.xlabel("Housing")
plt.ylabel("Number of Applicants")

plt.xticks(rotation=15)

plt.show()


# -----------------------------
# 8. Risk by purpose
# -----------------------------
plt.figure(figsize=(10, 5))

sns.countplot(
    data=df,
    x="Purpose",
    hue="Risk"
)

plt.title("Credit Risk by Loan Purpose")
plt.xlabel("Purpose")
plt.ylabel("Number of Applicants")

plt.xticks(rotation=45)

plt.show()


print("EDA completed successfully.")

# %%
# ============================================
# CHUNK 10 - PREPROCESSING PIPELINE
# ============================================

print("=" * 70)
print("BUILDING PREPROCESSING PIPELINE")
print("=" * 70)

# Numerical preprocessing
numeric_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ]
)


# Categorical preprocessing
categorical_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(
            handle_unknown="ignore",
            sparse_output=False
        ))
    ]
)


# Combine numerical and categorical preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_pipeline, NUMERIC_FEATURES),
        ("cat", categorical_pipeline, CATEGORICAL_FEATURES)
    ]
)


print("Numerical features:")
print(NUMERIC_FEATURES)

print("\nCategorical features:")
print(CATEGORICAL_FEATURES)

print("\nPreprocessing pipeline created successfully!")

# %%
# ============================================
# CHUNK 11 - LOGISTIC REGRESSION
# ============================================

print("=" * 70)
print("LOGISTIC REGRESSION")
print("=" * 70)

logistic_model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "classifier",
            LogisticRegression(
                max_iter=2000,
                class_weight="balanced",
                random_state=42
            )
        )
    ]
)


start_time = time.time()

logistic_model.fit(X_train, y_train)

logistic_time = time.time() - start_time

print(f"Training completed in {logistic_time:.2f} seconds.")


# Predictions
logistic_pred = logistic_model.predict(X_test)

logistic_prob = logistic_model.predict_proba(X_test)[:, 1]


# Metrics
logistic_accuracy = accuracy_score(y_test, logistic_pred)
logistic_precision = precision_score(y_test, logistic_pred)
logistic_recall = recall_score(y_test, logistic_pred)
logistic_f1 = f1_score(y_test, logistic_pred)
logistic_auc = roc_auc_score(y_test, logistic_prob)
logistic_ap = average_precision_score(y_test, logistic_prob)


print("\nLogistic Regression Results")
print("-" * 40)
print(f"Accuracy : {logistic_accuracy:.4f}")
print(f"Precision: {logistic_precision:.4f}")
print(f"Recall   : {logistic_recall:.4f}")
print(f"F1 Score : {logistic_f1:.4f}")
print(f"ROC-AUC  : {logistic_auc:.4f}")
print(f"PR-AUC   : {logistic_ap:.4f}")

# %%
# ============================================
# CHUNK 12 - RANDOM FOREST
# ============================================

print("=" * 70)
print("RANDOM FOREST")
print("=" * 70)

random_forest_model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "classifier",
            RandomForestClassifier(
                n_estimators=300,
                class_weight="balanced",
                random_state=42,
                n_jobs=-1
            )
        )
    ]
)


start_time = time.time()

random_forest_model.fit(X_train, y_train)

random_forest_time = time.time() - start_time

print(f"Training completed in {random_forest_time:.2f} seconds.")


# Predictions
rf_pred = random_forest_model.predict(X_test)

rf_prob = random_forest_model.predict_proba(X_test)[:, 1]


# Metrics
rf_accuracy = accuracy_score(y_test, rf_pred)
rf_precision = precision_score(y_test, rf_pred)
rf_recall = recall_score(y_test, rf_pred)
rf_f1 = f1_score(y_test, rf_pred)
rf_auc = roc_auc_score(y_test, rf_prob)
rf_ap = average_precision_score(y_test, rf_prob)


print("\nRandom Forest Results")
print("-" * 40)
print(f"Accuracy : {rf_accuracy:.4f}")
print(f"Precision: {rf_precision:.4f}")
print(f"Recall   : {rf_recall:.4f}")
print(f"F1 Score : {rf_f1:.4f}")
print(f"ROC-AUC  : {rf_auc:.4f}")
print(f"PR-AUC   : {rf_ap:.4f}")


# %%
# ============================================
# CHUNK 13 - XGBOOST
# ============================================

print("=" * 70)
print("XGBOOST")
print("=" * 70)

xgb_model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "classifier",
            XGBClassifier(
                n_estimators=300,
                max_depth=4,
                learning_rate=0.05,
                subsample=0.8,
                colsample_bytree=0.8,
                objective="binary:logistic",
                eval_metric="logloss",
                random_state=42,
                n_jobs=-1
            )
        )
    ]
)


start_time = time.time()

xgb_model.fit(X_train, y_train)

xgb_time = time.time() - start_time

print(f"Training completed in {xgb_time:.2f} seconds.")


# Predictions
xgb_pred = xgb_model.predict(X_test)

xgb_prob = xgb_model.predict_proba(X_test)[:, 1]


# Metrics
xgb_accuracy = accuracy_score(y_test, xgb_pred)
xgb_precision = precision_score(y_test, xgb_pred)
xgb_recall = recall_score(y_test, xgb_pred)
xgb_f1 = f1_score(y_test, xgb_pred)
xgb_auc = roc_auc_score(y_test, xgb_prob)
xgb_ap = average_precision_score(y_test, xgb_prob)


print("\nXGBoost Results")
print("-" * 40)
print(f"Accuracy : {xgb_accuracy:.4f}")
print(f"Precision: {xgb_precision:.4f}")
print(f"Recall   : {xgb_recall:.4f}")
print(f"F1 Score : {xgb_f1:.4f}")
print(f"ROC-AUC  : {xgb_auc:.4f}")
print(f"PR-AUC   : {xgb_ap:.4f}")

# %%
# ============================================
# CHUNK 14 - LIGHTGBM
# ============================================

print("=" * 70)
print("LIGHTGBM")
print("=" * 70)

lightgbm_model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "classifier",
            LGBMClassifier(
                n_estimators=300,
                learning_rate=0.05,
                num_leaves=31,
                max_depth=-1,
                subsample=0.8,
                colsample_bytree=0.8,
                class_weight="balanced",
                random_state=42,
                verbosity=-1,
                n_jobs=-1
            )
        )
    ]
)


start_time = time.time()

lightgbm_model.fit(X_train, y_train)

lightgbm_time = time.time() - start_time

print(f"Training completed in {lightgbm_time:.2f} seconds.")


# Predictions
lgb_pred = lightgbm_model.predict(X_test)

lgb_prob = lightgbm_model.predict_proba(X_test)[:, 1]


# Metrics
lgb_accuracy = accuracy_score(y_test, lgb_pred)
lgb_precision = precision_score(y_test, lgb_pred)
lgb_recall = recall_score(y_test, lgb_pred)
lgb_f1 = f1_score(y_test, lgb_pred)
lgb_auc = roc_auc_score(y_test, lgb_prob)
lgb_ap = average_precision_score(y_test, lgb_prob)


print("\nLightGBM Results")
print("-" * 40)
print(f"Accuracy : {lgb_accuracy:.4f}")
print(f"Precision: {lgb_precision:.4f}")
print(f"Recall   : {lgb_recall:.4f}")
print(f"F1 Score : {lgb_f1:.4f}")
print(f"ROC-AUC  : {lgb_auc:.4f}")
print(f"PR-AUC   : {lgb_ap:.4f}")

# %%
# ============================================
# CHUNK 15 - HYPERPARAMETER TUNING
# ============================================

print("=" * 70)
print("5-FOLD CROSS-VALIDATION AND HYPERPARAMETER TUNING")
print("=" * 70)


cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)


rf_tuning_pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "classifier",
            RandomForestClassifier(
                class_weight="balanced",
                random_state=42,
                n_jobs=-1
            )
        )
    ]
)


param_grid = {
    "classifier__n_estimators": [200, 300],
    "classifier__max_depth": [None, 5, 10],
    "classifier__min_samples_split": [2, 5]
}


grid_search = GridSearchCV(
    estimator=rf_tuning_pipeline,
    param_grid=param_grid,
    scoring="roc_auc",
    cv=cv,
    n_jobs=-1,
    verbose=1
)


start_time = time.time()

grid_search.fit(X_train, y_train)

tuning_time = time.time() - start_time


print("\nTuning completed!")
print(f"Tuning time: {tuning_time:.2f} seconds")

print("\nBest Parameters:")
print(grid_search.best_params_)

print("\nBest Cross-Validation ROC-AUC:")
print(f"{grid_search.best_score_:.4f}")


# Best tuned model
tuned_rf_model = grid_search.best_estimator_

# %%
# ============================================
# CHUNK 16 - MODEL EVALUATION
# ============================================

print("=" * 70)
print("MODEL PERFORMANCE COMPARISON")
print("=" * 70)


# Evaluate tuned Random Forest
tuned_rf_pred = tuned_rf_model.predict(X_test)
tuned_rf_prob = tuned_rf_model.predict_proba(X_test)[:, 1]


# Create results table
results = pd.DataFrame({
    "Model": [
        "Logistic Regression",
        "Random Forest",
        "XGBoost",
        "LightGBM",
        "Tuned Random Forest"
    ],

    "Accuracy": [
        accuracy_score(y_test, logistic_pred),
        accuracy_score(y_test, rf_pred),
        accuracy_score(y_test, xgb_pred),
        accuracy_score(y_test, lgb_pred),
        accuracy_score(y_test, tuned_rf_pred)
    ],

    "Precision": [
        precision_score(y_test, logistic_pred),
        precision_score(y_test, rf_pred),
        precision_score(y_test, xgb_pred),
        precision_score(y_test, lgb_pred),
        precision_score(y_test, tuned_rf_pred)
    ],

    "Recall": [
        recall_score(y_test, logistic_pred),
        recall_score(y_test, rf_pred),
        recall_score(y_test, xgb_pred),
        recall_score(y_test, lgb_pred),
        recall_score(y_test, tuned_rf_pred)
    ],

    "F1": [
        f1_score(y_test, logistic_pred),
        f1_score(y_test, rf_pred),
        f1_score(y_test, xgb_pred),
        f1_score(y_test, lgb_pred),
        f1_score(y_test, tuned_rf_pred)
    ],

    "ROC-AUC": [
        roc_auc_score(y_test, logistic_prob),
        roc_auc_score(y_test, rf_prob),
        roc_auc_score(y_test, xgb_prob),
        roc_auc_score(y_test, lgb_prob),
        roc_auc_score(y_test, tuned_rf_prob)
    ],

    "PR-AUC": [
        average_precision_score(y_test, logistic_prob),
        average_precision_score(y_test, rf_prob),
        average_precision_score(y_test, xgb_prob),
        average_precision_score(y_test, lgb_prob),
        average_precision_score(y_test, tuned_rf_prob)
    ]
})


# Round values
results = results.round(4)


display(results)


# Find best model according to ROC-AUC
best_model_name = results.loc[
    results["ROC-AUC"].idxmax(),
    "Model"
]

best_auc = results["ROC-AUC"].max()


print("\nBest model based on test ROC-AUC:")
print(best_model_name)

print(f"ROC-AUC: {best_auc:.4f}")

# %%
# ============================================
# CHUNK 17 - CONFUSION MATRICES
# ============================================

print("=" * 70)
print("CONFUSION MATRICES")
print("=" * 70)


model_predictions = {
    "Logistic Regression": logistic_pred,
    "Random Forest": rf_pred,
    "XGBoost": xgb_pred,
    "LightGBM": lgb_pred,
    "Tuned Random Forest": tuned_rf_pred
}


for model_name, predictions in model_predictions.items():

    cm = confusion_matrix(y_test, predictions)

    plt.figure(figsize=(6, 5))

    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=["Good (0)", "Bad (1)"],
        yticklabels=["Good (0)", "Bad (1)"]
    )

    plt.title(f"Confusion Matrix - {model_name}")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")

    plt.show()

# %%
# ============================================
# CHUNK 18 - ROC CURVES
# ============================================

print("=" * 70)
print("ROC CURVE COMPARISON")
print("=" * 70)


model_probabilities = {
    "Logistic Regression": logistic_prob,
    "Random Forest": rf_prob,
    "XGBoost": xgb_prob,
    "LightGBM": lgb_prob,
    "Tuned Random Forest": tuned_rf_prob
}


plt.figure(figsize=(10, 7))


for model_name, probabilities in model_probabilities.items():

    fpr, tpr, _ = roc_curve(
        y_test,
        probabilities
    )

    auc_value = roc_auc_score(
        y_test,
        probabilities
    )

    plt.plot(
        fpr,
        tpr,
        label=f"{model_name} (AUC = {auc_value:.3f})"
    )


# Random classifier baseline
plt.plot(
    [0, 1],
    [0, 1],
    linestyle="--",
    label="Random Classifier"
)


plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")

plt.title("ROC Curve Comparison")

plt.legend()

plt.grid(True)

plt.show()

# %%
# ============================================
# CHUNK 19 - PRECISION-RECALL CURVES
# ============================================

print("=" * 70)
print("PRECISION-RECALL CURVE COMPARISON")
print("=" * 70)

plt.figure(figsize=(10, 7))

for model_name, probabilities in model_probabilities.items():

    precision, recall, _ = precision_recall_curve(
        y_test,
        probabilities
    )

    ap_value = average_precision_score(
        y_test,
        probabilities
    )

    plt.plot(
        recall,
        precision,
        label=f"{model_name} (AP = {ap_value:.3f})"
    )


plt.xlabel("Recall")
plt.ylabel("Precision")
plt.title("Precision-Recall Curve Comparison")

plt.legend()
plt.grid(True)

plt.show()

# %%
# ============================================
# CHUNK 20 - SELECT BEST MODEL
# ============================================

print("=" * 70)
print("SELECTING BEST MODEL")
print("=" * 70)


trained_models = {
    "Logistic Regression": logistic_model,
    "Random Forest": random_forest_model,
    "XGBoost": xgb_model,
    "LightGBM": lightgbm_model,
    "Tuned Random Forest": tuned_rf_model
}


model_probability_data = {
    "Logistic Regression": logistic_prob,
    "Random Forest": rf_prob,
    "XGBoost": xgb_prob,
    "LightGBM": lgb_prob,
    "Tuned Random Forest": tuned_rf_prob
}


# Select according to ROC-AUC
best_model_name = results.loc[
    results["ROC-AUC"].idxmax(),
    "Model"
]

best_model = trained_models[best_model_name]
best_model_probabilities = model_probability_data[best_model_name]

best_model_predictions = (
    best_model.predict(X_test)
)


print("Best Model:")
print(best_model_name)

print(
    f"\nTest ROC-AUC: "
    f"{roc_auc_score(y_test, best_model_probabilities):.4f}"
)

print(
    f"Test Accuracy: "
    f"{accuracy_score(y_test, best_model_predictions):.4f}"
)

print(
    f"Test F1 Score: "
    f"{f1_score(y_test, best_model_predictions):.4f}"
)

# %%
# ============================================
# CHUNK 21 - SHAP EXPLAINABILITY
# ============================================

print("=" * 70)
print("SHAP EXPLAINABILITY")
print("=" * 70)


# Transform training and test data
preprocessor_fitted = best_model.named_steps["preprocessor"]
classifier = best_model.named_steps["classifier"]


X_train_transformed = preprocessor_fitted.transform(X_train)
X_test_transformed = preprocessor_fitted.transform(X_test)


# Get feature names
feature_names = preprocessor_fitted.get_feature_names_out()


# Convert to DataFrame
X_train_shap = pd.DataFrame(
    X_train_transformed,
    columns=feature_names
)

X_test_shap = pd.DataFrame(
    X_test_transformed,
    columns=feature_names
)


print("Transformed feature shape:")
print(X_test_shap.shape)


# --------------------------------------------
# Select appropriate SHAP explainer
# --------------------------------------------

if isinstance(classifier, LogisticRegression):

    explainer = shap.LinearExplainer(
        classifier,
        X_train_shap
    )

    shap_values = explainer.shap_values(
        X_test_shap
    )

    shap_values_for_plot = shap_values

else:

    explainer = shap.TreeExplainer(
        classifier
    )

    shap_values = explainer.shap_values(
        X_test_shap
    )

    # Handle different SHAP versions
    if isinstance(shap_values, list):
        shap_values_for_plot = shap_values[1]
    elif len(np.array(shap_values).shape) == 3:
        shap_values_for_plot = shap_values[:, :, 1]
    else:
        shap_values_for_plot = shap_values


print("SHAP values calculated successfully!")


# --------------------------------------------
# SHAP Summary Plot
# --------------------------------------------

plt.figure(figsize=(10, 8))

shap.summary_plot(
    shap_values_for_plot,
    X_test_shap,
    show=False
)

plt.title(
    f"SHAP Feature Importance - {best_model_name}"
)

plt.tight_layout()
plt.show()

# %%
# ============================================
# CHUNK 22 - INDIVIDUAL SHAP EXPLANATION
# ============================================

print("=" * 70)
print("INDIVIDUAL APPLICANT SHAP EXPLANATION")
print("=" * 70)


# Select one test applicant
applicant_index = 0

applicant_original = X_test.iloc[
    [applicant_index]
].copy()


applicant_transformed = preprocessor_fitted.transform(
    applicant_original
)

applicant_transformed = pd.DataFrame(
    applicant_transformed,
    columns=feature_names
)


# Calculate SHAP values for applicant
if isinstance(classifier, LogisticRegression):

    applicant_shap_values = explainer.shap_values(
        applicant_transformed
    )

else:

    applicant_shap_values = explainer.shap_values(
        applicant_transformed
    )

    if isinstance(applicant_shap_values, list):
        applicant_shap_values = applicant_shap_values[1]

    elif len(np.array(applicant_shap_values).shape) == 3:
        applicant_shap_values = applicant_shap_values[:, :, 1]


# Flatten
applicant_shap_values = np.array(
    applicant_shap_values
).reshape(-1)


# Display applicant
print("Applicant:")
display(applicant_original)


# Prediction
applicant_probability = best_model.predict_proba(
    applicant_original
)[0, 1]

applicant_prediction = best_model.predict(
    applicant_original
)[0]


print("\nPredicted Risk:")

if applicant_prediction == 1:
    print("BAD / HIGHER RISK")
else:
    print("GOOD / LOWER RISK")


print(
    f"Probability of bad risk: "
    f"{applicant_probability:.4f}"
)


# SHAP waterfall
shap_explanation = shap.Explanation(
    values=applicant_shap_values,
    base_values=explainer.expected_value[1]
    if isinstance(explainer.expected_value, (list, np.ndarray))
    else explainer.expected_value,
    data=applicant_transformed.iloc[0].values,
    feature_names=feature_names
)


plt.figure(figsize=(10, 7))

shap.plots.waterfall(
    shap_explanation,
    max_display=15,
    show=False
)

plt.title("Individual SHAP Explanation")

plt.tight_layout()
plt.show()

# %%
# ============================================
# CHUNK 23 - LIME EXPLAINABILITY
# ============================================

print("=" * 70)
print("LIME EXPLAINABILITY")
print("=" * 70)


# --------------------------------------------
# Prepare LIME data
# --------------------------------------------

lime_training_data = np.asarray(
    X_train_transformed
)

lime_test_data = np.asarray(
    X_test_transformed
)


# --------------------------------------------
# LIME prediction function
# --------------------------------------------

def lime_predict_proba(data):

    data = np.asarray(data)

    return classifier.predict_proba(data)


# --------------------------------------------
# Create LIME explainer
# --------------------------------------------

lime_explainer = LimeTabularExplainer(
    training_data=lime_training_data,
    feature_names=list(feature_names),
    class_names=[
        "Good Risk",
        "Bad Risk"
    ],
    mode="classification",
    discretize_continuous=True,
    random_state=42
)


# --------------------------------------------
# Explain the same applicant
# --------------------------------------------

lime_explanation = lime_explainer.explain_instance(
    lime_test_data[applicant_index],
    lime_predict_proba,
    num_features=15
)


print("LIME explanation generated successfully!")


# --------------------------------------------
# Display explanation
# --------------------------------------------

from IPython.display import display, HTML

lime_html = lime_explanation.as_html()

display(HTML(lime_html))

# %%
# ============================================
# CHUNK 24 - SHAP VS LIME COMPARISON
# ============================================

print("=" * 70)
print("SHAP VS LIME COMPARISON")
print("=" * 70)


# Extract LIME explanation
lime_list = lime_explanation.as_list()


lime_df = pd.DataFrame(
    lime_list,
    columns=[
        "Feature",
        "LIME Weight"
    ]
)

lime_df["Absolute LIME Weight"] = (
    lime_df["LIME Weight"].abs()
)


# SHAP importance for this applicant
shap_df = pd.DataFrame({
    "Feature": feature_names,
    "SHAP Value": applicant_shap_values
})

shap_df["Absolute SHAP Value"] = (
    shap_df["SHAP Value"].abs()
)


# Top SHAP features
top_shap = (
    shap_df
    .sort_values(
        "Absolute SHAP Value",
        ascending=False
    )
    .head(10)
)


# Top LIME features
top_lime = (
    lime_df
    .sort_values(
        "Absolute LIME Weight",
        ascending=False
    )
    .head(10)
)


print("\nTop SHAP Features:")
display(top_shap)


print("\nTop LIME Features:")
display(top_lime)


# --------------------------------------------
# Simple comparison visualization
# --------------------------------------------

plt.figure(figsize=(10, 6))

plt.barh(
    top_shap["Feature"].iloc[::-1],
    top_shap["Absolute SHAP Value"].iloc[::-1]
)

plt.xlabel("Absolute SHAP Value")
plt.ylabel("Feature")
plt.title("Top Features According to SHAP")

plt.tight_layout()
plt.show()

# %%
# ============================================
# CHUNK 25 - COUNTERFACTUAL EXPLANATION
# ============================================

print("=" * 70)
print("COUNTERFACTUAL EXPLANATION")
print("=" * 70)


# --------------------------------------------
# Function to search for counterfactual
# --------------------------------------------

def find_counterfactual(
    model,
    original_applicant,
    df_reference,
    max_candidates=3000
):

    original = original_applicant.copy()

    original_prediction = int(
        model.predict(original)[0]
    )

    original_probability = float(
        model.predict_proba(original)[0, 1]
    )

    # We want the opposite class
    desired_class = 1 - original_prediction

    candidates = []

    # Numeric candidate values
    numeric_values = {}

    for column in NUMERIC_FEATURES:

        values = sorted(
            df_reference[column]
            .dropna()
            .unique()
        )

        # Use quantile-based values
        if len(values) > 20:
            values = np.unique(
                np.quantile(
                    values,
                    np.linspace(
                        0.05,
                        0.95,
                        10
                    )
                ).round(2)
            )

        numeric_values[column] = values


    # Categorical values
    categorical_values = {}

    for column in CATEGORICAL_FEATURES:

        categorical_values[column] = (
            df_reference[column]
            .dropna()
            .unique()
            .tolist()
        )


    # ----------------------------------------
    # Generate candidates
    # ----------------------------------------

    candidate_list = []

    # Change one numerical feature at a time
    for column in NUMERIC_FEATURES:

        for value in numeric_values[column]:

            candidate = original.copy()
            candidate[column] = value

            candidate_list.append(candidate)


    # Change one categorical feature at a time
    # Sex is intentionally NOT changed.
    for column in CATEGORICAL_FEATURES:

        if column == "Sex":
            continue

        for value in categorical_values[column]:

            candidate = original.copy()
            candidate[column] = value

            candidate_list.append(candidate)


    # Change pairs of features
    # Limit the number for speed.
    for i in range(
        min(len(candidate_list), max_candidates)
    ):

        candidate = candidate_list[i]

        prediction = int(
            model.predict(candidate)[0]
        )

        probability = float(
            model.predict_proba(candidate)[0, 1]
        )

        if prediction == desired_class:

            # Calculate simple number of changed features
            changes = 0

            for column in FEATURES:

                if candidate.iloc[0][column] != original.iloc[0][column]:
                    changes += 1

            candidates.append({
                "Applicant": candidate.iloc[0],
                "Prediction": prediction,
                "Probability_Bad": probability,
                "Number_of_Changes": changes
            })


    if len(candidates) == 0:

        return None, original_prediction, original_probability


    # Prefer the smallest number of changes
    candidates = sorted(
        candidates,
        key=lambda x: (
            x["Number_of_Changes"],
            abs(
                x["Probability_Bad"]
                - (0.5)
            )
        )
    )

    best_candidate = candidates[0]

    return (
        best_candidate["Applicant"].to_frame().T,
        original_prediction,
        original_probability
    )


# --------------------------------------------
# Run counterfactual
# --------------------------------------------

counterfactual, original_prediction, original_probability = (
    find_counterfactual(
        best_model,
        applicant_original,
        df,
        max_candidates=3000
    )
)


print("Original Applicant:")
display(applicant_original)


print(
    f"Original probability of bad risk: "
    f"{original_probability:.4f}"
)


if counterfactual is None:

    print(
        "\nNo counterfactual was found "
        "using the tested single-feature changes."
    )

else:

    print("\nCounterfactual Applicant:")
    display(counterfactual)


    counterfactual_probability = (
        best_model.predict_proba(
            counterfactual
        )[0, 1]
    )

    counterfactual_prediction = (
        best_model.predict(
            counterfactual
        )[0]
    )


    print(
        f"\nCounterfactual probability of bad risk: "
        f"{counterfactual_probability:.4f}"
    )


    print("\nChanges:")

    for column in FEATURES:

        old_value = applicant_original.iloc[0][column]
        new_value = counterfactual.iloc[0][column]

        if old_value != new_value:

            print(
                f"{column}: "
                f"{old_value} → {new_value}"
            )

# %%
# ============================================
# CHUNK 26 - FAIRNESS ANALYSIS
# ============================================

print("=" * 70)
print("FAIRNESS ANALYSIS")
print("=" * 70)


# --------------------------------------------
# Prepare sensitive feature
# --------------------------------------------

sensitive_feature = X_test["Sex"].reset_index(drop=True)

fairness_predictions = pd.Series(
    best_model_predictions
).reset_index(drop=True)

fairness_actual = pd.Series(
    y_test.values
).reset_index(drop=True)


print("Sex groups:")
print(sensitive_feature.value_counts())


# --------------------------------------------
# Group-level metrics
# --------------------------------------------

fairness_rows = []


for group in sensitive_feature.unique():

    mask = sensitive_feature == group

    group_actual = fairness_actual[mask]
    group_prediction = fairness_predictions[mask]

    positive_prediction_rate = (
        group_prediction.mean()
    )

    true_positive_rate = (
        ((group_prediction == 1) &
         (group_actual == 1)).sum()
        /
        max((group_actual == 1).sum(), 1)
    )

    false_positive_rate = (
        ((group_prediction == 1) &
         (group_actual == 0)).sum()
        /
        max((group_actual == 0).sum(), 1)
    )

    fairness_rows.append({
        "Sex": group,
        "Number of Applicants": mask.sum(),
        "Positive Prediction Rate": positive_prediction_rate,
        "TPR": true_positive_rate,
        "FPR": false_positive_rate
    })


fairness_table = pd.DataFrame(
    fairness_rows
)


display(
    fairness_table.round(4)
)


# --------------------------------------------
# Fairlearn metrics
# --------------------------------------------

try:

    demographic_parity = (
        demographic_parity_difference(
            fairness_actual,
            fairness_predictions,
            sensitive_features=sensitive_feature
        )
    )

    equalized_odds = (
        equalized_odds_difference(
            fairness_actual,
            fairness_predictions,
            sensitive_features=sensitive_feature
        )
    )


    print(
        f"\nDemographic Parity Difference: "
        f"{demographic_parity:.4f}"
    )

    print(
        f"Equalized Odds Difference: "
        f"{equalized_odds:.4f}"
    )


except Exception as e:

    print(
        "\nFairlearn metric calculation failed:"
    )

    print(e)


# --------------------------------------------
# Visualize prediction rate by Sex
# --------------------------------------------

plt.figure(figsize=(8, 5))

sns.barplot(
    data=fairness_table,
    x="Sex",
    y="Positive Prediction Rate"
)

plt.title(
    "Positive Prediction Rate by Sex"
)

plt.xlabel("Sex")
plt.ylabel("Positive Prediction Rate")

plt.show()

# %%
# ============================================
# CHUNK 27 - USER INPUT CREDIT DECISION
# ============================================

print("=" * 70)
print("CREDIT SCORING - ENTER YOUR OWN APPLICANT DETAILS")
print("=" * 70)

# --------------------------------------------
# Show available choices
# --------------------------------------------

print("\nAvailable values in the dataset:")

for column in CATEGORICAL_FEATURES:
    print(f"\n{column}:")
    print(df[column].dropna().unique())


# --------------------------------------------
# User inputs
# --------------------------------------------

age = int(input("\nEnter Age: "))

job = int(input(
    "Enter Job level (0, 1, 2, 3, etc.): "
))

sex = input(
    "Enter Sex: "
).strip().lower()

housing = input(
    "Enter Housing: "
).strip().lower()

saving_account = input(
    "Enter Saving accounts: "
).strip().lower()

checking_account = input(
    "Enter Checking account: "
).strip().lower()

credit_amount = float(input(
    "Enter Credit amount: "
))

duration = int(input(
    "Enter Duration in months: "
))

purpose = input(
    "Enter Purpose: "
).strip().lower()


# --------------------------------------------
# Create applicant
# --------------------------------------------

my_applicant = pd.DataFrame([{
    "Age": age,
    "Job": job,
    "Sex": sex,
    "Housing": housing,
    "Saving accounts": saving_account,
    "Checking account": checking_account,
    "Credit amount": credit_amount,
    "Duration": duration,
    "Purpose": purpose
}])


# --------------------------------------------
# Display entered information
# --------------------------------------------

print("\n" + "=" * 70)
print("YOUR APPLICANT INFORMATION")
print("=" * 70)

display(my_applicant)


# --------------------------------------------
# Prediction
# --------------------------------------------

probability_bad = best_model.predict_proba(
    my_applicant
)[0, 1]

prediction = best_model.predict(
    my_applicant
)[0]


# --------------------------------------------
# Decision
# --------------------------------------------

if prediction == 1:
    decision = "BAD / HIGHER CREDIT RISK"
else:
    decision = "GOOD / LOWER CREDIT RISK"


print("\n" + "=" * 70)
print("CREDIT DECISION")
print("=" * 70)

print(
    f"Probability of GOOD risk : "
    f"{1 - probability_bad:.2%}"
)

print(
    f"Probability of BAD risk  : "
    f"{probability_bad:.2%}"
)

print(
    f"\nMODEL DECISION: {decision}"
)

# %%
# ============================================
# CHUNK 28 - NEW APPLICANT EXPLANATION
# ============================================

print("=" * 70)
print("NEW APPLICANT EXPLANATION")
print("=" * 70)


# Transform applicant
new_applicant_transformed = (
    preprocessor_fitted.transform(
        new_applicant
    )
)

new_applicant_transformed = pd.DataFrame(
    new_applicant_transformed,
    columns=feature_names
)


# SHAP values
if isinstance(classifier, LogisticRegression):

    new_shap_values = explainer.shap_values(
        new_applicant_transformed
    )

else:

    new_shap_values = explainer.shap_values(
        new_applicant_transformed
    )

    if isinstance(new_shap_values, list):

        new_shap_values = new_shap_values[1]

    elif len(np.array(new_shap_values).shape) == 3:

        new_shap_values = new_shap_values[:, :, 1]


new_shap_values = np.array(
    new_shap_values
).reshape(-1)


# Top influencing features
new_shap_table = pd.DataFrame({
    "Feature": feature_names,
    "SHAP Value": new_shap_values,
    "Absolute Importance": np.abs(new_shap_values)
})


new_shap_table = (
    new_shap_table
    .sort_values(
        "Absolute Importance",
        ascending=False
    )
    .head(10)
)


print("Top factors influencing this decision:")

display(
    new_shap_table.round(4)
)


# Waterfall
new_expected_value = (
    explainer.expected_value
)

if isinstance(
    new_expected_value,
    (list, np.ndarray)
):

    new_expected_value = new_expected_value[1]


new_explanation = shap.Explanation(
    values=new_shap_values,
    base_values=new_expected_value,
    data=new_applicant_transformed.iloc[0].values,
    feature_names=feature_names
)


plt.figure(figsize=(10, 7))

shap.plots.waterfall(
    new_explanation,
    max_display=15,
    show=False
)

plt.title(
    "SHAP Explanation for New Applicant"
)

plt.tight_layout()

plt.show()

# %%
# ============================================
# CHUNK 29 - FINAL PERFORMANCE SUMMARY
# ============================================

print("=" * 70)
print("FINAL MODEL PERFORMANCE SUMMARY")
print("=" * 70)


final_results = results.copy()

final_results = final_results.sort_values(
    by="ROC-AUC",
    ascending=False
).reset_index(drop=True)


display(final_results)


print("\nBest model:")
print(final_results.loc[0, "Model"])

print(
    f"Best ROC-AUC: "
    f"{final_results.loc[0, 'ROC-AUC']:.4f}"
)

print(
    f"Best F1 Score: "
    f"{final_results.loc[0, 'F1']:.4f}"
)

# %%
# ============================================
# CHUNK 30 - PERFORMANCE VS INTERPRETABILITY
# ============================================

print("=" * 70)
print("PERFORMANCE VS INTERPRETABILITY")
print("=" * 70)


# Measure SHAP explanation time for each model
explanation_times = {}


for model_name, model in trained_models.items():

    try:

        model_preprocessor = (
            model.named_steps["preprocessor"]
        )

        model_classifier = (
            model.named_steps["classifier"]
        )

        transformed_sample = (
            model_preprocessor.transform(
                X_test.iloc[:50]
            )
        )

        feature_names_model = (
            model_preprocessor
            .get_feature_names_out()
        )

        transformed_sample = pd.DataFrame(
            transformed_sample,
            columns=feature_names_model
        )


        start = time.time()

        if isinstance(
            model_classifier,
            LogisticRegression
        ):

            model_explainer = shap.LinearExplainer(
                model_classifier,
                transformed_sample
            )

            model_explainer.shap_values(
                transformed_sample
            )

        else:

            model_explainer = shap.TreeExplainer(
                model_classifier
            )

            model_explainer.shap_values(
                transformed_sample
            )


        elapsed = time.time() - start

        explanation_times[model_name] = elapsed


    except Exception as e:

        explanation_times[model_name] = np.nan

        print(
            f"Could not calculate SHAP time "
            f"for {model_name}: {e}"
        )


performance_interpretability = final_results[
    ["Model", "ROC-AUC"]
].copy()


performance_interpretability[
    "SHAP Explanation Time (50 samples)"
] = (
    performance_interpretability["Model"]
    .map(explanation_times)
)


display(
    performance_interpretability
)


# Plot
plot_data = performance_interpretability.dropna()


plt.figure(figsize=(9, 6))

plt.scatter(
    plot_data[
        "SHAP Explanation Time (50 samples)"
    ],
    plot_data["ROC-AUC"]
)


for _, row in plot_data.iterrows():

    plt.annotate(
        row["Model"],
        (
            row[
                "SHAP Explanation Time (50 samples)"
            ],
            row["ROC-AUC"]
        )
    )


plt.xlabel(
    "SHAP Explanation Time for 50 Samples (seconds)"
)

plt.ylabel("Test ROC-AUC")

plt.title(
    "Performance vs Practical Explanation Cost"
)

plt.grid(True)

plt.show()

# %%
# ============================================
# CHUNK 31 - FINAL PROJECT SUMMARY
# ============================================

print("=" * 80)
print("EXPLAINABLE AI FOR CREDIT SCORING")
print("FINAL PROJECT SUMMARY")
print("=" * 80)


print("\n1. DATASET")
print("-" * 80)
print(f"Number of observations: {len(df)}")
print(f"Number of features: {len(FEATURES)}")


print("\n2. TARGET")
print("-" * 80)
print("good = 0")
print("bad  = 1")


print("\n3. TRAIN / TEST SPLIT")
print("-" * 80)
print(f"Training samples: {len(X_train)}")
print(f"Testing samples : {len(X_test)}")
print("Split: 80% training / 20% testing")
print("Stratification: Yes")
print("Random state: 42")


print("\n4. MODELS")
print("-" * 80)

for model_name in trained_models.keys():
    print("-", model_name)


print("\n5. MODEL PERFORMANCE")
print("-" * 80)

display(
    final_results.round(4)
)


print("\n6. BEST MODEL")
print("-" * 80)
print(best_model_name)

print(
    f"ROC-AUC: "
    f"{roc_auc_score(y_test, best_model_probabilities):.4f}"
)


print("\n7. EXPLAINABILITY")
print("-" * 80)
print("✓ SHAP global explanation")
print("✓ SHAP individual explanation")
print("✓ LIME individual explanation")
print("✓ SHAP vs LIME comparison")
print("✓ Counterfactual explanation")


print("\n8. FAIRNESS")
print("-" * 80)
print("✓ Analysis by Sex")
print("✓ Positive prediction rates")
print("✓ True Positive Rate")
print("✓ False Positive Rate")
print("✓ Demographic parity")
print("✓ Equalized odds")


print("\n9. APPLICANT DECISION")
print("-" * 80)
print("✓ Applicant-level prediction")
print("✓ Probability of bad risk")
print("✓ Model decision")
print("✓ Explanation of decision")


print("\n" + "=" * 80)
print("PROJECT COMPLETED")
print("=" * 80)


