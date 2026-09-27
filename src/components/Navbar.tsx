'use client';

import React, { useState } from 'react';
import { Patient } from '@/data/mockPatients';
import { RiskBadge } from '@/components/RiskBadge';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  ShieldAlert,
  Stethoscope,
  HeartHandshake,
  SlidersHorizontal,
  FileText,
  User,
  ChevronDown,
  Bell,
  Sparkles,
  Printer,
  PlusCircle,
} from 'lucide-react';

interface NavbarProps {
  currentWorkflow: 'doctor' | 'patient';
  onWorkflowChange: (workflow: 'doctor' | 'patient') => void;
  patients: Patient[];
  activePatient: Patient;
  onSelectPatient: (patientId: string) => void;
  onOpenSimulator: () => void;
  onOpenReport: () => void;
  onOpenAddMed: () => void;
  onOpenWalletCard: () => void;
  isSimulating?: boolean;
}

export function Navbar({
  currentWorkflow,
  onWorkflowChange,
  patients,
  activePatient,
  onSelectPatient,
  onOpenSimulator,
  onOpenReport,
  onOpenAddMed,
  onOpenWalletCard,
  isSimulating = false,
}: NavbarProps) {
  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#090e17]/95 backdrop-blur-md transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20 ring-1 ring-white/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white" suppressHydrationWarning>
                  MEDI<span className="text-teal-600 dark:text-teal-400">QX</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/70 dark:border-teal-800/60">
                  <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" /> AI Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Polypharmacy Clinical Safety System
              </p>
            </div>
          </div>

          {/* Workflow Toggle (Clinician vs Patient/Caregiver) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <button
              onClick={() => onWorkflowChange('doctor')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentWorkflow === 'doctor'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Stethoscope className={`w-3.5 h-3.5 ${currentWorkflow === 'doctor' ? 'text-teal-600 dark:text-teal-400' : ''}`} />
              <span>Clinician Cockpit</span>
            </button>
            <button
              onClick={() => onWorkflowChange('patient')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                currentWorkflow === 'patient'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HeartHandshake className={`w-3.5 h-3.5 ${currentWorkflow === 'patient' ? 'text-teal-600 dark:text-teal-400' : ''}`} />
              <span>CareView (Patient & Family)</span>
            </button>
          </div>

          {/* Patient Switcher & Action buttons */}
          <div className="flex items-center gap-2.5">
            
            {/* Patient Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPatientDropdownOpen(!patientDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left shadow-2xs cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200 dark:border-slate-700">
                  {activePatient.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                    {activePatient.name}
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                      ({activePatient.age}y {activePatient.gender[0]})
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    MRN: {activePatient.mrn}
                  </div>
                </div>
                <RiskBadge level={activePatient.riskLevel} size="sm" showIcon={false} score={activePatient.polypharmacyScore} />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Patient Menu Dropdown */}
              {patientDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Switch Patient Record
                    </span>
                    <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400">
                      {patients.length} Loaded Cases
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                    {patients.map((pat) => (
                      <button
                        key={pat.id}
                        onClick={() => {
                          onSelectPatient(pat.id);
                          setPatientDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer ${
                          pat.id === activePatient.id ? 'bg-teal-50/60 dark:bg-teal-950/30' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {pat.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-slate-900 dark:text-white">
                              {pat.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {pat.age} yrs • {pat.medications.length} active meds • eGFR {pat.eGFR}
                            </div>
                          </div>
                        </div>
                        <RiskBadge level={pat.riskLevel} size="sm" showIcon={false} score={pat.polypharmacyScore} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clinician Specific Action Buttons */}
            {currentWorkflow === 'doctor' ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenSimulator}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSimulating
                      ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white shadow-xs'
                  }`}
                  title="Test adding or removing medications to simulate risk score changes"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">What-If Simulator</span>
                  {isSimulating && (
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  )}
                </button>

                <button
                  onClick={onOpenAddMed}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-500 hover:bg-teal-50/40 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
                  title="Screen a new prescription for interactions"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span className="hidden xl:inline">Check New Drug</span>
                </button>

                <button
                  onClick={onOpenReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
                  title="Generate Clinical Polypharmacy Consultation Report"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                  <span className="hidden xl:inline">Clinical Report</span>
                </button>
              </div>
            ) : (
              /* Patient / Caregiver Action Buttons */
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenWalletCard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all shadow-2xs cursor-pointer"
                  title="Print emergency medication wallet card"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Wallet Med-Card</span>
                </button>
              </div>
            )}

            {/* Theme Mode Toggle */}
            <ThemeToggle />

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                aria-label="Alerts"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      Active Safety Alerts ({activePatient.interactions.length + (activePatient.cascades.length > 0 ? 1 : 0)})
                    </span>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                    {activePatient.interactions.slice(0, 3).map((ddi) => (
                      <div
                        key={ddi.id}
                        className="p-2 rounded-lg bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 text-xs"
                      >
                        <div className="font-semibold text-rose-800 dark:text-rose-300">
                          {ddi.drug1} + {ddi.drug2}
                        </div>
                        <div className="text-[11px] text-rose-600 line-clamp-1 mt-0.5">
                          {ddi.clinicalConsequence}
                        </div>
                      </div>
                    ))}
                    {activePatient.cascades.length > 0 && (
                      <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-100 text-xs">
                        <div className="font-semibold text-amber-800">
                          Prescribing Cascade Alert
                        </div>
                        <div className="text-[11px] text-amber-700 line-clamp-1 mt-0.5">
                          {activePatient.cascades[0].primaryDrug} → {activePatient.cascades[0].secondaryDrug}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
