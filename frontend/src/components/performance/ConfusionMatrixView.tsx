import React, { useState } from 'react';
import { ConfusionMatrixData } from '../../types';
import { Grid, CheckCircle2, XCircle } from 'lucide-react';

interface ConfusionMatrixViewProps {
  matrices: Record<string, ConfusionMatrixData>;
}

export const ConfusionMatrixView: React.FC<ConfusionMatrixViewProps> = ({
  matrices,
}) => {
  const modelNames = Object.keys(matrices);
  const [selectedModel, setSelectedModel] = useState<string>(
    modelNames[modelNames.length - 1] || 'Tuned Random Forest'
  );

  const cm = matrices[selectedModel] || { tn: 104, fp: 36, fn: 15, tp: 45 };
  const total = cm.tn + cm.fp + cm.fn + cm.tp;
  const accuracy = ((cm.tn + cm.tp) / total) * 100;
  const sensitivity = (cm.tp / (cm.tp + cm.fn)) * 100; // Recall of bad loans
  const specificity = (cm.tn / (cm.tn + cm.fp)) * 100; // Correct identification of good loans

  return (
    <div className="bg-white rounded-2xl border border-[#E0E4DD] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0E4DD]">
        <div>
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-[#173F35]" />
            <h3 className="text-lg font-bold text-[#202C28]">
              Confusion Matrix & Error Analysis
            </h3>
          </div>
          <p className="text-xs text-[#68736D] mt-0.5">
            Audit Type I (False Positive) and Type II (False Negative) credit classification trade-offs.
          </p>
        </div>

        {/* Model Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="cm-model-select" className="text-xs font-semibold text-[#68736D]">
            Select Model:
          </label>
          <select
            id="cm-model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-1.5 bg-white border border-[#E0E4DD] rounded-lg text-xs font-semibold text-[#202C28] focus:border-[#173F35] focus:ring-1 focus:ring-[#173F35]"
          >
            {modelNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* 2x2 Grid Representation */}
        <div className="bg-[#F8F8F4] rounded-2xl p-6 border border-[#E0E4DD]">
          <div className="text-center text-xs font-bold uppercase tracking-wider text-[#849087] mb-4">
            Predicted Classification
          </div>

          <div className="flex">
            {/* Y Axis Label */}
            <div className="flex flex-col justify-around text-center pr-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#849087] -rotate-90">
                Actual
              </span>
            </div>

            <div className="flex-1 space-y-3">
              {/* Header column labels */}
              <div className="grid grid-cols-2 gap-3 text-center text-xs font-bold text-[#202C28]">
                <div>Predicted Good (0)</div>
                <div>Predicted Bad (1)</div>
              </div>

              {/* Row 1: Actual Good */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#EDF5F0] border border-[#DCE8DF] rounded-xl p-4 text-center">
                  <span className="text-[11px] font-bold text-[#287653] uppercase block">
                    True Negative (TN)
                  </span>
                  <span className="text-2xl font-extrabold text-[#173F35] block my-1">
                    {cm.tn}
                  </span>
                  <span className="text-[10px] text-[#287653]">
                    Correct Good Credit
                  </span>
                </div>

                <div className="bg-[#F2EBDD]/70 border border-[#A88955]/40 rounded-xl p-4 text-center">
                  <span className="text-[11px] font-bold text-[#B17B35] uppercase block">
                    False Positive (FP)
                  </span>
                  <span className="text-2xl font-extrabold text-[#202C28] block my-1">
                    {cm.fp}
                  </span>
                  <span className="text-[10px] text-[#B17B35]">
                    Good misclassified as Bad
                  </span>
                </div>
              </div>

              {/* Row 2: Actual Bad */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FAF0F0] border border-[#F2D5D4] rounded-xl p-4 text-center">
                  <span className="text-[11px] font-bold text-[#B64D49] uppercase block">
                    False Negative (FN)
                  </span>
                  <span className="text-2xl font-extrabold text-[#B64D49] block my-1">
                    {cm.fn}
                  </span>
                  <span className="text-[10px] text-[#B64D49]">
                    Default missed by model
                  </span>
                </div>

                <div className="bg-[#F1F5F0] border border-[#DCE8DF] rounded-xl p-4 text-center">
                  <span className="text-[11px] font-bold text-[#173F35] uppercase block">
                    True Positive (TP)
                  </span>
                  <span className="text-2xl font-extrabold text-[#173F35] block my-1">
                    {cm.tp}
                  </span>
                  <span className="text-[10px] text-[#315F50]">
                    Correct Bad Detected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Statistical Summary */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#202C28]">
            Portfolio Risk Diagnostic Metrics
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F8F8F4] border border-[#E0E4DD] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#202C28] block">Overall Test Accuracy</span>
                <span className="text-[#68736D]">Correct classifications over total sample</span>
              </div>
              <span className="text-base font-extrabold text-[#202C28] font-mono">
                {accuracy.toFixed(1)}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F8F4] border border-[#E0E4DD] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#202C28] block">Default Recall (Sensitivity)</span>
                <span className="text-[#68736D]">Proportion of actual bad loans successfully flagged</span>
              </div>
              <span className="text-base font-extrabold text-[#173F35] font-mono">
                {sensitivity.toFixed(1)}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8F8F4] border border-[#E0E4DD] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#202C28] block">Good Credit Specificity</span>
                <span className="text-[#68736D]">Proportion of sound applicants correctly passed</span>
              </div>
              <span className="text-base font-extrabold text-[#287653] font-mono">
                {specificity.toFixed(1)}%
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#849087] italic leading-relaxed">
            Note: In banking risk governance, high Default Recall is prioritized to minimize costly financial write-offs from unflagged loan defaults (False Negatives).
          </p>
        </div>
      </div>
    </div>
  );
};
