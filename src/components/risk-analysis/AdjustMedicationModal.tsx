"use client";

import React, { useState } from "react";
import {
  X,
  Sliders,
  Sparkles,
  Calendar,
  Pill,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface AdjustMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMedication: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  };
  onSaveAdjusted: (adjusted: {
    dosage: string;
    frequency: string;
    duration: string;
    reducedRisk: boolean;
  }) => void;
}

export function AdjustMedicationModal({
  isOpen,
  onClose,
  currentMedication,
  onSaveAdjusted,
}: AdjustMedicationModalProps) {
  const [dosage, setDosage] = useState("5 mg (Reduced Dose)");
  const [frequency, setFrequency] = useState("PRN (As Needed - Max 2/day)");
  const [duration, setDuration] = useState("3 Days (Short-term Rescue)");
  const [addGastroProtection, setAddGastroProtection] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const handleApply = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      onSaveAdjusted({
        dosage,
        frequency,
        duration,
        reducedRisk: true,
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 transition-colors"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Adjust Medication Regimen
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Modify parameters for {currentMedication.name}
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
        <div className="p-6 space-y-5 text-sm overflow-y-auto">
          {/* Current vs Target banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Adjusting to Minimize Bleeding & Renal Exposure
            </div>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
              Reducing exposure duration from 14 days to 3 days and switching to PRN (as-needed) administration lowers adverse event probability significantly.
            </p>
          </div>

          {/* Dosage Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Adjusted Strength / Dosage
            </label>
            <select
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            >
              <option value="5 mg (Reduced Dose)">5 mg (Reduced Dose — 50% lower plasma peak)</option>
              <option value="10 mg (Standard Dose)">10 mg (Standard Dose)</option>
              <option value="2.5 mg (Micro-dose)">2.5 mg (Micro-dose Geriatric Titration)</option>
            </select>
          </div>

          {/* Frequency Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Prescription Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            >
              <option value="PRN (As Needed - Max 2/day)">PRN (As Needed for severe breakthrough pain - Max 2 doses/day)</option>
              <option value="Once Daily (Morning)">Once Daily with Food (Morning)</option>
              <option value="Every 8 Hours (Original Schedule)">Every 8 Hours (Original Continuous Schedule)</option>
            </select>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Exposure Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            >
              <option value="3 Days (Short-term Rescue)">3 Days (Short-term Acute Rescue — Recommended)</option>
              <option value="5 Days (Strict Upper Limit)">5 Days (Strict Upper Clinical Limit)</option>
              <option value="14 Days (Original Extended)">14 Days (Original Extended Regimen — High Hazard)</option>
            </select>
          </div>

          {/* Gastro-Protection Toggle */}
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/60 flex items-center justify-between transition-colors">
            <div className="space-y-0.5 pr-4">
              <span className="text-xs font-bold text-teal-950 dark:text-teal-100 block">
                Add Co-Prescribed Gastro-Protection (PPI)
              </span>
              <p className="text-[11px] text-teal-800 dark:text-teal-300">
                Co-prescribes Omeprazole 20mg to protect stomach lining during the 3-day course.
              </p>
            </div>
            <input
              type="checkbox"
              checked={addGastroProtection}
              onChange={(e) => setAddGastroProtection(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded-md border-slate-300 dark:border-slate-700 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all btn-press cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={isSimulating}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 btn-press cursor-pointer"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Recalculating Risk...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Apply Adjusted Regimen
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
