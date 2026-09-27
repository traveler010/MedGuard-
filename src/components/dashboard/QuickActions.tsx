'use client';

import React from 'react';
import {
  Stethoscope,
  UserPlus,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface QuickActionsProps {
  onNewConsultation: () => void;
  onAddPatient: () => void;
  onCheckDrugInteraction: () => void;
}

export function QuickActions({
  onNewConsultation,
  onAddPatient,
  onCheckDrugInteraction,
}: QuickActionsProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          Quick Actions
        </h2>
        <span className="text-[11px] text-slate-400 font-medium">
          Instant clinical workflows
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        {/* Button 1: New Consultation */}
        <button
          onClick={onNewConsultation}
          className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-teal-900/60 dark:to-slate-900 text-white hover:from-slate-800 hover:to-slate-700 dark:hover:from-teal-900/80 dark:hover:to-slate-850 border border-transparent dark:border-teal-700/30 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group text-left card-lift btn-press"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white">
                New Consultation
              </div>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                Start polypharmacy review
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>

        {/* Button 2: Add Patient */}
        <button
          onClick={onAddPatient}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 hover:bg-teal-50/30 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group text-left card-lift btn-press"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                Add Patient
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Register new clinical case
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>

        {/* Button 3: Check Drug Interaction */}
        <button
          onClick={onCheckDrugInteraction}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50/30 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group text-left card-lift btn-press"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                Check Drug Interaction
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Pre-screen candidate drug
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>

      </div>
    </div>
  );
}
