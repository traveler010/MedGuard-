"use client";

import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Clock,
  HeartPulse,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { RiskCardType } from "./RiskDetailModal";

interface RiskBreakdownGridProps {
  onOpenDetails: (type: RiskCardType) => void;
  isNeutralized?: boolean;
}

export function RiskBreakdownGrid({
  onOpenDetails,
  isNeutralized = false,
}: RiskBreakdownGridProps) {
  const cards = [
    {
      id: "interaction" as RiskCardType,
      title: "Drug Interaction",
      icon: isNeutralized ? ShieldCheck : ShieldAlert,
      status: isNeutralized ? "Safe (No Interaction)" : "Critical Alert (High Hazard)",
      statusColor: isNeutralized
        ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
        : "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
      iconColor: isNeutralized
        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60"
        : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60",
      cardBorder: isNeutralized
        ? "hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-emerald-100/50"
        : "hover:border-rose-300 dark:hover:border-rose-600 hover:shadow-rose-100/50",
      explanation: isNeutralized
        ? "Alternative has zero pharmacological collision with active Warfarin Sodium or antihypertensive therapy."
        : "Pain Medication X inhibits platelets while Warfarin blocks clotting factors, multiplying internal bleeding hazard.",
      metric: isNeutralized ? "0 Collisions" : "3.8x Bleeding Factor",
    },
    {
      id: "age" as RiskCardType,
      title: "Age Risk",
      icon: UserCheck,
      status: isNeutralized ? "Beers Compliant" : "Elevated Caution (Age 68)",
      statusColor: isNeutralized
        ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
        : "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
      iconColor: isNeutralized
        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60"
        : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60",
      cardBorder: isNeutralized
        ? "hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-emerald-100/50"
        : "hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-amber-100/50",
      explanation: isNeutralized
        ? "Selected medicine conforms to Geriatric Beers Criteria safety parameters for patients aged 65 and above."
        : "At 68 years old, natural reduction in kidney filtration causes NSAID compounds to accumulate and linger in circulation.",
      metric: isNeutralized ? "Geriatric Safe" : "eGFR 48 Adjusted",
    },
    {
      id: "duration" as RiskCardType,
      title: "Duration Risk",
      icon: Clock,
      status: isNeutralized ? "Within Safe Zone" : "Exceeds Safety Ceiling (14 Days)",
      statusColor: isNeutralized
        ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
        : "bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
      iconColor: isNeutralized
        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60"
        : "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/60",
      cardBorder: isNeutralized
        ? "hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-emerald-100/50"
        : "hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-purple-100/50",
      explanation: isNeutralized
        ? "Dosage course adheres to standard safe duration guidelines with zero mucosal ulceration cumulative risk."
        : "Prescribed 14-day continuous NSAID course far exceeds the 3-5 day acute maximum for anticoagulated seniors.",
      metric: isNeutralized ? "Safe Schedule" : "Limit: ≤ 5 Days",
    },
    {
      id: "side_effects" as RiskCardType,
      title: "Side-Effect Load",
      icon: HeartPulse,
      status: isNeutralized ? "Minimal Burden" : "Compound Organ Load",
      statusColor: isNeutralized
        ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60"
        : "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
      iconColor: isNeutralized
        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60"
        : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60",
      cardBorder: isNeutralized
        ? "hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-emerald-100/50"
        : "hover:border-rose-300 dark:hover:border-rose-600 hover:shadow-rose-100/50",
      explanation: isNeutralized
        ? "Gentle tolerability with negligible impact on gastric lining, kidney hemodynamics, or blood pressure."
        : "Simultaneous strain on gastric mucosal lining, acute renal hemodynamics, and vascular hypertension control.",
      metric: isNeutralized ? "Low Toxicity" : "Multi-System Strain",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Clinical Risk Breakdown</span>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">
            (4 Evaluation Vectors)
          </span>
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Click any card to inspect clinical evidence
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onOpenDetails(card.id)}
              className={`group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 ${card.cardBorder}`}
            >
              <div>
                {/* Header: Icon & Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs transition-transform group-hover:scale-110 ${card.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${card.statusColor}`}>
                    {card.status}
                  </span>
                </div>

                {/* Card Title */}
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors mb-1.5 flex items-center justify-between">
                  <span>{card.title}</span>
                </h4>

                {/* Short Explanation */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {card.explanation}
                </p>
              </div>

              {/* Card Footer: Metric & "View details" button */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                  {card.metric}
                </span>

                <button
                  type="button"
                  className="text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                >
                  <span>View details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
