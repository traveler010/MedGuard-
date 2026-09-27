'use client';

import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export function SafetyStatement() {
  return (
    <section className="py-12 bg-slate-100/60 dark:bg-[#0c121e] border-y border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 shadow-2xs mb-3 border border-slate-200 dark:border-slate-700">
          <ShieldCheck className="w-5 h-5" />
        </div>

        <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-400 mb-2">
          Clinical Decision Support Architecture
        </h3>

        <blockquote className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 leading-relaxed max-w-2xl mx-auto">
          "MediQX is designed as a clinical decision-support tool and does not replace professional medical judgment."
        </blockquote>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto leading-normal">
          All algorithmic suggestions are based on peer-reviewed geriatric guidelines (AGS Beers Criteria® 2023, STOPP/START v3, KDIGO 2024). Clinicians retain final authority over all prescription decisions.
        </p>
      </div>
    </section>
  );
}
