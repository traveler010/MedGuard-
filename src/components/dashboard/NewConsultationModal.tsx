'use client';

import React, { useState } from 'react';
import { Patient } from '@/data/mockPatients';
import { RiskBadge } from '@/components/RiskBadge';
import {
  Stethoscope,
  X,
  Search,
  ArrowRight,
  Sparkles,
  User,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface NewConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onStartConsult: (patient: Patient, consultationType: string) => void;
}

export function NewConsultationModal({
  isOpen,
  onClose,
  patients,
  onStartConsult,
}: NewConsultationModalProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [consultType, setConsultType] = useState('Comprehensive Polypharmacy Audit');
  const [notes, setNotes] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.mrn.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPatient) {
      onStartConsult(selectedPatient, consultType);
      onClose();
    }
  };

  const consultOptions = [
    'Comprehensive Polypharmacy Audit',
    'Post-Hospitalization Medication Reconciliation',
    'Post-Fall Sedative & Anticholinergic Review',
    'Renal Clearance & eGFR Dose Titration',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Initiate Clinical Consultation
              </h3>
              <p className="text-xs text-slate-500">
                Select patient and consultation objective for MediQX AI review.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Patient Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700">
                Select Patient Record *
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {patients.length} loaded records
              </span>
            </div>

            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter patient by name or MRN..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-teal-500 bg-slate-50/50"
              />
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-1.5 bg-slate-50/30">
              {filteredPatients.map((p) => {
                const isSelected = p.id === selectedPatientId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-50/70 border-teal-400 shadow-2xs font-semibold'
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                        {p.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-slate-900 font-bold">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {p.age}y • {p.mrn} • {p.medications.length} meds
                        </div>
                      </div>
                    </div>
                    <RiskBadge level={p.riskLevel} size="sm" score={p.polypharmacyScore} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Consultation Type */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">
              Consultation Objective *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {consultOptions.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setConsultType(opt)}
                  className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer text-xs font-semibold ${
                    consultType === opt
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Clinical Notes / Pre-consult comment */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Physician Preliminary Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Patient reporting severe morning grogginess and unstable gait after recent OTC sleeping aid..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Launch Consultation Cockpit</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
