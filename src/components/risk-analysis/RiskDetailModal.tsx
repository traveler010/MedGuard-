"use client";

import React from "react";
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Clock,
  UserCheck,
  Activity,
  HeartPulse,
  Info,
  CheckCircle2,
  FileText,
  ExternalLink,
} from "lucide-react";

export type RiskCardType = "interaction" | "age" | "duration" | "side_effects" | null;

interface RiskDetailModalProps {
  type: RiskCardType;
  onClose: () => void;
  patientName?: string;
  patientAge?: number;
  medicationName?: string;
}

export function RiskDetailModal({
  type,
  onClose,
  patientName = "Raj Kumar",
  patientAge = 68,
  medicationName = "Pain Medication X",
}: RiskDetailModalProps) {
  if (!type) return null;

  const contentMap = {
    interaction: {
      badge: "High Hazard Collision",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
      title: "Drug-Drug Interaction Analysis",
      icon: ShieldAlert,
      iconColor: "text-rose-600 bg-rose-50 border-rose-200",
      summary: `${medicationName} (NSAID) directly interacts with active Warfarin Sodium (4 mg daily), multiplying systemic bleeding risks.`,
      mechanism:
        "Pain Medication X strongly suppresses cyclooxygenase-1 (COX-1), preventing platelets from clustering together to stop bleeding. Simultaneously, Warfarin blocks clotting factors in the liver. Together, these two mechanisms leave blood vessels vulnerable without normal clotting protection.",
      patientImpact: [
        "Patient's baseline blood thinner (Warfarin) already thins the blood for stroke prevention in Atrial Fibrillation.",
        "Adding this pain medicine increases gastric mucosal erosion and upper gastrointestinal bleeding risk by 3.8x.",
        "Micro-hemorrhages in stomach tissue may go unnoticed until hemoglobin drops significantly.",
      ],
      guideline: "American College of Cardiology (ACC) / CHEST Consensus Statement: Concomitant systemic NSAIDs and oral anticoagulants carry Grade 1A hazard warnings.",
      safeRecommendation: "Switch to non-ulcerogenic analgesia (such as Acetaminophen up to 2g/day) or topical NSAID with minimal systemic absorption.",
    },
    age: {
      badge: "Geriatric Vulnerability (Beers Criteria)",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      title: "Age-Related Pharmacokinetic Risk",
      icon: UserCheck,
      iconColor: "text-amber-600 bg-amber-50 border-amber-200",
      summary: `At ${patientAge} years of age, physiologic renal reserve declines, reducing drug clearance rates by 30-40%.`,
      mechanism:
        "Aging kidneys filter active NSAID metabolites at a significantly reduced rate. This prolongs the medication's circulating half-life, causing higher peak blood concentrations than would occur in a younger adult.",
      patientImpact: [
        `Age ${patientAge} qualifies under the AGS Beers Criteria for heightened NSAID toxicity.`,
        "Decreased glomerular filtration rate (eGFR) impairs the excretion of active drug compounds.",
        "Higher risk of fluid retention, sudden blood pressure spikes, and diminished kidney perfusion.",
      ],
      guideline: "American Geriatrics Society (AGS) Beers Criteria 2023: Avoid chronic systemic NSAIDs in seniors ≥ 65 due to accelerated risk of peptic ulcer and acute kidney injury.",
      safeRecommendation: "If pain relief is necessary, prioritize non-systemic topical therapies or low-dose paracetamol with close hydration monitoring.",
    },
    duration: {
      badge: "Cumulative Exposure Threshold",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      title: "Duration & Exposure Curve",
      icon: Clock,
      iconColor: "text-purple-600 bg-purple-50 border-purple-200",
      summary: "Prescribed 14-day continuous regimen exceeds the clinical safety threshold of 3 to 5 days for anticoagulated seniors.",
      mechanism:
        "NSAID gastrointestinal toxicity is strictly cumulative. While a 48-hour rescue dose carries modest risk, continuous exposure past Day 5 depletes protective gastric prostaglandins and disrupts renal medullary blood flow.",
      patientImpact: [
        "Days 1-3: Mild gastric irritation, transient reduction in renal prostaglandins.",
        "Days 4-7: Protective stomach mucus layer is thinned by up to 50%. Bleeding likelihood increases sharply.",
        "Days 8-14: High danger of asymptomatic silent gastric ulceration and acute kidney injury.",
      ],
      guideline: "FDA Black Box NSAID Prescribing Protocol: Use the lowest effective dose for the shortest possible duration, strictly limiting acute courses to ≤ 5 days in high-risk patients.",
      safeRecommendation: "Cap prescription duration at 3 days maximum, or discontinue oral administration in favor of targeted topical applications.",
    },
    side_effects: {
      badge: "Multi-Organ Strain",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
      title: "Side-Effect & Organ Burden Profile",
      icon: HeartPulse,
      iconColor: "text-rose-600 bg-rose-50 border-rose-200",
      summary: "Severe compound burden on stomach lining, kidneys, and vascular blood pressure control.",
      mechanism:
        "Simultaneous vasoconstriction in renal arterioles leads to sodium and water retention, while chemical irritation of gastric mucosa compromises mucosal defenses.",
      patientImpact: [
        "Gastrointestinal: High risk of stomach ulcers, heartburn, and concealed GI bleeding.",
        "Renal: Decreased urine output, fluid retention causing leg/ankle swelling.",
        "Cardiovascular: Blunts blood pressure medication efficacy, raising systolic pressure by 5-10 mmHg.",
      ],
      guideline: "KDIGO Clinical Practice Guideline on Acute Kidney Injury & AHA Hypertension Management Protocol.",
      safeRecommendation: "Perform baseline serum creatinine check and co-prescribe gastric mucosal protection (PPI) if NSAID administration is unavoidable.",
    },
  };

  const activeData = contentMap[type];
  const IconComponent = activeData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 transition-colors"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs ${activeData.iconColor}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider mb-1 ${activeData.badgeColor}`}>
                {activeData.badge}
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {activeData.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          {/* Quick Summary Callout */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
              <p className="font-semibold text-slate-900 dark:text-white leading-relaxed">
                {activeData.summary}
              </p>
            </div>
          </div>

          {/* Biological Mechanism */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Clinical Mechanism (How It Works)
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60">
              {activeData.mechanism}
            </p>
          </div>

          {/* Patient-Specific Impact */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Impact on {patientName} (Age {patientAge})
            </h4>
            <ul className="space-y-2.5">
              {activeData.patientImpact.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical Evidence Guideline */}
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-800/60 text-teal-950 dark:text-teal-100">
            <div className="flex items-center gap-2 mb-1 text-teal-800 dark:text-teal-300 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4" /> Evidence Source & Guideline
            </div>
            <p className="text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
              {activeData.guideline}
            </p>
          </div>

          {/* Recommended Action */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100">
            <div className="flex items-center gap-2 mb-1 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" /> MedGuard Recommended Safety Strategy
            </div>
            <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
              {activeData.safeRecommendation}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            MedGuard Clinical Knowledge Engine v2.4
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs btn-press cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
