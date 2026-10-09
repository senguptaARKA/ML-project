import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { Gauge, Info } from 'lucide-react';

interface InterpretabilityScatterProps {
  data: Array<{
    model: string;
    roc_auc: number;
    shap_time: number;
  }>;
}

export const InterpretabilityScatter: React.FC<InterpretabilityScatterProps> = ({
  data,
}) => {
  const modelColors: Record<string, string> = {
    'Tuned Random Forest': '#173F35',
    'Random Forest': '#315F50',
    'XGBoost': '#A88955',
    'LightGBM': '#68736D',
    'Logistic Regression': '#849087',
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-[#102F29] text-[#F1F5F0] p-3 rounded-xl shadow-xl text-xs space-y-1 border border-[#315F50]">
          <p className="font-bold text-sm text-[#F1F5F0]">{d.model}</p>
          <p className="text-[#DCE8DF]">
            ROC-AUC: <strong className="text-white font-mono">{d.roc_auc.toFixed(4)}</strong>
          </p>
          <p className="text-[#DCE8DF]">
            SHAP Latency (50 loans):{' '}
            <strong className="text-white font-mono">{d.shap_time.toFixed(2)}s</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E0E4DD] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="pb-4 border-b border-[#E0E4DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-[#173F35]" />
            <h3 className="text-lg font-bold text-[#202C28]">
              Performance vs Explainability Cost
            </h3>
          </div>
          <p className="text-xs text-[#68736D] mt-0.5">
            Trade-off between predictive power (ROC-AUC) and computational latency of real-time SHAP explainers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#F1F5F0] text-[#173F35] rounded-lg border border-[#DCE8DF]">
            50 Test Applicants Batch
          </span>
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 40, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E4DD" />
            <XAxis
              type="number"
              dataKey="shap_time"
              name="SHAP Time"
              unit="s"
              domain={[0, 'auto']}
              label={{
                value: 'SHAP Explanation Latency for 50 Samples (seconds)',
                position: 'insideBottom',
                offset: -10,
                fontSize: 12,
                fill: '#68736D',
              }}
              tick={{ fontSize: 11, fill: '#68736D' }}
            />
            <YAxis
              type="number"
              dataKey="roc_auc"
              name="ROC-AUC"
              domain={[0.7, 0.85]}
              label={{
                value: 'Test ROC-AUC Score',
                angle: -90,
                position: 'insideLeft',
                fontSize: 12,
                fill: '#68736D',
              }}
              tick={{ fontSize: 11, fill: '#68736D' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter name="Models" data={data}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={modelColors[entry.model] || '#173F35'}
                />
              ))}
              <LabelList
                dataKey="model"
                position="top"
                offset={8}
                style={{ fontSize: '11px', fontWeight: 600, fill: '#202C28' }}
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Explanatory Box */}
      <div className="p-4 rounded-xl bg-[#F8F8F4] border border-[#E0E4DD] text-xs text-[#68736D] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#173F35] mt-0.5 shrink-0" />
        <div className="leading-relaxed">
          <strong className="text-[#202C28]">Key Engineering Insight:</strong> This comparison helps evaluate the trade-off between predictive performance and the practical cost of generating explanations. Tuned Random Forest and Tree-based ensembles offer superior discrimination ({`>`}0.78 ROC-AUC) while TreeExplainer completes 50 customer explanations in well under 1 second, making real-time interactive lending feasible.
        </div>
      </div>
    </div>
  );
};
