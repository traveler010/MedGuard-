'use client';

import React, { useState } from 'react';
import { DrugInteraction, RiskLevel } from '@/data/mockPatients';
import { RiskBadge } from '@/components/RiskBadge';
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface InteractionMatrixProps {
  interactions: DrugInteraction[];
  onSimulateAction?: (drugName: string) => void;
}

export function InteractionMatrix({
  interactions,
  onSimulateAction,
}: InteractionMatrixProps) {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'HIGH' | 'MODERATE'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(interactions[0]?.id || null);

  const filtered = interactions.filter((i) => {
    if (filterSeverity === 'ALL') return true;
    return i.severity === filterSeverity;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      
      {/* Header & Filter Bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            Detected Drug-Drug Interactions
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {interactions.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mechanistic pharmacology, clinical sequelae, and guideline-backed mitigation steps.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilterSeverity('ALL')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              filterSeverity === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({interactions.length})
          </button>
          <button
            onClick={() => setFilterSeverity('HIGH')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              filterSeverity === 'HIGH'
                ? 'bg-white text-rose-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            High ({interactions.filter((i) => i.severity === 'HIGH').length})
          </button>
          <button
            onClick={() => setFilterSeverity('MODERATE')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              filterSeverity === 'MODERATE'
                ? 'bg-white text-amber-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Moderate ({interactions.filter((i) => i.severity === 'MODERATE').length})
          </button>
        </div>
      </div>

      {/* Interactions List */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center">
          <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
          <h4 className="text-sm font-semibold text-slate-800">No Interactions Found</h4>
          <p className="text-xs text-slate-500 mt-1">
            No active drug-drug interactions match the selected filter.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            const isHigh = item.severity === 'HIGH';

            return (
              <div
                key={item.id}
                className={`p-5 transition-all duration-200 ${
                  isHigh ? 'hover:bg-rose-50/20' : 'hover:bg-slate-50/40'
                } ${isExpanded ? (isHigh ? 'bg-rose-50/30' : 'bg-slate-50/30') : ''}`}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isHigh ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {isHigh ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {item.drug1}
                        </span>
                        <span className="text-xs font-bold text-slate-400">✕</span>
                        <span className="font-bold text-sm text-slate-900">
                          {item.drug2}
                        </span>
                        <RiskBadge level={item.severity as RiskLevel} size="sm" />
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                        {item.clinicalConsequence}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs animate-in fade-in duration-200">
                    
                    {/* Mechanism */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                      <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                        Pharmacokinetic Mechanism
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {item.mechanism}
                      </p>
                    </div>

                    {/* Clinical Consequence */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                      <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className={`w-3.5 h-3.5 ${isHigh ? 'text-rose-600' : 'text-amber-600'}`} />
                        Clinical Sequelae & Hazard
                      </div>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        {item.clinicalConsequence}
                      </p>
                      <div className="mt-2 text-[10px] text-slate-400 font-mono">
                        Source: {item.evidenceSource}
                      </div>
                    </div>

                    {/* Recommendation & Action */}
                    <div className={`p-3.5 rounded-xl border shadow-2xs flex flex-col justify-between ${
                      isHigh ? 'bg-rose-50/60 border-rose-200/80' : 'bg-amber-50/60 border-amber-200/80'
                    }`}>
                      <div>
                        <div className={`font-bold uppercase tracking-wider text-[10px] mb-1.5 ${
                          isHigh ? 'text-rose-900' : 'text-amber-900'
                        }`}>
                          Actionable Clinical Protocol
                        </div>
                        <p className={`font-medium leading-relaxed ${
                          isHigh ? 'text-rose-800' : 'text-amber-800'
                        }`}>
                          {item.recommendation}
                        </p>
                      </div>

                      {onSimulateAction && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-2">
                          <button
                            onClick={() => onSimulateAction(item.drug2)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] transition-all cursor-pointer shadow-2xs"
                          >
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            Simulate Removing {item.drug2.split(' ')[0]}
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
