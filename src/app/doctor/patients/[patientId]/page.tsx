"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/Toast";
import {
  getPatientWorkspace,
  getStoredPatientMedicines,
  getReportsForPatient,
  getExtractedVitalsForPatient,
  getStoredConsultations,
  getStoredAppointments,
  updateDoctorConsultationResponse,
  updateAppointmentStatus,
  DOCTOR_PATIENT_DIRECTORY,
  DoctorAppointment,
  DoctorConsultationItem,
  DoctorMedicalReportItem,
  PatientCurrentMedicine,
  MedicineStatus,
} from "@/data/mockDoctorPortal";
import {
  getReportsForConsultation,
  getReportsForPatient as getMedicationReportsForPatient,
  MedicationAnalysisReportItem,
} from "@/services/medicationAnalysisService";
import { DoctorMedicationRiskReviewModal } from "@/components/doctor/DoctorMedicationRiskReviewModal";
import { ClinicalPdfReportModal } from "@/components/patient/analyzer/ClinicalPdfReportModal";
import { runFullRegimenAnalysis } from "@/services/polypharmacyRiskEngine";
import { DoctorSidebar, NavItem } from "@/components/dashboard/DoctorSidebar";
import { DoctorHeader } from "@/components/dashboard/DoctorHeader";
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Pill,
  MessageSquare,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  User,
  ExternalLink,
  Eye,
  X,
  Send,
  Check,
  Search,
  Filter,
  Stethoscope,
  Download,
} from "lucide-react";

export type PatientWorkspaceTab =
  | "overview"
  | "medicines"
  | "consultations"
  | "reports"
  | "appointments";

export default function PatientWorkspacePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const patientId = (params?.patientId as string) || "pat-1";
  const initialTab = (searchParams.get("tab") as PatientWorkspaceTab) || "overview";

  // Workspace tab state: Overview | Medicines | Consultations | Reports | Appointments
  const [activeTab, setActiveTab] = useState<PatientWorkspaceTab>(initialTab);

  // Sync tab with query param if it changes
  useEffect(() => {
    const tabParam = searchParams.get("tab") as PatientWorkspaceTab;
    if (tabParam && ["overview", "medicines", "consultations", "reports", "appointments"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const workspaceData = getPatientWorkspace(patientId);
  const patient = workspaceData.patient;

  // Global & header layout states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [showPatientSwitcher, setShowPatientSwitcher] = useState(false);

  // 1. Live medicines synced from patient reminders
  const [liveMedicines, setLiveMedicines] = useState<PatientCurrentMedicine[]>([]);

  const refreshLiveMedicines = () => {
    const list = getStoredPatientMedicines(patientId);
    setLiveMedicines(list);
  };

  // 2. Extracted Vitals strictly from submitted reports (Never invent medical values)
  const [extractedVitals, setExtractedVitals] = useState(() =>
    getExtractedVitalsForPatient(patientId)
  );

  // 3. Patient reports
  const [patientReports, setPatientReports] = useState<DoctorMedicalReportItem[]>(() =>
    getReportsForPatient(patientId)
  );

  // 4. Patient consultations
  const [patientConsultations, setPatientConsultations] = useState<DoctorConsultationItem[]>([]);

  const refreshConsultations = () => {
    const all = getStoredConsultations();
    setPatientConsultations(all.filter((c) => c.patientId === patientId));
  };

  // 5. Patient appointments
  const [patientAppointments, setPatientAppointments] = useState<DoctorAppointment[]>([]);

  const refreshAppointments = () => {
    const all = getStoredAppointments();
    setPatientAppointments(all.filter((a) => a.patientId === patientId));
  };

  // 6. Medication Risk Reports (System-Generated Clinical Decision-Support)
  const [medicationRiskReports, setMedicationRiskReports] = useState<MedicationAnalysisReportItem[]>([]);
  const [selectedPdfReport, setSelectedPdfReport] = useState<MedicationAnalysisReportItem | null>(null);
  const [isDoctorPdfOpen, setIsDoctorPdfOpen] = useState(false);

  const refreshMedicationReports = () => {
    const list = getMedicationReportsForPatient(patientId);
    setMedicationRiskReports(list);
  };

  // Synchronize on mount and listen to shared storage events
  useEffect(() => {
    refreshLiveMedicines();
    setExtractedVitals(getExtractedVitalsForPatient(patientId));
    setPatientReports(getReportsForPatient(patientId));
    refreshConsultations();
    refreshAppointments();
    refreshMedicationReports();

    const handleDataUpdate = () => {
      refreshLiveMedicines();
      setExtractedVitals(getExtractedVitalsForPatient(patientId));
      setPatientReports(getReportsForPatient(patientId));
      refreshConsultations();
      refreshAppointments();
      refreshMedicationReports();
    };

    window.addEventListener("medguard_medicines_updated", handleDataUpdate);
    window.addEventListener("medguard_consultations_updated", handleDataUpdate);
    window.addEventListener("medguard_appointments_updated", handleDataUpdate);
    window.addEventListener("medguard_report_updated", handleDataUpdate);
    window.addEventListener("medguard_medication_reports_updated", handleDataUpdate);
    window.addEventListener("storage", handleDataUpdate);

    return () => {
      window.removeEventListener("medguard_medicines_updated", handleDataUpdate);
      window.removeEventListener("medguard_consultations_updated", handleDataUpdate);
      window.removeEventListener("medguard_appointments_updated", handleDataUpdate);
      window.removeEventListener("medguard_report_updated", handleDataUpdate);
      window.removeEventListener("medguard_medication_reports_updated", handleDataUpdate);
      window.removeEventListener("storage", handleDataUpdate);
    };
  }, [patientId]);

  // Report Modal Preview State
  const [viewingReport, setViewingReport] = useState<DoctorMedicalReportItem | null>(null);

  // Doctor Consultation Response Modal / Inline state
  const [respondingConsultation, setRespondingConsultation] = useState<DoctorConsultationItem | null>(null);
  const [doctorResponseText, setDoctorResponseText] = useState("");

  // Medication Risk Analysis Review State
  const [selectedReviewReport, setSelectedReviewReport] = useState<MedicationAnalysisReportItem | null>(null);

  const doctorPdfResult = useMemo(() => {
    if (!selectedPdfReport) return null;
    if (selectedPdfReport.fullRegimenResult) return selectedPdfReport.fullRegimenResult;
    return runFullRegimenAnalysis(
      selectedPdfReport.currentMedicines,
      selectedPdfReport.patientAge,
      selectedPdfReport.patientName,
      selectedPdfReport.patientId
    );
  }, [selectedPdfReport]);

  const handleOpenResponseModal = (con: DoctorConsultationItem) => {
    setRespondingConsultation(con);
    setDoctorResponseText(con.doctorResponse || "");
  };

  const handleSubmitDoctorResponse = () => {
    if (!respondingConsultation) return;
    if (!doctorResponseText.trim()) {
      showToast("Response Required", "Please enter clinical directions or notes.", "warning");
      return;
    }
    updateDoctorConsultationResponse(respondingConsultation.id, doctorResponseText.trim(), "Reviewed");
    showToast("Response Submitted", `Doctor review saved for ${patient.name}.`, "success");
    setRespondingConsultation(null);
    setDoctorResponseText("");
    refreshConsultations();
  };

  const handleLogout = () => {
    showToast("Signed Out", "Doctor session ended.", "info");
    router.push("/login");
  };

  // Medicine status badge styling
  const getStatusBadgeClass = (statusType: PatientCurrentMedicine["statusType"]) => {
    switch (statusType) {
      case "taken":
        return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "missed":
        return "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "skipped":
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
      case "upcoming":
        return "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800";
    }
  };

  // Upcoming vs Completed appointments
  const upcomingAppointments = useMemo(() => {
    return patientAppointments.filter((a) => a.category === "TODAY" || a.category === "UPCOMING");
  }, [patientAppointments]);

  const completedAppointments = useMemo(() => {
    return patientAppointments.filter((a) => a.category === "COMPLETED");
  }, [patientAppointments]);

  // Next upcoming appointment
  const nextAppointment = upcomingAppointments[0] || null;

  // Medication adherence telemetry
  const displayMedicines = liveMedicines.length > 0 ? liveMedicines : workspaceData.currentMedicines;
  const takenCount = displayMedicines.filter((m) => m.statusType === "taken").length;
  const missedCount = displayMedicines.filter((m) => m.statusType === "missed").length;
  const skippedCount = displayMedicines.filter((m) => m.statusType === "skipped").length;
  const totalMeds = displayMedicines.length;

  const hasAdherenceIssue =
    patient.attentionNeeded ||
    workspaceData.adherencePercentage < 80 ||
    displayMedicines.some((m) => m.statusType === "missed" || m.status === "⚠ Missed");

  const tabs = [
    { id: "overview" as PatientWorkspaceTab, label: "Overview", icon: Activity },
    { id: "medicines" as PatientWorkspaceTab, label: "Medicines", icon: Pill },
    { id: "consultations" as PatientWorkspaceTab, label: "Consultations", icon: MessageSquare, badge: patientConsultations.length > 0 ? patientConsultations.length : undefined },
    { id: "reports" as PatientWorkspaceTab, label: "Reports", icon: FileText, badge: patientReports.length > 0 ? patientReports.length : undefined },
    { id: "appointments" as PatientWorkspaceTab, label: "Appointments", icon: Calendar, badge: upcomingAppointments.length > 0 ? upcomingAppointments.length : undefined },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090e17] text-slate-900 dark:text-slate-100 flex flex-row font-sans selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* 1. Main Doctor Navigation (Only Dashboard, Patients, Consultations, Appointments) */}
      <DoctorSidebar
        currentTab="patients"
        onSelectTab={(tab) => {
          if (tab === "dashboard") router.push("/doctor/dashboard");
          else if (tab === "patients") router.push("/doctor/patients");
          else if (tab === "consultations") router.push("/doctor/consultations");
          else if (tab === "appointments") router.push("/doctor/appointments");
          else router.push("/doctor/dashboard");
        }}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Top Header with Global Search */}
        <DoctorHeader
          searchQuery={headerSearchQuery}
          onSearchChange={setHeaderSearchQuery}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
          alerts={[]}
          onOpenAlert={() => {}}
        />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link href="/doctor/dashboard" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
              Dashboard
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <Link href="/doctor/patients" className="hover:text-teal-600 dark:hover:text-teal-400 transition">
              Patients
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="font-bold text-slate-900 dark:text-white truncate">
              {patient.name}
            </span>
          </nav>

          {/* PATIENT WORKSPACE HEADER */}
          <header className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <Link
                  href="/doctor/patients"
                  className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition shrink-0"
                  title="Back to Patients List"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {patient.name}
                    </h1>
                    <span className="text-xs font-bold text-slate-400">
                      {patient.age}y • {patient.gender}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                        patient.riskLevel === "HIGH"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900"
                          : patient.riskLevel === "MODERATE"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
                      }`}
                    >
                      {patient.riskLevel} Risk
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Basic status: <strong className="text-slate-700 dark:text-slate-200">{patient.primaryCondition}</strong> • ID: <span className="font-mono">{patient.id}</span>
                  </p>
                </div>
              </div>

              {/* Patient Switcher & Recent Activity Timestamp */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Activity: <strong>Today, 08:00 AM</strong></span>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPatientSwitcher(!showPatientSwitcher)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Switch Patient</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showPatientSwitcher ? "rotate-90" : ""}`} />
                  </button>

                  {showPatientSwitcher && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-40 space-y-1 animate-in fade-in duration-100">
                      <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1 border-b border-slate-100 dark:border-slate-800">
                        Quick Patient Jump
                      </div>
                      {DOCTOR_PATIENT_DIRECTORY.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setShowPatientSwitcher(false);
                            router.push(`/doctor/patients/${p.id}`);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                            p.id === patient.id
                              ? "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 font-bold"
                              : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span className="truncate">{p.name} ({p.age}y)</span>
                          {p.attentionNeeded && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Attention Needed" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subtle Attention Indicator (No exaggerated diagnosis) */}
            {hasAdherenceIssue && (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Medication adherence requires attention.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("medicines")}
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-amber-100 dark:hover:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/80 font-bold text-xs transition cursor-pointer self-start sm:self-auto shrink-0 flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>View Medication History</span>
                </button>
              </div>
            )}

            {/* NAVIGATION TABS: Overview | Medicines | Consultations | Reports | Appointments */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 overflow-x-auto scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`min-w-fit sm:flex-1 min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-2xs border border-slate-200/60 dark:border-slate-800"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? "bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-200"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </header>

          {/* ━━━━━━━━━━━━━━━━━━ TAB 1: OVERVIEW ━━━━━━━━━━━━━━━━━━ */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Essential Health Measurements from Submitted Reports ONLY */}
              <section aria-labelledby="vitals-heading" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-0.5">
                      Clinical Vitals
                    </span>
                    <h2 id="vitals-heading" className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      Submitted Health Measurements
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400">
                    {extractedVitals.hasReport && extractedVitals.latestReport
                      ? `Source: ${extractedVitals.latestReport.reportName} (${extractedVitals.latestReport.date})`
                      : "No submitted report on file"}
                  </span>
                </div>

                {/* 3 Core Requested Measurements (Only show values that actually exist in submitted report) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Blood Pressure */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Blood Pressure
                    </span>
                    <span className={`text-lg sm:text-xl font-black font-mono ${extractedVitals.bloodPressure === "Not available" ? "text-slate-400 font-sans text-sm" : "text-slate-900 dark:text-white"}`}>
                      {extractedVitals.bloodPressure}
                    </span>
                  </div>

                  {/* Blood Count */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Blood Count
                    </span>
                    <span className={`text-lg sm:text-xl font-black font-mono ${extractedVitals.bloodCount === "Not available" ? "text-slate-400 font-sans text-sm" : "text-slate-900 dark:text-white"}`}>
                      {extractedVitals.bloodCount}
                    </span>
                  </div>

                  {/* Haemoglobin */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Haemoglobin
                    </span>
                    <span className={`text-lg sm:text-xl font-black font-mono ${extractedVitals.haemoglobin === "Not available" ? "text-slate-400 font-sans text-sm" : "text-slate-900 dark:text-white"}`}>
                      {extractedVitals.haemoglobin}
                    </span>
                  </div>
                </div>

                {/* Other available health measurements from the submitted report */}
                {extractedVitals.additionalMetrics && extractedVitals.additionalMetrics.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Other Available Health Measurements
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {extractedVitals.additionalMetrics.map((metric, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-0.5">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block truncate">
                            {metric.label}
                          </span>
                          <span className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white truncate block">
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Medication Status & Next Appointment Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Medication Status Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Current Medication Status
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        {workspaceData.adherenceLabel}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <p>
                        Prescriptions: <strong className="text-slate-900 dark:text-white">{totalMeds} active medications</strong>
                      </p>
                      <p>
                        Today&apos;s schedule: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{takenCount} Taken</span>,{" "}
                        <span className="font-semibold text-rose-600 dark:text-rose-400">{missedCount} Missed</span>,{" "}
                        <span className="font-semibold text-slate-500">{skippedCount} Skipped</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("medicines")}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Medication Schedule</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Next Appointment Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Next Appointment
                      </span>
                      {nextAppointment && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                          {nextAppointment.status}
                        </span>
                      )}
                    </div>

                    {nextAppointment ? (
                      <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                        <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span>{nextAppointment.date} at {nextAppointment.time}</span>
                        </div>
                        <p className="font-medium text-slate-500 dark:text-slate-400">
                          {nextAppointment.type} • {nextAppointment.doctorName}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        No upcoming appointment scheduled.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("appointments")}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Appointments Tab</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━ TAB 2: MEDICINES ━━━━━━━━━━━━━━━━━━ */}
          {activeTab === "medicines" && (
            <div className="space-y-8 animate-in fade-in duration-150">
              {/* ━━━━━━━━━━━━━━━━━━ MEDICATION RISK REPORTS (Requirement 15) ━━━━━━━━━━━━━━━━━━ */}
              <section aria-labelledby="medication-risk-reports-heading" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <div>
                    <h2 id="medication-risk-reports-heading" className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      Medication Risk Reports
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      System-generated clinical decision-support reports across complete patient medication regimens.
                    </p>
                  </div>
                  <Link
                    href={`/patient/analyzer?patientId=${patient.id}&role=doctor`}
                    className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>+ Analyze Full Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {medicationRiskReports.length === 0 ? (
                  <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
                    <p className="text-xs text-slate-500">No medication risk report generated yet for this patient.</p>
                    <Link
                      href={`/patient/analyzer?patientId=${patient.id}&role=doctor`}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Analyze Full Medication Profile</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {medicationRiskReports.map((rep) => (
                      <div
                        key={rep.id}
                        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-3.5 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800">
                              Medication Risk Report
                            </span>
                            <span className="text-xs text-slate-400">
                              {rep.date}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                              {rep.currentMedicinesCount} Current Medicines
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Patient: <strong className="text-slate-800 dark:text-slate-200">{rep.patientName}</strong> (Age: {rep.patientAge}y)
                            </p>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs font-bold text-slate-500">Overall Risk:</span>
                            <span
                              className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                                rep.overallRisk === "HIGH"
                                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                  : rep.overallRisk === "MODERATE"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              }`}
                            >
                              {rep.overallRisk}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ({rep.status})
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                            {rep.whyFlagged || rep.riskSummary}
                          </p>
                        </div>

                        {/* Action Buttons: [View Report] [Download PDF] (Requirement 15) */}
                        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => setSelectedReviewReport(rep)}
                            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Report</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPdfReport(rep);
                              setIsDoctorPdfOpen(true);
                            }}
                            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
                          >
                            <Download className="w-3.5 h-3.5 text-teal-600" />
                            <span>Download PDF</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* CURRENT MEDICINES */}
              <section aria-labelledby="current-meds-heading" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <div>
                    <h2 id="current-meds-heading" className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      Current Medicines
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Prescriptions, dosage, scheduled intake times, and live telemetry from patient reminders.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {displayMedicines.length} Prescriptions
                  </span>
                </div>

                {/* Subtle Attention Indicator */}
                {hasAdherenceIssue && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Medication adherence requires attention.</span>
                    </div>
                    <a
                      href="#med-history-section"
                      className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-amber-100 dark:hover:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/80 font-bold text-xs transition cursor-pointer self-start sm:self-auto shrink-0 flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>View Medication History</span>
                    </a>
                  </div>
                )}

                {/* List of Current Medicines */}
                <div className="space-y-3">
                  {displayMedicines.map((med) => (
                    <div
                      key={med.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                          {med.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{med.dose}</span>
                          <span>•</span>
                          <span>{med.frequency}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{med.scheduledTime}</span>
                        </div>

                        <span
                          className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${getStatusBadgeClass(
                            med.statusType
                          )}`}
                        >
                          {med.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* RECENT MEDICATION HISTORY */}
              <section id="med-history-section" aria-labelledby="history-heading" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Intake Log
                    </span>
                    <h3 id="history-heading" className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                      Recent Medication History
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <span>{workspaceData.adherenceLabel}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {workspaceData.history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 text-xs"
                    >
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                        <span className="font-bold text-slate-400 w-auto sm:w-24 shrink-0">
                          {item.timelineLabel}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white break-words">
                          {item.statusSymbol} {item.medicineName} ({item.dose})
                        </span>
                      </div>

                      <span
                        className={`font-bold px-2 py-0.5 rounded-md self-start sm:self-auto shrink-0 ${
                          item.status === "Taken"
                            ? "text-emerald-700 dark:text-emerald-400"
                            : item.status === "Missed"
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-slate-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━ TAB 3: CONSULTATIONS ━━━━━━━━━━━━━━━━━━ */}
          {activeTab === "consultations" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    Consultations
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Patient symptom intakes, clinical assessment summaries, and recorded physician decisions.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">
                    {patientConsultations.length} Records
                  </span>
                  <Link
                    href={`/doctor/consultation/new?patientId=${patientId}`}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Start Consultation</span>
                  </Link>
                </div>
              </div>

              {patientConsultations.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    No consultations submitted yet for {patient.name}.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {patientConsultations.map((con) => (
                    <div
                      key={con.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
                    >
                      {/* Header row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">
                            {con.date}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {con.reportName || "Patient Consultation Summary"}
                          </span>
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border self-start sm:self-auto ${
                            con.status === "Reviewed"
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                              : con.status === "Under Review"
                              ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                              : "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                          }`}
                        >
                          {con.status}
                        </span>
                      </div>

                      {/* Symptoms & Duration */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">
                          Reported Symptoms
                        </span>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {con.symptoms || con.mainSymptom}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Duration: <strong>{con.duration}</strong> • Severity: <strong>{con.severity}</strong>
                        </p>
                      </div>

                      {/* Medication Risk Analysis Section (Requirements 1, 2, 3, 4) */}
                      {(() => {
                        const reports = getReportsForConsultation(con.id);
                        return (
                          <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-800/60 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-teal-600" />
                                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                  Medication Risk Analysis
                                </span>
                              </div>
                              <Link
                                href={`/patient/analyzer?patientId=${patient.id}&consultationId=${con.id}&role=doctor`}
                                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
                              >
                                <span>+ Analyze Medicine</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>

                            {reports.length === 0 ? (
                              <p className="text-xs text-slate-500 italic">No risk report generated yet for this consultation.</p>
                            ) : (
                              reports.map((rep) => (
                                <div
                                  key={rep.id}
                                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
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
                                      <span className="text-[10px] text-slate-400">{rep.date}</span>
                                      <span className="text-[10px] text-slate-500 font-medium">{rep.status}</span>
                                    </div>
                                    <p className="font-extrabold text-slate-900 dark:text-white">
                                      Proposed: {rep.proposedMedication.name}
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                      Current medicines: <strong>{rep.currentMedicinesCount}</strong> • {rep.whyFlagged}
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setSelectedReviewReport(rep)}
                                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs self-end sm:self-auto shrink-0"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Review Report</span>
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        );
                      })()}

                      {/* Doctor Response */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                            Doctor Response
                          </span>
                          {con.doctorResponseDate && (
                            <span className="text-[10px] text-slate-400">
                              Responded {con.doctorResponseDate}
                            </span>
                          )}
                        </div>

                        {con.doctorResponse ? (
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                            {con.doctorResponse}
                          </p>
                        ) : (
                          <p className="text-xs italic text-slate-400">
                            No physician response recorded yet.
                          </p>
                        )}

                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleOpenResponseModal(con)}
                            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{con.doctorResponse ? "Edit Doctor Response" : "Record Doctor Response"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━ TAB 4: REPORTS ━━━━━━━━━━━━━━━━━━ */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    Medical Reports
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Uploaded recent medical reports, laboratory panels, and diagnostic reviews on file.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {patientReports.length} Reports
                </span>
              </div>

              {patientReports.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    No medical reports submitted yet for {patient.name}.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {patientReports.map((rep) => (
                    <div
                      key={rep.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {rep.reportName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>{rep.date}</span>
                            <span>•</span>
                            <span className="font-semibold">{rep.type}</span>
                            {rep.facility && (
                              <>
                                <span>•</span>
                                <span className="truncate">{rep.facility}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            rep.status === "Flagged Review"
                              ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                              : "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                          }`}
                        >
                          {rep.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => setViewingReport(rep)}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━ TAB 5: APPOINTMENTS ━━━━━━━━━━━━━━━━━━ */}
          {activeTab === "appointments" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    Appointments
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Clinical scheduling, upcoming appointments, and past visit history for {patient.name}.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {patientAppointments.length} Total Visits
                </span>
              </div>

              {/* UPCOMING APPOINTMENT */}
              <section aria-labelledby="upcoming-apt-heading" className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                  Upcoming Appointment
                </span>

                {upcomingAppointments.length === 0 ? (
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 text-xs text-slate-500">
                    No upcoming appointments scheduled for {patient.name}.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="px-3 py-2 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-mono font-black text-sm shrink-0 border border-teal-200 dark:border-teal-800">
                            {apt.time}
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              {apt.type}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Date: <strong>{apt.date}</strong> • Doctor: <strong>{apt.doctorName}</strong>
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border self-start sm:self-auto ${
                            apt.status === "Confirmed"
                              ? "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                              : "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* PREVIOUS APPOINTMENTS */}
              <section aria-labelledby="previous-apt-heading" className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Previous Appointments
                </span>

                {completedAppointments.length === 0 ? (
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 text-xs text-slate-500">
                    No completed appointment records archived yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {completedAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-90"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold text-xs shrink-0">
                            {apt.date}
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              {apt.type}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Time: {apt.time} • Completed by {apt.doctorName}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </main>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━ MODAL: VIEW REPORT ━━━━━━━━━━━━━━━━━━ */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative space-y-5 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setViewingReport(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 pr-8">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                {viewingReport.type}
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white break-words">
                {viewingReport.reportName}
              </h3>
              <p className="text-xs text-slate-400">
                {viewingReport.date} • {viewingReport.facility}
              </p>
            </div>

            {viewingReport.summary && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Summary:</span>
                {viewingReport.summary}
              </div>
            )}

            {viewingReport.extractedValues && viewingReport.extractedValues.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Extracted Measurements
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {viewingReport.extractedValues.map((v, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{v.label}</span>
                      <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">{v.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewingReport(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━ MODAL: DOCTOR CONSULTATION RESPONSE ━━━━━━━━━━━━━━━━━━ */}
      {respondingConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative space-y-5 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setRespondingConsultation(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 pr-8">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                Doctor Consultation Response
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {patient.name}
              </h3>
              <p className="text-xs text-slate-400">
                Symptoms: {respondingConsultation.symptoms || respondingConsultation.mainSymptom}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="doctor-response-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Physician Instructions / Treatment Decision
              </label>
              <textarea
                id="doctor-response-input"
                rows={4}
                value={doctorResponseText}
                onChange={(e) => setDoctorResponseText(e.target.value)}
                placeholder="Enter clinical assessment, dosage adjustment, or instructions for the patient..."
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-base sm:text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 resize-none font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRespondingConsultation(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitDoctorResponse}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Response</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR MEDICATION RISK REVIEW MODAL */}
      {selectedReviewReport && (
        <DoctorMedicationRiskReviewModal
          isOpen={selectedReviewReport !== null}
          onClose={() => setSelectedReviewReport(null)}
          report={selectedReviewReport}
          consultationId={selectedReviewReport.consultationId}
          onResponseSent={() => {
            const all = getStoredConsultations();
            setPatientConsultations(all.filter((c) => c.patientId === patient.id));
          }}
        />
      )}

      {/* CLINICAL DECISION-SUPPORT PDF MODAL (Requirements 14, 15) */}
      {selectedPdfReport && doctorPdfResult && (
        <ClinicalPdfReportModal
          isOpen={isDoctorPdfOpen}
          onClose={() => {
            setIsDoctorPdfOpen(false);
            setSelectedPdfReport(null);
          }}
          result={doctorPdfResult}
        />
      )}
    </div>
  );
}
