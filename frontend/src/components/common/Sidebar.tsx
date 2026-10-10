import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  X,
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
      badge: undefined,
    },
    {
      id: 'fairness' as ActivePage,
      label: 'Fairness & Bias Audit',
      badge: undefined,
    },
    {
      id: 'dataset' as ActivePage,
      label: 'Dataset Insights',
      badge: undefined,
    },
    {
      id: 'about' as ActivePage,
      label: 'Model Architecture',
      badge: undefined,
    },
  ];

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    onCloseMobile();
  };

  const isDashboard = activePage === 'dashboard';

  const renderNavButton = (item: {
    id: ActivePage;
    label: string;
    icon?: React.ElementType;
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
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 relative group select-none cursor-pointer ${
          isActive
            ? isDashboard
              ? 'bg-[#173F35]/90 text-white shadow-sm font-semibold border border-[#AECFBE]/30'
              : 'bg-[#173F35] text-white shadow-xs font-semibold'
            : isDashboard
            ? 'text-[#DCE8DF] hover:bg-white/10 hover:text-white hover:scale-[1.015] border border-transparent hover:border-[#6A9443]/30 font-medium'
            : 'text-[#68736D] hover:bg-[#F1F5F0] hover:text-[#173F35] hover:scale-[1.015] font-medium'
        }`}
        title={isCollapsed ? item.label : undefined}
        aria-current={isActive ? 'page' : undefined}
      >
        {Icon ? (
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${
              isActive
                ? 'text-[#DCE8DF]'
                : isDashboard
                ? 'text-[#ABB89C] group-hover:text-white'
                : 'text-[#849087] group-hover:text-[#173F35]'
            }`}
            aria-hidden="true"
          />
        ) : isCollapsed ? (
          <span className="w-5 text-center text-xs font-bold uppercase tracking-tight text-[#DCE8DF]">
            {item.label.slice(0, 1)}
          </span>
        ) : null}

        {!isCollapsed && (
          <div className="flex-1 flex items-center justify-between min-w-0">
            <span className="text-xs sm:text-[13px] tracking-tight truncate">
              {item.label}
            </span>

            {item.badge && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ml-1.5 transition-colors ${
                  isActive
                    ? 'bg-[#102F29] text-[#DCE8DF] border border-[#315F50]/60'
                    : isDashboard
                    ? 'bg-white/10 text-[#DCE8DF] border border-white/15'
                    : 'bg-[#F1F5F0] text-[#173F35] border border-[#E0E4DD]'
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
    <div
      className={`flex flex-col h-full select-none transition-colors duration-300 ${
        isDashboard
          ? 'bg-[#0A211A]/85 backdrop-blur-2xl border-r border-[#AECFBE]/20 text-[#F1F5F0]'
          : 'bg-white border-r border-[#E0E4DD] text-[#202C28]'
      }`}
    >
      {/* Mobile-only drawer close header */}
      <div
        className={`lg:hidden h-14 px-4 flex items-center justify-between border-b ${
          isDashboard ? 'border-[#AECFBE]/20' : 'border-[#E0E4DD]'
        }`}
      >
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${
            isDashboard ? 'text-[#ABB89C]' : 'text-[#849087]'
          }`}
        >
          Navigation Menu
        </span>
        <button
          onClick={onCloseMobile}
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            isDashboard
              ? 'text-[#ABB89C] hover:text-white hover:bg-white/10'
              : 'text-[#849087] hover:text-[#202C28] hover:bg-[#F1F5F0]'
          }`}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List Organized by Divisions */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto" aria-label="Main Navigation">
        {/* DIVISION 1: APPLICANT DECISIONING */}
        <div>
          {!isCollapsed && (
            <div className="px-3 pb-1.5 flex items-center justify-between">
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isDashboard ? 'text-[#ABB89C]' : 'text-[#849087]'
                }`}
              >
                Applicant Decisioning
              </span>
            </div>
          )}
          {isCollapsed && (
            <div
              className={`my-1.5 border-t ${
                isDashboard ? 'border-[#AECFBE]/15' : 'border-[#E0E4DD]'
              }`}
            />
          )}

          <div className="space-y-1">
            {decisioningItems.map(renderNavButton)}
          </div>
        </div>

        {/* DIVISION 2: MODEL INTELLIGENCE */}
        <div
          className={`pt-2 border-t ${
            isDashboard ? 'border-[#AECFBE]/15' : 'border-[#E0E4DD]'
          }`}
        >
          {!isCollapsed && (
            <div className="px-3 pb-1.5 flex items-center justify-between">
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isDashboard ? 'text-[#ABB89C]' : 'text-[#849087]'
                }`}
              >
                Model Intelligence
              </span>
            </div>
          )}
          {isCollapsed && (
            <div
              className={`my-1.5 border-t ${
                isDashboard ? 'border-[#AECFBE]/15' : 'border-[#E0E4DD]'
              }`}
            />
          )}

          <div className="space-y-1">
            {modelDivisionItems.map(renderNavButton)}
          </div>
        </div>
      </nav>

      {/* Desktop Collapse Toggle & Subtle Identity */}
      <div
        className={`hidden lg:flex px-3 py-3 border-t items-center justify-between ${
          isDashboard ? 'border-[#AECFBE]/15' : 'border-[#E0E4DD]'
        }`}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-[#287653]" />
            <span
              className={`text-[10px] font-semibold tracking-tight ${
                isDashboard ? 'text-[#ABB89C]' : 'text-[#849087]'
              }`}
            >
              CrediTrust AI
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-md transition-colors ml-auto cursor-pointer ${
            isDashboard
              ? 'text-[#ABB89C] hover:text-white hover:bg-white/10'
              : 'text-[#849087] hover:text-[#202C28] hover:bg-[#F1F5F0]'
          }`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out h-[calc(100vh-4rem)] sticky top-16 z-20 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-[#06140F]/70 backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out shadow-xl ${
          isDashboard ? 'bg-[#0A211A]' : 'bg-white'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
