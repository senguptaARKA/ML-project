import React from 'react';
import { ActivePage, BackendData } from '../../types';
import {
  BarChart3,
  Scale,
  Database,
  Cpu,
  ShieldCheck,
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
      {/* Institutional Division Header Banner */}
      <div className="bg-gradient-to-br from-[#102F29] via-[#173F35] to-[#102F29] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-[0_2px_8px_rgba(16,47,41,0.12)] border border-[#315F50]/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#173F35] text-[#DCE8DF] border border-[#315F50] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#DCE8DF]" />
                Model Intelligence & Governance Division
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#173F35] text-[#DCE8DF] border border-[#315F50] text-[11px] font-medium">
                Audited & Benchmarked
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Model Performance, Fairness & Dataset Governance
            </h2>

            <p className="text-[#DCE8DF] text-xs sm:text-[13px] leading-relaxed">
              Institutional auditing suite for the credit scoring engine. Compare predictive metrics across algorithms, review algorithmic fairness parity tests under ECOA/FCRA guidelines, inspect training cohort distributions, and explore the end-to-end ML architecture.
            </p>
          </div>

          {/* Quick Division Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 shrink-0 lg:max-w-xs w-full">
            <div className="bg-[#173F35]/70 rounded-xl p-3 border border-[#315F50]/50 shadow-2xs">
              <span className="text-[10px] uppercase font-semibold text-[#DCE8DF]/70 block tracking-wider">
                Champion Model
              </span>
              <span className="text-sm font-bold text-white block mt-0.5 truncate">
                {modelsData.best_model}
              </span>
              <span className="text-[11px] text-[#DCE8DF] font-semibold block mt-0.5">
                {(bestModel.roc_auc * 100).toFixed(1)}% ROC-AUC
              </span>
            </div>

            <div className="bg-[#173F35]/70 rounded-xl p-3 border border-[#315F50]/50 shadow-2xs">
              <span className="text-[10px] uppercase font-semibold text-[#DCE8DF]/70 block tracking-wider">
                Fairness Metric
              </span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {fairnessData.demographic_parity_difference.toFixed(3)} Diff
              </span>
              <span className="text-[11px] text-[#DCE8DF] font-semibold block mt-0.5">
                {fairnessData.demographic_parity_status}
              </span>
            </div>

            <div className="bg-[#173F35]/70 rounded-xl p-3 border border-[#315F50]/50 shadow-2xs">
              <span className="text-[10px] uppercase font-semibold text-[#DCE8DF]/70 block tracking-wider">
                Dataset Cohort
              </span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {datasetData.total_applicants.toLocaleString()} Records
              </span>
              <span className="text-[11px] text-[#DCE8DF] font-semibold block mt-0.5">
                German Credit
              </span>
            </div>

            <div className="bg-[#173F35]/70 rounded-xl p-3 border border-[#315F50]/50 shadow-2xs">
              <span className="text-[10px] uppercase font-semibold text-[#DCE8DF]/70 block tracking-wider">
                Audit Scope
              </span>
              <span className="text-sm font-bold text-white block mt-0.5">
                Full Pipeline
              </span>
              <span className="text-[11px] text-[#DCE8DF] font-semibold block mt-0.5">
                ECOA / FCRA
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Division Navigation Tabs (Top Segmented Switcher) */}
      <div className="bg-white rounded-xl border border-[#E0E4DD] p-2 shadow-[0_1px_3px_0_rgba(32,44,40,0.04)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePage === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 relative ${
                  isActive
                    ? 'bg-[#173F35] text-white shadow-xs'
                    : 'bg-[#F8F8F4] hover:bg-[#F1F5F0] text-[#68736D] hover:text-[#173F35] border border-[#E0E4DD]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div
                  className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-[#102F29] text-[#DCE8DF]'
                      : 'bg-white text-[#68736D] border border-[#E0E4DD]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs sm:text-[13px] font-bold truncate block">
                      {tab.label}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 hidden sm:inline-block ${
                        isActive
                          ? 'bg-[#102F29] text-[#DCE8DF] border border-[#315F50]/60'
                          : 'bg-[#F1F5F0] text-[#173F35] border border-[#E0E4DD]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  </div>
                  <span
                    className={`text-[11px] truncate block mt-0.5 ${
                      isActive ? 'text-[#DCE8DF]' : 'text-[#849087]'
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
