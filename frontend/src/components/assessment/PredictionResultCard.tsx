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
    <div className="bg-white rounded-2xl border border-[#E0E4DD] shadow-xs overflow-hidden animate-fade-in">
      {/* Visual Header Banner */}
      <div
        className={`p-6 sm:p-8 border-b ${
          isGood
            ? 'bg-[#EDF5F0] border-[#DCE8DF] text-[#102F29]'
            : 'bg-[#FAF0F0] border-[#F2D5D4] text-[#202C28]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                isGood
                  ? 'bg-[#287653] text-white'
                  : 'bg-[#B64D49] text-white'
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
                  <span className="text-[11px] font-semibold bg-[#DCE8DF] text-[#173F35] px-2 py-0.5 rounded-md border border-[#315F50]/20">
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
              className="p-2 text-[#68736D] hover:text-[#202C28] bg-white rounded-lg border border-[#E0E4DD] transition-colors shadow-2xs"
              title="Print official credit assessment memo"
              aria-label="Print assessment memo"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onNewAssessment}
              className="text-xs font-semibold px-3.5 py-2 bg-white hover:bg-[#F8F8F4] rounded-lg border border-[#E0E4DD] text-[#202C28] transition-colors shadow-2xs"
            >
              Assess Another
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Large Visual Probability Indicator */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#849087] mb-2">
            Model Confidence & Calibrated Probabilities
          </h4>
          <ProbabilityGauge
            probGood={result.probability_good}
            probBad={result.probability_bad}
            dominantRisk={result.risk}
          />
        </div>

        {/* Structured Decision Summary Table */}
        <div className="bg-[#F8F8F4] rounded-xl p-5 border border-[#E0E4DD]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#202C28] mb-3 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#173F35]" />
            Official Decision Summary
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg border border-[#E0E4DD]">
              <span className="text-[11px] font-semibold text-[#849087] block uppercase">Decision</span>
              <span
                className={`font-bold text-sm block mt-0.5 ${
                  isGood ? 'text-[#287653]' : 'text-[#B64D49]'
                }`}
              >
                {result.risk_label}
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E0E4DD]">
              <span className="text-[11px] font-semibold text-[#849087] block uppercase">Confidence</span>
              <span className="font-bold text-sm text-[#202C28] block mt-0.5">
                {confidencePct}%
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E0E4DD]">
              <span className="text-[11px] font-semibold text-[#849087] block uppercase">Model Engine</span>
              <span className="font-bold text-sm text-[#202C28] block mt-0.5">
                {result.model}
              </span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-[#E0E4DD]">
              <span className="text-[11px] font-semibold text-[#849087] block uppercase">Assessment Status</span>
              <span className="font-semibold text-xs text-[#68736D] block mt-0.5 truncate" title={result.assessment_status}>
                {result.assessment_status}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Highlights of Top Explaining Factors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Factors Increasing Risk */}
          <div className="p-4 rounded-xl border border-[#F2D5D4] bg-[#FAF0F0]/60">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#B64D49] flex items-center gap-1.5 mb-2.5">
              <AlertTriangle className="w-4 h-4 text-[#B64D49]" />
              Primary Risk Drivers
            </h5>
            <ul className="space-y-2 text-xs text-[#202C28]">
              {result.factors_increasing_risk.slice(0, 2).map((factor, i) => (
                <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-[#F2D5D4]/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B64D49] mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#202C28] block">{factor.feature}</span>
                    <span className="text-[#68736D] leading-snug">{factor.explanation}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Factors Reducing Risk */}
          <div className="p-4 rounded-xl border border-[#DCE8DF] bg-[#EDF5F0]/60">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#287653] flex items-center gap-1.5 mb-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#287653]" />
              Primary Mitigating Strengths
            </h5>
            <ul className="space-y-2 text-xs text-[#202C28]">
              {result.factors_reducing_risk.slice(0, 2).map((factor, i) => (
                <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-[#DCE8DF]/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#287653] mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#202C28] block">{factor.feature}</span>
                    <span className="text-[#68736D] leading-snug">{factor.explanation}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Regulatory & Institutional Disclaimer */}
        <div className="p-4 rounded-xl bg-[#F1F5F0] border border-[#DCE8DF] text-xs text-[#68736D]">
          <p className="font-semibold text-[#202C28] mb-0.5">Mandatory Decision-Support Notice:</p>
          <p className="leading-relaxed">
            This prediction is an algorithmic decision-support tool and should not be used as the sole basis for lending decisions. Complies with the Equal Credit Opportunity Act (ECOA) and Fair Credit Reporting Act (FCRA). Requires final sign-off by a qualified credit underwriter.
          </p>
        </div>

        {/* CTA to Full Explainability Deep Dive */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[#849087]">
            Audit feature attributions, SHAP waterfall, LIME alternatives, and actionable counterfactuals.
          </span>
          <button
            onClick={onExploreExplainability}
            className="w-full sm:w-auto px-6 py-3 bg-[#173F35] hover:bg-[#102F29] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#DCE8DF]" />
            <span>Why did the model make this decision? (Explainability)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
