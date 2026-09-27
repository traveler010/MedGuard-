"use client";

import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Clock,
  HeartPulse,
  Activity,
} from "lucide-react";

interface RiskSummaryReviewCardProps {
  overallRisk: "HIGH" | "MODERATE" | "LOW";
  onSelectRisk?: (risk: "HIGH" | "MODERATE" | "LOW") => void;
  patientAge?: number;
}

export function RiskSummaryReviewCard({
  overallRisk = "LOW",
  onSelectRisk,
  patientAge = 68,
}: RiskSummaryReviewCardProps) {
  const isHigh = overallRisk === "HIGH";
  const isMod = overallRisk === "MODERATE";
  const isLow = overallRisk === "LOW";

  const riskFactors = [
    {
      label: "Drug Interaction Factor",
      icon: isLow ? ShieldCheck : ShieldAlert,
      status: isLow ? "Safe Compatibility" : isMod ? "Moderate Caution" : "Severe Collision",
      statusColor: isLow
        ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800"
        : isMod
        ? "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800"
        : "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800",
      description: isLow
        ? "Prescription does not inhibit CYP enzymes or compete with active Warfarin anticoagulation."
        : "Direct collision with active blood thinner significantly increases gastrointestinal bleeding hazard.",
    },
    {
      label: "Age Risk Factor",
      icon: UserCheck,
      status: isLow ? "Beers Compliant" : `Caution (Age ${patientAge})`,
      statusColor: isLow
        ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800"
        : "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800",
      description: isLow
        ? "Analgesic profile matches safe dosing recommendations for seniors aged 65 and older."
        : "Aging kidneys filter active drug metabolites at a slower rate, prolonging plasma exposure.",
    },
    {
      label: "Duration Risk Factor",
      icon: Clock,
      status: isLow ? "Safe Window (≤ 5 Days)" : isMod ? "Monitored Window" : "Extended Course",
      statusColor: isLow
        ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800"
        : isMod
        ? "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800"
        : "text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800",
      description: isLow
        ? "Acute short-course duration avoids cumulative mucosal erosion or renal strain."
        : "Continuous exposure beyond acute thresholds increases adverse event probability.",
    },
    {
      label: "Side-Effect Load",
      icon: HeartPulse,
      status: isLow ? "Low Organ Burden" : isMod ? "Moderate Burden" : "High Compound Burden",
      statusColor: isLow
        ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800"
        : isMod
        ? "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800"
        : "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800",
      description: isLow
        ? "Minimal impact on stomach lining, kidney hemodynamics, and cardiovascular stability."
        : "Simultaneous strain on gastric mucosal barrier and vascular blood pressure control.",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header: Overall Risk Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
            Pharmacological Assessment
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Risk Summary & Clinical Vectors
          </h3>
        </div>

        {/* Overall Risk Indicator (interactive for demo convenience) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-400 mr-1">Overall Risk:</span>
          {(["LOW", "MODERATE", "HIGH"] as const).map((level) => {
            const isSelected = overallRisk === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => onSelectRisk && onSelectRisk(level)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${
                  isSelected
                    ? level === "LOW"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : level === "MODERATE"
                      ? "bg-amber-500 text-slate-950 border-amber-500 shadow-xs"
                      : "bg-rose-600 text-white border-rose-600 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750"
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      {/* Individual Risk Factors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {riskFactors.map((factor, idx) => {
          const IconComponent = factor.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <IconComponent className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    {factor.label}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${factor.statusColor}`}
                  >
                    {factor.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {factor.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
