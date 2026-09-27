"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Search,
  Activity,
  Layers,
} from "lucide-react";

interface AnalysisLoadingOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
  patientName?: string;
  proposedMedicine?: string;
}

export function AnalysisLoadingOverlay({
  isOpen,
  onComplete,
  patientName = "Raj Kumar",
  proposedMedicine = "Pain Medication X",
}: AnalysisLoadingOverlayProps) {
  const [progress, setProgress] = useState(15);
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const [step4Done, setStep4Done] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(15);
      setStep1Done(false);
      setStep2Done(false);
      setStep3Done(false);
      setStep4Done(false);
      return;
    }

    const t1 = setTimeout(() => {
      setProgress(40);
      setStep1Done(true);
    }, 400);

    const t2 = setTimeout(() => {
      setProgress(70);
      setStep2Done(true);
    }, 900);

    const t3 = setTimeout(() => {
      setProgress(90);
      setStep3Done(true);
    }, 1400);

    const t4 = setTimeout(() => {
      setProgress(100);
      setStep4Done(true);
    }, 1800);

    const t5 = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 max-w-md w-full shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-3xl bg-teal-500/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-3xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/30">
            <RefreshCw className="w-9 h-9 animate-spin" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Running Clinical Risk Model
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Cross-checking {proposedMedicine} against {patientName}&apos;s medical profile and pharmacokinetics
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400">
            <span>Scanning 4 Risk Vectors</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Multi-step Checklist */}
        <div className="space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
          <div className="flex items-center justify-between">
            <span className={step1Done ? "text-slate-800 font-bold" : "text-slate-400"}>
              Drug interaction & CYP2C9 check
            </span>
            {step1Done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <span className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-teal-600 animate-spin" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className={step2Done ? "text-slate-800 font-bold" : "text-slate-400"}>
              Geriatric Beers Criteria & eGFR match
            </span>
            {step2Done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <span className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-teal-600 animate-spin" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className={step3Done ? "text-slate-800 font-bold" : "text-slate-400"}>
              Prescription duration exposure threshold
            </span>
            {step3Done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <span className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-teal-600 animate-spin" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className={step4Done ? "text-slate-800 font-bold" : "text-slate-400"}>
              Side-effect & bleeding load score
            </span>
            {step4Done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <span className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-teal-600 animate-spin" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
