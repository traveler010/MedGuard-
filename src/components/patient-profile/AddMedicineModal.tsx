"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  Pill,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Clock,
  Calendar,
} from "lucide-react";
import { Medication } from "@/data/mockPatients";

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newMed: Medication) => void;
}

const COMMON_PRESETS = [
  {
    name: "Metformin HCl",
    genericName: "Metformin",
    dosage: "500 mg",
    route: "Oral",
    frequency: "BID with meals",
    timingSlot: "morning" as const,
    indication: "Type 2 Diabetes Mellitus glycemic control",
    category: "Biguanide Antidiabetic",
    pillColor: "#0284c7",
    acbScore: 0,
    fallSedationScore: 0,
    beersCriteriaFlag: false,
    renalAdjustmentNeeded: true,
    renalNote: "Contraindicated if eGFR < 30 mL/min; reduce dose if eGFR 30–44.",
  },
  {
    name: "Atorvastatin Calcium",
    genericName: "Atorvastatin",
    dosage: "20 mg",
    route: "Oral",
    frequency: "Once daily at bedtime",
    timingSlot: "bedtime" as const,
    indication: "Hyperlipidemia & atherosclerotic cardiovascular protection",
    category: "HMG-CoA Reductase Inhibitor (Statin)",
    pillColor: "#3b82f6",
    acbScore: 0,
    fallSedationScore: 0,
    beersCriteriaFlag: false,
    renalAdjustmentNeeded: false,
  },
  {
    name: "Spironolactone",
    genericName: "Spironolactone",
    dosage: "25 mg",
    route: "Oral",
    frequency: "Once daily in morning",
    timingSlot: "morning" as const,
    indication: "Heart failure & resistant hypertension",
    category: "Aldosterone Antagonist",
    pillColor: "#14b8a6",
    acbScore: 0,
    fallSedationScore: 0,
    beersCriteriaFlag: false,
    renalAdjustmentNeeded: true,
    renalNote: "Risk of fatal hyperkalemia in CKD Stage 3+.",
  },
  {
    name: "Diphenhydramine (Benadryl)",
    genericName: "Diphenhydramine",
    dosage: "25 mg",
    route: "Oral",
    frequency: "PRN at bedtime",
    timingSlot: "bedtime" as const,
    indication: "Allergic rhinitis & insomnia",
    category: "1st Gen Antihistamine",
    pillColor: "#f43f5e",
    acbScore: 3,
    fallSedationScore: 3,
    beersCriteriaFlag: true,
    beersRationale: "AGS Beers Criteria: Highly anticholinergic. Extreme delirium and urinary retention hazard in elderly.",
    renalAdjustmentNeeded: false,
  },
];

export function AddMedicineModal({
  isOpen,
  onClose,
  onAdd,
}: AddMedicineModalProps) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Once daily");
  const [timingSlot, setTimingSlot] = useState<"morning" | "noon" | "evening" | "bedtime">("morning");
  const [indication, setIndication] = useState("");
  const [category, setCategory] = useState("General Medicine");
  const [acbScore, setAcbScore] = useState<number>(0);
  const [fallSedationScore, setFallSedationScore] = useState<number>(0);
  const [beersCriteriaFlag, setBeersCriteriaFlag] = useState(false);
  const [beersRationale, setBeersRationale] = useState("");

  if (!isOpen) return null;

  const handleApplyPreset = (preset: (typeof COMMON_PRESETS)[0]) => {
    setName(preset.name);
    setDosage(preset.dosage);
    setFrequency(preset.frequency);
    setTimingSlot(preset.timingSlot);
    setIndication(preset.indication);
    setCategory(preset.category);
    setAcbScore(preset.acbScore);
    setFallSedationScore(preset.fallSedationScore);
    setBeersCriteriaFlag(preset.beersCriteriaFlag);
    setBeersRationale(preset.beersRationale || "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: name.trim(),
      genericName: name.trim().split(" ")[0],
      dosage: dosage.trim(),
      route: "Oral",
      frequency: frequency.trim(),
      timingSlot,
      prescriber: "Dr. Sharma, MD",
      indication: indication.trim() || "Therapeutic maintenance",
      dateStarted: new Date().toISOString().split("T")[0],
      category,
      pillColor: beersCriteriaFlag ? "#ef4444" : "#0d9488",
      pillShape: "round",
      pillVisualDescription: "Prescribed oral tablet",
      withFood: "anytime",
      acbScore,
      fallSedationScore,
      beersCriteriaFlag,
      beersRationale: beersCriteriaFlag ? beersRationale || "Potential Beers criteria warning." : undefined,
      renalAdjustmentNeeded: false,
      isActive: true,
      patientPlainName: name.trim(),
      patientWhy: indication.trim() || "Prescribed for therapy",
      patientSpecialNotice: "Take as directed by Dr. Sharma.",
    };

    onAdd(newMed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-teal-50/50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Medication</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Record a new prescription to the patient regimen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Presets */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Quick Clinical Presets
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-300 hover:text-teal-800 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  + {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Dosage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Medicine Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Metformin HCl"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Dosage *</label>
              <input
                type="text"
                required
                placeholder="e.g. 500 mg"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Frequency & Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Frequency</label>
              <input
                type="text"
                placeholder="e.g. Once daily at morning"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Timing Slot</label>
              <select
                value={timingSlot}
                onChange={(e) => setTimingSlot(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="morning">Morning</option>
                <option value="noon">Noon / Afternoon</option>
                <option value="evening">Evening</option>
                <option value="bedtime">Bedtime</option>
              </select>
            </div>
          </div>

          {/* Purpose & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Therapeutic Purpose / Indication</label>
              <input
                type="text"
                placeholder="e.g. Hypertension management"
                value={indication}
                onChange={(e) => setIndication(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Drug Category</label>
              <input
                type="text"
                placeholder="e.g. Cardiovascular"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Risk Scoring */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Pharmacological Risk Profiling</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Anticholinergic Burden (ACB)</label>
                <select
                  value={acbScore}
                  onChange={(e) => setAcbScore(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value={0}>0 - No burden</option>
                  <option value={1}>1 - Mild</option>
                  <option value={2}>2 - Moderate</option>
                  <option value={3}>3 - Severe</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Fall / Sedation Hazard (0-3)</label>
                <select
                  value={fallSedationScore}
                  onChange={(e) => setFallSedationScore(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value={0}>0 - None</option>
                  <option value={1}>1 - Mild sedation</option>
                  <option value={2}>2 - Moderate</option>
                  <option value={3}>3 - High fall risk</option>
                </select>
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={beersCriteriaFlag}
                  onChange={(e) => setBeersCriteriaFlag(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span>Flags AGS Beers Criteria® (Potentially Inappropriate Medication)</span>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer btn-press"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors cursor-pointer btn-press"
            >
              Save to Regimen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
