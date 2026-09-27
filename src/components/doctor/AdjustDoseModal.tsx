'use client';

import React, { useState } from 'react';
import { Medication } from '@/data/mockPatients';
import { Sliders, X, Check, ArrowRight } from 'lucide-react';

interface AdjustDoseModalProps {
  isOpen: boolean;
  onClose: () => void;
  medication: Medication | null;
  onSaveDose: (medId: string, newDose: string, newFrequency: string, isTapering: boolean) => void;
}

export function AdjustDoseModal({
  isOpen,
  onClose,
  medication,
  onSaveDose,
}: AdjustDoseModalProps) {
  if (!isOpen || !medication) return null;

  const [dose, setDose] = useState(medication.dosage);
  const [frequency, setFrequency] = useState(medication.frequency);
  const [isTapering, setIsTapering] = useState(medication.isTapering || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDose(medication.id, dose, frequency, isTapering);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Titrate or Taper Dose
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {medication.name}
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
          
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Adjust Dosage
            </label>
            <input
              type="text"
              required
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Dosing Frequency & Schedule
            </label>
            <input
              type="text"
              required
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-teal-500 bg-white"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center gap-2.5">
            <input
              type="checkbox"
              id="taper-checkbox"
              checked={isTapering}
              onChange={(e) => setIsTapering(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
            />
            <label htmlFor="taper-checkbox" className="text-slate-800 font-medium cursor-pointer">
              Mark as <strong>Active Gradual Taper Protocol</strong> (e.g. 50% dose step-down over 7 days)
            </label>
          </div>

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
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs cursor-pointer"
            >
              Save Titration
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
