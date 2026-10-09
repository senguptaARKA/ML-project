import React from 'react';
import { ActivePage, BackendData } from '../../types';
import {
  BarChart3,
  Scale,
  Database,
  Cpu,
  ShieldCheck,
  Trophy,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ModelDivisionLayoutProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  modelsData: BackendData['models'];
  fairnessData: BackendData['fairness'];
  datasetData: BackendData['dataset'];
  children: React.ReactNode;
}

export const ModelDivisionLayout: React.FC<ModelDivisionLayoutProps> = ({
  activePage,
  onNavigate,
  modelsData,
  fairnessData,
  datasetData,
  children,
}) => {
  const bestModel = modelsData.comparison_table.find(
    (m) => m.model === modelsData.best_model
  ) || modelsData.comparison_table[0];

  const tabs: Array<{
    id: ActivePage;
    label: string;
    icon: React.ElementType;
    badge: string;
    description: string;
  }> = [
    {
      id: 'performance',
      label: 'Model Performance',
      icon: BarChart3,
      badge: `${bestModel ? (bestModel.roc_auc * 100).toFixed(1) : '79.2'}% AUC`,
      description: 'Comparative benchmarks across 4 candidate algorithms',
    },
    {
      id: 'fairness',
      label: 'Fairness & Bias Audit',
      icon: Scale,
      badge: fairnessData.demographic_parity_status || 'Fair',
      description: 'Demographic parity and equalized odds testing across gender',
    },
    {
      id: 'dataset',
      label: 'Dataset Insights',
      icon: Database,
      badge: `${datasetData.total_applicants.toLocaleString()} Loans`,
      description: 'Cohort distributions, credit volumes and demographic patterns',
    },
    {
      id: 'about',
      label: 'Model Architecture',
      icon: Cpu,
      badge: 'Pipeline',
      description: 'End-to-end ML methodology, preprocessing and XAI pipeline',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Division Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
                Model Intelligence & Governance Division
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-medium">
                Audited & Benchmarked
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Model Performance, Fairness & Dataset Governance
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Institutional auditing suite for the credit scoring engine. Compare predictive metrics across algorithms, review algorithmic fairness parity tests under ECOA/FCRA guidelines, inspect training cohort distributions, and explore the end-to-end ML architecture.
            </p>
          </div>

          {/* Quick Division Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 shrink-0 lg:max-w-xs w-full">
            <div className="bg-slate-800/80 backdrop-blur-xs rounded-xl p-3 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Champion Model
              </span>
              <span className="text-sm font-bold text-white block mt-0.5 truncate">
                {modelsData.best_model}
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                {(bestModel.roc_auc * 100).toFixed(1)}% ROC-AUC
              </span>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs rounded-xl p-3 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Fairness Metric
              </span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {fairnessData.demographic_parity_difference.toFixed(3)} Diff
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
                {fairnessData.demographic_parity_status}
              </span>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs rounded-xl p-3 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Dataset Cohort
              </span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {datasetData.total_applicants.toLocaleString()} Records
              </span>
              <span className="text-[11px] text-blue-300 font-semibold block mt-0.5">
                German Credit
              </span>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs rounded-xl p-3 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Audit Scope
              </span>
              <span className="text-sm font-bold text-white block mt-0.5">
                Full Pipeline
              </span>
              <span className="text-[11px] text-indigo-300 font-semibold block mt-0.5">
                ECOA / FCRA
              </span>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-indigo-600/10 to-transparent pointer-events-none" />
      </div>

      {/* Division Navigation Tabs (Top Segmented Switcher) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePage === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all relative ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-50/60 hover:bg-slate-100/80 text-slate-700 hover:text-slate-900 border border-slate-200/60'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-blue-800 text-blue-200' : 'bg-white text-slate-600 shadow-2xs border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs sm:text-sm font-bold truncate block">
                      {tab.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 hidden sm:inline-block ${
                        isActive
                          ? 'bg-blue-800 text-blue-100'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] truncate block mt-0.5 ${
                      isActive ? 'text-blue-200' : 'text-slate-500'
                    }`}
                  >
                    {tab.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Model Division Content */}
      <div className="min-h-[500px]">{children}</div>
    </div>
  );
};
export default ModelDivisionLayout;
