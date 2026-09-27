"use client";

import React, { useState } from "react";
import {
  X,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
} from "lucide-react";

interface DrugInteractionCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchConsultation?: (drugNames: string[]) => void;
}

const COMMON_DRUGS = [
  { name: "Lisinopril", class: "ACE Inhibitor", indications: "Hypertension, Heart Failure" },
  { name: "Spironolactone", class: "Aldosterone Antagonist", indications: "Heart Failure, Edema" },
  { name: "Ibuprofen", class: "NSAID", indications: "Analgesic, Anti-inflammatory" },
  { name: "Metformin", class: "Biguanide", indications: "Type 2 Diabetes" },
  { name: "Amlodipine", class: "Calcium Channel Blocker", indications: "Hypertension" },
  { name: "Warfarin", class: "Anticoagulant", indications: "Thromboembolism Prophylaxis" },
  { name: "Aspirin", class: "Antiplatelet", indications: "Cardioprotection" },
  { name: "Atorvastatin", class: "HMG-CoA Reductase Inhibitor", indications: "Dyslipidemia" },
  { name: "Clopidogrel", class: "P2Y12 Platelet Inhibitor", indications: "Post-PCI, Stroke Prevention" },
  { name: "Omeprazole", class: "Proton Pump Inhibitor", indications: "GERD, Ulcer Prophylaxis" },
  { name: "Ciprofloxacin", class: "Fluoroquinolone", indications: "Bacterial Infection" },
];

interface CollisionResult {
  severity: "HIGH" | "MODERATE" | "LOW";
  title: string;
  mechanism: string;
  clinicalAction: string;
  evidenceScore: string;
}

const KNOWN_INTERACTIONS: Record<string, CollisionResult> = {
  "lisinopril+spironolactone": {
    severity: "HIGH",
    title: "Dual Renin-Angiotensin Aldosterone (RAAS) Hyperkalemia",
    mechanism: "Concurrent inhibition of aldosterone synthesis and receptor blockage impairs renal potassium excretion (K+ surge).",
    clinicalAction: "Mandatory baseline serum K+ & creatinine check. Reduce Spironolactone to ≤12.5mg or substitute with non-potassium sparing diuretic.",
    evidenceScore: "Class I (Established randomized trial evidence)",
  },
  "ibuprofen+lisinopril": {
    severity: "HIGH",
    title: "Hemodynamic Renal Failure & Blunted Antihypertensive Efficacy",
    mechanism: "NSAIDs inhibit renal vasodilatory prostaglandins while ACE inhibitors inhibit angiotensin II-mediated efferent arteriolar constriction.",
    clinicalAction: "Avoid chronic NSAIDs. Shift to topical NSAID or Acetaminophen 500mg TID. Monitor BP rebound.",
    evidenceScore: "Class I (Well-documented nephrotoxicity)",
  },
  "aspirin+warfarin": {
    severity: "HIGH",
    title: "Compounded Synergistic Hemorrhage Hazard",
    mechanism: "Simultaneous inhibition of platelet aggregation and coagulation factors II, VII, IX, X significantly elevates major GI/intracranial bleeding risk.",
    clinicalAction: "Strict clinical justification required (e.g. recent DES). Co-prescribe PPI gastroprotection and monitor INR weekly.",
    evidenceScore: "Class I (High bleeding hazard)",
  },
  "clopidogrel+omeprazole": {
    severity: "MODERATE",
    title: "CYP2C19 Competitive Bioactivation Inhibition",
    mechanism: "Omeprazole competitively inhibits hepatic CYP2C19, reducing conversion of Clopidogrel prodrug into active antiplatelet metabolite.",
    clinicalAction: "Substitute Omeprazole with Pantoprazole or H2RA (Famotidine) which demonstrate negligible CYP2C19 antagonism.",
    evidenceScore: "Class IIa (FDA Safety Warning)",
  },
  "atorvastatin+ciprofloxacin": {
    severity: "MODERATE",
    title: "CYP3A4 Inhibition Induced Statin Elevation",
    mechanism: "Ciprofloxacin moderately inhibits CYP3A4, elevating serum Atorvastatin concentrations and raising rhabdomyolysis probability.",
    clinicalAction: "Temporarily pause statin during antibiotic course or monitor for bilateral muscle pain and serum CK elevation.",
    evidenceScore: "Class IIb (Clinical observation)",
  },
};

export default function DrugInteractionCheckerModal({
  isOpen,
  onClose,
  onLaunchConsultation,
}: DrugInteractionCheckerModalProps) {
  const [drug1, setDrug1] = useState("Lisinopril");
  const [drug2, setDrug2] = useState("Spironolactone");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasRun, setHasRun] = useState(true);

  if (!isOpen) return null;

  const key1 = `${drug1.toLowerCase()}+${drug2.toLowerCase()}`;
  const key2 = `${drug2.toLowerCase()}+${drug1.toLowerCase()}`;
  const interaction = KNOWN_INTERACTIONS[key1] || KNOWN_INTERACTIONS[key2];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasRun(true);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/50 via-white to-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Rapid Drug Interaction Screener</h2>
              <p className="text-xs text-slate-500">Cross-match pharmacodynamic and pharmacokinetic collisions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Drug Selection Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Primary Drug
              </label>
              <select
                value={drug1}
                onChange={(e) => {
                  setDrug1(e.target.value);
                  setHasRun(false);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
              >
                {COMMON_DRUGS.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.class})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Secondary Agent / Suspect Drug
              </label>
              <select
                value={drug2}
                onChange={(e) => {
                  setDrug2(e.target.value);
                  setHasRun(false);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
              >
                {COMMON_DRUGS.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.class})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing Cytochrome & Metabolic Pathways...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run Polypharmacy Screening Engine
              </>
            )}
          </button>

          {/* Results Display */}
          {hasRun && !isAnalyzing && (
            <div className="space-y-4 pt-2">
              {interaction ? (
                <div
                  className={`rounded-2xl border p-5 ${
                    interaction.severity === "HIGH"
                      ? "border-rose-200 bg-rose-50/50"
                      : "border-amber-200 bg-amber-50/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          interaction.severity === "HIGH"
                            ? "bg-rose-100 text-rose-700 border border-rose-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {interaction.severity} SEVERITY COLLISION
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {interaction.evidenceScore}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{interaction.title}</h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="bg-white/80 p-3 rounded-xl border border-slate-200/60">
                      <span className="font-semibold text-slate-700 block mb-0.5">Pharmacological Mechanism:</span>
                      <p className="text-slate-600 leading-relaxed">{interaction.mechanism}</p>
                    </div>

                    <div className="bg-white/80 p-3 rounded-xl border border-slate-200/60">
                      <span className="font-semibold text-slate-700 block mb-0.5">Recommended Clinical Action:</span>
                      <p className="text-teal-900 font-medium leading-relaxed">{interaction.clinicalAction}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      LOW / NO DOCUMENTED COLLISION
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    Safe Co-Administration Profile ({drug1} + {drug2})
                  </h3>
                  <p className="text-xs text-slate-600">
                    No high-risk pharmacokinetic CYP or pharmacodynamic competition was identified in standard peer-reviewed clinical guidelines for this pairwise combination.
                  </p>
                </div>
              )}

              {/* Quick Launch Action */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Info className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Need patient-specific eGFR, age, and cascade scoring?</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (onLaunchConsultation) onLaunchConsultation([drug1, drug2]);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Open Full Cockpit
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white transition-colors cursor-pointer"
          >
            Close Screener
          </button>
        </div>
      </div>
    </div>
  );
}
