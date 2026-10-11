import React, { useState } from 'react';
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
  const [hoveredPage, setHoveredPage] = useState<ActivePage | null>(null);

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
    const isHovered = hoveredPage === item.id;

    let buttonStateClasses = '';
    if (isDashboard) {
      if (isActive) {
        buttonStateClasses = 'sidebar-dashboard-active font-semibold text-white';
      } else if (isHovered) {
        buttonStateClasses = 'sidebar-dashboard-hover font-semibold text-white';
      } else {
        buttonStateClasses =
          'text-[#CBD5D0] border border-transparent font-medium';
      }
    } else {
      if (isActive) {
        buttonStateClasses = 'sidebar-green-active sidebar-item--active font-semibold text-[#f7fffb]';
      } else if (isHovered) {
        buttonStateClasses = 'sidebar-green-hover sidebar-item--hovered font-semibold text-[#173F35]';
      } else {
        buttonStateClasses =
          'text-[#68736D] border border-transparent font-medium';
      }
    }

    return (
      <button
        key={item.id}
        onClick={() => handleNavClick(item.id)}
        onMouseEnter={() => setHoveredPage(item.id)}
        onMouseLeave={() => setHoveredPage(null)}
        className={`sidebar-nav-item w-full flex items-center gap-3 px-3 py-2.5 ${
          isDashboard ? 'rounded-[12px]' : 'rounded-[14px]'
        } text-left transition-all duration-200 relative group select-none cursor-pointer ${
          isActive ? 'is-active' : ''
        } ${buttonStateClasses}`}
        title={isCollapsed ? item.label : undefined}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Subtle luminous emerald active accent indicator for unmistakable identification */}
        {isActive && (
          <span
            className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full transition-all duration-200 pointer-events-none z-10 ${
              isDashboard
                ? 'bg-[#287653] shadow-[0_0_8px_rgba(40,118,83,0.7)]'
                : 'bg-[#7CDAB0] shadow-[0_0_10px_rgba(124,218,176,0.85)]'
            }`}
            aria-hidden="true"
          />
        )}

        {Icon ? (
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
              isDashboard
                ? isActive || isHovered
                  ? 'text-white'
                  : 'text-[#A1ACA7] group-hover:text-white'
                : isActive
                ? 'text-[#f7fffb]'
                : isHovered
                ? 'text-[#173F35]'
                : 'text-[#849087] group-hover:text-[#173F35]'
            }`}
            aria-hidden="true"
          />
        ) : isCollapsed ? (
          <span
            className={`w-5 text-center text-xs font-bold uppercase tracking-tight transition-colors duration-200 ${
              isDashboard
                ? isActive || isHovered
                  ? 'text-white'
                  : 'text-[#A1ACA7] group-hover:text-white'
                : isActive
                ? 'text-[#f7fffb]'
                : isHovered
                ? 'text-[#173F35]'
                : 'text-[#849087] group-hover:text-[#173F35]'
            }`}
          >
            {item.label.slice(0, 1)}
          </span>
        ) : null}

        {!isCollapsed && (
          <div className="flex-1 flex items-center justify-between min-w-0">
            <span
              className={`text-xs sm:text-[13px] tracking-tight truncate transition-colors duration-200 ${
                isDashboard
                  ? isActive || isHovered
                    ? 'text-white'
                    : 'text-[#CBD5D0] group-hover:text-white'
                  : isActive
                  ? 'text-[#f7fffb]'
                  : isHovered
                  ? 'text-[#173F35]'
                  : 'text-[#68736D] group-hover:text-[#173F35]'
              }`}
            >
              {item.label}
            </span>

            {item.badge && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ml-1.5 transition-colors duration-200 ${
                  isDashboard
                    ? isActive || isHovered
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'glass-subtle text-[#CBD5D0]'
                    : isActive
                    ? 'bg-[#0A3D2E] text-[#7CDAB0] border border-[#7CDAB0]/40 shadow-[0_0_8px_rgba(27,120,83,0.15)]'
                    : isHovered
                    ? 'bg-[#E1F5EE] text-[#173F35] border border-[#7CDAB0]/30'
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
          ? 'bg-[#0E1312]/85 backdrop-blur-2xl border-r border-white/12 text-[#F1F5F0]'
          : 'bg-white border-r border-[#E0E4DD] text-[#202C28]'
      }`}
    >
      {/* Mobile-only drawer close header */}
      <div
        className={`lg:hidden h-14 px-4 flex items-center justify-between border-b ${
          isDashboard ? 'border-white/12' : 'border-[#E0E4DD]'
        }`}
      >
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${
            isDashboard ? 'text-[#A1ACA7]' : 'text-[#849087]'
          }`}
        >
          Navigation Menu
        </span>
        <button
          onClick={onCloseMobile}
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            isDashboard
              ? 'text-[#A1ACA7] hover:text-white hover:bg-white/10'
              : 'text-[#849087] hover:text-[#202C28] hover:bg-[#F1F5F0]'
          }`}
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List Organized by Divisions */}
      <nav
        className={`flex-1 px-3 py-4 space-y-4 overflow-y-auto ${
          isDashboard ? 'sidebar-context-dashboard' : 'sidebar-context-non-dashboard'
        }`}
        aria-label="Main Navigation"
        onMouseLeave={() => setHoveredPage(null)}
      >
        {/* DIVISION 1: APPLICANT DECISIONING */}
        <div>
          {!isCollapsed && (
            <div className="px-3 pb-1.5 flex items-center justify-between">
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isDashboard ? 'text-[#A1ACA7]' : 'text-[#849087]'
                }`}
              >
                Applicant Decisioning
              </span>
            </div>
          )}
          {isCollapsed && (
            <div
              className={`my-1.5 border-t ${
                isDashboard ? 'border-white/10' : 'border-[#E0E4DD]'
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
            isDashboard ? 'border-white/10' : 'border-[#E0E4DD]'
          }`}
        >
          {!isCollapsed && (
            <div className="px-3 pb-1.5 flex items-center justify-between">
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isDashboard ? 'text-[#A1ACA7]' : 'text-[#849087]'
                }`}
              >
                Model Intelligence
              </span>
            </div>
          )}
          {isCollapsed && (
            <div
              className={`my-1.5 border-t ${
                isDashboard ? 'border-white/10' : 'border-[#E0E4DD]'
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
          isDashboard ? 'border-white/10' : 'border-[#E0E4DD]'
        }`}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="w-1.5 h-1.5 rounded-full bg-[#287653]" />
            <span
              className={`text-[10px] font-semibold tracking-tight ${
                isDashboard ? 'text-[#A1ACA7]' : 'text-[#849087]'
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
              ? 'text-[#A1ACA7] hover:text-white hover:bg-white/10'
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
          isDashboard ? 'bg-[#0E1312]' : 'bg-white'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
