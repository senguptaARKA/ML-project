export type RiskClass = 'good' | 'bad';

export interface ApplicantInput {
  Age: number;
  Job: number;
  Sex: 'male' | 'female';
  Housing: 'own' | 'rent' | 'free';
  'Saving accounts': 'little' | 'moderate' | 'quite rich' | 'rich' | 'NA';
  'Checking account': 'little' | 'moderate' | 'rich' | 'NA';
  'Credit amount': number;
  Duration: number;
  Purpose: 'car' | 'furniture/equipment' | 'radio/TV' | 'domestic appliances' | 'repairs' | 'education' | 'business' | 'vacation/others';
}

export interface ShapFeature {
  feature: string;
  raw_feature: string;
  shap_value: number;
  impact: 'increases_risk' | 'reduces_risk';
  magnitude: number;
  explanation: string;
}

export interface LimeFeature {
  feature: string;
  rule: string;
  weight: number;
  direction: 'Good Risk' | 'Bad Risk';
}

export interface CounterfactualChange {
  feature: string;
  from: string | number;
  to: string | number;
  direction?: 'reduce' | 'improve' | 'increase';
}

export interface CounterfactualResult {
  found: boolean;
  changes: CounterfactualChange[];
  original_probability_bad: number;
  counterfactual_probability_bad: number;
  potential_outcome: string;
}

export interface PredictionResult {
  prediction: 0 | 1;
  risk: RiskClass;
  risk_label: string;
  probability_good: number;
  probability_bad: number;
  model: string;
  assessment_status: string;
  shap_base_value: number;
  shap_features: ShapFeature[];
  factors_increasing_risk: ShapFeature[];
  factors_reducing_risk: ShapFeature[];
  lime_features: LimeFeature[];
  counterfactual: CounterfactualResult;
  applicant_input: ApplicantInput;
  fairness_notice?: {
    demographic_parity_diff: number;
    equalized_odds_diff: number;
    sensitive_attribute: string;
  };
  source?: 'backend_live' | 'client_engine';
}

export interface ModelMetric {
  model: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number;
  pr_auc: number;
  train_time_sec?: number;
  shap_time_50_samples?: number;
}

export interface ConfusionMatrixData {
  tn: number;
  fp: number;
  fn: number;
  tp: number;
}

export interface CurvePoint {
  fpr?: number;
  tpr?: number;
  recall?: number;
  precision?: number;
}

export interface FairnessGroupMetric {
  group: string;
  applicants: number;
  positive_prediction_rate: number;
  tpr: number;
  fpr: number;
}

export interface FairnessSummary {
  sensitive_feature: string;
  demographic_parity_difference: number;
  equalized_odds_difference: number;
  demographic_parity_status: string;
  equalized_odds_status: string;
  group_metrics: FairnessGroupMetric[];
}

export interface DistributionBin {
  bin: string;
  count: number;
}

export interface GroupedRiskData {
  [key: string]: string | number;
  good: number;
  bad: number;
  bad_rate: number;
}

export interface DatasetStats {
  total_applicants: number;
  features_count: number;
  missing_values: Record<string, number>;
  duplicate_rows: number;
  risk_distribution: {
    good: number;
    bad: number;
  };
  training_samples: number;
  testing_samples: number;
  age_distribution: DistributionBin[];
  credit_distribution: DistributionBin[];
  duration_distribution: DistributionBin[];
  risk_by_sex: Array<{ sex: string; good: number; bad: number; total: number; bad_rate: number }>;
  risk_by_housing: Array<{ housing: string; good: number; bad: number; bad_rate: number }>;
  risk_by_purpose: Array<{ purpose: string; good: number; bad: number; bad_rate: number }>;
  credit_by_risk: Record<string, { mean: number; median: number; min: number; max: number; q25: number; q75: number }>;
  duration_by_risk: Record<string, { mean: number; median: number; min: number; max: number; q25: number; q75: number }>;
}

export interface BackendData {
  dataset: DatasetStats;
  models: {
    best_model: string;
    comparison_table: ModelMetric[];
    roc_curves: Record<string, CurvePoint[]>;
    pr_curves: Record<string, CurvePoint[]>;
    confusion_matrices: Record<string, ConfusionMatrixData>;
    interpretability_scatter: Array<{ model: string; roc_auc: number; shap_time: number }>;
  };
  fairness: FairnessSummary;
  global_explainability: {
    feature_importance: Array<{ feature: string; raw_feature: string; mean_abs_shap: number }>;
  };
  sample_applicants: Array<{
    id: string;
    label: string;
    data: ApplicantInput;
  }>;
}

export type ActivePage =
  | 'dashboard'
  | 'assessment'
  | 'explainability'
  | 'performance'
  | 'fairness'
  | 'dataset'
  | 'about';
