'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  FileSpreadsheet,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Add Patient',
      short: 'Input patient demographics, renal markers, and clinical diagnoses.',
      explanation:
        'Easily import or enter patient age, eGFR, serum creatinine, electrolytes, and current conditions. MediQX establishes a baseline physiological profile to assess organ clearance capacity.',
      icon: UserPlus,
      previewTitle: 'Patient Intake & Baseline Renal Function',
      previewDetails: [
        { label: 'Patient', val: 'Eleanor Vance (74 F)' },
        { label: 'Renal Clearance', val: 'eGFR 34 mL/min (CKD 3b)' },
        { label: 'Diagnoses', val: 'AFib, Osteoarthritis, HTN, GERD' },
      ],
      previewBadge: 'Profile Established',
    },
    {
      num: '02',
      title: 'Review Medications',
      short: 'Aggregate all prescription, OTC, and specialist therapies into one view.',
      explanation:
        'Detect fragmented prescribing across multiple clinics. View dosage, timing routines, physical pill cues, and clinical indications in one unified multi-drug regimen table.',
      icon: FileSpreadsheet,
      previewTitle: 'Multi-Prescriber Medication Aggregation',
      previewDetails: [
        { label: 'Active Drugs', val: '9 Concomitant Prescriptions' },
        { label: 'Specialists', val: 'Cardiology, Primary Care, Urgent Care' },
        { label: 'OTC Detection', val: 'Sominex (Diphenhydramine 25mg)' },
      ],
      previewBadge: 'Regimen Synchronized',
    },
    {
      num: '03',
      title: 'Analyze Risk',
      short: 'Detect drug-drug collisions, anticholinergic burden, and cascades.',
      explanation:
        'MediQX computes a 0-100 Polypharmacy Risk Score, screens CYP450 enzyme competition, highlights Beers Criteria 2023 violations, and flags prescribing cascades.',
      icon: AlertTriangle,
      previewTitle: 'Real-Time Polypharmacy Risk Engine',
      previewDetails: [
        { label: 'Polypharmacy Score', val: '86 / 100 (HIGH RISK)' },
        { label: 'Critical Collision', val: 'Warfarin + Fluconazole (INR 3.8)' },
        { label: 'Anticholinergic Burden', val: 'ACB Score: 4 (High Cognitive Hazard)' },
      ],
      previewBadge: 'Cascade & Collision Flagged',
    },
    {
      num: '04',
      title: 'Make Safer Decisions',
      short: 'Simulate deprescribing, optimize regimens, and share simple schedules.',
      explanation:
        'Test "What-If" deprescribing scenarios with instant score recalculation. Generate EHR SOAP consultation notes and deliver simplified pill schedules for patients and caregivers.',
      icon: ShieldCheck,
      previewTitle: 'Evidence-Based Deprescribing & Care Plan',
      previewDetails: [
        { label: 'Simulated Action', val: 'Switch Fluconazole to Nystatin' },
        { label: 'Projected Score', val: '86 → 46 ( -40 Pts Improvement )' },
        { label: 'CareView Sync', val: 'Morning/Noon/Night pill card updated' },
      ],
      previewBadge: 'Safety Plan Verified',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50/50 dark:bg-[#090e17]/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Intuitive Clinical Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How MediQX Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            From patient intake to actionable deprescribing in four structured, evidence-backed steps.
          </p>
        </div>

        {/* Interactive Steps Grid + Interactive Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Step Cards */}
          <div className="lg:col-span-6 space-y-3.5">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              const Icon = step.icon;

              return (
                <div
                  key={step.num}
                  onMouseEnter={() => setActiveStep(idx)}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 border-teal-400 dark:border-teal-500 shadow-md ring-1 ring-teal-300/40 dark:ring-teal-500/20'
                      : 'bg-white/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`text-sm font-extrabold font-mono px-2.5 py-1 rounded-lg shrink-0 ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {step.num}
                    </span>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                          {step.title}
                        </h3>
                        {isActive && (
                          <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Active Step
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {step.short}
                      </p>

                      {isActive && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium animate-in fade-in duration-200">
                          {step.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Visual Feedback Box */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden transition-colors">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                      {steps[activeStep].num}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {steps[activeStep].previewTitle}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        MediQX Decision Engine State
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                    {steps[activeStep].previewBadge}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {steps[activeStep].previewDetails.map((detail, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-500 dark:text-slate-400">
                        {detail.label}:
                      </span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {detail.val}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-800/60 text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
                  <span className="font-bold block mb-1">Clinical Impact at this step:</span>
                  {steps[activeStep].explanation}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Step {activeStep + 1} of 4</span>
                <div className="flex gap-1.5">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                        i === activeStep ? 'bg-teal-600 w-6' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                      aria-label={`Go to step ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
