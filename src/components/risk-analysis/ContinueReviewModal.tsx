"use client";

import React, { useState } from "react";
import {
  X,
  FileCheck2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface ContinueReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  medicationName?: string;
  onProceedWithOverride: (justification: string) => void;
}

export function ContinueReviewModal({
  isOpen,
  onClose,
  patientName = "Raj Kumar",
  medicationName = "Pain Medication X",
  onProceedWithOverride,
}: ContinueReviewModalProps) {
  const [justificationReason, setJustificationReason] = useState(
    "Short-term inpatient monitored therapy. Patient will receive daily INR and hemoglobin checks."
  );
  const [confirmedSafetyReview, setConfirmedSafetyReview] = useState(false);
  const [confirmedPatientInformed, setConfirmedPatientInformed] = useState(false);

  if (!isOpen) return null;

  const canSubmit = confirmedSafetyReview && confirmedPatientInformed && justificationReason.trim().length > 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onProceedWithOverride(justificationReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 transition-colors"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 bg-amber-50/60 dark:bg-slate-900 border-b border-amber-100 dark:border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Clinical Override Documentation
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Mandatory safety record for high-risk prescription
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm overflow-y-auto">
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs">
            <p>
              Proceeding requires clinical justification. This override is logged in the permanent electronic health record for <strong>{patientName}</strong> under Dr. Sharma, MD.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Clinical Rationale & Monitoring Plan
            </label>
            <textarea
              rows={3}
              value={justificationReason}
              onChange={(e) => setJustificationReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              placeholder="Detail reasons why non-NSAID alternatives are inappropriate and specify laboratory monitoring plan..."
              required
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmedSafetyReview}
                onChange={(e) => setConfirmedSafetyReview(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-amber-600 focus:ring-amber-500"
              />
              <span>
                I acknowledge the bleeding and renal hazard flagged by MediQX and confirm that gastro-protective co-therapy has been ordered.
              </span>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmedPatientInformed}
                onChange={(e) => setConfirmedPatientInformed(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-amber-600 focus:ring-amber-500"
              />
              <span>
                Patient/caregiver has been counseled on warning signs of gastrointestinal bleeding and instructed to seek immediate care if signs occur.
              </span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all btn-press cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 btn-press cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              Sign Override & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
