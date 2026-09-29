'use client';

import React from 'react';
import {
  HeartHandshake,
  CheckCircle2,
  Clock,
  Circle,
  Sun,
  Sunset,
  Moon,
  Flame,
  Utensils,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface PatientCaregiverSectionProps {
  onExplorePatientView: () => void;
}

export function PatientCaregiverSection({
  onExplorePatientView,
}: PatientCaregiverSectionProps) {
  return (
    <section id="for-patients" className="py-20 bg-white dark:bg-[#090e17] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Simplified Schedule Mock UI */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 p-6 sm:p-8 shadow-xl max-w-lg mx-auto lg:max-w-none transition-colors">
              
              {/* CareView Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      Today's Medication Plan
                    </span>
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 7-Day Streak
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Eleanor Vance • Prepared with Dr. Al-Mansoor
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                    3 of 5 Taken
                  </span>
                </div>
              </div>

              {/* Schedule Timeline Slots */}
              <div className="space-y-3.5">
                
                {/* 08:00 AM - Taken */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-200 dark:border-amber-800/60">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono font-bold text-slate-400">
                        08:00 AM • Morning
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white line-through opacity-60">
                        Blood Pressure Medicine (Lisinopril)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Take with a glass of water and breakfast
                      </div>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Taken
                  </span>
                </div>

                {/* 01:00 PM - Upcoming */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-teal-300 dark:border-teal-600 shadow-xs flex items-center justify-between ring-1 ring-teal-200/50 dark:ring-teal-500/20">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs border border-teal-200 dark:border-teal-800/60">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono font-bold text-teal-700 dark:text-teal-300">
                        01:00 PM • Lunch
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        Joint Support Medicine (Medicine B)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Take with lunch meal
                      </div>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Circle className="w-3.5 h-3.5 text-slate-400" />
                    Upcoming
                  </span>
                </div>

                {/* 08:00 PM - Upcoming */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-200 dark:border-indigo-800/60">
                      <Sunset className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono font-bold text-slate-400">
                        08:00 PM • Evening
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        Heart Rhythm Protector (Medicine C)
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Take at consistent evening time
                      </div>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Circle className="w-3.5 h-3.5 text-slate-400" />
                    Upcoming
                  </span>
                </div>

              </div>

              {/* Safety notice in preview */}
              <div className="mt-4 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Notice: Avoid grapefruit and do not double up any forgotten morning pills.</span>
              </div>

            </div>
          </div>

          {/* Right Column: Caregiver Value Proposition */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold">
              <HeartHandshake className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Patient & Family Peace of Mind</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Clear schedules. Zero confusion for families.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Medical jargon causes medication non-adherence. MedGuard translates complex pharmacology into plain-English schedules, visual pill shape recognition, and timely caregiver reminders.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white">Visual Pill Verification:</strong> Color, shape, and markings so family members immediately identify what is in the pillbox.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white">Plain-Language Reasons:</strong> Answers the questions patients ask most: "What does this pill do?" and "Do I take this with food?"
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white">Printable Emergency Wallet Card:</strong> One-click printable medical passport for emergency room visits or travel.
                </span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={onExplorePatientView}
                className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Caregiver View</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
