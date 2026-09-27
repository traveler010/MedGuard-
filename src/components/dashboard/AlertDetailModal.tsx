"use client";

import React from "react";
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  User,
  ShieldAlert,
  ArrowRight,
  FileCheck,
  Stethoscope,
} from "lucide-react";
import { RecentAlertItem } from "@/data/mockPatients";

interface AlertDetailModalProps {
  alert: RecentAlertItem | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchPatient?: (patientName: string) => void;
}

export default function AlertDetailModal({
  alert,
  isOpen,
  onClose,
  onLaunchPatient,
}: AlertDetailModalProps) {
  if (!isOpen || !alert) return null;

  const getSeverityBadge = (severity: RecentAlertItem["severity"]) => {
    switch (severity) {
      case "HIGH":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
          titleColor: "text-rose-950",
          banner: "bg-rose-500",
        };
      case "MODERATE":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          titleColor: "text-amber-950",
          banner: "bg-amber-500",
        };
      case "LOW":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          titleColor: "text-emerald-950",
          banner: "bg-emerald-500",
        };
    }
  };

  const badge = getSeverityBadge(alert.severity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Top Banner Accent */}
        <div className={`h-1.5 w-full ${badge.banner}`} />

        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${badge.bg}`}
            >
              {badge.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.bg}`}
                >
                  {alert.severity} PRIORITY
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {alert.timestamp}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">{alert.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-sm">
          {/* Patient Card */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                {alert.patientName.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Assigned Patient</p>
                <p className="text-sm font-bold text-slate-900">{alert.patientName}</p>
              </div>
            </div>
            <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
              MRN {alert.patientMrn}
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Clinical Assessment
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
              {alert.description}
            </p>
          </div>

          {/* Recommended Action */}
          <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/70">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-xs mb-1">
              <ShieldAlert className="w-4 h-4 text-teal-600" />
              Action Protocol
            </div>
            <p className="text-xs text-teal-900 font-medium leading-relaxed">
              {alert.recommendedAction}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>

          {onLaunchPatient && (
            <button
              onClick={() => {
                onClose();
                onLaunchPatient(alert.patientName);
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              Open Consultation Cockpit
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
