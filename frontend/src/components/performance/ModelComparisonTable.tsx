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
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Model Performance & Benchmark Comparison
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluated on holdout testing cohort (20% stratified sample, 200 applicants)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            Champion Model: {bestModelName}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5">Model Architecture</th>
              <th className="px-4 py-3.5 text-center">Accuracy</th>
              <th className="px-4 py-3.5 text-center">Precision</th>
              <th className="px-4 py-3.5 text-center">Recall</th>
              <th className="px-4 py-3.5 text-center">F1 Score</th>
              <th className="px-4 py-3.5 text-center bg-blue-50/50 text-blue-900">ROC-AUC</th>
              <th className="px-4 py-3.5 text-center">PR-AUC</th>
              <th className="px-4 py-3.5 text-center">SHAP Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {models.map((m) => {
              const isBest = m.model === bestModelName;
              return (
                <tr
                  key={m.model}
                  className={`transition-colors ${
                    isBest ? 'bg-blue-50/40 font-semibold' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-5 py-4 text-slate-900 font-bold flex items-center gap-2">
                    {isBest && <Trophy className="w-4 h-4 text-amber-500 shrink-0" />}
                    <span>{m.model}</span>
                    {isBest && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-900 text-white uppercase ml-1">
                        Champion
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-slate-700">
                    {(m.accuracy * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-slate-700">
                    {m.precision.toFixed(3)}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-slate-700">
                    {m.recall.toFixed(3)}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-slate-700">
                    {m.f1.toFixed(3)}
                  </td>
                  <td className="px-4 py-4 text-center font-mono font-bold text-blue-900 bg-blue-50/30">
                    {m.roc_auc.toFixed(4)}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-slate-700">
                    {m.pr_auc.toFixed(3)}
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-slate-500">
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
