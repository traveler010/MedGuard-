"use client";

import React from "react";
import {
  Pill,
  Plus,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";

interface ExistingMed {
  name: string;
  dosage: string;
  frequency: string;
  category: string;
  isHighRiskInteracting?: boolean;
}

interface MedicationSummarySectionProps {
  existingMeds?: ExistingMed[];
  proposedMedication: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    isSafeAlternative?: boolean;
  };
  isProposedRemoved?: boolean;
  onRestoreProposed?: () => void;
}

export function MedicationSummarySection({
  existingMeds = [
    {
      name: "Warfarin Sodium",
      dosage: "4 mg",
      frequency: "Once daily at 6:00 PM",
      category: "Oral Anticoagulant (Blood Thinner)",
      isHighRiskInteracting: true,
    },
    {
      name: "Lisinopril",
      dosage: "10 mg",
      frequency: "Once daily in morning",
      category: "ACE Inhibitor (Blood Pressure)",
      isHighRiskInteracting: false,
    },
    {
      name: "Metformin HCl",
      dosage: "500 mg",
      frequency: "Twice daily with meals",
      category: "Biguanide (Glycemic Control)",
      isHighRiskInteracting: false,
    },
  ],
  proposedMedication,
  isProposedRemoved = false,
  onRestoreProposed,
}: MedicationSummarySectionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
            Medication Summary
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Active Regimen & Proposed Addition
          </h3>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-400 font-mono">
          {existingMeds.length} Active baseline + {isProposedRemoved ? "0" : "1"} Proposed
        </span>
      </div>

      <div className="space-y-4">
        {/* 1. Existing Medications */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-2.5">
            Existing Medications
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {existingMeds.map((med, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-2xs">
                      <Pill className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {med.name}
                    </span>
                  </div>
                  {med.isHighRiskInteracting && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      Active Target
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-slate-600 dark:text-slate-300 font-medium">
                  {med.dosage} • {med.frequency}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-400 line-clamp-1">
                  {med.category}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plus Connector Visual Divider */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-md text-xs font-black ring-4 ring-white dark:ring-slate-900">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
        </div>

        {/* 2. Proposed Medication */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
              Proposed Medication
            </span>
            {isProposedRemoved && (
              <button
                type="button"
                onClick={onRestoreProposed}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
              >
                + Restore Proposed Medication
              </button>
            )}
          </div>

          {isProposedRemoved ? (
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400 text-xs">
              Proposed medication has been removed from this prescription order.
            </div>
          ) : (
            <div
              className={`p-5 rounded-2xl border transition-all ${
                proposedMedication.isSafeAlternative
                  ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/70 ring-2 ring-emerald-500/20"
                  : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/70 ring-2 ring-amber-500/20"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs shrink-0 ${
                      proposedMedication.isSafeAlternative
                        ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400"
                        : "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    <Pill className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {proposedMedication.name}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          proposedMedication.isSafeAlternative
                            ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                            : "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                        }`}
                      >
                        {proposedMedication.isSafeAlternative
                          ? "Safe Alternative"
                          : "Under Review"}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-700 dark:text-slate-200 font-semibold">
                      Strength: {proposedMedication.dosage} • Schedule: {proposedMedication.frequency}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Treatment Duration: {proposedMedication.duration}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 block">
                    Collision Check
                  </span>
                  <span
                    className={`text-xs font-black uppercase ${
                      proposedMedication.isSafeAlternative
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    {proposedMedication.isSafeAlternative
                      ? "✓ Safe with Warfarin"
                      : "⚠ Review Advised"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
