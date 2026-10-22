# %% [markdown]
# 
# # Explainable AI for Credit Scoring using InterpretML
# 
# **How to use:**
# 
# - Kernel: select the `interpretml` conda environment kernel.
# 
# - Run cells top-to-bottom (Shift+Enter).
# 
# 
# This notebook will try to download the realistic OpenML dataset `credit-g`. If internet is unavailable, it will fall back to a synthetic dataset so the demo runs offline.
# 
# 
# It trains an Explainable Boosting Machine (EBM) and shows global & local explanations. If the interactive `show()` UI doesn't open, the notebook saves HTML files you can open in a browser.
# 

# %%
# Cell 1: imports & basic config
import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report
import matplotlib.pyplot as plt

# InterpretML imports
from interpret.glassbox import ExplainableBoostingClassifier
from interpret import show

# For reproducibility
RANDOM_STATE = 42
np.random.seed(RANDOM_STATE)

print('Python ready. NumPy:', np.__version__)
try:
    import interpret
    print('InterpretML version:', interpret.__version__)
except Exception as e:
    print('InterpretML import error:', e)


# %%
# Cell 2: Load dataset
from sklearn.datasets import fetch_openml
import pandas as pd

print("Attempting to download credit-g from OpenML...")
data = fetch_openml("credit-g", version=1, as_frame=True)
df = data.frame
print(f"Loaded credit-g with shape: {df.shape}")
print("Dataset ready. Shape:", df.shape)
display(df.head())


# %%
# Cell 3: quick EDA
print('Shape:', df.shape)
try:
    display(df.describe(include='all').T)
except Exception:
    print(df.head())
print('\nTarget distribution (proportion):')
print(df['class'].value_counts(normalize=True))


# %%
# Cell 4: Preprocessing & train-test split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import pandas as pd

RANDOM_STATE = 42

# Identify categorical columns automatically (object or category dtype)
cat_cols = df.select_dtypes(include=['object','category']).columns.tolist()
print('Categorical columns detected:', cat_cols)

# Remove target variable 'class' from features
cat_cols.remove('class')

X = df.drop("class", axis=1)
y = df["class"].map({'good':0, 'bad':1})  # convert to numeric

# Build preprocessor: one-hot for categorical, passthrough for numeric
preprocessor = ColumnTransformer([
    ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), cat_cols)
], remainder='passthrough')


# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
)

# Ensure y_train/y_test are numeric Series
y_train = pd.Series(y_train, name='target')
y_test  = pd.Series(y_test, name='target')

print('Train shape:', X_train.shape, 'Test shape:', X_test.shape)


# %%
#Cell 5: Train EBM with readable feature names

from interpret.glassbox import ExplainableBoostingClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, roc_auc_score
import numpy as np

# --- Flatten target arrays ---
y_train_flat = np.array(y_train)
y_test_flat = np.array(y_test)

# --- Initialize pipeline ---
ebm = ExplainableBoostingClassifier(random_state=RANDOM_STATE)
pipe = Pipeline([('prep', preprocessor), ('model', ebm)])

# --- Fit pipeline ---
pipe.fit(X_train, y_train_flat)
trained_ebm = pipe.named_steps['model']

# --- Extract readable feature names after fitting ---
ohe = pipe.named_steps['prep'].named_transformers_['cat']
encoded_cat_names = ohe.get_feature_names_out(cat_cols)
numeric_cols = [col for col in X.columns if col not in cat_cols]
final_feature_names = list(encoded_cat_names) + numeric_cols

# --- Evaluate ---
y_pred = pipe.predict(X_test)
y_proba = pipe.predict_proba(X_test)[:, 1]

print('Accuracy:', accuracy_score(y_test_flat, y_pred))
print('ROC AUC:', roc_auc_score(y_test_flat, y_proba))

# --- Sample feature names ---
print("\nSample feature names:")
for i, name in enumerate(final_feature_names[:20]):
    print(i, name)


# %%
#Cell 6: Global explanation + visual

from interpret import show

# Generate global explanation
ebm_global = trained_ebm.explain_global()

# Assign readable feature names
ebm_global.data()['names'] = final_feature_names

# Show interactive global explanation
try:
    show(ebm_global, title='EBM Global Explanation (Readable Features)', open_browser=True, port=9090)
    print('Attempted to open interactive UI on port 9090.')
except Exception as e:
    print('show() failed to open UI:', e)



# %%
from interpret import show

# Generate global explanation
ebm_global = trained_ebm.explain_global()

# Assign readable feature names
ebm_global.data()['names'] = final_feature_names

# Show interactive global explanation
try:
    show(ebm_global, title='EBM Global Explanation (Readable Features)', open_browser=True, port=9090)
    print('Attempted to open interactive UI on port 9090.')
except Exception as e:
    print('show() failed to open UI:', e)


# %%
# Cell 8: Local explanations for a few test samples
# Select first 5 test samples
X_test_small = X_test.iloc[:5]
y_test_small = y_test.iloc[:5]

# Explain locally using the original DataFrame (not transformed)
local_exp = trained_ebm.explain_local(X_test_small, y_test_small)

# Assign readable feature names
local_exp.data()['names'] = final_feature_names

# Show local explanation
try:
    show(local_exp)
except Exception as e:
    print('show(local_exp) failed:', e)
    try:
        local_html = local_exp.visualize()
        with open('ebm_local.html', 'w', encoding='utf-8') as f:
            f.write(local_html)
        print('✅ Saved local explanation to ebm_local.html')
    except Exception as ee:
        print('Could not save local explanation HTML:', ee)

print('\nSample inputs (first 5 rows):')
display(X_test_small)

print('\nModel predicted probabilities (first 5 rows):')
print(pipe.predict_proba(X_test_small)[:,1])



# %%
# Cell 9: Save pipeline and explanation objects
import joblib, os
os.makedirs('outputs', exist_ok=True)
joblib.dump(pipe, 'outputs/ebm_pipeline.joblib')
joblib.dump(ebm_global, 'outputs/ebm_global.joblib')
print('Saved pipeline and global explanation to outputs/')


# %%
# -------------------------------
# Final Report: Model Metrics, Features & Risky Applicants
# -------------------------------
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from interpret import show
from sklearn.metrics import accuracy_score, roc_auc_score, confusion_matrix, classification_report

# --- Safety check: ensure all needed objects exist ---
required_vars = ['pipe', 'X_test', 'y_test', 'ebm_global', 'trained_ebm', 'final_feature_names']
missing = [v for v in required_vars if v not in globals()]
if missing:
    raise RuntimeError(f"Missing variables {missing}. Please run all previous cells (training + global explanation) before this final report cell.")

# --- 1. Model Predictions & Metrics ---
y_pred = pipe.predict(X_test)
y_proba = pipe.predict_proba(X_test)[:, 1]

print("=== Model Metrics ===")
print("Accuracy:", accuracy_score(y_test, y_pred))
print("ROC AUC:", roc_auc_score(y_test, y_proba))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# --- 2. Global Feature Importance ---
ebm_data = ebm_global.data()
feature_names = ebm_data['names']  # EBM-aligned feature names
feat_scores = ebm_data['scores']

# Ensure lengths match
min_len = min(len(feature_names), len(feat_scores))
feature_names = feature_names[:min_len]
feat_scores = feat_scores[:min_len]

feat_df = pd.DataFrame({
    'Feature': feature_names,
    'Importance': feat_scores
}).sort_values(by='Importance', ascending=False).reset_index(drop=True)

print("\n=== Top 10 Global Features ===")
display(feat_df.head(10))

# Plot top 5 features
plt.figure(figsize=(8, 5))
plt.barh(
    feat_df.head(5)['Feature'][::-1],
    feat_df.head(5)['Importance'][::-1],
)
plt.xlabel('EBM Feature Importance')
plt.title('Top 5 Features Influencing Credit Default')
plt.tight_layout()
plt.show()

# Optional: Show interactive global dashboard
try:
    show(ebm_global)
except Exception as e:
    print("Interactive global dashboard could not be displayed:", e)

# --- 3. Identify Top Risky Applicants ---
# Select top risky applicants (predicted probability > 0.6)
risk_indices = [i for i, p in enumerate(y_proba) if p > 0.6]
X_risky = X_test.iloc[risk_indices[:5]]  # top 5 risky applicants

# Convert y_risky to a plain NumPy array (no categorical)
y_risky = y_test.iloc[risk_indices[:5]]
y_risky = y_risky.astype(int).to_numpy()

print("\nTop risky applicants (predicted probability > 0.6):")
display(X_risky)

# --- 4. Local Explanations for Risky Applicants ---
from interpret import show

# Transform X_risky using the same preprocessor used during training
X_risky_encoded = pipe.named_steps['prep'].transform(X_risky)

local_risky = trained_ebm.explain_local(X_risky_encoded, y_risky)

# Try interactive dashboard + safe HTML export
try:
    # Try to launch the interactive UI (may or may not open a browser)
    show(local_risky)

    # Try to get a visualizable object
    local_obj = local_risky.visualize()

    if isinstance(local_obj, str):
        # It's raw HTML
        with open('ebm_local_risky.html', 'w', encoding='utf-8') as f:
            f.write(local_obj)
        print("Saved local explanation (HTML string) to ebm_local_risky.html")

    elif local_obj is not None:
        # It's probably a Plotly Figure
        import plotly.io as pio
        pio.write_html(local_obj, file='ebm_local_risky.html', auto_open=False)
        print("Saved local explanation (Plotly figure) to ebm_local_risky.html")

    else:
        # visualize() returned None
        print("visualize() returned None; skipping HTML export for local explanations.")

except Exception as e:
    print("Local explanations could not be displayed or saved:", e)



# --- 5. Summary ---
print("\nSummary:")
print("- EBM achieved reasonable performance for interpretable credit scoring.")
print("- Top global features identified and plotted.")
print("- Local explanations highlight why each risky applicant is predicted as risky.")
print("- HTML dashboards saved for both global and local views (if visualize() succeeded).")


# %%



