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
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-900" />
            <h3 className="text-lg font-bold text-slate-900">
              What could change this decision? (Counterfactual Recourse)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Prescriptive explainability identifying minimum actionable changes to alter the underwriting outcome.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
            Adverse Action Compliant
          </span>
        </div>
      </div>

      {/* Main Counterfactual Table */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Actionable Adjustment Levers
          </span>
          <span className="text-xs font-semibold text-slate-600">
            Current Risk Score: <strong className="text-slate-900">{origProbPct}%</strong>
          </span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Applicant Parameter</th>
                <th className="px-4 py-3">Current Application Value</th>
                <th className="px-4 py-3">Suggested Feasible Adjustment</th>
                <th className="px-4 py-3">Action Intent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {counterfactual.changes.map((change, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    {change.feature}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-700 bg-slate-50/50">
                    {change.from}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-emerald-800 bg-emerald-50/40">
                    {change.to}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-slate-100 text-slate-700 uppercase">
                      {change.direction || 'Adjust'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Potential Outcome Banner */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
          <div className="flex items-center gap-2 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Potential Recourse Outcome</span>
          </div>
          <p className="leading-relaxed text-emerald-800 font-medium">
            {counterfactual.potential_outcome}
          </p>
          <div className="mt-2 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
            <span>Original Default Risk: {origProbPct}%</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Counterfactual Adjusted Risk: {targetProbPct}%</span>
          </div>
        </div>
      </div>

      {/* Interactive What-If Simulator */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-900" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Interactive "What-If" Loan Terms Simulator
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Test loan structuring options live
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Slider 1: Credit Amount */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-slate-700">Simulate Loan Amount:</span>
              <span className="text-blue-950 font-bold font-mono">
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
              className="w-full accent-blue-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹500</span>
              <span>₹{Math.round(Math.max(30000, Math.min(2000000, currentApplicant['Credit amount'] * 1.5)) / 2).toLocaleString()}</span>
              <span>₹{Math.max(30000, Math.min(2000000, Math.round(currentApplicant['Credit amount'] * 1.5))).toLocaleString()}</span>
            </div>
          </div>

          {/* Slider 2: Duration */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-slate-700">Simulate Duration:</span>
              <span className="text-blue-950 font-bold font-mono">
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
              className="w-full accent-blue-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
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
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
              <span>Re-evaluate with These Simulated Terms</span>
            </button>
          </div>
        )}
      </div>

      {/* Mandatory Regulatory Notice */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div className="leading-relaxed">
          <strong className="font-semibold block mb-0.5">Hypothetical Simulation Disclaimer:</strong>
          This counterfactual analysis is an algorithmic exploration of model sensitivity to help loan officers formulate transparent adverse action feedback. It is strictly a hypothetical scenario and does <strong>NOT</strong> constitute a binding pre-approval or guaranteed lending agreement.
        </div>
      </div>
    </div>
  );
};
