import React from 'react';
import {
  PredictionResult,
} from '../../types';
import {
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Printer,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { ProbabilityGauge } from '../common/ProbabilityGauge';

interface PredictionResultCardProps {
  result: PredictionResult;
  onExploreExplainability: () => void;
  onNewAssessment: () => void;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  result,
  onExploreExplainability,
  onNewAssessment,
}) => {
  const isGood = result.risk === 'good';
  const confidence = isGood ? result.probability_good : result.probability_bad;
  const confidencePct = Math.round(confidence * 1000) / 10;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      {/* Visual Header Banner */}
      <div
        className={`p-6 sm:p-8 border-b ${
          isGood
            ? 'bg-emerald-50/70 border-emerald-100 text-emerald-950'
            : 'bg-rose-50/70 border-rose-100 text-rose-950'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                isGood
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {isGood ? (
                <ShieldCheck className="w-8 h-8" aria-hidden="true" />
              ) : (
                <ShieldAlert className="w-8 h-8" aria-hidden="true" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <RiskBadge risk={result.risk} size="lg" />
                {result.source === 'backend_live' && (
                  <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                    Live Server Verified
                  </span>
                )}
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                {isGood ? 'APPROVED: LOW RISK PROFILE' : 'ACTION REQUIRED: ELEVATED RISK'}
              </p>
              <p className="text-xs sm:text-sm font-medium opacity-80 mt-0.5">
                {result.assessment_status}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white rounded-xl border border-slate-200 transition-colors shadow-2xs"
              title="Print official credit assessment memo"
              aria-label="Print assessment memo"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onNewAssessment}
              className="text-xs font-semibold px-3 py-2 bg-white/80 hover:bg-white rounded-xl border border-slate-200 text-slate-700 transition-colors shadow-2xs"
            >
              Assess Another
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Large Visual Probability Indicator */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Model Confidence & Calibrated Probabilities
          </h4>
          <ProbabilityGauge
            probGood={result.probability_good}
            probBad={result.probability_bad}
            dominantRisk={result.risk}
          />
        </div>

        {/* Structured Decision Summary Table */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-900" />
            Official Decision Summary
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Decision</span>
              <span
                className={`font-bold text-sm block mt-0.5 ${
                  isGood ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {result.risk_label}
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Confidence</span>
              <span className="font-bold text-sm text-slate-900 block mt-0.5">
                {confidencePct}%
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Model Engine</span>
              <span className="font-bold text-sm text-slate-900 block mt-0.5">
                {result.model}
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">Assessment Status</span>
              <span className="font-semibold text-xs text-slate-700 block mt-0.5 truncate" title={result.assessment_status}>
                {result.assessment_status}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Highlights of Top Explaining Factors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Factors Increasing Risk */}
          <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50">
            <h5 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Primary Risk Drivers
            </h5>
            <ul className="space-y-2 text-xs text-slate-700">
              {result.factors_increasing_risk.slice(0, 2).map((factor, i) => (
                <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-rose-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">{factor.feature}</span>
                    <span className="text-slate-600 leading-snug">{factor.explanation}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Factors Reducing Risk */}
          <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Primary Mitigating Strengths
            </h5>
            <ul className="space-y-2 text-xs text-slate-700">
              {result.factors_reducing_risk.slice(0, 2).map((factor, i) => (
                <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">{factor.feature}</span>
                    <span className="text-slate-600 leading-snug">{factor.explanation}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Regulatory & Institutional Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-600">
          <p className="font-semibold text-slate-800 mb-0.5">Mandatory Decision-Support Notice:</p>
          <p className="leading-relaxed">
            This prediction is an algorithmic decision-support tool and should not be used as the sole basis for lending decisions. Complies with the Equal Credit Opportunity Act (ECOA) and Fair Credit Reporting Act (FCRA). Requires final sign-off by a qualified credit underwriter.
          </p>
        </div>

        {/* CTA to Full Explainability Deep Dive */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Audit feature attributions, SHAP waterfall, LIME alternatives, and actionable counterfactuals.
          </span>
          <button
            onClick={onExploreExplainability}
            className="w-full sm:w-auto px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Why did the model make this decision? (Explainability)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
