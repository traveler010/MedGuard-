"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import {
  DOCTOR_PATIENT_DIRECTORY,
  DoctorPatientDirectoryItem,
  getStoredDoctorPatients,
} from "@/data/mockDoctorPortal";
import { fetchDoctorPatients } from "@/services/patientService";
import { DoctorSidebar } from "@/components/dashboard/DoctorSidebar";
import { DoctorHeader } from "@/components/dashboard/DoctorHeader";
import { AddPatientModal } from "@/components/doctor/AddPatientModal";
import {
  Search,
  Filter,
  Calendar,
  Pill,
  Activity,
  ChevronRight,
  User,
  UserPlus,
  AlertTriangle,
} from "lucide-react";

export default function DoctorPatientsPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "ATTENTION" | "HIGH_RISK" | "STABLE">("ALL");
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

  const filteredPatients = useMemo(() => {
    return patientsList.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.primaryCondition.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);

      const matchesFilter =
        selectedFilter === "ALL"
          ? true
          : selectedFilter === "ATTENTION"
          ? p.attentionNeeded
          : selectedFilter === "HIGH_RISK"
          ? p.riskLevel === "HIGH"
          : !p.attentionNeeded && p.riskLevel !== "HIGH";

      return matchesSearch && matchesFilter;
    });
  }, [patientsList, searchQuery, selectedFilter]);

  const handleLogout = () => {
    showToast("Signed Out", "Doctor session ended.", "info");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090e17] text-slate-900 dark:text-slate-100 flex flex-row font-sans selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Sidebar */}
      <DoctorSidebar
        currentTab="patients"
        onSelectTab={(tab) => {
          if (tab === "dashboard") router.push("/doctor/dashboard");
          else if (tab === "patients") router.push("/doctor/patients");
          else if (tab === "consultations") router.push("/doctor/consultations");
          else if (tab === "appointments") router.push("/doctor/appointments");
          else if (tab === "medicines") router.push("/doctor/medicines");
          else router.push(`/doctor/dashboard`);
        }}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DoctorHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
          alerts={[]}
          onOpenAlert={() => {}}
        />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-0.5">
                Clinical Workspace
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Patients
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select a patient to open their detailed clinical workspace.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                id="btn-add-patient-page"
                onClick={() => setIsAddPatientModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer card-lift"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Patient</span>
              </button>

              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
                {filteredPatients.length} of {patientsList.length} Patients
              </span>
            </div>
          </div>

          {/* Search Patients & Filter Patients Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search patients */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patients by name or health condition..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition"
                />
              </div>

              {/* Filter patients */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedFilter("ALL")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    selectedFilter === "ALL"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  All Patients
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter("ATTENTION")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    selectedFilter === "ATTENTION"
                      ? "bg-rose-600 text-white shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600"
                  }`}
                >
                  Needs Attention
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter("HIGH_RISK")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    selectedFilter === "HIGH_RISK"
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-600"
                  }`}
                >
                  High Risk
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFilter("STABLE")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    selectedFilter === "STABLE"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600"
                  }`}
                >
                  Stable
                </button>
              </div>
            </div>
          </div>

          {/* Patient Cards / Rows:
              Each patient row/card shows only:
              * Patient name
              * Age
              * Basic health status
              * Medication status
              * Next appointment
          */}
          <div className="space-y-3">
            {filteredPatients.map((patient) => {
              const medicationStatusText =
                patient.attentionNeeded && patient.attentionReason?.includes("medicine")
                  ? `${patient.activeMedsCount} Prescribed · Adherence Alert`
                  : `${patient.activeMedsCount} Active Prescriptions`;

              const basicHealthStatusText = patient.primaryCondition;

              return (
                <div
                  key={patient.id}
                  onClick={() => router.push(`/doctor/patients/${patient.id}`)}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:border-teal-500/80 dark:hover:border-teal-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-2 min-w-0">
                    {/* Patient Name & Age */}
                    <div className="flex items-center gap-3">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                        {patient.name}
                      </h3>
                      <span className="text-xs font-bold text-slate-400">
                        {patient.age} years
                      </span>
                    </div>

                    {/* Basic Health Status & Medication Status */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>{basicHealthStatusText}</span>
                      </span>

                      <span>•</span>

                      <span className="flex items-center gap-1.5 font-semibold text-teal-700 dark:text-teal-400">
                        <Pill className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>
                          {patient.primaryMedicine ||
                            (patient.medications && patient.medications.length > 0
                              ? patient.medications.join(", ")
                              : medicationStatusText)}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Next Appointment & Workspace Trigger */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Next Appointment
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1 sm:justify-end">
                        <Calendar className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                        <span>{patient.nextAppointment || "None scheduled"}</span>
                      </span>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-teal-600 group-hover:text-white text-slate-400 dark:text-slate-300 flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredPatients.length === 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-12 text-center space-y-2">
                <p className="font-bold text-slate-900 dark:text-white">
                  No patients matching &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-xs text-slate-400">
                  Try adjusting your search query or filter selection.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

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
