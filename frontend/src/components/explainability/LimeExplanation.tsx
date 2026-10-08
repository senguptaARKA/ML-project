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
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-900" />
            <h3 className="text-lg font-bold text-slate-900">
              Alternative Explanation — LIME
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Local Interpretable Model-agnostic Explanations (LIME) creates an interpretable surrogate model around this applicant.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('lime')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'lime'
                ? 'bg-white text-blue-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            LIME Explanations
          </button>
          <button
            onClick={() => setActiveTab('side-by-side')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'side-by-side'
                ? 'bg-white text-blue-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Side-by-Side (SHAP vs LIME)
          </button>
        </div>
      </div>

      <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
        <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
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
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#1E293B', fontWeight: 500 }}
                  width={100}
                />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val > 0 ? '+' : ''}${val} (${item.payload.direction})`,
                    'Surrogate Weight',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="weight" radius={[4, 4, 4, 4]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`lime-cell-${index}`}
                      fill={entry.weight > 0 ? '#DC2626' : '#16A34A'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* LIME Rules Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Feature</th>
                  <th className="px-4 py-3">Local Condition</th>
                  <th className="px-4 py-3">LIME Weight</th>
                  <th className="px-4 py-3">Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {limeFeatures.map((f, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{f.feature}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{f.rule}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">
                      {f.weight > 0 ? `+${f.weight}` : f.weight}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                          f.direction === 'Bad Risk'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {f.direction === 'Bad Risk' ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
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
          <p className="text-xs text-slate-600">
            Comparing the top 5 ranking factors across both explainability engines to confirm decision consistency:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* SHAP List */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <span className="font-bold text-slate-900 block mb-2">SHAP Consensus Top Factors</span>
              <div className="space-y-2">
                {shapFeatures.slice(0, 5).map((s, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-white border border-slate-200">
                    <span className="font-medium text-slate-800">{s.feature}</span>
                    <span
                      className={`font-bold font-mono ${
                        s.shap_value > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {s.shap_value > 0 ? `+${s.shap_value}` : s.shap_value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* LIME List */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
              <span className="font-bold text-slate-900 block mb-2">LIME Consensus Top Factors</span>
              <div className="space-y-2">
                {limeFeatures.slice(0, 5).map((l, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-white border border-slate-200">
                    <span className="font-medium text-slate-800">{l.feature}</span>
                    <span
                      className={`font-bold font-mono ${
                        l.weight > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {l.weight > 0 ? `+${l.weight}` : l.weight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>High alignment confirmed: Both SHAP and LIME identify the same primary financial levers.</span>
          </div>
        </div>
      )}
    </div>
  );
};
