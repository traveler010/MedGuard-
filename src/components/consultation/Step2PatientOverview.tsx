"use client";

import React from "react";
import {
  User,
  Activity,
  Pill,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Stethoscope,
  Heart,
  FileText,
  Clock,
} from "lucide-react";
import { Patient } from "@/data/mockPatients";
import { RiskBadge } from "@/components/RiskBadge";

interface Step2PatientOverviewProps {
  patient: Patient;
  onStartRiskReview: () => void;
  onBackToSelect: () => void;
}

export function Step2PatientOverview({
  patient,
  onStartRiskReview,
  onBackToSelect,
}: Step2PatientOverviewProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Quick Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-md ${
              patient.riskLevel === "HIGH"
                ? "bg-gradient-to-tr from-slate-900 to-rose-700 shadow-rose-900/10"
                : "bg-gradient-to-tr from-teal-700 to-cyan-600 shadow-teal-700/10"
            }`}
          >
            {patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {patient.name}
              </h2>
              <RiskBadge level={patient.riskLevel} size="sm" score={patient.polypharmacyScore} />
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{patient.age} yrs old ({patient.gender})</span>
              <span>•</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">MRN: {patient.mrn}</span>
              <span>•</span>
              <span>DOB: {patient.dob}</span>
              <span>•</span>
              <span>Primary: {patient.primaryDoctor}</span>
            </div>
          </div>
        </div>

        {/* Change Patient Button */}
        <button
          onClick={onBackToSelect}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold self-start md:self-auto flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Patient</span>
        </button>
      </div>

      {/* Vitals & Clearance Biomarkers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs transition-colors">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Blood Pressure
          </span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {patient.bloodPressure}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Pulse: {patient.heartRate} bpm</span>
        </div>

        <div className={`rounded-2xl border p-4 shadow-xs transition-colors ${
          patient.eGFR < 60 ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60" : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800"
        }`}>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Renal Clearance (eGFR)
          </span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {patient.eGFR} <span className="text-xs font-medium text-slate-500 dark:text-slate-400">mL/min</span>
          </div>
          <span className={`text-[11px] font-semibold ${patient.eGFR < 60 ? "text-amber-800 dark:text-amber-300" : "text-slate-500 dark:text-slate-400"}`}>
            {patient.eGFR < 30 ? "Severe CKD Stage 4" : patient.eGFR < 60 ? "CKD Stage 3" : "Normal Function"}
          </span>
        </div>

        <div className={`rounded-2xl border p-4 shadow-xs transition-colors ${
          patient.potassium > 5.0 ? "bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60" : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800"
        }`}>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            Serum Potassium (K+)
          </span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {patient.potassium} <span className="text-xs font-medium text-slate-500 dark:text-slate-400">mEq/L</span>
          </div>
          <span className={`text-[11px] font-semibold ${patient.potassium > 5.0 ? "text-rose-700 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-400"}`}>
            {patient.potassium > 5.0 ? "⚠️ Elevated (Hyperkalemia)" : "Normal Range"}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 shadow-xs transition-colors">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            Serum Creatinine
          </span>
          <div className="text-base font-extrabold text-slate-900 dark:text-white">
            {patient.creatinine} <span className="text-xs font-medium text-slate-500 dark:text-slate-400">mg/dL</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Weight: {patient.weightKg} kg</span>
        </div>
      </div>

      {/* Two Column Layout: Current Conditions & Current Medications Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Medical Conditions */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Current Medical Conditions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Documented comorbidities for this patient</p>
            </div>
          </div>

          <div className="space-y-2">
            {patient.diagnoses.map((diag, index) => (
              <div
                key={index}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-semibold"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>{diag}</span>
              </div>
            ))}
          </div>

          {/* Allergies Notice */}
          <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/60 text-xs">
            <span className="font-bold text-rose-900 dark:text-rose-200 block mb-0.5">Known Allergies:</span>
            <p className="text-rose-800 dark:text-rose-300 font-medium">{patient.allergies.join(", ") || "No known drug allergies"}</p>
          </div>
        </div>

        {/* Right: Current Medications Summary */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Pill className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Current Medications ({patient.medications.length})</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Concomitant prescription and OTC therapies</p>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              ACB Score: {patient.totalAcbScore}
            </span>
          </div>

          {/* Medication Cards List */}
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {patient.medications.map((med) => (
              <div
                key={med.id}
                className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs font-bold text-[10px]"
                    style={{ backgroundColor: med.pillColor || "#0d9488" }}
                  >
                    <Pill className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{med.name}</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400 font-normal">({med.dosage})</span>
                      {med.beersCriteriaFlag && (
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-rose-600 text-white font-extrabold">
                          Beers
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {med.frequency} • {med.indication}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-md border border-teal-200/60 dark:border-teal-800/60">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Action Callout Bar */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-white mb-1 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-300" />
            Ready for Comprehensive Polypharmacy Audit
          </h3>
          <p className="text-xs text-teal-100 max-w-xl">
            Proceed to inspect drug-drug interactions, examine anticholinergic load, modify existing medications, or screen a newly proposed prescription.
          </p>
        </div>

        <button
          onClick={onStartRiskReview}
          className="px-6 py-3.5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-400/20 cursor-pointer shrink-0"
        >
          <span>Start Risk Review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
