import React, { useState } from 'react';
import { DatasetStats } from '../../types';
import {
  Database,
  PieChart as PieIcon,
  BarChart2,
  Users,
  Home,
  Briefcase,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface DatasetAnalyticsProps {
  dataset: DatasetStats;
}

export const DatasetAnalytics: React.FC<DatasetAnalyticsProps> = ({ dataset }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'distributions' | 'cohorts'>('overview');

  const riskPieData = [
    { name: 'Good Credit Risk', value: dataset.risk_distribution.good, color: '#16A34A' },
    { name: 'Bad Credit Risk', value: dataset.risk_distribution.bad, color: '#DC2626' },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Overview Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Observations</span>
          <span className="text-2xl font-extrabold text-slate-900 block mt-1">
            {dataset.total_applicants.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-500">Total Applicants</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Feature Space</span>
          <span className="text-2xl font-extrabold text-slate-900 block mt-1">
            {dataset.features_count}
          </span>
          <span className="text-[11px] text-slate-500">4 Num, 5 Cat</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Target Balance</span>
          <span className="text-2xl font-extrabold text-slate-900 block mt-1">
            70% / 30%
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold">700 Good / 300 Bad</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Train Cohort</span>
          <span className="text-2xl font-extrabold text-slate-900 block mt-1">
            {dataset.training_samples}
          </span>
          <span className="text-[11px] text-slate-500">80% Stratified</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Test Cohort</span>
          <span className="text-2xl font-extrabold text-slate-900 block mt-1">
            {dataset.testing_samples}
          </span>
          <span className="text-[11px] text-slate-500">20% Holdout</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block">Duplicate Rows</span>
          <span className="text-2xl font-extrabold text-slate-900 block mt-1">
            {dataset.duplicate_rows}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold">Clean / Zero Dupes</span>
        </div>
      </div>

      {/* CHARTS GRID 1: Credit Risk Distribution & Age Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Doughnut */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-900" />
              Credit Risk Distribution
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Target class breakdown in German Credit dataset.
            </p>
          </div>

          <div className="w-full h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} applicants`, 'Count']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '0.75rem', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200">
              <span className="font-bold block">Good Credit: 700 (70.0%)</span>
              <span className="text-[11px] opacity-80">Baseline low repayment risk</span>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-900 border border-rose-200">
              <span className="font-bold block">Bad Credit: 300 (30.0%)</span>
              <span className="text-[11px] opacity-80">Historical default events</span>
            </div>
          </div>
        </div>

        {/* Age Distribution Histogram */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-900" />
              Applicant Age Distribution
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Cohort frequency across applicant age brackets.
            </p>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataset.age_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="bin"
                  angle={-35}
                  textAnchor="end"
                  tick={{ fontSize: 10, fill: '#64748B' }}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} applicants`, 'Count']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
            <span>Peak Cohort: <strong>24–30 Years</strong></span>
            <span>Range: <strong>19 to 75 Years</strong></span>
          </div>
        </div>
      </div>

      {/* CHARTS GRID 2: Credit Amount & Loan Duration Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credit Amount Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Credit Amount Distribution</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Loan principal distribution across credit tiers.
            </p>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataset.credit_distribution} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="bin"
                  angle={-35}
                  textAnchor="end"
                  tick={{ fontSize: 9, fill: '#64748B' }}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} applicants`, 'Count']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#0284C7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px]">Good Risk Avg Loan</span>
              <span className="font-bold text-slate-900">
                ₹{dataset.credit_by_risk.good.mean.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Bad Risk Avg Loan</span>
              <span className="font-bold text-rose-700">
                ₹{dataset.credit_by_risk.bad.mean.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Loan Duration Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Loan Duration Distribution</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribution of requested loan tenures in months.
            </p>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataset.duration_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="bin" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} loans`, 'Volume']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px]">Good Risk Avg Tenure</span>
              <span className="font-bold text-slate-900">
                {dataset.duration_by_risk.good.mean} Months
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Bad Risk Avg Tenure</span>
              <span className="font-bold text-rose-700">
                {dataset.duration_by_risk.bad.mean} Months
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS GRID 3: Risk by Housing & Risk by Purpose */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk by Housing */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-900" />
              Credit Risk by Housing Arrangement
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparison of Good vs Bad credit counts by housing stability.
            </p>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataset.risk_by_housing} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="housing" tick={{ fontSize: 11, fill: '#1E293B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '0.75rem', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="good" name="Good Risk" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bad" name="Bad Risk" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk by Loan Purpose */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-900" />
              Credit Risk by Loan Purpose
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical performance by borrowing purpose.
            </p>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataset.risk_by_purpose} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="purpose"
                  angle={-35}
                  textAnchor="end"
                  tick={{ fontSize: 9, fill: '#1E293B' }}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: '0.75rem', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Bar dataKey="good" name="Good Risk" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bad" name="Bad Risk" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
