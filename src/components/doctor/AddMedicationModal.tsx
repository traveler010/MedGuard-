'use client';

import React, { useState } from 'react';
import { Medication, Patient } from '@/data/mockPatients';
import {
  PlusCircle,
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onAddMedication: (med: Partial<Medication>) => void;
}

const COMMON_PRESETS = [
  { name: 'Acetaminophen (Tylenol)', dosage: '500 mg', route: 'Oral', frequency: 'q6h PRN', indication: 'Mild to moderate pain', category: 'Analgesic', safe: true },
  { name: 'Ibuprofen (Motrin/Advil)', dosage: '400 mg', route: 'Oral', frequency: 'TID with food', indication: 'Inflammation & joint pain', category: 'NSAID', safe: false, warning: 'CRITICAL: Severe GI bleeding hazard with Warfarin + acute kidney injury with Lisinopril!' },
  { name: 'Ciprofloxacin (Cipro)', dosage: '500 mg', route: 'Oral', frequency: 'BID x 7 days', indication: 'Urinary Tract Infection', category: 'Fluoroquinolone', safe: false, warning: 'HIGH RISK: Spikes Warfarin INR and prolongs QT interval.' },
  { name: 'Amoxicillin-Clavulanate', dosage: '875/125 mg', route: 'Oral', frequency: 'BID x 10 days', indication: 'Respiratory infection', category: 'Penicillin-class', safe: false, warning: 'ALLERGY CONTRAINDICATION: Patient has documented Penicillin allergy (Hives)!' },
  { name: 'Melatonin', dosage: '1 mg', route: 'Oral', frequency: 'QHS (Bedtime)', indication: 'Circadian sleep aid', category: 'Nutraceutical', safe: true },
];

export function AddMedicationModal({
  isOpen,
  onClose,
  patient,
  onAddMedication,
}: AddMedicationModalProps) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [indication, setIndication] = useState('');
  const [category, setCategory] = useState('');

  if (!isOpen) return null;

  // Real-time safety check against active patient regimen
  const checkSafety = () => {
    const lower = name.toLowerCase();
    if (!lower) return null;

    if (lower.includes('penicillin') || lower.includes('amoxicillin') || lower.includes('ampicillin') || lower.includes('augmentin')) {
      return {
        level: 'ALLERGY',
        message: 'CRITICAL ALLERGY ALERT: Patient is severely allergic to Penicillin (Hives documented in chart).',
      };
    }

    if (lower.includes('ibuprofen') || lower.includes('advil') || lower.includes('aleve') || lower.includes('naproxen') || lower.includes('meloxicam')) {
      return {
        level: 'HIGH_HAZARD',
        message: 'CONTRAINDICATED: NSAIDs precipitate acute renal failure in CKD 3b, spike Warfarin GI bleed risk, and cause hyperkalemia with Lisinopril/Spironolactone.',
      };
    }

    if (lower.includes('cipro') || lower.includes('levofloxacin')) {
      return {
        level: 'HIGH_HAZARD',
        message: 'INTERACTION ALERT: Fluoroquinolones potentiate Warfarin anticoagulant effect, elevating INR to toxic levels.',
      };
    }

    if (lower.includes('tylenol') || lower.includes('acetaminophen') || lower.includes('paracetamol')) {
      return {
        level: 'SAFE',
        message: 'Preferred safe analgesic. Safe when kept under 2,000 mg/day total daily dose.',
      };
    }

    if (lower.includes('melatonin')) {
      return {
        level: 'SAFE',
        message: 'Safe non-anticholinergic sleep alternative. Does not elevate fall risk in elderly.',
      };
    }

    return {
      level: 'NEUTRAL',
      message: 'MedGuard AI will automatically run pharmacokinetic collision scans once added.',
    };
  };

  const safetyResult = checkSafety();

  const handleSelectPreset = (preset: typeof COMMON_PRESETS[0]) => {
    setName(preset.name);
    setDosage(preset.dosage);
    setFrequency(preset.frequency);
    setIndication(preset.indication);
    setCategory(preset.category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage) return;

    onAddMedication({
      name,
      dosage,
      frequency,
      indication,
      category: category || 'Prescribed Therapy',
      route: 'Oral',
      timingSlot: 'morning',
      prescriber: 'Dr. Sarah Al-Mansoor',
      dateStarted: new Date().toISOString().split('T')[0],
      pillColor: '#38bdf8',
      pillShape: 'round',
      pillVisualDescription: 'Newly added prescription tablet',
      withFood: 'anytime',
      acbScore: 0,
      fallSedationScore: 0,
      beersCriteriaFlag: false,
      renalAdjustmentNeeded: false,
      isActive: true,
      patientPlainName: name,
      patientWhy: indication || 'Therapeutic medication',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Screen & Prescribe New Medication
              </h3>
              <p className="text-[11px] text-slate-500">
                Real-time safety interaction checker for {patient.name}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Quick preset chips */}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
              Quick Test Presets (Common Scenarios):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PRESETS.map((preset, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    name === preset.name
                      ? 'bg-teal-50 border-teal-300 text-teal-800 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {preset.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Drug Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Medication Name & Formulation *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acetaminophen, Ibuprofen, Ciprofloxacin..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white"
            />
          </div>

          {/* Real-time safety alert box */}
          {safetyResult && (
            <div
              className={`p-3 rounded-xl border text-xs animate-in fade-in duration-200 ${
                safetyResult.level === 'ALLERGY' || safetyResult.level === 'HIGH_HAZARD'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : safetyResult.level === 'SAFE'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-start gap-2">
                {safetyResult.level === 'ALLERGY' || safetyResult.level === 'HIGH_HAZARD' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : safetyResult.level === 'SAFE' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block">
                    {safetyResult.level === 'ALLERGY'
                      ? 'PATIENT ALLERGY BLOCK'
                      : safetyResult.level === 'HIGH_HAZARD'
                      ? 'CRITICAL POLYPHARMACY CONTRAINDICATION'
                      : safetyResult.level === 'SAFE'
                      ? 'MEDGUARD VERIFIED SAFE'
                      : 'PRE-SCREENING ACTIVE'}
                  </span>
                  <p className="mt-0.5 leading-relaxed">{safetyResult.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Dosage & Frequency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Dosage *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 500 mg"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Frequency
              </label>
              <input
                type="text"
                placeholder="e.g. Once daily, BID"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white"
              />
            </div>
          </div>

          {/* Indication */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Clinical Indication / Reason
            </label>
            <input
              type="text"
              placeholder="e.g. Acute pain, Osteoarthritis flare"
              value={indication}
              onChange={(e) => setIndication(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={safetyResult?.level === 'ALLERGY'}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Confirm & Add Prescription
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
