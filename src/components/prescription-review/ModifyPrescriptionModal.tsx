"use client";

import React, { useState } from "react";
import {
  X,
  Sliders,
  Pill,
  Clock,
  Sparkles,
  Check,
} from "lucide-react";

interface ModifyPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentValues: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  };
  onSave: (updated: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }) => void;
}

export function ModifyPrescriptionModal({
  isOpen,
  onClose,
  currentValues,
  onSave,
}: ModifyPrescriptionModalProps) {
  const [medication, setMedication] = useState(currentValues.medication);
  const [dosage, setDosage] = useState(currentValues.dosage);
  const [frequency, setFrequency] = useState(currentValues.frequency);
  const [duration, setDuration] = useState(currentValues.duration);
  const [instructions, setInstructions] = useState(currentValues.instructions);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      medication,
      dosage,
      frequency,
      duration,
      instructions,
    });
    onClose();
  };

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
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Modify Prescription Order
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Adjust dosage, administration schedule, or treatment duration
              </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300 overflow-y-auto">
          <div>
            <label className="block uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
              Medication Name
            </label>
            <input
              type="text"
              required
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                Strength / Dosage
              </label>
              <input
                type="text"
                required
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
                Frequency
              </label>
              <input
                type="text"
                required
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
              Prescription Duration
            </label>
            <input
              type="text"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-bold">
              Special Clinical Instructions / Patient Notes
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all btn-press"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow-sm flex items-center gap-1.5 btn-press"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Apply Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
