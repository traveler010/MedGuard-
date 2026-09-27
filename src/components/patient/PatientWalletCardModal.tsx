'use client';

import React from 'react';
import { Patient } from '@/data/mockPatients';
import {
  Printer,
  X,
  CreditCard,
  ShieldAlert,
  Phone,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

interface PatientWalletCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
}

export function PatientWalletCardModal({
  isOpen,
  onClose,
  patient,
}: PatientWalletCardModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header (Hidden in Print) */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80 no-print">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Printable Emergency Wallet Card
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Carry in wallet or display for Emergency Medical Services (EMS)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs btn-press"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Card</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 bg-white dark:bg-slate-900 overflow-y-auto">
          
          <div className="border-2 border-slate-800 dark:border-slate-700 rounded-2xl p-5 bg-white dark:bg-slate-950 shadow-xs max-w-md mx-auto">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-800 dark:border-slate-700 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-teal-700 dark:text-teal-400" />
                <span className="font-extrabold text-xs uppercase tracking-tight text-slate-900 dark:text-white">
                  EMERGENCY MEDICAL PASSPORT
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">
                MEDIQX VERIFIED
              </span>
            </div>

            {/* Patient Info */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Patient Name</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">{patient.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">MRN / DOB</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{patient.mrn} • {patient.dob}</span>
              </div>
            </div>

            {/* Critical Allergies Box */}
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 p-2 rounded-lg text-xs mb-3">
              <span className="text-[10px] font-extrabold uppercase text-rose-800 dark:text-rose-300 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" /> Known Allergies:
              </span>
              <span className="font-bold text-rose-900 dark:text-rose-200 text-[11px] mt-0.5 block">
                {patient.allergies.join(' • ')}
              </span>
            </div>

            {/* Active Medications List */}
            <div className="mb-3">
              <div className="text-[10px] uppercase font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                Active Medications & Dosages:
              </div>
              <div className="space-y-1 text-[11px] divide-y divide-slate-100 dark:divide-slate-800">
                {patient.medications.map((m) => (
                  <div key={m.id} className="pt-1 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{m.name}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono ml-1">{m.dosage}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {m.frequency.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Contacts Footer */}
            <div className="pt-2.5 border-t border-slate-300 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-400 grid grid-cols-2 gap-2">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Doctor:</span>
                <span>{patient.primaryDoctor}</span>
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">Caregiver SOS:</span>
                <span>{patient.caregiverName} {patient.caregiverPhone}</span>
              </div>
            </div>

          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mt-4 no-print">
            Click &quot;Print Card&quot; above to print a 3.5&quot; x 2&quot; wallet-sized card.
          </p>

        </div>

      </div>
    </div>
  );
}
