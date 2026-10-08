import React from 'react';
import {
  FileText,
  Filter,
  Sliders,
  Cpu,
  ShieldAlert,
  Sparkles,
  Scale,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';

export const PipelineDiagram: React.FC = () => {
  const steps = [
    {
      num: 1,
      title: 'Applicant Data',
      desc: '9 financial & personal parameters ingested',
      icon: FileText,
      color: 'bg-blue-50 text-blue-900 border-blue-200',
    },
    {
      num: 2,
      title: 'Data Preprocessing',
      desc: 'Median & mode missing-value imputation',
      icon: Filter,
      color: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    },
    {
      num: 3,
      title: 'Feature Transformation',
      desc: 'StandardScaler + OneHotEncoder pipeline',
      icon: Sliders,
      color: 'bg-cyan-50 text-cyan-900 border-cyan-200',
    },
    {
      num: 4,
      title: 'ML Model Inference',
      desc: 'Tuned Random Forest ensemble prediction',
      icon: Cpu,
      color: 'bg-blue-900 text-white border-blue-900',
    },
    {
      num: 5,
      title: 'Risk Prediction',
      desc: 'Calibrated Good vs Bad probability output',
      icon: ShieldAlert,
      color: 'bg-amber-50 text-amber-900 border-amber-200',
    },
    {
      num: 6,
      title: 'SHAP & LIME XAI',
      desc: 'Local feature attribution & Shapley values',
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-900 border-purple-200',
    },
    {
      num: 7,
      title: 'Fairness Evaluation',
      desc: 'Demographic parity & equalized odds check',
      icon: Scale,
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    },
    {
      num: 8,
      title: 'Transparent Decision Support',
      desc: 'Auditable adverse action recourse memo',
      icon: CheckCircle2,
      color: 'bg-emerald-700 text-white border-emerald-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Visual Pipeline Flow */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            End-to-End Explainable AI Architecture
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step financial underwriting data pipeline from applicant submission to auditable decision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all hover:shadow-xs ${step.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-70">
                      Phase 0{step.num}
                    </span>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <h4 className="font-bold text-sm leading-snug">{step.title}</h4>
                  <p className="text-xs mt-1 opacity-80 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Specification Guide */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-slate-900">
          Model Feature Specifications & Preprocessing Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Numerical Features */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-900" />
              Numerical Features (Standard Scaled)
            </h4>
            <ul className="space-y-2 text-slate-700">
              <li className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                <strong>Age</strong>
                <span className="text-slate-500">Applicant age in years (19–75)</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                <strong>Job</strong>
                <span className="text-slate-500">Employment skill tier (0, 1, 2, 3)</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                <strong>Credit amount</strong>
                <span className="text-slate-500">Requested loan principal in ₹ (₹250–₹18,424)</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                <strong>Duration</strong>
                <span className="text-slate-500">Loan repayment duration (4–72 months)</span>
              </li>
            </ul>
            <p className="text-[11px] text-slate-500 pt-1">
              Imputation: <code>SimpleImputer(strategy='median')</code> &bull; Transformation: <code>StandardScaler()</code>
            </p>
          </div>

          {/* Categorical Features */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-900" />
              Categorical Features (One-Hot Encoded)
            </h4>
            <ul className="space-y-2 text-slate-700">
              <li className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                <strong>Sex</strong>
                <span className="text-slate-500">male, female (audited for fairness)</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                <strong>Housing</strong>
                <span className="text-slate-500">own, rent, free</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                <strong>Saving accounts</strong>
                <span className="text-slate-500">little, moderate, quite rich, rich, NA</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                <strong>Checking account</strong>
                <span className="text-slate-500">little, moderate, rich, NA</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-white border border-slate-200">
                <strong>Purpose</strong>
                <span className="text-slate-500">car, furniture, radio/TV, education, business...</span>
              </li>
            </ul>
            <p className="text-[11px] text-slate-500 pt-1">
              Imputation: <code>SimpleImputer(strategy='most_frequent')</code> &bull; Encoding: <code>OneHotEncoder(handle_unknown='ignore')</code>
            </p>
          </div>
        </div>
      </div>

      {/* Security & Privacy Notice */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-900" />
          <h3 className="text-lg font-bold text-slate-900">
            Data Privacy & Model Governance Policy
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h5 className="font-bold text-slate-900">Applicant Privacy Protection</h5>
            <p>
              Applicant information is processed strictly in-memory solely for real-time credit-risk assessment. No personally identifiable credentials or unencrypted loan requests are stored in URLs or shared with unauthorized third-party trackers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h5 className="font-bold text-slate-900">Regulatory Model Disclaimer</h5>
            <p>
              This machine learning model serves as an algorithmic decision-support tool to accelerate credit underwriting. All automated assessments are subject to manual underwriter review and adhere to the Equal Credit Opportunity Act (ECOA) and Basel III credit risk standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
