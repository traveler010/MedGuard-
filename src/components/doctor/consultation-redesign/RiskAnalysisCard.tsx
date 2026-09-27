"use client";

import React, { useState } from "react";
import {
  RiskAnalysisResult,
  SaferAlternativeOption,
  ProposedMedicineInput,
} from "./types";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Info,
  Check,
  RotateCcw,
  Zap,
} from "lucide-react";

interface RiskAnalysisCardProps {
  result: RiskAnalysisResult;
  proposed: ProposedMedicineInput;
  onApplySaferOption: (option: SaferAlternativeOption) => void;
}

export function RiskAnalysisCard({
  result,
  proposed,
  onApplySaferOption,
}: RiskAnalysisCardProps) {
  const [isWhyExpanded, setIsWhyExpanded] = useState(false);
  const [appliedOptionId, setAppliedOptionId] = useState<string | null>(null);

  const isHigh = result.level === "HIGH";
  const isModerate = result.level === "MODERATE";
  const isLow = result.level === "LOW";

  const handleUseAlternative = (option: SaferAlternativeOption) => {
    setAppliedOptionId(option.id);
    onApplySaferOption(option);
    setTimeout(() => {
      setAppliedOptionId(null);
    }, 2000);
  };

  // Color mappings
  const themeClasses = isHigh
    ? {
        cardBorder: "border-rose-300 dark:border-rose-800/80",
        cardBg: "bg-rose-50/50 dark:bg-rose-950/20",
        badgeBg: "bg-rose-600 text-white",
        iconText: "text-rose-600 dark:text-rose-400",
        headerText: "text-rose-950 dark:text-rose-200",
      }
    : isModerate
    ? {
        cardBorder: "border-amber-300 dark:border-amber-800/80",
        cardBg: "bg-amber-50/50 dark:bg-amber-950/20",
        badgeBg: "bg-amber-500 text-slate-950",
        iconText: "text-amber-600 dark:text-amber-400",
        headerText: "text-amber-950 dark:text-amber-200",
      }
    : {
        cardBorder: "border-emerald-300 dark:border-emerald-800/80",
        cardBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
        badgeBg: "bg-emerald-600 text-white",
        iconText: "text-emerald-600 dark:text-emerald-400",
        headerText: "text-emerald-950 dark:text-emerald-200",
      };

  return (
    <div
      className={`rounded-3xl border ${themeClasses.cardBorder} ${themeClasses.cardBg} shadow-sm p-6 sm:p-7 space-y-6 transition-all animate-in fade-in duration-300`}
    >
      {/* Top Banner: Level Badge, Headline & Candidate Drug */}
      <div className="space-y-3 pb-5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-xs ${themeClasses.badgeBg}`}
            >
              {isHigh ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : isModerate ? (
                <AlertCircle className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>{result.level} RISK</span>
            </span>

            <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
              Candidate: {proposed.name} ({proposed.dose})
            </span>
          </div>

          <span className="text-[11px] font-bold text-slate-400">
            Automated Clinical Safety Check
          </span>
        </div>

        {/* Headline */}
        <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${themeClasses.headerText}`}>
          {result.headline}
        </h3>

        {/* Explanation */}
        <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
          {result.explanation}
        </p>
      </div>

      {/* 5 Specific Risk Indicators Grid */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Key Risk Parameters Evaluated
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          {/* 1. Interaction Risk */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Interaction Risk
            </span>
            <p
              className={`font-black text-xs ${
                result.interactionRisk === "Severe"
                  ? "text-rose-600 dark:text-rose-400"
                  : result.interactionRisk === "Moderate"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {result.interactionRisk}
            </p>
          </div>

          {/* 2. Dependence Risk */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Dependence Risk
            </span>
            <p
              className={`font-black text-xs ${
                result.dependenceRisk === "High"
                  ? "text-rose-600 dark:text-rose-400"
                  : result.dependenceRisk === "Moderate"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {result.dependenceRisk}
            </p>
          </div>

          {/* 3. Cumulative Side-Effect Risk */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Side-Effect Risk
            </span>
            <p
              className={`font-black text-xs ${
                result.cumulativeSideEffectRisk === "Elevated"
                  ? "text-rose-600 dark:text-rose-400"
                  : result.cumulativeSideEffectRisk === "Moderate"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {result.cumulativeSideEffectRisk}
            </p>
          </div>

          {/* 4. Age Appropriateness */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Age Appropriateness
            </span>
            <p
              className={`font-black text-xs truncate ${
                result.ageAppropriateness.includes("High")
                  ? "text-rose-600 dark:text-rose-400"
                  : result.ageAppropriateness.includes("Caution")
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {result.ageAppropriateness}
            </p>
          </div>

          {/* 5. Duration Appropriateness */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 sm:col-span-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              Duration Appropriateness
            </span>
            <p
              className={`font-black text-xs ${
                result.durationAppropriateness.includes("Exceeds")
                  ? "text-rose-600 dark:text-rose-400"
                  : result.durationAppropriateness.includes("Caution")
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {result.durationAppropriateness}
            </p>
          </div>
        </div>
      </div>

      {/* "Why am I seeing this?" Expandable Accordion */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsWhyExpanded(!isWhyExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Why am I seeing this?</span>
          </div>
          {isWhyExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isWhyExpanded && (
          <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Pharmacological Mechanism
              </span>
              <p className="leading-relaxed">
                {result.whyAmISeeingThis.mechanism}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Affected Biological Systems
              </span>
              <ul className="list-disc pl-4 space-y-0.5">
                {result.whyAmISeeingThis.affectedSystems.map((sys, idx) => (
                  <li key={idx} className="font-medium text-slate-700 dark:text-slate-300">
                    {sys}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-[11px] text-teal-900 dark:text-teal-200 font-semibold">
              <strong>Clinical Guidance: </strong>
              {result.whyAmISeeingThis.clinicalPrecaution}
            </div>
          </div>
        )}
      </div>

      {/* SAFER ALTERNATIVES (Shown when MODERATE or HIGH risk) */}
      {(isHigh || isModerate) && result.saferOptions.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Safer Options
              </h4>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">
              Mock Decision Support Suggestions
            </span>
          </div>

          <div className="space-y-3">
            {result.saferOptions.map((option) => (
              <div
                key={option.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-teal-500/60 transition space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                      {option.title}
                    </span>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                      {option.suggestedOption}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUseAlternative(option)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs ${
                      appliedOptionId === option.id
                        ? "bg-emerald-600 text-white"
                        : "bg-teal-600 hover:bg-teal-700 text-white"
                    }`}
                  >
                    {appliedOptionId === option.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied to Prescription!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Use Alternative</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {option.reason}
                </p>
              </div>
            ))}
          </div>

          {/* Mandatory Non-Claim Disclaimer */}
          <div className="p-3 rounded-2xl bg-slate-100/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong className="text-slate-700 dark:text-slate-300">Phase 1 Clinical Disclaimer: </strong>
            These suggestions are simulated mock UI decision-support options. They do not constitute automated medical advice or certify clinical safety. The attending physician retains sole clinical authority for prescription orders.
          </div>
        </div>
      )}
    </div>
  );
}
