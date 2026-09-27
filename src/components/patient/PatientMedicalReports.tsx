"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Upload,
  Calendar,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Download,
} from "lucide-react";
import { useToast } from "@/components/Toast";

export interface StoredReport {
  id: string;
  name: string;
  uploadDate: string;
  type: string;
  fileSize?: string;
  summary?: string;
  extractedValues?: { label: string; value: string }[];
}

const DEFAULT_REPORTS: StoredReport[] = [
  {
    id: "rep-1",
    name: "Comprehensive_Metabolic_CBC_Panel.pdf",
    uploadDate: "September 18, 2026",
    type: "Blood Test / Lab",
    fileSize: "2.4 MB",
    summary: "Routine quarterly geriatric metabolic panel and complete blood count.",
    extractedValues: [
      { label: "Blood Pressure", value: "120/80 mmHg" },
      { label: "Haemoglobin", value: "13.2 g/dL" },
      { label: "Blood Count", value: "Normal (6.4 ×10⁹/L)" },
      { label: "Fasting Glucose", value: "98 mg/dL" },
      { label: "Kidney eGFR", value: "58 mL/min" },
    ],
  },
  {
    id: "rep-2",
    name: "Cardiology_INR_Coagulation_Review.pdf",
    uploadDate: "August 24, 2026",
    type: "Cardiology Review",
    fileSize: "1.1 MB",
    summary: "International Normalized Ratio (INR) monitoring for Warfarin therapy.",
    extractedValues: [
      { label: "INR Ratio", value: "2.4 (Target: 2.0 - 3.0)" },
      { label: "Platelets", value: "240 ×10⁹/L (Normal)" },
    ],
  },
];

interface PatientMedicalReportsProps {
  onUploadReport?: () => void;
  onReportsUpdated?: (count: number) => void;
}

export function PatientMedicalReports({
  onUploadReport,
  onReportsUpdated,
}: PatientMedicalReportsProps) {
  const { showToast } = useToast();
  const [reports, setReports] = useState<StoredReport[]>(DEFAULT_REPORTS);
  const [previewReport, setPreviewReport] = useState<StoredReport | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newReportName, setNewReportName] = useState("");
  const [newReportType, setNewReportType] = useState("Blood Test / Lab");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load from localStorage on mount (mock persistence)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("medguard_patient_reports");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setReports(parsed);
          onReportsUpdated?.(parsed.length);
        }
      }
    } catch {
      // ignore
    }
  }, [onReportsUpdated]);

  const saveReports = (newList: StoredReport[]) => {
    setReports(newList);
    onReportsUpdated?.(newList.length);
    try {
      localStorage.setItem("medguard_patient_reports", JSON.stringify(newList));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("medguard_report_updated"));
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = (id: string, name: string) => {
    const updated = reports.filter((r) => r.id !== id);
    saveReports(updated);
    showToast(
      "Report Removed",
      `"${name}" has been deleted from your records.`,
      "info"
    );
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName =
      selectedFile?.name ||
      newReportName.trim() ||
      `Lab_Report_${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}.pdf`;

    const newReport: StoredReport = {
      id: `rep-${Date.now()}`,
      name: finalName,
      uploadDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      type: newReportType,
      fileSize: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB` : "1.8 MB",
      summary: "Patient uploaded clinical documentation.",
      extractedValues: [
        { label: "Status", value: "Verified by MedGuard" },
        { label: "File Format", value: finalName.split(".").pop()?.toUpperCase() || "PDF" },
      ],
    };

    const updated = [newReport, ...reports];
    saveReports(updated);
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setNewReportName("");

    showToast(
      "Report Uploaded ✓",
      `Successfully added "${finalName}".`,
      "success"
    );
  };

  const handleRestoreSample = () => {
    saveReports(DEFAULT_REPORTS);
    showToast("Sample Restored", "Sample medical reports restored.", "info");
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-1">
            Documents & Records
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Recent Medical Reports
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Upload and view your diagnostic tests, lab panels, and physician notes.
          </p>
        </div>

        {reports.length > 0 && (
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Report</span>
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {reports.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-14 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              No recent medical reports uploaded.
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Add your latest lab work, prescription scans, or clinic summaries to keep your records current.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-xs cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Report</span>
            </button>

            <button
              type="button"
              onClick={handleRestoreSample}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 py-2 px-3 transition cursor-pointer"
            >
              Restore Sample Reports
            </button>
          </div>
        </div>
      ) : (
        /* REPORTS LIST (Visually Simple) */
        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {rep.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md text-[11px]">
                      {rep.type}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {rep.uploadDate}
                    </span>
                    {rep.fileSize && (
                      <>
                        <span>•</span>
                        <span>{rep.fileSize}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: View & Delete Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewReport(rep)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="View report details"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(rep.id, rep.name)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                  title="Delete report"
                  aria-label="Delete report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW REPORT PREVIEW MODAL */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative space-y-5 animate-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setPreviewReport(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-8 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                {previewReport.type}
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white break-words">
                {previewReport.name}
              </h3>
              <p className="text-xs text-slate-400">
                Uploaded on {previewReport.uploadDate} {previewReport.fileSize ? `• ${previewReport.fileSize}` : ""}
              </p>
            </div>

            {previewReport.summary && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                {previewReport.summary}
              </div>
            )}

            {previewReport.extractedValues && previewReport.extractedValues.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Document Summary
                </span>
                <div className="space-y-1.5">
                  {previewReport.extractedValues.map((v) => (
                    <div
                      key={v.label}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <span className="font-semibold text-slate-500 dark:text-slate-400">
                        {v.label}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {v.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewReport(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD REPORT MODAL (Supports common document/image formats in frontend UI) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative space-y-5 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-8 space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Upload Medical Report
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select a document or image from your device.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* File Input */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-center space-y-2">
                <input
                  type="file"
                  id="report-file-input"
                  accept="application/pdf,image/*,.pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setSelectedFile(f);
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="report-file-input"
                  className="cursor-pointer block space-y-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mx-auto mb-1.5">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-300 underline block">
                    {selectedFile ? selectedFile.name : "Choose a file (PDF, PNG, JPG)"}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Supported formats: PDF, JPG, PNG, DOC (up to 10MB)
                  </span>
                </label>
              </div>

              {/* Report Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Report Type
                </label>
                <select
                  value={newReportType}
                  onChange={(e) => setNewReportType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Blood Test / Lab">Blood Test / Lab</option>
                  <option value="Cardiology Review">Cardiology Review</option>
                  <option value="Imaging / X-Ray">Imaging / X-Ray</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="Prescription Scan">Prescription Scan</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
