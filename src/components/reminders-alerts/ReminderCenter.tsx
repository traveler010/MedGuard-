"use client";

import React, { useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Bell,
  BellRing,
  RotateCcw,
  Pill,
  AlertTriangle,
  Sparkles,
  Calendar,
  ChevronRight,
  ArrowRight,
  AlarmClock,
} from "lucide-react";
import {
  MedicationReminderItem,
  ReminderStatus,
} from "@/data/mockRemindersAndAlerts";

interface ReminderCenterProps {
  reminders: MedicationReminderItem[];
  onTakeNow: (id: string) => void;
  onRemindLater: (id: string, snoozeMinutes?: number) => void;
  onUndoTake: (id: string) => void;
}

export function ReminderCenter({
  reminders,
  onTakeNow,
  onRemindLater,
  onUndoTake,
}: ReminderCenterProps) {
  const [activeTab, setActiveTab] = useState<ReminderStatus>("upcoming");
  const [snoozingId, setSnoozingId] = useState<string | null>(null);

  // Tab counts
  const upcomingReminders = reminders.filter((r) => r.status === "upcoming");
  const completedReminders = reminders.filter((r) => r.status === "completed");
  const missedReminders = reminders.filter((r) => r.status === "missed");

  const displayedList =
    activeTab === "upcoming"
      ? upcomingReminders
      : activeTab === "completed"
      ? completedReminders
      : missedReminders;

  const handleSnoozeSelect = (id: string, minutes: number) => {
    onRemindLater(id, minutes);
    setSnoozingId(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header & Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
            Adherence Assistant
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Reminder Center
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            Never miss a dose with clear audio reminders and easy one-tap recording.
          </p>
        </div>

        {/* 3 Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          {/* Tab 1: Upcoming */}
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "upcoming"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Upcoming</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "upcoming"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {upcomingReminders.length}
            </span>
          </button>

          {/* Tab 2: Completed */}
          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "completed"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Completed</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "completed"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {completedReminders.length}
            </span>
          </button>

          {/* Tab 3: Missed */}
          <button
            type="button"
            onClick={() => setActiveTab("missed")}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "missed"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Missed</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === "missed"
                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300"
                  : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {missedReminders.length}
            </span>
          </button>
        </div>
      </div>

      {/* Reminder Cards List */}
      <div className="space-y-4">
        {displayedList.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              No {activeTab} reminders right now!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeTab === "upcoming"
                ? "You have taken all pending doses for this time window."
                : activeTab === "completed"
                ? "Take your upcoming medicine to see it logged here."
                : "Great job! Zero missed medications recorded."}
            </p>
          </div>
        ) : (
          displayedList.map((item) => {
            const isUpcoming = item.status === "upcoming";
            const isCompleted = item.status === "completed";
            const isMissed = item.status === "missed";
            const isSnoozing = snoozingId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-3xl border-2 p-5 sm:p-6 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs ${
                  isCompleted
                    ? "bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80"
                    : isMissed
                    ? "bg-rose-50/40 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/80"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500"
                }`}
              >
                {/* Left Side: Time and Medicine Details */}
                <div className="flex items-start sm:items-center gap-4">
                  {/* Time Badge */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-mono shrink-0 shadow-xs border ${
                      isCompleted
                        ? "bg-emerald-600 text-white border-emerald-500"
                        : isMissed
                        ? "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800"
                        : "bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
                    }`}
                  >
                    <AlarmClock className="w-4 h-4 mb-0.5 opacity-80" />
                    <span className="text-sm font-black tracking-tight leading-none">
                      {item.time.split(" ")[0]}
                    </span>
                    <span className="text-[10px] font-bold">
                      {item.time.split(" ")[1]}
                    </span>
                  </div>

                  {/* Medicine Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                        {item.medicineName}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                        {item.dosage}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-teal-800 dark:text-teal-400">
                      {item.simpleDescription}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {item.instructions}
                    </p>

                    {item.snoozedUntil && (
                      <span className="inline-block text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 rounded-md mt-1">
                        🔔 Snoozed until {item.snoozedUntil}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side: Action Buttons Required by Prompt: [Take Now] [Remind Me Later] */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
                  {isUpcoming && (
                    <>
                      {/* [Take Now] Button */}
                      <button
                        type="button"
                        onClick={() => onTakeNow(item.id)}
                        className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                        <span>Take Now</span>
                      </button>

                      {/* [Remind Me Later] Button */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setSnoozingId(isSnoozing ? null : item.id)}
                          className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <BellRing className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>Remind Me Later</span>
                        </button>

                        {/* Snooze Options Popup */}
                        {isSnoozing && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl z-20 p-2 space-y-1 animate-in zoom-in-95 duration-150">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block py-1">
                              Snooze Reminder For:
                            </span>
                            <button
                              onClick={() => handleSnoozeSelect(item.id, 15)}
                              className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-900 dark:hover:text-teal-300 transition-colors"
                            >
                              15 Minutes
                            </button>
                            <button
                              onClick={() => handleSnoozeSelect(item.id, 30)}
                              className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-900 dark:hover:text-teal-300 transition-colors"
                            >
                              30 Minutes
                            </button>
                            <button
                              onClick={() => handleSnoozeSelect(item.id, 60)}
                              className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-900 dark:hover:text-teal-300 transition-colors"
                            >
                              1 Hour
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {isCompleted && (
                    <div className="flex items-center gap-2">
                      <div className="px-4 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Completed ✓</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onUndoTake(item.id)}
                        className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Undo completion status"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Undo</span>
                      </button>
                    </div>
                  )}

                  {isMissed && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onTakeNow(item.id)}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Take Missed Dose</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
