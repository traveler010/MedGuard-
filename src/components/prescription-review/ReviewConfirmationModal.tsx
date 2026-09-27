"use client";

import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Pill,
  User,
} from "lucide-react";

interface ReviewConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patientName?: string;
  patientAge?: number;
  medicationName?: string;
  dosage?: string;
  overallRisk?: "HIGH" | "MODERATE" | "LOW";
}

export function ReviewConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  patientName = "Raj Kumar",
  patientAge = 68,
  medicationName = "Acetaminophen (Tylenol)",
  dosage = "500 mg",
  overallRisk = "LOW",
}: ReviewConfirmationModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  const isHighRisk = overallRisk === "HIGH";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs ${
                isHighRisk
                  ? "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400"
                  : "bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400"
              }`}
            >
              {isHighRisk ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-0.5">
                Clinical Safety Confirmation
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Review & Verification Prompt
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm overflow-y-auto">
          {/* Prompt statement required by user */}
          <div
            className={`p-4 rounded-2xl border ${
              isHighRisk
                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200"
                : "bg-teal-50/70 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800 text-teal-950 dark:text-teal-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2
                className={`w-5 h-5 mt-0.5 shrink-0 ${
                  isHighRisk ? "text-rose-600 dark:text-rose-400" : "text-teal-600 dark:text-teal-400"
                }`}
              />
              <div>
                <p className="font-bold text-sm leading-snug">
                  &ldquo;Please review the medication and risk information before continuing.&rdquo;
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  You are about to approve the proposed prescription for{" "}
                  <strong>{patientName}</strong> ({patientAge} yrs). Ensure that drug compatibility with active blood thinner therapy has been accounted for.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Context Summary */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" /> Patient:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{patientName} (Age {patientAge})</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" /> Medication:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">{medicationName} ({dosage})</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Evaluated Risk Level:</span>
              <span
                className={`font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-[10px] border ${
                  overallRisk === "LOW"
                    ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    : overallRisk === "MODERATE"
                    ? "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                    : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                }`}
              >
                {overallRisk} RISK
              </span>
            </div>
          </div>

          {/* Mandatory Checkbox */}
          <label className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span className="leading-relaxed">
              I have reviewed the pharmacological risk analysis and confirm that this prescription order is clinically appropriate for {patientName}.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all btn-press"
          >
            Cancel & Re-check
          </button>
          <button
            type="button"
            disabled={!acknowledged}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 btn-press"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Approve & Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
