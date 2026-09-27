"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/components/Toast";

interface UploadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadReportModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadReportModalProps) {
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulateUpload = (fileName: string) => {
    setSelectedFileName(fileName);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Save report into localStorage so it is immediately reflected in Medical Reports & Dashboard
      try {
        const raw = localStorage.getItem("medguard_patient_reports");
        const existing = raw ? JSON.parse(raw) : [];
        const newReport = {
          id: `rep-${Date.now()}`,
          name: fileName,
          uploadDate: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          type: "Blood Test / Lab",
          fileSize: "2.1 MB",
          summary: "Comprehensive laboratory metabolic panel and CBC report.",
          extractedValues: [
            { label: "Blood Pressure", value: "120/80 mmHg" },
            { label: "Haemoglobin", value: "13.2 g/dL" },
            { label: "Blood Count", value: "Normal" },
            { label: "Fasting Glucose", value: "98 mg/dL" },
            { label: "Kidney eGFR", value: "58 mL/min" },
          ],
        };
        const updated = [newReport, ...existing];
        localStorage.setItem("medguard_patient_reports", JSON.stringify(updated));
        window.dispatchEvent(new Event("medguard_report_updated"));
      } catch (err) {
        console.warn("Error updating reports in localStorage:", err);
      }

      showToast(
        "Report Processed",
        `Extracted key health metrics from ${fileName}`,
        "success"
      );
      onSuccess();
      onClose();
    }, 1200);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSimulateUpload(file.name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative space-y-6 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="space-y-1 pr-8">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
            Health Documentation
          </span>
          <h3
            id="upload-modal-title"
            className="text-2xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            Upload Medical Report
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Upload your latest lab tests or diagnostic report to automatically refresh your health metrics.
          </p>
        </div>

        {/* Upload Zone */}
        {isProcessing ? (
          <div className="py-12 px-6 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border-2 border-dashed border-teal-500/50 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-10 h-10 text-teal-600 dark:text-teal-400 animate-spin" />
            <div className="space-y-1">
              <p className="font-bold text-slate-900 dark:text-white text-base">
                Analyzing Report...
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Extracting Blood Pressure, Haemoglobin, Blood Count, and Glucose values
              </p>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) {
                handleSimulateUpload(file.name);
              }
            }}
            className={`py-10 px-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
              isDragging
                ? "border-teal-500 bg-teal-50/60 dark:bg-teal-950/30 scale-[1.01]"
                : "border-slate-300 dark:border-slate-700 hover:border-teal-500/80 bg-slate-50/50 dark:bg-slate-800/30"
            }`}
          >
            <input
              type="file"
              id="file-upload"
              accept="application/pdf,image/*,.pdf,.png,.jpg,.jpeg"
              onChange={handleFileInput}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Drag and drop your file here, or{" "}
                <span className="text-teal-600 dark:text-teal-400 underline">
                  browse files
                </span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Supports PDF, PNG, JPG (up to 10MB)
              </p>
            </label>
          </div>
        )}

        {/* Quick Sample Action */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Or test with a sample file:
          </p>
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleSimulateUpload("Lab_Panel_Sep2026.pdf")}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-between transition cursor-pointer disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Comprehensive_Blood_Panel_Sep2026.pdf
            </span>
            <span className="text-teal-600 dark:text-teal-400 font-extrabold text-[11px]">
              Use Sample →
            </span>
          </button>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
          <span>Protected by MedGuard HIPAA protocol</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
