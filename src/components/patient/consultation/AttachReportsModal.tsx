"use client";

import React, { useState, useEffect } from "react";
import { AttachedReportItem } from "./types";
import { X, FileText, Upload, CheckCircle2, Check, Plus, Calendar } from "lucide-react";

interface AttachReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alreadyAttachedIds: string[];
  onConfirmAttach: (reports: AttachedReportItem[]) => void;
}

export function AttachReportsModal({
  isOpen,
  onClose,
  alreadyAttachedIds,
  onConfirmAttach,
}: AttachReportsModalProps) {
  // Preloaded existing patient reports
  const [availableReports, setAvailableReports] = useState<AttachedReportItem[]>([
    {
      id: "rep-1",
      name: "Comprehensive_Metabolic_CBC_Panel.pdf",
      type: "Blood Test / Lab",
      date: "September 18, 2026",
      fileSize: "2.4 MB",
      isExisting: true,
    },
    {
      id: "rep-2",
      name: "Cardiology_INR_Coagulation_Review.pdf",
      type: "Cardiology Review",
      date: "August 24, 2026",
      fileSize: "1.1 MB",
      isExisting: true,
    },
    {
      id: "rep-3",
      name: "Renal_Ultrasound_Imaging_Report.pdf",
      type: "Imaging Report",
      date: "July 12, 2026",
      fileSize: "4.8 MB",
      isExisting: true,
    },
  ]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newReportName, setNewReportName] = useState("");
  const [newReportType, setNewReportType] = useState("Blood Report");

  useEffect(() => {
    setSelectedIds(alreadyAttachedIds);
  }, [alreadyAttachedIds, isOpen]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleUploadNewReport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newReport: AttachedReportItem = {
        id: `rep-new-${Date.now()}`,
        name: file.name,
        type: newReportType,
        date: "Today",
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        isExisting: false,
      };

      setAvailableReports((prev) => [newReport, ...prev]);
      setSelectedIds((prev) => [...prev, newReport.id]);
    }
  };

  const handleConfirm = () => {
    const chosen = availableReports.filter((r) => selectedIds.includes(r.id));
    onConfirmAttach(chosen);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden space-y-5 p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Share Medical Reports
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Select previously uploaded files or upload a new report
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

        {/* Upload a New Report Box */}
        <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload New Document</span>
            </span>
            <select
              value={newReportType}
              onChange={(e) => setNewReportType(e.target.value)}
              className="text-[11px] px-2 py-1 rounded-lg border border-teal-200 dark:border-teal-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
            >
              <option value="Blood Report">Blood report</option>
              <option value="Imaging Report">Imaging report</option>
              <option value="Prescription">Prescription</option>
              <option value="Other Medical Document">Other document</option>
            </select>
          </div>

          <label className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-dashed border-teal-400 dark:border-teal-600 bg-white/80 dark:bg-slate-900/80 hover:bg-white text-teal-700 dark:text-teal-300 text-xs font-bold transition cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Choose PDF or Image file from device</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleUploadNewReport}
              className="hidden"
            />
          </label>
        </div>

        {/* Existing Reports List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Previously Uploaded Reports
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {selectedIds.length} selected
            </span>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {availableReports.map((rep) => {
              const isSelected = selectedIds.includes(rep.id);
              return (
                <div
                  key={rep.id}
                  onClick={() => toggleSelect(rep.id)}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer text-xs ${
                    isSelected
                      ? "bg-teal-50 dark:bg-teal-950/60 border-teal-400 dark:border-teal-700 text-teal-900 dark:text-teal-200 font-bold"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                        isSelected
                          ? "bg-teal-600 border-teal-600 text-white"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>

                    <div className="truncate">
                      <p className="truncate font-extrabold">{rep.name}</p>
                      <p className="text-[11px] opacity-75 font-normal">
                        {rep.type} • {rep.date} ({rep.fileSize})
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Attach {selectedIds.length} Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}
