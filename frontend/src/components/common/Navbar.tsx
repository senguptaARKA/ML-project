import React from 'react';
import {
  Menu,
  HelpCircle,
  User,
  Shield,
  Activity,
  PlusCircle,
  Layers,
} from 'lucide-react';
import { ActivePage } from '../../types';

interface NavbarProps {
  activePage: ActivePage;
  onOpenMobileSidebar: () => void;
  onOpenHelp: () => void;
  onNavigateToAssessment: () => void;
  backendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onOpenMobileSidebar,
  onOpenHelp,
  onNavigateToAssessment,
  backendOnline,
}) => {
  const pageTitles: Record<
    ActivePage,
    { title: string; subtitle: string; division: string; divisionBadgeClass: string }
  > = {
    dashboard: {
      title: 'Executive Dashboard',
      subtitle: 'Portfolio Health & ML Governance',
      division: 'Decisioning Hub',
      divisionBadgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    assessment: {
      title: 'Credit Risk Assessment & Explainability',
      subtitle: 'Interactive Underwriting, SHAP Waterfall & What-If Recourse',
      division: 'Decisioning Workspace',
      divisionBadgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    explainability: {
      title: 'Credit Risk Assessment & Explainability',
      subtitle: 'Interactive Underwriting, SHAP Waterfall & What-If Recourse',
      division: 'Decisioning Workspace',
      divisionBadgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    performance: {
      title: 'Model Performance & Benchmarking',
      subtitle: 'Comparative Evaluation Across 4 Algorithms & ROC Curves',
      division: 'Model Intelligence Division',
      divisionBadgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    fairness: {
      title: 'Algorithmic Fairness & Bias Audit',
      subtitle: 'Demographic Parity & Equalized Odds Across Protected Classes',
      division: 'Model Intelligence Division',
      divisionBadgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    dataset: {
      title: 'German Credit Dataset Analytics',
      subtitle: 'Cohort Distributions, Risk Disparities & Feature Profiling',
      division: 'Model Intelligence Division',
      divisionBadgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    about: {
      title: 'Model Architecture & ML Pipeline',
      subtitle: 'End-to-End Methodology, Preprocessing & Explainability Stack',
      division: 'Model Intelligence Division',
      divisionBadgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
  };

  const currentInfo = pageTitles[activePage] || {
    title: 'Explainable AI Credit Risk',
    subtitle: 'Banking Assessment',
    division: 'Portal',
    divisionBadgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-slate-200 h-16 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page Title with Division Tag */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              {currentInfo.title}
            </h1>
            <span
              className={`hidden md:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md border ${currentInfo.divisionBadgeClass}`}
            >
              {currentInfo.division}
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden sm:block leading-tight">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Status indicator, Help icon, New Assessment CTA, User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Backend Connectivity Status Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            backendOnline
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }`}
          title={
            backendOnline
              ? 'Connected to live Python server (http://localhost:8000)'
              : 'Running high-fidelity client-side calibrated ML engine'
          }
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                backendOnline ? 'bg-emerald-400' : 'bg-blue-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                backendOnline ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
            />
          </span>
          <span className="hidden md:inline">
            {backendOnline ? 'Live Python ML Model' : 'Client ML Engine'}
          </span>
        </div>

        {/* Quick CTA to Assessment & Explainability if on another page */}
        {activePage !== 'assessment' && activePage !== 'explainability' && (
          <button
            onClick={onNavigateToAssessment}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Assess Applicant</span>
          </button>
        )}

        {/* Help / Guidance Modal Trigger */}
        <button
          onClick={onOpenHelp}
          className="p-2 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded-xl transition-colors relative"
          aria-label="Help and documentation guide"
          title="Explainable Credit Risk Guidance"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden xl:block text-left">
            <span className="text-xs font-semibold text-slate-900 block leading-tight">
              Officer Subra
            </span>
            <span className="text-[10px] text-slate-500 block leading-tight">
              Credit Risk Desk
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
