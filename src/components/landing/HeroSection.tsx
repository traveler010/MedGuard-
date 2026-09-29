'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  Activity,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Stethoscope,
  Pill,
} from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';

interface HeroSectionProps {
  onStartConsultation: () => void;
  onExploreMedGuard: () => void;
}

export function HeroSection({
  onStartConsultation,
  onExploreMedGuard,
}: HeroSectionProps) {
  const [activePreviewTab, setActivePreviewTab] = useState<'alerts' | 'meds'>('alerts');

  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background medical gradient blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-tr from-teal-100/40 via-cyan-50/30 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Subtitle & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200/80 dark:border-teal-800/80 text-teal-800 dark:text-teal-300 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Next-Gen Polypharmacy Safety Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Safer Medications. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-500 dark:from-teal-400 dark:via-teal-300 dark:to-cyan-400">
                Smarter Decisions.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
              MedGuard helps healthcare professionals identify potential medication risks before they become problems. Powered by clinical pharmacokinetics, Beers Criteria, and actionable deprescribing recommendations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onStartConsultation}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Stethoscope className="w-4 h-4 text-teal-400 dark:text-white group-hover:scale-110 transition-transform" />
                <span>Start Consultation</span>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-200 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreMedGuard}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-800 transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Explore MedGuard</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero real API setup needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Beers 2023 Guidelines</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Caregiver-ready</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Medical Dashboard Preview */}
          <div className="lg:col-span-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Decorative aura behind card */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-75" />

              {/* Main Preview Container */}
              <div className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl p-5 sm:p-6 overflow-hidden">
                
                {/* Dashboard Window Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-teal-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      EV
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          Eleanor Vance
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          MRN-80419
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        74 yrs • Female • eGFR 34 mL/min (CKD 3b)
                      </div>
                    </div>
                  </div>

                  <RiskBadge level="HIGH" size="sm" score={86} />
                </div>

                {/* Score & Risk Analysis Bar */}
                <div className="grid grid-cols-3 gap-2.5 my-4 p-3 rounded-2xl bg-slate-50/90 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Polypharmacy Risk
                    </span>
                    <span className="text-lg font-extrabold font-mono text-rose-600 dark:text-rose-400">
                      86 <span className="text-xs font-normal text-slate-400">/ 100</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Active Medications
                    </span>
                    <span className="text-lg font-extrabold font-mono text-slate-800 dark:text-slate-200">
                      9 Prescriptions
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Risk Status
                    </span>
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-950/60 px-2 py-0.5 rounded-md inline-block mt-0.5">
                      CRITICAL ACTION
                    </span>
                  </div>
                </div>

                {/* Switcher tabs within preview */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setActivePreviewTab('alerts')}
                    className={`text-xs px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      activePreviewTab === 'alerts'
                        ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Interaction Alerts (2 Critical)
                  </button>
                  <button
                    onClick={() => setActivePreviewTab('meds')}
                    className={`text-xs px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      activePreviewTab === 'meds'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Current Medications (9)
                  </button>
                </div>

                {/* Tab Content: Interaction Alert */}
                {activePreviewTab === 'alerts' && (
                  <div className="space-y-2.5 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs">
                      <div className="flex items-center justify-between text-rose-950 dark:text-rose-200 font-bold mb-1">
                        <span className="flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          Warfarin Sodium ✕ Fluconazole
                        </span>
                        <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-extrabold">
                          CRITICAL DDI
                        </span>
                      </div>
                      <p className="text-rose-800 dark:text-rose-300 leading-snug">
                        Potent CYP2C9 inhibition. Patient INR has spiked to <strong>3.8</strong> (Target 2.0-3.0). Extreme life-threatening hemorrhage risk.
                      </p>
                      <div className="mt-2 pt-2 border-t border-rose-200/80 dark:border-rose-900/60 text-[11px] text-rose-900 dark:text-rose-200 font-medium flex items-center justify-between">
                        <span>Rec: Switch to topical Nystatin</span>
                        <span className="text-teal-700 dark:text-teal-400 font-bold font-mono">+18 Pts Safety</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs">
                      <div className="flex items-center justify-between text-amber-950 dark:text-amber-200 font-bold mb-0.5">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          Prescribing Cascade Warning
                        </span>
                        <span className="text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded font-bold">
                          CASCADE
                        </span>
                      </div>
                      <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-snug">
                        Amlodipine induced ankle edema was mistreated with Furosemide 40mg.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab Content: Meds List */}
                {activePreviewTab === 'meds' && (
                  <div className="space-y-2 text-xs animate-in fade-in duration-200">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-400" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">Warfarin Sodium</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">4 mg daily</span>
                      </div>
                      <span className="text-[10px] text-rose-700 dark:text-rose-300 font-bold bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">High Bleed Risk</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-yellow-400" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">Lisinopril</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">20 mg daily</span>
                      </div>
                      <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded">Renal K+ Monitor</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-400" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">Diphenhydramine (OTC)</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">25 mg QHS</span>
                      </div>
                      <span className="text-[10px] text-rose-700 dark:text-rose-300 font-bold bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">Beers Violation</span>
                    </div>
                  </div>
                )}

                {/* Preview Action Bar */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Real-time clinical pharmacokinetics</span>
                  </div>

                  <button
                    onClick={onStartConsultation}
                    className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Launch Full Cockpit</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
