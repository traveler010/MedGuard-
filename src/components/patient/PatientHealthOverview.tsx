"use client";

import React from "react";
import {
  Activity,
  Heart,
  Droplets,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Calendar,
  ChevronRight,
} from "lucide-react";

export interface HealthMetric {
  id: string;
  name: string;
  value: string;
  unit?: string;
  status: "Normal" | "Optimal" | "Monitored" | "Attention";
  statusColor: string; // Tailwind class
  icon: React.ElementType;
}

interface PatientHealthOverviewProps {
  patientName?: string;
  patientAge?: number;
  hasReport?: boolean;
  onUploadReport?: () => void;
  onToggleSampleReport?: () => void;
}

export function PatientHealthOverview({
  patientName = "Raj Kumar",
  patientAge = 68,
  hasReport = true,
  onUploadReport,
  onToggleSampleReport,
}: PatientHealthOverviewProps) {
  const metrics: HealthMetric[] = [
    {
      id: "bp",
      name: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      status: "Optimal",
      statusColor: "bg-emerald-500",
      icon: Activity,
    },
    {
      id: "haemo",
      name: "Haemoglobin",
      value: "13.2",
      unit: "g/dL",
      status: "Normal",
      statusColor: "bg-emerald-500",
      icon: Droplets,
    },
    {
      id: "bloodCount",
      name: "Blood Count",
      value: "Normal",
      unit: "(6.4 ×10⁹/L)",
      status: "Normal",
      statusColor: "bg-emerald-500",
      icon: Heart,
    },
    {
      id: "glucose",
      name: "Fasting Glucose",
      value: "98",
      unit: "mg/dL",
      status: "Normal",
      statusColor: "bg-emerald-500",
      icon: Droplets,
    },
    {
      id: "egfr",
      name: "Kidney eGFR",
      value: "58",
      unit: "mL/min",
      status: "Monitored",
      statusColor: "bg-amber-500",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar with Patient Identity & Report Source */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-1">
            Patient Overview
          </span>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {patientName}
            </h1>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {patientAge} yrs
            </span>
          </div>
        </div>

        {/* Quick report status / Demo toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {hasReport ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/80">
                <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Lab Report: Sep 2026</span>
              </span>
              {onToggleSampleReport && (
                <button
                  onClick={onToggleSampleReport}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline cursor-pointer"
                  title="Test empty state"
                >
                  Clear Report
                </button>
              )}
            </div>
          ) : (
            onToggleSampleReport && (
              <button
                onClick={onToggleSampleReport}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 underline cursor-pointer"
              >
                Restore Demo Report
              </button>
            )
          )}
        </div>
      </div>

      {/* HEALTH VALUES DISPLAY OR CLEAN EMPTY STATE */}
      {!hasReport ? (
        /* Clean Empty State as requested */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              No recent medical report
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Upload your latest lab results or health checkup summary to populate your health overview.
            </p>
          </div>

          <button
            onClick={onUploadReport}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer btn-press"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Report</span>
          </button>
        </div>
      ) : (
        /* Compact Health Cards with Large Readable Values & Small Status Indicator */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                >
                  {/* Metric Name & Status Indicator */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {metric.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${metric.statusColor}`} />
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        {metric.status}
                      </span>
                    </div>
                  </div>

                  {/* Large Readable Value */}
                  <div className="space-y-0.5">
                    <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                      {metric.value}
                    </div>
                    {metric.unit && (
                      <span className="text-xs font-semibold text-slate-400">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Quick Upload / Refresh Card */}
            <div
              onClick={onUploadReport}
              className="bg-slate-50/70 dark:bg-slate-850/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-center items-center text-center space-y-2 hover:border-teal-400 dark:hover:border-teal-600 transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors shadow-2xs">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-300">
                Update or Add Lab Report
              </span>
              <span className="text-[11px] text-slate-400">
                Supports PDF or photo
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
