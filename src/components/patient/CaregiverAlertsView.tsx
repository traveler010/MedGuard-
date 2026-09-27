"use client";

import React from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  Info,
  Calendar,
} from "lucide-react";

export function CaregiverAlertsView() {
  const alerts = [
    {
      id: "alt-1",
      title: "Doctor Updated Your Pain Relief Medicine",
      date: "Today, 10:15 AM",
      doctor: "Dr. Sharma, MD",
      type: "success",
      message:
        "Dr. Sharma reviewed your knee arthritis pain medicine. To keep your blood thinner safe and protect your stomach, your prescription was safely updated to Acetaminophen (Tylenol 500mg).",
      action: "Safe to take as prescribed",
    },
    {
      id: "alt-2",
      title: "Upcoming Kidney & Blood Test",
      date: "Next Thursday, Oct 1",
      doctor: "Dr. Sharma's Clinic",
      type: "info",
      message:
        "Routine check-up to ensure your blood levels and kidney numbers stay in optimal condition.",
      action: "No fasting required",
    },
    {
      id: "alt-3",
      title: "Warfarin INR Lab Target Achieved",
      date: "Last Tuesday",
      doctor: "Anticoagulation Clinic",
      type: "success",
      message:
        "Your recent blood clotting test was right in the healthy green target range (INR 2.4). Keep taking your 4mg tablet at 6:00 PM.",
      action: "Maintain current evening schedule",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-1">
        <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
          Safety Notifications
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Caregiver & Patient Alerts
        </h2>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Important updates from your doctor and medication safety checks.
        </p>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {alert.title}
                  </h3>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                    {alert.date} • {alert.doctor}
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                {alert.action}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {alert.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
