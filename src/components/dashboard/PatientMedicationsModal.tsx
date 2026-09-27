"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Pill,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  Info,
} from "lucide-react";
import { Patient, Medication } from "@/types";
import { RiskBadge } from "@/components/RiskBadge";

interface PatientMedicationsModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onStartConsultation?: (patient: Patient) => void;
}

export function PatientMedicationsModal({
  patient,
  isOpen,
  onClose,
  onStartConsultation,
}: PatientMedicationsModalProps) {
  const router = useRouter();
  const [selectedMedDetail, setSelectedMedDetail] = useState<Medication | null>(null);

  if (!isOpen || !patient) return null;

  const handleOpenDetailedAnalysis = (med: Medication) => {
    onClose();
    // Route to the Medicine Analyzer
    router.push(
      `/doctor/consultation/demo-consultation/analysis?med=${encodeURIComponent(
        med.name
      )}&dosage=${encodeURIComponent(med.dosage)}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col transition-colors">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/60 dark:bg-slate-850">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold shrink-0">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Active Medication Overview
                </span>
                <span className="text-xs text-slate-300 dark:text-slate-600">•</span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  MRN: {patient.mrn}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {patient.name} ({patient.age} yrs, {patient.gender})
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Concise Medication List / Table */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing <strong>{patient.medications.length}</strong> active prescriptions
            </span>
            <span className="text-[11px] font-medium">
              Click &quot;View Details&quot; to inspect clinical analysis
            </span>
          </div>

          {/* Clean Cards: Medicine Name | Dose | Frequency | Risk Status */}
          <div className="space-y-3">
            {patient.medications.map((med) => {
              const medRisk: "HIGH" | "MODERATE" | "LOW" =
                med.acbScore >= 2 || med.beersCriteriaFlag
                  ? "HIGH"
                  : med.acbScore === 1 || med.renalAdjustmentNeeded
                  ? "MODERATE"
                  : "LOW";

              return (
                <div
                  key={med.id}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: med.pillColor || "#0ea5e9" }}
                    />
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{med.name}</span>
                        {med.beersCriteriaFlag && (
                          <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-900">
                            Beers
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {med.dosage}
                        </span>
                        <span>•</span>
                        <span>{med.frequency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-800">
                    {/* Risk Status */}
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block sm:hidden">
                        Risk
                      </span>
                      <RiskBadge level={medRisk} size="sm" />
                    </div>

                    {/* View Details Action */}
                    <button
                      onClick={() => handleOpenDetailedAnalysis(med)}
                      className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Overall Polypharmacy Score:{" "}
            <strong className="text-slate-900 dark:text-white font-mono">
              {patient.polypharmacyScore}/100
            </strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
            {onStartConsultation && (
              <button
                onClick={() => {
                  onClose();
                  onStartConsultation(patient);
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Start Review</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
