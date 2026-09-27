'use client';

import React from 'react';
import {
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Sliders,
  FileText,
} from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';

interface DoctorSectionProps {
  onEnterDoctorDashboard: () => void;
}

export function DoctorSection({ onEnterDoctorDashboard }: DoctorSectionProps) {
  return (
    <section id="for-doctors" className="py-20 bg-slate-50/70 dark:bg-[#090e17]/70 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Clinical Value Proposition */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Clinician-Centric Design</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Designed around the doctor's workflow.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Hospitalists, geriatricians, and primary care physicians evaluate patients taking dozens of medications in 15-minute consultations. MediQX synthesizes fragmented medical records into instantaneous clinical clarity.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white">Instant Collision Detection:</strong> Surfaces CYP enzyme competition, anticholinergic burden (ACB), and cumulative fall risk in seconds.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white">"What-If" Deprescribing Sandbox:</strong> Safely test discontinuing or tapering medications and view real-time score improvements before committing changes.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900 dark:text-white">EHR SOAP Export:</strong> Generate standardized consultation summaries ready for copy-paste or print.
                </span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={onEnterDoctorDashboard}
                className="px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Open Clinician Cockpit</span>
                <ArrowRight className="w-4 h-4 text-teal-400 dark:text-white" />
              </button>
            </div>
          </div>

          {/* Right Column: Mock Doctor Dashboard Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-6 sm:p-7 overflow-hidden space-y-4 transition-colors">
              
              {/* Patient Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white flex items-center justify-center font-bold text-sm">
                    EV
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white">
                        Eleanor Vance
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        MRN: MG-80419
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      74y Female • eGFR: 34 mL/min (CKD 3b) • K+: 5.3 mEq/L • INR: 3.8
                    </div>
                  </div>
                </div>

                <RiskBadge level="HIGH" size="md" score={86} />
              </div>

              {/* High-Risk Alert Banner */}
              <div className="p-4 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                <div className="flex items-center justify-between text-xs font-bold text-rose-950 dark:text-rose-200 mb-1">
                  <span className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    High-Priority Drug Collision Detected
                  </span>
                  <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase">
                    Level 1A Guideline
                  </span>
                </div>
                <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed font-medium">
                  <strong>Warfarin 4mg + Fluconazole 150mg:</strong> Fluconazole blocks CYP2C9 clearance of Warfarin. Current patient INR is <strong>3.8</strong> (high bleed risk).
                </p>
                <div className="mt-3 p-3 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-rose-200/80 dark:border-rose-900/60 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mb-0.5">
                    Recommended Action:
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    Discontinue oral Fluconazole; substitute with non-absorbable <strong>Topical Nystatin Oral Suspension</strong>. Repeat STAT INR telemetry tomorrow morning.
                  </span>
                </div>
              </div>

              {/* Medication List Snippet */}
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Active Concomitant Regimen (Excerpt)
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/70 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Warfarin Sodium</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono ml-2">4 mg (Evening)</span>
                    </div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600">
                      Indication: AFib Stroke Prevention
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/70 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Lisinopril + Spironolactone</span>
                      <span className="text-amber-700 dark:text-amber-300 font-mono ml-2">20mg + 25mg</span>
                    </div>
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 font-semibold">
                      K+ 5.3 Alert (Hyperkalemia)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/70 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">Diphenhydramine (Sominex OTC)</span>
                      <span className="text-rose-700 dark:text-rose-300 font-mono ml-2">25 mg QHS</span>
                    </div>
                    <span className="text-[10px] text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800 font-semibold">
                      Beers 2023 ACB=3 Fall Hazard
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
