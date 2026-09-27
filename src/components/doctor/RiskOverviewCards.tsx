'use client';

import React from 'react';
import { Patient } from '@/data/mockPatients';
import { RiskMeter } from '@/components/RiskMeter';
import { RiskBadge } from '@/components/RiskBadge';
import {
  AlertCircle,
  Brain,
  Footprints,
  Workflow,
  Sparkles,
  Info,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface RiskOverviewCardsProps {
  patient: Patient;
  simulatedScore?: number;
  originalScore?: number;
}

export function RiskOverviewCards({
  patient,
  simulatedScore,
  originalScore,
}: RiskOverviewCardsProps) {
  const currentScore = simulatedScore !== undefined ? simulatedScore : patient.polypharmacyScore;
  const isSimulated = simulatedScore !== undefined && simulatedScore !== originalScore;

  // Interactions count by severity
  const highInteractions = patient.interactions.filter((i) => i.severity === 'HIGH').length;
  const modInteractions = patient.interactions.filter((i) => i.severity === 'MODERATE').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Master Polypharmacy Risk Gauge Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
        {isSimulated && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-xl tracking-wider uppercase flex items-center gap-1 shadow-xs">
            <Sparkles className="w-2.5 h-2.5" /> What-If Simulated
          </div>
        )}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Polypharmacy Score
            </span>
            <RiskBadge
              level={
                currentScore < 40 ? 'LOW' : currentScore < 70 ? 'MODERATE' : 'HIGH'
              }
              size="sm"
            />
          </div>
          <RiskMeter
            score={currentScore}
            previousScore={isSimulated ? originalScore : undefined}
            size="md"
          />
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600 font-medium">
            {currentScore >= 70
              ? 'Urgent deprescribing protocol recommended.'
              : currentScore >= 40
              ? 'Moderate clinical review required.'
              : 'Regimen is pharmacologically stable.'}
          </p>
        </div>
      </div>

      {/* 2. Drug-Drug Interaction Breakdown Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Drug-Drug Interactions
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/70 border border-rose-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold text-rose-900">Critical / High Severity</span>
              </div>
              <span className="text-sm font-bold font-mono text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200">
                {highInteractions}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-bold text-amber-900">Moderate Severity</span>
              </div>
              <span className="text-sm font-bold font-mono text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200">
                {modInteractions}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total Concomitant Regimen:</span>
          <span className="font-bold text-slate-800 font-mono">
            {patient.medications.length} Medications
          </span>
        </div>
      </div>

      {/* 3. Anticholinergic Cognitive Burden (ACB) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Anticholinergic Burden (ACB)
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              patient.totalAcbScore >= 3 ? 'bg-rose-50 text-rose-600' : 'bg-teal-50 text-teal-600'
            }`}>
              <Brain className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-extrabold font-mono ${
              patient.totalAcbScore >= 3 ? 'text-rose-600' : patient.totalAcbScore >= 1 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {patient.totalAcbScore}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ 3+ (Hazard Threshold)</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Beers Criteria 2023 Flags:</span>
              <span className={`font-bold font-mono ${
                patient.medications.filter(m => m.beersCriteriaFlag).length > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {patient.medications.filter(m => m.beersCriteriaFlag).length} Drugs Flagged
              </span>
            </div>
            <div className="text-[11px] text-slate-500 leading-snug">
              {patient.totalAcbScore >= 3
                ? 'High risk of acute delirium, memory decline & anticholinergic toxicity.'
                : 'Cognitive burden within acceptable geriatric threshold.'}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>STOPP/START v3 Criteria Monitored</span>
        </div>
      </div>

      {/* 4. Sedation & Fall Risk Index */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sedative & Fall Index
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              patient.fallRiskScore >= 7 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
            }`}>
              <Footprints className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl font-extrabold font-mono ${
              patient.fallRiskScore >= 7 ? 'text-rose-600' : patient.fallRiskScore >= 4 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {patient.fallRiskScore}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ 10 (Critical Fall Risk)</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Cumulative CNS Sedation:</span>
              <span className="font-bold text-slate-800 font-mono">
                {patient.sedationIndex} / 10
              </span>
            </div>
            <div className="text-[11px] text-slate-500 leading-snug">
              {patient.cascades.length > 0 ? (
                <span className="text-amber-700 font-medium flex items-center gap-1">
                  <Workflow className="w-3 h-3 text-amber-600" />
                  Prescribing cascade detected
                </span>
              ) : (
                'No active prescribing cascades detected.'
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Renal Adjustments:</span>
          <span className="font-bold text-amber-700 font-mono">
            {patient.medications.filter(m => m.renalAdjustmentNeeded).length} Requiring Review
          </span>
        </div>
      </div>

    </div>
  );
}
