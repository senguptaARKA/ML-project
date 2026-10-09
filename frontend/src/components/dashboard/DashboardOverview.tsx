import React, { useState, useEffect, useRef } from 'react';
import { BackendData, ActivePage } from '../../types';
import {
  Database,
  Trophy,
  Sparkles,
  Scale,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Brain,
  Activity,
  Shield,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';
import { DashboardAnimatedBackground } from './DashboardAnimatedBackground';

interface DashboardOverviewProps {
  data: BackendData;
  onNavigate: (page: ActivePage) => void;
}

// Custom hook for scroll-triggered reveal
function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible] as const;
}

// Animated counting number component
const AnimatedNumber: React.FC<{
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}> = ({ value, decimals = 0, prefix = '', suffix = '', duration = 1000 }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCurrent(ease * value);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCurrent(value);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {current.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  data,
  onNavigate,
}) => {
  const { dataset, models, fairness } = data;
  const bestModelMetric =
    models.comparison_table.find((m) => m.model === models.best_model) ||
    models.comparison_table[models.comparison_table.length - 1];

  // Interactive state for neural diagram feature inspection
  const [selectedFeature, setSelectedFeature] = useState<string>('Income');

  // Scroll position tracking for progress bar and back-to-top button
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPercent =
        windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
      setScrollProgress(scrollPercent);

      if (totalScroll > 280) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Section reveal refs
  const [heroRef, heroInView] = useScrollReveal();
  const [kpiRef, kpiInView] = useScrollReveal();
  const [diagramRef, diagramInView] = useScrollReveal();
  const [benchmarksRef, benchmarksInView] = useScrollReveal();
  const [shortcutsRef, shortcutsInView] = useScrollReveal();

  return (
    <div className="relative min-h-screen w-full px-4 sm:px-6 lg:px-10 py-8 text-[#F1F5F0]">
      {/* 0. DEDICATED FULL-CANVAS ANIMATED BACKGROUND (Cinematic MP4 + Canvas Fluid Particles) */}
      <DashboardAnimatedBackground />

      {/* Foreground Content Stack */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        {/* Scroll Progress Bar at the top of content */}
        <div className="fixed top-16 left-0 right-0 h-[2px] bg-transparent z-40 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-[#287653] via-[#6A9443] to-[#DCE8DF] transition-all duration-150 ease-out shadow-[0_0_8px_rgba(106,148,67,0.7)]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* ========================================================= */}
        {/* 1. CENTERED EXECUTIVE DASHBOARD HEADING SECTION           */}
        {/* ========================================================= */}
        <section
          aria-label="Executive Dashboard Overview"
          className="text-center pt-4 pb-2 max-w-4xl mx-auto space-y-4"
        >
          {/* Eyebrow Label inside a refined dark glass capsule */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-[#DCE8DF] uppercase tracking-wider shadow-sm animate-slide-up-fade"
            style={{ animationDelay: '60ms' }}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#6A9443]" />
            <span>Institutional Risk Surveillance & Model Auditing</span>
          </div>

          {/* Centered Main Title with subtle luminous text glow */}
          <h1
            className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] animate-slide-up-fade"
            style={{ animationDelay: '140ms' }}
          >
            Executive Dashboard
          </h1>

          {/* Centered Subtitle */}
          <p
            className="text-sm sm:text-base text-[#DCE8DF]/90 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] animate-slide-up-fade font-normal"
            style={{ animationDelay: '220ms' }}
          >
            Portfolio Health & Institutional ML Governance
          </p>

          {/* Subtle decorative divider with symmetrical fine line and bronze detail */}
          <div
            className="flex items-center justify-center gap-3 pt-1 animate-slide-up-fade"
            style={{ animationDelay: '300ms' }}
            aria-hidden="true"
          >
            <div className="h-[1px] w-20 sm:w-32 bg-gradient-to-r from-transparent to-[#AECFBE]/50" />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AECFBE]" />
              <span className="w-2 h-2 rotate-45 border border-[#A88955] bg-[#A88955]/20 shadow-[0_0_6px_rgba(168,137,85,0.4)]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#AECFBE]" />
            </div>
            <div className="h-[1px] w-20 sm:w-32 bg-gradient-to-l from-transparent to-[#AECFBE]/50" />
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. PREMIUM ASYMMETRIC 2-COLUMN HERO (DEEP EMERALD GLASS)  */}
        {/* ========================================================= */}
        <section
          ref={heroRef}
          aria-label="Explainable Credit Risk Management Hero"
          className={`dashboard-glass-dark rounded-2xl p-6 sm:p-8 lg:p-9 text-white relative overflow-hidden transition-all duration-700 ease-out border border-[#AECFBE]/24 shadow-[0_16px_44px_rgba(0,0,0,0.45)] ${
            heroInView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Subtle internal atmospheric glow */}
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-[#38582F]/20 to-transparent pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Narrative Copy and Action Buttons (approx 60%) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 backdrop-blur-xs text-[#DCE8DF] border border-white/15 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6A9443]" />
                <span>Production Banking AI System</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-white leading-tight">
                Explainable Credit Risk Management
              </h2>

              <p className="text-[#DCE8DF]/90 text-xs sm:text-[13px] leading-relaxed max-w-xl font-normal">
                AI-powered credit assessment with transparent, auditable decision-making. Loan officers can score applicants, review real-time SHAP attributions, and formulate actionable counterfactuals in a single unified workspace—while model governance teams audit comparative benchmarks, demographic parity, and dataset health in the Model Intelligence Division.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('assessment')}
                  className="px-5 py-2.5 bg-white hover:bg-[#F1F5F0] text-[#06140F] font-bold rounded-lg text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#173F35]" />
                  <span>Assess Applicant & Explainability</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('performance')}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-[#DCE8DF] hover:text-white font-medium rounded-lg text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-xs"
                >
                  <BarChart3 className="w-4 h-4 text-[#DCE8DF]" />
                  <span>Explore Model Division</span>
                </button>
              </div>
            </div>

            {/* Right Column: Sophisticated Model Telemetry & Risk Glass Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#0A211A]/80 backdrop-blur-md rounded-xl border border-[#AECFBE]/20 p-5 space-y-4 shadow-xl">
                {/* Telemetry Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#287653] shadow-[0_0_8px_rgba(40,118,83,0.8)] animate-pulse-subtle" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#DCE8DF]">
                      Model Telemetry
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#A88955]/20 text-[#D4AF37] border border-[#A88955]/30">
                    Tier 1 Champion
                  </span>
                </div>

                {/* Champion Model Metric Highlight */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/5 backdrop-blur-xs border border-white/10">
                    <span className="text-[10px] uppercase font-semibold text-[#ABB89C] block">
                      Champion Model
                    </span>
                    <span className="text-sm font-bold text-white block mt-0.5 truncate">
                      {models.best_model}
                    </span>
                    <span className="text-[10px] text-[#DCE8DF]/80 block mt-1">
                      Acc: {(bestModelMetric.accuracy * 100).toFixed(1)}% | F1: {bestModelMetric.f1.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 backdrop-blur-xs border border-white/10">
                    <span className="text-[10px] uppercase font-semibold text-[#ABB89C] block">
                      ROC-AUC Score
                    </span>
                    <span className="text-xl font-bold text-white block mt-0.5">
                      <AnimatedNumber value={bestModelMetric.roc_auc * 100} decimals={1} suffix="%" />
                    </span>
                    <span className="text-[10px] text-[#6A9443] font-semibold block mt-1">
                      +3.8% vs Baseline
                    </span>
                  </div>
                </div>

                {/* Live German Credit Cohort Ratio */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#DCE8DF] text-[11px]">Cohort Risk Distribution</span>
                    <span className="text-[#D4AF37] text-[11px] font-semibold">
                      1,000 Total Audited Loans
                    </span>
                  </div>

                  {/* Segmented Risk Bar */}
                  <div className="w-full h-2.5 rounded-full bg-[#06140F] border border-white/10 overflow-hidden flex shadow-inner">
                    <div
                      className="h-full bg-[#287653] transition-all duration-700"
                      style={{ width: '70%' }}
                      title="Low Risk: 700 loans (70.0%)"
                    />
                    <div
                      className="h-full bg-[#B64D49] transition-all duration-700"
                      style={{ width: '30%' }}
                      title="Elevated Risk: 300 loans (30.0%)"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#DCE8DF]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-xs bg-[#287653]" />
                      Low Risk (70.0%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-xs bg-[#B64D49]" />
                      Elevated Risk (30.0%)
                    </span>
                  </div>
                </div>

                {/* Status footer stamp */}
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/10 text-[#DCE8DF]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6A9443]" />
                    <span>Demographic Parity Verified</span>
                  </span>
                  <span className="text-[#D4AF37] font-medium text-[10px]">
                    Basel III / SR 11-7
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. ANIMATED KPI & PORTFOLIO OVERVIEW (DARK GLASS PANELS)  */}
        {/* ========================================================= */}
        <section
          ref={kpiRef}
          aria-label="Core System Metrics and Governance Health"
          className={`space-y-4 transition-all duration-700 ease-out ${
            kpiInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[#ABB89C] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              Core System Metrics & Governance Health
            </h2>
            <span className="text-[11px] text-[#DCE8DF]/70">
              Live Institutional Telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Dataset Cohort (Dark Glass Card) */}
            <div
              onClick={() => onNavigate('dataset')}
              className="dashboard-glass-card rounded-2xl p-5 hover:-translate-y-1 hover:border-[#AECFBE]/40 hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] transition-all duration-200 cursor-pointer group select-none flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ABB89C]">
                      Dataset Cohort
                    </p>
                    <p className="text-2xl sm:text-[26px] font-bold text-white mt-1.5 tracking-tight">
                      <AnimatedNumber value={dataset.total_applicants} suffix=" Loans" />
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-[#DCE8DF] border border-white/15 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#173F35]/60 transition-transform shadow-xs">
                    <Database className="w-4.5 h-4.5" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <p className="text-xs text-[#DCE8DF]/80 truncate">
                  {dataset.training_samples} Train / {dataset.testing_samples} Test ({dataset.features_count} Features)
                </p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 bg-white/10 text-[#DCE8DF] border-white/15">
                  German Credit
                </span>
              </div>
            </div>

            {/* Card 2: Champion Model (Dark Glass Card with Bronze accent) */}
            <div
              onClick={() => onNavigate('performance')}
              className="dashboard-glass-card rounded-2xl p-5 hover:-translate-y-1 hover:border-[#A88955]/50 hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] transition-all duration-200 cursor-pointer group select-none flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#A88955]/15 to-transparent pointer-events-none" />
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ABB89C]">
                      Champion Model
                    </p>
                    <p className="text-2xl sm:text-[26px] font-bold text-white mt-1.5 tracking-tight">
                      <AnimatedNumber value={bestModelMetric.roc_auc * 100} decimals={1} suffix="% AUC" />
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#A88955]/15 text-[#D4AF37] border border-[#A88955]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <Trophy className="w-4.5 h-4.5" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 relative z-10">
                <p className="text-xs text-[#DCE8DF]/80 truncate">
                  {models.best_model} (Acc: {(bestModelMetric.accuracy * 100).toFixed(1)}%, F1: {bestModelMetric.f1.toFixed(2)})
                </p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 bg-[#A88955]/15 text-[#D4AF37] border-[#A88955]/30">
                  Audited Model
                </span>
              </div>
            </div>

            {/* Card 3: Assessment & XAI (Dark Glass Card) */}
            <div
              onClick={() => onNavigate('assessment')}
              className="dashboard-glass-card rounded-2xl p-5 hover:-translate-y-1 hover:border-[#AECFBE]/40 hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] transition-all duration-200 cursor-pointer group select-none flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ABB89C]">
                      Assessment & XAI
                    </p>
                    <p className="text-2xl sm:text-[26px] font-bold text-white mt-1.5 tracking-tight">
                      Unified Tab
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-[#6A9443] border border-white/15 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#173F35]/60 transition-transform shadow-xs">
                    <Sparkles className="w-4.5 h-4.5" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <p className="text-xs text-[#DCE8DF]/80 truncate">
                  SHAP Waterfall + LIME + Recourse
                </p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 bg-white/10 text-[#6A9443] border-white/15">
                  Active Tab
                </span>
              </div>
            </div>

            {/* Card 4: Fairness Audit (Dark Glass Card) */}
            <div
              onClick={() => onNavigate('fairness')}
              className="dashboard-glass-card rounded-2xl p-5 hover:-translate-y-1 hover:border-[#AECFBE]/40 hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] transition-all duration-200 cursor-pointer group select-none flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ABB89C]">
                      Fairness Audit
                    </p>
                    <p className="text-2xl sm:text-[26px] font-bold text-white mt-1.5 tracking-tight">
                      <AnimatedNumber value={0.08} decimals={3} suffix=" Diff" />
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-[#DCE8DF] border border-white/15 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#173F35]/60 transition-transform shadow-xs">
                    <Scale className="w-4.5 h-4.5" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <p className="text-xs text-[#DCE8DF]/80 truncate">
                  Equalized Odds: {fairness.equalized_odds_difference.toFixed(3)} (Audit: Sex)
                </p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 bg-white/10 text-[#6A9443] border-white/15">
                  {fairness.demographic_parity_status}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. ANIMATED AI CREDIT DECISIONING ENGINE (DARK GLASS)      */}
        {/* ========================================================= */}
        <section
          ref={diagramRef}
          aria-label="AI Credit Decisioning Engine Architecture"
          className={`dashboard-glass rounded-2xl p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.35)] relative overflow-hidden transition-all duration-700 ease-out border border-[#AECFBE]/20 ${
            diagramInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Subtle structural grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#AECFBE_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

          {/* Engine Header */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-xs">
                <Brain className="w-4.5 h-4.5 text-[#6A9443]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base tracking-tight">
                  AI Credit Decisioning Engine
                </h3>
                <p className="text-[11px] text-[#ABB89C]">
                  Multi-layer feature propagation, calibrated scoring & credit recourse pipeline
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#ABB89C] hidden md:inline">
                Click feature to trace propagation:
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-[#173F35] text-[#DCE8DF] border border-[#315F50]">
                Calibrated Flow
              </span>
            </div>
          </div>

          {/* Central Neural Flow Diagram with Animated Connections */}
          <div className="relative z-10 flex-1 flex items-center justify-center py-8">
            <div className="flex items-center gap-4 sm:gap-8 lg:gap-12 w-full max-w-2xl justify-between">
              {/* 1. Input Layer */}
              <div className="flex flex-col items-center gap-3">
                <div className="text-[10px] uppercase font-semibold text-[#ABB89C] tracking-wider mb-1">
                  Input Features
                </div>
                {['Age', 'Income', 'History', 'Tenure'].map((label) => {
                  const isSelected = selectedFeature === label;
                  return (
                    <button
                      key={label}
                      onClick={() => setSelectedFeature(label)}
                      className={`w-18 h-8 rounded-lg border text-[10px] font-semibold transition-all duration-200 cursor-pointer flex items-center justify-center shadow-xs ${
                        isSelected
                          ? 'border-[#6A9443] bg-[#173F35] text-white shadow-sm scale-105 shadow-[0_0_8px_rgba(106,148,67,0.5)]'
                          : 'border-white/15 bg-white/5 text-[#DCE8DF] hover:border-[#6A9443]/60 hover:bg-white/10'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Connecting Lines 1 (Inputs -> Model Stage) */}
              <div className="flex-1 relative h-48">
                <svg
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  {[15, 35, 55, 75].map((startY, si) => {
                    const featureName = ['Age', 'Income', 'History', 'Tenure'][si];
                    const isHighlighted = selectedFeature === featureName;

                    return [30, 50, 70].map((endY, ei) => (
                      <line
                        key={`l1-${si}-${ei}`}
                        x1="0"
                        y1={startY}
                        x2="100"
                        y2={endY}
                        stroke={isHighlighted ? '#6A9443' : 'rgba(174, 207, 190, 0.25)'}
                        strokeWidth={isHighlighted ? 1.8 : 0.8}
                        className={isHighlighted ? 'animate-stroke-flow' : ''}
                        strokeDasharray={isHighlighted ? '4 4' : '2 4'}
                      />
                    ));
                  })}
                </svg>
              </div>

              {/* 2. Processing / Model Stage */}
              <div className="flex flex-col items-center gap-3">
                <div className="text-[10px] uppercase font-semibold text-[#ABB89C] tracking-wider mb-1">
                  Model Stage
                </div>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-10 rounded-xl border border-[#315F50] bg-[#0A211A] flex items-center justify-center shadow-sm relative group cursor-default"
                  >
                    <Activity className="w-4 h-4 text-[#6A9443]" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#6A9443] shadow-[0_0_6px_rgba(106,148,67,0.8)] animate-pulse-subtle" />
                  </div>
                ))}
              </div>

              {/* Connecting Lines 2 (Model Stage -> Decision Outputs) */}
              <div className="flex-1 relative h-48">
                <svg
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  {[30, 50, 70].map((startY, si) =>
                    [35, 65].map((endY, ei) => (
                      <line
                        key={`l2-${si}-${ei}`}
                        x1="0"
                        y1={startY}
                        x2="100"
                        y2={endY}
                        stroke="rgba(174, 207, 190, 0.25)"
                        strokeWidth="0.8"
                        strokeDasharray="2 4"
                      />
                    ))
                  )}
                </svg>
              </div>

              {/* 3. Output Decision States */}
              <div className="flex flex-col items-center gap-3">
                <div className="text-[10px] uppercase font-semibold text-[#ABB89C] tracking-wider mb-1">
                  Decision Output
                </div>

                {/* Low Risk Approved */}
                <div className="w-22 h-12 rounded-xl border border-[#287653]/50 bg-[#102F29]/80 backdrop-blur-xs flex flex-col items-center justify-center shadow-xs">
                  <Shield className="w-3.5 h-3.5 text-[#6A9443]" />
                  <span className="text-[9px] font-bold text-[#6A9443] mt-0.5">LOW RISK</span>
                  <span className="text-[8px] text-[#DCE8DF]/80">84% Approval</span>
                </div>

                {/* High Risk Scrutiny */}
                <div className="w-22 h-12 rounded-xl border border-[#B64D49]/50 bg-[#201010]/80 backdrop-blur-xs flex flex-col items-center justify-center shadow-xs">
                  <Shield className="w-3.5 h-3.5 text-[#E07A7A]" />
                  <span className="text-[9px] font-bold text-[#E07A7A] mt-0.5">HIGH RISK</span>
                  <span className="text-[8px] text-[#DCE8DF]/80">Audit Recourse</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Engine Stats Bar (Exact values preserved) */}
          <div className="relative z-10 grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
            <div className="text-center">
              <span className="text-lg font-bold text-white block">
                {(bestModelMetric.roc_auc * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] uppercase font-semibold text-[#ABB89C] tracking-wider">
                ROC-AUC Score
              </span>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-white block">
                {models.comparison_table.length}
              </span>
              <span className="text-[10px] uppercase font-semibold text-[#ABB89C] tracking-wider">
                Models Trained
              </span>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-white block">
                {dataset.features_count}
              </span>
              <span className="text-[10px] uppercase font-semibold text-[#ABB89C] tracking-wider">
                Input Features
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. MODEL PERFORMANCE & GOVERNANCE SCORECARD (DARK TABLE)  */}
        {/* ========================================================= */}
        <section
          ref={benchmarksRef}
          aria-label="Model Governance Scorecard & Benchmarks"
          className={`dashboard-glass rounded-2xl p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] space-y-4 transition-all duration-700 ease-out border border-[#AECFBE]/20 ${
            benchmarksInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
            <div>
              <h3 className="font-bold text-white text-sm tracking-tight">
                Model Performance & Governance Benchmarks
              </h3>
              <p className="text-[11px] text-[#ABB89C]">
                Multi-model comparison table audited on test cohort (300 cases)
              </p>
            </div>
            <button
              onClick={() => onNavigate('performance')}
              className="text-xs text-[#DCE8DF] hover:text-white font-semibold hover:underline inline-flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>View Full Benchmark Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Institutional table in translucent glass well */}
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/5 text-[#ABB89C] border-b border-white/10">
                  <th className="py-2.5 px-3 font-semibold">Model Architecture</th>
                  <th className="py-2.5 px-3 font-semibold text-right">ROC-AUC</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Accuracy</th>
                  <th className="py-2.5 px-3 font-semibold text-right">F1 Score</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {models.comparison_table.map((m) => {
                  const isChampion = m.model === models.best_model;
                  return (
                    <tr
                      key={m.model}
                      className={`hover:bg-white/5 transition-colors ${
                        isChampion ? 'bg-[#173F35]/40 font-medium' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-white flex items-center gap-2">
                        {isChampion ? (
                          <Trophy className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ABB89C] shrink-0" />
                        )}
                        <span>{m.model}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#6A9443]">
                        {(m.roc_auc * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#DCE8DF]/80">
                        {(m.accuracy * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#DCE8DF]/80">
                        {m.f1.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {isChampion ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#A88955]/20 text-[#D4AF37] border border-[#A88955]/30">
                            Champion
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-[#ABB89C] border border-white/10">
                            Candidate
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 6. DIVISION NAVIGATION SHORTCUTS (DARK GLASS CARDS)       */}
        {/* ========================================================= */}
        <section
          ref={shortcutsRef}
          aria-label="Division Navigation Shortcuts"
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-700 ease-out ${
            shortcutsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Shortcut 1: Assessment */}
          <div
            onClick={() => onNavigate('assessment')}
            className="dashboard-glass-card rounded-2xl p-5 hover:border-[#AECFBE]/40 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] transition-all duration-200 cursor-pointer space-y-2 group select-none flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#DCE8DF] bg-white/10 px-2 py-0.5 rounded border border-white/15">
                  Workspace Tab 1
                </span>
                <ArrowRight className="w-4 h-4 text-[#ABB89C] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="font-bold text-white text-sm">Credit Assessment & Explainability</h4>
              <p className="text-xs text-[#DCE8DF]/80 leading-relaxed">
                Combined interactive underwriting and instant XAI diagnostics: input applicant details, evaluate risk, inspect SHAP waterfall and simulate counterfactual recourse.
              </p>
            </div>
            <div className="pt-3 text-[11px] font-semibold text-[#6A9443] flex items-center gap-1 group-hover:underline">
              <span>Launch Underwriting Workspace</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Shortcut 2: Model Performance */}
          <div
            onClick={() => onNavigate('performance')}
            className="dashboard-glass-card rounded-2xl p-5 hover:border-[#AECFBE]/40 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] transition-all duration-200 cursor-pointer space-y-2 group select-none flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#DCE8DF] bg-white/10 px-2 py-0.5 rounded border border-white/15">
                  Model Division
                </span>
                <ArrowRight className="w-4 h-4 text-[#ABB89C] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="font-bold text-white text-sm">Model Performance & Benchmark</h4>
              <p className="text-xs text-[#DCE8DF]/80 leading-relaxed">
                Compare ROC-AUC, PR curves, Confusion Matrix, and interpretability latency across 4 production and baseline candidate models.
              </p>
            </div>
            <div className="pt-3 text-[11px] font-semibold text-[#6A9443] flex items-center gap-1 group-hover:underline">
              <span>Audit Model Benchmarks</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Shortcut 3: Fairness & Bias */}
          <div
            onClick={() => onNavigate('fairness')}
            className="dashboard-glass-card rounded-2xl p-5 hover:border-[#AECFBE]/40 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] transition-all duration-200 cursor-pointer space-y-2 group select-none flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#DCE8DF] bg-white/10 px-2 py-0.5 rounded border border-white/15">
                  Model Division
                </span>
                <ArrowRight className="w-4 h-4 text-[#ABB89C] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="font-bold text-white text-sm">Fairness, Bias & Dataset Auditing</h4>
              <p className="text-xs text-[#DCE8DF]/80 leading-relaxed">
                Verify demographic parity across gender, evaluate equalized odds, and inspect the 1,000-loan German Credit dataset cohort distributions.
              </p>
            </div>
            <div className="pt-3 text-[11px] font-semibold text-[#6A9443] flex items-center gap-1 group-hover:underline">
              <span>Review Algorithmic Disparities</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </section>

        {/* Floating Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#0A211A]/90 backdrop-blur-md text-white hover:bg-[#173F35] shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-[#AECFBE]/30 transition-all duration-200 hover:-translate-y-1 cursor-pointer flex items-center justify-center animate-fade-in"
          >
            <ChevronUp className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
