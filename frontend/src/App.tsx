import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ActivePage,
  ApplicantInput,
  PredictionResult,
  BackendData,
} from './types';
import {
  checkBackendHealth,
  fetchProjectData,
  assessApplicant,
} from './services/api';
import { predictLocally } from './services/localModel';

// Common Navigation & Modal Components
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { HelpModal } from './components/common/HelpModal';

// Decisioning Division Components
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { AssessmentExplainabilityView } from './components/assessment/AssessmentExplainabilityView';

// Model Intelligence Division Components
import { ModelDivisionLayout } from './components/model-division/ModelDivisionLayout';
import { ModelComparisonTable } from './components/performance/ModelComparisonTable';
import { RocPrCurves } from './components/performance/RocPrCurves';
import { ConfusionMatrixView } from './components/performance/ConfusionMatrixView';
import { InterpretabilityScatter } from './components/performance/InterpretabilityScatter';
import { ModelBenchmarkChart } from './components/performance/ModelBenchmarkChart';
import { FairnessMetrics } from './components/fairness/FairnessMetrics';
import { DatasetAnalytics } from './components/dataset/DatasetAnalytics';
import { PipelineDiagram } from './components/about/PipelineDiagram';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);

  const [projectData, setProjectData] = useState<BackendData | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState<boolean>(false);
  const [assessmentResult, setAssessmentResult] = useState<PredictionResult | null>(null);

  // Concurrency request tracker to prevent out-of-order race conditions
  const assessmentSeqRef = useRef<number>(0);

  // Sync document title and scroll position to active page
  useEffect(() => {
    const titles: Record<ActivePage, string> = {
      dashboard: 'Executive Dashboard | CrediTrust AI',
      assessment: 'Applicant Assessment | CrediTrust AI',
      explainability: 'Explainability & Recourse | CrediTrust AI',
      performance: 'Model Performance | CrediTrust AI',
      fairness: 'Fairness & Bias Audit | CrediTrust AI',
      dataset: 'Dataset Analytics | CrediTrust AI',
      about: 'Architecture & Pipeline | CrediTrust AI',
    };
    document.title = titles[activePage] || 'CrediTrust AI Portal';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activePage]);

  // Global Escape key listener to close modals and drawers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isHelpOpen) setIsHelpOpen(false);
        if (isMobileOpen) setIsMobileOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHelpOpen, isMobileOpen]);

  // Initial load: check backend status & fetch data
  const initData = useCallback(async () => {
    setInitError(null);
    try {
      const isOnline = await checkBackendHealth();
      setBackendOnline(isOnline);

      const data = await fetchProjectData();
      if (data) {
        setProjectData(data);

        // Pre-evaluate default sample applicant so Explainability is immediately active
        if (data.sample_applicants && data.sample_applicants.length > 0) {
          const defaultSample = (data.sample_applicants[1] || data.sample_applicants[0])?.data;
          if (defaultSample) {
            const initialPrediction = predictLocally(defaultSample);
            setAssessmentResult(initialPrediction);
          }
        }
      } else {
        setInitError('Failed to load project configuration data.');
      }
    } catch (err) {
      console.error('Initialization error in CrediTrust AI portal:', err);
      setInitError('Unable to initialize CrediTrust AI portal. Please retry.');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    initData();

    // Periodic heartbeat check
    const interval = setInterval(async () => {
      try {
        const online = await checkBackendHealth();
        if (isMounted) setBackendOnline(online);
      } catch {
        if (isMounted) setBackendOnline(false);
      }
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [initData]);

  // Handle applicant assessment submission with race-condition protection and local fallback
  const handleAssessApplicant = async (applicant: ApplicantInput) => {
    const seq = ++assessmentSeqRef.current;
    setIsLoadingAssessment(true);
    try {
      const result = await assessApplicant(applicant);
      if (seq === assessmentSeqRef.current) {
        setAssessmentResult(result);
      }
    } catch (err) {
      console.error('Assessment failed, using fallback:', err);
      if (seq === assessmentSeqRef.current) {
        const fallback = predictLocally(applicant);
        setAssessmentResult(fallback);
      }
    } finally {
      if (seq === assessmentSeqRef.current) {
        setIsLoadingAssessment(false);
      }
    }
  };

  // Re-evaluate counterfactual simulation with race-condition protection and local fallback
  const handleSimulateChange = async (simulated: ApplicantInput) => {
    const seq = ++assessmentSeqRef.current;
    setIsLoadingAssessment(true);
    try {
      const res = await assessApplicant(simulated);
      if (seq === assessmentSeqRef.current) {
        setAssessmentResult(res);
      }
    } catch (err) {
      console.warn('Simulation API failed, using fallback:', err);
      if (seq === assessmentSeqRef.current) {
        const fallback = predictLocally(simulated);
        setAssessmentResult(fallback);
      }
    } finally {
      if (seq === assessmentSeqRef.current) {
        setIsLoadingAssessment(false);
      }
    }
  };

  // Initialization error state with recovery button
  if (initError && !projectData) {
    return (
      <div className="min-h-screen bg-[#102F29] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md bg-[#0A211A] p-6 rounded-2xl border border-red-500/30 shadow-2xl">
          <div className="w-10 h-10 bg-red-900/40 text-red-300 rounded-full flex items-center justify-center mx-auto text-lg font-bold border border-red-500/40">
            !
          </div>
          <h2 className="text-white text-base font-semibold tracking-tight">Initialization Error</h2>
          <p className="text-[#DCE8DF] text-xs leading-relaxed">{initError}</p>
          <button
            onClick={() => initData()}
            className="px-4 py-2 bg-[#287653] hover:bg-[#318B63] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Retry Initialization
          </button>
        </div>
      </div>
    );
  }

  // Loading state while data is being prepared
  if (!projectData) {
    return (
      <div className="min-h-screen bg-[#102F29] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#315F50] border-t-white rounded-full animate-spin mx-auto" />
          <h2 className="text-white text-base font-semibold tracking-tight">CrediTrust AI Portal</h2>
          <p className="text-[#DCE8DF] text-xs">Initializing Explainable Underwriting & Governance Engine...</p>
        </div>
      </div>
    );
  }

  // Determine if the current page belongs to the Model Intelligence Division
  const isModelDivisionPage =
    activePage === 'performance' ||
    activePage === 'fairness' ||
    activePage === 'dataset' ||
    activePage === 'about';

  return (
    <div
      className={`min-h-screen ${
        activePage === 'dashboard' ? 'bg-[#0B0F0E] text-[#F1F5F0]' : 'bg-[#F5F5F0] text-[#202C28]'
      } flex flex-col font-sans transition-colors duration-300 relative`}
    >
      {/* Top Application Header */}
      <Navbar
        activePage={activePage}
        onOpenMobileSidebar={() => setIsMobileOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onNavigateToAssessment={() => setActivePage('assessment')}
        backendOnline={backendOnline}
      />

      {/* Workspace Area: Sidebar + Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0 relative">
        <Sidebar
          activePage={activePage}
          onNavigate={(p) => setActivePage(p)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          hasAssessment={!!assessmentResult}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className={
            activePage === 'dashboard'
              ? 'flex-1 min-w-0 relative w-full outline-hidden'
              : 'flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8 outline-hidden'
          }
        >
          {/* 1. EXECUTIVE DASHBOARD OVERVIEW */}
          {activePage === 'dashboard' && (
            <DashboardOverview
              data={projectData}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {/* 2. UNIFIED CREDIT ASSESSMENT & EXPLAINABILITY TAB */}
          {(activePage === 'assessment' || activePage === 'explainability') && (
            <AssessmentExplainabilityView
              projectData={projectData}
              assessmentResult={assessmentResult}
              isLoadingAssessment={isLoadingAssessment}
              onAssessApplicant={handleAssessApplicant}
              onSimulateChange={handleSimulateChange}
            />
          )}

          {/* 3. MODEL INTELLIGENCE & GOVERNANCE DIVISION */}
          {isModelDivisionPage && (
            <ModelDivisionLayout
              activePage={activePage}
              onNavigate={(page) => setActivePage(page)}
              modelsData={projectData.models}
              fairnessData={projectData.fairness}
              datasetData={projectData.dataset}
            >
              {/* Model Performance Tab */}
              {activePage === 'performance' && projectData.models && (
                <div className="space-y-8 animate-fade-in">
                  <ModelComparisonTable
                    models={projectData.models.comparison_table || []}
                    bestModelName={projectData.models.best_model || ''}
                  />

                  <ModelBenchmarkChart
                    comparisonTable={projectData.models.comparison_table || []}
                    bestModel={projectData.models.best_model || ''}
                  />

                  <RocPrCurves
                    rocCurves={projectData.models.roc_curves || {}}
                    prCurves={projectData.models.pr_curves || {}}
                  />

                  <ConfusionMatrixView
                    matrices={projectData.models.confusion_matrices || {}}
                  />

                  <InterpretabilityScatter
                    data={projectData.models.interpretability_scatter || []}
                  />
                </div>
              )}

              {/* Fairness & Algorithmic Bias Audit Tab */}
              {activePage === 'fairness' && projectData.fairness && (
                <div className="animate-fade-in">
                  <FairnessMetrics fairnessData={projectData.fairness} />
                </div>
              )}

              {/* Dataset Analytics & Insights Tab */}
              {activePage === 'dataset' && projectData.dataset && (
                <div className="animate-fade-in">
                  <DatasetAnalytics dataset={projectData.dataset} />
                </div>
              )}

              {/* Model Architecture & ML Pipeline Tab */}
              {activePage === 'about' && (
                <div className="animate-fade-in">
                  <PipelineDiagram />
                </div>
              )}
            </ModelDivisionLayout>
          )}
        </main>
      </div>

      {/* Global Help & Terminology Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
