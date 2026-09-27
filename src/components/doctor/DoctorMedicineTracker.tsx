"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pill,
  Clock,
  AlertTriangle,
  History,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight,
  ShieldCheck,
  Activity,
  Eye,
  X,
  RefreshCw,
} from "lucide-react";
import {
  DOCTOR_PATIENT_DIRECTORY,
  PatientCurrentMedicine,
  MedicineStatus,
  getStoredPatientMedicines,
  getPatientWorkspace,
  DoctorPatientDirectoryItem,
} from "@/data/mockDoctorPortal";

interface DoctorMedicineTrackerProps {
  initialPatientId?: string;
  onNavigateToHistory?: (patientId: string) => void;
}

export function DoctorMedicineTracker({
  initialPatientId = "pat-2", // Default to Priya Sharma per example
  onNavigateToHistory,
}: DoctorMedicineTrackerProps) {
  const router = useRouter();

  // Active patient selected for monitoring
  const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatientId);
  const [medicines, setMedicines] = useState<PatientCurrentMedicine[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Get active patient directory profile
  const activePatient: DoctorPatientDirectoryItem = useMemo(() => {
    return (
      DOCTOR_PATIENT_DIRECTORY.find((p) => p.id === selectedPatientId) ||
      DOCTOR_PATIENT_DIRECTORY[0]
    );
  }, [selectedPatientId]);

  // Load medicines for active patient from shared store
  const refreshMedicines = () => {
    const list = getStoredPatientMedicines(selectedPatientId);
    setMedicines(list);
  };

  useEffect(() => {
    refreshMedicines();

    const handleUpdate = () => {
      refreshMedicines();
    };

    window.addEventListener("medguard_medicines_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    // Efficient 3-second live polling so doctor sees updates automatically without manual refresh
    const pollInterval = setInterval(() => {
      refreshMedicines();
    }, 3000);

    return () => {
      window.removeEventListener("medguard_medicines_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      clearInterval(pollInterval);
    };
  }, [selectedPatientId]);

  // Check if patient has missed or repeatedly skipped medicines
  const hasMissedOrSkippedMedicines = useMemo(() => {
    const hasMissed = medicines.some(
      (m) =>
        m.status.includes("Missed") ||
        m.statusType === "missed"
    );
    const hasMultipleSkipped =
      medicines.filter(
        (m) => m.status.includes("Skipped") || m.statusType === "skipped"
      ).length >= 1;
    const workspace = getPatientWorkspace(selectedPatientId);
    const lowAdherence = workspace.adherencePercentage < 85;

    return hasMissed || hasMultipleSkipped || lowAdherence || activePatient.attentionNeeded;
  }, [medicines, selectedPatientId, activePatient]);

  const workspaceData = useMemo(() => {
    return getPatientWorkspace(selectedPatientId);
  }, [selectedPatientId]);

  const getStatusBadgeStyle = (statusStr: string) => {
    if (statusStr.includes("Taken")) {
      return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    }
    if (statusStr.includes("Missed")) {
      return "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800";
    }
    if (statusStr.includes("Skipped")) {
      return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
    return "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800";
  };

  const handleOpenHistory = () => {
    if (onNavigateToHistory) {
      onNavigateToHistory(selectedPatientId);
    } else {
      setShowHistoryModal(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Selector Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {DOCTOR_PATIENT_DIRECTORY.map((p) => {
            const isSelected = p.id === selectedPatientId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPatientId(p.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-500"
                }`}
              >
                <span>{p.name}</span>
                {p.attentionNeeded && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <Link
          href={`/doctor/patients/${selectedPatientId}`}
          className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 shrink-0 self-start sm:self-auto"
        >
          <span>Open Full Chart</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* PATIENT HEADER & MONITORING STATUS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              PATIENT: {activePatient.name}
            </span>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {activePatient.name}
              </h2>
              <span className="text-xs text-slate-400 font-semibold">
                {activePatient.age}y • {activePatient.gender}
              </span>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                  activePatient.riskLevel === "HIGH"
                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
                }`}
              >
                {activePatient.riskLevel} Risk
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Condition: {activePatient.primaryCondition} • Real-time patient reminder telemetry
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Adherence: {workspaceData.adherencePercentage}%</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsRefreshing(true);
                refreshMedicines();
                setTimeout(() => setIsRefreshing(false), 400);
              }}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
              title="Refresh live status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            DOCTOR ATTENTION INDICATOR: Missed / Repeatedly Skipped Medicines
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {hasMissedOrSkippedMedicines && (
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
            <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Medication adherence requires attention.</span>
            </div>

            <button
              type="button"
              onClick={handleOpenHistory}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-amber-100 dark:hover:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/80 font-bold text-xs transition cursor-pointer self-start sm:self-auto shrink-0 flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5" />
              <span>View Medication History</span>
            </button>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TODAY'S MEDICATIONS (DOCTOR TRACKER VIEW)
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today&apos;s Medications
            </h3>
            <span className="text-[11px] text-slate-400">
              Live Patient Reminder Status • Refreshes Automatically
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            {medicines.map((med) => (
              <div
                key={med.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-850/30 transition"
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Scheduled Time */}
                  <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-mono font-bold text-xs shrink-0">
                    {med.scheduledTime}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {med.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {med.dose} • {med.frequency}
                    </p>
                    {med.instructions && (
                      <p className="text-[11px] text-slate-400 italic">
                        Instructions: {med.instructions}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="self-end sm:self-auto shrink-0 flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${getStatusBadgeStyle(
                      med.status
                    )}`}
                  >
                    {med.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={handleOpenHistory}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>View Medication History</span>
            </button>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MEDICATION HISTORY MODAL (PREVIOUS DATES)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-0.5">
                  Adherence Timeline
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Medication History — {activePatient.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Previous Dates & History */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {workspaceData.history.map((h) => (
                <div
                  key={h.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-400 w-24 shrink-0">
                      {h.timelineLabel}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {h.statusSymbol} {h.medicineName} ({h.dose})
                    </span>
                  </div>

                  <span
                    className={`font-bold px-2.5 py-1 rounded-lg text-xs ${
                      h.status === "Taken"
                        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        : h.status === "Missed"
                        ? "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {h.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">
                Observational adherence records • No automated diagnosis
              </span>

              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 text-white text-xs font-bold transition cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
