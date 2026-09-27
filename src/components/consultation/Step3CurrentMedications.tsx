"use client";

import React, { useState } from "react";
import {
  Pill,
  Plus,
  Edit3,
  Trash2,
  Clock,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { Medication, Patient } from "@/data/mockPatients";
import { RiskBadge } from "@/components/RiskBadge";

interface Step3CurrentMedicationsProps {
  patient: Patient;
  medications: Medication[];
  onAddMedication: () => void;
  onEditMedication: (med: Medication) => void;
  onRemoveMedication: (medId: string) => void;
  onProceedToProposed: () => void;
  onBackToOverview: () => void;
}

export function Step3CurrentMedications({
  patient,
  medications,
  onAddMedication,
  onEditMedication,
  onRemoveMedication,
  onProceedToProposed,
  onBackToOverview,
}: Step3CurrentMedicationsProps) {
  // Compute individual risk for a medication
  const getMedRisk = (med: Medication) => {
    if (med.beersCriteriaFlag || med.acbScore >= 2 || med.fallSedationScore >= 2) {
      return "HIGH";
    }
    if (med.acbScore === 1 || med.renalAdjustmentNeeded) {
      return "MODERATE";
    }
    return "LOW";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Active Regimen Audit
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
              {medications.length} Medications
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review, adjust dosages, or discontinue conflicting agents for {patient.name} ({patient.age}y {patient.gender})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToOverview}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Patient Overview</span>
          </button>

          <button
            onClick={onAddMedication}
            className="px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-800 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Add Medication</span>
          </button>
        </div>
      </div>

      {/* Medications Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Medication</th>
                <th className="py-3.5 px-3">Dosage & Route</th>
                <th className="py-3.5 px-3">Frequency & Schedule</th>
                <th className="py-3.5 px-3">Indication</th>
                <th className="py-3.5 px-3 text-center">Safety Risk</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {medications.map((med) => {
                const medRisk = getMedRisk(med);

                return (
                  <tr key={med.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    {/* Medication Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs font-bold text-xs"
                          style={{ backgroundColor: med.pillColor || "#0d9488" }}
                        >
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
                            <span>{med.name}</span>
                            {med.beersCriteriaFlag && (
                              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-rose-600 text-white font-extrabold">
                                Beers Flag
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 dark:text-slate-500">
                            {med.genericName} • {med.category}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Dosage & Route */}
                    <td className="py-4 px-3">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{med.dosage}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{med.route}</div>
                    </td>

                    {/* Frequency */}
                    <td className="py-4 px-3 text-slate-600 dark:text-slate-300">
                      <div>{med.frequency}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 capitalize">Timing: {med.timingSlot}</div>
                    </td>

                    {/* Indication */}
                    <td className="py-4 px-3 text-slate-600 dark:text-slate-300 max-w-xs">
                      <span className="line-clamp-2">{med.indication}</span>
                    </td>

                    {/* Safety Risk */}
                    <td className="py-4 px-3 text-center">
                      <RiskBadge level={medRisk} size="sm" />
                    </td>

                    {/* Actions: Edit & Remove */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditMedication(med)}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => onRemoveMedication(med.id)}
                          className="px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Proceed Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Active Regimen Confirmed ({medications.length} Drugs)
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Proceed to test drug collisions for a new proposed medication
            </div>
          </div>
        </div>

        <button
          onClick={onProceedToProposed}
          className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-teal-600/20 cursor-pointer"
        >
          <span>Add Proposed Medicine</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
