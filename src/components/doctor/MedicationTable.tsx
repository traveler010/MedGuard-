'use client';

import React, { useState } from 'react';
import { Medication } from '@/data/mockPatients';
import {
  Pill,
  Search,
  Filter,
  AlertTriangle,
  Brain,
  Droplets,
  CheckCircle2,
  Trash2,
  Sliders,
  Sparkles,
  Info,
  Clock,
  MoreVertical,
} from 'lucide-react';

interface MedicationTableProps {
  medications: Medication[];
  onDeprescribe: (medId: string) => void;
  onAdjustDose: (med: Medication) => void;
}

export function MedicationTable({
  medications,
  onDeprescribe,
  onAdjustDose,
}: MedicationTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBeers, setFilterBeers] = useState(false);
  const [filterRenal, setFilterRenal] = useState(false);
  const [filterHighAcb, setFilterHighAcb] = useState(false);

  const filtered = medications.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.indication.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterBeers && !m.beersCriteriaFlag) return false;
    if (filterRenal && !m.renalAdjustmentNeeded) return false;
    if (filterHighAcb && m.acbScore === 0) return false;

    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden mb-6">
      
      {/* Header and Filter Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            Active Polypharmacy Medication Regimen
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {medications.length} Prescriptions
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full pharmacokinetic overview, renal thresholds, Beers criteria, and anticholinergic scores.
          </p>
        </div>

        {/* Search & Filter Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search drug or diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-slate-50/50 w-48 sm:w-56 transition-all"
            />
          </div>

          {/* Quick Filters */}
          <button
            onClick={() => setFilterBeers(!filterBeers)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              filterBeers
                ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Beers Flags ({medications.filter((m) => m.beersCriteriaFlag).length})
          </button>

          <button
            onClick={() => setFilterRenal(!filterRenal)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              filterRenal
                ? 'bg-amber-50 text-amber-700 border-amber-200 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Renal Check ({medications.filter((m) => m.renalAdjustmentNeeded).length})
          </button>

          <button
            onClick={() => setFilterHighAcb(!filterHighAcb)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              filterHighAcb
                ? 'bg-teal-50 text-teal-700 border-teal-200 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            High ACB ({medications.filter((m) => m.acbScore > 0).length})
          </button>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200/80">
            <tr>
              <th className="py-3 px-4">Medication & Class</th>
              <th className="py-3 px-3">Dosage & Frequency</th>
              <th className="py-3 px-3">Clinical Indication</th>
              <th className="py-3 px-3">Prescriber</th>
              <th className="py-3 px-3 text-center">ACB Score</th>
              <th className="py-3 px-3">Safety Flags</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((med) => {
              return (
                <tr
                  key={med.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Name and Pill Cue */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs shrink-0"
                        style={{ backgroundColor: med.pillColor }}
                        title={`Appearance: ${med.pillVisualDescription}`}
                      />
                      <div>
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          {med.name}
                          {med.isTapering && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-semibold">
                              Tapering
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {med.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Dosage & Route */}
                  <td className="py-3.5 px-3">
                    <div className="font-mono font-bold text-slate-800">
                      {med.dosage} ({med.route})
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {med.frequency}
                    </div>
                  </td>

                  {/* Indication */}
                  <td className="py-3.5 px-3">
                    <span className="font-medium text-slate-800">
                      {med.indication}
                    </span>
                    <div className="text-[10px] text-slate-400">
                      Started: {med.dateStarted}
                    </div>
                  </td>

                  {/* Prescriber */}
                  <td className="py-3.5 px-3 text-slate-600">
                    <div className="line-clamp-1">{med.prescriber}</div>
                  </td>

                  {/* ACB Score Badge */}
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center font-mono font-bold text-[11px] w-6 h-6 rounded-lg ${
                        med.acbScore >= 3
                          ? 'bg-rose-100 text-rose-800 font-extrabold border border-rose-300'
                          : med.acbScore >= 1
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                      title={
                        med.acbScore >= 3
                          ? 'Critical anticholinergic score (delirium/fall risk)'
                          : `ACB Score: ${med.acbScore}`
                      }
                    >
                      {med.acbScore}
                    </span>
                  </td>

                  {/* Safety Flags */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap items-center gap-1">
                      {med.beersCriteriaFlag && (
                        <span
                          className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-200 flex items-center gap-1 cursor-help"
                          title={med.beersRationale}
                        >
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Beers 2023
                        </span>
                      )}

                      {med.renalAdjustmentNeeded && (
                        <span
                          className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200 flex items-center gap-1 cursor-help"
                          title={med.renalNote}
                        >
                          <Droplets className="w-2.5 h-2.5" />
                          Renal Check
                        </span>
                      )}

                      {med.fallSedationScore >= 2 && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                          Sedative ({med.fallSedationScore}/3)
                        </span>
                      )}

                      {!med.beersCriteriaFlag && !med.renalAdjustmentNeeded && med.acbScore === 0 && (
                        <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Stable
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onAdjustDose(med)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                        title="Adjust Dose or Schedule"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeprescribe(med.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold border border-rose-200/80 transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
                        title="Simulate or enact deprescribing protocol"
                      >
                        <Trash2 className="w-3 h-3" />
                        Deprescribe
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
  );
}
