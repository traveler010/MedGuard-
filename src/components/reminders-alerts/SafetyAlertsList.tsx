"use client";

import React from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldCheck,
  Check,
  Phone,
  ArrowRight,
} from "lucide-react";
import { PatientSafetyAlert } from "@/data/mockRemindersAndAlerts";

interface SafetyAlertsListProps {
  alerts: PatientSafetyAlert[];
  onAcknowledgeAlert?: (id: string) => void;
}

export function SafetyAlertsList({
  alerts,
  onAcknowledgeAlert,
}: SafetyAlertsListProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
            Health & Safety Notices
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Safety Alerts
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            Important updates from your doctor explained in clear, simple language.
          </p>
        </div>

        {/* Level Legend */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            High
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Moderate
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-100 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            Low
          </span>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const isHigh = alert.level === "HIGH";
          const isMod = alert.level === "MODERATE";
          const isLow = alert.level === "LOW";

          return (
            <div
              key={alert.id}
              className={`rounded-3xl border-2 p-5 sm:p-6 transition-all duration-200 space-y-4 shadow-xs ${
                isHigh
                  ? "bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800/80"
                  : isMod
                  ? "bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80"
                  : "bg-teal-50/40 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800/80"
              }`}
            >
              {/* Top Row: Icon, Level Badge, and Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-xs shrink-0 ${
                      isHigh
                        ? "bg-rose-100 dark:bg-rose-900/50 border-rose-200 dark:border-rose-700 text-rose-600 dark:text-rose-300"
                        : isMod
                        ? "bg-amber-100 dark:bg-amber-900/50 border-amber-200 dark:border-amber-700 text-amber-600 dark:text-amber-300"
                        : "bg-teal-100 dark:bg-teal-900/50 border-teal-200 dark:border-teal-700 text-teal-600 dark:text-teal-300"
                    }`}
                  >
                    {isHigh ? (
                      <ShieldAlert className="w-6 h-6" />
                    ) : isMod ? (
                      <AlertTriangle className="w-6 h-6" />
                    ) : (
                      <Info className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.2 rounded-full border tracking-wider ${
                          isHigh
                            ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                            : isMod
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                            : "bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800"
                        }`}
                      >
                        {alert.level} Priority Alert
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        {alert.timestamp}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                      {alert.title}
                    </h3>
                  </div>
                </div>

                {alert.isAcknowledged && (
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1 self-start sm:self-auto">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Acknowledged
                  </span>
                )}
              </div>

              {/* Simple Patient Message (Free from clinical jargon) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed shadow-2xs">
                {alert.simpleMessage}
              </div>

              {/* Bottom Action Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span className="text-teal-700 dark:text-teal-400">Recommended action:</span>
                  <span>{alert.recommendedAction}</span>
                </div>

                <div className="flex items-center gap-2">
                  {!alert.isAcknowledged && onAcknowledgeAlert && (
                    <button
                      type="button"
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>I Understand</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
