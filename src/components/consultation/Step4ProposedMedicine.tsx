"use client";

import React, { useState, useEffect } from "react";
import {
  Pill,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
  Activity,
  Zap,
} from "lucide-react";
import { Patient, Medication } from "@/data/mockPatients";

export interface ProposedMedicineData {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  indication: string;
}

interface Step4ProposedMedicineProps {
  patient: Patient;
  onAnalyzeComplete: (proposedMed: ProposedMedicineData) => void;
  onBackToMedications: () => void;
}

const CLINICAL_PRESETS: Array<ProposedMedicineData & { hazard: "HIGH" | "MODERATE" | "LOW"; tag: string }> = [
  {
    name: "Pain Medication X",
    dosage: "10 mg",
    frequency: "Every 8 hours (Q8H)",
    duration: "14 days",
    indication: "Acute Knee Osteoarthritis Flare",
    hazard: "HIGH",
    tag: "High Bleeding Risk + Warfarin Collision",
  },
  {
    name: "Ciprofloxacin (Cipro)",
    dosage: "500 mg",
    frequency: "BID (Twice Daily)",
    duration: "7 days",
    indication: "Complicated Urinary Tract Infection",
    hazard: "HIGH",
    tag: "CYP1A2 / Warfarin Bleed Collision",
  },
  {
    name: "Ibuprofen (Advil/Motrin)",
    dosage: "400 mg",
    frequency: "TID with food",
    duration: "10 days",
    indication: "Acute Knee Osteoarthritis Flare",
    hazard: "HIGH",
    tag: "Renal Failure + Lisinopril Blunting",
  },
  {
    name: "Acetaminophen (Tylenol)",
    dosage: "500 mg",
    frequency: "q6h PRN",
    duration: "5 days",
    indication: "Mild to Moderate Osteoarthritis Pain",
    hazard: "LOW",
    tag: "Doctor Verified Safe Alternative",
  },
  {
    name: "Atorvastatin Calcium",
    dosage: "20 mg",
    frequency: "Once daily at bedtime",
    duration: "Ongoing",
    indication: "Cardiovascular Atherosclerotic Risk Reduction",
    hazard: "MODERATE",
    tag: "Statin / Myopathy Monitoring",
  },
];

export function Step4ProposedMedicine({
  patient,
  onAnalyzeComplete,
  onBackToMedications,
}: Step4ProposedMedicineProps) {
  const [name, setName] = useState("Ciprofloxacin (Cipro)");
  const [dosage, setDosage] = useState("500 mg");
  const [frequency, setFrequency] = useState("BID (Twice Daily)");
  const [duration, setDuration] = useState("7 days");
  const [indication, setIndication] = useState("Acute Urinary Tract Infection");

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Progressive check states
  const [checkedInteractions, setCheckedInteractions] = useState(false);
  const [checkedAgeRisk, setCheckedAgeRisk] = useState(false);
  const [checkedDuration, setCheckedDuration] = useState(false);
  const [checkedSideEffects, setCheckedSideEffects] = useState(false);

  const handleApplyPreset = (preset: typeof CLINICAL_PRESETS[0]) => {
    setName(preset.name);
    setDosage(preset.dosage);
    setFrequency(preset.frequency);
    setDuration(preset.duration);
    setIndication(preset.indication);
  };

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setCheckedInteractions(false);
    setCheckedAgeRisk(false);
    setCheckedDuration(false);
    setCheckedSideEffects(false);

    // Sequence the checklist as specified:
    // 1. Drug interaction check (at 600ms)
    setTimeout(() => {
      setAnalysisProgress(35);
      setCheckedInteractions(true);
    }, 600);

    // 2. Age risk check (at 1200ms)
    setTimeout(() => {
      setAnalysisProgress(65);
      setCheckedAgeRisk(true);
    }, 1200);

    // 3. Duration check (at 1800ms)
    setTimeout(() => {
      setAnalysisProgress(85);
      setCheckedDuration(true);
    }, 1800);

    // 4. Side-effect check (at 2300ms)
    setTimeout(() => {
      setAnalysisProgress(100);
      setCheckedSideEffects(true);
    }, 2300);

    // 5. Complete and transition to Risk Analysis Screen (at 2800ms)
    setTimeout(() => {
      onAnalyzeComplete({
        name,
        dosage,
        frequency,
        duration,
        indication,
      });
    }, 2800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Add Proposed Medicine
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
              Safety Simulation
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter the drug details to trigger real-time cross-checking against {patient.name}'s active regimen and biomarkers
          </p>
        </div>

        <button
          onClick={onBackToMedications}
          disabled={isAnalyzing}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Regimen</span>
        </button>
      </div>

      {/* Main Form and Presets Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors">
          <form onSubmit={handleStartAnalysis} className="space-y-5">
            {/* Clinical Presets Bar */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Quick Demonstration Presets (Click to Test Collisions):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CLINICAL_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset.name}
                    disabled={isAnalyzing}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      name === preset.name
                        ? "bg-teal-50/70 dark:bg-teal-950/30 border-teal-500 text-slate-900 dark:text-white ring-2 ring-teal-500/20"
                        : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100/80 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{preset.name}</span>
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                          preset.hazard === "HIGH"
                            ? "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                            : preset.hazard === "MODERATE"
                            ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                            : "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        }`}
                      >
                        {preset.hazard}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{preset.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Medicine Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Medicine Name *
              </label>
              <div className="relative">
                <Pill className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  disabled={isAnalyzing}
                  placeholder="e.g. Ciprofloxacin (Cipro), Ibuprofen, Metformin..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white dark:bg-slate-800/80 transition-colors"
                />
              </div>
            </div>

            {/* Dosage & Frequency Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Dosage *
                </label>
                <input
                  type="text"
                  required
                  disabled={isAnalyzing}
                  placeholder="e.g. 500 mg, 10 mg..."
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white dark:bg-slate-800/80 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Frequency *
                </label>
                <input
                  type="text"
                  required
                  disabled={isAnalyzing}
                  placeholder="e.g. BID (Twice Daily), Once daily at bedtime..."
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white dark:bg-slate-800/80 transition-colors"
                />
              </div>
            </div>

            {/* Duration & Reason Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Duration *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    disabled={isAnalyzing}
                    placeholder="e.g. 7 days, 14 days, Chronic Ongoing..."
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white dark:bg-slate-800/80 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Reason for Prescription *
                </label>
                <input
                  type="text"
                  required
                  disabled={isAnalyzing}
                  placeholder="e.g. Acute infection, Osteoarthritis flare..."
                  value={indication}
                  onChange={(e) => setIndication(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white dark:bg-slate-800/80 transition-colors"
                />
              </div>
            </div>

            {/* CTA Button: "Analyze Safety" with UX state changes */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={isAnalyzing || !name.trim()}
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer btn-press ${
                  isAnalyzing
                    ? "bg-slate-900 text-white cursor-wait"
                    : "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20 hover:shadow-teal-600/30"
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-teal-400 rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-200" />
                    <span>Analyze Safety</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Analysis Stepper / Checklist HUD (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">MediQX Safety Engine</h3>
              <p className="text-[11px] text-slate-400">Real-time multi-dimensional screening</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Analysis Progress</span>
              <span className="font-mono text-teal-400">{analysisProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-300 rounded-full"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          </div>

          {/* 4 Checklist Items Required by Prompt */}
          <div className="space-y-3 pt-2">
            {/* Item 1 */}
            <div
              className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                checkedInteractions
                  ? "bg-teal-500/10 border-teal-500/40 text-teal-200"
                  : isAnalyzing && analysisProgress >= 10
                  ? "bg-slate-800/80 border-slate-700 text-slate-300 animate-pulse"
                  : "bg-slate-800/40 border-slate-800 text-slate-500"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  checkedInteractions
                    ? "bg-teal-500 text-slate-950"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {checkedInteractions ? "✓" : "1"}
              </div>
              <div className="text-xs font-bold">Drug interaction check</div>
            </div>

            {/* Item 2 */}
            <div
              className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                checkedAgeRisk
                  ? "bg-teal-500/10 border-teal-500/40 text-teal-200"
                  : isAnalyzing && analysisProgress >= 35
                  ? "bg-slate-800/80 border-slate-700 text-slate-300 animate-pulse"
                  : "bg-slate-800/40 border-slate-800 text-slate-500"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  checkedAgeRisk
                    ? "bg-teal-500 text-slate-950"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {checkedAgeRisk ? "✓" : "2"}
              </div>
              <div className="text-xs font-bold">Age risk check</div>
            </div>

            {/* Item 3 */}
            <div
              className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                checkedDuration
                  ? "bg-teal-500/10 border-teal-500/40 text-teal-200"
                  : isAnalyzing && analysisProgress >= 65
                  ? "bg-slate-800/80 border-slate-700 text-slate-300 animate-pulse"
                  : "bg-slate-800/40 border-slate-800 text-slate-500"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  checkedDuration
                    ? "bg-teal-500 text-slate-950"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {checkedDuration ? "✓" : "3"}
              </div>
              <div className="text-xs font-bold">Duration check</div>
            </div>

            {/* Item 4 */}
            <div
              className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                checkedSideEffects
                  ? "bg-teal-500/10 border-teal-500/40 text-teal-200"
                  : isAnalyzing && analysisProgress >= 85
                  ? "bg-slate-800/80 border-slate-700 text-slate-300 animate-pulse"
                  : "bg-slate-800/40 border-slate-800 text-slate-500"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  checkedSideEffects
                    ? "bg-teal-500 text-slate-950"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {checkedSideEffects ? "✓" : "4"}
              </div>
              <div className="text-xs font-bold">Side-effect check</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 leading-relaxed">
            Comparing against AGS Beers Criteria 2023, CYP450 cytochrome metabolism, and {patient.name}'s baseline renal clearance ({patient.eGFR} mL/min).
          </div>
        </div>
      </div>
    </div>
  );
}
