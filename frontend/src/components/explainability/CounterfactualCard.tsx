import React, { useState } from 'react';
import { CounterfactualResult, ApplicantInput } from '../../types';
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface CounterfactualCardProps {
  counterfactual: CounterfactualResult;
  currentApplicant: ApplicantInput;
  isBadRisk: boolean;
  onSimulateChange?: (simulatedApplicant: ApplicantInput) => void;
}

export const CounterfactualCard: React.FC<CounterfactualCardProps> = ({
  counterfactual,
  currentApplicant,
  isBadRisk,
  onSimulateChange,
}) => {
  const [simulatedAmount, setSimulatedAmount] = useState<number>(
    currentApplicant['Credit amount']
  );
  const [simulatedDuration, setSimulatedDuration] = useState<number>(
    currentApplicant.Duration
  );

  const handleApplySimulation = () => {
    if (onSimulateChange) {
      onSimulateChange({
        ...currentApplicant,
        ['Credit amount']: simulatedAmount,
        Duration: simulatedDuration,
      });
    }
  };

  const origProbPct = Math.round(counterfactual.original_probability_bad * 1000) / 10;
  const targetProbPct = Math.round(counterfactual.counterfactual_probability_bad * 1000) / 10;

  return (
    <div className="bg-white rounded-2xl border border-[#E0E4DD] p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#E0E4DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#173F35]" />
            <h3 className="text-lg font-bold text-[#202C28]">
              What could change this decision? (Counterfactual Recourse)
            </h3>
          </div>
          <p className="text-xs text-[#68736D] mt-0.5">
            Prescriptive explainability identifying minimum actionable changes to alter the underwriting outcome.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#F1F5F0] text-[#173F35] rounded-lg border border-[#DCE8DF]">
            Adverse Action Compliant
          </span>
        </div>
      </div>

      {/* Main Counterfactual Table */}
      <div className="bg-[#F8F8F4] rounded-xl p-5 border border-[#E0E4DD] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#849087]">
            Actionable Adjustment Levers
          </span>
          <span className="text-xs font-semibold text-[#68736D]">
            Current Risk Score: <strong className="text-[#202C28]">{origProbPct}%</strong>
          </span>
        </div>

        <div className="border border-[#E0E4DD] rounded-xl overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F1F5F0] text-[#68736D] uppercase font-bold border-b border-[#E0E4DD]">
              <tr>
                <th className="px-4 py-3">Applicant Parameter</th>
                <th className="px-4 py-3">Current Application Value</th>
                <th className="px-4 py-3">Suggested Feasible Adjustment</th>
                <th className="px-4 py-3">Action Intent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E4DD]">
              {counterfactual.changes.map((change, idx) => (
                <tr key={idx} className="hover:bg-[#F8F8F4] transition-colors">
                  <td className="px-4 py-3.5 font-bold text-[#202C28] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#173F35]" />
                    {change.feature}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-[#68736D] bg-[#F8F8F4]/50">
                    {change.from}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-[#287653] bg-[#EDF5F0]/40">
                    {change.to}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-[#F1F5F0] text-[#202C28] uppercase border border-[#E0E4DD]">
                      {change.direction || 'Adjust'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Potential Outcome Banner */}
        <div className="p-4 rounded-xl bg-[#EDF5F0] border border-[#DCE8DF] text-[#102F29] text-xs">
          <div className="flex items-center gap-2 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-[#287653]" />
            <span>Potential Recourse Outcome</span>
          </div>
          <p className="leading-relaxed text-[#202C28] font-medium">
            {counterfactual.potential_outcome}
          </p>
          <div className="mt-2 pt-2 border-t border-[#DCE8DF] flex items-center justify-between text-[11px] font-semibold text-[#287653]">
            <span>Original Default Risk: {origProbPct}%</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Counterfactual Adjusted Risk: {targetProbPct}%</span>
          </div>
        </div>
      </div>

      {/* Interactive What-If Simulator */}
      <div className="bg-white rounded-xl border border-[#E0E4DD] p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#173F35]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#202C28]">
              Interactive "What-If" Loan Terms Simulator
            </h4>
          </div>
          <span className="text-[11px] text-[#849087] font-medium">
            Test loan structuring options live
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Slider 1: Credit Amount */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[#202C28]">Simulate Loan Amount:</span>
              <span className="text-[#173F35] font-bold font-mono">
                ₹{simulatedAmount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max={Math.max(30000, Math.min(2000000, Math.round(currentApplicant['Credit amount'] * 1.5)))}
              step={simulatedAmount > 100000 ? 10000 : 500}
              value={simulatedAmount}
              onChange={(e) => setSimulatedAmount(Number(e.target.value))}
              className="w-full accent-[#173F35] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#849087] mt-1">
              <span>₹500</span>
              <span>₹{Math.round(Math.max(30000, Math.min(2000000, currentApplicant['Credit amount'] * 1.5)) / 2).toLocaleString()}</span>
              <span>₹{Math.max(30000, Math.min(2000000, Math.round(currentApplicant['Credit amount'] * 1.5))).toLocaleString()}</span>
            </div>
          </div>

          {/* Slider 2: Duration */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[#202C28]">Simulate Duration:</span>
              <span className="text-[#173F35] font-bold font-mono">
                {simulatedDuration} Months
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="60"
              step="6"
              value={simulatedDuration}
              onChange={(e) => setSimulatedDuration(Number(e.target.value))}
              className="w-full accent-[#173F35] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#849087] mt-1">
              <span>6 mos</span>
              <span>24 mos</span>
              <span>60 mos</span>
            </div>
          </div>
        </div>

        {onSimulateChange && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleApplySimulation}
              className="px-4 py-2 bg-[#173F35] hover:bg-[#102F29] text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#DCE8DF]" />
              <span>Re-evaluate with These Simulated Terms</span>
            </button>
          </div>
        )}
      </div>

      {/* Mandatory Regulatory Notice */}
      <div className="p-4 rounded-xl bg-[#F2EBDD]/60 border border-[#A88955]/30 text-xs text-[#202C28] flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-[#B17B35] mt-0.5 shrink-0" />
        <div className="leading-relaxed">
          <strong className="font-semibold block mb-0.5 text-[#202C28]">Hypothetical Simulation Disclaimer:</strong>
          This counterfactual analysis is an algorithmic exploration of model sensitivity to help loan officers formulate transparent adverse action feedback. It is strictly a hypothetical scenario and does <strong>NOT</strong> constitute a binding pre-approval or guaranteed lending agreement.
        </div>
      </div>
    </div>
  );
};
