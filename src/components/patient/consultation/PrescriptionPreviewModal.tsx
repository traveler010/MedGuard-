"use client";

import React from "react";
import { UploadedPrescriptionItem } from "./types";
import { X, FileText, Download, ShieldCheck, Clock, Trash2 } from "lucide-react";

interface PrescriptionPreviewModalProps {
  item: UploadedPrescriptionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
}

export function PrescriptionPreviewModal({
  item,
  isOpen,
  onClose,
  onRemove,
}: PrescriptionPreviewModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden space-y-4 p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white truncate max-w-[280px]">
                {item.name}
              </h3>
              <p className="text-[11px] text-slate-400">
                {item.fileSize} • Uploaded {item.uploadTime}
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

        {/* Preview Canvas */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-slate-50 dark:bg-slate-850 flex flex-col items-center justify-center min-h-[220px] text-center space-y-3">
          {item.dataUrl ? (
            <img
              src={item.dataUrl}
              alt={item.name}
              className="max-h-64 object-contain rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs"
            />
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-xs">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Prescription Document Preview
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {item.name} ({item.fileSize})
                </p>
              </div>
            </>
          )}

          {/* Status Label */}
          <div className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>Uploaded for doctor review</span>
          </div>
        </div>

        {/* Notice */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center">
          Your doctor will inspect this prescription image during your consultation review to verify dosages and active ingredients.
        </p>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              onRemove(item.id);
              onClose();
            }}
            className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Image</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 text-white text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
