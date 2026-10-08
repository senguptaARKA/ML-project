# CrediTrust AI — Explainable AI for Credit Risk Management

A modern, accessible, and user-friendly FinTech web frontend and decision-support platform designed for bank loan officers, risk managers, and credit applicants.

---

## 🌐 Live Development Servers

- **Web Frontend:** [http://localhost:3000/](http://localhost:3000/)
- **Backend ML API:** [http://localhost:8000/](http://localhost:8000/)
  - Health check: `GET http://localhost:8000/health`
  - Dataset & Model Metrics: `GET http://localhost:8000/data`
  - Predictive Inference & SHAP: `POST http://localhost:8000/predict`

---

## 🏛️ Project Architecture

```
d:/ML project/
├── german_credit_data.csv          # Benchmark dataset (1,000 applicants)
├── ECS.py                          # Full Python ML & XAI pipeline
├── export_data.py                  # Extraction script for ground-truth metrics
├── backend_data.json               # Exported metrics & model benchmarks
├── server.py                       # Zero-dependency Python ML API server
└── frontend/                       # Modern React + TypeScript Web App
    ├── package.json
    ├── vite.config.ts              # Vite 5 + API Proxy configuration
    ├── tailwind.config.js          # FinTech design tokens & palette
    ├── src/
    │   ├── types/index.ts          # Complete TypeScript domain interfaces
    │   ├── services/
    │   │   ├── api.ts              # Hybrid API service with live/offline fallback
    │   │   └── localModel.ts       # Calibrated client-side inference engine
    │   ├── components/
    │   │   ├── common/             # Navbar, Sidebar, KpiCard, RiskBadge, HelpModal
    │   │   ├── dashboard/          # Executive dashboard & portfolio charts
    │   │   ├── assessment/         # Multi-step applicant form & decision memos
    │   │   ├── explainability/     # Top factors, SHAP chart, LIME, Counterfactuals
    │   │   ├── performance/        # Benchmark table, ROC/PR curves, Confusion matrix
    │   │   ├── fairness/           # Demographic parity & Equalized odds audit
    │   │   ├── dataset/            # 8 interactive German Credit analytics charts
    │   │   └── about/              # End-to-end ML pipeline architecture
    │   └── App.tsx                 # App coordinator & navigation state
```

---

## 🚀 Key Features & Highlights

### 1. FinTech / Banking Aesthetics & Accessibility
- **WCAG 2.1 AA Compliant:** High-contrast color palette with white/light backgrounds and dark navy accents (`#0F172A`, `#1E3A8A`).
- **No Color-Only Indicators:** Every risk assessment uses text labels + visual icons + colored badges together.
- **Accessible Navigation:** Complete keyboard navigation, visible focus indicators, and semantic ARIA labeling.

### 2. Multi-Step Credit Risk Assessment
- Collects the 9 exact features from the German Credit model:
  - **Personal:** Age, Employment Skill Level (Job), Sex
  - **Financial:** Credit Amount, Loan Duration
  - **Banking History:** Housing Status, Checking Account Balance, Savings Account Balance
  - **Loan Purpose:** Car, Furniture, Radio/TV, Education, Business, etc.
- **1-Click Profile Presets:** Pre-fills realistic Low Risk, Moderate Risk, and Elevated Risk profiles for rapid testing.
- **Friendly Validation:** Inline, human-friendly guidance rather than technical stack traces.

### 3. Clear, Human-Readable Predictions
- Translates raw model numbers into clear banking decisions:
  - **GOOD CREDIT RISK** (e.g. 78.4% Confidence, 21.6% Bad Risk)
  - **HIGHER CREDIT RISK** (e.g. 72.1% High Risk)
- Dual-probability visual gauge bar showing both probabilities simultaneously.
- Formal banking decision memo with printable export support.

### 4. Transparent Explainability (XAI)
- **Top Risk Drivers & Mitigating Strengths:** Plain-English explanations generated from SHAP values.
- **Interactive SHAP Waterfall / Impact Chart:** Horizontal bar chart sorted by absolute feature importance with expandable "What does this mean?" guides.
- **LIME Surrogate Comparison:** Switch between SHAP, LIME, and Side-by-Side consensus views.
- **Counterfactual Recourse ("What could change this decision?"):** Actionable table showing hypothetical changes (e.g., reduce loan amount from ₹8,000 to ₹5,000) with an interactive **"What-If" loan terms simulator**.

### 5. Benchmark Performance & Explainability Trade-Off
- Interactive model comparison table covering **Logistic Regression, Random Forest, XGBoost, LightGBM, and Tuned Random Forest**.
- **ROC Curves & Precision-Recall Curves** with hover tooltips and baseline reference.
- **Interactive Confusion Matrix** with Type I (False Positive) and Type II (False Negative) error diagnostics.
- **Performance vs Explainability Cost:** Scatter plot demonstrating the practical engineering trade-off between ROC-AUC and real-time SHAP computation time.

### 6. Algorithmic Fairness & Bias Governance
- Audits disparate impact across applicant **Sex** under the Equal Credit Opportunity Act (ECOA).
- Interactive evaluations of **Demographic Parity Difference (0.08)** and **Equalized Odds Difference (0.09)** with regulatory tolerance thresholds.
- Group-level comparative charts for Positive Prediction Rate, True Positive Rate (Sensitivity), and False Positive Rate.

### 7. German Credit Dataset Analytics
- 8 interactive data visualizations exploring cohort distributions:
  1. Credit Risk Distribution (70% Good / 30% Bad)
  2. Age Distribution Histogram
  3. Credit Amount Distribution
  4. Credit Amount by Risk
  5. Loan Duration by Risk
  6. Risk by Sex
  7. Risk by Housing Status
  8. Risk by Loan Purpose

---

## 🛠️ How to Run Locally

### Start the Python ML API Server
```bash
python server.py
# Server will listen on http://localhost:8000
```

### Start the React Web Frontend
```bash
cd frontend
npm run dev
# Vite development server will listen on http://localhost:3000
```

Both servers run independently with automatic reconnection. When the Python server is offline, the frontend seamlessly uses its calibrated in-browser scoring engine with zero downtime.
