import React, { useState } from 'react';
import { CurvePoint } from '../../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Activity } from 'lucide-react';

interface RocPrCurvesProps {
  rocCurves: Record<string, CurvePoint[]>;
  prCurves: Record<string, CurvePoint[]>;
}

export const RocPrCurves: React.FC<RocPrCurvesProps> = ({
  rocCurves,
  prCurves,
}) => {
  const [activeMetric, setActiveMetric] = useState<'roc' | 'pr'>('roc');

  const modelColors: Record<string, string> = {
    'Logistic Regression': '#64748B',
    'Random Forest': '#0284C7',
    'XGBoost': '#D97706',
    'LightGBM': '#7C3AED',
    'Tuned Random Forest': '#1E3A8A',
  };

  // Harmonize sample points for recharts
  const modelNames = Object.keys(rocCurves);
  const sampleLength = 20;

  const chartData = Array.from({ length: sampleLength }).map((_, idx) => {
    const point: any = {};
    if (activeMetric === 'roc') {
      const step = idx / (sampleLength - 1);
      point.x = Number(step.toFixed(2));
      point['Random Guess'] = Number(step.toFixed(2));

      modelNames.forEach((name) => {
        const pts = rocCurves[name] || [];
        if (pts.length > 0) {
          const ptIdx = Math.min(pts.length - 1, Math.floor(idx * (pts.length / sampleLength)));
          point[name] = pts[ptIdx]?.tpr ?? step;
        }
      });
    } else {
      const step = idx / (sampleLength - 1);
      point.x = Number(step.toFixed(2));

      modelNames.forEach((name) => {
        const pts = prCurves[name] || [];
        if (pts.length > 0) {
          const ptIdx = Math.min(pts.length - 1, Math.floor(idx * (pts.length / sampleLength)));
          point[name] = pts[ptIdx]?.precision ?? (0.3 + 0.5 * (1 - step));
        }
      });
    }
    return point;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-900" />
            <h3 className="text-lg font-bold text-slate-900">
              Discrimination Analysis: {activeMetric === 'roc' ? 'ROC Curves' : 'Precision-Recall Curves'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeMetric === 'roc'
              ? 'True Positive Rate vs False Positive Rate trade-offs across discrimination thresholds.'
              : 'Precision vs Recall trade-off emphasizing minority class default detection.'}
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveMetric('roc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMetric === 'roc'
                ? 'bg-white text-blue-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ROC Curves (AUC)
          </button>
          <button
            onClick={() => setActiveMetric('pr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeMetric === 'pr'
                ? 'bg-white text-blue-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Precision-Recall Curves
          </button>
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="x"
              label={{
                value: activeMetric === 'roc' ? 'False Positive Rate (1 - Specificity)' : 'Recall (Sensitivity)',
                position: 'insideBottom',
                offset: -10,
                fontSize: 12,
                fill: '#64748B',
              }}
              tick={{ fontSize: 11, fill: '#64748B' }}
            />
            <YAxis
              domain={[0, 1]}
              label={{
                value: activeMetric === 'roc' ? 'True Positive Rate (Sensitivity)' : 'Precision (Positive Predictive Value)',
                angle: -90,
                position: 'insideLeft',
                fontSize: 12,
                fill: '#64748B',
              }}
              tick={{ fontSize: 11, fill: '#64748B' }}
            />
            <Tooltip
              formatter={(val: any, name: any) => [`${(Number(val) * 100).toFixed(1)}%`, name]}
              contentStyle={{
                backgroundColor: '#0F172A',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />

            {activeMetric === 'roc' && (
              <Line
                type="monotone"
                dataKey="Random Guess"
                stroke="#94A3B8"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
              />
            )}

            {modelNames.map((name) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={modelColors[name] || '#3B82F6'}
                strokeWidth={name === 'Tuned Random Forest' ? 3 : 1.8}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
