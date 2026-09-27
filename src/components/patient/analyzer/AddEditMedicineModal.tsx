"use client";

import React, { useState, useEffect } from "react";
import { X, Pill, Clock, Calendar, Check, AlertCircle } from "lucide-react";
import { MedicationEntry } from "@/services/polypharmacyRiskEngine";

interface AddEditMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (med: MedicationEntry) => void;
  initialData?: MedicationEntry | null;
}

export function AddEditMedicineModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddEditMedicineModalProps) {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("Once daily");
  const [scheduleTime, setScheduleTime] = useState("08:00 AM");
  const [duration, setDuration] = useState("Ongoing / Chronic");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDose(initialData.dose);
      setFrequency(initialData.frequency);
      setScheduleTime(initialData.scheduleTime || "08:00 AM");
      setDuration(initialData.duration || "Ongoing / Chronic");
      setInstructions(initialData.instructions || "");
    } else {
      setName("");
      setDose("");
      setFrequency("Once daily");
      setScheduleTime("08:00 AM");
      setDuration("Ongoing / Chronic");
      setInstructions("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dose.trim()) return;

    onSave({
      id: initialData?.id || `med-user-${Date.now()}`,
      name: name.trim(),
      dose: dose.trim(),
      frequency,
      scheduleTime,
      duration,
      instructions: instructions.trim() || undefined,
      source: initialData?.source || "Manually Added",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {initialData ? "Edit Current Medication" : "Add Current Medication"}
              </h3>
              <p className="text-[11px] text-slate-400">
                Included in the patient&apos;s active cross-check regimen
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Medicine Name */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
              Medicine Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Warfarin Sodium, Lisinopril, Metformin..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:border-teal-500 transition"
            />
          </div>

          {/* Dose & Frequency Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Dose *
              </label>
              <input
                type="text"
                required
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="e.g. 5 mg, 500 mg, 10 mL"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:border-teal-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:border-teal-500 transition cursor-pointer"
              >
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Every 8 hours">Every 8 hours</option>
                <option value="Every 12 hours">Every 12 hours</option>
                <option value="As needed (PRN)">As needed (PRN)</option>
              </select>
            </div>
          </div>

          {/* Scheduled Time & Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Scheduled Time
              </label>
              <input
                type="text"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                placeholder="e.g. 8:00 AM, Morning, Night"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:border-teal-500 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. Ongoing, 3 months, 14 days"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:border-teal-500 transition"
              />
            </div>
          </div>

          {/* Optional Instructions */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
              Optional Instructions
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Take with food, check morning BP, target INR 2.0–3.0"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:border-teal-500 transition"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{initialData ? "Save Changes" : "Add to List"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
