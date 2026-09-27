"use client";

import React from "react";
import {
  X,
  Pill,
  Clock,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Edit3,
  Trash2,
  FileText,
  User,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Medication } from "@/data/mockPatients";

interface MedicationDrawerProps {
  medication: Medication | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (med: Medication) => void;
  onDiscontinue: (medId: string) => void;
}

export function MedicationDrawer({
  medication,
  isOpen,
  onClose,
  onEdit,
  onDiscontinue,
}: MedicationDrawerProps) {
  if (!isOpen || !medication) return null;

  // Derive duration based on start date
  const computeDuration = (startDate: string) => {
    try {
      const start = new Date(startDate);
      const now = new Date();
      const diffMonths = Math.max(
        1,
        (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
      );
      if (diffMonths >= 12) {
        const yrs = (diffMonths / 12).toFixed(1);
        return `${yrs} years (Ongoing)`;
      }
      return `${diffMonths} months`;
    } catch {
      return "Ongoing therapy";
    }
  };

  const duration = computeDuration(medication.dateStarted);

  // Compute risk level for this specific medication
  const isHighRisk = medication.beersCriteriaFlag || medication.acbScore >= 2 || medication.fallSedationScore >= 2;
  const isModerateRisk = medication.acbScore === 1 || medication.renalAdjustmentNeeded;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
      />

      {/* Drawer Container (Right side) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform ease-out duration-300 animate-in slide-in-from-right">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/70 dark:bg-slate-800/60">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shadow-slate-900/10"
                style={{ backgroundColor: medication.pillColor || "#0d9488" }}
              >
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border mb-1 ${
                    medication.isActive
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {medication.isActive ? "Active Prescription" : "Discontinued"}
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                  {medication.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {medication.genericName} • {medication.category}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm">
            {/* 1. Core Prescription Specs Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-1">
                  Dosage
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {medication.dosage}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Route: {medication.route}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-1">
                  Frequency
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {medication.frequency}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 capitalize">
                  Slot: {medication.timingSlot}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-1">
                  Duration
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  {duration}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Since {medication.dateStarted}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-1">
                  Status
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      medication.isActive ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {medication.isActive ? "Active" : "Discontinued"}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Refills available
                </span>
              </div>
            </div>

            {/* 2. Clinical Purpose / Indication */}
            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-800/60">
              <div className="flex items-center gap-2 mb-1 text-teal-900 dark:text-teal-200 font-bold text-xs">
                <FileText className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <span>Therapeutic Indication / Purpose</span>
              </div>
              <p className="text-xs text-teal-950 dark:text-teal-200 font-medium leading-relaxed">
                {medication.indication}
              </p>
              <p className="text-[11px] text-teal-800/80 dark:text-teal-300/80 mt-2 pt-2 border-t border-teal-200/60 dark:border-teal-800/60">
                <strong>Plain language explanation for patient:</strong> "{medication.patientWhy}"
              </p>
            </div>

            {/* 3. Comprehensive Risk Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Risk & Safety Analysis</span>
              </h4>

              {/* Risk Level Callout */}
              <div
                className={`p-4 rounded-2xl border ${
                  isHighRisk
                    ? "bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60"
                    : isModerateRisk
                    ? "bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60"
                    : "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {isHighRisk ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  ) : isModerateRisk ? (
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                  <span
                    className={`text-xs font-extrabold uppercase tracking-wider ${
                      isHighRisk
                        ? "text-rose-900 dark:text-rose-200"
                        : isModerateRisk
                        ? "text-amber-900 dark:text-amber-200"
                        : "text-emerald-900 dark:text-emerald-200"
                    }`}
                  >
                    {isHighRisk ? "High Risk Agent" : isModerateRisk ? "Moderate Risk Watch" : "Low Risk Profile"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
                      Anticholinergic Burden
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      ACB +{medication.acbScore}
                    </span>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
                      Sedation / Fall Hazard
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      Score +{medication.fallSedationScore}
                    </span>
                  </div>
                </div>

                {/* Beers Criteria Warning */}
                {medication.beersCriteriaFlag && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 text-xs font-medium border border-rose-300/80 dark:border-rose-800 leading-relaxed">
                    <strong className="block font-bold mb-0.5">⚠️ AGS Beers Criteria® Flag:</strong>
                    {medication.beersRationale || "Identified as potentially inappropriate in older adults."}
                  </div>
                )}

                {/* Renal Adjustment */}
                {medication.renalAdjustmentNeeded && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 text-xs font-medium border border-amber-300/80 dark:border-amber-800 leading-relaxed">
                    <strong className="block font-bold mb-0.5">Renal Clearance Notice:</strong>
                    {medication.renalNote || "Dosage reduction recommended for impaired creatinine clearance."}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Administration & Visual Details */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="font-medium text-slate-500 dark:text-slate-400">Prescribing Clinician:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{medication.prescriber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="font-medium text-slate-500 dark:text-slate-400">Dietary Timing:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{medication.withFood.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-slate-500 dark:text-slate-400">Physical Appearance:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{medication.pillVisualDescription}</span>
              </div>
            </div>
          </div>

          {/* Drawer Actions Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 flex items-center justify-between gap-3">
            <button
              onClick={() => onDiscontinue(medication.id)}
              className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Discontinue</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(medication)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Prescription</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
