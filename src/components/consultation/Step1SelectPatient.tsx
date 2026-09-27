"use client";

import React, { useState } from "react";
import {
  Search,
  Users,
  Pill,
  Activity,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Patient, RiskLevel } from "@/data/mockPatients";
import { RiskBadge } from "@/components/RiskBadge";

interface Step1SelectPatientProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient) => void;
  onContinue: () => void;
}

export function Step1SelectPatient({
  patients,
  selectedPatient,
  onSelectPatient,
  onContinue,
}: Step1SelectPatientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<"ALL" | RiskLevel>("ALL");

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      patient.name.toLowerCase().includes(query) ||
      patient.mrn.toLowerCase().includes(query) ||
      patient.diagnoses.some((d) => d.toLowerCase().includes(query));

    const matchesRisk = riskFilter === "ALL" || patient.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search & Risk Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name, MRN, or clinical condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50 dark:bg-slate-800/80 transition-colors"
          />
        </div>

        {/* Risk Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl text-xs font-semibold self-start sm:self-auto transition-colors">
          <button
            onClick={() => setRiskFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              riskFilter === "ALL"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            All Patients ({patients.length})
          </button>
          <button
            onClick={() => setRiskFilter("HIGH")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              riskFilter === "HIGH"
                ? "bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 shadow-2xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            High Risk
          </button>
          <button
            onClick={() => setRiskFilter("MODERATE")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              riskFilter === "MODERATE"
                ? "bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-2xs font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Moderate
          </button>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => {
          const isSelected = selectedPatient?.id === patient.id;
          const isHigh = patient.riskLevel === "HIGH";

          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? "bg-teal-50/50 dark:bg-teal-950/20 border-teal-500 dark:border-teal-500/80 ring-2 ring-teal-500/20 shadow-md"
                  : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs"
              }`}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              <div>
                {/* Header: Avatar, Name, Age */}
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm text-white shrink-0 shadow-2xs ${
                      isHigh
                        ? "bg-gradient-to-tr from-slate-900 to-rose-700"
                        : "bg-gradient-to-tr from-teal-700 to-cyan-600"
                    }`}
                  >
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors truncate">
                      {patient.name}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                      <span>{patient.age} yrs</span>
                      <span>•</span>
                      <span>{patient.gender}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">MRN: {patient.mrn}</span>
                    </div>
                  </div>
                </div>

                {/* Medical Conditions */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Conditions ({patient.diagnoses.length})
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden">
                    {patient.diagnoses.slice(0, 3).map((diag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {diag}
                      </span>
                    ))}
                    {patient.diagnoses.length > 3 && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold self-center">
                        +{patient.diagnoses.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom: Number of Medicines & Current Risk Badge */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                  <Pill className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{patient.medications.length} active medicines</span>
                </div>

                <RiskBadge
                  level={patient.riskLevel}
                  size="sm"
                  score={patient.polypharmacyScore}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      {selectedPatient && (
        <div className="sticky bottom-6 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-black/50 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-200 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
              {selectedPatient.name.charAt(0)}
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Selected for Consultation:</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                {selectedPatient.name} ({selectedPatient.age}y {selectedPatient.gender}) •{" "}
                <span className="text-teal-700 dark:text-teal-400 font-bold">{selectedPatient.medications.length} medicines</span>
              </div>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-teal-600/20 cursor-pointer"
          >
            <span>Continue to Overview</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
