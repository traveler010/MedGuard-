"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Heart,
  User,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { NotificationDropdown } from "@/components/reminders-alerts/NotificationDropdown";
import { ThemeToggle } from "@/components/ThemeToggle";

interface PatientCareHeaderProps {
  patientName?: string;
  todayDateText?: string;
  completedDoses?: number;
  totalDoses?: number;
  onSignOut?: () => void;
  onSwitchToDoctor?: () => void;
}

export function PatientCareHeader({
  patientName = "Raj",
  todayDateText = "Saturday, September 26, 2026",
  completedDoses = 1,
  totalDoses = 3,
  onSignOut,
  onSwitchToDoctor,
}: PatientCareHeaderProps) {
  const isAllComplete = completedDoses === totalDoses && totalDoses > 0;

  return (
    <header className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4 transition-colors">
      {/* Top Utility Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="text-slate-900 dark:text-white font-extrabold">{todayDateText}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <NotificationDropdown initialRole="patient" allowRoleSwitch={true} />

          {onSwitchToDoctor && (
            <button
              onClick={onSwitchToDoctor}
              className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor View</span>
            </button>
          )}

          {onSignOut && (
            <button
              onClick={onSignOut}
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Greeting & Status Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Good morning, {patientName} 👋
          </h1>
          <p className="text-sm sm:text-base font-bold text-slate-600 dark:text-slate-400">
            Welcome to your simple daily health & medication guide.
          </p>
        </div>

        {/* Overall Medication Status Badge */}
        <div
          className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 shrink-0 transition-colors ${
            isAllComplete
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200"
              : "bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800/80 text-teal-950 dark:text-teal-200"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-xs ${
              isAllComplete ? "bg-emerald-600" : "bg-teal-600"
            }`}
          >
            {isAllComplete ? (
              <CheckCircle2 className="w-6 h-6 stroke-[3]" />
            ) : (
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            )}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider block opacity-70">
              Overall Medication Status
            </span>
            <div className="text-base font-black leading-snug">
              {isAllComplete
                ? "All Medicines Taken! Great Job 🎉"
                : `${completedDoses} of ${totalDoses} doses taken today`}
            </div>
            <span className="text-xs font-bold opacity-80">
              {isAllComplete ? "Protected for the day" : "You're on track! 👍"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
