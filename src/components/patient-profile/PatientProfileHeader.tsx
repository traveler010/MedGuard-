"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Stethoscope,
  Plus,
  History,
  ShieldAlert,
  User,
  Calendar,
  FileCheck2,
} from "lucide-react";
import { Patient } from "@/data/mockPatients";

interface PatientProfileHeaderProps {
  patient: Patient;
  onNewConsultation: () => void;
  onAddMedication: () => void;
  onViewHistory: () => void;
}

export function PatientProfileHeader({
  patient,
  onNewConsultation,
  onAddMedication,
  onViewHistory,
}: PatientProfileHeaderProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
      {/* Top Breadcrumb & Return Link */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <Link
          href="/doctor/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctor Dashboard</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>Last clinical review: <strong>{patient.lastReviewDate}</strong></span>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white shadow-md ${
              patient.riskLevel === "HIGH"
                ? "bg-gradient-to-br from-rose-500 to-rose-700 shadow-rose-500/20"
                : patient.riskLevel === "MODERATE"
                ? "bg-gradient-to-br from-amber-500 to-amber-700 shadow-amber-500/20"
                : "bg-gradient-to-br from-emerald-500 to-teal-700 shadow-teal-500/20"
            }`}
          >
            {patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {patient.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {patient.gender}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                {patient.age} years old
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Patient ID: <strong className="font-mono text-slate-800 dark:text-slate-200">{patient.mrn}</strong></span>
              <span>•</span>
              <span>DOB: <strong className="text-slate-700 dark:text-slate-300">{patient.dob}</strong></span>
              <span>•</span>
              <span>Primary: <strong className="text-slate-700 dark:text-slate-300">{patient.primaryDoctor}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onViewHistory}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>View History</span>
          </button>

          <button
            onClick={onAddMedication}
            className="px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Add Medication</span>
          </button>

          <button
            onClick={onNewConsultation}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shadow-teal-600/20 cursor-pointer"
          >
            <Stethoscope className="w-4 h-4 text-white" />
            <span>New Consultation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
