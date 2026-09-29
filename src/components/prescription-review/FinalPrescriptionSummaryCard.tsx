"use client";

import React from "react";
import Link from "next/link";
import {
  FileCheck2,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  Trash2,
  User,
  Pill,
  Clock,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface FinalPrescriptionSummaryCardProps {
  patientName: string;
  patientAge: number;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  overallRisk: "HIGH" | "MODERATE" | "LOW";
  recommendation: string;
  onApproveDecision: () => void;
  onModifyDecision: () => void;
  onRemoveDecision: () => void;
  onConfirmPrescription: () => void;
  onBackToAnalysis: () => void;
  isRemoved?: boolean;
}

export function FinalPrescriptionSummaryCard({
  patientName = "Raj Kumar",
  patientAge = 68,
  patientId = "#QX-94108",
  medication = "Acetaminophen (Tylenol)",
  dosage = "500 mg",
  frequency = "Every 6 hours as needed (PRN)",
  duration = "5 Days",
  overallRisk = "LOW",
  recommendation = "Safe for co-administration with Warfarin. Cap total daily dose at 2,000 mg to prevent hepatic overload.",
  onApproveDecision,
  onModifyDecision,
  onRemoveDecision,
  onConfirmPrescription,
  onBackToAnalysis,
  isRemoved = false,
}: FinalPrescriptionSummaryCardProps) {
  const isHigh = overallRisk === "HIGH";
  const isLow = overallRisk === "LOW";

  return (
    <div className="space-y-6">
      {/* 1. DOCTOR DECISION SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
              Doctor Decision
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Select Clinical Decision
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Requires clinical review before finalizing
          </span>
        </div>

        {/* 3 Decision Option Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {/* Option 1: Approve / Continue */}
          <button
            type="button"
            onClick={onApproveDecision}
            className="p-4 rounded-2xl border-2 border-teal-500 dark:border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 hover:bg-teal-100/70 dark:hover:bg-teal-900/40 text-teal-950 dark:text-teal-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xs hover:-translate-y-0.5"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Approve / Continue</span>
          </button>

          {/* Option 2: Modify */}
          <button
            type="button"
            onClick={onModifyDecision}
            className="p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xs hover:-translate-y-0.5"
          >
            <Sliders className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Modify</span>
          </button>

          {/* Option 3: Remove */}
          <button
            type="button"
            onClick={onRemoveDecision}
            className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100/70 dark:hover:bg-rose-900/40 text-rose-800 dark:text-rose-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xs hover:-translate-y-0.5"
          >
            <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>{isRemoved ? "Removed" : "Remove"}</span>
          </button>
        </div>
      </div>

      {/* 2. FINAL SUMMARY CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-teal-500/30 dark:border-teal-500/20 p-6 sm:p-8 shadow-md space-y-6 relative overflow-hidden">
        {/* Top ribbon */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
              Final Summary Card
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Prescription Order Review
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
              isLow
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : isHigh
                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                : "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
            }`}
          >
            {overallRisk} RISK LEVEL
          </span>
        </div>

        {/* Prescription Details List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Patient */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Patient
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              {patientName} ({patientAge} yrs)
            </p>
            <p className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">ID: {patientId}</p>
          </div>

          {/* Medication */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Medication
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              {isRemoved ? "None (Order Discontinued)" : medication}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">Route: Oral Administration</p>
          </div>

          {/* Dosage */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Dosage
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              {isRemoved ? "N/A" : dosage}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">Target therapeutic level</p>
          </div>

          {/* Frequency */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Frequency
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              {isRemoved ? "N/A" : frequency}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">Administer with water</p>
          </div>

          {/* Duration */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Duration
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              {isRemoved ? "N/A" : duration}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">Acute pain course</p>
          </div>

          {/* Risk */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Risk Assessment
            </span>
            <p
              className={`text-sm font-black uppercase ${
                isLow
                  ? "text-emerald-700 dark:text-emerald-400"
                  : isHigh
                  ? "text-rose-700 dark:text-rose-400"
                  : "text-amber-700 dark:text-amber-400"
              }`}
            >
              {overallRisk} Risk
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">MedGuard Safety Engine v2.4</p>
          </div>
        </div>

        {/* Clinical Recommendation */}
        <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-1 text-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 dark:text-teal-300 block">
            Clinical Recommendation
          </span>
          <p className="text-teal-950 dark:text-teal-200 font-medium leading-relaxed">
            {recommendation}
          </p>
        </div>

        {/* The 2 Required Action Buttons: Confirm Prescription & Back to Analysis */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToAnalysis}
            className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Analysis</span>
          </button>

          <button
            type="button"
            onClick={onConfirmPrescription}
            disabled={isRemoved}
            className="px-7 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-teal-600/30 flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Confirm Prescription</span>
          </button>
        </div>
      </div>
    </div>
  );
}
