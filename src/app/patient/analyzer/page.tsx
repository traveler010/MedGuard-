"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PatientMedicineAnalyzer } from "@/components/patient/PatientMedicineAnalyzer";
import { CareNavigationBar } from "@/components/patient/CareNavigationBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationDropdown } from "@/components/reminders-alerts/NotificationDropdown";
import {
  ShieldCheck,
  Stethoscope,
  LogOut,
  ArrowLeft,
  Activity,
  FileText,
  Clock,
} from "lucide-react";

export default function PatientMedicineAnalyzerPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090e17] text-slate-900 dark:text-slate-100 flex flex-col font-sans pb-32 sm:pb-28 selection:bg-teal-500 selection:text-white transition-colors duration-200">
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Navigation Bar / Top Header */}
        <header className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/patient/dashboard"
                className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 transition"
                title="Back to Patient Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                  MedGuard Patient Portal
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Raj Kumar
                </h1>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              <NotificationDropdown initialRole="patient" allowRoleSwitch={false} />

              <Link
                href="/doctor/dashboard"
                className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 px-3 py-2 rounded-xl border border-teal-200 dark:border-teal-800/80 flex items-center gap-1.5 transition"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Doctor View</span>
              </Link>

              <Link
                href="/login"
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-2 sm:px-3 sm:py-2 rounded-xl transition flex items-center gap-1.5"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit</span>
              </Link>
            </div>
          </div>

          {/* Quick Breadcrumb Nav */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/patient/dashboard"
              className="hover:text-teal-600 dark:hover:text-teal-400 transition"
            >
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-teal-700 dark:text-teal-400">Medication Risk Analyzer</span>
          </div>
        </header>

        {/* Dedicated Polypharmacy Risk Analyzer Component */}
        <section className="bg-transparent">
          <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Medication Risk Analyzer...</div>}>
            <PatientMedicineAnalyzer
              onNavigateToDoctor={() => router.push("/patient/consultation")}
            />
          </React.Suspense>
        </section>
      </main>

      {/* FINAL PATIENT NAVIGATION */}
      <CareNavigationBar currentDestination="analyzer" />
    </div>
  );
}
