'use client';

import React from 'react';
import {
  AlertCircle,
  Brain,
  Sparkles,
  CalendarCheck,
  ShieldCheck,
} from 'lucide-react';

export function TrustStrip() {
  const indicators = [
    {
      icon: AlertCircle,
      title: 'Drug Interaction Detection',
      desc: 'Pharmacokinetic & CYP450 collision screening',
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60',
    },
    {
      icon: Brain,
      title: 'Explainable Risk Alerts',
      desc: 'Transparent mechanistic rationales without black-box AI',
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
    },
    {
      icon: Sparkles,
      title: 'Safer Alternatives',
      desc: 'Evidence-based deprescribing & step-down substitutions',
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/60',
    },
    {
      icon: CalendarCheck,
      title: 'Medication Tracking',
      desc: 'Daily visual schedule & patient adherence support',
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/60',
    },
  ];

  return (
    <section className="py-8 border-y border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {indicators.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${item.color} shadow-2xs`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
