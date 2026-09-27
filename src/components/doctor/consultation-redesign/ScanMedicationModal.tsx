"use client";

import React, { useState } from "react";
import { ConsultationMedication } from "./types";
import {
  Camera,
  Upload,
  X,
  Sparkles,
  CheckCircle2,
  FileText,
  AlertCircle,
  Loader2,
  Plus,
} from "lucide-react";

interface ScanMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScannedMedications: (meds: ConsultationMedication[]) => void;
}

export function ScanMedicationModal({
  isOpen,
  onClose,
  onAddScannedMedications,
}: ScanMedicationModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedPreview, setScannedPreview] = useState<ConsultationMedication[] | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedPreview([
        {
          id: `scan-${Date.now()}-1`,
          name: "Amlodipine Besylate",
          dose: "5 mg",
          frequency: "Once daily in the morning",
          scheduledTime: "08:00 AM",
          startDate: "27 Sep 2026",
          status: "Active",
          importantNotes: "Detected from scanned prescription bottle label #RX-88412",
          category: "Calcium Channel Blocker",
          purposePlain: "Lowers high blood pressure",
          patientExplanation: "Relaxes blood vessels so blood flows more smoothly.",
        },
        {
          id: `scan-${Date.now()}-2`,
          name: "Hydrochlorothiazide (HCTZ)",
          dose: "12.5 mg",
          frequency: "Once daily in the morning",
          scheduledTime: "08:00 AM",
          startDate: "27 Sep 2026",
          status: "Active",
          importantNotes: "Detected from scanned pharmacy summary sheet",
          category: "Thiazide Diuretic",
          purposePlain: "Helps rid the body of extra salt and fluid",
          patientExplanation: "Takes extra fluid out of your body to keep blood pressure down.",
        },
      ]);
    }, 1200);
  };

  const handleConfirmAdd = () => {
    if (scannedPreview) {
      onAddScannedMedications(scannedPreview);
      setScannedPreview(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden space-y-5 p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Scan Medication List
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Phase 1 UI Preview — Optical prescription intake
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Body */}
        {!scannedPreview ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center space-y-3 bg-slate-50/50 dark:bg-slate-850/50">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Position prescription document or medicine bottle in camera view
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Supports multi-prescription printouts, pharmacy pill bottle labels, and discharge summary sheets.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scanning label text...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Simulate Document Scan</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong>Notice: </strong>
              Phase 1 provides the UI scanning workflow. Automated OCR and computer vision parsing will be integrated in subsequent phases.
            </div>
          </div>
        ) : (
          /* Scanned Preview Results */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Detected 2 Medications from Label:
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                100% Match
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {scannedPreview.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {item.name}
                    </span>
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                      {item.dose}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {item.frequency} • {item.scheduledTime}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setScannedPreview(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Scan Again
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Regimen</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
