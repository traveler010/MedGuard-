"use client";

import React, { useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Bell,
  BellRing,
  RotateCcw,
  ChevronRight,
  Pill,
  Sparkles,
  Info,
  Calendar,
} from "lucide-react";
import { PatientMedicineDetail } from "./MedicineDetailDrawer";

interface TodayScheduleListProps {
  medicines: PatientMedicineDetail[];
  onToggleTaken: (id: string) => void;
  onOpenDetails: (medicine: PatientMedicineDetail) => void;
  onSetReminder: (medicine: PatientMedicineDetail) => void;
}

export function TodayScheduleList({
  medicines,
  onToggleTaken,
  onOpenDetails,
  onSetReminder,
}: TodayScheduleListProps) {
  // State for tracking animating card id
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const handleMarkTaken = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimatingId(id);
    setTimeout(() => {
      onToggleTaken(id);
      setAnimatingId(null);
    }, 400);
  };

  const handleUndo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleTaken(id);
  };

  const handleReminderClick = (med: PatientMedicineDetail, e: React.MouseEvent) => {
    e.stopPropagation();
    onSetReminder(med);
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
            Daily Routine
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Today&apos;s Schedule
          </h3>
        </div>
        <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
          Click any medicine to view instructions & safety details
        </span>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-4">
        {medicines.map((med) => {
          const isTaken = med.isTaken;
          const isAnimating = animatingId === med.id;

          return (
            <div
              key={med.id}
              onClick={() => onOpenDetails(med)}
              className={`rounded-3xl border-2 p-5 sm:p-6 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs hover:shadow-md ${
                isTaken
                  ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300/80 dark:border-emerald-800/80 hover:border-emerald-400 dark:hover:border-emerald-700"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 hover:-translate-y-0.5"
              } ${isAnimating ? "scale-[0.98] ring-4 ring-emerald-400" : ""}`}
            >
              {/* Left Column: Time & Status Badge */}
              <div className="flex items-start sm:items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-mono shrink-0 shadow-xs border ${
                    isTaken
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-80">
                    {med.timeSlot}
                  </span>
                  <span className="text-sm font-black tracking-tight">
                    {med.time.split(" ")[0]}
                  </span>
                  <span className="text-[10px] font-bold">
                    {med.time.split(" ")[1]}
                  </span>
                </div>

                {/* Medicine Information */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        isTaken
                          ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                          : "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                      }`}
                    >
                      {isTaken ? "✓ Taken" : "○ Upcoming"}
                    </span>

                    <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                      {med.dosage}
                    </span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {med.name}
                  </h4>

                  {/* Purpose in plain English */}
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                    {med.purpose}
                  </p>
                </div>
              </div>

              {/* Right Column: Interactive Action Controls */}
              <div className="flex flex-wrap items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200/70 dark:border-slate-800 justify-end shrink-0">
                {/* 1. Reminder Button */}
                <button
                  type="button"
                  onClick={(e) => handleReminderClick(med, e)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Set Reminder Alert"
                >
                  <Bell className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span className="hidden sm:inline">Remind Me</span>
                </button>

                {/* 2. Mark as Taken Button or Undo Button */}
                {isTaken ? (
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Taken</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleUndo(med.id, e)}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Undo status"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Undo</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleMarkTaken(med.id, e)}
                    disabled={isAnimating}
                    className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-emerald-600/30 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    <span>Mark as Taken</span>
                  </button>
                )}

                {/* Arrow indicator for opening details */}
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
