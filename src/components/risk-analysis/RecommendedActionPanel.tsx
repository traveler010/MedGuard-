"use client";

import React from "react";
import {
  AlertTriangle,
  ArrowDownCircle,
  Sliders,
  FileCheck2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface RecommendedActionPanelProps {
  onViewAlternatives: () => void;
  onAdjustMedication: () => void;
  onContinueReview: () => void;
  isNeutralized?: boolean;
}

export function RecommendedActionPanel({
  onViewAlternatives,
  onAdjustMedication,
  onContinueReview,
  isNeutralized = false,
}: RecommendedActionPanelProps) {
  if (isNeutralized) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-rose-500/10 dark:from-amber-950/30 dark:via-amber-950/15 dark:to-rose-950/20 border-2 border-amber-400/80 dark:border-amber-700/60 p-6 sm:p-8 shadow-lg shadow-amber-900/5 dark:shadow-black/40 transition-colors">
      {/* Decorative side accent bar */}
      <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-gradient-to-b from-amber-500 to-rose-500" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Highlighted text & Icon */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
                Clinical Recommendation
              </span>
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                Action Required Before Dispensing
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Review this medication before finalizing the prescription.
            </h3>

            <p className="text-sm text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
              Due to active anticoagulation and reduced geriatric clearance, co-administering systemic Pain Medication X carries unacceptably high hemorrhagic risk. Choose an alternative below or document clinical justification.
            </p>
          </div>
        </div>

        {/* Right: The 3 Requested Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 lg:pt-0">
          {/* Button 1: View Alternatives */}
          <button
            onClick={onViewAlternatives}
            className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-teal-600/30 flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-teal-200" />
            <span>View Alternatives</span>
          </button>

          {/* Button 2: Adjust Medication */}
          <button
            onClick={onAdjustMedication}
            className="px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xs hover:border-slate-400 dark:hover:border-slate-600 flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Adjust Medication</span>
          </button>

          {/* Button 3: Continue Review */}
          <button
            onClick={onContinueReview}
            className="px-5 py-3 rounded-xl bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xs flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>Continue Review</span>
          </button>
        </div>
      </div>
    </div>
  );
}
