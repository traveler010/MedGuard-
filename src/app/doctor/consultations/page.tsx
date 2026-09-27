"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/Toast";
import { DoctorSidebar } from "@/components/dashboard/DoctorSidebar";
import { DoctorHeader } from "@/components/dashboard/DoctorHeader";
import { DoctorConsultationInbox } from "@/components/doctor/DoctorConsultationInbox";
import { MessageSquare, ShieldCheck, Stethoscope } from "lucide-react";

export default function DoctorConsultationsPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    showToast("Signed Out", "Doctor session ended.", "info");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090e17] text-slate-900 dark:text-slate-100 flex flex-row font-sans selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Sidebar */}
      <DoctorSidebar
        currentTab="consultations"
        onSelectTab={(tab) => {
          if (tab === "dashboard") router.push("/doctor/dashboard");
          else if (tab === "patients") router.push("/doctor/patients");
          else if (tab === "consultations") router.push("/doctor/consultations");
          else if (tab === "appointments") router.push("/doctor/appointments");
          else if (tab === "medicines") router.push("/doctor/medicines");
          else router.push("/doctor/dashboard");
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
                Clinical Inbox
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Consultations
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Review preliminary symptom summaries submitted by patients and deliver clinical decisions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Physician Triage Active</span>
              </span>

              <Link
                href="/doctor/consultation/new"
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Start Consultation</span>
              </Link>
            </div>
          </div>

          {/* Consultation Inbox Component */}
          <DoctorConsultationInbox />
        </main>
      </div>
    </div>
  );
}
