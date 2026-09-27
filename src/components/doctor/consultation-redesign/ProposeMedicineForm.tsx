"use client";

import React, { useState } from "react";
import { ProposedMedicineInput } from "./types";
import {
  Sparkles,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowRight,
  Info,
} from "lucide-react";

interface ProposeMedicineFormProps {
  proposed: ProposedMedicineInput;
  onChange: (field: keyof ProposedMedicineInput, value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export function ProposeMedicineForm({
  proposed,
  onChange,
  onAnalyze,
  isAnalyzing,
}: ProposeMedicineFormProps) {
  // Quick clinical presets for fast demonstration
  const PRESET_SUGGESTIONS = [
    {
      name: "Ibuprofen (Advil)",
      dose: "400 mg",
      freq: "Three times daily with food",
      duration: "10 Days",
      inst: "Take with food or milk. High NSAID risk with Aspirin/ACEi.",
    },
    {
      name: "Zolpidem (Ambien)",
      dose: "10 mg",
      freq: "Once daily at bedtime",
      duration: "14 Days",
      inst: "Take immediately before sleep. Beers criteria sedation risk in elderly.",
    },
    {
      name: "Ciprofloxacin",
      dose: "500 mg",
      freq: "Twice daily",
      duration: "7 Days",
      inst: "Drink plenty of fluids. CYP1A2 inhibitor and tendon risk.",
    },
    {
      name: "Acetaminophen (Tylenol)",
      dose: "500 mg",
      freq: "Every 6 hours PRN",
      duration: "5 Days",
      inst: "Max 2,000 mg/day. Safe first-line compatible analgesic.",
    },
  ];

  const handleApplyPreset = (preset: typeof PRESET_SUGGESTIONS[0]) => {
    onChange("name", preset.name);
    onChange("dose", preset.dose);
    onChange("frequency", preset.freq);
    onChange("duration", preset.duration);
    onChange("instructions", preset.inst);
  };

  const isFormValid =
    proposed.name.trim().length > 0 && proposed.dose.trim().length > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 space-y-5 transition-all">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Propose New Medicine
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enter candidate medication to test interactions against patient regimen, renal clearance, and geriatric safety.
          </p>
        </div>

        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full self-start sm:self-auto">
          Phase 1 Clinical CDS
        </span>
      </div>

      {/* Preset Chips */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Quick-Select Candidate Medicine (for testing)
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_SUGGESTIONS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition cursor-pointer flex items-center gap-1.5 ${
                proposed.name.toLowerCase().includes(p.name.toLowerCase().slice(0, 5))
                  ? "bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-300"
                  : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-400"
              }`}
            >
              <span>{p.name}</span>
              <span className="text-[10px] opacity-70 font-mono">({p.dose})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Medicine Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Medicine Name *</span>
            <span className="text-[10px] text-slate-400 font-normal">Generic or Brand</span>
          </label>
          <input
            type="text"
            value={proposed.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="e.g. Ibuprofen, Ciprofloxacin, Acetaminophen..."
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
          />
        </div>

        {/* Dose */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Dose *
          </label>
          <input
            type="text"
            value={proposed.dose}
            onChange={(e) => onChange("dose", e.target.value)}
            placeholder="e.g. 500 mg, 10 mg, 2 puffs..."
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
          />
        </div>

        {/* Frequency */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Frequency
          </label>
          <input
            type="text"
            value={proposed.frequency}
            onChange={(e) => onChange("frequency", e.target.value)}
            placeholder="e.g. Twice daily, Once daily at night..."
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
          />
        </div>

        {/* Duration */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Duration
          </label>
          <input
            type="text"
            value={proposed.duration}
            onChange={(e) => onChange("duration", e.target.value)}
            placeholder="e.g. 5 Days, 10 Days, 30 Days..."
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
          />
        </div>

        {/* Optional Instructions */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Optional Instructions</span>
            <span className="text-[10px] text-slate-400 font-normal">Special patient instructions</span>
          </label>
          <input
            type="text"
            value={proposed.instructions}
            onChange={(e) => onChange("instructions", e.target.value)}
            placeholder="e.g. Take with a full glass of water after food..."
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
          />
        </div>
      </div>

      {/* Realistic Mock Analyzing State */}
      {isAnalyzing && (
        <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-3 animate-pulse">
          <div className="flex items-center gap-2.5 text-teal-900 dark:text-teal-200 font-bold text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
            <span>Analyzing medication combination...</span>
          </div>
          <div className="space-y-1.5 text-xs text-teal-700 dark:text-teal-400 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span>Scanning CYP enzyme collisions and pharmacokinetic pathways...</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span>Evaluating Beers Criteria 2023 geriatric fall & sedation index...</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span>Checking cumulative organ burden against renal eGFR (54 mL/min)...</span>
            </div>
          </div>
        </div>
      )}

      {/* Button: Analyze Medication Risk */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!isFormValid || isAnalyzing}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-800 hover:from-teal-700 hover:to-cyan-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer transform active:scale-[0.99]"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing medication combination...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-cyan-200" />
              <span>Analyze Medication Risk</span>
              <ArrowRight className="w-4 h-4 opacity-80" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
