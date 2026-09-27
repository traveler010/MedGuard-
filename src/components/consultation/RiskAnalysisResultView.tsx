"use client";

import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  FileText,
  Pill,
  Check,
  Info,
} from "lucide-react";
import { Patient, Medication } from "@/data/mockPatients";
import { ProposedMedicineData } from "./Step4ProposedMedicine";

interface RiskAnalysisResultViewProps {
  patient: Patient;
  proposedMed: ProposedMedicineData;
  onModifyProposed: () => void;
  onAcceptAlternative: (altMed: Partial<Medication>) => void;
  onReturnToDashboard: () => void;
}

export function RiskAnalysisResultView({
  patient,
  proposedMed,
  onModifyProposed,
  onAcceptAlternative,
  onReturnToDashboard,
}: RiskAnalysisResultViewProps) {
  const medLower = proposedMed.name.toLowerCase();

  // Dynamic clinical evaluation logic based on mock pharmacokinetics
  const isCipro = medLower.includes("cipro");
  const isIbuprofen = medLower.includes("ibuprofen") || medLower.includes("advil") || medLower.includes("motrin");
  const isAcetaminophen = medLower.includes("acetaminophen") || medLower.includes("tylenol");

  const isHighRisk = isCipro || isIbuprofen;
  const isModerateRisk = !isHighRisk && !isAcetaminophen;
  const isSafe = isAcetaminophen;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Verdict Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-lg ${
          isHighRisk
            ? "bg-gradient-to-br from-rose-950 via-rose-900 to-slate-900 border-rose-500/40 text-white"
            : isModerateRisk
            ? "bg-gradient-to-br from-amber-950 via-amber-900 to-slate-900 border-amber-500/40 text-white"
            : "bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 border-teal-500/40 text-white"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isHighRisk
                    ? "bg-rose-500 text-white shadow-xs"
                    : isModerateRisk
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : "bg-emerald-500 text-slate-950 shadow-xs"
                }`}
              >
                {isHighRisk ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : isModerateRisk ? (
                  <AlertCircle className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                {isHighRisk
                  ? "CRITICAL POLYPHARMACY HAZARD DETECTED"
                  : isModerateRisk
                  ? "MODERATE CLINICAL PRECAUTION REQUIRED"
                  : "SAFE COMPATIBILITY VERIFIED"}
              </span>

              <span className="text-xs text-slate-300 font-mono">
                Prescription: {proposedMed.name} ({proposedMed.dosage})
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isCipro
                ? "Severe CYP1A2/2C9 Warfarin Potentiation & Supratherapeutic INR Spike"
                : isIbuprofen
                ? "Compounded Acute Kidney Injury & Blunted Antihypertensive Response"
                : isSafe
                ? "Optimal First-Line Therapeutic Match with Zero Significant Collisions"
                : "Regimen Addition Safe with Routine Follow-up Monitoring"}
            </h2>

            <p className="text-sm text-slate-200 max-w-2xl leading-relaxed">
              {isCipro
                ? `Ciprofloxacin co-prescribed with ${patient.name}'s active Warfarin inhibits hepatic clearance, driving INR from 3.8 to >5.0 and substantially increasing major gastrointestinal hemorrhage hazard.`
                : isIbuprofen
                ? `NSAIDs co-administered with Lisinopril and ${patient.name}'s baseline eGFR 34 mL/min induces severe afferent arteriole vasoconstriction, precipitating acute renal decompensation.`
                : isSafe
                ? `Acetaminophen has negligible antiplatelet, renal, or cytochrome inhibition properties and does not cross-react with ${patient.name}'s active medication panel.`
                : `No life-threatening pairwise collision detected. Routine liver and renal panel review recommended.`}
            </p>
          </div>

          {/* High-level score delta badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center shrink-0 min-w-[160px]">
            <span className="text-[11px] uppercase font-bold text-slate-300 block mb-1">
              Projected Risk Score
            </span>
            <div
              className={`text-4xl font-black ${
                isHighRisk ? "text-rose-400" : isModerateRisk ? "text-amber-400" : "text-emerald-400"
              }`}
            >
              {isHighRisk ? "98" : isModerateRisk ? "74" : "42"}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <span className="text-[10px] font-bold text-slate-300 block mt-1">
              {isHighRisk ? "+12 Pts (Surge)" : isModerateRisk ? "+4 Pts" : "-14 Pts (Safe)"}
            </span>
          </div>
        </div>
      </div>

      {/* 4-Check Inspection Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Check 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              1. Drug Interaction Check
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isHighRisk
                  ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
              }`}
            >
              {isHighRisk ? "Severe Collision" : "Passed"}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {isCipro
              ? "Warfarin + Ciprofloxacin CYP1A2 / CYP2C9"
              : isIbuprofen
              ? "Lisinopril + Ibuprofen Hemodynamic Collision"
              : "No Cytochrome P450 competition"}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {isCipro
              ? "Fluoroquinolones elevate free circulating Warfarin molecules. Bleeding risk ratio increases 3.4x."
              : isIbuprofen
              ? "Prostaglandin inhibition blunts ACE inhibitor vasodilation, resulting in blood pressure rebound."
              : "Standard metabolic clearance pathways remain unimpaired with current concomitant medications."}
          </p>
        </div>

        {/* Check 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              2. Age & Geriatric Risk Check
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isHighRisk
                  ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
              }`}
            >
              {isHighRisk ? "Beers Criteria Flag" : "Approved for 65+"}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {patient.age}yo Patient Geriatric Safety Profile
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {isHighRisk
              ? "2023 AGS Beers Criteria strongly advises avoiding chronic systemic NSAIDs or high-dose fluoroquinolones in older adults."
              : "Regimen addition adheres to American Geriatrics Society safety recommendations for older adults."}
          </p>
        </div>

        {/* Check 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              3. Duration & Renal Exposure Check
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                patient.eGFR < 60 && isHighRisk
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
              }`}
            >
              eGFR {patient.eGFR} mL/min
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Clearance Threshold Audit ({proposedMed.duration})
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {patient.eGFR < 45
              ? `Patient's Stage 3b CKD creates prolonged drug half-life. Accumulation toxicity probability elevated for treatments >5 days.`
              : "Standard treatment duration appropriate for anticipated pharmacokinetic half-life."}
          </p>
        </div>

        {/* Check 4 */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              4. Side-Effect & Fall Index Check
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                patient.fallRiskScore >= 7
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
              }`}
            >
              Fall Index: {patient.fallRiskScore}/10
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            CNS Sedation & Neurological Impact
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Patient currently taking {patient.medications.find(m => m.acbScore > 0)?.name || "mild sedatives"}. No additive central anticholinergic sedation induced by proposed agent.
          </p>
        </div>
      </div>

      {/* Actionable Decision Support Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recommended Clinical Deprescribing Protocol
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evidence-based alternatives and dosage modifications
            </p>
          </div>
        </div>

        {isHighRisk ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-400 tracking-wider">
                Recommended Safe Alternative
              </span>
              <h4 className="text-base font-extrabold text-teal-950 dark:text-teal-100">
                {isCipro
                  ? "Substitute Ciprofloxacin with Nitrofurantoin 100mg or Fosfomycin 3g"
                  : "Substitute Ibuprofen with Acetaminophen 500mg TID + Topical Voltaren Gel"}
              </h4>
              <p className="text-xs text-teal-900/80 dark:text-teal-200/90 leading-relaxed">
                {isCipro
                  ? "Negligible CYP interaction with Warfarin. Maintains target INR without acute hemorrhage risk."
                  : "Provides effective analgesia for osteoarthritis without precipitating afferent arteriolar constriction."}
              </p>
            </div>

            <button
              onClick={() =>
                onAcceptAlternative({
                  name: isCipro ? "Nitrofurantoin Monohydrate" : "Acetaminophen (Tylenol)",
                  dosage: isCipro ? "100 mg" : "500 mg",
                  frequency: isCipro ? "BID x 5 days" : "TID with water",
                  indication: proposedMed.indication,
                  category: isCipro ? "Antimicrobial" : "Analgesic",
                  acbScore: 0,
                  fallSedationScore: 0,
                  beersCriteriaFlag: false,
                })
              }
              className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-sm cursor-pointer shrink-0"
            >
              <Check className="w-4 h-4" />
              <span>Accept Alternative</span>
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed">
            <strong>Clinical Safety Clearance:</strong> This prescription may be safely added to {patient.name}'s active medication profile.
          </div>
        )}

        {/* Action Controls Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onModifyProposed}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Modify Proposed Medicine</span>
          </button>

          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href={`/doctor/consultation/${patient.id}/analysis?med=${encodeURIComponent(proposedMed.name)}&dosage=${encodeURIComponent(proposedMed.dosage)}`}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dedicated Risk Dashboard</span>
            </a>

            <button
              onClick={onReturnToDashboard}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <span>Finish Consultation & Return to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
