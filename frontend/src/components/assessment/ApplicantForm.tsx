import React, { useState } from 'react';
import {
  ApplicantInput,
  RiskClass,
} from '../../types';
import {
  User,
  DollarSign,
  Building,
  Briefcase,
  Calendar,
  Sparkles,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

interface ApplicantFormProps {
  onSubmit: (applicant: ApplicantInput) => void;
  isLoading: boolean;
  sampleApplicants: Array<{
    id: string;
    label: string;
    data: ApplicantInput;
  }>;
}

export const ApplicantForm: React.FC<ApplicantFormProps> = ({
  onSubmit,
  isLoading,
  sampleApplicants,
}) => {
  const initialData: ApplicantInput = {
    Age: 35,
    Job: 2,
    Sex: 'male',
    Housing: 'own',
    'Saving accounts': 'moderate',
    'Checking account': 'rich',
    'Credit amount': 5000,
    Duration: 24,
    Purpose: 'car',
  };

  const [formData, setFormData] = useState<ApplicantInput>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.Age || formData.Age < 18) {
      newErrors.Age = 'Applicant must be at least 18 years of age.';
    } else if (formData.Age > 100) {
      newErrors.Age = 'Please enter a valid age under 100.';
    }

    if (!formData['Credit amount'] || formData['Credit amount'] <= 0) {
      newErrors['Credit amount'] = 'Loan credit amount must be greater than zero.';
    } else if (formData['Credit amount'] > 2000000) {
      newErrors['Credit amount'] = 'Loan credit amount exceeds maximum allowable limit (₹2,000,000).';
    }

    if (!formData.Duration || formData.Duration <= 0) {
      newErrors.Duration = 'Loan duration must be at least 1 month.';
    } else if (formData.Duration > 72) {
      newErrors.Duration = 'Loan duration cannot exceed maximum allowable tenure (72 months).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleSampleSelect = (sample: ApplicantInput) => {
    setFormData(sample);
    setErrors({});
  };

  const handleReset = () => {
    setFormData(initialData);
    setErrors({});
  };

  return (
    <div className="bg-white rounded-xl border border-[#E0E4DD] shadow-[0_1px_3px_0_rgba(32,44,40,0.04)] overflow-hidden">
      {/* Header Banner */}
      <div className="p-6 bg-[#102F29] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#315F50]/40">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">Credit Risk Assessment</h2>
          <p className="text-[#DCE8DF] text-xs sm:text-[13px] mt-0.5">
            Enter applicant information to generate a transparent credit-risk assessment.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#DCE8DF]/80 font-medium">Quick Profiles:</span>
          {sampleApplicants.map((sample, idx) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSampleSelect(sample.data)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-[#173F35] hover:bg-[#102F29] text-[#DCE8DF] border border-[#315F50] transition-colors"
            >
              Preset {idx + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 text-[#DCE8DF]/80 hover:text-white rounded-md hover:bg-[#173F35] transition-colors"
            title="Reset form to defaults"
            aria-label="Reset form"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8" noValidate>
        {/* SECTION 1: Personal Information */}
        <div>
          <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#E0E4DD]">
            <User className="w-4 h-4 text-[#173F35]" aria-hidden="true" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#202C28]">
              1. Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Age */}
            <div>
              <label htmlFor="input-age" className="block text-xs font-semibold text-[#202C28] mb-1.5">
                Age (Years) <span className="text-[#B64D49]">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-age"
                  type="number"
                  min="18"
                  max="100"
                  value={formData.Age}
                  onChange={(e) => setFormData({ ...formData, Age: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm font-medium text-[#202C28] focus:border-[#173F35] focus:ring-1 focus:ring-[#173F35] transition-colors ${
                    errors.Age ? 'border-[#B64D49] ring-1 ring-[#B64D49]' : 'border-[#E0E4DD]'
                  }`}
                  aria-invalid={!!errors.Age}
                  aria-describedby={errors.Age ? 'age-error' : undefined}
                />
              </div>
              {errors.Age && (
                <p id="age-error" className="mt-1 text-xs text-[#B64D49] flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.Age}
                </p>
              )}
            </div>

            {/* Sex */}
            <div>
              <label htmlFor="input-sex" className="block text-xs font-semibold text-[#202C28] mb-1.5">
                Sex <span className="text-[#B64D49]">*</span>
              </label>
              <select
                id="input-sex"
                value={formData.Sex}
                onChange={(e) => setFormData({ ...formData, Sex: e.target.value as 'male' | 'female' })}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E0E4DD] rounded-lg text-sm font-medium text-[#202C28] focus:border-[#173F35] focus:ring-1 focus:ring-[#173F35] transition-colors"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <p className="mt-1 text-[11px] text-[#849087]">Audited for algorithmic fairness</p>
            </div>

            {/* Job Level */}
            <div>
              <label htmlFor="input-job" className="block text-xs font-semibold text-[#202C28] mb-1.5">
                Employment Skill Level <span className="text-[#B64D49]">*</span>
              </label>
              <select
                id="input-job"
                value={formData.Job}
                onChange={(e) => setFormData({ ...formData, Job: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E0E4DD] rounded-lg text-sm font-medium text-[#202C28] focus:border-[#173F35] focus:ring-1 focus:ring-[#173F35] transition-colors"
              >
                <option value={0}>0 — Unskilled (Non-resident)</option>
                <option value={1}>1 — Unskilled (Resident)</option>
                <option value={2}>2 — Skilled Employee / Official</option>
                <option value={3}>3 — Management / Highly Qualified</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Financial Information */}
        <div>
          <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#E0E4DD]">
            <DollarSign className="w-4 h-4 text-[#173F35]" aria-hidden="true" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#202C28]">
              2. Loan & Credit Parameters
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Credit Amount */}
            <div>
              <label htmlFor="input-credit-amount" className="block text-xs font-semibold text-[#202C28] mb-1.5">
                Requested Credit Amount (₹) <span className="text-[#B64D49]">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#849087] font-semibold text-sm">
                  ₹
                </span>
                <input
                  id="input-credit-amount"
                  type="number"
                  step="100"
                  min="250"
                  value={formData['Credit amount']}
                  onChange={(e) => setFormData({ ...formData, ['Credit amount']: parseFloat(e.target.value) || 0 })}
                  className={`w-full pl-8 pr-3.5 py-2.5 bg-white border rounded-lg text-sm font-semibold text-[#202C28] focus:border-[#173F35] focus:ring-1 focus:ring-[#173F35] transition-colors ${
                    errors['Credit amount'] ? 'border-[#B64D49] ring-1 ring-[#B64D49]' : 'border-[#E0E4DD]'
                  }`}
                  aria-invalid={!!errors['Credit amount']}
                  aria-describedby={errors['Credit amount'] ? 'credit-error' : undefined}
                />
              </div>
              {errors['Credit amount'] ? (
                <p id="credit-error" className="mt-1 text-xs text-[#B64D49] flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors['Credit amount']}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-[#849087]">Allowable range: ₹250 to ₹2,000,000</p>
              )}
            </div>

            {/* Loan Duration */}
            <div>
              <label htmlFor="input-duration" className="block text-xs font-semibold text-[#202C28] mb-1.5">
                Loan Duration (Months) <span className="text-[#B64D49]">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-duration"
                  type="number"
                  min="4"
                  max="72"
                  value={formData.Duration}
                  onChange={(e) => setFormData({ ...formData, Duration: parseInt(e.target.value) || 0 })}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm font-semibold text-[#202C28] focus:border-[#173F35] focus:ring-1 focus:ring-[#173F35] transition-colors ${
                    errors.Duration ? 'border-[#B64D49] ring-1 ring-[#B64D49]' : 'border-[#E0E4DD]'
                  }`}
                  aria-invalid={!!errors.Duration}
                  aria-describedby={errors.Duration ? 'duration-error' : undefined}
                />
              </div>
              {errors.Duration ? (
                <p id="duration-error" className="mt-1 text-xs text-[#B64D49] flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.Duration}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-[#849087]">Standard terms: 6, 12, 18, 24, 36, 48, 60 months</p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: Financial Status & Banking History */}
        <div>
          <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#E0E4DD]">
            <Building className="w-4 h-4 text-[#173F35]" aria-hidden="true" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#202C28]">
              3. Banking Reserves & Housing Status
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Housing */}
            <div>
              <label htmlFor="input-housing" className="block text-xs font-semibold text-[#202C28] mb-1.5">
                Housing Status <span className="text-[#B64D49]">*</span>
              </label>
              <select
                id="input-housing"
                value={formData.Housing}
                onChange={(e) => setFormData({ ...formData, Housing: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E0E4DD] rounded-lg text-sm font-medium text-[#202C28] focus:border-[#173F35] focus:ring-1 focus:ring-[#173F35] transition-colors"
              >
                <option value="own">Own Home</option>
                <option value="rent">Rent</option>
                <option value="free">Free Housing (Employer / Family)</option>
              </select>
            </div>

            {/* Checking Account */}
            <div>
              <label htmlFor="input-checking" className="block text-xs font-semibold text-[#202C28] mb-1.5">
                Checking Account Balance <span className="text-[#B64D49]">*</span>
              </label>
              <select
                id="input-checking"
                value={formData['Checking account']}
                onChange={(e) => setFormData({ ...formData, ['Checking account']: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E0E4DD] rounded-lg text-sm font-medium text-[#202C28] focus:border-[#173F35] focus:ring-1 focus:ring-[#173F35] transition-colors"
              >
                <option value="little">Little (&lt; ₹0 / Overdrawn)</option>
                <option value="moderate">Moderate (₹0 – ₹20,000)</option>
                <option value="rich">Rich (&gt; ₹20,000)</option>
                <option value="NA">NA / No Checking Account</option>
              </select>
            </div>

            {/* Saving Accounts */}
            <div>
              <label htmlFor="input-saving" className="block text-xs font-semibold text-[#202C28] mb-1.5">
                Saving Accounts Balance <span className="text-[#B64D49]">*</span>
              </label>
              <select
                id="input-saving"
                value={formData['Saving accounts']}
                onChange={(e) => setFormData({ ...formData, ['Saving accounts']: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E0E4DD] rounded-lg text-sm font-medium text-[#202C28] focus:border-[#173F35] focus:ring-1 focus:ring-[#173F35] transition-colors"
              >
                <option value="little">Little (&lt; ₹10,000)</option>
                <option value="moderate">Moderate (₹10,000 – ₹50,000)</option>
                <option value="quite rich">Quite Rich (₹50,000 – ₹100,000)</option>
                <option value="rich">Rich (&gt; ₹100,000)</option>
                <option value="NA">NA / No Savings Account</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 4: Loan Purpose */}
        <div>
          <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[#E0E4DD]">
            <Briefcase className="w-4 h-4 text-[#173F35]" aria-hidden="true" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#202C28]">
              4. Financing Purpose
            </h3>
          </div>

          <div>
            <label htmlFor="input-purpose" className="block text-xs font-semibold text-[#202C28] mb-1.5">
              Purpose of Loan <span className="text-[#B64D49]">*</span>
            </label>
            <select
              id="input-purpose"
              value={formData.Purpose}
              onChange={(e) => setFormData({ ...formData, Purpose: e.target.value as any })}
              className="w-full sm:w-1/2 px-3.5 py-2.5 bg-white border border-[#E0E4DD] rounded-lg text-sm font-medium text-[#202C28] focus:border-[#173F35] focus:ring-1 focus:ring-[#173F35] transition-colors"
            >
              <option value="car">Automobile (Car)</option>
              <option value="furniture/equipment">Furniture & Equipment</option>
              <option value="radio/TV">Radio / Television / Electronics</option>
              <option value="domestic appliances">Domestic Home Appliances</option>
              <option value="repairs">Repairs & Renovation</option>
              <option value="education">Education & Professional Training</option>
              <option value="business">Business Venture / Commercial</option>
              <option value="vacation/others">Vacation & Other Miscellaneous</option>
            </select>
          </div>
        </div>

        {/* Submit & Action Buttons */}
        <div className="pt-4 border-t border-[#E0E4DD] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#68736D] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#287653]" aria-hidden="true" />
            <span>Information encrypted & protected under Banking Data Confidentiality protocols.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-7 py-3 bg-[#173F35] hover:bg-[#102F29] disabled:bg-[#173F35]/50 text-white font-semibold rounded-lg text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing applicant creditworthiness...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#DCE8DF]" />
                <span>Assess Credit Risk</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
