import React, { useState, useEffect } from 'react';
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
  const [isLoadingAssessment, setIsLoadingAssessment] = useState<boolean>(false);
  const [assessmentResult, setAssessmentResult] = useState<PredictionResult | null>(null);

  // Initial load: check backend status & fetch data
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const isOnline = await checkBackendHealth();
      if (isMounted) setBackendOnline(isOnline);

      const data = await fetchProjectData();
      if (isMounted) {
        setProjectData(data);

        // Pre-evaluate default sample applicant so Explainability is immediately active
        if (data.sample_applicants && data.sample_applicants.length > 0) {
          const defaultSample = data.sample_applicants[1].data; // Sample 2 (Moderate risk)
          const initialPrediction = predictLocally(defaultSample);
          setAssessmentResult(initialPrediction);
        }
      }
    };

    init();

    // Periodic heartbeat check
    const interval = setInterval(async () => {
      const online = await checkBackendHealth();
      if (isMounted) setBackendOnline(online);
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Handle applicant assessment submission
  const handleAssessApplicant = async (applicant: ApplicantInput) => {
    setIsLoadingAssessment(true);
    try {
      const result = await assessApplicant(applicant);
      setAssessmentResult(result);
    } catch (err) {
      console.error('Assessment failed, using fallback:', err);
      const fallback = predictLocally(applicant);
      setAssessmentResult(fallback);
    } finally {
      setIsLoadingAssessment(false);
    }
  };

  // Re-evaluate counterfactual simulation
  const handleSimulateChange = async (simulated: ApplicantInput) => {
    setIsLoadingAssessment(true);
    try {
      const res = await assessApplicant(simulated);
      setAssessmentResult(res);
    } finally {
      setIsLoadingAssessment(false);
    }
  };

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
      className={`min-h-screen ${activePage === 'dashboard' ? 'bg-[#0B0F0E] text-[#F1F5F0]' : 'bg-[#F5F5F0] text-[#202C28]'
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
          className={
            activePage === 'dashboard'
              ? 'flex-1 min-w-0 relative w-full'
              : 'flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8'
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
              {activePage === 'performance' && (
                <div className="space-y-8 animate-fade-in">
                  <ModelComparisonTable
                    models={projectData.models.comparison_table}
                    bestModelName={projectData.models.best_model}
                  />

                  <ModelBenchmarkChart
                    comparisonTable={projectData.models.comparison_table}
                    bestModel={projectData.models.best_model}
                  />

                  <RocPrCurves
                    rocCurves={projectData.models.roc_curves}
                    prCurves={projectData.models.pr_curves}
                  />

                  <ConfusionMatrixView
                    matrices={projectData.models.confusion_matrices}
                  />

                  <InterpretabilityScatter
                    data={projectData.models.interpretability_scatter}
                  />
                </div>
              )}

              {/* Fairness & Algorithmic Bias Audit Tab */}
              {activePage === 'fairness' && (
                <div className="animate-fade-in">
                  <FairnessMetrics fairnessData={projectData.fairness} />
                </div>
              )}

              {/* Dataset Analytics & Insights Tab */}
              {activePage === 'dataset' && (
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
