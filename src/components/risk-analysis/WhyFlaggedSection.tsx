"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  Pill,
  User,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";

interface WhyFlaggedSectionProps {
  patientName?: string;
  patientAge?: number;
  existingMedication?: string;
  proposedMedication?: string;
  isNeutralized?: boolean;
}

export function WhyFlaggedSection({
  patientName = "Raj Kumar",
  patientAge = 68,
  existingMedication = "Warfarin Sodium (4 mg daily)",
  proposedMedication = "Pain Medication X",
  isNeutralized = false,
}: WhyFlaggedSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showClinicalDepth, setShowClinicalDepth] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-300">
      {/* Expandable Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs transition-colors ${
              isNeutralized
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400"
            }`}
          >
            {isNeutralized ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <HelpCircle className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Safety Explanation
              </span>
              <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800/60">
                Plain Language
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isNeutralized
                ? "Why is the updated regimen safe?"
                : "Why was this flagged?"}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 hidden sm:inline">
            {isExpanded ? "Click to collapse" : "Click to expand explanation"}
          </span>
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>
      </button>

      {/* Expandable Body */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-6 animate-in slide-in-from-top-2 duration-300">
          {/* Main Key Takeaway Callout */}
          <div
            className={`p-5 rounded-2xl border ${
              isNeutralized
                ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100"
                : "bg-rose-50/80 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60 text-rose-950 dark:text-rose-100"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                  isNeutralized
                    ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                    : "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300"
                }`}
              >
                {isNeutralized ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider block opacity-70">
                  Primary Clinical Reason
                </span>
                <p className="text-base sm:text-lg font-bold leading-snug">
                  {isNeutralized
                    ? "This updated medication relieves pain effectively without thinning the blood or stressing the patient's kidneys."
                    : "This combination may increase bleeding risk in this patient."}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  {isNeutralized
                    ? "Acetaminophen works via the central nervous system without damaging stomach prostaglandins or interacting with Warfarin's anticoagulant mechanism."
                    : "Pain Medication X and Warfarin work against the body's natural defense against bleeding in two different ways, multiplying the danger when taken together."}
                </p>
              </div>
            </div>
          </div>

          {/* Factors Contributing to Risk Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <span>Factors contributing to risk</span>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              </h4>

              <button
                type="button"
                onClick={() => setShowClinicalDepth(!showClinicalDepth)}
                className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>{showClinicalDepth ? "Hide Clinical Notes" : "View Clinical Details"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Factor 1: Existing Medication */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 flex flex-col justify-between transition-colors">
                <div>
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-1">
                    <Pill className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Existing Medication
                    </span>
                  </div>
                  <h5 className="text-base font-bold text-slate-900 dark:text-white">
                    {existingMedication}
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5">
                    Raj takes Warfarin every day to prevent dangerous blood clots. Because it intentionally slows clotting time, any internal bleeding or stomach irritation takes significantly longer to stop.
                  </p>
                </div>

                {showClinicalDepth && (
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300 mt-2">
                    INR Target: 2.0 - 3.0. Co-administered NSAID increases upper GI bleed hazard hazard ratio (HR) from 1.0 to 3.8.
                  </div>
                )}
              </div>

              {/* Factor 2: Patient Age */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 flex flex-col justify-between transition-colors">
                <div>
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Patient Age
                    </span>
                  </div>
                  <h5 className="text-base font-bold text-slate-900 dark:text-white">
                    Age {patientAge} Years Old
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5">
                    At 68, the kidneys filter medicine more slowly than in younger adults. This allows pain medicine to stay in Raj&apos;s system for longer hours, multiplying its strength and side effects.
                  </p>
                </div>

                {showClinicalDepth && (
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300 mt-2">
                    Age ≥ 65 triggers AGS Beers Criteria precautions for NSAID-induced acute kidney injury and fluid retention.
                  </div>
                )}
              </div>

              {/* Factor 3: Proposed Medication */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5 flex flex-col justify-between transition-colors">
                <div>
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Proposed Medication
                    </span>
                  </div>
                  <h5 className="text-base font-bold text-slate-900 dark:text-white">
                    {proposedMedication} (NSAID)
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5">
                    This medication weakens the stomach&apos;s natural mucus protection and prevents blood platelets from sticking together. Combined with Warfarin, stomach ulcers can bleed heavily.
                  </p>
                </div>

                {showClinicalDepth && (
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-300 mt-2">
                    Reversible platelet COX-1 inhibition compounds baseline anticoagulation, leading to prolonged bleeding times.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
