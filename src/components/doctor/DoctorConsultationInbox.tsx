"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Send,
  User,
  Pill,
  FileText,
  Activity,
  ChevronRight,
  X,
  Stethoscope,
  Info,
  Calendar,
  Paperclip,
  Camera,
  Eye,
  RefreshCw,
  Trash2,
  Download,
  Printer,
  Check,
  Sparkles,
} from "lucide-react";
import {
  DoctorConsultationItem,
  ConsultationStatus,
  DoctorPrescriptionRecord,
  getStoredConsultations,
  updateDoctorConsultationResponse,
  sendDoctorConsultationResponse,
  setConsultationStatus,
} from "@/data/mockDoctorPortal";
import {
  readFileAsDataUrl,
  printPrescriptionDocument,
  downloadPrescriptionDocument,
  generateAuthorizedRxSvgDataUrl,
} from "@/services/prescriptionDocumentService";
import {
  getReportsForConsultation,
  MedicationAnalysisReportItem,
} from "@/services/medicationAnalysisService";
import { DoctorMedicationRiskReviewModal } from "./DoctorMedicationRiskReviewModal";
import { useToast } from "@/components/Toast";

interface DoctorConsultationInboxProps {
  initialPatientFilter?: string; // Optional: filter for a specific patient
  onSelectPatient?: (patientId: string) => void;
}

export function DoctorConsultationInbox({
  initialPatientFilter,
  onSelectPatient,
}: DoctorConsultationInboxProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [consultations, setConsultations] = useState<DoctorConsultationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ConsultationStatus>("ALL");
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);

  // Doctor response input
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Doctor prescription attachment state
  const [attachedPrescription, setAttachedPrescription] = useState<{
    file: File | null;
    fileName: string;
    fileType: string;
    fileSize: string;
    dataUrl: string;
  } | null>(null);

  // Document preview modal state
  const [previewingDoc, setPreviewingDoc] = useState<{
    fileName: string;
    dataUrl: string;
    fileType: string;
    doctorName?: string;
  } | null>(null);

  // Medication Risk Analysis reports for opened consultation
  const [medicationReports, setMedicationReports] = useState<MedicationAnalysisReportItem[]>([]);
  const [selectedReviewReport, setSelectedReviewReport] = useState<MedicationAnalysisReportItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Load consultations from shared local store
  const refreshConsultations = () => {
    const list = getStoredConsultations();
    setConsultations(list);
  };

  useEffect(() => {
    refreshConsultations();

    const handleUpdate = () => {
      refreshConsultations();
    };

    window.addEventListener("medguard_consultations_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("medguard_consultations_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Currently opened consultation
  const activeConsultation = useMemo(() => {
    if (!selectedConsultationId) return null;
    return consultations.find((c) => c.id === selectedConsultationId) || null;
  }, [consultations, selectedConsultationId]);

  // Sync medication risk reports when activeConsultation changes or on report updates
  useEffect(() => {
    if (activeConsultation) {
      const reports = getReportsForConsultation(activeConsultation.id);
      setMedicationReports(reports);
    } else {
      setMedicationReports([]);
    }

    const handleReportsUpdate = () => {
      if (activeConsultation) {
        const reports = getReportsForConsultation(activeConsultation.id);
        setMedicationReports(reports);
      }
    };

    window.addEventListener("medguard_medication_reports_updated", handleReportsUpdate);
    return () => {
      window.removeEventListener("medguard_medication_reports_updated", handleReportsUpdate);
    };
  }, [activeConsultation]);

  // Filter consultations based on search, status filter, and optional patient filter
  const filteredConsultations = useMemo(() => {
    return consultations.filter((item) => {
      if (initialPatientFilter && item.patientId !== initialPatientFilter) {
        return false;
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.patientName.toLowerCase().includes(q) ||
        item.mainSymptom.toLowerCase().includes(q) ||
        item.symptoms.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ? true : item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [consultations, searchQuery, statusFilter, initialPatientFilter]);

  // Set response text when selecting a consultation
  useEffect(() => {
    if (activeConsultation) {
      setResponseText(activeConsultation.doctorResponse || "");
    }
  }, [activeConsultation]);

  const handleOpenReview = (item: DoctorConsultationItem) => {
    setSelectedConsultationId(item.id);
    setResponseText(item.doctorResponse || "");
    setAttachedPrescription(null);
  };

  const handleCloseReview = () => {
    setSelectedConsultationId(null);
    setAttachedPrescription(null);
    setPreviewingDoc(null);
  };

  const handlePrescriptionFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const sizeStr =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.max(1, Math.round(file.size / 1024))} KB`;

      setAttachedPrescription({
        file,
        fileName: file.name,
        fileType: isPdf ? "application/pdf" : file.type || "image/jpeg",
        fileSize: sizeStr,
        dataUrl,
      });

      showToast(
        "Prescription Ready",
        `Attached "${file.name}" to consultation. Ready to send.`,
        "success"
      );
    } catch (err) {
      console.error(err);
      showToast("File Error", "Could not process selected prescription file.", "error");
    } finally {
      e.target.value = "";
    }
  };

  const handleGenerateSampleRx = () => {
    if (!activeConsultation) return;
    const rxId = `rx-${Date.now().toString().slice(-6)}`;
    const dataUrl = generateAuthorizedRxSvgDataUrl({
      rxId,
      doctorName: "Dr. Sharma, MD",
      patientName: activeConsultation.patientName,
      date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      notes: responseText.trim() || "Follow adjusted medication plan. Continue blood pressure tracking. Strictly avoid NSAIDs.",
    });

    setAttachedPrescription({
      file: null,
      fileName: `Prescription_${activeConsultation.patientName.replace(/\s+/g, "_")}_Sep2026.pdf`,
      fileType: "application/pdf",
      fileSize: "1.2 MB",
      dataUrl,
    });

    showToast("Prescription Generated", "Authorized prescription document prepared and attached.", "info");
  };

  const handleSendResponse = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeConsultation) return;

    const trimmed = responseText.trim();
    if (!trimmed && !attachedPrescription) {
      showToast(
        "Action Required",
        "Please write a response or attach a prescription to send to the patient.",
        "warning"
      );
      return;
    }

    setIsSubmitting(true);

    const newPrescriptionRecord: DoctorPrescriptionRecord | undefined = attachedPrescription
      ? {
          prescription_id: `rx-${Date.now()}`,
          consultation_id: activeConsultation.id,
          patient_id: activeConsultation.patientId,
          doctor_id: "doc-1",
          doctor_name: "Dr. Sharma, MD",
          file_name: attachedPrescription.fileName,
          file_type: attachedPrescription.fileType,
          file_location: `storage/consultations/${activeConsultation.id}/prescriptions/${attachedPrescription.fileName}`,
          file_data: attachedPrescription.dataUrl,
          file_size: attachedPrescription.fileSize,
          uploaded_at: new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          status: "Delivered",
        }
      : undefined;

    const targetStatus =
      activeConsultation.status === "New" ? "Under Review" : activeConsultation.status;

    sendDoctorConsultationResponse(
      activeConsultation.id,
      trimmed || activeConsultation.doctorResponse,
      newPrescriptionRecord,
      targetStatus
    );

    setAttachedPrescription(null);
    refreshConsultations();

    if (trimmed && newPrescriptionRecord) {
      showToast(
        "Response & Prescription Sent ✓",
        `Dispatched clinical note and ${newPrescriptionRecord.file_name} to ${activeConsultation.patientName}.`,
        "success"
      );
    } else if (newPrescriptionRecord) {
      showToast(
        "Prescription Dispatched ✓",
        `Prescription ${newPrescriptionRecord.file_name} sent directly to ${activeConsultation.patientName}.`,
        "success"
      );
    } else {
      showToast(
        "Response Sent to Patient ✓",
        `Clinical note dispatched to ${activeConsultation.patientName}'s consultation portal.`,
        "success"
      );
    }

    setIsSubmitting(false);
  };

  const handleMarkAsReviewed = () => {
    if (!activeConsultation) return;

    const trimmed = responseText.trim();
    if (trimmed) {
      updateDoctorConsultationResponse(activeConsultation.id, trimmed, "Reviewed");
    } else {
      setConsultationStatus(activeConsultation.id, "Reviewed");
    }

    refreshConsultations();
    showToast(
      "Marked as Reviewed ✓",
      `Consultation for ${activeConsultation.patientName} marked as clinically reviewed.`,
      "success"
    );
  };

  const getStatusBadgeStyle = (status: ConsultationStatus) => {
    switch (status) {
      case "New":
        return "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800";
      case "Under Review":
        return "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Reviewed":
        return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    }
  };

  const counts = useMemo(() => {
    const newCount = consultations.filter((c) => c.status === "New").length;
    const underReviewCount = consultations.filter((c) => c.status === "Under Review").length;
    const reviewedCount = consultations.filter((c) => c.status === "Reviewed").length;
    return { all: consultations.length, new: newCount, underReview: underReviewCount, reviewed: reviewedCount };
  }, [consultations]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name or symptom..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 overflow-x-auto self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statusFilter === "ALL"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs border border-slate-200/60 dark:border-slate-800"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("New")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statusFilter === "New"
                ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-2xs border border-slate-200/60 dark:border-slate-800"
                : "text-slate-600 dark:text-slate-400 hover:text-teal-600"
            }`}
          >
            New ({counts.new})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("Under Review")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statusFilter === "Under Review"
                ? "bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 shadow-2xs border border-slate-200/60 dark:border-slate-800"
                : "text-slate-600 dark:text-slate-400 hover:text-amber-600"
            }`}
          >
            Under Review ({counts.underReview})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("Reviewed")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              statusFilter === "Reviewed"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-2xs border border-slate-200/60 dark:border-slate-800"
                : "text-slate-600 dark:text-slate-400 hover:text-emerald-600"
            }`}
          >
            Reviewed ({counts.reviewed})
          </button>
        </div>
      </div>

      {/* CONSULTATION INBOX LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {filteredConsultations.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No consultations found matching your filter.
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When patients complete symptom intakes from their portal, they will automatically appear in this inbox for clinical review.
            </p>
          </div>
        ) : (
          filteredConsultations.map((item) => (
            <div
              key={item.id}
              className={`p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:bg-slate-50/70 dark:hover:bg-slate-850/40 ${
                selectedConsultationId === item.id
                  ? "bg-teal-50/30 dark:bg-teal-950/20 border-l-4 border-teal-600"
                  : ""
              }`}
            >
              {/* Row / Card Content: Patient Name, Main Symptom, Date, Status */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.patientName}
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    • {item.date}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Main Symptom */}
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {item.mainSymptom}
                </p>

                {/* Short preview of symptoms */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {item.symptoms}
                </p>

                {item.doctorResponse && (
                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-1.5 pt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Response recorded: &ldquo;{item.doctorResponse}&rdquo;</span>
                  </p>
                )}
              </div>

              {/* Action Button: [Review] */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenReview(item)}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>Review</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DETAILED CONSULTATION REVIEW MODAL / WORKSPACE */}
      {activeConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="w-full max-w-3xl my-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative space-y-6 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseReview}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close Review"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: Patient Info & Status */}
            <div className="space-y-3 pb-5 border-b border-slate-200/80 dark:border-slate-800 pr-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Clinical Intake Review
                </span>
                <span className="text-xs text-slate-400">
                  Recorded: {activeConsultation.date}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadgeStyle(
                    activeConsultation.status
                  )}`}
                >
                  {activeConsultation.status}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {activeConsultation.patientName}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Patient ID: <strong>{activeConsultation.patientId}</strong> • Attending: Dr. Sharma, MD
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                  <Link
                    href={`/patient/analyzer?patientId=${activeConsultation.patientId}&role=doctor`}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                    title="Open Polypharmacy Risk Analyzer with this patient's active medications"
                  >
                    <Activity className="w-3.5 h-3.5 text-teal-600" />
                    <span>Polypharmacy Analyzer</span>
                  </Link>

                  <Link
                    href={`/doctor/consultation/new?patientId=${activeConsultation.patientId}`}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Start Consultation</span>
                  </Link>

                  <Link
                    href={`/doctor/patients/${activeConsultation.patientId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    <span>Open Chart</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* MANDATORY DISCLAIMER LABEL */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/80 space-y-1">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-xs sm:text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Preliminary Symptom Summary — Not a Medical Diagnosis</span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                  The clinical intake below is based solely on patient-reported information. The physician reviews the information and makes the clinical decision.
                </p>
              </div>
            </div>

            {/* STRUCTURED CONSULTATION DETAILS (Clean structured layout, not giant cards) */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Structured Clinical Intake Data
              </span>

              {/* Grid 1: Symptoms, Duration, Severity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Symptoms */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Main Symptoms
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {activeConsultation.symptoms}
                  </p>
                </div>

                {/* Duration */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Duration
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {activeConsultation.duration}
                  </p>
                </div>

                {/* Severity */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Severity
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {activeConsultation.severity}
                  </p>
                </div>
              </div>

              {/* Grid 2: Associated Symptoms & Current Medicines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Associated Symptoms */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Associated Symptoms
                  </span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {activeConsultation.associatedSymptoms || "None reported"}
                  </p>
                </div>

                {/* Current Medicines */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Current Medicines
                  </span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {activeConsultation.currentMedicines}
                  </p>
                </div>
              </div>

              {/* Relevant Information */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Relevant Information
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {activeConsultation.relevantInfo}
                </p>
              </div>

              {/* Patient's Preliminary Symptom Summary */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/90 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                  Patient&apos;s Preliminary Symptom Summary
                </span>
                <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed italic">
                  &ldquo;{activeConsultation.preliminarySummary}&rdquo;
                </p>
              </div>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━ MEDICATION RISK ANALYSIS SECTION (Requirements 1, 2, 3, 4) ━━━━━━━━━━━━━━━━━━ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Medication Risk Analysis
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Polypharmacy risk evaluation against active regimen. Verified CDSS guidance.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/patient/analyzer?patientId=${activeConsultation.patientId}&consultationId=${activeConsultation.id}&role=doctor`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800 transition"
                  title="Check another proposed medicine against patient's full medication list"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Analyze Medication</span>
                </Link>
              </div>

              {medicationReports.length === 0 ? (
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <Pill className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No medication risk report generated for this consultation yet.
                  </p>
                  <Link
                    href={`/patient/analyzer?patientId=${activeConsultation.patientId}&consultationId=${activeConsultation.id}&role=doctor`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    <span>Click here to check a proposed medicine against {activeConsultation.patientName}&apos;s profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {medicationReports.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              rep.overallRisk === "HIGH"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                : rep.overallRisk === "MODERATE"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            }`}
                          >
                            Risk: {rep.overallRisk}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {rep.date} • {rep.timestamp}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                            {rep.status}
                          </span>
                        </div>

                        <div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Proposed:{" "}
                          </span>
                          <strong className="text-xs sm:text-sm text-slate-900 dark:text-white font-extrabold">
                            {rep.proposedMedication.name}
                          </strong>
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                          Current medicines: <strong>{rep.currentMedicinesCount}</strong> • {rep.riskSummary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedReviewReport(rep)}
                          className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review Report</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DOCTOR RESPONSE SECTION */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Doctor&apos;s Response
                  </h3>
                </div>
                {activeConsultation.doctorResponseDate && (
                  <span className="text-[11px] text-slate-400">
                    Last responded: {activeConsultation.doctorResponseDate}
                  </span>
                )}
              </div>

              {/* Requirement 11: DOCTOR SIDE HISTORY — Prescription sent */}
              {(() => {
                const rxList =
                  activeConsultation.prescriptions && activeConsultation.prescriptions.length > 0
                    ? activeConsultation.prescriptions
                    : activeConsultation.prescription
                    ? [activeConsultation.prescription]
                    : [];

                if (rxList.length === 0) return null;

                return (
                  <div className="space-y-2 p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                      Consultation Prescription Record
                    </span>
                    {rxList.map((rx) => (
                      <div
                        key={rx.prescription_id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/60"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 dark:text-white">
                                Prescription sent
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                                Status: {rx.status}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                              {rx.file_name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Delivered {rx.uploaded_at} • Patient: {activeConsultation.patientName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewingDoc({
                                fileName: rx.file_name,
                                dataUrl: rx.file_data,
                                fileType: rx.file_type,
                                doctorName: rx.doctor_name,
                              })
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-teal-600" />
                            <span>Preview</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => downloadPrescriptionDocument(rx.file_name, rx.file_data)}
                            className="px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Write clinical instructions, attach an authorized prescription, or send both together. Your response will appear directly in the patient&apos;s consultation interface.
              </p>

              {/* Hidden file selectors */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/png,image/jpeg"
                className="hidden"
                onChange={handlePrescriptionFileSelect}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePrescriptionFileSelect}
              />

              <form onSubmit={handleSendResponse} className="space-y-3">
                <textarea
                  rows={3}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Write your response to the patient (or leave blank if sending prescription only)..."
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs resize-none"
                />

                {/* Upload Prescription Button & Take Photo Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800/80 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-teal-600" />
                      <span>Upload Prescription</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      title="Take Photo of Prescription"
                    >
                      <Camera className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      <span>Take Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleGenerateSampleRx}
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-dashed border-slate-200 dark:border-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                      title="Generate an electronic clinical prescription document"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Digital Rx</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    Supported: PDF, JPG, JPEG, PNG
                  </span>
                </div>

                {/* Compact Prescription Preview (Requirement 2) */}
                {attachedPrescription && (
                  <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/90 dark:border-teal-800/80 space-y-2 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {attachedPrescription.fileName}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Uploaded by Dr. Sharma, MD • {attachedPrescription.fileSize}
                          </p>
                        </div>
                      </div>

                      {/* Actions: Preview, Replace, Remove */}
                      <div className="flex items-center gap-1.5 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewingDoc({
                              fileName: attachedPrescription.fileName,
                              dataUrl: attachedPrescription.dataUrl,
                              fileType: attachedPrescription.fileType,
                              doctorName: "Dr. Sharma, MD",
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-teal-600" />
                          <span>Preview</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3 text-slate-500" />
                          <span>Replace</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAttachedPrescription(null)}
                          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900/60 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] font-semibold text-teal-800 dark:text-teal-300 flex items-center gap-1 pt-1 border-t border-teal-100 dark:border-teal-900/50">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>Prescription will be shared with this patient.</span>
                    </p>
                  </div>
                )}

                {/* Action Buttons: [Send to Patient] & [Mark as Reviewed] */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-slate-400">
                    Status: <strong className="text-slate-700 dark:text-slate-200">{activeConsultation.status}</strong>
                  </span>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="submit"
                      disabled={isSubmitting || (!responseText.trim() && !attachedPrescription)}
                      className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send to Patient</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleMarkAsReviewed}
                      disabled={activeConsultation.status === "Reviewed" && !responseText.trim() && !attachedPrescription}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                      <span>Mark as Reviewed</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR PRESCRIPTION PREVIEW MODAL */}
      {previewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[320px]">
                    {previewingDoc.fileName}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Uploaded by {previewingDoc.doctorName || "Dr. Sharma, MD"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    printPrescriptionDocument(
                      previewingDoc.fileName,
                      previewingDoc.dataUrl,
                      previewingDoc.fileType
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-600" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    downloadPrescriptionDocument(previewingDoc.fileName, previewingDoc.dataUrl)
                  }
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewingDoc(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Viewer Body */}
            <div className="p-4 sm:p-6 overflow-y-auto bg-slate-100 dark:bg-slate-950 flex items-center justify-center min-h-[350px]">
              {previewingDoc.fileType.includes("image") ||
              previewingDoc.fileType.includes("svg") ||
              previewingDoc.dataUrl.startsWith("data:image/") ? (
                <img
                  src={previewingDoc.dataUrl}
                  alt={previewingDoc.fileName}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-md border border-slate-200 dark:border-slate-800 bg-white"
                />
              ) : (
                <iframe
                  src={previewingDoc.dataUrl}
                  title={previewingDoc.fileName}
                  className="w-full h-[60vh] rounded-xl border border-slate-200 dark:border-slate-800 bg-white shadow-md"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500">
              <span>Security: Prescription authorized for consultation patient only.</span>
              <button
                type="button"
                onClick={() => setPreviewingDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 text-white font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR MEDICATION RISK REVIEW MODAL (Requirements 3, 4, 5, 6, 7, 10) */}
      {selectedReviewReport && activeConsultation && (
        <DoctorMedicationRiskReviewModal
          isOpen={selectedReviewReport !== null}
          onClose={() => setSelectedReviewReport(null)}
          report={selectedReviewReport}
          consultationId={activeConsultation.id}
          onResponseSent={(responseText) => {
            setResponseText(responseText);
            refreshConsultations();
          }}
          onOpenUploadPrescription={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
        />
      )}
    </div>
  );
}
