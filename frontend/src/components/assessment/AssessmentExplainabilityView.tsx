import React, { useState, useRef } from 'react';
import {
  ApplicantInput,
  PredictionResult,
  BackendData,
} from '../../types';
import {
  Sparkles,
  ClipboardCheck,
  CheckCircle2,
  Sliders,
  Layers,
  ArrowDown,
  Info,
  ShieldCheck,
  User,
  Zap,
} from 'lucide-react';
import { ApplicantForm } from './ApplicantForm';
import { PredictionResultCard } from './PredictionResultCard';
import { TopFactorsCard } from '../explainability/TopFactorsCard';
import { ShapChart } from '../explainability/ShapChart';
import { LimeExplanation } from '../explainability/LimeExplanation';
import { CounterfactualCard } from '../explainability/CounterfactualCard';

interface AssessmentExplainabilityViewProps {
  projectData: BackendData;
  assessmentResult: PredictionResult | null;
  isLoadingAssessment: boolean;
  onAssessApplicant: (applicant: ApplicantInput) => void;
  onSimulateChange: (simulated: ApplicantInput) => void;
}

type SubSectionView = 'all' | 'decision' | 'shap' | 'lime' | 'counterfactual';

export const AssessmentExplainabilityView: React.FC<AssessmentExplainabilityViewProps> = ({
  projectData,
  assessmentResult,
  isLoadingAssessment,
  onAssessApplicant,
  onSimulateChange,
}) => {
  const [activeSubView, setActiveSubView] = useState<SubSectionView>('all');
  const explainabilityRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToExplainability = () => {
    if (activeSubView === 'decision') {
      setActiveSubView('all');
    }
    setTimeout(() => {
      explainabilityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectSample = (sampleData: ApplicantInput) => {
    onAssessApplicant(sampleData);
    scrollToExplainability();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Unified Tab Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-blue-300" />
                Unified Decisioning & Explainability Workspace
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-medium">
                Live Underwriting
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Credit Risk Assessment & Explainability
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Evaluate loan applicant financial profiles with instant calibrated risk scoring. Every underwriting decision is automatically paired with multi-dimensional XAI diagnostics—including SHAP feature attributions, LIME local rules, and actionable counterfactual recourse.
            </p>
          </div>

          {/* Quick Preset Selector for Fast Exploration */}
          {projectData.sample_applicants && projectData.sample_applicants.length > 0 && (
            <div className="bg-slate-800/80 backdrop-blur-xs rounded-xl p-4 border border-slate-700/60 shrink-0 lg:max-w-xs w-full">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                Quick-Load Applicant Scenarios
              </span>
              <div className="space-y-2">
                {projectData.sample_applicants.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample.data)}
                    disabled={isLoadingAssessment}
                    className="w-full text-left px-3 py-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 text-xs text-slate-200 border border-slate-700 hover:border-blue-500/50 transition-all flex items-center justify-between group"
                  >
                    <span className="truncate font-medium">{sample.label}</span>
                    <span className="text-[10px] text-blue-400 group-hover:text-blue-300 font-semibold shrink-0 ml-2">
                      Test &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-blue-600/10 to-transparent pointer-events-none" />
      </div>

      {/* In-Tab Navigation Pills: Allows user to view all or isolate specific XAI views */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            onClick={() => setActiveSubView('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSubView === 'all'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full Workspace</span>
          </button>

          <button
            onClick={() => setActiveSubView('decision')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSubView === 'decision'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Applicant Form & Decision</span>
          </button>

          <button
            onClick={() => setActiveSubView('shap')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSubView === 'shap'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>SHAP Feature Impacts</span>
          </button>

          <button
            onClick={() => setActiveSubView('lime')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSubView === 'lime'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>LIME Decision Rules</span>
          </button>

          <button
            onClick={() => setActiveSubView('counterfactual')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeSubView === 'counterfactual'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>What-If Recourse Simulator</span>
          </button>
        </div>

        {/* Quick jump to explainability if active result exists */}
        {assessmentResult && activeSubView === 'all' && (
          <button
            onClick={scrollToExplainability}
            className="text-xs font-semibold text-blue-900 hover:text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Jump to Explainability</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* SECTION 1: APPLICANT FORM & PREDICTION RESULT */}
      {(activeSubView === 'all' || activeSubView === 'decision') && (
        <div ref={formRef} className="space-y-8">
          <ApplicantForm
            onSubmit={onAssessApplicant}
            isLoading={isLoadingAssessment}
            sampleApplicants={projectData.sample_applicants}
          />

          {/* Real-time Prediction Result Card */}
          {assessmentResult && (
            <div id="assessment-result-section">
              <PredictionResultCard
                result={assessmentResult}
                onExploreExplainability={scrollToExplainability}
                onNewAssessment={scrollToForm}
              />
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: EXPLAINABILITY SUITE (Embedded seamlessly in the same tab) */}
      {(activeSubView === 'all' ||
        activeSubView === 'shap' ||
        activeSubView === 'lime' ||
        activeSubView === 'counterfactual') && (
          <div ref={explainabilityRef} id="explainability-suite" className="space-y-8 pt-4">
            {assessmentResult ? (
              <>
                {/* Active Applicant Case File Header Banner */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase font-bold text-blue-300 tracking-wider">
                        Active Applicant Case File
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span className="text-xs text-slate-300">
                        Model: <strong>{assessmentResult.model}</strong>
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mt-1">
                      Explainability Breakdown for {assessmentResult.applicant_input.Sex === 'male' ? 'Male' : 'Female'} Applicant (Age {assessmentResult.applicant_input.Age})
                    </h3>

                    <p className="text-xs text-slate-300 mt-0.5">
                      Evaluated Risk:{' '}
                      <strong className={assessmentResult.risk === 'good' ? 'text-emerald-400' : 'text-rose-400'}>
                        {assessmentResult.risk_label}
                      </strong>{' '}
                      &bull; Loan: ₹{assessmentResult.applicant_input['Credit amount'].toLocaleString()} over{' '}
                      {assessmentResult.applicant_input.Duration} months &bull; Housing:{' '}
                      <span className="capitalize">{assessmentResult.applicant_input.Housing}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={scrollToForm}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <span>Edit Applicant Inputs</span>
                    </button>
                  </div>
                </div>

                {/* Sub-view: SHAP & Top Factors */}
                {(activeSubView === 'all' || activeSubView === 'shap') && (
                  <>
                    <TopFactorsCard
                      factorsIncreasingRisk={assessmentResult.factors_increasing_risk}
                      factorsReducingRisk={assessmentResult.factors_reducing_risk}
                    />

                    <ShapChart
                      features={assessmentResult.shap_features}
                      baseValue={assessmentResult.shap_base_value}
                    />
                  </>
                )}

                {/* Sub-view: LIME Local Surrogate Explanation */}
                {(activeSubView === 'all' || activeSubView === 'lime') && (
                  <LimeExplanation
                    limeFeatures={assessmentResult.lime_features}
                    shapFeatures={assessmentResult.shap_features}
                  />
                )}

                {/* Sub-view: Counterfactual Recourse ("What-If" Simulator) */}
                {(activeSubView === 'all' || activeSubView === 'counterfactual') && (
                  <CounterfactualCard
                    counterfactual={assessmentResult.counterfactual}
                    currentApplicant={assessmentResult.applicant_input}
                    isBadRisk={assessmentResult.risk === 'bad'}
                    onSimulateChange={onSimulateChange}
                  />
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Applicant Assessed Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Fill in the applicant details above or click one of the quick scenario presets to immediately generate SHAP attributions, LIME surrogate rules, and counterfactual recourse.
                </p>
                <button
                  onClick={scrollToForm}
                  className="px-6 py-2.5 bg-blue-900 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-800 transition-colors"
                >
                  Go to Applicant Form
                </button>
              </div>
            )}
          </div>
        )}
    </div>
  );
};
export default AssessmentExplainabilityView;
