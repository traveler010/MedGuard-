"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  MedicationAnalysisReportItem,
  recordDoctorReview,
} from "@/services/medicationAnalysisService";
import {
  runFullRegimenAnalysis,
  FullRegimenAnalysisResult,
} from "@/services/polypharmacyRiskEngine";
import { ClinicalPdfReportModal } from "@/components/patient/analyzer/ClinicalPdfReportModal";
import { useToast } from "@/components/Toast";
import {
  X,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Stethoscope,
  Pill,
  Clock,
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Send,
  MessageSquare,
  FileText,
  Sparkles,
  Info,
  HelpCircle,
  Upload,
} from "lucide-react";

interface DoctorMedicationRiskReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: MedicationAnalysisReportItem;
  consultationId?: string;
  onResponseSent?: (responseText: string) => void;
  onOpenUploadPrescription?: () => void;
}

export function DoctorMedicationRiskReviewModal({
  isOpen,
  onClose,
  report,
  consultationId,
  onResponseSent,
  onOpenUploadPrescription,
}: DoctorMedicationRiskReviewModalProps) {
  const { showToast } = useToast();

  const [clinicalResponse, setClinicalResponse] = useState(
    report.doctorReview?.clinicalNote || ""
  );
  const [selectedReviewType, setSelectedReviewType] = useState<
    "Agreed" | "Disagreed" | "Clinical Context Added" | "Information Requested" | "Reviewed"
  >(report.doctorReview?.status || "Agreed");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const fullRegimenResultToUse: FullRegimenAnalysisResult = useMemo(() => {
    if (report.fullRegimenResult) {
      return report.fullRegimenResult;
    }
    return runFullRegimenAnalysis(
      report.currentMedicines,
      report.patientAge,
      report.patientName,
      report.patientId
    );
  }, [report]);

  if (!isOpen) return null;

  const targetConsultationId = consultationId || report.consultationId || "con-2";

  // Quick Clinical Response Templates
  const handleApplyTemplate = (
    type: "Agreed" | "Disagreed" | "Clinical Context Added" | "Information Requested" | "Reviewed",
    templateText: string
  ) => {
    setSelectedReviewType(type);
    setClinicalResponse(templateText);
  };

  const handleSendDoctorResponse = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!clinicalResponse.trim()) {
      showToast("Response Required", "Please enter a clinical response for the patient.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      recordDoctorReview(report.id, targetConsultationId, {
        status: selectedReviewType,
        clinicalNote: clinicalResponse.trim(),
        doctorName: "Dr. Sarah Mitchell, MD",
      });

      if (onResponseSent) {
        onResponseSent(clinicalResponse.trim());
      }

      showToast(
        "Response Delivered",
        "Clinical review recorded and sent to patient's consultation.",
        "success"
      );
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Error", "Could not submit doctor response.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAskPatientClarification = () => {
    const clarificationText =
      "Please confirm the exact dose of your blood-thinning medication and whether you have experienced any dark stools or unusual bruising.";
    setSelectedReviewType("Information Requested");
    setClinicalResponse(clarificationText);
    showToast(
      "Question Prepared",
      "Clarification message loaded. Click 'Send Response' to transmit to patient chat.",
      "info"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full my-auto overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* MODAL HEADER (Requirement 16) */}
        <div className="p-4 sm:p-6 border-b border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-teal-600" />
                <span>MEDGUARD ANALYSIS: System-Generated Medication Risk Analysis</span>
              </span>
              <span className="text-xs text-slate-400">
                {report.date} • {report.timestamp}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Medication Risk Analysis Review
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cross-checked against {report.patientName}&apos;s complete medication list. The physician makes the final clinical decision.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsPdfModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Full PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer shrink-0"
              title="Close review"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL SCROLLABLE CONTENT */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* ━━━━━━━━━━━━━━━━━━ DOCTOR CLINICAL CROSS-CHECK SOURCES (Requirement 16) ━━━━━━━━━━━━━━━━━━ */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  Doctor Cross-Check Sources
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Compare MedGuard analysis findings with patient clinical record
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">1. Active Medication Regimen</span>
                <p className="font-bold text-slate-900 dark:text-white">{report.currentMedicinesCount} Current Medicines</p>
                <p className="text-[11px] text-slate-500 truncate">{report.currentMedicines.map((m) => m.name).join(", ")}</p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">2. Patient Reports</span>
                <p className="font-bold text-slate-900 dark:text-white">Labs &amp; Diagnostics</p>
                <p className="text-[11px] text-slate-500">CBC, Metabolic Panel, Vitals on file</p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">3. Patient Consultation</span>
                <p className="font-bold text-slate-900 dark:text-white">Case #{targetConsultationId}</p>
                <p className="text-[11px] text-slate-500">Reported symptoms &amp; clinical timeline</p>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">4. Uploaded Prescriptions</span>
                <p className="font-bold text-slate-900 dark:text-white">Authorized Rx Records</p>
                <p className="text-[11px] text-slate-500">Doctor-signed prescription sheets</p>
              </div>
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━ 1. PATIENT PROFILE & PROPOSED MEDICATION ━━━━━━━━━━━━━━━━━━ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Profile */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Patient Profile
                </span>
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                  Age: {report.patientAge} years
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {report.patientName}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Patient ID: {report.patientId} • Consultation ID: {targetConsultationId}
                </p>
              </div>

              <div className="space-y-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                  Current Medications ({report.currentMedicinesCount}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {report.currentMedicines.map((m) => (
                    <span
                      key={m.id}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                    >
                      {m.name} ({m.dose})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Proposed Medication */}
            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 dark:text-teal-300 block">
                  Proposed Medication
                </span>
                <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
                  {report.proposedMedication.duration} planned
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {report.proposedMedication.name}
                </h4>
                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  {report.proposedMedication.dose} • {report.proposedMedication.frequency}
                </p>
              </div>

              {report.proposedMedication.instructions && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-teal-200/50 dark:border-teal-800/50">
                  Instructions: &ldquo;{report.proposedMedication.instructions}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━ 2. RISK SUMMARY HERO ━━━━━━━━━━━━━━━━━━ */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 ${
              report.overallRisk === "HIGH"
                ? "bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100"
                : report.overallRisk === "MODERATE"
                ? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100"
                : "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider">
                {report.overallRisk === "HIGH" ? (
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                )}
                <span>Overall Risk: {report.overallRisk}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 font-mono">
                  Score: {report.overallRiskScore}/100
                </span>
              </div>

              <Link
                href={`/patient/analyzer?patientId=${report.patientId}&consultationId=${targetConsultationId}&role=doctor`}
                className="inline-flex items-center gap-1 text-xs font-bold underline hover:opacity-80"
                title="Deep dive in interactive analyzer workspace"
              >
                <span>View Full Analysis</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs sm:text-sm font-semibold leading-relaxed">
              {report.riskSummary}
            </p>

            <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200">
              <strong className="block text-slate-900 dark:text-white mb-0.5">Why this risk was detected:</strong>
              {report.whyFlagged}
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━ 3. INTERACTION DETAILS (Surfacing High-Priority First) ━━━━━━━━━━━━━━━━━━ */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              Flagged Interactions with Existing Medications
            </span>

            {report.detectedInteractions.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 text-slate-500">
                No verified drug-drug conflicts detected with the active regimen.
              </div>
            ) : (
              <div className="space-y-2.5">
                {report.detectedInteractions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {item.proposedMed} <span className="text-rose-500 font-bold">+</span> {item.existingMed}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            item.severity === "HIGH"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {item.severity}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.evidenceSource}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-rose-700 dark:text-rose-400">
                      Potential Risk: {item.riskTitle}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.clinicalImpact || item.clinicalMechanism}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ━━━━━━━━━━━━━━━━━━ 4. 5 CATEGORY BREAKDOWN ━━━━━━━━━━━━━━━━━━ */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              Risk Category Breakdown
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Category 1 */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  1. Drug Interaction
                </span>
                <span
                  className={`text-xs font-black uppercase ${
                    report.categories.drugInteraction.status === "HIGH" ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {report.categories.drugInteraction.status}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                  {report.categories.drugInteraction.summary}
                </p>
              </div>

              {/* Category 2 */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  2. Dependence Risk
                </span>
                <span
                  className={`text-xs font-black uppercase ${
                    report.categories.dependenceRisk.status === "HIGH" ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {report.categories.dependenceRisk.status}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                  {report.categories.dependenceRisk.summary}
                </p>
              </div>

              {/* Category 3 */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  3. Cumulative Side Effects
                </span>
                <span
                  className={`text-xs font-black uppercase ${
                    report.categories.sideEffectLoad.status === "HIGH" ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {report.categories.sideEffectLoad.status}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                  {report.categories.sideEffectLoad.summary}
                </p>
              </div>

              {/* Category 4 */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  4. Age Appropriateness (Beers)
                </span>
                <span
                  className={`text-xs font-black uppercase ${
                    report.categories.ageAppropriateness.status === "HIGH" ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {report.categories.ageAppropriateness.status}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                  {report.categories.ageAppropriateness.summary}
                </p>
              </div>

              {/* Category 5 */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-1 sm:col-span-2 lg:col-span-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  5. Duration Appropriateness
                </span>
                <span
                  className={`text-xs font-black uppercase ${
                    report.categories.durationAppropriateness.status === "HIGH" ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {report.categories.durationAppropriateness.status}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {report.categories.durationAppropriateness.summary}
                </p>
              </div>
            </div>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━ 5. VERIFIED SAFER OPTIONS ━━━━━━━━━━━━━━━━━━ */}
          {report.actionableOptions && report.actionableOptions.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Verified Actionable Options & Alternatives
              </span>
              <div className="space-y-2">
                {report.actionableOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {opt.recommendation}
                        </span>
                        {opt.isRecommended && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                        {opt.reason}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Source: {opt.sourceStatus}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleApplyTemplate(
                          "Clinical Context Added",
                          `Agree with alternative guidance. Switching to: ${opt.recommendation}. Reason: ${opt.reason}`
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-bold text-[11px] border border-teal-200 dark:border-teal-800 transition cursor-pointer shrink-0"
                    >
                      Use in Response
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━ 6. DOCTOR REVIEW & RESPONSE SECTION (Requirement 5, 6, 7) ━━━━━━━━━━━━━━━━━━ */}
          <div className="pt-4 border-t-2 border-dashed border-teal-500/30 dark:border-teal-500/20 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Doctor Review & Response
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Write your clinical assessment. This message is delivered directly into the patient&apos;s consultation chat.
                  </p>
                </div>
              </div>

              {/* Ask Patient Button (Requirement 7) */}
              <button
                type="button"
                onClick={handleAskPatientClarification}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Send clarification question to patient in this consultation"
              >
                <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                <span>Ask Patient Clarification</span>
              </button>
            </div>

            {/* Quick Template Chips (Requirement 5) */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Quick Clinical Opinions:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleApplyTemplate(
                      "Agreed",
                      "Agree with MedGuard analysis. Co-administration of Ibuprofen with Warfarin significantly multiplies gastrointestinal bleeding hazard. Discontinuing proposed NSAID; recommending Acetaminophen 500mg PRN for joint flare."
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                >
                  ✓ Agree with analysis
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleApplyTemplate(
                      "Disagreed",
                      "Reviewed risk warning. Co-prescription acceptable under close monitoring; patient has no GI history and stable INR. Proceeding with short 3-day course alongside PPI gastroprotection."
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition cursor-pointer"
                >
                  ✕ Disagree with analysis
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleApplyTemplate(
                      "Clinical Context Added",
                      "Patient has stable blood pressure on Lisinopril and therapeutic INR of 2.4. Topical Diclofenac or Acetaminophen provides sufficient knee relief with minimal systemic vascular burden."
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition cursor-pointer"
                >
                  + Add clinical context
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleApplyTemplate(
                      "Reviewed",
                      "Reviewed the medication risk report. I will reassess the current medication combination and discuss the findings with the patient."
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition cursor-pointer"
                >
                  📝 Reassess &amp; discuss with patient
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleApplyTemplate(
                      "Reviewed",
                      "Decision: Selected Acetaminophen 500mg every 6–8h PRN to avoid platelet inhibition while Warfarin anticoagulation is active."
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition cursor-pointer"
                >
                  Explain decision
                </button>
              </div>
            </div>

            {/* Doctor Response Textarea (Requirement 17) */}
            <form onSubmit={handleSendDoctorResponse} className="space-y-3">
              <textarea
                rows={4}
                value={clinicalResponse}
                onChange={(e) => setClinicalResponse(e.target.value)}
                placeholder="Add your clinical review or response..."
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs resize-none"
              />

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  {onOpenUploadPrescription && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenUploadPrescription();
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      title="Upload authorized prescription document"
                    >
                      <Upload className="w-3.5 h-3.5 text-teal-600" />
                      <span>Upload Prescription</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !clinicalResponse.trim()}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Response</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Clinical Decision-Support PDF Modal (Requirement 14, 16) */}
      <ClinicalPdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        result={fullRegimenResultToUse}
      />
    </div>
  );
}
