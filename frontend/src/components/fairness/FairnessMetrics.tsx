import React, { useState } from 'react';
import { FairnessSummary } from '../../types';
import {
  Scale,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Users,
  CheckCircle2,
  Info,
} from 'lucide-react';
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

interface FairnessMetricsProps {
  fairnessData: FairnessSummary;
}

export const FairnessMetrics: React.FC<FairnessMetricsProps> = ({
  fairnessData,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Group comparative chart data
  const groupChartData = fairnessData.group_metrics.map((gm) => ({
    group: gm.group.charAt(0).toUpperCase() + gm.group.slice(1),
    'Approval Rate (PPR)': Math.round(gm.positive_prediction_rate * 1000) / 10,
    'Default Recall (TPR)': Math.round(gm.tpr * 1000) / 10,
    'False Alarm (FPR)': Math.round(gm.fpr * 1000) / 10,
    applicants: gm.applicants,
  }));

  const dpDiff = fairnessData.demographic_parity_difference;
  const eoDiff = fairnessData.equalized_odds_difference;

  return (
    <div className="space-y-8">
      {/* Intro Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-900" />
              <h3 className="text-xl font-bold text-slate-900">
                Algorithmic Fairness & Bias Governance
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Credit risk scoring systems must not only be predictive and accurate, but rigorously audited for equity across protected demographic classes. Under the Equal Credit Opportunity Act (ECOA) and Basel III risk governance, this audit assesses disparate impact across applicant sex groups.
            </p>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900 shrink-0">
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-800" />
              ECOA Audit Level
            </div>
            <span>Attribute: <strong>Sex (Gender)</strong></span>
          </div>
        </div>

        {/* 2 Primary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Demographic Parity */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Demographic Parity Difference
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  dpDiff <= 0.10
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {dpDiff <= 0.10 ? 'Within Regulatory Threshold' : 'Needs Review'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {dpDiff.toFixed(3)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                (Standard Tolerance Threshold: &le; 0.100)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Measures the absolute difference in favorable decision rates between groups:
              <br />
              <code className="text-[11px] bg-slate-200/60 px-1 py-0.5 rounded mt-1 inline-block">
                |P(Approval|Female) - P(Approval|Male)| = {dpDiff.toFixed(3)}
              </code>
            </p>
          </div>

          {/* Equalized Odds */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Equalized Odds Difference
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  eoDiff <= 0.10
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {eoDiff <= 0.10 ? 'Within Regulatory Threshold' : 'Needs Review'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {eoDiff.toFixed(3)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                (Standard Tolerance Threshold: &le; 0.100)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Measures parity in both True Positive and False Positive error rates across demographic cohorts:
              <br />
              <code className="text-[11px] bg-slate-200/60 px-1 py-0.5 rounded mt-1 inline-block">
                max(|TPR_diff|, |FPR_diff|) = {eoDiff.toFixed(3)}
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Group Metric Charts */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-900" />
              <h3 className="text-lg font-bold text-slate-900">
                Group-Level Demographic Breakdown (Sex)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Testing cohort comparison across approval rate, default sensitivity, and false alarm rate.
            </p>
          </div>
        </div>

        {/* Group Bar Chart */}
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={groupChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="group" tick={{ fontSize: 12, fill: '#1E293B', fontWeight: 600 }} />
              <YAxis
                unit="%"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#64748B' }}
              />
              <Tooltip
                formatter={(val: any) => [`${val}%`, '']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Approval Rate (PPR)" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Default Recall (TPR)" fill="#0284C7" radius={[4, 4, 0, 0]} />
              <Bar dataKey="False Alarm (FPR)" fill="#D97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table summary of metrics */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Demographic Group</th>
                <th className="px-4 py-3 text-center">Cohort Size (N)</th>
                <th className="px-4 py-3 text-center">Positive Prediction Rate</th>
                <th className="px-4 py-3 text-center">True Positive Rate (TPR)</th>
                <th className="px-4 py-3 text-center">False Positive Rate (FPR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fairnessData.group_metrics.map((g) => (
                <tr key={g.group} className="hover:bg-slate-50">
                  <td className="px-4 py-3.5 font-bold text-slate-900 capitalize">
                    {g.group}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-slate-700">
                    {g.applicants} applicants
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-900">
                    {(g.positive_prediction_rate * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-slate-700">
                    {(g.tpr * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-slate-700">
                    {(g.fpr * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fairness Advisory Callout */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-900" />
          Responsible AI Guidelines: Fair Lending Compliance Notes
        </h4>
        <p className="leading-relaxed">
          The CFPB and Equal Credit Opportunity Act specify that a mathematical disparity below 0.10 (or within the 80% Four-Fifths rule) is generally considered acceptable in credit underwriting, provided legitimate business necessity and objective financial factors (e.g. debt-to-income, checking reserves) justify any residual variance.
        </p>
      </div>
    </div>
  );
};
