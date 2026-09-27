"use client";

import React from "react";
import {
  Calendar,
  Pill,
  Activity,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Patient } from "@/data/mockPatients";
import { RiskBadge } from "@/components/RiskBadge";

interface PatientSummaryCardsProps {
  patient: Patient;
}

export function PatientSummaryCards({ patient }: PatientSummaryCardsProps) {
  const activeMedsCount = patient.medications.filter((m) => m.isActive).length;
  const beersCount = patient.medications.filter((m) => m.beersCriteriaFlag).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Age Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Patient Age
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">
            {patient.age} <span className="text-xs font-semibold text-slate-400">years old</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            DOB: <strong className="text-slate-700 dark:text-slate-300">{patient.dob}</strong>
          </p>
        </div>
      </div>

      {/* 2. Active Medicines */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Medicines
          </span>
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Pill className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">
            {activeMedsCount} <span className="text-xs font-semibold text-slate-400">prescriptions</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            {beersCount > 0 ? (
              <span className="text-rose-600 dark:text-rose-400 font-semibold inline-flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {beersCount} Beers Alert{beersCount > 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">All standard Beers-compliant</span>
            )}
          </p>
        </div>
      </div>

      {/* 3. Medical Conditions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Medical Conditions
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">
            {patient.diagnoses.length} <span className="text-xs font-semibold text-slate-400">diagnoses</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
            {patient.diagnoses.slice(0, 2).join(", ")}
            {patient.diagnoses.length > 2 && "..."}
          </p>
        </div>
      </div>

      {/* 4. Current Risk Level */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Current Risk Level
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              patient.riskLevel === "HIGH"
                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                : patient.riskLevel === "MODERATE"
                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">
              {patient.polypharmacyScore}
              <span className="text-xs font-semibold text-slate-400">/100</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Polypharmacy Score</p>
          </div>
          <RiskBadge level={patient.riskLevel} size="md" />
        </div>
      </div>
    </div>
  );
}
