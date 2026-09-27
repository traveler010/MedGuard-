"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  Pill,
  Sparkles,
  Calendar,
  AlertCircle,
  ThumbsUp,
} from "lucide-react";

interface TodayMedicationCardProps {
  totalCount: number;
  completedCount: number;
  upcomingCount: number;
  remainingCount: number;
}

export function TodayMedicationCard({
  totalCount = 3,
  completedCount = 1,
  upcomingCount = 1,
  remainingCount = 1,
}: TodayMedicationCardProps) {
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllDone = completedCount === totalCount && totalCount > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Title & Encouragement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
            Daily Progress Tracker
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Today&apos;s Medication
          </h2>
        </div>

        {/* Motivational Status Pill */}
        <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 px-4 py-2 rounded-2xl self-start sm:self-auto">
          <ThumbsUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span className="text-sm font-bold text-teal-950 dark:text-teal-200">
            {isAllDone
              ? "All done for today! Fantastic job! 🎉"
              : `${completedCount} of ${totalCount} doses taken today`}
          </span>
        </div>
      </div>

      {/* 4 Large Highlight Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Medicines */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
            {totalCount}
          </div>
          <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <Pill className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>Total Medicines</span>
          </div>
        </div>

        {/* Completed */}
        <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 text-center space-y-1 shadow-xs">
          <div className="text-3xl sm:text-4xl font-black text-emerald-800 dark:text-emerald-300 font-mono">
            {completedCount}
          </div>
          <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Completed</span>
          </div>
        </div>

        {/* Upcoming */}
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 text-center space-y-1 shadow-xs">
          <div className="text-3xl sm:text-4xl font-black text-amber-800 dark:text-amber-300 font-mono">
            {upcomingCount}
          </div>
          <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-amber-800 dark:text-amber-300 flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Upcoming Next</span>
          </div>
        </div>

        {/* Remaining */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-1">
          <div className="text-3xl sm:text-4xl font-black text-slate-700 dark:text-slate-300 font-mono">
            {remainingCount}
          </div>
          <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>Remaining Later</span>
          </div>
        </div>
      </div>

      {/* High-Contrast Visual Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
          <span>Today&apos;s Medication Adherence</span>
          <span className="font-mono text-teal-800 dark:text-teal-300 font-extrabold text-base">
            {percentComplete}% Completed
          </span>
        </div>
        <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>
    </div>
  );
}
