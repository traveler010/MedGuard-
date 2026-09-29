"use client";

import React from "react";
import {
  X,
  Pill,
  Clock,
  Heart,
  AlertCircle,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Volume2,
} from "lucide-react";

export interface PatientMedicineDetail {
  id: string;
  name: string;
  simpleName: string;
  time: string;
  timeSlot: "Morning" | "Afternoon" | "Evening";
  purpose: string;
  dosage: string;
  pillDescription: string;
  whenToTake: string;
  doctorInstructions: string;
  safetyInfo: string[];
  doctorName: string;
  pillColor: string;
  isTaken: boolean;
}

interface MedicineDetailDrawerProps {
  medicine: PatientMedicineDetail | null;
  onClose: () => void;
  onToggleTaken: (id: string) => void;
}

export function MedicineDetailDrawer({
  medicine,
  onClose,
  onToggleTaken,
}: MedicineDetailDrawerProps) {
  if (!medicine) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
              style={{ backgroundColor: medicine.pillColor || "#0d9488" }}
            >
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800 inline-block mb-1">
                {medicine.timeSlot} • {medicine.time}
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {medicine.name}
              </h2>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                {medicine.simpleName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close medicine details"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-slate-800 dark:text-slate-200">
          {/* Status Bar */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              medicine.isTaken
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200"
                : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {medicine.isTaken ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block">
                  Current Status
                </span>
                <span className="text-base font-extrabold">
                  {medicine.isTaken ? "Completed for Today ✓" : `Scheduled for ${medicine.time}`}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleTaken(medicine.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs ${
                medicine.isTaken
                  ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {medicine.isTaken ? "Mark as Not Taken" : "Mark as Taken"}
            </button>
          </div>

          {/* 1. What is it for? */}
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              What is it for?
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {medicine.purpose}
              </p>
            </div>
          </div>

          {/* 2. When to take it? */}
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              When to take it?
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {medicine.whenToTake}
              </p>
            </div>
          </div>

          {/* 3. Dosage & Pill Appearance */}
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Dosage & What It Looks Like
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Strength:</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{medicine.dosage}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Appearance:</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{medicine.pillDescription}</span>
              </div>
            </div>
          </div>

          {/* 4. Doctor Instructions */}
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Doctor Instructions
            </h3>
            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
              <p className="text-sm font-bold text-teal-950 dark:text-teal-200 leading-relaxed">
                &ldquo;{medicine.doctorInstructions}&rdquo;
              </p>
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-300 block mt-2">
                — {medicine.doctorName}
              </span>
            </div>
          </div>

          {/* 5. Safety Information */}
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Safety Information
            </h3>
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
              {medicine.safetyInfo.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-200 font-semibold leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                    ✓
                  </span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Common things to be aware of */}
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Common Things to be Aware Of
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-start gap-2">
                <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                <span>If you feel mild dizziness when standing up, pause and rest for 30 seconds.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                <span>Keep your medicines in a cool, dry place away from the bathroom cabinet humidity.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
                <span>Call Dr. Sharma&apos;s clinic if you ever notice new or unexpected symptoms.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            MedGuard Patient Care Assistant
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer btn-press"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
