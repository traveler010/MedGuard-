"use client";

import React from "react";
import {
  Pill,
  Clock,
  ShieldCheck,
  ChevronRight,
  Info,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { PatientMedicineDetail } from "./MedicineDetailDrawer";

interface MyMedicinesViewProps {
  medicines: PatientMedicineDetail[];
  onOpenDetails: (med: PatientMedicineDetail) => void;
}

export function MyMedicinesView({
  medicines,
  onOpenDetails,
}: MyMedicinesViewProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-1">
        <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
          Medicine Cabinet
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          My Active Medicines
        </h2>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          All regular medications prescribed by your healthcare team for your daily health.
        </p>
      </div>

      {/* Grid of Medicines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {medicines.map((med) => (
          <div
            key={med.id}
            onClick={() => onOpenDetails(med)}
            className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: med.pillColor }}
                >
                  <Pill className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {med.timeSlot}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                  {med.name}
                </h3>
                <span className="text-xs font-bold text-teal-700 dark:text-teal-400 block">
                  {med.simpleName}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                {med.dosage} • {med.time}
              </div>

              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                {med.purpose}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-400">
              <span>View full instructions</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
