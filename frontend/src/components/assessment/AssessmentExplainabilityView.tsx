import React, { useState, useRef } from 'react';
import {
  ApplicantInput,
  PredictionResult,
  BackendData,
} from '../../types';
import {
  Sparkles,
  ClipboardCheck,
  Sliders,
  Layers,
  ArrowDown,
  Info,
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
      <div className="bg-gradient-to-br from-[#102F29] via-[#173F35] to-[#102F29] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-[0_2px_8px_rgba(16,47,41,0.12)] border border-[#315F50]/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#173F35] text-[#DCE8DF] border border-[#315F50] text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-[#DCE8DF]" />
                Unified Decisioning & Explainability Workspace
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#173F35] text-[#DCE8DF] border border-[#315F50] text-[11px] font-medium">
                Live Underwriting
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Credit Risk Assessment & Explainability
            </h2>

            <p className="text-[#DCE8DF] text-xs sm:text-[13px] leading-relaxed">
              Evaluate loan applicant financial profiles with instant calibrated risk scoring. Every underwriting decision is automatically paired with multi-dimensional XAI diagnostics—including SHAP feature attributions, LIME local rules, and actionable counterfactual recourse.
            </p>
          </div>

          {/* Quick Preset Selector for Fast Exploration */}
          {projectData.sample_applicants && projectData.sample_applicants.length > 0 && (
            <div className="bg-[#173F35]/70 rounded-xl p-4 border border-[#315F50]/50 shrink-0 lg:max-w-xs w-full shadow-2xs">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#DCE8DF]/80 block mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#DCE8DF]" />
                Quick-Load Applicant Scenarios
              </span>
              <div className="space-y-1.5">
                {projectData.sample_applicants.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample.data)}
                    className="w-full text-left p-2.5 rounded-lg bg-[#102F29]/70 hover:bg-[#102F29] border border-[#315F50]/60 transition-colors flex items-center justify-between group"
                  >
                    <div className="truncate pr-2">
                      <span className="font-semibold text-xs text-white block group-hover:text-[#DCE8DF] transition-colors truncate">
                        {sample.label}
                      </span>
                      <span className="text-[10px] text-[#DCE8DF]/70 block truncate">
                        {sample.data.Age}y/o &bull; ₹{sample.data['Credit amount'].toLocaleString()} &bull; {sample.data.Duration}m
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#DCE8DF] shrink-0 uppercase tracking-wider">
                      Load &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* In-Tab Navigation Pills: Allows user to view all or isolate specific XAI views */}
      <div className="bg-white rounded-xl border border-[#E0E4DD] p-1.5 shadow-[0_1px_3px_0_rgba(32,44,40,0.04)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto py-0.5">
          <button
            onClick={() => setActiveSubView('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubView === 'all'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-[#68736D] hover:text-[#173F35] hover:bg-[#F1F5F0]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full Workspace</span>
          </button>

          <button
            onClick={() => setActiveSubView('decision')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubView === 'decision'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-[#68736D] hover:text-[#173F35] hover:bg-[#F1F5F0]'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Applicant Form & Decision</span>
          </button>

          <button
            onClick={() => setActiveSubView('shap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubView === 'shap'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-[#68736D] hover:text-[#173F35] hover:bg-[#F1F5F0]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>SHAP Feature Impacts</span>
          </button>

          <button
            onClick={() => setActiveSubView('lime')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubView === 'lime'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-[#68736D] hover:text-[#173F35] hover:bg-[#F1F5F0]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>LIME Decision Rules</span>
          </button>

          <button
            onClick={() => setActiveSubView('counterfactual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSubView === 'counterfactual'
                ? 'bg-[#173F35] text-white shadow-xs'
                : 'text-[#68736D] hover:text-[#173F35] hover:bg-[#F1F5F0]'
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
            className="text-xs font-semibold text-[#173F35] hover:text-[#102F29] px-3 py-1.5 rounded-md hover:bg-[#F1F5F0] transition-colors flex items-center gap-1.5 shrink-0"
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
        <div ref={explainabilityRef} id="explainability-suite" className="space-y-8 pt-2">
          {assessmentResult ? (
            <>
              {/* Active Applicant Case File Header Banner */}
              <div className="bg-[#102F29] text-white rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#315F50]/40 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-semibold text-[#DCE8DF] tracking-wider">
                      Active Applicant Case File
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#287653]" />
                    <span className="text-xs text-[#DCE8DF]">
                      Model: <strong className="text-white">{assessmentResult.model}</strong>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold mt-1 tracking-tight text-white">
                    Explainability Breakdown for {assessmentResult.applicant_input.Sex === 'male' ? 'Male' : 'Female'} Applicant (Age {assessmentResult.applicant_input.Age})
                  </h3>

                  <p className="text-xs text-[#DCE8DF] mt-0.5">
                    Evaluated Risk:{' '}
                    <strong className={assessmentResult.risk === 'good' ? 'text-[#DCE8DF]' : 'text-[#F2D3D1]'}>
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
                    className="px-3.5 py-2 bg-[#173F35] hover:bg-[#102F29] text-[#DCE8DF] hover:text-white rounded-lg text-xs font-semibold border border-[#315F50] transition-colors shadow-2xs flex items-center gap-1.5"
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
            <div className="bg-white rounded-xl border border-[#E0E4DD] p-12 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 bg-[#F1F5F0] text-[#173F35] rounded-xl flex items-center justify-center mx-auto border border-[#E0E4DD]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#202C28]">No Applicant Assessed Yet</h3>
              <p className="text-xs text-[#68736D] max-w-md mx-auto">
                Fill in the applicant details above or click one of the quick scenario presets to immediately generate SHAP attributions, LIME surrogate rules, and counterfactual recourse.
              </p>
              <button
                onClick={scrollToForm}
                className="px-5 py-2.5 bg-[#173F35] text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-[#102F29] transition-colors"
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
