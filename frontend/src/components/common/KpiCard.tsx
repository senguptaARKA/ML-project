import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: {
    text: string;
    variant: 'positive' | 'warning' | 'neutral' | 'info';
  };
  onClick?: () => void;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  onClick,
  className = '',
}) => {
  const badgeClasses = {
    positive: 'bg-[#EDF5F0] text-[#287653] border-[#DCE8DF]',
    warning: 'bg-[#FAF4EB] text-[#B17B35] border-[#F2EBDD]',
    neutral: 'bg-[#F8F8F4] text-[#68736D] border-[#E0E4DD]',
    info: 'bg-[#F1F5F0] text-[#173F35] border-[#DCE8DF]',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#E0E4DD] p-5 shadow-[0_1px_3px_0_rgba(32,44,40,0.04)] transition-all duration-200 select-none ${
        onClick
          ? 'cursor-pointer hover:-translate-y-0.5 hover:border-[#315F50]/40 hover:shadow-[0_4px_6px_-1px_rgba(32,44,40,0.06)]'
          : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#849087]">
            {title}
          </p>
          <p className="text-2xl sm:text-[26px] font-bold text-[#202C28] mt-1.5 tracking-tight">
            {value}
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-[#F1F5F0] text-[#173F35] border border-[#E0E4DD] flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-2 pt-2.5 border-t border-[#F8F8F4]">
        {subtitle && (
          <p className="text-xs text-[#68736D] line-clamp-1">{subtitle}</p>
        )}
        {badge && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${
              badgeClasses[badge.variant]
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
