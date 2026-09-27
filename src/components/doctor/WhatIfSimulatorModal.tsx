'use client';

import React, { useState } from 'react';
import { Patient, SIMULATOR_CANDIDATE_DRUGS, SimulatorCandidateDrug } from '@/data/mockPatients';
import { RiskMeter } from '@/components/RiskMeter';
import { RiskBadge } from '@/components/RiskBadge';
import {
  SlidersHorizontal,
  X,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onApplySimulation: (removedMedIds: string[], addedCandidateDrugs: SimulatorCandidateDrug[]) => void;
}

export function WhatIfSimulatorModal({
  isOpen,
  onClose,
  patient,
  onApplySimulation,
}: WhatIfSimulatorModalProps) {
  // Track disabled (deprescribed) med IDs in the simulation
  const [removedMedIds, setRemovedMedIds] = useState<string[]>([]);
  // Track candidate drugs added in simulation
  const [addedCandidates, setAddedCandidates] = useState<SimulatorCandidateDrug[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');

  if (!isOpen) return null;

  // Real-time recalculation of simulated score
  let simulatedScore = patient.polypharmacyScore;

  // Deduct points for removed medications based on their risk factors
  removedMedIds.forEach((id) => {
    const med = patient.medications.find((m) => m.id === id);
    if (!med) return;
    
    // High-impact interaction drugs
    if (med.genericName.toLowerCase().includes('fluconazole')) simulatedScore -= 18;
    else if (med.genericName.toLowerCase().includes('diphenhydramine')) simulatedScore -= 16;
    else if (med.genericName.toLowerCase().includes('furosemide')) simulatedScore -= 12;
    else if (med.genericName.toLowerCase().includes('spironolactone')) simulatedScore -= 10;
    else if (med.genericName.toLowerCase().includes('omeprazole')) simulatedScore -= 6;
    else if (med.genericName.toLowerCase().includes('naproxen')) simulatedScore -= 15;
    else if (med.genericName.toLowerCase().includes('oxybutynin')) simulatedScore -= 24;
    else if (med.genericName.toLowerCase().includes('zolpidem')) simulatedScore -= 22;
    else simulatedScore -= 5;
  });

  // Add points for candidate drugs added
  addedCandidates.forEach((cand) => {
    if (cand.category === 'NSAID') {
      simulatedScore += 22; // massive hazard with CKD / ACEi / Warfarin
    } else if (cand.category === 'Fluoroquinolone Antibiotic') {
      simulatedScore += 16;
    } else if (cand.category === '1st-Gen Antihistamine') {
      simulatedScore += 18;
    } else {
      simulatedScore += 2; // benign drug like Tylenol or Melatonin
    }
  });

  simulatedScore = Math.max(10, Math.min(100, simulatedScore));
  const delta = simulatedScore - patient.polypharmacyScore;

  const handleToggleRemove = (medId: string) => {
    setRemovedMedIds((prev) =>
      prev.includes(medId) ? prev.filter((id) => id !== medId) : [...prev, medId]
    );
  };

  const handleAddCandidate = () => {
    if (!selectedCandidateId) return;
    const cand = SIMULATOR_CANDIDATE_DRUGS.find((c) => c.id === selectedCandidateId);
    if (cand && !addedCandidates.some((c) => c.id === cand.id)) {
      setAddedCandidates((prev) => [...prev, cand]);
      setSelectedCandidateId('');
    }
  };

  const handleRemoveCandidate = (id: string) => {
    setAddedCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const handleReset = () => {
    setRemovedMedIds([]);
    setAddedCandidates([]);
    setSelectedCandidateId('');
  };

  const handleApply = () => {
    onApplySimulation(removedMedIds, addedCandidates);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                "What-If" Deprescribing & Prescription Simulator
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Sandbox Mode
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Safely simulate adding or discontinuing medications to project real-time risk score deltas.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Comparison Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-sm items-center">
            
            {/* Baseline Score */}
            <div className="text-center p-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Baseline Risk Score
              </div>
              <div className="text-3xl font-extrabold font-mono text-slate-100 mt-1">
                {patient.polypharmacyScore}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
              <div className="mt-1">
                <RiskBadge level={patient.riskLevel} size="sm" />
              </div>
            </div>

            {/* Delta Indicator */}
            <div className="flex flex-col items-center justify-center border-y md:border-y-0 md:border-x border-slate-700/80 py-3 md:py-1">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Projected Net Delta
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {delta < 0 ? (
                  <span className="text-xl font-bold font-mono text-emerald-400 flex items-center">
                    <TrendingDown className="w-5 h-5 mr-1" />
                    {delta} Pts
                  </span>
                ) : delta > 0 ? (
                  <span className="text-xl font-bold font-mono text-rose-400 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-1" />
                    +{delta} Pts
                  </span>
                ) : (
                  <span className="text-lg font-bold font-mono text-slate-300">
                    No Change
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {delta < 0
                  ? 'Favorable safety improvement'
                  : delta > 0
                  ? 'Hazard escalated!'
                  : 'Toggle drugs below'}
              </div>
            </div>

            {/* Simulated Score Gauge */}
            <div className="flex flex-col items-center justify-center p-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Simulated Outcome
              </div>
              <div className="flex items-baseline gap-1 font-mono">
                <span
                  className={`text-4xl font-extrabold ${
                    simulatedScore < 40
                      ? 'text-emerald-400'
                      : simulatedScore < 70
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {simulatedScore}
                </span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
              <div className="mt-1">
                <RiskBadge
                  level={
                    simulatedScore < 40 ? 'LOW' : simulatedScore < 70 ? 'MODERATE' : 'HIGH'
                  }
                  size="sm"
                />
              </div>
            </div>

          </div>

          {/* Section 1: Deprescribe existing medications */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                1. Test Deprescribing Existing Medications ({removedMedIds.length} Discontinued)
              </h3>
              <span className="text-[11px] text-slate-500">
                Click any medication to toggle its removal from the regimen
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {patient.medications.map((med) => {
                const isRemoved = removedMedIds.includes(med.id);

                return (
                  <button
                    key={med.id}
                    onClick={() => handleToggleRemove(med.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isRemoved
                        ? 'bg-rose-50 border-rose-300 text-rose-900 opacity-60 line-through'
                        : 'bg-white border-slate-200 hover:border-teal-400 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: med.pillColor }}
                        />
                        {med.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {med.dosage} • {med.indication}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isRemoved
                          ? 'bg-rose-200 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isRemoved ? 'Removed' : 'Active'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Test adding new candidate medications */}
          <div className="pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
              2. Screen a New Candidate Medication Before Prescribing
            </h3>

            <div className="flex flex-col sm:flex-row gap-2.5 mb-3">
              <select
                value={selectedCandidateId}
                onChange={(e) => setSelectedCandidateId(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-teal-500"
              >
                <option value="">Select a prospective medication to test...</option>
                {SIMULATOR_CANDIDATE_DRUGS.map((cand) => (
                  <option key={cand.id} value={cand.id}>
                    {cand.name} ({cand.category})
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddCandidate}
                disabled={!selectedCandidateId}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add to Simulation
              </button>
            </div>

            {/* List of Added Candidate Drugs */}
            {addedCandidates.length > 0 && (
              <div className="space-y-2">
                {addedCandidates.map((cand) => (
                  <div
                    key={cand.id}
                    className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-amber-950 flex items-center gap-2">
                        <span>{cand.name}</span>
                        <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded font-mono">
                          {cand.defaultDose}
                        </span>
                      </div>
                      
                      {cand.typicalInteractions.length > 0 && (
                        <div className="mt-1 text-rose-700 text-[11px] font-medium space-y-0.5">
                          {cand.typicalInteractions.map((inter, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                              <span>Hazardous interaction with {inter.withDrug}: {inter.mechanism}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveCandidate(cand.id)}
                      className="p-1 rounded-md text-amber-700 hover:text-rose-700 hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-white text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Sandbox
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Apply Simulation to Care Plan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
