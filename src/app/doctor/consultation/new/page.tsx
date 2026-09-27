"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DoctorSidebar, NavItem } from "@/components/dashboard/DoctorSidebar";
import { DoctorHeader } from "@/components/dashboard/DoctorHeader";
import { DoctorConsultationWorkspace } from "@/components/doctor/consultation-redesign";
import { useToast } from "@/components/Toast";
import {
  ArrowLeft,
  Stethoscope,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

function ConsultationWorkflowContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const patientIdParam = searchParams.get("patientId");

  // Sidebar Layout State
  const [activeNav, setActiveNav] = useState<NavItem>("new_consultation");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    showToast("Signed Out", "Doctor session ended.", "info");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#090e17] text-slate-800 dark:text-slate-100 flex font-sans antialiased selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* 1. Left Sidebar */}
      <DoctorSidebar
        currentTab={activeNav}
        onSelectTab={(tab) => {
          setActiveNav(tab);
          if (tab === "dashboard") router.push("/doctor/dashboard");
          else if (tab === "patients") router.push("/doctor/patients");
          else if (tab === "consultations") router.push("/doctor/consultations");
          else if (tab === "appointments") router.push("/doctor/appointments");
          else if (tab === "medicines") router.push("/doctor/medicines");
          else if (tab === "new_consultation") router.push("/doctor/consultation/new");
        }}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={handleLogout}
        onNewConsultation={() => router.push("/doctor/consultation/new")}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <DoctorHeader
          searchQuery=""
          onSearchChange={() => {}}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
          alerts={[]}
          onOpenAlert={() => {}}
        />

        {/* 3. Consultation Workflow Main */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Breadcrumb & Status */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <Link
              href="/doctor/consultations"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Consultations Inbox</span>
            </Link>

            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-3.5 py-1.5 rounded-full border border-teal-200 dark:border-teal-800/60 shadow-2xs">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Central Clinical Consultation Workflow</span>
            </div>
          </div>

          {/* Central Clinical Redesign Workspace */}
          <DoctorConsultationWorkspace initialPatientId={patientIdParam} />
        </main>
      </div>
    </div>
  );
}

export default function NewConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 text-center text-xs text-slate-500">
          Loading MedGuard Clinical Consultation Workspace...
        </div>
      }
    >
      <ConsultationWorkflowContent />
    </Suspense>
  );
}
