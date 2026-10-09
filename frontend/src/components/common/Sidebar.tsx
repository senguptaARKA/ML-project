import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  Scale,
  Database,
  Info,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Layers,
} from 'lucide-react';
import { ActivePage } from '../../types';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  hasAssessment: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  hasAssessment,
}) => {
  // Division 1: Individual Applicant Decisioning & XAI
  const decisioningItems = [
    {
      id: 'dashboard' as ActivePage,
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'assessment' as ActivePage,
      label: 'Assessment & Explainability',
      icon: ClipboardCheck,
      badge: 'Unified XAI',
      activeOnExplainability: true,
    },
  ];

  // Division 2: Aggregate Model Intelligence & Institutional Auditing
  const modelDivisionItems = [
    {
      id: 'performance' as ActivePage,
      label: 'Model Performance',
      icon: BarChart3,
      badge: undefined,
    },
    {
      id: 'fairness' as ActivePage,
      label: 'Fairness & Bias Audit',
      icon: Scale,
      badge: undefined,
    },
    {
      id: 'dataset' as ActivePage,
      label: 'Dataset Insights',
      icon: Database,
      badge: undefined,
    },
    {
      id: 'about' as ActivePage,
      label: 'Model Architecture',
      icon: Info,
      badge: undefined,
    },
  ];

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    onCloseMobile();
  };

  const renderNavButton = (item: {
    id: ActivePage;
    label: string;
    icon: React.ElementType;
    badge?: string;
    activeOnExplainability?: boolean;
  }) => {
    const Icon = item.icon;
    const isActive =
      activePage === item.id ||
      (item.activeOnExplainability && activePage === 'explainability');

    return (
      <button
        key={item.id}
        onClick={() => handleNavClick(item.id)}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all relative group ${
          isActive
            ? 'bg-blue-900 text-white shadow-xs font-semibold'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
        }`}
        title={isCollapsed ? item.label : undefined}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon
          className={`w-5 h-5 shrink-0 transition-colors ${
            isActive ? 'text-blue-200' : 'text-slate-500 group-hover:text-blue-900'
          }`}
          aria-hidden="true"
        />

        {!isCollapsed && (
          <div className="flex-1 flex items-center justify-between min-w-0">
            <span className="text-xs sm:text-sm font-semibold tracking-tight truncate">
              {item.label}
            </span>
            {item.badge && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ml-1.5 ${
                  isActive
                    ? 'bg-blue-800 text-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {item.badge}
              </span>
            )}
          </div>
        )}
      </button>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-blue-200" aria-hidden="true" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                CrediTrust <span className="text-blue-900 font-bold">AI</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 block tracking-wider uppercase">
                Underwriting & Governance
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List Organized by Divisions */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto" aria-label="Main Navigation">
        {/* DIVISION 1: APPLICANT DECISIONING & XAI */}
        <div>
          {!isCollapsed && (
            <div className="px-3 pb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Applicant Decisioning
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Tab 1
              </span>
            </div>
          )}
          {isCollapsed && <div className="my-1.5 border-t border-slate-100" />}

          <div className="space-y-1">
            {decisioningItems.map(renderNavButton)}
          </div>
        </div>

        {/* DIVISION 2: MODEL INTELLIGENCE & GOVERNANCE */}
        <div className="pt-2 border-t border-slate-100">
          {!isCollapsed && (
            <div className="px-3 pb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                Model Intelligence
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                Division
              </span>
            </div>
          )}
          {isCollapsed && <div className="my-1.5 border-t border-slate-100" />}

          <div className="space-y-1">
            {modelDivisionItems.map(renderNavButton)}
          </div>
        </div>
      </nav>

      {/* Desktop Collapse Toggle */}
      <div className="hidden lg:flex px-3 py-3 border-t border-slate-100 justify-end">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out h-screen sticky top-0 z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
