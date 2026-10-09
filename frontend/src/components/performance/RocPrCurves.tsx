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
    'Tuned Random Forest': '#173F35',
    'Random Forest': '#315F50',
    'XGBoost': '#A88955',
    'LightGBM': '#68736D',
    'Logistic Regression': '#849087',
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
    <div className="bg-white rounded-2xl border border-[#E0E4DD] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E0E4DD]">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#173F35]" />
            <h3 className="text-lg font-bold text-[#202C28]">
              Discrimination Analysis: {activeMetric === 'roc' ? 'ROC Curves' : 'Precision-Recall Curves'}
            </h3>
          </div>
          <p className="text-xs text-[#68736D] mt-0.5">
            {activeMetric === 'roc'
              ? 'True Positive Rate vs False Positive Rate trade-offs across discrimination thresholds.'
              : 'Precision vs Recall trade-off emphasizing minority class default detection.'}
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center p-1 bg-[#F1F5F0] border border-[#E0E4DD] rounded-xl">
          <button
            onClick={() => setActiveMetric('roc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === 'roc'
                ? 'bg-white text-[#173F35] shadow-2xs font-bold'
                : 'text-[#68736D] hover:text-[#202C28]'
            }`}
          >
            ROC Curves (AUC)
          </button>
          <button
            onClick={() => setActiveMetric('pr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === 'pr'
                ? 'bg-white text-[#173F35] shadow-2xs font-bold'
                : 'text-[#68736D] hover:text-[#202C28]'
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
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E4DD" />
            <XAxis
              dataKey="x"
              label={{
                value: activeMetric === 'roc' ? 'False Positive Rate (1 - Specificity)' : 'Recall (Sensitivity)',
                position: 'insideBottom',
                offset: -10,
                fontSize: 12,
                fill: '#68736D',
              }}
              tick={{ fontSize: 11, fill: '#68736D' }}
            />
            <YAxis
              domain={[0, 1]}
              label={{
                value: activeMetric === 'roc' ? 'True Positive Rate (Sensitivity)' : 'Precision (Positive Predictive Value)',
                angle: -90,
                position: 'insideLeft',
                fontSize: 12,
                fill: '#68736D',
              }}
              tick={{ fontSize: 11, fill: '#68736D' }}
            />
            <Tooltip
              formatter={(val: any, name: any) => [`${(Number(val) * 100).toFixed(1)}%`, name]}
              contentStyle={{
                backgroundColor: '#102F29',
                border: '1px solid #315F50',
                borderRadius: '0.5rem',
                color: '#F1F5F0',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />

            {activeMetric === 'roc' && (
              <Line
                type="monotone"
                dataKey="Random Guess"
                stroke="#849087"
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
                stroke={modelColors[name] || '#173F35'}
                strokeWidth={name === 'Tuned Random Forest' ? 2.8 : 1.8}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
