'use client';

import React from 'react';
import { PrescribingCascade } from '@/data/mockPatients';
import {
  Workflow,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface PrescribingCascadeCardProps {
  cascades: PrescribingCascade[];
  onBreakCascade?: (cascade: PrescribingCascade) => void;
}

export function PrescribingCascadeCard({
  cascades,
  onBreakCascade,
}: PrescribingCascadeCardProps) {
  if (cascades.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 rounded-2xl border border-amber-200/90 p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Prescribing Cascade Detected
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Cascade Alert
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              A medication side effect was misdiagnosed as a new medical condition, triggering an unnecessary prescription.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {cascades.map((cascade) => (
          <div
            key={cascade.id}
            className="p-4 rounded-xl bg-white border border-amber-200/80 shadow-2xs"
          >
            {/* Visual Cascade Flow */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-lg bg-amber-50/50 border border-amber-100/80 mb-3">
              
              {/* Step 1: Initiating Drug */}
              <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Initial Medication
                </div>
                <div className="text-xs font-bold text-slate-900 mt-0.5">
                  {cascade.primaryDrug}
                </div>
              </div>

              {/* Arrow + Side effect */}
              <div className="flex flex-col items-center justify-center shrink-0 px-2 py-1 text-center">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wide">
                  Causes Adverse Effect:
                </span>
                <span className="text-xs font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 my-0.5">
                  {cascade.adverseEffect}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-500 hidden md:block" />
              </div>

              {/* Step 2: Cascade Prescription */}
              <div className="flex-1 bg-white p-3 rounded-lg border border-amber-300 shadow-2xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Cascade Drug (Unnecessary)
                </div>
                <div className="text-xs font-bold text-rose-800 mt-0.5">
                  {cascade.secondaryDrug}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Presumed: {cascade.secondaryDrugIndicationPresumed}
                </div>
              </div>

            </div>

            {/* Clinical Guidance & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-slate-700 leading-relaxed max-w-3xl">
                <span className="font-bold text-slate-900">Clinical Recommendation: </span>
                {cascade.clinicalGuidance}
              </div>

              {onBreakCascade && (
                <button
                  onClick={() => onBreakCascade(cascade)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Break Cascade Protocol
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
