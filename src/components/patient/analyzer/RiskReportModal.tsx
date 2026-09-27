"use client";

import React from "react";
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Stethoscope,
  Clock,
  Calendar,
} from "lucide-react";
import {
  PolypharmacyAnalysisResult,
  MedicationEntry,
  ProposedMedicationInput,
} from "@/services/polypharmacyRiskEngine";
import { useToast } from "@/components/Toast";

interface RiskReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PolypharmacyAnalysisResult;
  currentMeds: MedicationEntry[];
  proposedMed: ProposedMedicationInput;
}

export function RiskReportModal({
  isOpen,
  onClose,
  result,
  currentMeds,
  proposedMed,
}: RiskReportModalProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `
MEDGUARD CLINICAL POLYPHARMACY RISK REPORT
Generated: ${result.timestamp}
Analysis ID: ${result.analysisId}
Patient: ${result.patientName} (Age: ${result.patientAge})

PROPOSED MEDICATION:
${proposedMed.name} (${proposedMed.dose}, ${proposedMed.frequency}, Duration: ${proposedMed.duration || "N/A"})

OVERALL RISK LEVEL: ${result.overallRisk} (Risk Score: ${result.riskScore}/100)
SUMMARY: ${result.riskSummary}
CLINICAL RATIONALE: ${result.whyFlagged}

CURRENT MEDICATIONS CHECKED (${currentMeds.length}):
${currentMeds.map((m, idx) => `${idx + 1}. ${m.name} — ${m.dose} (${m.frequency})`).join("\n")}

SPECIFIC INTERACTIONS DETECTED (${result.detectedInteractions.length}):
${
  result.detectedInteractions.length > 0
    ? result.detectedInteractions
        .map(
          (i) => `* ${i.proposedMed} + ${i.existingMed} [${i.severity}]: ${i.riskTitle}\n  Mechanism: ${i.clinicalMechanism}\n  Impact: ${i.clinicalImpact}\n  Guideline: ${i.evidenceSource}`
        )
        .join("\n\n")
    : "None detected."
}

CATEGORICAL CLINICAL ASSESSMENTS:
1. Drug-Drug Interaction: [${result.categories.drugInteraction.status}] ${result.categories.drugInteraction.summary}
2. Dependence Risk: [${result.categories.dependenceRisk.status}] ${result.categories.dependenceRisk.summary}
3. Cumulative Side-Effect Load: [${result.categories.sideEffectLoad.status}] ${result.categories.sideEffectLoad.summary}
4. Age Appropriateness: [${result.categories.ageAppropriateness.status}] ${result.categories.ageAppropriateness.summary}
5. Duration Appropriateness: [${result.categories.durationAppropriateness.status}] ${result.categories.durationAppropriateness.summary}

DUAL-HORIZON EVALUATION:
- Short-Term Relief: ${result.shortTermRelief.summary}
- Long-Term Safety: ${result.longTermSafety.summary}

ACTIONABLE CLINICAL OPTIONS / SAFER ALTERNATIVES:
${result.actionableOptions.map((o) => `* [${o.category}] ${o.recommendation}\n  Reason: ${o.reason}\n  Source: ${o.sourceStatus}`).join("\n\n")}

DISCLAIMER: Clinical decision support tool. Final clinical judgment remains with attending physician.
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast("Report Copied", "Structured report copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Clinical Polypharmacy Risk Report
              </h3>
              <p className="text-[11px] text-slate-400">
                Ref: {result.analysisId} • {result.timestamp}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Report</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content Body (Printable) */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* Patient & Proposed Header Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Patient Information</span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {result.patientName} (Age: {result.patientAge})
              </h4>
              <p className="text-[11px] text-slate-500">
                Evaluation: Polypharmacy Risk &amp; Cross-Check Matrix
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Proposed Medication</span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {proposedMed.name} — {proposedMed.dose}
              </h4>
              <p className="text-[11px] text-slate-500">
                Regimen: {proposedMed.frequency} • Duration: {proposedMed.duration || "14 days"}
              </p>
            </div>
          </div>

          {/* Overall Risk Verdict */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              result.overallRisk === "HIGH"
                ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800"
                : result.overallRisk === "MODERATE"
                ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
                : "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {result.overallRisk === "HIGH" ? (
                <ShieldAlert className="w-8 h-8 text-rose-600 shrink-0" />
              ) : result.overallRisk === "MODERATE" ? (
                <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block">
                  Overall Clinical Hazard Assessment
                </span>
                <span className="text-base font-black">
                  {result.overallRisk} RISK LEVEL (Hazard Score: {result.riskScore}/100)
                </span>
                <p className="text-[11px] mt-0.5 leading-relaxed">
                  {result.riskSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Clinical Rationale: Why Flagged */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900 dark:text-white block">
              Why This Risk Was Detected
            </span>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {result.whyFlagged}
            </p>
          </div>

          {/* Current Medications Roster */}
          <div className="space-y-2">
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900 dark:text-white block">
              Active Medication Profile ({currentMeds.length} Checked)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentMeds.map((med, idx) => (
                <div
                  key={med.id}
                  className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 space-y-0.5"
                >
                  <p className="font-black text-slate-900 dark:text-white text-xs">
                    {idx + 1}. {med.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {med.dose} • {med.frequency} {med.scheduleTime ? `• ${med.scheduleTime}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Categorical Breakdown Grid */}
          <div className="space-y-3">
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900 dark:text-white block">
              Categorical Risk Breakdown
            </span>
            <div className="space-y-2.5">
              {Object.entries(result.categories).map(([key, cat]) => (
                <div
                  key={key}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/90 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 dark:text-white">
                        {cat.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {cat.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {cat.summary}
                    </p>
                    <p className="text-[11px] text-slate-400 italic">
                      Rec: {cat.clinicalRecommendation}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase self-start ${
                      cat.status === "HIGH"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : cat.status === "MODERATE"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {cat.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Short-Term vs Long-Term */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-teal-800 dark:text-teal-300 block">
                Short-Term Symptom Relief ({result.shortTermRelief.efficacyRating} Efficacy)
              </span>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {result.shortTermRelief.summary}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {result.shortTermRelief.clinicalContext}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase text-amber-800 dark:text-amber-300 block">
                Long-Term Medication Safety ({result.longTermSafety.safetyRating})
              </span>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                {result.longTermSafety.summary}
              </p>
              <div className="flex flex-wrap gap-1 pt-0.5">
                {result.longTermSafety.organVulnerabilities.map((v, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Options / Safer Alternatives */}
          <div className="space-y-2.5">
            <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-900 dark:text-white block">
              Verified Actionable Clinical Options
            </span>
            <div className="space-y-2">
              {result.actionableOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-teal-700 dark:text-teal-400 uppercase text-[10px]">
                      {opt.category}
                    </span>
                    {opt.isRecommended && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Physician Choice
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {opt.recommendation}
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {opt.reason}
                  </p>
                  <p className="text-[10px] text-slate-400 pt-0.5">
                    Guideline / Source: {opt.sourceStatus}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Clinical Decision Support Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1 text-[11px] text-slate-500">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              Clinical Decision Support System (CDSS) Notice
            </span>
            <p>
              This report is generated for qualified clinical decision support. MedGuard does not automatically prescribe, approve, or modify medications. The final clinical evaluation and prescription decision remain the sole responsibility of the licensed attending physician.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            MedGuard Clinical Pharmacological Inference Engine
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 text-white font-bold text-xs transition cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
