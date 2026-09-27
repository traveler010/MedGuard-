'use client';

import React from 'react';
import { DeprescribingRecommendation } from '@/data/mockPatients';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowUpRight,
  TrendingDown,
  AlertOctagon,
} from 'lucide-react';

interface AiRecommendationsSectionProps {
  recommendations: DeprescribingRecommendation[];
  onApplyRecommendation: (rec: DeprescribingRecommendation) => void;
  appliedRecIds: string[];
}

export function AiRecommendationsSection({
  recommendations,
  onApplyRecommendation,
  appliedRecIds,
}: AiRecommendationsSectionProps) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center shadow-xs mb-6">
        <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-800">
          No Urgent Deprescribing Actions Required
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          The current medication regimen demonstrates favorable benefit-to-risk ratio with low anticholinergic and metabolic collision risks.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              AI Deprescribing & Optimization Protocol
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Clinical Guidelines v2026
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized evidence-based interventions to reduce hospitalizations, falls, and renal collapse.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          {appliedRecIds.length} of {recommendations.length} Protocols Enacted
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {recommendations.map((rec) => {
          const isApplied = appliedRecIds.includes(rec.id);
          const isUrgent = rec.priority === 'URGENT';

          return (
            <div
              key={rec.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isApplied
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : isUrgent
                  ? 'bg-rose-50/30 border-rose-200/90 shadow-2xs hover:shadow-xs'
                  : 'bg-slate-50/40 border-slate-200/80 shadow-2xs hover:shadow-xs'
              }`}
            >
              <div>
                {/* Title & Priority Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          isUrgent
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {rec.priority}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">
                        {rec.action.replace('_', ' ')}: {rec.drugName}
                      </span>
                    </div>
                  </div>

                  {/* Projected score drop badge */}
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full shrink-0 font-mono">
                    <TrendingDown className="w-3 h-3 text-emerald-600" />
                    +{rec.expectedScoreImprovement} Pts Safety
                  </span>
                </div>

                {/* Clinical Rationale */}
                <p className="text-xs text-slate-700 leading-relaxed font-medium mb-3">
                  {rec.clinicalRationale}
                </p>

                {/* Evidence & Alternative Details */}
                <div className="space-y-2 text-[11px] bg-white p-3 rounded-lg border border-slate-200/70 mb-3">
                  {rec.suggestedAlternative && (
                    <div className="flex items-start gap-1.5">
                      <span className="font-bold text-teal-700 uppercase tracking-wide text-[10px] shrink-0">
                        Safer Alternative:
                      </span>
                      <span className="text-slate-800 font-semibold">
                        {rec.suggestedAlternative}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px] shrink-0">
                      Monitoring:
                    </span>
                    <span className="text-slate-600">
                      {rec.monitoringPlan}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    Citation: {rec.evidenceCitation}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                {isApplied ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Protocol Active in Current Care Plan
                  </div>
                ) : (
                  <button
                    onClick={() => onApplyRecommendation(rec)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Apply Protocol to Plan
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
