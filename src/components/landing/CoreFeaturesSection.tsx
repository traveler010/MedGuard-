'use client';

import React from 'react';
import {
  Activity,
  AlertOctagon,
  Sparkles,
  History,
  HeartHandshake,
  BellRing,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export function CoreFeaturesSection() {
  const features = [
    {
      icon: Activity,
      title: 'Medication Risk Analysis',
      desc: 'Holistic 0–100 polypharmacy risk scoring factoring in age, eGFR, sedative index, and anticholinergic cognitive burden.',
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      badge: 'Core Engine',
    },
    {
      icon: AlertOctagon,
      title: 'Explainable Alerts',
      desc: 'Transparent pharmacokinetics explaining exact mechanisms (e.g. CYP2C9 inhibition) and consequence without mysterious AI outputs.',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: 'No Black-Box',
    },
    {
      icon: Sparkles,
      title: 'Safer Alternatives',
      desc: 'Evidence-based step-downs and alternatives citing AGS Beers Criteria® 2023, STOPP/START v3, and KDIGO renal guidelines.',
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      badge: 'Clinical Guidelines',
    },
    {
      icon: History,
      title: 'Medication History',
      desc: 'Chronological timeline of active, tapering, and deprescribed therapies with audit trails for cross-specialty collaboration.',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      badge: 'Longitudinal Care',
    },
    {
      icon: HeartHandshake,
      title: 'Caregiver View',
      desc: 'Warm, empathetic, plain-language portal translating complex pharmacology into reassuring daily routines and safety checks.',
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      badge: 'Family Portal',
    },
    {
      icon: BellRing,
      title: 'Medication Reminders',
      desc: 'Structured morning, noon, evening, and bedtime pill schedules with visual pill shapes, food rules, and 7-day adherence streaks.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      badge: 'Adherence Support',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-[#090e17] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Comprehensive Clinical Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for Precision & Patient Safety
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            Every feature is purpose-built to reduce preventable medication-related hospitalizations.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;

            return (
              <div
                key={idx}
                className="group relative p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feat.color} shadow-xs transition-transform duration-300 group-hover:scale-105`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-400 group-hover:text-teal-800 dark:group-hover:text-teal-300">
                  <span>Explore in demo</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
