import React, { useState } from 'react';
import { ShapFeature } from '../../types';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BarChart2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface ShapChartProps {
  features: ShapFeature[];
  baseValue?: number;
}

export const ShapChart: React.FC<ShapChartProps> = ({
  features,
  baseValue = 0.30,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  // Prepare data sorted by absolute magnitude
  const chartData = [...features]
    .sort((a, b) => b.magnitude - a.magnitude)
    .slice(0, 8)
    .map((item) => ({
      name: item.feature.length > 20 ? item.feature.substring(0, 18) + '...' : item.feature,
      fullName: item.feature,
      shap: item.shap_value,
      magnitude: item.magnitude,
      impact: item.impact,
      explanation: item.explanation,
    }))
    .reverse(); // For horizontal bar chart display from top to bottom

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isBadPush = data.shap > 0;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 max-w-xs text-xs">
          <p className="font-bold text-sm text-slate-100">{data.fullName}</p>
          <div className="mt-1 flex items-center gap-1.5 font-semibold">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isBadPush ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
            />
            <span className={isBadPush ? 'text-rose-300' : 'text-emerald-300'}>
              {isBadPush ? 'Elevates Default Risk' : 'Reduces Default Risk'}
            </span>
          </div>
          <p className="mt-1 text-slate-300 font-mono text-[11px]">
            SHAP Contribution: {data.shap > 0 ? `+${data.shap}` : data.shap}
          </p>
          <p className="mt-2 text-slate-300 border-t border-slate-800 pt-1.5 leading-snug">
            {data.explanation}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-900" />
            <h3 className="text-lg font-bold text-slate-900">
              Feature Impact on This Decision (SHAP)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Individual Shapley values measuring feature contributions relative to model portfolio baseline ({Math.round(baseValue * 100)}%).
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
            Pushes toward Good Risk
          </span>
          <span className="flex items-center gap-1 text-rose-700">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-600" />
            Pushes toward Bad Risk
          </span>
        </div>
      </div>

      {/* Chart container */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 10, right: 30, left: 90, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
            <XAxis
              type="number"
              domain={[-0.25, 0.25]}
              tick={{ fontSize: 11, fill: '#64748B' }}
              tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: '#1E293B', fontWeight: 500 }}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="#94A3B8" strokeWidth={1.5} />
            <Bar dataKey="shap" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.shap > 0 ? '#DC2626' : '#16A34A'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* "What does this mean?" Collapsible Explanation */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
          aria-expanded={showExplanation}
        >
          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-900" />
            What does this mean? (How to read this chart)
          </span>
          {showExplanation ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {showExplanation && (
          <div className="p-4 pt-1 text-xs text-slate-600 border-t border-slate-200/60 space-y-2 bg-white">
            <p>
              <strong>SHAP values</strong> show how each applicant feature influenced the model's prediction relative to the model's baseline prediction.
            </p>
            <p>
              Bars to the <strong className="text-emerald-700">left (green negative numbers)</strong> pushed the model toward approving the loan (lower default probability).
            </p>
            <p>
              Bars to the <strong className="text-rose-700">right (red positive numbers)</strong> pushed the model toward classifying the applicant as higher risk.
            </p>
            <p className="text-slate-400 italic text-[11px]">
              Rooted in cooperative game theory (Lloyd Shapley), this method is mathematically proven to allocate fair credit to each feature without arbitrary order bias.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
