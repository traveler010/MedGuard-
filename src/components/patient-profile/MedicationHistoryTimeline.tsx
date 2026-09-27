"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  Edit,
  MinusCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Calendar,
  User,
  Filter,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { MedicationTimelineEvent, TimelineEventType } from "@/data/mockPatientTimeline";

interface MedicationHistoryTimelineProps {
  events: MedicationTimelineEvent[];
}

export function MedicationHistoryTimeline({ events }: MedicationHistoryTimelineProps) {
  const [filterType, setFilterType] = useState<"ALL" | TimelineEventType>("ALL");

  const filteredEvents = events.filter((e) => {
    if (filterType === "ALL") return true;
    return e.type === filterType;
  });

  const getEventIcon = (type: TimelineEventType) => {
    switch (type) {
      case "added":
        return <PlusCircle className="w-4 h-4 text-emerald-600" />;
      case "changed":
        return <Edit className="w-4 h-4 text-blue-600" />;
      case "discontinued":
        return <MinusCircle className="w-4 h-4 text-rose-600" />;
      case "risk_detected":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "updated":
        return <RefreshCw className="w-4 h-4 text-purple-600" />;
    }
  };

  const getEventBadgeStyle = (type: TimelineEventType) => {
    switch (type) {
      case "added":
        return "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "changed":
        return "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "discontinued":
        return "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "risk_detected":
        return "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "updated":
        return "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    }
  };

  return (
    <div id="medication-history-section" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Medication History Timeline</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chronological log of prescription modifications, titrations, and risk detections
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
              filterType === "ALL"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All Logs ({events.length})
          </button>
          <button
            onClick={() => setFilterType("risk_detected")}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
              filterType === "risk_detected"
                ? "bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 shadow-2xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            Risks
          </button>
          <button
            onClick={() => setFilterType("added")}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
              filterType === "added"
                ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-2xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Added
          </button>
          <button
            onClick={() => setFilterType("changed")}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
              filterType === "changed"
                ? "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-2xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Changed
          </button>
          <button
            onClick={() => setFilterType("discontinued")}
            className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
              filterType === "discontinued"
                ? "bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-400 shadow-2xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Discontinued
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {filteredEvents.map((evt) => {
          return (
            <div key={evt.id} className="relative group">
              {/* Timeline Node Icon */}
              <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 group-hover:border-teal-500 flex items-center justify-center shadow-xs transition-colors">
                {getEventIcon(evt.type)}
              </div>

              {/* Event Content Card */}
              <div className="bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 transition-all hover:shadow-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getEventBadgeStyle(
                        evt.type
                      )}`}
                    >
                      {evt.badgeText}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {evt.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{evt.date}</span>
                    <span>({evt.relativeTime})</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {evt.description}
                </p>

                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-medium">
                    Target Agent: <strong className="text-slate-700 dark:text-slate-200">{evt.medicationName}</strong>
                    {evt.dosage && ` • Dosage: ${evt.dosage}`}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    Authorized by: <strong className="text-slate-700 dark:text-slate-200">{evt.prescriber}</strong>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
