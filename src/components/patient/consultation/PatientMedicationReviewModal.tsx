"use client";

import React from "react";
import { MedicationAnalysisReportItem } from "@/services/medicationAnalysisService";
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Stethoscope,
  Pill,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Info,
  Printer,
  Sparkles,
} from "lucide-react";

interface PatientMedicationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: MedicationAnalysisReportItem;
  doctorResponseText?: string;
  doctorName?: string;
}

export function PatientMedicationReviewModal({
  isOpen,
  onClose,
  report,
  doctorResponseText,
  doctorName = "Dr. Sarah Mitchell, MD",
}: PatientMedicationReviewModalProps) {
  if (!isOpen) return null;

  const summary = report.patientCaregiverSummary;
  const effectiveDoctorResponse =
    doctorResponseText || report.doctorReview?.clinicalNote || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full my-auto overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-200/90 dark:border-slate-800 bg-teal-50/60 dark:bg-teal-950/40 flex items-center justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300">
              Patient Care Summary
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Your Medication Review
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A simplified summary of your medication safety review and your doctor&apos;s recommendations.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer shrink-0"
            title="Close summary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* 1. Proposed Medicine & Risk Level */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Proposed Medicine Considered
                </span>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {report.proposedMedication.name}
                </h4>
              </div>

              {/* Risk Badge */}
              <div
                className={`px-3 py-1 rounded-full font-black text-xs uppercase flex items-center gap-1.5 ${
                  report.overallRisk === "HIGH"
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                    : report.overallRisk === "MODERATE"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                }`}
              >
                {report.overallRisk === "HIGH" ? (
                  <ShieldAlert className="w-3.5 h-3.5" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                <span>Risk Level: {report.overallRisk}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">Dose & Schedule:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {summary?.doseSchedule || `${report.proposedMedication.dose} (${report.proposedMedication.frequency})`}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">What it is for:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {summary?.purpose || "Prescribed for acute symptom management."}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Simple Explanation (Requirement 9) */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/80 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
              Plain-Language Explanation
            </span>
            <p className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200 leading-relaxed">
              {report.whyFlagged}
            </p>
          </div>

          {/* 3. Important Caution & Red Flag Alert */}
          {summary?.keyCaution && (
            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/80 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 dark:text-rose-300 block flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Important Safety Caution</span>
              </span>
              <p className="text-xs font-semibold text-rose-950 dark:text-rose-200 leading-relaxed">
                {summary.keyCaution}
              </p>
              {summary.emergencyWarning && (
                <p className="text-[11px] font-bold text-rose-700 dark:text-rose-400 pt-1 border-t border-rose-200/60 dark:border-rose-800/60">
                  {summary.emergencyWarning}
                </p>
              )}
            </div>
          )}

          {/* 4. What Your Doctor Said (Requirement 9) */}
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 dark:text-teal-300 block flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span>What Your Doctor Said</span>
              </span>
              <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">
                {doctorName}
              </span>
            </div>

            {effectiveDoctorResponse ? (
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed italic">
                &ldquo;{effectiveDoctorResponse}&rdquo;
              </p>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                Your doctor is currently reviewing this medication analysis and will provide direct instructions in your consultation shortly.
              </p>
            )}
          </div>

          {/* 5. Recommended Safer Alternative (if present) */}
          {report.actionableOptions && report.actionableOptions.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Safer Alternative Recommended by Clinical Guidelines:
              </span>
              <p className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                {report.actionableOptions[0].recommendation}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {report.actionableOptions[0].reason}
              </p>
            </div>
          )}

          {/* Medical Decision Support Notice */}
          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center italic">
            This review is clinical decision support provided to your attending physician. It does not replace personal medical advice from your doctor.
          </p>
        </div>

        {/* FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-teal-600" />
            <span>Print Summary</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
