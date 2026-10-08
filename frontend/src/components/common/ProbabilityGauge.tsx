import React from 'react';
import { RiskClass } from '../../types';

interface ProbabilityGaugeProps {
  probGood: number;
  probBad: number;
  dominantRisk: RiskClass;
}

export const ProbabilityGauge: React.FC<ProbabilityGaugeProps> = ({
  probGood,
  probBad,
  dominantRisk,
}) => {
  const goodPct = Math.round(probGood * 1000) / 10;
  const badPct = Math.round(probBad * 1000) / 10;
  const isGood = dominantRisk === 'good';

  return (
    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Header Numbers */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Primary Confidence
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              className={`text-4xl font-extrabold tracking-tight ${
                isGood ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {isGood ? `${goodPct}%` : `${badPct}%`}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {isGood ? 'Confidence in Low Risk' : 'Confidence in High Risk'}
            </span>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Counter Probability
          </span>
          <div className="text-lg font-bold text-slate-700 mt-0.5">
            {isGood ? `Bad Risk: ${badPct}%` : `Good Risk: ${goodPct}%`}
          </div>
        </div>
      </div>

      {/* Visual Dual Progress Bar */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${goodPct}%` }}
            className="bg-emerald-600 transition-all duration-700 ease-out h-full"
            title={`Good Risk: ${goodPct}%`}
            aria-label={`Good risk probability ${goodPct}%`}
          />
          <div
            style={{ width: `${badPct}%` }}
            className="bg-rose-600 transition-all duration-700 ease-out h-full"
            title={`Bad Risk: ${badPct}%`}
            aria-label={`Bad risk probability ${badPct}%`}
          />
        </div>

        {/* Legend */}
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" aria-hidden="true" />
            <span>Good Credit Probability ({goodPct}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-rose-600 inline-block" aria-hidden="true" />
            <span>Bad Risk Probability ({badPct}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
