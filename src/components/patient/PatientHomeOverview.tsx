"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  Pill,
  Bell,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Heart,
  Info,
  Calendar,
  Sparkles,
} from "lucide-react";
import { PatientMedicineDetail } from "./MedicineDetailDrawer";

interface PatientHomeOverviewProps {
  medicines: PatientMedicineDetail[];
  onToggleTaken: (id: string) => void;
  onOpenDetails: (medicine: PatientMedicineDetail) => void;
  onRemindLater?: (id: string) => void;
}

export function PatientHomeOverview({
  medicines,
  onToggleTaken,
  onOpenDetails,
  onRemindLater,
}: PatientHomeOverviewProps) {
  const completedCount = medicines.filter((m) => m.isTaken).length;
  const totalCount = medicines.length;
  const nextUpcomingMed = medicines.find((m) => !m.isTaken);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ─────────────────────────────────────────────────────────────
          1. CALM PROGRESS BANNER
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Daily Care Progress
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {completedCount === totalCount
                ? "All medicines taken for today!"
                : `${completedCount} of ${totalCount} doses taken today`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {completedCount === totalCount
                ? "Great job maintaining your routine. Have a wonderful evening."
                : "You are doing great maintaining your medication routine."}
            </p>
          </div>

          {/* Simple Progress Bar & Indicator */}
          <div className="w-full sm:w-56 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-500 dark:text-slate-400">Today&apos;s Progress</span>
              <span className="text-teal-700 dark:text-teal-400 font-mono">
                {Math.round((completedCount / (totalCount || 1)) * 100)}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-teal-600 dark:bg-teal-500 rounded-full transition-all duration-500"
                style={{
                  width: `${(completedCount / (totalCount || 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Next Dose Callout */}
        {nextUpcomingMed && (
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-teal-50/50 dark:bg-teal-950/20 -mx-6 -mb-6 p-5 sm:px-7 rounded-b-3xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 flex items-center justify-center font-bold text-xs shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 dark:text-teal-300 block">
                  Upcoming Next
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {nextUpcomingMed.simpleName} at {nextUpcomingMed.time}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {onRemindLater && (
                <button
                  onClick={() => onRemindLater(nextUpcomingMed.id)}
                  className="px-3.5 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-200 text-xs font-bold hover:bg-teal-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                >
                  Remind Later
                </button>
              )}
              <button
                onClick={() => onToggleTaken(nextUpcomingMed.id)}
                className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Mark as Taken
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. TODAY'S MEDICATIONS (Clean, spacious, minimal)
          ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Today&apos;s Medications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear schedule for Saturday, September 26
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {totalCount} Total Prescriptions
          </span>
        </div>

        <div className="space-y-3.5">
          {medicines.map((med) => {
            const isTaken = med.isTaken;

            return (
              <div
                key={med.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isTaken
                    ? "bg-slate-50/70 dark:bg-slate-850/60 border-slate-200/80 dark:border-slate-800"
                    : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 shadow-xs"
                }`}
              >
                {/* Medicine info & time */}
                <div className="flex items-start sm:items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: med.pillColor || "#0d9488" }}
                  >
                    <Pill className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                        {med.simpleName}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        ({med.name.split(" ")[0]})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {med.time}
                      </span>
                      <span>•</span>
                      <span>{med.dosage}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Status badge & simple actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  {/* Status Badge */}
                  <div>
                    {isTaken ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Taken
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Upcoming
                      </span>
                    )}
                  </div>

                  {/* Toggle taken / undo button */}
                  {isTaken ? (
                    <button
                      type="button"
                      onClick={() => onToggleTaken(med.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Undo"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Undo</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleTaken(med.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                    >
                      Mark as Taken
                    </button>
                  )}

                  {/* Medicine Details action */}
                  <button
                    type="button"
                    onClick={() => onOpenDetails(med)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="View instructions & details"
                    aria-label={`View details for ${med.simpleName}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SIMPLE INSTRUCTIONS & SAFETY ALERT (No medical jargon)
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Simple Medication Instructions */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            <Info className="w-4 h-4" />
            <span>Daily Care Instructions</span>
          </div>

          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            Helpful Reminders from Dr. Sharma
          </h4>

          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span>Take your morning tablet with a full glass of water at 8:00 AM.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span>Always sit down for a minute when taking evening blood pressure pills.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold">•</span>
              <span>Never double up on pills if you take a dose later than scheduled.</span>
            </li>
          </ul>
        </div>

        {/* Important Plain-Language Safety Alert */}
        <div className="bg-amber-50/60 dark:bg-amber-950/20 rounded-3xl border border-amber-200/80 dark:border-amber-800/60 p-6 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Important Safety Note</span>
          </div>

          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            Over-the-Counter Pain Relievers
          </h4>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Because you take a blood thinner, please <strong>avoid Aspirin, Advil, or Ibuprofen</strong>. If you have any aches, you can safely use your prescribed Joint Pain Tablet (Acetaminophen).
          </p>

          <div className="pt-1">
            <button
              onClick={() => {
                const painMed = medicines.find((m) => m.id === "med-b");
                if (painMed) onOpenDetails(painMed);
              }}
              className="text-xs font-bold text-amber-900 dark:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Pain Medicine Safety Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
