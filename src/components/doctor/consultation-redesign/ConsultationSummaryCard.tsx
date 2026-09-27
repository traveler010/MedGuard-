"use client";

import React, { useState } from "react";
import {
  ConsultationMedication,
  ProposedMedicineInput,
  RiskAnalysisResult,
} from "./types";
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  UserCheck,
  Pill,
  Sparkles,
} from "lucide-react";

interface ConsultationSummaryCardProps {
  existingMedications: ConsultationMedication[];
  proposedMedicine: ProposedMedicineInput;
  riskResult: RiskAnalysisResult | null;
  selectedAction: string;
  doctorNotes: string;
  onDoctorNotesChange: (notes: string) => void;
  onContinueConsultation: () => void;
  isCompleted?: boolean;
}

export function ConsultationSummaryCard({
  existingMedications,
  proposedMedicine,
  riskResult,
  selectedAction,
  doctorNotes,
  onDoctorNotesChange,
  onContinueConsultation,
  isCompleted = false,
}: ConsultationSummaryCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-7 space-y-6 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
            <ClipboardCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Consultation Summary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review current medications, proposed prescription decisions, and clinical rationale before concluding.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start sm:self-auto">
          Final Decision Support Audit
        </span>
      </div>

      {/* Grid: Existing Meds & Proposed Medicine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Existing Medications */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Existing Medications ({existingMedications.length})
          </span>
          {existingMedications.length > 0 ? (
            <div className="space-y-1.5">
              {existingMedications.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {m.name}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono">
                    {m.dose} • {m.frequency}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No existing medications on record.</p>
          )}
        </div>

        {/* Newly Proposed Medicine */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
            Newly Proposed Medicine
          </span>
          {proposedMedicine.name ? (
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {proposedMedicine.name}
                </span>
                <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                  {proposedMedicine.dose}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Frequency: <strong>{proposedMedicine.frequency || "As prescribed"}</strong> • Duration: <strong>{proposedMedicine.duration || "Standard"}</strong>
              </p>
              {proposedMedicine.instructions && (
                <p className="text-[11px] text-slate-500 italic pt-0.5">
                  &ldquo;{proposedMedicine.instructions}&rdquo;
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No new candidate medication proposed in this session.
            </p>
          )}
        </div>
      </div>

      {/* Risk Level & Clinical Action Bar */}
      {riskResult && (
        <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Risk Assessment:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  riskResult.level === "HIGH"
                    ? "bg-rose-600 text-white"
                    : riskResult.level === "MODERATE"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {riskResult.level} RISK
              </span>
            </div>

            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Selected Action: <span className="text-teal-600 dark:text-teal-400 font-extrabold">{selectedAction}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-white">Explanation: </strong>
            {riskResult.explanation}
          </p>
        </div>
      )}

      {/* Doctor Clinical Notes Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            <span>Attending Doctor Notes & Instructions</span>
          </span>
          <span className="text-[10px] text-slate-400 font-normal">Included in patient visit report</span>
        </label>
        <textarea
          rows={3}
          value={doctorNotes}
          onChange={(e) => onDoctorNotesChange(e.target.value)}
          placeholder="Enter clinical notes, patient follow-up guidance, or dietary adjustments (e.g. Advised hydration, avoid OTC NSAIDs, follow up in 2 weeks)..."
          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs resize-none"
        />
      </div>

      {/* Button: Continue Consultation */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs text-slate-400">
          Physician Signature: <strong>Dr. Sharma, MD</strong> • MedGuard CDS
        </span>

        <button
          type="button"
          onClick={onContinueConsultation}
          className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 text-white font-black text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue Consultation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
