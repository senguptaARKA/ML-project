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

// Common Components
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { HelpModal } from './components/common/HelpModal';

// Page Components
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { ApplicantForm } from './components/assessment/ApplicantForm';
import { PredictionResultCard } from './components/assessment/PredictionResultCard';
import { TopFactorsCard } from './components/explainability/TopFactorsCard';
import { ShapChart } from './components/explainability/ShapChart';
import { LimeExplanation } from './components/explainability/LimeExplanation';
import { CounterfactualCard } from './components/explainability/CounterfactualCard';
import { ModelComparisonTable } from './components/performance/ModelComparisonTable';
import { RocPrCurves } from './components/performance/RocPrCurves';
import { ConfusionMatrixView } from './components/performance/ConfusionMatrixView';
import { InterpretabilityScatter } from './components/performance/InterpretabilityScatter';
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

        // Pre-evaluate default sample applicant so Explainability page is immediately active
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-white rounded-full animate-spin mx-auto" />
          <h2 className="text-white text-lg font-bold">CrediTrust AI Portal</h2>
          <p className="text-slate-400 text-xs">Loading Explainable Credit Risk Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={(p) => setActivePage(p)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        hasAssessment={!!assessmentResult}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          activePage={activePage}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onNavigateToAssessment={() => setActivePage('assessment')}
          backendOnline={backendOnline}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* 1. DASHBOARD PAGE */}
          {activePage === 'dashboard' && (
            <DashboardOverview
              data={projectData}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {/* 2. CREDIT ASSESSMENT PAGE */}
          {activePage === 'assessment' && (
            <div className="space-y-8">
              <ApplicantForm
                onSubmit={handleAssessApplicant}
                isLoading={isLoadingAssessment}
                sampleApplicants={projectData.sample_applicants}
              />

              {/* Prediction Result Display */}
              {assessmentResult && (
                <div id="assessment-result-section">
                  <PredictionResultCard
                    result={assessmentResult}
                    onExploreExplainability={() => setActivePage('explainability')}
                    onNewAssessment={() => {
                      const element = document.getElementById('input-age');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* 3. EXPLAINABILITY PAGE */}
          {activePage === 'explainability' && (
            <div className="space-y-8">
              {assessmentResult ? (
                <>
                  <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div>
                      <span className="text-[11px] uppercase font-bold text-blue-300 tracking-wider">
                        Active Applicant Case File
                      </span>
                      <h2 className="text-xl font-bold mt-1">
                        Explainability Breakdown for {assessmentResult.applicant_input.Sex === 'male' ? 'Male' : 'Female'} Applicant (Age {assessmentResult.applicant_input.Age})
                      </h2>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Evaluated Risk: <strong className={assessmentResult.risk === 'good' ? 'text-emerald-400' : 'text-rose-400'}>{assessmentResult.risk_label}</strong> &bull; Loan: ₹{assessmentResult.applicant_input['Credit amount'].toLocaleString()} over {assessmentResult.applicant_input.Duration} months
                      </p>
                    </div>

                    <button
                      onClick={() => setActivePage('assessment')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-auto"
                    >
                      Change Applicant Parameters
                    </button>
                  </div>

                  {/* Top Factors Card */}
                  <TopFactorsCard
                    factorsIncreasingRisk={assessmentResult.factors_increasing_risk}
                    factorsReducingRisk={assessmentResult.factors_reducing_risk}
                  />

                  {/* SHAP Chart */}
                  <ShapChart
                    features={assessmentResult.shap_features}
                    baseValue={assessmentResult.shap_base_value}
                  />

                  {/* LIME Explanation */}
                  <LimeExplanation
                    limeFeatures={assessmentResult.lime_features}
                    shapFeatures={assessmentResult.shap_features}
                  />

                  {/* Counterfactual Explanation */}
                  <CounterfactualCard
                    counterfactual={assessmentResult.counterfactual}
                    currentApplicant={assessmentResult.applicant_input}
                    isBadRisk={assessmentResult.risk === 'bad'}
                    onSimulateChange={handleSimulateChange}
                  />
                </>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">No Applicant Assessed Yet</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Please submit an applicant profile on the Credit Assessment page to generate SHAP attributions, LIME weights, and counterfactual recourse.
                  </p>
                  <button
                    onClick={() => setActivePage('assessment')}
                    className="px-6 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-800"
                  >
                    Assess New Applicant
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 4. MODEL PERFORMANCE PAGE */}
          {activePage === 'performance' && (
            <div className="space-y-8">
              <ModelComparisonTable
                models={projectData.models.comparison_table}
                bestModelName={projectData.models.best_model}
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

          {/* 5. FAIRNESS & BIAS PAGE */}
          {activePage === 'fairness' && (
            <FairnessMetrics fairnessData={projectData.fairness} />
          )}

          {/* 6. DATASET INSIGHTS PAGE */}
          {activePage === 'dataset' && (
            <DatasetAnalytics dataset={projectData.dataset} />
          )}

          {/* 7. ABOUT THE MODEL PAGE */}
          {activePage === 'about' && <PipelineDiagram />}
        </main>
      </div>

      {/* Global Help & Terminology Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
