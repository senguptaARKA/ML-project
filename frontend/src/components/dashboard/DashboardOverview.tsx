import React from 'react';
import { BackendData, ActivePage } from '../../types';
import {
  Database,
  Trophy,
  Sparkles,
  Scale,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  BarChart3,
  PieChart as PieIcon,
  Zap,
} from 'lucide-react';
import { KpiCard } from '../common/KpiCard';
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

interface DashboardOverviewProps {
  data: BackendData;
  onNavigate: (page: ActivePage) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  data,
  onNavigate,
}) => {
  const { dataset, models, fairness } = data;
  const bestModelMetric = models.comparison_table.find(
    (m) => m.model === models.best_model
  ) || models.comparison_table[models.comparison_table.length - 1];

  const riskPieData = [
    { name: 'Good Credit Risk', value: dataset.risk_distribution.good, color: '#16A34A' },
    { name: 'Bad Credit Risk', value: dataset.risk_distribution.bad, color: '#DC2626' },
  ];

  // Model comparison bar chart data
  const modelChartData = models.comparison_table.map((m) => ({
    name: m.model.replace(' Regression', '').replace(' Forest', ' F.'),
    ROC_AUC: Math.round(m.roc_auc * 1000) / 10,
    Accuracy: Math.round(m.accuracy * 1000) / 10,
    F1: Math.round(m.f1 * 1000) / 10,
  }));

  return (
    <div className="space-y-8">
      {/* Hero Welcome & Prominent CTA Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/80 text-blue-200 border border-blue-700/50 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Production Banking AI System</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explainable Credit Risk Management
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            AI-powered credit assessment with transparent, auditable decision-making. Loan officers can score applicants, review real-time SHAP attributions, and formulate actionable counterfactuals in a single unified workspace—while model governance teams audit comparative benchmarks, demographic parity, and dataset health in the Model Intelligence Division.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('assessment')}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 group"
            >
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Assess Applicant & Explainability</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('performance')}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs sm:text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Explore Model Division</span>
            </button>
          </div>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-800/30 to-transparent pointer-events-none" />
      </div>

      {/* 4 Primary KPI Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Core System Metrics & Governance Health
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Dataset KPI */}
          <KpiCard
            title="Dataset Cohort"
            value={`${dataset.total_applicants.toLocaleString()} Loans`}
            subtitle={`${dataset.training_samples} Train / ${dataset.testing_samples} Test (${dataset.features_count} Features)`}
            icon={Database}
            badge={{ text: 'Model Division', variant: 'info' }}
            onClick={() => onNavigate('dataset')}
          />

          {/* Model KPI */}
          <KpiCard
            title="Champion Model"
            value={`${(bestModelMetric.roc_auc * 100).toFixed(1)}% AUC`}
            subtitle={`${models.best_model} (Acc: ${(bestModelMetric.accuracy * 100).toFixed(1)}%, F1: ${bestModelMetric.f1.toFixed(2)})`}
            icon={Trophy}
            badge={{ text: 'Model Division', variant: 'positive' }}
            onClick={() => onNavigate('performance')}
          />

          {/* Explainability KPI */}
          <KpiCard
            title="Assessment & XAI"
            value="Unified Tab"
            subtitle="SHAP Waterfall + LIME + Recourse"
            icon={Sparkles}
            badge={{ text: 'Active Tab', variant: 'positive' }}
            onClick={() => onNavigate('assessment')}
          />

          {/* Fairness KPI */}
          <KpiCard
            title="Fairness Audit"
            value="0.080 Diff"
            subtitle={`Equalized Odds: ${fairness.equalized_odds_difference.toFixed(3)} (Audit: Sex)`}
            icon={Scale}
            badge={{ text: fairness.demographic_parity_status, variant: 'positive' }}
            onClick={() => onNavigate('fairness')}
          />
        </div>
      </div>

      {/* Overview Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Credit Risk Distribution (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-blue-900" />
                Credit Risk Distribution
              </h4>
              <button
                onClick={() => onNavigate('dataset')}
                className="text-xs text-blue-900 font-semibold hover:underline"
              >
                Explore &rarr;
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Historical German Credit portfolio balance:
            </p>
          </div>

          <div className="w-full h-56 my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name.split(' ')[0]} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`dash-pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} applicants`, 'Volume']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '0.75rem', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-900">
              <span className="font-bold block">700 Good (70%)</span>
              <span className="text-[11px] opacity-80">Low default risk</span>
            </div>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-900">
              <span className="font-bold block">300 Bad (30%)</span>
              <span className="text-[11px] opacity-80">Default events</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Model Comparison (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-900" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Model Benchmark Comparison (Holdout Set)
                </h4>
              </div>
              <button
                onClick={() => onNavigate('performance')}
                className="text-xs text-blue-900 font-semibold hover:underline"
              >
                Detailed Benchmark &rarr;
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Comparing test ROC-AUC, Accuracy, and F1 score across 5 candidate models:
            </p>
          </div>

          <div className="w-full h-56 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#1E293B', fontWeight: 500 }} />
                <YAxis unit="%" domain={[40, 90]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, '']}
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                <Bar dataKey="ROC_AUC" name="ROC-AUC" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Accuracy" name="Accuracy" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="F1" name="F1 Score" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span>Selected Champion: <strong className="text-blue-900">{models.best_model}</strong></span>
            <span>Balanced class weights applied for minority default representation.</span>
          </div>
        </div>
      </div>

      {/* Division Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('assessment')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Workspace Tab 1
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-900 group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Credit Assessment & Explainability</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Combined interactive underwriting and instant XAI diagnostics: input applicant details, evaluate risk, inspect SHAP waterfall and simulate counterfactual recourse.
          </p>
        </div>

        <div
          onClick={() => onNavigate('performance')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Model Division
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-900 group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Model Performance & Benchmark</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Compare ROC-AUC, PR curves, Confusion Matrix, and interpretability latency across 4 production and baseline candidate models.
          </p>
        </div>

        <div
          onClick={() => onNavigate('fairness')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Model Division
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-900 group-hover:translate-x-1 transition-all" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Fairness, Bias & Dataset Auditing</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Verify demographic parity across gender, evaluate equalized odds, and inspect the 1,000-loan German Credit dataset cohort distributions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
