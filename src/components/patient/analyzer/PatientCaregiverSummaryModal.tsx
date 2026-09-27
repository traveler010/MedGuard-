"use client";

import React from "react";
import {
  X,
  Printer,
  Heart,
  Pill,
  Clock,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { PolypharmacyAnalysisResult } from "@/services/polypharmacyRiskEngine";

interface PatientCaregiverSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PolypharmacyAnalysisResult;
}

export function PatientCaregiverSummaryModal({
  isOpen,
  onClose,
  result,
}: PatientCaregiverSummaryModalProps) {
  if (!isOpen) return null;

  const summary = result.patientCaregiverSummary;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Patient &amp; Caregiver Summary
              </h3>
              <p className="text-[11px] text-slate-400">
                Clear, simple medication instructions for home care
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Summary</span>
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

        {/* Simplified Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* 1. Medicine & Purpose Card */}
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 space-y-2">
            <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-extrabold text-sm">
              <Pill className="w-4 h-4 text-teal-600" />
              <span>Medicine</span>
            </div>
            <p className="text-base font-black text-slate-900 dark:text-white">
              {summary.medicationName}
            </p>
            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
                What this medicine is for:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {summary.purpose}
              </p>
            </div>
          </div>

          {/* 2. Dose & Schedule */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-xs">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Dose &amp; How to Take</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {summary.doseSchedule}
            </p>
            <p className="text-[11px] text-slate-500">
              Take with a full glass of water. Swallow whole; do not crush tablets unless instructed by your doctor.
            </p>
          </div>

          {/* 3. Important Caution */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              result.overallRisk === "HIGH"
                ? "bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800"
                : "bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
            }`}
          >
            <div className="flex items-center gap-2 font-extrabold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-slate-900 dark:text-white">Important Caution</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
              {summary.keyCaution}
            </p>
          </div>

          {/* 4. Reminder Tip */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-xs">
              <Bell className="w-4 h-4 text-teal-600" />
              <span>Reminder &amp; Routine Setup</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              {summary.reminderTip}
            </p>
          </div>

          {/* 5. When to Call Doctor */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
            <span className="font-extrabold text-slate-800 dark:text-slate-200 block">
              When to Contact Your Care Team:
            </span>
            <p>{summary.emergencyWarning}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-400 text-[11px]">
            MedGuard Home Care Assistant
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 text-white font-bold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
