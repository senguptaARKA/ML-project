import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { RiskClass } from '../../types';

interface RiskBadgeProps {
  risk: RiskClass;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  risk,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const isGood = risk === 'good';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-3 py-1 text-sm font-semibold gap-1.5',
    lg: 'px-4 py-2 text-base font-bold gap-2',
  };

  const Icon = isGood ? (size === 'lg' ? ShieldCheck : CheckCircle2) : (size === 'lg' ? ShieldAlert : AlertTriangle);

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${
        isGood
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm'
          : 'bg-rose-50 text-rose-800 border-rose-200 shadow-sm'
      } ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label={`Risk level: ${isGood ? 'Good Credit Risk' : 'Higher Credit Risk'}`}
    >
      {showIcon && <Icon className={size === 'lg' ? 'w-5 h-5 text-emerald-600' : 'w-4 h-4'} aria-hidden="true" />}
      <span>{isGood ? 'Good Credit Risk' : 'Higher Credit Risk'}</span>
    </span>
  );
};
