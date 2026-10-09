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
      color: 'bg-white text-[#202C28] border-[#E0E4DD]',
      iconColor: 'text-[#173F35]',
    },
    {
      num: 2,
      title: 'Data Preprocessing',
      desc: 'Median & mode missing-value imputation',
      icon: Filter,
      color: 'bg-white text-[#202C28] border-[#E0E4DD]',
      iconColor: 'text-[#173F35]',
    },
    {
      num: 3,
      title: 'Feature Transformation',
      desc: 'StandardScaler + OneHotEncoder pipeline',
      icon: Sliders,
      color: 'bg-white text-[#202C28] border-[#E0E4DD]',
      iconColor: 'text-[#173F35]',
    },
    {
      num: 4,
      title: 'ML Model Inference',
      desc: 'Tuned Random Forest ensemble prediction',
      icon: Cpu,
      color: 'bg-[#102F29] text-white border-[#102F29]',
      iconColor: 'text-[#DCE8DF]',
    },
    {
      num: 5,
      title: 'Risk Prediction',
      desc: 'Calibrated Good vs Bad probability output',
      icon: ShieldAlert,
      color: 'bg-white text-[#202C28] border-[#E0E4DD]',
      iconColor: 'text-[#A88955]',
    },
    {
      num: 6,
      title: 'SHAP & LIME XAI',
      desc: 'Local feature attribution & Shapley values',
      icon: Sparkles,
      color: 'bg-white text-[#202C28] border-[#E0E4DD]',
      iconColor: 'text-[#173F35]',
    },
    {
      num: 7,
      title: 'Fairness Evaluation',
      desc: 'Demographic parity & equalized odds check',
      icon: Scale,
      color: 'bg-[#EDF5F0] text-[#102F29] border-[#DCE8DF]',
      iconColor: 'text-[#287653]',
    },
    {
      num: 8,
      title: 'Transparent Decision Support',
      desc: 'Auditable adverse action recourse memo',
      icon: CheckCircle2,
      color: 'bg-[#173F35] text-white border-[#173F35]',
      iconColor: 'text-[#DCE8DF]',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Visual Pipeline Flow */}
      <div className="bg-white rounded-2xl border border-[#E0E4DD] p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#202C28]">
            End-to-End Explainable AI Architecture
          </h3>
          <p className="text-xs text-[#68736D] mt-0.5">
            Step-by-step financial underwriting data pipeline from applicant submission to auditable decision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => {
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
                    <Icon className={`w-4 h-4 ${step.iconColor}`} aria-hidden="true" />
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
      <div className="bg-white rounded-2xl border border-[#E0E4DD] p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-[#202C28]">
          Model Feature Specifications & Preprocessing Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Numerical Features */}
          <div className="p-5 rounded-xl border border-[#E0E4DD] bg-[#F8F8F4] space-y-3">
            <h4 className="font-bold text-sm text-[#202C28] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#173F35]" />
              Numerical Features (Standard Scaled)
            </h4>
            <ul className="space-y-2 text-[#202C28]">
              <li className="flex justify-between p-2 rounded-lg bg-white border border-[#E0E4DD]">
                <strong>Age</strong>
                <span className="text-[#68736D]">Applicant age in years (19–75)</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-white border border-[#E0E4DD]">
                <strong>Job</strong>
                <span className="text-[#68736D]">Employment skill tier (0, 1, 2, 3)</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-white border border-[#E0E4DD]">
                <strong>Credit amount</strong>
                <span className="text-[#68736D]">Requested loan principal in ₹ (₹250–₹18,424)</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-white border border-[#E0E4DD]">
                <strong>Duration</strong>
                <span className="text-[#68736D]">Loan repayment duration (4–72 months)</span>
              </li>
            </ul>
            <p className="text-[11px] text-[#849087] pt-1">
              Imputation: <code className="bg-[#E0E4DD]/60 px-1 py-0.5 rounded">SimpleImputer(strategy='median')</code> &bull; Transformation: <code className="bg-[#E0E4DD]/60 px-1 py-0.5 rounded">StandardScaler()</code>
            </p>
          </div>

          {/* Categorical Features */}
          <div className="p-5 rounded-xl border border-[#E0E4DD] bg-[#F8F8F4] space-y-3">
            <h4 className="font-bold text-sm text-[#202C28] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#173F35]" />
              Categorical Features (One-Hot Encoded)
            </h4>
            <ul className="space-y-2 text-[#202C28]">
              <li className="flex justify-between p-2 rounded-lg bg-white border border-[#E0E4DD]">
                <strong>Sex</strong>
                <span className="text-[#68736D]">male, female (audited for fairness)</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-white border border-[#E0E4DD]">
                <strong>Housing</strong>
                <span className="text-[#68736D]">own, rent, free</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-white border border-[#E0E4DD]">
                <strong>Saving accounts</strong>
                <span className="text-[#68736D]">little, moderate, quite rich, rich, NA</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-white border border-[#E0E4DD]">
                <strong>Checking account</strong>
                <span className="text-[#68736D]">little, moderate, rich, NA</span>
              </li>
              <li className="flex justify-between p-2 rounded-lg bg-white border border-[#E0E4DD]">
                <strong>Purpose</strong>
                <span className="text-[#68736D]">car, furniture, radio/TV, education, business...</span>
              </li>
            </ul>
            <p className="text-[11px] text-[#849087] pt-1">
              Imputation: <code className="bg-[#E0E4DD]/60 px-1 py-0.5 rounded">SimpleImputer(strategy='most_frequent')</code> &bull; Encoding: <code className="bg-[#E0E4DD]/60 px-1 py-0.5 rounded">OneHotEncoder(handle_unknown='ignore')</code>
            </p>
          </div>
        </div>
      </div>

      {/* Security & Privacy Notice */}
      <div className="bg-white rounded-2xl border border-[#E0E4DD] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#173F35]" />
          <h3 className="text-lg font-bold text-[#202C28]">
            Data Privacy & Model Governance Policy
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#68736D] leading-relaxed">
          <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E0E4DD] space-y-2">
            <h5 className="font-bold text-[#202C28]">Applicant Privacy Protection</h5>
            <p>
              Applicant information is processed strictly in-memory solely for real-time credit-risk assessment. No personally identifiable credentials or unencrypted loan requests are stored in URLs or shared with unauthorized third-party trackers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E0E4DD] space-y-2">
            <h5 className="font-bold text-[#202C28]">Regulatory Model Disclaimer</h5>
            <p>
              This machine learning model serves as an algorithmic decision-support tool to accelerate credit underwriting. All automated assessments are subject to manual underwriter review and adhere to the Equal Credit Opportunity Act (ECOA) and Basel III credit risk standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
