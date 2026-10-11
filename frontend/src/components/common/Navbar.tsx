import React from 'react';
import {
  Menu,
  HelpCircle,
  User,
  PlusCircle,
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
  const isDashboard = activePage === 'dashboard';

  return (
    <header
      className={`sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${
        isDashboard
          ? 'bg-[#101514]/80 backdrop-blur-xl border-b border-white/14 shadow-[0_4px_24px_rgba(0,0,0,0.25)]'
          : 'bg-[#102F29] border-b border-[#315F50]/60 shadow-[0_2px_8px_rgba(16,47,41,0.18)]'
      }`}
    >
      {/* Left: Mobile hamburger menu button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className={`lg:hidden p-2 rounded-lg shadow-xs transition-all cursor-pointer ${
            isDashboard
              ? 'text-white glass-subtle'
              : 'text-[#102F29] hover:text-[#173F35] bg-white hover:bg-[#F5F5F0] border border-[#E0E4DD]'
          }`}
          aria-label="Open navigation menu"
        >
          <Menu className={`w-5 h-5 ${isDashboard ? 'text-white' : 'text-[#102F29]'}`} />
        </button>
      </div>

      {/* Right: Status indicator, Action CTA, Help, User Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 ml-auto">
        {/* Live Python ML Model Indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors ${
            isDashboard
              ? 'glass-subtle text-white'
              : 'bg-white text-[#102F29] border border-[#E0E4DD]'
          }`}
          title={
            backendOnline
              ? 'Connected to live Python server (http://localhost:8000)'
              : 'Running high-fidelity client-side calibrated ML engine'
          }
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              backendOnline
                ? 'bg-[#287653] shadow-[0_0_8px_rgba(40,118,83,0.8)] animate-pulse-subtle'
                : 'bg-[#B17B35]'
            }`}
            aria-hidden="true"
          />
          <span
            className={`hidden md:inline text-[11px] font-bold tracking-tight ${
              isDashboard ? 'text-[#F1F5F0]' : 'text-[#102F29]'
            }`}
          >
            {backendOnline ? 'Live Python ML Model' : 'Client ML Engine'}
          </span>
        </div>

        {/* Quick CTA to Assessment & Explainability */}
        {activePage !== 'assessment' && activePage !== 'explainability' && (
          <button
            onClick={onNavigateToAssessment}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer group ${
              isDashboard
                ? 'bg-[#173F35]/85 hover:bg-[#173F35] text-white border border-[#287653]/40 shadow-xs'
                : 'bg-white hover:bg-[#F5F5F0] text-[#102F29] border border-[#E0E4DD]'
            }`}
          >
            <PlusCircle
              className={`w-3.5 h-3.5 group-hover:scale-105 transition-transform ${
                isDashboard ? 'text-[#DCE8DF]' : 'text-[#173F35]'
              }`}
            />
            <span>Assess Applicant</span>
          </button>
        )}

        {/* Help / Guidance Modal Trigger */}
        <button
          onClick={onOpenHelp}
          className={`p-2 rounded-lg shadow-xs transition-all cursor-pointer group ${
            isDashboard
              ? 'text-[#CBD5D0] hover:text-white glass-subtle'
              : 'text-[#102F29] hover:text-[#173F35] bg-white hover:bg-[#F5F5F0] border border-[#E0E4DD]'
          }`}
          aria-label="Help and documentation guide"
          title="Explainable Credit Risk Guidance"
        >
          <HelpCircle
            className={`w-4 h-4 group-hover:scale-105 transition-transform ${
              isDashboard ? 'text-white' : 'text-[#102F29]'
            }`}
          />
        </button>

        {/* User Profile */}
        <div
          className={`flex items-center gap-2.5 pl-2.5 border-l ${
            isDashboard ? 'border-white/15' : 'border-[#315F50]'
          }`}
        >
          {/* Avatar box */}
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-xs transition-colors ${
              isDashboard
                ? 'glass-subtle text-[#CBD5D0]'
                : 'bg-white border border-[#E0E4DD] text-[#102F29]'
            }`}
          >
            <User className={`w-4 h-4 ${isDashboard ? 'text-white' : 'text-[#102F29]'}`} />
          </div>
          <div className="hidden xl:block text-left">
            <span className="text-xs font-semibold text-white block leading-tight">
              Officer Subra
            </span>
            <span className="text-[10px] text-[#CBD5D0] block leading-tight mt-0.5">
              Credit Risk Desk
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
