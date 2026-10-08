import React from 'react';
import { ShapFeature } from '../../types';
import { AlertCircle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

interface TopFactorsCardProps {
  factorsIncreasingRisk: ShapFeature[];
  factorsReducingRisk: ShapFeature[];
}

export const TopFactorsCard: React.FC<TopFactorsCardProps> = ({
  factorsIncreasingRisk,
  factorsReducingRisk,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Top Influencing Factors</h3>
          <p className="text-xs text-slate-500">
            Plain-language feature attributions calculated by the model's SHAP explainer.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            Elevating Risk
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Mitigating Risk
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Factors Increasing Risk */}
        <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-rose-100">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Factors Increasing Risk</h4>
              <p className="text-[11px] text-slate-500">Characteristics pushing towards caution</p>
            </div>
          </div>

          {factorsIncreasingRisk.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4">No major risk drivers identified.</p>
          ) : (
            <div className="space-y-3.5">
              {factorsIncreasingRisk.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-100 transition-all hover:bg-rose-50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                      {factor.feature}
                    </span>
                    <span className="text-xs font-bold text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200">
                      +{Math.round(factor.magnitude * 100)}% Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {factor.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Factors Reducing Risk */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-emerald-100">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Factors Reducing Risk</h4>
              <p className="text-[11px] text-slate-500">Applicant financial strengths</p>
            </div>
          </div>

          {factorsReducingRisk.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4">No major mitigating factors identified.</p>
          ) : (
            <div className="space-y-3.5">
              {factorsReducingRisk.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 transition-all hover:bg-emerald-50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      {factor.feature}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      -{Math.round(factor.magnitude * 100)}% Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {factor.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
