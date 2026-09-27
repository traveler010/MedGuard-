"use client";

import React, { useState, useEffect } from "react";
import { X, Edit3, Pill, CheckCircle2 } from "lucide-react";
import { Medication } from "@/data/mockPatients";

interface EditMedicineModalProps {
  medication: Medication | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMed: Medication) => void;
}

export function EditMedicineModal({
  medication,
  isOpen,
  onClose,
  onSave,
}: EditMedicineModalProps) {
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [indication, setIndication] = useState("");
  const [specialNotice, setSpecialNotice] = useState("");

  useEffect(() => {
    if (medication) {
      setDosage(medication.dosage);
      setFrequency(medication.frequency);
      setIsActive(medication.isActive);
      setIndication(medication.indication);
      setSpecialNotice(medication.patientSpecialNotice || "");
    }
  }, [medication]);

  if (!isOpen || !medication) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...medication,
      dosage: dosage.trim() || medication.dosage,
      frequency: frequency.trim() || medication.frequency,
      isActive,
      indication: indication.trim() || medication.indication,
      patientSpecialNotice: specialNotice.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Edit Prescription: {medication.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust dosage, schedule frequency, or clinical indications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Dosage</label>
              <input
                type="text"
                required
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Frequency</label>
              <input
                type="text"
                required
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Therapeutic Indication / Purpose
            </label>
            <input
              type="text"
              value={indication}
              onChange={(e) => setIndication(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Patient Special Advisory Notice
            </label>
            <textarea
              rows={2}
              value={specialNotice}
              onChange={(e) => setSpecialNotice(e.target.value)}
              placeholder="e.g. Take with full glass of water. Avoid sudden cessation."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Prescription Status</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Active vs On Hold</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span className={isActive ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-slate-500 dark:text-slate-400"}>
                {isActive ? "Active Prescription" : "Suspended / Inactive"}
              </span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer btn-press"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors cursor-pointer btn-press"
            >
              Update Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
