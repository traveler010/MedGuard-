"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

import {
  DOCTOR_SUMMARY_METRICS,
  TODAY_APPOINTMENTS,
  PATIENTS_REQUIRING_ATTENTION,
  DOCTOR_PATIENT_DIRECTORY,
  CLINIC_MEDICINE_TRACKER,
  DOCTOR_CONSULTATIONS_LIST,
  DOCTOR_MEDICAL_REPORTS,
  DoctorAppointment,
  PatientAttentionItem,
  DoctorPatientDirectoryItem,
  ClinicMedicationTrackerItem,
  DoctorConsultationItem,
  DoctorMedicalReportItem,
} from "@/data/mockDoctorPortal";

import { DoctorSidebar, NavItem } from "@/components/dashboard/DoctorSidebar";
import { DoctorHeader } from "@/components/dashboard/DoctorHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AddPatientModal } from "@/components/doctor/AddPatientModal";
import { getStoredDoctorPatients } from "@/data/mockDoctorPortal";
import { fetchDoctorPatients } from "@/services/patientService";
import { DoctorConsultationInbox } from "@/components/doctor/DoctorConsultationInbox";
import { DoctorAppointmentsView } from "@/components/doctor/DoctorAppointmentsView";
import { DoctorMedicineTracker } from "@/components/doctor/DoctorMedicineTracker";

import {
  Calendar,
  Users,
  Pill,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  ChevronRight,
  X,
  Stethoscope,
  Activity,
  Heart,
  Droplets,
  ShieldAlert,
  UserPlus,
} from "lucide-react";

export default function DoctorDashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Navigation State
  const [activeNav, setActiveNav] = useState<NavItem>("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [patientsList, setPatientsList] = useState<DoctorPatientDirectoryItem[]>(DOCTOR_PATIENT_DIRECTORY);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  useEffect(() => {
    // Initial load from storage / backend
    setPatientsList(getStoredDoctorPatients());
    fetchDoctorPatients().then((data) => {
      if (data && data.length > 0) {
        setPatientsList(data);
      }
    });

    const handleUpdate = () => {
      setPatientsList(getStoredDoctorPatients());
    };

    window.addEventListener("medguard_patients_updated", handleUpdate);
    return () => {
      window.removeEventListener("medguard_patients_updated", handleUpdate);
    };
  }, []);

  // Quick Patient Search & Lookup
  const [searchQuery, setSearchQuery] = useState("");

  // Selected Patient for Quick Clinical Modal
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Filtered patients for Quick Lookup
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patientsList;
    const q = searchQuery.toLowerCase();
    return patientsList.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.primaryCondition.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }, [patientsList, searchQuery]);

  // Selected patient details for quick modal
  const selectedPatient = useMemo(() => {
    if (!selectedPatientId) return null;
    return (
      patientsList.find((p) => p.id === selectedPatientId) || null
    );
  }, [patientsList, selectedPatientId]);

  const handleOpenPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  const handleNavigateToFullChart = (patientId: string) => {
    router.push(`/doctor/patients/${patientId}`);
  };

  const handleLogout = () => {
    showToast("Signed Out", "Doctor session ended.", "info");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090e17] text-slate-900 dark:text-slate-100 flex flex-row font-sans selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* 1. Doctor Sidebar (Only Dashboard, Patients, Consultations, Appointments) */}
      <DoctorSidebar
        currentTab="dashboard"
        onSelectTab={(tab) => {
          if (tab === "dashboard") setActiveNav("dashboard");
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

      {/* Main Clinical Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Doctor Header */}
        <DoctorHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
          alerts={[]}
          onOpenAlert={() => {}}
        />

        {/* 3. Main Body */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Quick Search Overlay if user types in search */}
          {searchQuery.trim().length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-md space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  Quick Patient Lookup ({filteredPatients.length} matches)
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear Search
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleOpenPatient(p.id)}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-teal-500/80 transition cursor-pointer flex flex-col justify-between space-y-2 group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300">
                          {p.name}
                        </h4>
                        <span className="text-xs text-slate-400">{p.age}y</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {p.primaryCondition}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {p.attentionNeeded ? (
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          Attention Needed
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400">
                          Stable
                        </span>
                      )}
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform">
                        View →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: 1. DASHBOARD */}
          {activeNav === "dashboard" && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
              {/* Top Greeting */}
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                  Clinical Workspace
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Good morning, Dr. Sharma
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  What do you need to deal with today? Here are your scheduled appointments and priority patient updates.
                </p>
              </div>

              {/* Quick Actions Component */}
              <QuickActions
                onNewConsultation={() => router.push("/doctor/consultations")}
                onAddPatient={() => setIsAddPatientModalOpen(true)}
                onCheckDrugInteraction={() => router.push("/doctor/medicines")}
              />

              {/* 4 COMPACT SUMMARY CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Today's Appointments */}
                <div
                  onClick={() => router.push("/doctor/appointments")}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Today&apos;s Appointments
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                      {DOCTOR_SUMMARY_METRICS.todayAppointmentsCount}
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 block">
                      Next at 09:00 AM (Rahul Kumar)
                    </span>
                  </div>
                </div>

                {/* 2. Patients to Review */}
                <div
                  onClick={() => router.push("/doctor/patients")}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Patients to Review
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                      {DOCTOR_SUMMARY_METRICS.patientsToReviewCount}
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 block">
                      2 flagged high risk
                    </span>
                  </div>
                </div>

                {/* 3. Missed Medicines */}
                <div
                  onClick={() => router.push("/doctor/patients/pat-2?tab=medicines")}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Missed Medicines
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Pill className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight text-rose-600 dark:text-rose-400">
                      {DOCTOR_SUMMARY_METRICS.missedMedicinesCount}
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 block">
                      Priya Sharma adherence check →
                    </span>
                  </div>
                </div>

                {/* 4. New Consultations */}
                <div
                  onClick={() => router.push("/doctor/consultations")}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      New Consultations
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight text-teal-700 dark:text-teal-400">
                      {DOCTOR_SUMMARY_METRICS.newConsultationsCount}
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 block">
                      Patient intake submitted
                    </span>
                  </div>
                </div>
              </div>

              {/* TWO MAIN SECTIONS BELOW THE CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* SECTION 1: TODAY'S APPOINTMENTS */}
                <section
                  aria-labelledby="appointments-heading"
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-0.5">
                          Schedule
                        </span>
                        <h2
                          id="appointments-heading"
                          className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight"
                        >
                          Today&apos;s Appointments
                        </h2>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {TODAY_APPOINTMENTS.length} Total
                      </span>
                    </div>

                    {/* Next few appointments */}
                    <div className="space-y-3">
                      {TODAY_APPOINTMENTS.slice(0, 3).map((apt) => (
                        <div
                          key={apt.id}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Time Pill */}
                            <div className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black font-mono text-slate-900 dark:text-white shrink-0">
                              {apt.time}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                {apt.patientName}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {apt.type} • {apt.duration}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenPatient(apt.patientId)}
                            className="p-2 rounded-xl text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Quick view"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button: [View All Appointments] */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setActiveNav("appointments")}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>View All Appointments</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </section>

                {/* SECTION 2: PATIENTS REQUIRING ATTENTION */}
                <section
                  aria-labelledby="attention-heading"
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-0.5">
                          Action Required
                        </span>
                        <h2
                          id="attention-heading"
                          className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight"
                        >
                          Patients Requiring Attention
                        </h2>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                        {PATIENTS_REQUIRING_ATTENTION.length} Flagged
                      </span>
                    </div>

                    {/* Attention items */}
                    <div className="space-y-3">
                      {PATIENTS_REQUIRING_ATTENTION.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                {item.patientName}
                              </h3>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  item.reasonType === "missed_medicine"
                                    ? "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                                    : item.reasonType === "new_consultation"
                                    ? "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800"
                                    : "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                }`}
                              >
                                {item.badgeLabel}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                              {item.reasonText}
                            </p>
                          </div>

                          {/* Button: [Review Intake] or [View Patient] */}
                          {item.reasonType === "new_consultation" ? (
                            <button
                              type="button"
                              onClick={() => setActiveNav("consultations")}
                              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto shrink-0 flex items-center gap-1"
                            >
                              <span>Review Intake</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenPatient(item.patientId)}
                              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-200 hover:text-teal-700 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-700 text-xs font-bold transition cursor-pointer self-start sm:self-auto shrink-0"
                            >
                              View Patient
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Clinical triage prioritized</span>
                    <button
                      type="button"
                      onClick={() => setActiveNav("patients")}
                      className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      Review All Patients →
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* VIEW: 2. PATIENTS DIRECTORY */}
          {activeNav === "patients" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-0.5">
                    Clinical Directory
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Patients
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Manage patient charts, conditions, and active medication regimens.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="dashboard-tab-add-patient-btn"
                    onClick={() => setIsAddPatientModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer card-lift"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Patient</span>
                  </button>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {patientsList.length} Registered Patients
                  </span>
                </div>
              </div>

              {/* Patient List */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {patientsList.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 sm:p-6 hover:bg-slate-50/70 dark:hover:bg-slate-850/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-extrabold text-sm flex items-center justify-center shrink-0">
                          {p.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                              {p.name}
                            </h3>
                            <span className="text-xs text-slate-400">
                              {p.age}y • {p.gender}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                                p.riskLevel === "HIGH"
                                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900"
                                  : p.riskLevel === "MODERATE"
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900"
                                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
                              }`}
                            >
                              {p.riskLevel} Risk
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            <span>{p.primaryCondition}</span>
                            {(p.primaryMedicine || (p.medications && p.medications.length > 0)) && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-semibold text-teal-700 dark:text-teal-400">
                                  <Pill className="w-3.5 h-3.5" />
                                  <span>{p.primaryMedicine || p.medications?.join(", ")}</span>
                                </span>
                              </>
                            )}
                          </div>

                          {p.attentionNeeded && (
                            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 pt-0.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>{p.attentionReason}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenPatient(p.id)}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                        >
                          Quick View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNavigateToFullChart(p.id)}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <span>Open Chart</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: 3. MEDICINE TRACKER */}
          {activeNav === "medicines" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-0.5">
                    Adherence &amp; Safety
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Medicine Tracker
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Live patient reminder responses, today&apos;s scheduled medicines, and adherence monitoring.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5" />
                    <span>Live Reminder Monitor</span>
                  </span>
                </div>
              </div>

              {/* Patient Medicine Tracker Monitoring Component */}
              <DoctorMedicineTracker onNavigateToHistory={handleNavigateToFullChart} />
            </div>
          )}

          {/* VIEW: 4. PATIENT CONSULTATIONS */}
          {activeNav === "consultations" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-0.5">
                    Clinical Intakes
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Patient Consultations
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Structured preliminary symptom summaries submitted by patients prior to appointment.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Physician Triage Active</span>
                  </span>
                </div>
              </div>

              {/* Consultation Inbox */}
              <DoctorConsultationInbox onSelectPatient={handleOpenPatient} />
            </div>
          )}

          {/* VIEW: 5. APPOINTMENTS SCHEDULE */}
          {activeNav === "appointments" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-0.5">
                    Clinical Schedule
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Appointments
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Manage today&apos;s appointments, upcoming schedules, and completed consultations.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Clinical Schedule</span>
                  </span>
                </div>
              </div>

              {/* Appointments Organizer with TODAY | UPCOMING | COMPLETED */}
              <DoctorAppointmentsView onSelectPatient={handleOpenPatient} />
            </div>
          )}

          {/* VIEW: 6. MEDICAL REPORTS */}
          {activeNav === "reports" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-0.5">
                  Diagnostic Documents
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Medical Reports
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Submitted laboratory tests, coagulation panels, and diagnostic reviews.
                </p>
              </div>

              <div className="space-y-3.5">
                {DOCTOR_MEDICAL_REPORTS.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {rep.patientName}
                          </span>
                          <span className="text-xs text-slate-400">• {rep.date}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              rep.status === "Flagged Review"
                                ? "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                            }`}
                          >
                            {rep.status}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {rep.reportName}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {rep.facility} • {rep.type}
                        </p>

                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <strong>Key Finding:</strong> {rep.keyFinding}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenPatient(rep.patientId)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer self-end md:self-auto shrink-0"
                    >
                      Patient Chart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* QUICK PATIENT LOOKUP MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative space-y-6 animate-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPatientId(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Patient Header */}
            <div className="flex items-center gap-4 pr-8">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center shrink-0">
                {selectedPatient.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedPatient.name}
                  </h3>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      selectedPatient.riskLevel === "HIGH"
                        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900"
                        : selectedPatient.riskLevel === "MODERATE"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900"
                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900"
                    }`}
                  >
                    {selectedPatient.riskLevel} Risk
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {selectedPatient.age} years • {selectedPatient.gender} • ID: {selectedPatient.id}
                </p>
              </div>
            </div>

            {/* Attention banner if needed */}
            {selectedPatient.attentionNeeded && selectedPatient.attentionReason && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2.5 text-xs font-semibold text-rose-800 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Attention: {selectedPatient.attentionReason}</span>
              </div>
            )}

            {/* Clinical Overview Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Primary Conditions</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedPatient.primaryCondition}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Active Medications</span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">
                    {selectedPatient.primaryMedicine ||
                      (selectedPatient.medications && selectedPatient.medications.length > 0
                        ? selectedPatient.medications.join(", ")
                        : `${selectedPatient.activeMedsCount} Prescriptions`)}
                  </span>
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Last Visit</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedPatient.lastVisit}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Next Appointment</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedPatient.nextAppointment || "None scheduled"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedPatientId(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleNavigateToFullChart(selectedPatient.id)}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Open Full Clinical Chart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onPatientAdded={(newPatient) => {
          setPatientsList((prev) => [newPatient, ...prev.filter((p) => p.id !== newPatient.id)]);
          fetchDoctorPatients().then((data) => {
            if (data && data.length > 0) setPatientsList(data);
          });
        }}
      />
    </div>
  );
}
