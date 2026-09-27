"use client";

import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Activity,
  HeartHandshake,
} from "lucide-react";

interface MedicineSafetyIllustrationProps {
  existingMedicine?: string;
  proposedMedicine?: string;
  isNeutralized?: boolean;
  riskScore?: number;
}

export function MedicineSafetyIllustration({
  existingMedicine = "Warfarin Sodium (4 mg)",
  proposedMedicine = "Pain Medication X (10 mg)",
  isNeutralized = false,
  riskScore = 94,
}: MedicineSafetyIllustrationProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border transition-all duration-500 p-6 sm:p-7 ${
        isNeutralized
          ? "bg-gradient-to-br from-emerald-950/20 via-slate-900 to-teal-950/30 border-emerald-500/30 shadow-lg shadow-emerald-950/20"
          : "bg-gradient-to-br from-rose-950/25 via-slate-900 to-amber-950/20 border-rose-500/30 shadow-lg shadow-rose-950/20"
      }`}
    >
      {/* Background ambient lighting */}
      <div
        className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          isNeutralized ? "bg-emerald-500/10" : "bg-rose-500/15"
        }`}
      />
      <div
        className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          isNeutralized ? "bg-teal-500/10" : "bg-amber-500/10"
        }`}
      />

      {/* Header bar within illustration card */}
      <div className="relative z-10 flex items-center justify-between pb-5 border-b border-slate-700/60 mb-6">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              isNeutralized ? "bg-emerald-400" : "bg-rose-500"
            }`}
          />
          <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-300">
            MedGuard Safety Core Telemetry
          </span>
        </div>

        <span
          className={`text-[11px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 transition-colors ${
            isNeutralized
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
              : "bg-rose-500/15 text-rose-300 border-rose-500/30"
          }`}
        >
          {isNeutralized ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Regimen Protected</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Collision Flagged</span>
            </>
          )}
        </span>
      </div>

      {/* Center Medical Schematic Visual */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 items-center gap-6 py-2">
        {/* Medicine 1: Existing Prescribed Drug */}
        <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 backdrop-blur-sm">
          {/* Pill Graphic */}
          <div className="relative mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-sky-900/40 ring-2 ring-sky-400/30">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v5h14V6a1 1 0 0 0-1-1H6z" />
              </svg>
            </div>
            <span className="absolute -top-1.5 -right-1.5 text-[9px] font-mono font-bold bg-slate-900 text-sky-300 px-1.5 py-0.5 rounded border border-sky-500/40">
              Rx 1
            </span>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
            Active Regimen
          </span>
          <h4 className="text-sm font-bold text-white leading-snug">
            {existingMedicine}
          </h4>
          <span className="text-[11px] text-sky-300/80 font-medium mt-1">
            Anticoagulant (CYP2C9 substrate)
          </span>
        </div>

        {/* Center: MedGuard Intelligent Safety Shield & Flow Vector */}
        <div className="flex flex-col items-center justify-center text-center px-2 py-1">
          {/* Connecting Vectors (SVG lines) */}
          <div className="relative flex items-center justify-center mb-3">
            {/* Animated Pulsing Ring */}
            <div
              className={`absolute w-24 h-24 rounded-full border-2 transition-all duration-500 ${
                isNeutralized
                  ? "border-emerald-500/40 animate-ping opacity-25"
                  : "border-rose-500/40 animate-ping opacity-35"
              }`}
            />

            {/* Central Shield Container */}
            <div
              className={`relative z-10 w-20 h-20 rounded-3xl flex flex-col items-center justify-center border shadow-xl transition-all duration-500 ${
                isNeutralized
                  ? "bg-emerald-950/80 border-emerald-400/50 text-emerald-300 shadow-emerald-900/50"
                  : "bg-rose-950/80 border-rose-500/50 text-rose-300 shadow-rose-900/50"
              }`}
            >
              {isNeutralized ? (
                <ShieldCheck className="w-10 h-10 text-emerald-400 animate-in zoom-in-75 duration-300" />
              ) : (
                <ShieldAlert className="w-10 h-10 text-rose-400 animate-in zoom-in-75 duration-300" />
              )}
            </div>
          </div>

          {/* Dynamic Status Readout */}
          <div className="space-y-1">
            <span
              className={`text-xs font-black uppercase tracking-wider block ${
                isNeutralized ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {isNeutralized ? "Safety Verified" : "Collision Detected"}
            </span>
            <p className="text-[11px] text-slate-400 max-w-[170px] mx-auto leading-tight">
              {isNeutralized
                ? "No hepatic CYP conflict. Gastric barrier preserved."
                : "CYP2C9 competitive displacement & platelet inhibition."}
            </p>
          </div>
        </div>

        {/* Medicine 2: Proposed Drug or Selected Alternative */}
        <div
          className={`flex flex-col items-center text-center p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
            isNeutralized
              ? "bg-emerald-950/30 border-emerald-600/40"
              : "bg-slate-800/60 border-slate-700/70"
          }`}
        >
          {/* Pill Graphic */}
          <div className="relative mb-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ring-2 transition-colors ${
                isNeutralized
                  ? "bg-gradient-to-tr from-emerald-600 to-teal-400 ring-emerald-400/30 shadow-emerald-900/40"
                  : "bg-gradient-to-tr from-rose-600 to-amber-500 ring-rose-400/30 shadow-rose-900/40"
              }`}
            >
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M4.5 10.5C3.12 11.88 3.12 14.12 4.5 15.5L8.5 19.5C9.88 20.88 12.12 20.88 13.5 19.5L19.5 13.5C20.88 12.12 20.88 9.88 19.5 8.5L15.5 4.5C14.12 3.12 11.88 3.12 10.5 4.5L4.5 10.5ZM12 12L16 8L17.5 9.5L13.5 13.5L12 12Z" />
              </svg>
            </div>
            <span
              className={`absolute -top-1.5 -right-1.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                isNeutralized
                  ? "bg-slate-900 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-900 text-rose-300 border-rose-500/40"
              }`}
            >
              {isNeutralized ? "Safe Rx" : "Proposed"}
            </span>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
            {isNeutralized ? "Neutralized Agent" : "Candidate Drug"}
          </span>
          <h4 className="text-sm font-bold text-white leading-snug">
            {proposedMedicine}
          </h4>
          <span
            className={`text-[11px] font-medium mt-1 ${
              isNeutralized ? "text-emerald-300/90" : "text-rose-300/90"
            }`}
          >
            {isNeutralized ? "Non-NSAID Analgesic" : "High-Risk NSAID"}
          </span>
        </div>
      </div>

      {/* Micro Telemetry Bar */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slate-700/60 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            Hemorrhagic Risk
          </span>
          <span
            className={`font-mono font-bold ${
              isNeutralized ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isNeutralized ? "0.98x Baseline" : "4.8x Compounded"}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            Pharmacokinetic Status
          </span>
          <span
            className={`font-mono font-bold ${
              isNeutralized ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {isNeutralized ? "Cleared" : "Competitive Block"}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">
            Geriatric Safety
          </span>
          <span
            className={`font-mono font-bold ${
              isNeutralized ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isNeutralized ? "Beers Compliant" : "Beers Flagged"}
          </span>
        </div>
      </div>
    </div>
  );
}
