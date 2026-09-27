"use client";

import React from "react";
import {
  Pill,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Check,
  Star,
  ExternalLink,
} from "lucide-react";

export interface AlternativeMedication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  route: string;
  riskLevel: "LOW" | "MODERATE";
  riskScore: number;
  reason: string;
  clinicalTag: string;
  isRecommendedFirstLine?: boolean;
}

interface AlternativesListProps {
  onSelectAlternative: (alt: AlternativeMedication) => void;
  selectedAlternativeId?: string | null;
  onFinalizePrescription?: () => void;
  onRevertToOriginal?: () => void;
}

export const MOCK_ALTERNATIVES: AlternativeMedication[] = [
  {
    id: "alt-1",
    name: "Acetaminophen (Tylenol)",
    genericName: "Acetaminophen",
    dosage: "500 mg",
    frequency: "Every 6 hours as needed (Max 2,000 mg/day)",
    route: "Oral Tablet",
    riskLevel: "LOW",
    riskScore: 18,
    reason:
      "Relieves joint pain effectively without thinning the blood, irritating the stomach lining, or placing extra stress on the kidneys.",
    clinicalTag: "First-Line Clinical Consensus",
    isRecommendedFirstLine: true,
  },
  {
    id: "alt-2",
    name: "Topical Diclofenac Sodium Gel 1%",
    genericName: "Diclofenac Sodium Topical",
    dosage: "4 grams (4-inch strip)",
    frequency: "Applied 4 times daily to affected knee",
    route: "Topical Gel",
    riskLevel: "LOW",
    riskScore: 22,
    reason:
      "Delivers powerful joint inflammation relief directly to the knee joint with less than 6% bloodstream absorption, sparing the stomach and kidneys.",
    clinicalTag: "Targeted Localized Therapy",
    isRecommendedFirstLine: false,
  },
  {
    id: "alt-3",
    name: "Low-Dose Tramadol HCl",
    genericName: "Tramadol Hydrochloride",
    dosage: "25 mg (Tapered Micro-dose)",
    frequency: "Once daily in evening for breakthrough pain",
    route: "Oral Tablet",
    riskLevel: "MODERATE",
    riskScore: 48,
    reason:
      "Non-NSAID central pain pathway. Completely eliminates stomach bleeding hazard, but requires mild monitoring for drowsiness and fall risk.",
    clinicalTag: "Sedation & Fall Precaution",
    isRecommendedFirstLine: false,
  },
];

export function AlternativesList({
  onSelectAlternative,
  selectedAlternativeId,
  onFinalizePrescription,
  onRevertToOriginal,
}: AlternativesListProps) {
  const selectedAlt = MOCK_ALTERNATIVES.find((a) => a.id === selectedAlternativeId);

  return (
    <div id="alternatives-section" className="space-y-4 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Smart Deprescribing & Substitution
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Filtered for Warfarin Safety & Age 68
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Safer Therapeutic Alternatives
          </h3>
        </div>

        {selectedAlternativeId && (
          <div className="flex items-center gap-2">
            <button
              onClick={onRevertToOriginal}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Revert Selection
            </button>
          </div>
        )}
      </div>

      {/* Success Notification Banner when Alternative Selected */}
      {selectedAlt && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border-2 border-emerald-500/50 shadow-lg animate-in zoom-in-95 duration-300 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                    Safe Alternative Selected
                  </span>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Risk Neutralized (Score 18/100)
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedAlt.name} — {selectedAlt.dosage}
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 max-w-xl">
                  {selectedAlt.reason} Safe to finalize into patient record.
                </p>
              </div>
            </div>

            <button
              onClick={onFinalizePrescription}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-emerald-600/30 flex items-center justify-center gap-2 shrink-0 hover:-translate-y-0.5 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Finalize Prescription</span>
            </button>
          </div>
        </div>
      )}

      {/* Alternative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_ALTERNATIVES.map((alt) => {
          const isSelected = alt.id === selectedAlternativeId;
          const isLowRisk = alt.riskLevel === "LOW";

          return (
            <div
              key={alt.id}
              className={`rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? "bg-white dark:bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg"
                  : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:-translate-y-1"
              }`}
            >
              {/* Highlight ribbon for first-line choice */}
              {alt.isRecommendedFirstLine && (
                <div className="absolute top-0 right-0 bg-teal-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  Recommended
                </div>
              )}

              <div>
                {/* Header: Medicine Name & Risk Badge */}
                <div className="flex items-start justify-between gap-3 mb-2 pr-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs shrink-0 ${
                        isLowRisk
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                        {alt.name}
                      </h4>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {alt.genericName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Risk Level Badge */}
                <div className="flex items-center gap-2 my-2.5 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                      isLowRisk
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
                        : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60"
                    }`}
                  >
                    {alt.riskLevel} RISK (Score: {alt.riskScore}/100)
                  </span>

                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {alt.route}
                  </span>
                </div>

                {/* Dosage & Schedule */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-mono my-2.5">
                  <span className="font-bold text-slate-900 dark:text-white">{alt.dosage}</span> • {alt.frequency}
                </div>

                {/* Clinical Reason */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  {alt.reason}
                </p>
              </div>

              {/* Card Footer: Review & Select Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onSelectAlternative(alt)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-emerald-500/20"
                      : "bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Selected Alternative</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Review & Select</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
