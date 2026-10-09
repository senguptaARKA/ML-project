import React from 'react';
import { ModelMetric } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface ModelBenchmarkChartProps {
  comparisonTable: ModelMetric[];
  bestModel: string;
}

export const ModelBenchmarkChart: React.FC<ModelBenchmarkChartProps> = ({
  comparisonTable,
  bestModel,
}) => {
  const modelChartData = comparisonTable.map((m) => ({
    name: m.model.replace(' Regression', '').replace(' Forest', ' F.'),
    ROC_AUC: Math.round(m.roc_auc * 1000) / 10,
    Accuracy: Math.round(m.accuracy * 1000) / 10,
    F1: Math.round(m.f1 * 1000) / 10,
  }));

  return (
    <div className="bg-white rounded-2xl border border-[#E0E4DD] p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#E0E4DD]">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#173F35]" />
            <h4 className="font-bold text-[#202C28] text-sm">
              Model Benchmark Comparison (Holdout Set)
            </h4>
          </div>
        </div>
        <p className="text-xs text-[#68736D] mt-2">
          Comparing test ROC-AUC, Accuracy, and F1 score across {comparisonTable.length} candidate models:
        </p>
      </div>

      <div className="w-full h-64 my-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={modelChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E4DD" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#202C28', fontWeight: 500 }} />
            <YAxis unit="%" domain={[40, 90]} tick={{ fontSize: 11, fill: '#68736D' }} />
            <Tooltip
              formatter={(val: any) => [`${val}%`, '']}
              contentStyle={{
                backgroundColor: '#102F29',
                border: '1px solid #315F50',
                borderRadius: '0.5rem',
                color: '#F1F5F0',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
            <Bar dataKey="ROC_AUC" name="ROC-AUC" fill="#173F35" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Accuracy" name="Accuracy" fill="#315F50" radius={[3, 3, 0, 0]} />
            <Bar dataKey="F1" name="F1 Score" fill="#A88955" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-[#68736D] pt-3 border-t border-[#E0E4DD] flex items-center justify-between">
        <span>Selected Champion: <strong className="text-[#173F35]">{bestModel}</strong></span>
        <span>Balanced class weights applied for minority default representation.</span>
      </div>
    </div>
  );
};
