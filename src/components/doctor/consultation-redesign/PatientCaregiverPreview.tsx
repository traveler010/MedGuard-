"use client";

import React from "react";
import {
  ConsultationMedication,
  ProposedMedicineInput,
} from "./types";
import {
  Heart,
  Clock,
  Bell,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  Shield,
  HelpCircle,
  Eye,
} from "lucide-react";

interface PatientCaregiverPreviewProps {
  medications: ConsultationMedication[];
  proposedMedicine?: ProposedMedicineInput;
  patientName: string;
}

export function PatientCaregiverPreview({
  medications,
  proposedMedicine,
  patientName,
}: PatientCaregiverPreviewProps) {
  // Combine existing meds + newly proposed medicine (if populated)
  const previewItems = [...medications];

  if (proposedMedicine && proposedMedicine.name.trim().length > 0) {
    previewItems.push({
      id: "proposed-preview",
      name: proposedMedicine.name,
      dose: proposedMedicine.dose,
      frequency: proposedMedicine.frequency || "Once daily",
      scheduledTime: "08:00 AM", // standard default schedule
      status: "Active",
      category: "Newly Prescribed",
      purposePlain: proposedMedicine.name.toLowerCase().includes("acetaminophen")
        ? "Relieves mild to moderate pain and reduces fever"
        : proposedMedicine.name.toLowerCase().includes("amoxicillin")
        ? "Treats bacterial infection"
        : proposedMedicine.name.toLowerCase().includes("melatonin")
        ? "Restores healthy, natural nighttime sleep"
        : "Supports your daily recovery and wellness",
      patientExplanation:
        proposedMedicine.instructions ||
        "Take with a full glass of water. Follow the scheduled reminder times in your patient app.",
    });
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-7 space-y-6 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
            <Heart className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Patient & Caregiver View
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Friendly Preview
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This is the simplified, jargon-free medication schedule that {patientName} and their family caregivers will see in the MedGuard app.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full self-start sm:self-auto">
          Plain Language Mode
        </span>
      </div>

      {/* Medication Schedule Timeline */}
      <div className="space-y-4">
        {previewItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 italic">
            No medications currently scheduled for this patient.
          </div>
        ) : (
          previewItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800 hover:border-teal-500/50 transition-all space-y-3"
            >
              {/* Top Row: Time & Reminder Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>{item.scheduledTime || "08:00 AM"}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <Bell className="w-3.5 h-3.5 text-teal-600" />
                  <span>Reminder: Active Daily</span>
                </div>
              </div>

              {/* Medicine Name & Plain Purpose */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    {item.name}
                  </h4>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    ({item.dose})
                  </span>
                </div>

                <p className="text-sm font-bold text-teal-700 dark:text-teal-400">
                  &ldquo;{item.purposePlain || "Helps maintain overall health and recovery."}&rdquo;
                </p>
              </div>

              {/* Simple Friendly Instructions */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {item.patientExplanation ||
                    "Take with a glass of water at your scheduled time. Always take exactly as directed."}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Helpful Caregiver Note */}
      <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Caregiver Sync Enabled: </strong>
          Caregivers connected to {patientName}&apos;s profile will receive automated push alerts if a morning or evening scheduled dose is missed by more than 30 minutes.
        </p>
      </div>
    </div>
  );
}
