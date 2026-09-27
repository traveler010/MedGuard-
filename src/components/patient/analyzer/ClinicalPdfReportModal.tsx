"use client";

import React, { useRef } from "react";
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Stethoscope,
  Pill,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  FileText,
  Activity,
} from "lucide-react";
import { FullRegimenAnalysisResult } from "@/services/polypharmacyRiskEngine";

interface ClinicalPdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: FullRegimenAnalysisResult;
}

export function ClinicalPdfReportModal({
  isOpen,
  onClose,
  result,
}: ClinicalPdfReportModalProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!reportRef.current) return;
    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>MedGuard_Clinical_Risk_Report_${result.patientName.replace(/\\s+/g, "_")}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 20px; font-size: 11pt; line-height: 1.5; }
            h1, h2, h3, h4 { margin-top: 0; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 10pt; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
            th { background-color: #f1f5f9; font-weight: bold; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 9pt; }
            .badge-high { background-color: #ffe4e6; color: #9f1239; border: 1px solid #fecdd3; }
            .badge-mod { background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
            .badge-low { background-color: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
            .header-strip { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f766e; padding-bottom: 12px; margin-bottom: 18px; }
            .section { margin-bottom: 20px; page-break-inside: avoid; }
            .section-title { font-size: 12pt; font-weight: bold; text-transform: uppercase; color: #0f766e; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 12px; }
            .doctor-signoff { border-top: 2px dashed #94a3b8; padding-top: 15px; margin-top: 25px; }
            @media print {
              body { margin: 10mm; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${reportRef.current.innerHTML}
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    try {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(reportHtml);
        printWindow.document.close();
        return;
      }
    } catch {}

    // Fallback for mobile Android Chrome / Safari pop-up block
    try {
      const blob = new Blob([reportHtml], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `MedGuard_Clinical_Risk_Report_${result.patientName.replace(/\\s+/g, "_")}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full my-auto overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* TOP ACTION TOOLBAR (Not in PDF) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Clinical Decision Support PDF Report
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Official Multi-Drug Regimen Evaluation Document • Non-Editable Patient Record
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-teal-600" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT CONTAINER */}
        <div className="overflow-y-auto p-6 sm:p-10 bg-white text-slate-900 font-sans text-xs sm:text-sm space-y-6">
          <div ref={reportRef} className="space-y-6 max-w-3xl mx-auto">
            {/* 1. DOCUMENT HEADER */}
            <div className="border-b-2 border-teal-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-teal-800 font-black text-lg tracking-tight">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  <span>MedGuard CDSS</span>
                  <span className="text-xs font-bold text-slate-400 border-l border-slate-300 pl-2">
                    Clinical Decision Support System
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Comprehensive Medication Risk Analysis Report
                </h1>
                <p className="text-xs text-slate-500">
                  Full Regimen Polypharmacy &amp; Pharmacodynamic Evaluation
                </p>
              </div>

              <div className="text-right text-xs space-y-0.5 sm:border-l sm:border-slate-200 sm:pl-4">
                <p className="font-bold text-slate-800">
                  Report ID: <span className="font-mono">{result.analysisId}</span>
                </p>
                <p className="text-slate-500">Date: {result.timestamp}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-extrabold uppercase">
                  Verified Clinical Record
                </span>
              </div>
            </div>

            {/* 2. PATIENT INFORMATION */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Patient Name
                </span>
                <strong className="text-slate-900 text-sm font-extrabold">
                  {result.patientName}
                </strong>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Patient Age
                </span>
                <strong className="text-slate-900 text-sm font-extrabold">
                  {result.patientAge} Years {result.ageAssessment.isElderly && "(Senior \u2265 65)"}
                </strong>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Patient ID
                </span>
                <strong className="text-slate-900 font-mono text-sm font-extrabold">
                  {result.patientId}
                </strong>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Total Active Meds
                </span>
                <strong className="text-teal-700 text-sm font-extrabold">
                  {result.totalMedicationsCount} Scheduled Medications
                </strong>
              </div>
            </div>

            {/* 3. OVERALL REGIMEN RISK SUMMARY */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border ${
                result.overallRisk === "HIGH"
                  ? "bg-rose-50 border-rose-300"
                  : result.overallRisk === "MODERATE"
                  ? "bg-amber-50 border-amber-300"
                  : "bg-emerald-50 border-emerald-300"
              } space-y-2`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-black/10">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Overall Medication Regimen Risk Level
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-black uppercase px-2.5 py-1 rounded-md text-white ${
                      result.overallRisk === "HIGH"
                        ? "bg-rose-700"
                        : result.overallRisk === "MODERATE"
                        ? "bg-amber-700"
                        : "bg-emerald-700"
                    }`}
                  >
                    {result.overallRisk} RISK
                  </span>
                  <span className="text-xs font-bold font-mono bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800">
                    Score: {result.overallRiskScore}/100
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                {result.overallExplanation}
              </p>
            </div>

            {/* 4. CURRENT MEDICATION PROFILE TABLE */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-800 pb-1 border-b border-slate-200">
                1. Complete Current Medication Profile ({result.totalMedicationsCount} Prescriptions)
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Medication Name</th>
                      <th className="p-2.5">Dose</th>
                      <th className="p-2.5">Frequency</th>
                      <th className="p-2.5">Schedule</th>
                      <th className="p-2.5">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {result.currentMeds.map((med, idx) => (
                      <tr key={med.id || idx} className="hover:bg-slate-50/80">
                        <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-2.5 font-bold text-slate-900">{med.name}</td>
                        <td className="p-2.5 font-mono">{med.dose}</td>
                        <td className="p-2.5">{med.frequency}</td>
                        <td className="p-2.5">{med.scheduleTime || "Daily"}</td>
                        <td className="p-2.5 text-slate-600">{med.duration || "Chronic"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. INTERACTION FINDINGS (PAIRWISE) */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-800 pb-1 border-b border-slate-200">
                2. Drug-Drug Interaction Findings Across Regimen
              </h3>
              {result.pairwiseInteractions.length === 0 ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                  \u2713 No high-priority or adverse drug-drug interactions detected among current medications.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {result.pairwiseInteractions.map((pair, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {pair.medA} <span className="text-teal-600 font-normal">\u2194</span> {pair.medB}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            pair.severity === "HIGH"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {pair.severity} RISK \u2022 {pair.riskCategory}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        <strong>Mechanism:</strong> {pair.explanation}
                      </p>
                      <p className="text-slate-600 text-[11px]">
                        <strong>Clinical Impact:</strong> {pair.clinicalImpact}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Evidence: {pair.evidenceSource}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 6. CUMULATIVE RISK CATEGORIES */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-800 pb-1 border-b border-slate-200">
                3. Cumulative Side-Effect &amp; Systemic Risk Load
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {result.cumulativeRisks.map((cum, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">{cum.category}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          cum.load === "HIGH"
                            ? "bg-rose-100 text-rose-800"
                            : cum.load === "MODERATE"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {cum.load}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {cum.explanation}
                    </p>
                    <p className="text-[10px] text-teal-700 font-semibold pt-1 border-t border-slate-200">
                      Guidance: {cum.clinicalGuidance}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. GERIATRIC AGE & BEERS CRITERIA */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-800">
                4. Age Appropriateness &amp; AGS Beers Criteria 2023 Assessment
              </h3>
              <p className="text-slate-800 font-semibold">{result.ageAssessment.summary}</p>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {result.ageAssessment.beersCriteriaNotes}
              </p>
            </div>

            {/* 8. DURATION & DOSING REVIEW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <span className="font-extrabold text-teal-800 block text-xs uppercase">
                  5. Medication Duration Review
                </span>
                <ul className="space-y-1 text-[11px] text-slate-700">
                  {result.durationReview.map((d, i) => (
                    <li key={i} className="flex justify-between gap-2 border-b border-slate-200/60 pb-1">
                      <span><strong>{d.medName}:</strong> {d.currentDuration}</span>
                      <span className="text-emerald-700 font-bold shrink-0">{d.appropriateness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <span className="font-extrabold text-teal-800 block text-xs uppercase">
                  6. Dose &amp; Frequency Review
                </span>
                <ul className="space-y-1 text-[11px] text-slate-700">
                  {result.doseFrequencyReview.map((d, i) => (
                    <li key={i} className="flex justify-between gap-2 border-b border-slate-200/60 pb-1">
                      <span><strong>{d.medName}:</strong> {d.dose} ({d.frequency})</span>
                      <span className="text-teal-700 font-bold shrink-0">{d.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 9. ACTIONABLE CLINICAL RECOMMENDATIONS */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-800 pb-1 border-b border-slate-200">
                7. Actionable Clinical Recommendations &amp; Safeguards
              </h3>
              <div className="space-y-2">
                {result.actionableRecommendations.map((opt, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-slate-900">{opt.recommendation}</strong>
                      <span className="text-[10px] font-bold text-teal-700 uppercase">
                        {opt.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">{opt.reason}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Source: {opt.sourceStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 10. DOCTOR SUMMARY */}
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-1 text-xs text-teal-950">
              <span className="font-black uppercase tracking-wide block">
                Summary for Attending Physician
              </span>
              <p className="leading-relaxed font-medium">
                {result.doctorSummary}
              </p>
            </div>

            {/* 11. DOCTOR REVIEW & CLINICAL SIGN-OFF BOX */}
            <div className="pt-4 border-t-2 border-slate-300 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Attending Physician Review &amp; Clinical Attestation
              </span>
              <div className="p-4 rounded-xl border border-dashed border-slate-300 min-h-[70px] text-xs text-slate-400 italic">
                Physician notes and consultation sign-off recorded in electronic health record consultation thread.
              </div>
              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2">
                <span>Clinical Decision Support System (CDSS) \u2022 Rule-Based Engine</span>
                <span>Protected Health Information \u2022 Strictly for Clinical Use</span>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/90 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>MedGuard Clinical Decision Support Document \u2022 Authenticated CDSS Engine</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 text-white font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
