'use client';

import React, { useState } from 'react';
import { Patient } from '@/data/mockPatients';
import {
  UserPlus,
  X,
  Heart,
  Droplets,
  Activity,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePatient: (patient: Patient) => void;
}

export function AddPatientModal({
  isOpen,
  onClose,
  onSavePatient,
}: AddPatientModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>(70);
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [mrn, setMrn] = useState(`MG-${Math.floor(10000 + Math.random() * 90000)}`);
  const [bloodPressure, setBloodPressure] = useState('138/84 mmHg');
  const [eGFR, setEGFR] = useState<number | ''>(48);
  const [potassium, setPotassium] = useState<number | ''>(4.6);
  const [diagnosesText, setDiagnosesText] = useState('Hypertension, Osteoarthritis');
  const [allergiesText, setAllergiesText] = useState('No Known Drug Allergies');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age) return;

    const parsedAge = Number(age);
    const parsedEgfr = Number(eGFR) || 60;
    const isHighRisk = parsedEgfr < 45 || parsedAge > 75;

    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      mrn,
      name,
      age: parsedAge,
      gender,
      dob: '1956-01-01',
      weightKg: 70,
      heightCm: 168,
      bloodPressure,
      heartRate: 72,
      eGFR: parsedEgfr,
      creatinine: parsedEgfr < 50 ? 1.5 : 1.0,
      potassium: Number(potassium) || 4.5,
      allergies: allergiesText.split(',').map((s) => s.trim()).filter(Boolean),
      diagnoses: diagnosesText.split(',').map((s) => s.trim()).filter(Boolean),
      primaryDoctor: 'Dr. Sharma, MD',
      lastReviewDate: new Date().toISOString().split('T')[0],
      lastConsultation: 'Just registered',
      polypharmacyScore: isHighRisk ? 74 : 36,
      riskLevel: isHighRisk ? 'HIGH' : 'LOW',
      totalAcbScore: 1,
      fallRiskScore: 3,
      sedationIndex: 2,
      medications: [
        {
          id: `med-${Date.now()}-1`,
          name: 'Amlodipine Besylate',
          genericName: 'Amlodipine',
          dosage: '5 mg',
          route: 'Oral',
          frequency: 'Once daily morning',
          timingSlot: 'morning',
          prescriber: 'Dr. Sharma',
          indication: 'Essential Hypertension',
          dateStarted: new Date().toISOString().split('T')[0],
          category: 'Calcium Channel Blocker',
          pillColor: '#ffffff',
          pillShape: 'round',
          pillVisualDescription: 'White round tablet',
          withFood: 'anytime',
          acbScore: 0,
          fallSedationScore: 0,
          beersCriteriaFlag: false,
          renalAdjustmentNeeded: false,
          isActive: true,
          patientPlainName: 'Blood Pressure Pill',
          patientWhy: 'Controls blood pressure.',
        },
      ],
      interactions: [],
      cascades: [],
      recommendations: [],
    };

    onSavePatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Register New Patient
              </h3>
              <p className="text-xs text-slate-500">
                Create new clinical profile for polypharmacy monitoring.
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
          
          {/* Full Name & MRN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Chandra"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Medical Record Number (MRN)
              </label>
              <input
                type="text"
                required
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono bg-slate-50"
              />
            </div>
          </div>

          {/* Age & Gender & BP */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Age *
              </label>
              <input
                type="number"
                required
                min={18}
                max={110}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Female' | 'Male')}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white cursor-pointer"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Blood Pressure
              </label>
              <input
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white font-mono"
              />
            </div>
          </div>

          {/* eGFR & Potassium */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-teal-600" />
                eGFR (mL/min)
              </label>
              <input
                type="number"
                placeholder="e.g. 48"
                value={eGFR}
                onChange={(e) => setEGFR(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {Number(eGFR) < 60 ? 'CKD Stage threshold flagged' : 'Normal renal filtration'}
              </span>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                Potassium (K+ mEq/L)
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 4.6"
                value={potassium}
                onChange={(e) => setPotassium(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Normal target: 3.5 - 5.0 mEq/L
              </span>
            </div>
          </div>

          {/* Active Diagnoses */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Active Diagnoses (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Hypertension, Osteoarthritis, T2D, Chronic Insomnia"
              value={diagnosesText}
              onChange={(e) => setDiagnosesText(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white"
            />
          </div>

          {/* Known Allergies */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Known Drug Allergies
            </label>
            <input
              type="text"
              placeholder="e.g. Penicillin, Sulfa Drugs, NKDA"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
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
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Register Patient & Initialize Chart</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
