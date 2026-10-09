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
          <h3 className="text-lg font-bold text-[#202C28]">Top Influencing Factors</h3>
          <p className="text-xs text-[#68736D]">
            Plain-language feature attributions calculated by the model's SHAP explainer.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-[#B64D49] bg-[#FAF0F0] px-2.5 py-1 rounded-full border border-[#F2D5D4]">
            <span className="w-2 h-2 rounded-full bg-[#B64D49]" />
            Elevating Risk
          </span>
          <span className="flex items-center gap-1.5 text-[#287653] bg-[#EDF5F0] px-2.5 py-1 rounded-full border border-[#DCE8DF]">
            <span className="w-2 h-2 rounded-full bg-[#287653]" />
            Mitigating Risk
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Factors Increasing Risk */}
        <div className="bg-white rounded-2xl border border-[#F2D5D4] p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F2D5D4]/60">
            <div className="p-2 rounded-xl bg-[#FAF0F0] text-[#B64D49]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#202C28] text-sm">Factors Increasing Risk</h4>
              <p className="text-[11px] text-[#849087]">Characteristics pushing towards caution</p>
            </div>
          </div>

          {factorsIncreasingRisk.length === 0 ? (
            <p className="text-xs text-[#849087] italic py-4">No major risk drivers identified.</p>
          ) : (
            <div className="space-y-3.5">
              {factorsIncreasingRisk.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FAF0F0]/60 border border-[#F2D5D4] transition-all hover:bg-[#FAF0F0]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-[#202C28] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#B64D49] shrink-0" />
                      {factor.feature}
                    </span>
                    <span className="text-xs font-bold text-[#B64D49] bg-white px-2 py-0.5 rounded-md border border-[#F2D5D4]">
                      +{Math.round(factor.magnitude * 100)}% Risk
                    </span>
                  </div>
                  <p className="text-xs text-[#68736D] leading-relaxed mt-1">
                    {factor.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Factors Reducing Risk */}
        <div className="bg-white rounded-2xl border border-[#DCE8DF] p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#DCE8DF]/60">
            <div className="p-2 rounded-xl bg-[#EDF5F0] text-[#287653]">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#202C28] text-sm">Factors Reducing Risk</h4>
              <p className="text-[11px] text-[#849087]">Applicant financial strengths</p>
            </div>
          </div>

          {factorsReducingRisk.length === 0 ? (
            <p className="text-xs text-[#849087] italic py-4">No major mitigating factors identified.</p>
          ) : (
            <div className="space-y-3.5">
              {factorsReducingRisk.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#EDF5F0]/60 border border-[#DCE8DF] transition-all hover:bg-[#EDF5F0]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-[#202C28] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#287653] shrink-0" />
                      {factor.feature}
                    </span>
                    <span className="text-xs font-bold text-[#287653] bg-white px-2 py-0.5 rounded-md border border-[#DCE8DF]">
                      -{Math.round(factor.magnitude * 100)}% Risk
                    </span>
                  </div>
                  <p className="text-xs text-[#68736D] leading-relaxed mt-1">
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
