"use client";

import React, { useState, useEffect } from "react";
import { PatientManualMedicine } from "./types";
import { X, Plus, Save, Pill, Clock, Calendar } from "lucide-react";

interface AddEditPatientMedicineModalProps {
  isOpen: boolean;
  medicineToEdit: PatientManualMedicine | null;
  onClose: () => void;
  onSave: (med: PatientManualMedicine) => void;
}

export function AddEditPatientMedicineModal({
  isOpen,
  medicineToEdit,
  onClose,
  onSave,
}: AddEditPatientMedicineModalProps) {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("Twice daily");
  const [times, setTimes] = useState("08:00 AM, 08:00 PM");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (medicineToEdit) {
      setName(medicineToEdit.name);
      setDose(medicineToEdit.dose);
      setFrequency(medicineToEdit.frequency);
      setTimes(medicineToEdit.times);
      setStartDate(medicineToEdit.startDate || "");
      setEndDate(medicineToEdit.endDate || "");
      setInstructions(medicineToEdit.instructions || "");
    } else {
      setName("");
      setDose("");
      setFrequency("Twice daily");
      setTimes("08:00 AM, 08:00 PM");
      setStartDate(new Date().toISOString().split("T")[0]);
      setEndDate("");
      setInstructions("");
    }
  }, [medicineToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dose.trim()) return;

    const saved: PatientManualMedicine = {
      id: medicineToEdit ? medicineToEdit.id : `med-man-${Date.now()}`,
      name: name.trim(),
      dose: dose.trim(),
      frequency: frequency.trim(),
      times: times.trim(),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      instructions: instructions.trim() || undefined,
    };

    onSave(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden space-y-5 p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {medicineToEdit ? "Edit Medicine" : "Add Medicine Manually"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Enter details for your doctor to review
              </p>
            </div>
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
          {/* Medicine Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Medicine Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Paracetamol, Metformin, Blood Pressure Medicine..."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
            />
          </div>

          {/* Dose & Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Dose *
              </label>
              <input
                type="text"
                required
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="e.g. 500 mg, 1 tablet..."
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Frequency
              </label>
              <input
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="e.g. Twice daily, Once daily..."
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
              />
            </div>
          </div>

          {/* Time(s) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Time(s) to take the medicine</span>
              <span className="text-[10px] text-slate-400 font-normal">Multiple times allowed</span>
            </label>
            <input
              type="text"
              value={times}
              onChange={(e) => setTimes(e.target.value)}
              placeholder="e.g. 08:00 AM • 08:00 PM"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
            />
          </div>

          {/* Start and End Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
              />
            </div>
          </div>

          {/* Optional Instructions */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Optional Instructions
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Take after breakfast with water, avoid taking on empty stomach..."
              className="w-full px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs resize-none"
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
              <Plus className="w-3.5 h-3.5" />
              <span>{medicineToEdit ? "Save Changes" : "Add Medicine"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
