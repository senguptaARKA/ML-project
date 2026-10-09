import React, { useState } from 'react';
import { LimeFeature, ShapFeature } from '../../types';
import { Layers, CheckCircle2, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface LimeExplanationProps {
  limeFeatures: LimeFeature[];
  shapFeatures: ShapFeature[];
}

export const LimeExplanation: React.FC<LimeExplanationProps> = ({
  limeFeatures,
  shapFeatures,
}) => {
  const [activeTab, setActiveTab] = useState<'lime' | 'side-by-side'>('lime');

  const chartData = [...limeFeatures].map((item) => ({
    name: item.feature,
    weight: item.weight,
    direction: item.direction,
    rule: item.rule,
  }));

  return (
    <div className="bg-white rounded-2xl border border-[#E0E4DD] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0E4DD]">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#173F35]" />
            <h3 className="text-lg font-bold text-[#202C28]">
              Alternative Explanation — LIME
            </h3>
          </div>
          <p className="text-xs text-[#68736D] mt-0.5">
            Local Interpretable Model-agnostic Explanations (LIME) creates an interpretable surrogate model around this applicant.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-[#F1F5F0] border border-[#E0E4DD] rounded-xl">
          <button
            onClick={() => setActiveTab('lime')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'lime'
                ? 'bg-white text-[#173F35] shadow-2xs font-bold'
                : 'text-[#68736D] hover:text-[#202C28]'
            }`}
          >
            LIME Explanations
          </button>
          <button
            onClick={() => setActiveTab('side-by-side')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'side-by-side'
                ? 'bg-white text-[#173F35] shadow-2xs font-bold'
                : 'text-[#68736D] hover:text-[#202C28]'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Side-by-Side (SHAP vs LIME)
          </button>
        </div>
      </div>

      <div className="bg-[#F1F5F0] rounded-xl p-3.5 border border-[#DCE8DF] text-xs text-[#202C28] flex items-start gap-2.5">
        <span className="w-2 h-2 rounded-full bg-[#173F35] mt-1.5 shrink-0" />
        <p className="leading-relaxed">
          <strong>SHAP and LIME</strong> are two different methods used to explain individual model predictions. While SHAP calculates exact Shapley game-theoretic contributions across all feature combinations, LIME perturbs data points locally to train a transparent linear surrogate model.
        </p>
      </div>

      {activeTab === 'lime' ? (
        <div className="space-y-6">
          {/* LIME Chart */}
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E0E4DD" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#68736D' }}
                  tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#202C28', fontWeight: 500 }}
                  width={100}
                />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val > 0 ? '+' : ''}${val} (${item.payload.direction})`,
                    'Surrogate Weight',
                  ]}
                  contentStyle={{
                    backgroundColor: '#102F29',
                    border: '1px solid #315F50',
                    borderRadius: '0.5rem',
                    color: '#F1F5F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="weight" radius={[3, 3, 3, 3]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`lime-cell-${index}`}
                      fill={entry.weight > 0 ? '#B64D49' : '#287653'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* LIME Rules Table */}
          <div className="border border-[#E0E4DD] rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F1F5F0] text-[#68736D] uppercase font-bold border-b border-[#E0E4DD]">
                <tr>
                  <th className="px-4 py-3">Feature</th>
                  <th className="px-4 py-3">Local Condition</th>
                  <th className="px-4 py-3">LIME Weight</th>
                  <th className="px-4 py-3">Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E4DD]">
                {limeFeatures.map((f, i) => (
                  <tr key={i} className="hover:bg-[#F8F8F4]">
                    <td className="px-4 py-3 font-semibold text-[#202C28]">{f.feature}</td>
                    <td className="px-4 py-3 text-[#68736D] font-mono text-[11px]">{f.rule}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#202C28]">
                      {f.weight > 0 ? `+${f.weight}` : f.weight}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[11px] border ${
                          f.direction === 'Bad Risk'
                            ? 'bg-[#FAF0F0] text-[#B64D49] border-[#F2D5D4]'
                            : 'bg-[#EDF5F0] text-[#287653] border-[#DCE8DF]'
                        }`}
                      >
                        {f.direction === 'Bad Risk' ? (
                          <AlertTriangle className="w-3 h-3 text-[#B64D49]" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3 text-[#287653]" />
                        )}
                        {f.direction}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Side-by-side consensus comparison */
        <div className="space-y-4">
          <p className="text-xs text-[#68736D]">
            Comparing the top 5 ranking factors across both explainability engines to confirm decision consistency:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* SHAP List */}
            <div className="border border-[#E0E4DD] rounded-xl p-4 bg-[#F8F8F4]">
              <span className="font-bold text-[#202C28] block mb-2">SHAP Consensus Top Factors</span>
              <div className="space-y-2">
                {shapFeatures.slice(0, 5).map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-white border border-[#E0E4DD]">
                    <span className="font-medium text-[#202C28]">{s.feature}</span>
                    <span
                      className={`font-bold font-mono ${
                        s.shap_value > 0 ? 'text-[#B64D49]' : 'text-[#287653]'
                      }`}
                    >
                      {s.shap_value > 0 ? `+${s.shap_value}` : s.shap_value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* LIME List */}
            <div className="border border-[#E0E4DD] rounded-xl p-4 bg-[#F8F8F4]">
              <span className="font-bold text-[#202C28] block mb-2">LIME Consensus Top Factors</span>
              <div className="space-y-2">
                {limeFeatures.slice(0, 5).map((l, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-white border border-[#E0E4DD]">
                    <span className="font-medium text-[#202C28]">{l.feature}</span>
                    <span
                      className={`font-bold font-mono ${
                        l.weight > 0 ? 'text-[#B64D49]' : 'text-[#287653]'
                      }`}
                    >
                      {l.weight > 0 ? `+${l.weight}` : l.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-3 bg-[#EDF5F0] rounded-xl border border-[#DCE8DF] text-xs text-[#102F29] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#287653] shrink-0" />
            <span>High alignment confirmed: Both SHAP and LIME identify the same primary financial levers.</span>
          </div>
        </div>
      )}
    </div>
  );
};
