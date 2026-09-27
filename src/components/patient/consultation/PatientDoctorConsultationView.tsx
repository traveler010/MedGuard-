"use client";

import React, { useState, useEffect } from "react";
import {
  ConsultationDoctorInfo,
  PatientManualMedicine,
  UploadedPrescriptionItem,
  AttachedReportItem,
  DoctorResponseData,
} from "./types";
import { AddEditPatientMedicineModal } from "./AddEditPatientMedicineModal";
import { PrescriptionPreviewModal } from "./PrescriptionPreviewModal";
import { AttachReportsModal } from "./AttachReportsModal";
import { useToast } from "@/components/Toast";
import {
  saveOrUpdateConsultation,
  getStoredConsultations,
  DoctorConsultationItem,
  DoctorPrescriptionRecord,
} from "@/data/mockDoctorPortal";
import {
  printPrescriptionDocument,
  downloadPrescriptionDocument,
} from "@/services/prescriptionDocumentService";
import {
  getReportsForConsultation,
  getReportsForPatient,
  MedicationAnalysisReportItem,
} from "@/services/medicationAnalysisService";
import { PatientMedicationReviewModal } from "./PatientMedicationReviewModal";
import {
  Stethoscope,
  Pill,
  Upload,
  Camera,
  FileText,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  ShieldCheck,
  ChevronRight,
  Info,
  Sparkles,
  ArrowRight,
  Download,
  Printer,
  X,
} from "lucide-react";

export function PatientDoctorConsultationView() {
  const { showToast } = useToast();

  // 1. Doctor and Consultation Overview Information
  const [doctorInfo] = useState<ConsultationDoctorInfo>({
    doctorName: "Dr. Sarah Mitchell",
    specialty: "Geriatric & Internal Medicine",
    clinic: "MedGuard Comprehensive Senior Care Center",
    status: "Available for Consultation",
    lastConsultationDate: "14 September 2026",
    lastConsultationSummary: "Blood pressure adjustment review; advised morning spacing with breakfast.",
    appointmentInfo: {
      date: "27 Sep 2026",
      time: "10:30 AM",
      type: "Clinical Medication & Progress Review",
      location: "Consultation Room 3A",
    },
  });

  // Active Session State
  const [isConsultationActive, setIsConsultationActive] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 2. Current Medicines (Manual Entry)
  const [manualMedicines, setManualMedicines] = useState<PatientManualMedicine[]>([
    {
      id: "med-1",
      name: "Paracetamol",
      dose: "500 mg",
      frequency: "Twice daily",
      times: "08:00 AM • 08:00 PM",
      startDate: "2026-09-20",
      instructions: "Take with food or a glass of water for knee stiffness.",
    },
    {
      id: "med-2",
      name: "Blood Pressure Medicine (Lisinopril)",
      dose: "5 mg",
      frequency: "Once daily",
      times: "08:00 AM",
      startDate: "2026-01-15",
      instructions: "Take in the morning. Regularly check blood pressure.",
    },
  ]);

  // 3. Uploaded Prescription / Medicine Images
  const [uploadedPrescriptions, setUploadedPrescriptions] = useState<UploadedPrescriptionItem[]>([
    {
      id: "rx-1",
      name: "Prescription_DrSharma_Sep2026.jpg",
      fileSize: "1.8 MB",
      uploadTime: "Uploaded just now",
      type: "image",
      status: "Uploaded for doctor review",
    },
  ]);

  // 4. Shared Medical Reports
  const [attachedReports, setAttachedReports] = useState<AttachedReportItem[]>([
    {
      id: "rep-1",
      name: "Comprehensive_Metabolic_CBC_Panel.pdf",
      type: "Blood Test / Lab",
      date: "September 18, 2026",
      fileSize: "2.4 MB",
      isExisting: true,
    },
  ]);

  // 5. Message to Doctor
  const [patientMessage, setPatientMessage] = useState(
    "Hello Dr. Mitchell, I have been feeling mild morning dizziness over the past 3 days after taking my blood pressure medicine. I uploaded my recent blood test and my updated prescription image for you to review."
  );

  // 6. Doctor Response Data
  const [doctorResponse, setDoctorResponse] = useState<DoctorResponseData>({
    doctorName: "Dr. Sarah Mitchell",
    doctorRole: "Attending Physician, MD",
    status: "Waiting for doctor response",
  });

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [medicineToEdit, setMedicineToEdit] = useState<PatientManualMedicine | null>(null);
  const [previewPrescription, setPreviewPrescription] = useState<UploadedPrescriptionItem | null>(null);
  const [isAttachReportsModalOpen, setIsAttachReportsModalOpen] = useState(false);

  // Medicine Reminder Confirmation state
  const [addedReminderIds, setAddedReminderIds] = useState<string[]>([]);
  const [medicineToConfirmReminder, setMedicineToConfirmReminder] = useState<{
    id: string;
    medicineName: string;
    dose: string;
    instructions: string;
    date: string;
  } | null>(null);

  const handleConfirmAddReminder = () => {
    if (!medicineToConfirmReminder) return;

    setAddedReminderIds((prev) => [...prev, medicineToConfirmReminder.id]);

    try {
      const existingRaw = localStorage.getItem("medguard_custom_medicines");
      const list = existingRaw ? JSON.parse(existingRaw) : [];
      list.push({
        id: `med-prescribed-${Date.now()}`,
        name: medicineToConfirmReminder.medicineName,
        dose: medicineToConfirmReminder.dose,
        frequency: "Twice daily",
        times: ["08:00 AM", "08:00 PM"],
        instructions: medicineToConfirmReminder.instructions,
        source: "Prescribed by Doctor",
      });
      localStorage.setItem("medguard_custom_medicines", JSON.stringify(list));
      window.dispatchEvent(new Event("medguard_medicines_updated"));
    } catch (e) {
      console.error(e);
    }

    showToast(
      "Reminder Scheduled!",
      `Added ${medicineToConfirmReminder.medicineName} (${medicineToConfirmReminder.dose}) to your daily reminder timeline`,
      "success"
    );

    setMedicineToConfirmReminder(null);
  };

  // Doctor Prescriptions state (Requirement 4 & 5)
  const [doctorPrescriptions, setDoctorPrescriptions] = useState<DoctorPrescriptionRecord[]>([]);
  const [viewingPrescription, setViewingPrescription] = useState<DoctorPrescriptionRecord | null>(null);
  const [hasNewPrescriptionAlert, setHasNewPrescriptionAlert] = useState(false);

  // Medication Risk Analysis State (Requirements 8 & 9)
  const [linkedMedicationReport, setLinkedMedicationReport] = useState<MedicationAnalysisReportItem | null>(null);
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);

  // Sync consultation & doctor prescription in real time (Requirement 8)
  const syncDoctorConsultationState = (isEventTriggered = false) => {
    try {
      const stored = getStoredConsultations();
      const existing = stored.find(
        (c) => c.patientId === "pat-1" || c.patientName.toLowerCase().includes("raj")
      );
      if (existing) {
        if (existing.doctorResponse) {
          setDoctorResponse((prev) => ({
            ...prev,
            doctorName: existing.prescription?.doctor_name || prev.doctorName || "Dr. Sharma, MD",
            responseTime: existing.doctorResponseDate || "Today",
            message: existing.doctorResponse,
            status: (existing.status === "Reviewed" ? "Reviewed" : "Under Review") as any,
          }));
        }

        const rxList: DoctorPrescriptionRecord[] =
          existing.prescriptions && existing.prescriptions.length > 0
            ? existing.prescriptions
            : existing.prescription
            ? [existing.prescription]
            : [];

        if (rxList.length > 0) {
          setDoctorPrescriptions(rxList);
          if (isEventTriggered) {
            setHasNewPrescriptionAlert(true);
            showToast(
              "New Prescription Available",
              `New prescription from Dr. ${rxList[0].doctor_name}: ${rxList[0].file_name}`,
              "success"
            );
          }
        }

        // Sync medication analysis reports linked to this patient/consultation
        const reports = getReportsForConsultation(existing.id);
        if (reports.length > 0) {
          setLinkedMedicationReport(reports[0]);
          if (isEventTriggered && reports[0].doctorReview) {
            showToast(
              "Medication Review Update",
              "Doctor responded to your medication review.",
              "info"
            );
          }
        }
      }
    } catch (e) {
      console.error("Failed to load doctor consultation state", e);
    }
  };

  useEffect(() => {
    syncDoctorConsultationState(false);

    const handleUpdate = () => {
      syncDoctorConsultationState(true);
    };

    window.addEventListener("medguard_consultations_updated", handleUpdate);
    window.addEventListener("medguard_medication_reports_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("medguard_consultations_updated", handleUpdate);
      window.removeEventListener("medguard_medication_reports_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Handlers for Manual Medicines
  const handleSaveMedicine = (saved: PatientManualMedicine) => {
    if (medicineToEdit) {
      setManualMedicines((prev) =>
        prev.map((m) => (m.id === saved.id ? saved : m))
      );
      showToast("Medicine Updated", `Updated ${saved.name}`, "info");
    } else {
      setManualMedicines((prev) => [saved, ...prev]);
      showToast("Medicine Added", `Added ${saved.name} to consultation list`, "success");
    }
    setMedicineToEdit(null);
  };

  const handleDeleteMedicine = (id: string) => {
    const target = manualMedicines.find((m) => m.id === id);
    setManualMedicines((prev) => prev.filter((m) => m.id !== id));
    showToast("Medicine Removed", `Removed ${target?.name || "medicine"}`, "info");
  };

  // Handlers for Uploading Prescription Images
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: UploadedPrescriptionItem[] = Array.from(files).map(
      (file, index) => {
        const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
        return {
          id: `rx-up-${Date.now()}-${index}`,
          name: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadTime: "Uploaded just now",
          type: isPdf ? "pdf" : "image",
          status: "Uploaded for doctor review",
          dataUrl: !isPdf ? URL.createObjectURL(file) : undefined,
        };
      }
    );

    setUploadedPrescriptions((prev) => [...newItems, ...prev]);
    showToast(
      "Prescription Uploaded",
      `Attached ${newItems.length} file(s) for doctor review`,
      "success"
    );
  };

  const handleRemovePrescription = (id: string) => {
    setUploadedPrescriptions((prev) => prev.filter((p) => p.id !== id));
    showToast("Prescription Removed", "Removed attached image", "info");
  };

  // Handlers for Attached Reports
  const handleRemoveReport = (id: string) => {
    setAttachedReports((prev) => prev.filter((r) => r.id !== id));
    showToast("Report Unlinked", "Removed from consultation submission", "info");
  };

  // Preset Message Suggestions
  const PRESET_MESSAGES = [
    "Experiencing morning dizziness after taking blood pressure medication",
    "Requesting review of newly prescribed joint pain medicine",
    "Need clarification on whether to take medicines with meals or water",
    "Routine follow-up after quarterly metabolic blood panel results",
  ];

  // Submit Consultation
  const handleSendConsultation = () => {
    if (!patientMessage.trim()) {
      showToast("Message Required", "Please enter a message to your doctor.", "warning");
      return;
    }

    const medsSummary = manualMedicines
      .map((m) => `${m.name} (${m.dose}, ${m.frequency})`)
      .join("; ");

    const reportsSummary = attachedReports.map((r) => r.name).join(", ");
    const rxSummary = uploadedPrescriptions.map((p) => p.name).join(", ");

    // Sync to shared mock doctor consultations inbox
    const newConsultationRecord: DoctorConsultationItem = {
      id: `cons-pat-${Date.now()}`,
      patientName: "Raj Kumar",
      patientId: "pat-1",
      date: "27 Sep 2026",
      mainSymptom: "Consultation Request: Medication Review & Symptom Intake",
      chiefComplaint: patientMessage.slice(0, 90) + (patientMessage.length > 90 ? "..." : ""),
      symptoms: patientMessage,
      duration: "Recent 3-5 days",
      severity: "Moderate",
      associatedSymptoms: rxSummary ? `Uploaded files: ${rxSummary}` : "None uploaded",
      currentMedicines: medsSummary || "No manual medicines entered",
      relevantInfo: reportsSummary ? `Attached reports: ${reportsSummary}` : "No reports attached",
      preliminarySummary: patientMessage,
      status: "New",
      reportName: "Patient Submitted Consultation",
    };

    try {
      saveOrUpdateConsultation(newConsultationRecord);
    } catch (e) {
      console.error(e);
    }

    setIsSubmitted(true);
    setDoctorResponse({
      doctorName: doctorInfo.doctorName,
      doctorRole: "Attending Physician, MD",
      status: "Waiting for doctor response",
    });

    showToast(
      `Sent to ${doctorInfo.doctorName}!`,
      "Your consultation, medicines, and reports have been delivered.",
      "success"
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Requirement 12: Notification / Badge for New Prescription Available */}
      {hasNewPrescriptionAlert && doctorPrescriptions.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-800 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base">
                  New Prescription Available
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/25 text-white">
                  NEW
                </span>
              </div>
              <p className="text-xs text-teal-100 mt-0.5">
                Dr. {doctorPrescriptions[0].doctor_name} has authorized and shared a new prescription ({doctorPrescriptions[0].file_name}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                document.getElementById("doctor-prescriptions")?.scrollIntoView({ behavior: "smooth" });
                setHasNewPrescriptionAlert(false);
              }}
              className="px-4 py-2 rounded-xl bg-white text-teal-900 text-xs font-black shadow-md hover:bg-teal-50 transition cursor-pointer"
            >
              View Prescription
            </button>
            <button
              type="button"
              onClick={() => setHasNewPrescriptionAlert(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━ 1. PATIENT CONSULTATION ENTRY ━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-700 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <Stethoscope className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Doctor Consultation
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {doctorInfo.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Consult Your Doctor
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Send your current medicines, prescription photos, and lab reports directly to <strong>{doctorInfo.doctorName}</strong>.
              </p>
            </div>
          </div>

          {/* Main Button: Start Consultation */}
          <div className="flex items-center gap-3">
            {!isConsultationActive ? (
              <button
                type="button"
                onClick={() => setIsConsultationActive(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-800 hover:from-teal-700 hover:to-cyan-900 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Start Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="px-4 py-2 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span>Consultation Form Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Doctor & Clinical Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Assigned Doctor */}
          <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Assigned Doctor
            </span>
            <p className="text-sm font-black text-slate-900 dark:text-white">
              {doctorInfo.doctorName}
            </p>
            <p className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">
              {doctorInfo.specialty}
            </p>
            <p className="text-[11px] text-slate-400">
              {doctorInfo.clinic}
            </p>
          </div>

          {/* Last Consultation */}
          <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Last Consultation
            </span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>{doctorInfo.lastConsultationDate}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              {doctorInfo.lastConsultationSummary}
            </p>
          </div>

          {/* Appointment Information */}
          <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Upcoming Appointment
            </span>
            {doctorInfo.appointmentInfo ? (
              <>
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {doctorInfo.appointmentInfo.date} • {doctorInfo.appointmentInfo.time}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-teal-700 dark:text-teal-400">
                  {doctorInfo.appointmentInfo.type}
                </p>
                <p className="text-[10px] text-slate-400">
                  Location: {doctorInfo.appointmentInfo.location}
                </p>
              </>
            ) : (
              <p className="text-slate-400 italic">No upcoming appointment scheduled.</p>
            )}
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━ 2. MEDICATION INFORMATION ━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                <Pill className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Your Current Medicines
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Provide your medicines in the way that is easiest for you: type them manually or take a picture of your prescription.
            </p>
          </div>

          <span className="text-[11px] font-bold text-slate-400">
            {manualMedicines.length} Manually Entered • {uploadedPrescriptions.length} Image(s)
          </span>
        </div>

        {/* TWO CLEARLY VISIBLE OPTIONS CARDS (Requirement 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option A: Add Medicine Manually */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50/80 to-cyan-50/50 dark:from-teal-950/30 dark:to-cyan-950/20 border border-teal-200/80 dark:border-teal-800/60 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Option A: Add Medicine Manually
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Type the medicine name, dose (e.g. 500 mg), and times you take it.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setMedicineToEdit(null);
                setIsAddEditModalOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medicine Manually</span>
            </button>
          </div>

          {/* Option B: Upload Prescription / Medicine Image */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50/80 to-blue-50/50 dark:from-cyan-950/30 dark:to-blue-950/20 border border-cyan-200/80 dark:border-cyan-800/60 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-700 text-white flex items-center justify-center shadow-xs">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Option B: Upload Prescription / Image
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Take a photo or upload an image of your prescription, pill bottle label, or medicine strip.
              </p>
            </div>

            {/* Two Upload Actions: Device and Camera */}
            <div className="grid grid-cols-2 gap-2">
              <label className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-cyan-600" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <label className="py-2.5 px-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                <Camera className="w-3.5 h-3.5" />
                <span>Take Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━ 3. MANUALLY ADDED MEDICINES LIST ━━━━━━━━━━━━━━━━━━ */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Medicines You Have Added ({manualMedicines.length})
            </span>

            <button
              type="button"
              onClick={() => {
                setMedicineToEdit(null);
                setIsAddEditModalOpen(true);
              }}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Medicine</span>
            </button>
          </div>

          {manualMedicines.length === 0 ? (
            <p className="text-xs text-slate-400 italic p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800">
              No medicines entered manually yet. Use &ldquo;Add Medicine Manually&rdquo; or upload a prescription image above.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {manualMedicines.map((med) => (
                <div
                  key={med.id}
                  className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 hover:border-teal-400/50 transition space-y-2.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {med.name}
                        </h4>
                        <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-200/60 dark:border-teal-800/60">
                          {med.dose}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {med.frequency} • {med.times}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMedicineToEdit(med);
                          setIsAddEditModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-600 dark:text-slate-300 hover:text-teal-600 transition cursor-pointer"
                        title="Edit medicine"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMedicine(med.id)}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-500 text-slate-600 dark:text-slate-300 hover:text-rose-600 transition cursor-pointer"
                        title="Delete medicine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {med.instructions && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed italic">
                      &ldquo;{med.instructions}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ━━━━━━━━━━━━━━━━━━ 4. UPLOADED PRESCRIPTION CARDS ━━━━━━━━━━━━━━━━━━ */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Uploaded Prescriptions & Images ({uploadedPrescriptions.length})
            </span>

            <label className="text-xs font-bold text-cyan-700 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Image</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {uploadedPrescriptions.length === 0 ? (
            <p className="text-xs text-slate-400 italic p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800">
              No prescription photos attached yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {uploadedPrescriptions.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3 hover:border-cyan-500/40 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate max-w-[170px]">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {item.fileSize} • {item.uploadTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewPrescription(item)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Preview uploaded image"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemovePrescription(item.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Mandatory Requirement 4 Label */}
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-200/80 dark:border-teal-800/60">
                    <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Uploaded for doctor review</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━ 5. MEDICAL REPORTS ━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Share Medical Reports
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Attach blood tests, lab results, imaging reports, or other medical documents for Dr. Mitchell to inspect.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAttachReportsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Attach / Upload Reports</span>
          </button>
        </div>

        {/* Selected Reports List */}
        {attachedReports.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No reports attached to this consultation yet.
            </p>
            <button
              type="button"
              onClick={() => setIsAttachReportsModalOpen(true)}
              className="text-xs font-bold text-teal-600 hover:underline"
            >
              Click here to choose from your uploaded documents
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {attachedReports.map((report) => (
              <div
                key={report.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-900 dark:text-white truncate">
                      {report.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {report.type} • {report.date}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveReport(report.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition cursor-pointer shrink-0"
                  title="Remove report"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━ 6. CONSULTATION MESSAGE ━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Message to Doctor
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tell your doctor what you would like help with, including symptoms, concerns, or medicine questions.
          </p>
        </div>

        {/* Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Common Topics:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_MESSAGES.map((msg, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPatientMessage(msg)}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/70 dark:border-slate-700/70 transition cursor-pointer text-left"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        {/* Large Text Area */}
        <div className="space-y-1.5">
          <textarea
            rows={4}
            value={patientMessage}
            onChange={(e) => setPatientMessage(e.target.value)}
            placeholder="Tell your doctor what you would like help with..."
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs resize-none"
          />
          <p className="text-[11px] text-slate-400 italic">
            This message will be reviewed by Dr. Mitchell alongside your medication history. No automated diagnoses are made.
          </p>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━ 7. SEND CONSULTATION (Summary & Submit) ━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Send to Doctor
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review your consultation summary before sending to Dr. Mitchell.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Pre-Submission Audit
          </span>
        </div>

        {/* Summary Card Before Sending */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              1. Current Medicines ({manualMedicines.length})
            </span>
            <p className="font-bold text-slate-900 dark:text-white">
              {manualMedicines.map((m) => `${m.name} (${m.dose})`).join(", ") || "None manually entered"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              2. Uploaded Prescriptions ({uploadedPrescriptions.length})
            </span>
            <p className="font-bold text-slate-900 dark:text-white truncate">
              {uploadedPrescriptions.map((p) => p.name).join(", ") || "None attached"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              3. Medical Reports ({attachedReports.length})
            </span>
            <p className="font-bold text-slate-900 dark:text-white truncate">
              {attachedReports.map((r) => r.name).join(", ") || "None attached"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              4. Patient Message
            </span>
            <p className="font-bold text-slate-900 dark:text-white line-clamp-2">
              {patientMessage || "No message written"}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Consultation intake encrypted and securely routed to your physician.</span>
          </div>

          <button
            type="button"
            onClick={handleSendConsultation}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-[0.99]"
          >
            <Send className="w-4 h-4" />
            <span>Send Consultation</span>
          </button>
        </div>

        {/* Post-submission Status Badge */}
        {isSubmitted && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-1 text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-extrabold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sent to {doctorInfo.doctorName}</span>
            </div>
            <p className="text-emerald-800 dark:text-emerald-300 font-medium">
              Status: <strong>Waiting for doctor response</strong>. You will receive a notification in your portal as soon as Dr. Mitchell reviews your request.
            </p>
          </div>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━ 8. DOCTOR RESPONSE PREVIEW ━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Doctor Response
            </h2>
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              doctorResponse.status === "Reviewed"
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
            }`}
          >
            {doctorResponse.status}
          </span>
        </div>

        {/* Response Body */}
        {!doctorResponse.message ? (
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
            <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Your doctor has not responded yet.
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Dr. Mitchell typically reviews consultation messages within 2 to 4 hours during standard clinic operating hours (Monday to Friday, 8:00 AM – 5:00 PM).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-extrabold text-teal-900 dark:text-teal-200">
                  {doctorResponse.doctorName} ({doctorResponse.doctorRole})
                </span>
                <span className="text-slate-500 font-mono">
                  {doctorResponse.responseTime}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                &ldquo;{doctorResponse.message}&rdquo;
              </p>
            </div>

            {/* ━━━━━━━━━━━━━━━━━━ 8B. PATIENT MEDICATION REVIEW (Requirements 8 & 9) ━━━━━━━━━━━━━━━━━━ */}
            {linkedMedicationReport && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-teal-200 dark:border-teal-800/80 shadow-2xs space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Your Medication Review
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      linkedMedicationReport.overallRisk === "HIGH"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : linkedMedicationReport.overallRisk === "MODERATE"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    Risk: {linkedMedicationReport.overallRisk}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Proposed medicine:
                    </span>
                    <strong className="text-slate-900 dark:text-white font-extrabold text-sm">
                      {linkedMedicationReport.proposedMedication.name}
                    </strong>
                    <p className="text-[11px] text-slate-500">
                      {linkedMedicationReport.proposedMedication.dose} • {linkedMedicationReport.proposedMedication.frequency}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Simple explanation:
                    </span>
                    <p className="font-medium text-slate-700 dark:text-slate-200">
                      {linkedMedicationReport.whyFlagged}
                    </p>
                  </div>
                </div>

                {doctorResponse.message && (
                  <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 text-xs space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 dark:text-teal-300 block">
                      What your doctor said:
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 italic">
                      &ldquo;{doctorResponse.message}&rdquo;
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <p className="text-[11px] text-slate-400 italic">
                    Simplified for patient reference. Final clinical decision remains with your attending physician.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsMedicationModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Medication Analysis</span>
                  </button>
                </div>
              </div>
            )}

            {/* Prescription Attachments UI Preparation */}
            {doctorResponse.prescriptionAttachments &&
              doctorResponse.prescriptionAttachments.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-teal-600" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Prescription Orders from Doctor
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {doctorResponse.prescriptionAttachments.map((att) => {
                      const isAdded = addedReminderIds.includes(att.id);
                      return (
                        <div
                          key={att.id}
                          className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                              {att.medicineName}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-teal-600 dark:text-teal-400">
                              {att.dose}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {att.instructions}
                          </p>
                          <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-100 dark:border-slate-800">
                            Authorized order: {att.date}
                          </span>

                          {/* Action Button: Add to Medicine Reminders */}
                          <div className="pt-1">
                            <button
                              type="button"
                              disabled={isAdded}
                              onClick={() => setMedicineToConfirmReminder(att)}
                              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                                isAdded
                                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 cursor-default"
                                  : "bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Added to Reminders</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Add to Medicine Reminders</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}
          </div>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━ 9. DOCTOR PRESCRIPTIONS (Requirements 4, 5, 6, 7) ━━━━━━━━━━━━━━━━━━ */}
      <div
        id="doctor-prescriptions"
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Doctor Prescriptions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prescriptions uploaded and authorized by your attending physician.
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
            {doctorPrescriptions.length} Available
          </span>
        </div>

        {doctorPrescriptions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Doctor Prescriptions Available Yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              When your doctor prescribes medications or updates your prescription during this consultation, your authorized prescription file will appear here automatically for you to view, print, or download.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {doctorPrescriptions.map((rx, idx) => (
              <div
                key={rx.prescription_id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 shadow-2xs">
                    <FileText className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    {idx === 0 && (
                      <span className="inline-block text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100/80 dark:bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                        NEW PRESCRIPTION
                      </span>
                    )}
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>📄</span>
                      <span>{rx.file_name}</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Dr. {rx.doctor_name} • {rx.uploaded_at}
                    </p>
                  </div>
                </div>

                {/* Buttons: [ View ] [ Print ] [ Save ] */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setViewingPrescription(rx)}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-600" />
                    <span>View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => printPrescriptionDocument(rx.file_name, rx.file_data, rx.file_type)}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-teal-600" />
                    <span>Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      downloadPrescriptionDocument(rx.file_name, rx.file_data);
                      showToast("Prescription Saved", `Saved ${rx.file_name} to your device.`, "success");
                    }}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━ MODALS ━━━━━━━━━━━━━━━━━━ */}

      {/* Add / Edit Medicine Modal */}
      <AddEditPatientMedicineModal
        isOpen={isAddEditModalOpen}
        medicineToEdit={medicineToEdit}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setMedicineToEdit(null);
        }}
        onSave={handleSaveMedicine}
      />

      {/* Prescription Preview Modal */}
      <PrescriptionPreviewModal
        item={previewPrescription}
        isOpen={previewPrescription !== null}
        onClose={() => setPreviewPrescription(null)}
        onRemove={handleRemovePrescription}
      />

      {/* Attach Reports Modal */}
      <AttachReportsModal
        isOpen={isAttachReportsModalOpen}
        onClose={() => setIsAttachReportsModalOpen(false)}
        alreadyAttachedIds={attachedReports.map((r) => r.id)}
        onConfirmAttach={(chosen) => {
          setAttachedReports(chosen);
          showToast(
            "Reports Attached",
            `Attached ${chosen.length} document(s) to this consultation`,
            "success"
          );
        }}
      />

      {/* CONFIRMATION MODAL: ADD TO MEDICINE REMINDERS */}
      {medicineToConfirmReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-xs">
              <Clock className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Add to Daily Reminders?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Would you like to schedule daily medication alarms and intake tracking for this authorized medicine?
              </p>
            </div>

            {/* Structured Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Medicine</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {medicineToConfirmReminder.medicineName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Dose</span>
                <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                  {medicineToConfirmReminder.dose}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Schedule</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  08:00 AM • 08:00 PM
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 text-[11px]">
                {medicineToConfirmReminder.instructions}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setMedicineToConfirmReminder(null)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmAddReminder}
                className="flex-1 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Add</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION / PREVIEW MODAL: DOCTOR PRESCRIPTION (Requirement 6, 7, 13) */}
      {viewingPrescription && (
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
                    {viewingPrescription.file_name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Dr. {viewingPrescription.doctor_name} • Authorized {viewingPrescription.uploaded_at}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    printPrescriptionDocument(
                      viewingPrescription.file_name,
                      viewingPrescription.file_data,
                      viewingPrescription.file_type
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-600" />
                  <span className="hidden sm:inline">Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    downloadPrescriptionDocument(viewingPrescription.file_name, viewingPrescription.file_data);
                    showToast("Prescription Saved", `Saved ${viewingPrescription.file_name} to your device.`, "success");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingPrescription(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Viewer Body */}
            <div className="p-4 sm:p-6 overflow-y-auto bg-slate-100 dark:bg-slate-950 flex items-center justify-center min-h-[350px]">
              {viewingPrescription.file_type.includes("image") ||
              viewingPrescription.file_type.includes("svg") ||
              viewingPrescription.file_data.startsWith("data:image/") ? (
                <img
                  src={viewingPrescription.file_data}
                  alt={viewingPrescription.file_name}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-md border border-slate-200 dark:border-slate-800 bg-white"
                />
              ) : (
                <iframe
                  src={viewingPrescription.file_data}
                  title={viewingPrescription.file_name}
                  className="w-full h-[60vh] rounded-xl border border-slate-200 dark:border-slate-800 bg-white shadow-md"
                />
              )}
            </div>

            {/* Modal Footer - Security notice: view/print/save only, patient cannot edit */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Authorized clinical document. Protected against tampering.</span>
              </span>
              <button
                type="button"
                onClick={() => setViewingPrescription(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 text-white font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Medication Review Modal (Requirements 8 & 9) */}
      {linkedMedicationReport && (
        <PatientMedicationReviewModal
          isOpen={isMedicationModalOpen}
          onClose={() => setIsMedicationModalOpen(false)}
          report={linkedMedicationReport}
          doctorResponseText={doctorResponse.message}
          doctorName={doctorResponse.doctorName}
        />
      )}
    </div>
  );
}
