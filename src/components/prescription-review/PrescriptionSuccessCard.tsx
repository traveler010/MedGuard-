"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  User,
  PlusCircle,
  LayoutDashboard,
  Printer,
  Sparkles,
  ArrowRight,
  Pill,
  FileCheck2,
  Calendar,
  Building2,
} from "lucide-react";

interface PrescriptionSuccessCardProps {
  patientName: string;
  patientAge: number;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  overallRisk: "HIGH" | "MODERATE" | "LOW";
  onPrint?: () => void;
}

export function PrescriptionSuccessCard({
  patientName = "Raj Kumar",
  patientAge = 68,
  patientId = "#QX-94108",
  medicationName = "Acetaminophen (Tylenol)",
  dosage = "500 mg",
  frequency = "Every 6 hours as needed",
  duration = "5 Days",
  overallRisk = "LOW",
  onPrint,
}: PrescriptionSuccessCardProps) {
  const isLowRisk = overallRisk === "LOW";

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
      {/* Top Celebratory Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-10 border border-emerald-500/40 text-white shadow-2xl relative overflow-hidden text-center">
        {/* Ambient Glows */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center space-y-4 max-w-xl mx-auto">
          {/* Animated Success Badge */}
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-teal-400 text-slate-950 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500 text-slate-950 inline-block mb-1 shadow-xs">
              Prescription Order Dispatched
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Prescription Review Completed
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              The updated regimen for <strong>{patientName}</strong> has been clinically reviewed, verified collision-free, and signed by Dr. Sharma.
            </p>
          </div>
        </div>
      </div>

      {/* Verified Prescription Order Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
              Official Electronic Prescription
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Rx #QX-2026-94812
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Safe Profile
            </span>
            <button
              onClick={onPrint || (() => window.print())}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Print Prescription Summary"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
            <span className="text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
              Patient Details
            </span>
            <p className="text-sm font-black text-slate-900 dark:text-white">
              {patientName}, {patientAge} yrs
            </p>
            <p className="text-slate-500 dark:text-slate-400 font-mono">ID: {patientId} • Male</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
            <span className="text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
              Prescribing Clinician
            </span>
            <p className="text-sm font-black text-slate-900 dark:text-white">
              Dr. Sharma, MD
            </p>
            <p className="text-slate-500 dark:text-slate-400">Lead Geriatric Specialist • Lic #MD-88102</p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-800 space-y-1">
            <span className="text-teal-700 dark:text-teal-300 font-bold uppercase tracking-wider block text-[10px]">
              Prescribed Drug & Dosage
            </span>
            <p className="text-sm font-black text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              {medicationName} ({dosage})
            </p>
            <p className="text-teal-800 dark:text-teal-300 font-mono">
              Schedule: {frequency} • Duration: {duration}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1">
            <span className="text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
              Fulfillment Routing
            </span>
            <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              Hospital Outpatient Pharmacy
            </p>
            <p className="text-slate-500 dark:text-slate-400">Status: Queued for dispensing • STAT notification sent</p>
          </div>
        </div>

        {/* Clinical Safety Sign-off */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
          <FileCheck2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Safety analysis reviewed against active <strong>Warfarin Sodium (4 mg daily)</strong> and patient age ({patientAge}). No platelet aggregation or gastrointestinal bleeding collisions detected.
          </p>
        </div>
      </div>

      {/* The 3 Required Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
        {/* Button 1: View Patient */}
        <Link
          href="/doctor/patients/pat-1"
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 text-center"
        >
          <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>View Patient</span>
        </Link>

        {/* Button 2: Start New Consultation */}
        <Link
          href="/doctor/consultation/new"
          className="p-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-teal-600/30 hover:-translate-y-0.5 text-center"
        >
          <PlusCircle className="w-4 h-4 text-teal-200" />
          <span>Start New Consultation</span>
        </Link>

        {/* Button 3: Return to Dashboard */}
        <Link
          href="/doctor/dashboard"
          className="p-4 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-750 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs hover:-translate-y-0.5 text-center"
        >
          <LayoutDashboard className="w-4 h-4 text-slate-400" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
