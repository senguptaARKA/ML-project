import React from 'react';
import { ModelMetric } from '../../types';
import { Trophy, CheckCircle, Zap } from 'lucide-react';

interface ModelComparisonTableProps {
  models: ModelMetric[];
  bestModelName: string;
}

export const ModelComparisonTable: React.FC<ModelComparisonTableProps> = ({
  models,
  bestModelName,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E4DD] overflow-hidden shadow-xs">
      <div className="p-6 border-b border-[#E0E4DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-[#202C28]">
            Model Performance & Benchmark Comparison
          </h3>
          <p className="text-xs text-[#68736D] mt-0.5">
            Evaluated on holdout testing cohort (20% stratified sample, 200 applicants)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F2EBDD] text-[#202C28] border border-[#A88955]/40">
            <Trophy className="w-3.5 h-3.5 text-[#A88955]" />
            Champion Model: {bestModelName}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#F1F5F0] text-[#68736D] uppercase font-bold border-b border-[#E0E4DD]">
            <tr>
              <th className="px-5 py-3.5">Model Architecture</th>
              <th className="px-4 py-3.5 text-center">Accuracy</th>
              <th className="px-4 py-3.5 text-center">Precision</th>
              <th className="px-4 py-3.5 text-center">Recall</th>
              <th className="px-4 py-3.5 text-center">F1 Score</th>
              <th className="px-4 py-3.5 text-center bg-[#EDF5F0] text-[#173F35]">ROC-AUC</th>
              <th className="px-4 py-3.5 text-center">PR-AUC</th>
              <th className="px-4 py-3.5 text-center">SHAP Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E4DD]">
            {models.map((m) => {
              const isBest = m.model === bestModelName;
              return (
                <tr
                  key={m.model}
                  className={`transition-colors ${
                    isBest ? 'bg-[#F1F5F0]/70 font-semibold' : 'hover:bg-[#F8F8F4]'
                  }`}
                >
                  <td className="px-5 py-4 text-[#202C28] font-bold flex items-center gap-2">
                    {isBest && <Trophy className="w-4 h-4 text-[#A88955] shrink-0" />}
                    <span>{m.model}</span>
                    {isBest && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#173F35] text-white uppercase ml-1">
                        Champion
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-[#202C28]">
                    {(m.accuracy * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-[#202C28]">
                    {m.precision.toFixed(3)}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-[#202C28]">
                    {m.recall.toFixed(3)}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-[#202C28]">
                    {m.f1.toFixed(3)}
                  </td>
                  <td className="px-4 py-4 text-center font-mono font-bold text-[#173F35] bg-[#EDF5F0]/60">
                    {m.roc_auc.toFixed(4)}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-[#202C28]">
                    {m.pr_auc.toFixed(3)}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-[#849087]">
                    {m.shap_time_50_samples ? `${m.shap_time_50_samples.toFixed(2)}s` : 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
