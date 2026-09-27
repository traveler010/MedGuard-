"use client";

import React, { useState, useEffect } from "react";
import { ConsultationMedication } from "./types";
import { X, Plus, Save, Pill } from "lucide-react";

interface AddEditMedicineModalProps {
  isOpen: boolean;
  medicationToEdit: ConsultationMedication | null;
  onClose: () => void;
  onSave: (med: ConsultationMedication) => void;
}

export function AddEditMedicineModal({
  isOpen,
  medicationToEdit,
  onClose,
  onSave,
}: AddEditMedicineModalProps) {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("Once daily");
  const [scheduledTime, setScheduledTime] = useState("08:00 AM");
  const [importantNotes, setImportantNotes] = useState("");
  const [purposePlain, setPurposePlain] = useState("");

  useEffect(() => {
    if (medicationToEdit) {
      setName(medicationToEdit.name);
      setDose(medicationToEdit.dose);
      setFrequency(medicationToEdit.frequency);
      setScheduledTime(medicationToEdit.scheduledTime);
      setImportantNotes(medicationToEdit.importantNotes || "");
      setPurposePlain(medicationToEdit.purposePlain || "");
    } else {
      setName("");
      setDose("");
      setFrequency("Once daily");
      setScheduledTime("08:00 AM");
      setImportantNotes("");
      setPurposePlain("");
    }
  }, [medicationToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dose.trim()) return;

    const savedMed: ConsultationMedication = {
      id: medicationToEdit ? medicationToEdit.id : `med-${Date.now()}`,
      name: name.trim(),
      dose: dose.trim(),
      frequency: frequency.trim(),
      scheduledTime: scheduledTime.trim(),
      startDate: medicationToEdit?.startDate || new Date().toISOString().split("T")[0],
      status: "Active",
      importantNotes: importantNotes.trim() || undefined,
      purposePlain: purposePlain.trim() || "Prescribed by attending physician",
      patientExplanation: importantNotes.trim() || "Take as scheduled with water.",
    };

    onSave(savedMed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden space-y-5 p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {medicationToEdit ? "Edit Medication" : "Add Medication"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Medicine Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aspirin, Lisinopril, Metformin..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Dose *
              </label>
              <input
                type="text"
                required
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="e.g. 500 mg, 75 mg..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Scheduled Time
              </label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="e.g. 08:00 AM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Frequency
            </label>
            <input
              type="text"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="e.g. Once daily, Twice daily..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Simple Purpose (for Caregiver View)
            </label>
            <input
              type="text"
              value={purposePlain}
              onChange={(e) => setPurposePlain(e.target.value)}
              placeholder="e.g. Helps control blood pressure"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Important Clinical Notes
            </label>
            <textarea
              rows={2}
              value={importantNotes}
              onChange={(e) => setImportantNotes(e.target.value)}
              placeholder="e.g. Take with breakfast; report dry cough..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{medicationToEdit ? "Save Changes" : "Add Medicine"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
