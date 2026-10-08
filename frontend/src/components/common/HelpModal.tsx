import React from 'react';
import { X, BookOpen, ShieldCheck, Scale, Cpu, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-900 rounded-lg">
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="help-modal-title" className="text-xl font-bold text-slate-900">
                Loan Officer & Non-Technical User Guide
              </h2>
              <p className="text-xs text-slate-500">
                Understanding AI-Assisted Credit Risk & Transparent Decisioning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close help guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6 max-h-[70vh] overflow-y-auto pr-2 text-sm text-slate-600">
          {/* Section 1 */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-blue-700" />
              How Does the AI Assess Risk?
            </h3>
            <p className="leading-relaxed">
              The model evaluates credit applications based on 9 historical financial attributes from the standard German Credit benchmark. Instead of a simple pass/fail, it computes a calibrated probability of loan default and assigns applicants to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-700">
              <li><strong className="text-emerald-700">Good Credit Risk:</strong> Low likelihood of default, meets primary lending criteria.</li>
              <li><strong className="text-rose-700">Higher Credit Risk:</strong> Elevated repayment risk, requiring risk mitigation or manual underwriter review.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-blue-700" />
              What are SHAP and LIME?
            </h3>
            <p className="leading-relaxed">
              Machine learning models can sometimes act like black boxes. To ensure transparency:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-700">
              <li><strong>SHAP (Shapley Additive exPlanations):</strong> Measures exactly how much each individual factor (e.g. savings, loan duration) moved the prediction away from the baseline average.</li>
              <li><strong>LIME:</strong> Builds an interpretable local approximation around the applicant to cross-verify the primary factors.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              Counterfactuals: "What Could Change This Decision?"
            </h3>
            <p className="leading-relaxed">
              Under Fair Lending and Adverse Action guidelines (e.g. ECOA/FCRA), applicants have the right to know actionable remedies. Our system computes practical hypotheticals (such as reducing requested credit amount by 30% or shortening repayment duration by 12 months) that would have lowered the risk score into the acceptable range.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
              <Scale className="w-4 h-4 text-blue-700" />
              Fairness & Regulatory Disclaimers
            </h3>
            <p className="leading-relaxed">
              The model undergoes continuous demographic parity and equalized odds testing across sensitive demographics (e.g., Sex) to prevent algorithmic disparate impact. This tool serves strictly as decision support and must not be used as the sole automated basis for loan rejection without human review.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-xl text-sm transition-colors shadow-xs"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
