"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Pill,
  Clock,
  User,
  Heart,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
  FileText,
  Activity,
  Sliders,
  RotateCcw,
} from "lucide-react";
import { MedicineSafetyIllustration } from "./MedicineSafetyIllustration";
import { RiskBadge } from "@/components/RiskBadge";

interface StructuredMedicationAnalysisProps {
  patientName: string;
  patientAge: number;
  existingMedicine: string;
  proposedMedicine: string;
  proposedDosage: string;
  prescriptionDuration: string;
  isNeutralized: boolean;
  neutralizedMedicineName: string;
  riskScore: number;
  onSelectAlternative: () => void;
  onAdjustDose: () => void;
  onClinicalOverride: () => void;
  onResetToOriginal?: () => void;
}

export function StructuredMedicationAnalysis({
  patientName = "Raj Kumar",
  patientAge = 68,
  existingMedicine = "Warfarin Sodium (4 mg daily)",
  proposedMedicine = "Pain Medication X",
  proposedDosage = "10 mg Oral Tablet (Q8H)",
  prescriptionDuration = "14 Days",
  isNeutralized = false,
  neutralizedMedicineName = "Acetaminophen 500mg",
  riskScore = 94,
  onSelectAlternative,
  onAdjustDose,
  onClinicalOverride,
  onResetToOriginal,
}: StructuredMedicationAnalysisProps) {
  // Active drug display names
  const activeMedName = isNeutralized ? neutralizedMedicineName : proposedMedicine;
  const activeDose = isNeutralized ? "500 mg Oral Tablet" : proposedDosage;
  const activeFrequency = isNeutralized ? "Every 6-8 hours as needed" : "Every 8 hours (Q8H)";
  const activeDuration = isNeutralized ? "7 Days" : prescriptionDuration;
  const activePurpose = isNeutralized
    ? "Relief of acute knee osteoarthritis flare without anticoagulant collision"
    : "Acute musculoskeletal inflammatory pain and severe knee arthritis flare";

  // State for progressive disclosure accordions
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    interaction: true,
    ageRisk: false,
    durationRisk: false,
    sideEffects: false,
    whyFlagged: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const currentRiskLevel: "HIGH" | "MODERATE" | "LOW" = isNeutralized
    ? "LOW"
    : riskScore >= 70
    ? "HIGH"
    : "MODERATE";

  return (
    <div className="space-y-8">
      {/* ─────────────────────────────────────────────────────────────
          1. MEDICINE OVERVIEW & RISK SUMMARY TOP HERO
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: MEDICINE OVERVIEW (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                <Pill className="w-4 h-4" />
                <span>Medicine Overview</span>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Patient: {patientName} ({patientAge}y)
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Proposed Medicine
                </span>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {activeMedName}
                  </h2>
                  {isNeutralized ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Safe Alternative
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      Candidate Under Review
                    </span>
                  )}
                </div>
              </div>

              {/* 3 Quick Parameters */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Dose
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    {activeDose}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Frequency
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    {activeFrequency}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Duration
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    {activeDuration}
                  </span>
                </div>
              </div>

              {/* Intended Purpose */}
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Intended Purpose
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {activePurpose}
                </p>
              </div>
            </div>
          </div>

          {/* Action reset when neutralized */}
          {isNeutralized && onResetToOriginal && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
              <span className="text-xs text-slate-500 font-medium">
                Simulation: Currently viewing neutralized safe regimen
              </span>
              <button
                onClick={onResetToOriginal}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Revert to Original (High Risk)
              </button>
            </div>
          )}
        </div>

        {/* Right Column: RISK SUMMARY (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Risk Summary</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Score: {isNeutralized ? 18 : riskScore}/100
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Overall Medication Risk
                </span>
                <div className="flex items-center gap-2.5">
                  <RiskBadge level={currentRiskLevel} size="md" score={isNeutralized ? 18 : riskScore} />
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {isNeutralized ? "LOW RISK PROFILE" : "HIGH CLINICAL RISK"}
                  </span>
                </div>
              </div>

              {/* Visual gauge meter bar */}
              <div className="w-full sm:w-44 space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>0 (Safe)</span>
                  <span className="text-slate-900 dark:text-white font-extrabold">
                    {isNeutralized ? "18" : riskScore}
                  </span>
                  <span>100 (Critical)</span>
                </div>
                <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isNeutralized
                        ? "bg-emerald-500 w-[18%]"
                        : "bg-gradient-to-r from-amber-500 to-rose-600 w-[94%]"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* One Short Explanation */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Clinical Conclusion
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                {isNeutralized
                  ? "Acetaminophen provides effective analgesic coverage without competing for CYP2C9 enzymes or impairing primary platelet aggregation. Warfarin anticoagulant profile remains stable."
                  : "Prescribing this systemic NSAID concurrent with Warfarin creates a critical pharmacokinetic displacement collision and additive antiplatelet blockade, multiplying gastrointestinal hemorrhage risk 4.8-fold."}
              </p>
            </div>
          </div>

          {/* Primary Directive Callout */}
          <div
            className={`mt-5 p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
              isNeutralized
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200"
            }`}
          >
            <span className="font-bold">
              {isNeutralized
                ? "✓ Recommended Action: CONTINUE with scheduled monitoring"
                : "⚠ Recommended Action: AVOID or SWITCH to safer alternative"}
            </span>
            <button
              onClick={isNeutralized ? onAdjustDose : onSelectAlternative}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 cursor-pointer shadow-2xs transition-colors ${
                isNeutralized
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-rose-600 text-white hover:bg-rose-700"
              }`}
            >
              {isNeutralized ? "Review Dose" : "View Alternatives"}
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MEDICINE ANALYZER ILLUSTRATION (Central Intelligent Feature)
          ───────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pharmacological Interaction Visualization
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            CYP450 / Beers 2023 Safety Architecture
          </span>
        </div>

        <MedicineSafetyIllustration
          existingMedicine={existingMedicine}
          proposedMedicine={activeMedName}
          isNeutralized={isNeutralized}
          riskScore={isNeutralized ? 18 : riskScore}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. STRUCTURED CLINICAL SECTIONS (Progressive Disclosure)
          ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Structured Clinical Risk Deep-Dive
          </h3>
          <span className="text-[11px] text-slate-400">
            Click any section below to inspect reasoning & pharmacokinetics
          </span>
        </div>

        {/* 3A. INTERACTION ANALYSIS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <button
            onClick={() => toggleSection("interaction")}
            className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isNeutralized
                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                    : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                }`}
              >
                01
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Interaction Analysis
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isNeutralized
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                        : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
                    }`}
                  >
                    {isNeutralized ? "No Direct Collision" : "Severe Collision"}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {existingMedicine} + {activeMedName}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                {openSections.interaction ? "Hide details" : "View details"}
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                {openSections.interaction ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </button>

          {openSections.interaction && (
            <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Existing Medicine Involved
                  </span>
                  <p className="font-extrabold text-slate-900 dark:text-slate-100">
                    {existingMedicine}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Indication: Atrial Fibrillation stroke prophylaxis • Baseline INR: 2.4
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Potential Interaction & Severity
                  </span>
                  <p
                    className={`font-extrabold ${
                      isNeutralized ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
                    }`}
                  >
                    {isNeutralized
                      ? "Minimal CYP conflict (Neutral / Safe)"
                      : "Severe Pharmacokinetic Displacement (CRITICAL)"}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isNeutralized
                      ? "Acetaminophen undergoes primary glucuronidation, avoiding CYP2C9 inhibition."
                      : "Competitive CYP2C9 blockade slows S-warfarin clearance by ~38%."}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Why It Matters
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {isNeutralized
                    ? "Because therapeutic anticoagulation is maintained without drug-drug protein displacement, the patient can safely manage pain without risking uncontrolled hemorrhagic episodes or unpredictable INR swings."
                    : "Unbound active Warfarin concentrations spike, pushing INR into supratherapeutic ranges (>4.5). Concurrently, NSAID COX-1 inhibition stops platelets from aggregating, removing the patient's primary defense against acute gastrointestinal bleeding."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3B. AGE / PATIENT RISK */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <button
            onClick={() => toggleSection("ageRisk")}
            className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                02
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Age / Patient Risk
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    Age 68 • Geriatric Vulnerability
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  2023 AGS Beers Criteria® Considerations
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                {openSections.ageRisk ? "Hide details" : "View details"}
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                {openSections.ageRisk ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </button>

          {openSections.ageRisk && (
            <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs animate-in slide-in-from-top-2 duration-200">
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2 mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                  Relevant Age-Related Concern
                </span>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  Patients aged 65 and older exhibit reduced renal prostaglandins and age-associated mucosal thinning.
                  Systemic oral NSAIDs are listed on the <strong>AGS Beers Criteria®</strong> as agents to avoid for chronic joint pain unless effective alternatives are unavailable.
                </p>
                <div className="text-[11px] text-amber-900 dark:text-amber-300 font-mono pt-1">
                  Patient Parameters: Age 68 • eGFR: 54 mL/min (Mild-Moderate Impairment)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3C. DURATION RISK */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <button
            onClick={() => toggleSection("durationRisk")}
            className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                03
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Duration Risk
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeDuration === "14 Days"
                        ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
                        : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                    }`}
                  >
                    Duration: {activeDuration}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {activeDuration === "14 Days"
                    ? "Proposed 14-Day Duration Exceeds Geriatric Thresholds"
                    : "7-Day Short-Course Duration within Tolerable Margins"}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                {openSections.durationRisk ? "Hide details" : "View details"}
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                {openSections.durationRisk ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </button>

          {openSections.durationRisk && (
            <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs animate-in slide-in-from-top-2 duration-200">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2 mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Duration Impact Explanation
                </span>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {activeDuration === "14 Days"
                    ? "When systemic NSAIDs are administered continuously beyond 5 days in patients on oral anticoagulants, mucosal micro-erosions fail to heal, increasing ulcer bleeding probability precipitously. Maximum recommended course for acute flares is ≤ 3 to 5 days with gastroprotective PPI co-prescription."
                    : "A truncated course allows acute symptom relief while preventing progressive cumulative renal vasoconstriction and mucosal ulceration."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3D. SIDE-EFFECT LOAD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <button
            onClick={() => toggleSection("sideEffects")}
            className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                04
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Side-Effect Load
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Cumulative Burden Assessment
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Cognitive, Sedative, & Renal Cross-Tolerability
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                {openSections.sideEffects ? "Hide details" : "View details"}
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                {openSections.sideEffects ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </button>

          {openSections.sideEffects && (
            <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Anticholinergic Load
                  </span>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    ACB Score: 0 (No Cognitive Burden)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Does not accelerate delirium risk.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Fall & Sedation Index
                  </span>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {isNeutralized ? "Score: 0/3 (Minimal)" : "Score: 1/3 (Mild)"}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Safe for independent ambulation.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Renal Clearance Pressure
                  </span>
                  <span
                    className={`text-xs font-extrabold ${
                      isNeutralized ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {isNeutralized ? "Preserved Baseline" : "Glomerular Pressure Alert"}
                  </span>
                  <p className="text-[11px] text-slate-500">
                    eGFR stable with non-NSAID options.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3E. WHY WAS THIS FLAGGED? (Detailed reasoning expandable) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          <button
            onClick={() => toggleSection("whyFlagged")}
            className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-xs shrink-0">
                05
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Deep Pharmacovigilance Reasoning
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300">
                    Clinical AI Decision Tree
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Why was this flagged? (Expand for complete pharmacokinetic logic)
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                {openSections.whyFlagged ? "Hide rationale" : "View rationale"}
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                {openSections.whyFlagged ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </button>

          {openSections.whyFlagged && (
            <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs animate-in slide-in-from-top-2 duration-200">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3 mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Algorithmic Flagging Factors
                </span>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>
                      <strong>CYP2C9 Metabolic Inhibition:</strong> S-warfarin is 5x more potent than R-warfarin and cleared almost exclusively via hepatic CYP2C9. Concomitant Pain Medication X competitively binds the catalytic site.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>
                      <strong>Synergistic Platelet Impairment:</strong> Warfarin diminishes clotting factors II, VII, IX, and X. Adding cyclooxygenase inhibition removes thromboxane A2-mediated platelet plugging, exposing gastrointestinal microvascular beds.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>
                      <strong>Age-Related Microvascular Vulnerability:</strong> Geriatric mucosal barriers are less resilient against topical acid back-diffusion caused by systemic NSAIDs.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
