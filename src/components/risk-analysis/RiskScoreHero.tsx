"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  User,
  Pill,
  Sparkles,
  Activity,
  CheckCircle2,
  RefreshCw,
  Info,
  Calendar,
  Layers,
} from "lucide-react";

interface RiskScoreHeroProps {
  patientName?: string;
  patientAge?: number;
  proposedMedicine?: string;
  proposedDosage?: string;
  isNeutralized?: boolean;
  neutralizedMedicineName?: string;
  riskScore?: number;
  onResetToHighRisk?: () => void;
  onRerunScan?: () => void;
  isLoading?: boolean;
}

export function RiskScoreHero({
  patientName = "Raj Kumar",
  patientAge = 68,
  proposedMedicine = "Pain Medication X",
  proposedDosage = "10 mg Oral Tablet (Q8H)",
  isNeutralized = false,
  neutralizedMedicineName = "Acetaminophen 500mg",
  riskScore = 94,
  onResetToHighRisk,
  onRerunScan,
  isLoading = false,
}: RiskScoreHeroProps) {
  // Animated score counter state
  const targetScore = isNeutralized ? 18 : riskScore;
  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20; // ms
    const totalSteps = duration / stepTime;
    const increment = targetScore / totalSteps;

    setDisplayedScore(0);

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetScore) {
        setDisplayedScore(targetScore);
        clearInterval(timer);
      } else {
        setDisplayedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetScore, isNeutralized]);

  // Circumference for circular gauge
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayedScore / 100) * circumference;

  return (
    <div className="space-y-4">
      {/* Top Patient & Proposed Medicine Context Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        {/* Left: Patient Card Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center text-teal-700 dark:text-teal-300 font-black text-base shadow-xs shrink-0">
            RK
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                Patient Profile
              </span>
              <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">MRN: #QX-94108</span>
              <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">DOB: 1958-04-12</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{patientName}</span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                ({patientAge} yrs, Male)
              </span>
            </h1>
          </div>
        </div>

        {/* Center: Proposed Medication Tag */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-xs shrink-0">
            <Pill className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              {isNeutralized ? "Selected Safe Prescription" : "Proposed Medicine Under Review"}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              {isNeutralized ? neutralizedMedicineName : proposedMedicine}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({isNeutralized ? "500 mg Oral" : proposedDosage})
              </span>
            </span>
          </div>
        </div>

        {/* Right: Quick State Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {isNeutralized ? (
            <button
              onClick={onResetToHighRisk}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Revert to Pain Med X
            </button>
          ) : (
            <button
              onClick={onRerunScan}
              disabled={isLoading}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-teal-400" : ""}`} />
              {isLoading ? "Analyzing..." : "Re-Scan Regimen"}
            </button>
          )}
        </div>
      </div>

      {/* Large Risk Verdict Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all duration-500 shadow-xl ${
          isNeutralized
            ? "bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 border-emerald-500/50 text-white"
            : "bg-gradient-to-br from-rose-950 via-red-950 to-slate-900 border-rose-500/50 text-white"
        }`}
      >
        {/* Ambient Glowing Background Elements */}
        <div
          className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-700 ${
            isNeutralized ? "bg-emerald-500" : "bg-rose-600 animate-pulse"
          }`}
        />
        <div
          className={`absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 ${
            isNeutralized ? "bg-teal-400" : "bg-red-700"
          }`}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Column: Risk Indicator, Shield Icon, Clear Typography */}
          <div className="space-y-4 max-w-2xl">
            {/* Red Risk Indicator Pill */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md transition-all duration-300 ${
                  isNeutralized
                    ? "bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/30"
                    : "bg-rose-500 text-white ring-4 ring-rose-500/25 animate-pulse"
                }`}
              >
                {isNeutralized ? (
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                )}
                {isNeutralized ? "LOW RISK — VERIFIED SAFE" : "HIGH RISK"}
              </span>

              <span className="text-xs font-mono text-slate-300/80 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
                Clinical Safety Engine: MediQX v2.4
              </span>
            </div>

            {/* Shield / Warning Icon + Clear Main Typography */}
            <div className="flex items-start gap-4">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border transition-all duration-300 ${
                  isNeutralized
                    ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-400 ring-2 ring-emerald-500/20"
                    : "bg-rose-500/20 border-rose-400/40 text-rose-400 ring-4 ring-rose-500/30"
                }`}
              >
                {isNeutralized ? (
                  <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9" />
                ) : (
                  <ShieldAlert className="w-8 h-8 sm:w-9 sm:h-9" />
                )}
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  {isNeutralized
                    ? "Regimen Collision Neutralized."
                    : "Potential medication interaction detected."}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-200/90 leading-relaxed font-normal">
                  {isNeutralized ? (
                    <>
                      Prescription switched to <strong>{neutralizedMedicineName}</strong>. This alternative does not interfere with <strong>Warfarin Sodium (4 mg)</strong> and preserves kidney filtration.
                    </>
                  ) : (
                    <>
                      Proposed <strong>{proposedMedicine}</strong> interacts dangerously with active <strong>Warfarin Sodium</strong>, significantly increasing systemic bleeding and gastrointestinal hazard.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Micro-Indicators */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {isNeutralized ? (
                <>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> No Bleeding Interaction
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Renal-Sparing Profile
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Beers Criteria Compliant
                  </span>
                </>
              ) : (
                <>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Severe Anticoagulation Hazard
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Age 68 Clearance Delay
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> 14-Day Cumulative Strain
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Animated Circular Risk Gauge Meter */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-3xl border border-white/10 backdrop-blur-md shrink-0 lg:w-64">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Foreground Animated Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className={`transition-all duration-700 ${
                    isNeutralized ? "stroke-emerald-400" : "stroke-rose-500"
                  }`}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Inside Counter Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black tracking-tight text-white font-mono">
                  {displayedScore}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Risk Score
                </span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span
                className={`text-xs font-black uppercase tracking-wider block ${
                  isNeutralized ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isNeutralized ? "Safe Regimen (18/100)" : "Severe Risk (94/100)"}
              </span>
              <span className="text-[11px] text-slate-400">
                {isNeutralized ? "Safe for Raj Kumar" : "Immediate Review Needed"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
