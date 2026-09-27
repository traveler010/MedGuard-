'use client';

import React from 'react';
import { Patient } from '@/data/mockPatients';
import {
  Activity,
  Heart,
  Droplets,
  AlertTriangle,
  UserCheck,
  Calendar,
  FileCheck2,
  Clock,
  Phone,
} from 'lucide-react';

interface PatientHeaderProps {
  patient: Patient;
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  // Highlighting lab anomalies
  const egfrIsLow = patient.eGFR < 60;
  const kIsHigh = patient.potassium > 5.0;
  const inrIsHigh = (patient.inr ?? 0) > 3.0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        
        {/* Patient Identity & Primary Info */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            {patient.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {patient.name}
              </h1>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                MRN: {patient.mrn}
              </span>
              <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {patient.age} yrs • {patient.gender} • DOB: {patient.dob}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                {patient.primaryDoctor}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Reviewed: {patient.lastReviewDate}
              </span>
              {patient.caregiverName && (
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Caregiver: {patient.caregiverName} {patient.caregiverPhone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Clinical Vitals & Lab Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/70">
          
          {/* Blood Pressure */}
          <div className="px-2.5 py-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-500" /> Blood Pressure
            </div>
            <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">
              {patient.bloodPressure}
            </div>
          </div>

          {/* eGFR Renal Clearance */}
          <div className={`px-2.5 py-1 rounded-lg ${egfrIsLow ? 'bg-amber-50/80' : ''}`}>
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Droplets className={`w-3 h-3 ${egfrIsLow ? 'text-amber-600' : 'text-teal-500'}`} /> eGFR (Renal)
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-xs font-bold font-mono ${egfrIsLow ? 'text-amber-700' : 'text-slate-800'}`}>
                {patient.eGFR}
              </span>
              <span className="text-[10px] text-slate-500">mL/min</span>
              {egfrIsLow && (
                <span className="text-[9px] font-bold px-1 rounded bg-amber-200/70 text-amber-800">
                  CKD 3b
                </span>
              )}
            </div>
          </div>

          {/* Serum Potassium */}
          <div className={`px-2.5 py-1 rounded-lg ${kIsHigh ? 'bg-rose-50/80' : ''}`}>
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Activity className={`w-3 h-3 ${kIsHigh ? 'text-rose-600' : 'text-emerald-500'}`} /> Potassium (K+)
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-xs font-bold font-mono ${kIsHigh ? 'text-rose-700' : 'text-slate-800'}`}>
                {patient.potassium}
              </span>
              <span className="text-[10px] text-slate-500">mEq/L</span>
              {kIsHigh && (
                <span className="text-[9px] font-bold px-1 rounded bg-rose-200/70 text-rose-800">
                  High
                </span>
              )}
            </div>
          </div>

          {/* INR or Creatinine */}
          <div className={`px-2.5 py-1 rounded-lg ${inrIsHigh ? 'bg-rose-50/80' : ''}`}>
            <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <AlertTriangle className={`w-3 h-3 ${inrIsHigh ? 'text-rose-600' : 'text-slate-400'}`} /> 
              {patient.inr !== undefined ? 'INR (Target 2-3)' : 'Creatinine'}
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`text-xs font-bold font-mono ${inrIsHigh ? 'text-rose-700 font-extrabold' : 'text-slate-800'}`}>
                {patient.inr !== undefined ? patient.inr : `${patient.creatinine} mg/dL`}
              </span>
              {inrIsHigh && (
                <span className="text-[9px] font-bold px-1 rounded bg-rose-200/70 text-rose-800 animate-pulse">
                  Supratherapeutic!
                </span>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Allergies & Diagnoses tags */}
      <div className="pt-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Diagnoses */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
            Active Diagnoses:
          </span>
          {patient.diagnoses.map((diag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60"
            >
              {diag}
            </span>
          ))}
        </div>

        {/* Known Allergies */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
            Allergies:
          </span>
          {patient.allergies.map((allg, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200/70 flex items-center gap-1"
            >
              <AlertTriangle className="w-2.5 h-2.5" />
              {allg}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}
