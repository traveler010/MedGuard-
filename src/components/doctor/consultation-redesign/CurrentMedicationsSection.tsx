"use client";

import React from "react";
import { ConsultationMedication } from "./types";
import {
  Pill,
  Clock,
  Plus,
  Camera,
  RotateCcw,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  FileText,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

interface CurrentMedicationsSectionProps {
  medications: ConsultationMedication[];
  onAddMedicine: () => void;
  onEditMedicine: (med: ConsultationMedication) => void;
  onRemoveMedicine: (id: string) => void;
  onScanList: () => void;
  onLoadPreviousRecords: () => void;
}

export function CurrentMedicationsSection({
  medications,
  onAddMedicine,
  onEditMedicine,
  onRemoveMedicine,
  onScanList,
  onLoadPreviousRecords,
}: CurrentMedicationsSectionProps) {
  const hasMedications = medications.length > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 space-y-5 transition-all">
      {/* Section Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Current Medications
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {medications.length} {medications.length === 1 ? "Item" : "Items"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Active patient prescriptions, schedules, and clinical notes verified for this consultation.
          </p>
        </div>

        {/* Action Buttons: Add, Scan, Load Previous */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scan Medication List Button */}
          <button
            type="button"
            onClick={onScanList}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200/60 dark:border-slate-700"
            title="Scan physical prescription or medicine bottle list (UI preview)"
          >
            <Camera className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Scan Medication List</span>
          </button>

          {/* Load Previous Records */}
          <button
            type="button"
            onClick={onLoadPreviousRecords}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200/60 dark:border-slate-700"
            title="Reload verified previous medication history"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Load Previous Records</span>
          </button>

          {/* Add Medicine Button */}
          <button
            type="button"
            onClick={onAddMedicine}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Medication Cards List or Empty State */}
      {!hasMedications ? (
        <div className="p-8 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-600 dark:text-amber-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No previous medication record found
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              This patient has no recorded medications in the system. You can add medicines manually or scan a prescription list.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onAddMedicine}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medication Manually</span>
            </button>
            <button
              type="button"
              onClick={onScanList}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
            >
              <Camera className="w-3.5 h-3.5 text-teal-600" />
              <span>Scan Medication List</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {medications.map((med) => (
            <div
              key={med.id}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800 hover:border-teal-500/40 dark:hover:border-teal-500/40 transition-all space-y-3 group"
            >
              {/* Card Header: Medicine Name, Dose, Status & Actions */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {med.name}
                    </h3>
                    <span className="text-xs font-mono font-black text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200/60 dark:border-teal-800/60">
                      {med.dose}
                    </span>
                  </div>
                  {med.category && (
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {med.category}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      med.status === "Active"
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {med.status}
                  </span>

                  {/* Edit & Remove Buttons */}
                  <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={() => onEditMedicine(med)}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-600 dark:text-slate-300 hover:text-teal-600 transition cursor-pointer"
                      title="Edit medication details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveMedicine(med.id)}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition cursor-pointer"
                      title="Remove medication from regimen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Schedule and Timing */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-slate-400">Frequency:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {med.frequency}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span className="text-slate-400">Time:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {med.scheduledTime}
                  </span>
                </div>
                {med.startDate && (
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-400">Started:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {med.startDate}
                    </span>
                  </div>
                )}
              </div>

              {/* Important Clinical Notes */}
              {med.importantNotes && (
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">Note: </strong>
                    {med.importantNotes}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
