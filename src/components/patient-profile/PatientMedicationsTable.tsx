"use client";

import React, { useState, useMemo } from "react";
import {
  Pill,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";
import { Medication, RiskLevel } from "@/data/mockPatients";
import { RiskBadge } from "@/components/RiskBadge";

interface PatientMedicationsTableProps {
  medications: Medication[];
  onSelectMedication: (medication: Medication) => void;
  onAddMedication: () => void;
  onEditMedication: (medication: Medication) => void;
  onDiscontinueMedication: (medId: string) => void;
}

export function PatientMedicationsTable({
  medications,
  onSelectMedication,
  onAddMedication,
  onEditMedication,
  onDiscontinueMedication,
}: PatientMedicationsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<"ALL" | "HIGH" | "MODERATE" | "LOW">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "DISCONTINUED">("ALL");

  // Helper to determine single medication risk
  const getMedRisk = (med: Medication): RiskLevel => {
    if (med.beersCriteriaFlag || med.acbScore >= 2 || med.fallSedationScore >= 2) {
      return "HIGH";
    }
    if (med.acbScore === 1 || med.renalAdjustmentNeeded) {
      return "MODERATE";
    }
    return "LOW";
  };

  // Helper to compute duration string
  const computeDuration = (startDate: string) => {
    try {
      const start = new Date(startDate);
      const now = new Date();
      const diffMonths = Math.max(
        1,
        (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
      );
      if (diffMonths >= 12) {
        return `${(diffMonths / 12).toFixed(1)} yrs`;
      }
      return `${diffMonths} mos`;
    } catch {
      return "Ongoing";
    }
  };

  // Filtered list
  const filteredMeds = useMemo(() => {
    return medications.filter((med) => {
      const matchesSearch =
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.indication.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category.toLowerCase().includes(searchQuery.toLowerCase());

      const medRisk = getMedRisk(med);
      const matchesRisk = filterRisk === "ALL" || medRisk === filterRisk;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && med.isActive) ||
        (statusFilter === "DISCONTINUED" && !med.isActive);

      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [medications, searchQuery, filterRisk, statusFilter]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Top Table Toolbar */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Current Medications</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {medications.length} total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any row to open the clinical side drawer for deep pharmacodynamics and risks
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search medication..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50 dark:bg-slate-800/60"
            />
          </div>

          {/* Risk Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterRisk("ALL")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                filterRisk === "ALL"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterRisk("HIGH")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                filterRisk === "HIGH"
                  ? "bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-400 shadow-2xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              High
            </button>
            <button
              onClick={() => setFilterRisk("MODERATE")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                filterRisk === "MODERATE"
                  ? "bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-400 shadow-2xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Mod
            </button>
          </div>

          {/* Add Medication Button */}
          <button
            onClick={onAddMedication}
            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      {filteredMeds.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mx-auto flex items-center justify-center">
            <Pill className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">No medications match your filter</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or reset the risk filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterRisk("ALL");
              setStatusFilter("ALL");
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80 dark:border-slate-700/80">
              <tr>
                <th className="py-3.5 px-5">Medicine</th>
                <th className="py-3.5 px-3">Dosage</th>
                <th className="py-3.5 px-3">Frequency</th>
                <th className="py-3.5 px-3">Duration</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-3 text-center">Risk</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMeds.map((med) => {
                const medRisk = getMedRisk(med);
                const duration = computeDuration(med.dateStarted);

                return (
                  <tr
                    key={med.id}
                    onClick={() => onSelectMedication(med)}
                    className="hover:bg-teal-50/30 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                  >
                    {/* Medicine */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs font-bold text-xs"
                          style={{ backgroundColor: med.pillColor || "#0d9488" }}
                        >
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors text-sm">
                              {med.name}
                            </span>
                            {med.beersCriteriaFlag && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-600 text-white uppercase tracking-tight">
                                Beers
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {med.genericName} • {med.indication}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Dosage */}
                    <td className="py-4 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {med.dosage}
                    </td>

                    {/* Frequency */}
                    <td className="py-4 px-3 text-slate-600 dark:text-slate-400">
                      <span>{med.frequency}</span>
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-3 text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        {duration}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          med.isActive
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            med.isActive ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-500"
                          }`}
                        />
                        {med.isActive ? "Active" : "Discontinued"}
                      </span>
                    </td>

                    {/* Risk */}
                    <td className="py-4 px-3 text-center">
                      <RiskBadge level={medRisk} size="sm" />
                    </td>

                    {/* Actions */}
                    <td
                      className="py-4 px-5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditMedication(med)}
                          title="Edit Dosage/Frequency"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDiscontinueMedication(med.id)}
                          title="Discontinue Medication"
                          className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectMedication(med)}
                          className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-teal-700 dark:hover:text-teal-400 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
