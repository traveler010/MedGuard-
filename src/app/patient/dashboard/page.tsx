"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import {
  extractReportHealthMetrics,
  getLatestPatientReport,
  PatientReportItem,
  DashboardHealthOverview,
} from "@/lib/patientHealthData";

import { UploadReportModal } from "@/components/patient/UploadReportModal";
import { CareNavigationBar } from "@/components/patient/CareNavigationBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationDropdown } from "@/components/reminders-alerts/NotificationDropdown";
import {
  getPatientUpcomingAppointment,
  getStoredConsultations,
  DoctorAppointment,
} from "@/data/mockDoctorPortal";

import {
  ShieldCheck,
  Stethoscope,
  LogOut,
  Upload,
  FileText,
  Calendar,
  Sparkles,
  Clock,
  ArrowRight,
  Eye,
  X,
  Activity,
  AlertCircle,
  Pill,
} from "lucide-react";

export default function PatientDashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [patientName] = useState("Raj Kumar");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewAllMedsModalOpen, setIsViewAllMedsModalOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState<PatientReportItem | null>(null);

  // Health overview derived from patient's submitted reports
  const [healthData, setHealthData] = useState<DashboardHealthOverview>({
    bloodPressure: "Not available",
    haemoglobin: "Not available",
    bloodCount: "Not available",
    additionalMetrics: [],
    hasReport: false,
    recentReport: null,
  });

  // Upcoming appointment for patient
  const [upcomingApt, setUpcomingApt] = useState<DoctorAppointment | null>(null);

  // Clinical Summary Intake Data (4 Cards)
  const [consultationData, setConsultationData] = useState<{
    chiefComplaint: string;
    duration: string;
    severityLevel: string;
    severityDesc: string;
    primaryMedicine: string;
    primaryMedicineDose: string;
    allMedicines: string[];
  }>({
    chiefComplaint: "headache",
    duration: "Started 2 days ago",
    severityLevel: "Moderate",
    severityDesc: "Noticeable, slows down daily routine",
    primaryMedicine: "Acetaminophen",
    primaryMedicineDose: "500 mg • As needed",
    allMedicines: [
      "Acetaminophen 500 mg (as needed)",
      "Blood Pressure Medicine (Lisinopril 10 mg)",
      "Warfarin Sodium 4 mg",
    ],
  });

  const refreshHealthData = () => {
    const latest = getLatestPatientReport();
    setHealthData(extractReportHealthMetrics(latest));

    // Also sync clinical summary cards
    const allConsults = getStoredConsultations();
    const patConsult =
      allConsults.find((c) => c.patientId === "pat-1") || allConsults[0];

    if (patConsult) {
      // 1. Chief Complaint
      const complaint =
        patConsult.chiefComplaint?.replace(/\s*\+\s*dizziness/i, "") ||
        patConsult.mainSymptom?.replace(/\s*\+\s*dizziness/i, "") ||
        "headache";

      // 2. Duration
      const dur = patConsult.duration
        ? patConsult.duration.toLowerCase().startsWith("started")
          ? patConsult.duration
          : `Started ${patConsult.duration} ago`
        : "Started 2 days ago";

      // 3. Severity
      const rawSev =
        patConsult.severity || "Moderate (noticeable, slows down daily routine)";
      let sevLevel = "Moderate";
      let sevDesc = "Noticeable, slows down daily routine";

      if (rawSev.includes("(")) {
        const parts = rawSev.split("(");
        sevLevel = parts[0].trim();
        sevDesc = parts[1].replace(")", "").trim();
        sevDesc = sevDesc.charAt(0).toUpperCase() + sevDesc.slice(1);
      } else {
        sevLevel = rawSev.trim();
        if (sevLevel.toLowerCase().includes("moderate")) {
          sevDesc = "Noticeable, slows down daily routine";
        } else if (sevLevel.toLowerCase().includes("mild")) {
          sevDesc = "Manageable, doesn't stop daily routine";
        } else if (sevLevel.toLowerCase().includes("severe")) {
          sevDesc = "Difficult to perform normal activities";
        }
      }

      // 4. Medicines Reported
      const rawMeds =
        patConsult.currentMedicines || "Acetaminophen 500 mg as needed";
      const medList = rawMeds
        .split(/,|•|\n/)
        .map((m) => m.trim())
        .filter(Boolean);

      const firstMed = medList[0] || "Acetaminophen 500 mg as needed";
      let pMed = "Acetaminophen";
      let pDose = "500 mg • As needed";

      if (firstMed.toLowerCase().includes("acetaminophen")) {
        pMed = "Acetaminophen";
        pDose = "500 mg • As needed";
      } else {
        pMed =
          firstMed
            .replace(/\(.*?\)/g, "")
            .replace(/\d+\s*(mg|mcg|g)/gi, "")
            .trim() || "Acetaminophen";
        const doseMatch = firstMed.match(/\d+\s*(mg|mcg|g)/i);
        pDose = doseMatch ? `${doseMatch[0]} • As needed` : "500 mg • As needed";
      }

      setConsultationData({
        chiefComplaint: complaint,
        duration: dur,
        severityLevel: sevLevel,
        severityDesc: sevDesc,
        primaryMedicine: pMed,
        primaryMedicineDose: pDose,
        allMedicines:
          medList.length > 0 ? medList : ["Acetaminophen 500 mg as needed"],
      });
    }
  };

  const refreshAppointment = () => {
    const apt = getPatientUpcomingAppointment("pat-1");
    setUpcomingApt(apt);
  };

  useEffect(() => {
    refreshHealthData();
    refreshAppointment();

    // Listen to custom report update events from UploadModal or MedicalReports
    const handleUpdate = () => {
      refreshHealthData();
      refreshAppointment();
    };

    window.addEventListener("medguard_report_updated", handleUpdate);
    window.addEventListener("medguard_appointments_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("focus", handleUpdate);

    return () => {
      window.removeEventListener("medguard_report_updated", handleUpdate);
      window.removeEventListener("medguard_appointments_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
    };
  }, []);

  const handleSignOut = () => {
    showToast("Signed Out", "Patient session ended.", "info");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090e17] text-slate-900 dark:text-slate-100 flex flex-col font-sans pb-32 sm:pb-28 selection:bg-teal-500 selection:text-white transition-colors duration-200">
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-4 sm:space-y-5">
        {/* Top Header Card */}
        <header className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block leading-tight">
                  MedGuard Patient Portal
                </span>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Patient ID: PAT-1048
                </p>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              <NotificationDropdown initialRole="patient" allowRoleSwitch={false} />

              <Link
                href="/doctor/dashboard"
                className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 px-3 py-1.5 rounded-xl border border-teal-200 dark:border-teal-800/80 flex items-center gap-1.5 transition"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Doctor View</span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </div>
          </div>
        </header>

        {/* Greeting Banner */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            My Health
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Good morning, {patientName.split(" ")[0]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Health summary organized from your submitted medical reports.
          </p>
        </div>

        {/* 1. CLINICAL SUMMARY CARDS (4 COMPACT SUMMARY CARDS) */}
        <section aria-labelledby="clinical-summary-title" className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2
              id="clinical-summary-title"
              className="text-[11px] font-bold uppercase tracking-wider text-slate-400"
            >
              Clinical Intake Summary
            </h2>
            <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
              Doctor Consultation
            </span>
          </div>

          {/* 4-Card Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
            {/* Card 1: CHIEF COMPLAINT */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between min-h-[120px] sm:max-h-[160px] h-auto transition-colors">
              <div className="flex items-center justify-between gap-1.5 pb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Chief Complaint
                </span>
                <div className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Activity className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-lg sm:text-[19px] font-bold text-slate-900 dark:text-white capitalize leading-snug truncate">
                  {consultationData.chiefComplaint}
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 block">
                  Primary reported symptom
                </span>
              </div>
            </div>

            {/* Card 2: DURATION */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between min-h-[120px] sm:max-h-[160px] h-auto transition-colors">
              <div className="flex items-center justify-between gap-1.5 pb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Duration
                </span>
                <div className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-lg sm:text-[19px] font-bold text-slate-900 dark:text-white leading-snug">
                  {consultationData.duration}
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 block">
                  Active symptom onset
                </span>
              </div>
            </div>

            {/* Card 3: SEVERITY */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between min-h-[120px] sm:max-h-[160px] h-auto transition-colors">
              <div className="flex items-center justify-between gap-1.5 pb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Severity
                </span>
                <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-[19px] font-bold text-slate-900 dark:text-white leading-snug">
                    {consultationData.severityLevel}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                  {consultationData.severityDesc}
                </p>
              </div>
            </div>

            {/* Card 4: MEDICINES REPORTED */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between min-h-[120px] sm:max-h-[160px] h-auto transition-colors">
              <div className="flex items-center justify-between gap-1.5 pb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                  Medicines Reported
                </span>
                <div className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Pill className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-lg sm:text-[19px] font-bold text-slate-900 dark:text-white leading-snug truncate">
                    {consultationData.primaryMedicine}
                  </span>
                  {consultationData.allMedicines.length > 1 && (
                    <span className="text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded shrink-0">
                      +{consultationData.allMedicines.length - 1} more
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                  <span className="truncate">{consultationData.primaryMedicineDose}</span>
                  {consultationData.allMedicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setIsViewAllMedsModalOpen(true)}
                      className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer shrink-0 ml-1"
                    >
                      View all
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. RECENT REPORT CARD */}
        <section aria-labelledby="recent-report-title" className="space-y-2.5">
          <h2
            id="recent-report-title"
            className="text-[11px] font-bold uppercase tracking-wider text-slate-400"
          >
            Recent Report
          </h2>

          {healthData.recentReport ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 h-auto">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {healthData.recentReport.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{healthData.recentReport.uploadDate}</span>
                    <span>•</span>
                    <span className="font-semibold text-teal-700 dark:text-teal-400">
                      {healthData.recentReport.type}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setPreviewReport(healthData.recentReport)}
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Report</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 h-auto">
              <div className="flex items-center gap-2.5 text-slate-400 text-xs">
                <FileText className="w-4 h-4 shrink-0" />
                <span>No recent medical reports on file.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer self-start sm:self-auto"
              >
                Upload Report
              </button>
            </div>
          )}
        </section>

        {/* 3. UPCOMING APPOINTMENT SECTION */}
        {upcomingApt && (
          <section aria-labelledby="upcoming-appointment-title" className="space-y-2.5">
            <h2
              id="upcoming-appointment-title"
              className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400"
            >
              Upcoming Appointment
            </h2>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 h-auto">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      {upcomingApt.type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Duration: {upcomingApt.duration}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Doctor: {upcomingApt.doctorName || "Dr. Sharma, MD"}
                  </h3>

                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Date: <strong className="text-slate-900 dark:text-white">{upcomingApt.date}</strong> • Time: <strong className="text-slate-900 dark:text-white">{upcomingApt.time}</strong> {upcomingApt.room ? `• ${upcomingApt.room}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                    upcomingApt.status === "Confirmed"
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : "bg-teal-50 text-teal-800 dark:text-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                  }`}
                >
                  Status: {upcomingApt.status}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* 4. PATIENT SERVICES CARDS (2-Column Grid on Tablet/Desktop, 1-Column on Mobile) */}
        <section aria-labelledby="quick-nav-title" className="space-y-2.5 pt-1">
          <h2
            id="quick-nav-title"
            className="text-[11px] font-bold uppercase tracking-wider text-slate-400"
          >
            Patient Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
            {/* 1. Medicine Analyzer Card */}
            <Link
              href="/patient/analyzer"
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-4.5 shadow-xs hover:border-teal-500/80 dark:hover:border-teal-600 transition flex items-center justify-between group h-auto"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors truncate">
                    Medicine Analyzer
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    My medicines • Check 2 medicines for interaction
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
            </Link>

            {/* 2. Medical Reports Card */}
            <Link
              href="/patient/reports"
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-4.5 shadow-xs hover:border-teal-500/80 dark:hover:border-teal-600 transition flex items-center justify-between group h-auto"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors truncate">
                    Medical Reports
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    My reports • Upload &amp; view health documents
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
            </Link>

            {/* 3. Medicine Reminders Card */}
            <Link
              href="/patient/reminders"
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-4.5 shadow-xs hover:border-teal-500/80 dark:hover:border-teal-600 transition flex items-center justify-between group h-auto"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors truncate">
                    Medicine Reminders
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    My reminders • Scheduled doses &amp; chime alerts
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
            </Link>

            {/* 4. Doctor Consultation Card */}
            <Link
              href="/patient/consultation"
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-4.5 shadow-xs hover:border-teal-500/80 dark:hover:border-teal-600 transition flex items-center justify-between group h-auto"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors truncate">
                    Doctor Consultation
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    My consultation • 10-question symptom intake
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
            </Link>
          </div>
        </section>
      </main>

      {/* View All Reported Medicines Modal */}
      {isViewAllMedsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 relative space-y-3.5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Reported Medicines
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsViewAllMedsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {consultationData.allMedicines.map((med, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  <span className="truncate">{med}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsViewAllMedsModalOpen(false)}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Upload Report Modal */}
      <UploadReportModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          refreshHealthData();
        }}
      />

      {/* View Report Preview Modal Card */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 relative space-y-4 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setPreviewReport(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-8 space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                {previewReport.type}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white break-words">
                {previewReport.name}
              </h3>
              <p className="text-xs text-slate-400">
                Uploaded on {previewReport.uploadDate} {previewReport.fileSize ? `• ${previewReport.fileSize}` : ""}
              </p>
            </div>

            {previewReport.summary && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                {previewReport.summary}
              </div>
            )}

            {previewReport.extractedValues && previewReport.extractedValues.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Report Health Values
                </span>
                <div className="space-y-1">
                  {previewReport.extractedValues.map((v) => (
                    <div
                      key={v.label}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
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
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <CareNavigationBar currentDestination="dashboard" />
    </div>
  );
}
