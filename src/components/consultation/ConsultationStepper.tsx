"use client";

import React from "react";
import { Check, ChevronRight } from "lucide-react";

interface Step {
  id: number;
  label: string;
  sublabel: string;
}

interface ConsultationStepperProps {
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  maxAccessibleStep: number;
}

const STEPS: Step[] = [
  { id: 1, label: "Select Patient", sublabel: "Patient panel selection" },
  { id: 2, label: "Patient Overview", sublabel: "Baseline vitals & conditions" },
  { id: 3, label: "Current Regimen", sublabel: "Review active medications" },
  { id: 4, label: "Proposed Medicine", sublabel: "Safety & collision analysis" },
];

export function ConsultationStepper({
  currentStep,
  onStepClick,
  maxAccessibleStep,
}: ConsultationStepperProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs mb-6 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {STEPS.map((step, idx) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = step.id <= maxAccessibleStep && onStepClick;

          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => {
                  if (isClickable && onStepClick) onStepClick(step.id);
                }}
                className={`flex items-center gap-3 p-2 rounded-2xl transition-all ${
                  isClickable ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60" : "cursor-default"
                }`}
              >
                {/* Step Circle / Number */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                    isCompleted
                      ? "bg-teal-600 text-white shadow-xs"
                      : isCurrent
                      ? "bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 shadow-sm ring-4 ring-teal-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                </div>

                {/* Step Labels */}
                <div>
                  <div
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? "text-slate-900 dark:text-white font-extrabold"
                        : isCompleted
                        ? "text-teal-800 dark:text-teal-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">
                    {step.sublabel}
                  </div>
                </div>
              </div>

              {/* Separator arrow on larger screens */}
              {idx < STEPS.length - 1 && (
                <div className="hidden md:flex items-center text-slate-300 dark:text-slate-700">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
