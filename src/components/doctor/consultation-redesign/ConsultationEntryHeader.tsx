"use client";

import React, { useState } from "react";
import {
  ConsultationPatientRecord,
  ConsultationMedication,
} from "./types";
import {
  User,
  Activity,
  Calendar,
  Clock,
  MessageSquare,
  Pill,
  ShieldCheck,
  ChevronDown,
  Play,
  PlusCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface ConsultationEntryHeaderProps {
  patient: ConsultationPatientRecord;
  allPatients: ConsultationPatientRecord[];
  onSelectPatient: (patient: ConsultationPatientRecord) => void;
  currentMedications: ConsultationMedication[];
  isConsultationStarted: boolean;
  onStartConsultation: () => void;
  onAddMedicineManually: () => void;
}

export function ConsultationEntryHeader({
  patient,
  allPatients,
  onSelectPatient,
  currentMedications,
  isConsultationStarted,
  onStartConsultation,
  onAddMedicineManually,
}: ConsultationEntryHeaderProps) {
  const [showPatientMenu, setShowPatientMenu] = useState(false);

  const hasMedications = currentMedications.length > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-7 space-y-6 transition-all">
      {/* Top Patient Header with Switcher and Start Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-700 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
            {patient.name.charAt(0)}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {patient.name}
              </h1>

              {/* Patient Selector Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPatientMenu(!showPatientMenu)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200/60 dark:border-slate-700"
                  title="Switch patient record"
                >
                  <span>Switch Patient</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showPatientMenu && (
                  <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50 divide-y divide-slate-100 dark:divide-slate-800">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Select Patient Record
                    </div>
                    {allPatients.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          onSelectPatient(p);
                          setShowPatientMenu(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs transition flex items-center justify-between cursor-pointer ${
                          p.id === patient.id
                            ? "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        <div>
                          <p className="font-bold">{p.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {p.age}y • {p.patientId} • {p.defaultMedications.length} meds
                          </p>
                        </div>
                        {p.id === patient.id && (
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Age: {patient.age}
              </span>
              <span>•</span>
              <span>Gender: {patient.gender}</span>
              <span>•</span>
              <span className="font-mono font-bold text-teal-700 dark:text-teal-400">
                ID: {patient.patientId}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {patient.primaryCondition}
              </span>
            </div>
          </div>
        </div>

        {/* Start Consultation CTA Button */}
        <div className="flex items-center gap-3">
          {!isConsultationStarted ? (
            <button
              type="button"
              onClick={onStartConsultation}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-800 hover:from-teal-700 hover:to-cyan-900 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer transform active:scale-[0.99]"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Consultation</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Clinical Consultation Active</span>
            </div>
          )}
        </div>
      </div>

      {/* 4-Panel Clinical Context Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Panel 1: Current Health Information Available from Reports */}
        <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Report Health Metrics</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400">Verified</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Blood Pressure:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {patient.vitals.bloodPressure}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Heart Rate:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {patient.vitals.heartRate}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">eGFR (Kidney):</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {patient.vitals.eGFR}
              </span>
            </div>
            {patient.vitals.hba1c && (
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">HbA1c:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {patient.vitals.hba1c}
                </span>
              </div>
            )}
            <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between text-[11px]">
              <span className="text-slate-400">Allergies:</span>
              <span className="font-semibold text-rose-700 dark:text-rose-400">
                {patient.vitals.allergies.join(", ") || "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Panel 2: Current Medications Status */}
        <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5" />
              <span>Current Regimen</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              {currentMedications.length} Meds
            </span>
          </div>

          {hasMedications ? (
            <div className="space-y-1.5">
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Regimen loaded automatically from patient records:
              </p>
              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                {currentMedications.map((m) => (
                  <div
                    key={m.id}
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between bg-white dark:bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800"
                  >
                    <span className="truncate max-w-[130px]">{m.name}</span>
                    <span className="text-[11px] text-teal-600 dark:text-teal-400 font-mono font-bold">
                      {m.dose}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 text-xs font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span>No previous medication record found</span>
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-400">
                Patient has no documented medication history on file.
              </p>
              <button
                type="button"
                onClick={onAddMedicineManually}
                className="w-full py-1.5 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Medication Manually</span>
              </button>
            </div>
          )}
        </div>

        {/* Panel 3: Previous Consultation Information */}
        <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Previous Consultation</span>
            </span>
            {patient.previousConsultation && (
              <span className="text-[10px] font-mono text-slate-400">
                {patient.previousConsultation.date}
              </span>
            )}
          </div>

          {patient.previousConsultation ? (
            <div className="space-y-1.5 text-xs">
              <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                {patient.previousConsultation.chiefComplaint}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
                {patient.previousConsultation.summary}
              </p>
              <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                Note by: {patient.previousConsultation.doctorName}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic pt-2">
              No previous consultations documented. This is the first recorded clinical session.
            </p>
          )}
        </div>

        {/* Panel 4: Current Appointment Information */}
        <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Current Appointment</span>
            </span>
            {patient.appointment && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {patient.appointment.status}
              </span>
            )}
          </div>

          {patient.appointment ? (
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  {patient.appointment.date} • {patient.appointment.time}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] font-medium">
                {patient.appointment.type}
              </p>
              <p className="text-[10px] text-slate-400">
                Location: {patient.appointment.location}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic pt-2">
              No active appointment scheduled for today.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
