"use client";

import React, { useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  User,
  Pill,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";

import { DoctorSidebar, NavItem } from "@/components/dashboard/DoctorSidebar";
import { DoctorHeader } from "@/components/dashboard/DoctorHeader";
import { useToast } from "@/components/Toast";
import { createPrescription } from "@/services";

// Review Components
import { MedicationSummarySection } from "@/components/prescription-review/MedicationSummarySection";
import { RiskSummaryReviewCard } from "@/components/prescription-review/RiskSummaryReviewCard";
import { FinalPrescriptionSummaryCard } from "@/components/prescription-review/FinalPrescriptionSummaryCard";
import { ReviewConfirmationModal } from "@/components/prescription-review/ReviewConfirmationModal";
import { ModifyPrescriptionModal } from "@/components/prescription-review/ModifyPrescriptionModal";
import { PrescriptionSuccessCard } from "@/components/prescription-review/PrescriptionSuccessCard";

function PrescriptionReviewContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const consultationId = (params?.id as string) || "cons-101";

  // URL query params fallback
  const urlMed = searchParams.get("med");
  const urlDosage = searchParams.get("dosage");
  const urlRisk = searchParams.get("risk") as "HIGH" | "MODERATE" | "LOW" | null;

  // Sidebar Layout State
  const [activeNav, setActiveNav] = useState<NavItem>("new_consultation");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Patient State
  const [patientName] = useState("Raj Kumar");
  const [patientAge] = useState(68);
  const [patientId] = useState("#QX-94108");

  // Medication State
  const [medication, setMedication] = useState(
    urlMed || "Acetaminophen (Tylenol)"
  );
  const [dosage, setDosage] = useState(urlDosage || "500 mg");
  const [frequency, setFrequency] = useState("Every 6 hours as needed (PRN)");
  const [duration, setDuration] = useState("5 Days");
  const [instructions, setInstructions] = useState(
    "Take with a full glass of water. Do not exceed 2,000 mg (4 tablets) in any 24-hour period."
  );
  const [isRemoved, setIsRemoved] = useState(false);

  // Risk Assessment State (Defaults to LOW if safe alternative, or URL param)
  const [overallRisk, setOverallRisk] = useState<"HIGH" | "MODERATE" | "LOW">(
    urlRisk || (medication.toLowerCase().includes("pain med") ? "HIGH" : "LOW")
  );

  // Modals & Final Success Screen State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isCompletedSuccess, setIsCompletedSuccess] = useState(false);

  // Decision Handlers
  const handleApproveDecision = () => {
    // Show confirmation modal as required
    setIsConfirmModalOpen(true);
  };

  const handleModifyDecision = () => {
    setIsModifyModalOpen(true);
  };

  const handleRemoveDecision = () => {
    setIsRemoved(true);
    showToast(
      "Medication Removed",
      "Proposed medication was removed from this prescription order.",
      "info"
    );
  };

  const handleRestoreProposed = () => {
    setIsRemoved(false);
    showToast(
      "Medication Restored",
      "Proposed medication restored to review order.",
      "info"
    );
  };

  const handleSaveModification = (updated: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }) => {
    setMedication(updated.medication);
    setDosage(updated.dosage);
    setFrequency(updated.frequency);
    setDuration(updated.duration);
    setInstructions(updated.instructions);

    // If modified to lower dosage/duration, default to Low risk
    if (updated.duration.toLowerCase().includes("3") || updated.medication.toLowerCase().includes("acetaminophen")) {
      setOverallRisk("LOW");
    }

    showToast(
      "Prescription Updated",
      `Saved modifications for ${updated.medication}`,
      "success"
    );
  };

  const handleModalConfirmed = async () => {
    try {
      await createPrescription({
        patientName,
        patientAge,
        status: "APPROVED",
        doctorDecision: "APPROVE",
        overallRisk,
        medications: [
          {
            id: "rx-prop",
            name: medication,
            dosage,
            frequency,
            duration,
            instructions,
            riskLevel: overallRisk,
            isProposed: true,
          },
        ],
      });
    } catch (err) {
      console.warn("Prescription service sync error:", err);
    }

    showToast(
      "Review Confirmed",
      "Clinical review verified. Finalizing prescription order...",
      "success"
    );
    // Proceed to success screen
    setIsCompletedSuccess(true);
  };

  const handleFinalPrescriptionConfirm = () => {
    setIsConfirmModalOpen(true);
  };

  const handleBackToAnalysis = () => {
    router.push(`/doctor/consultation/${consultationId}/analysis`);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#090e17] text-slate-800 dark:text-slate-100 flex font-sans antialiased selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* 1. Left Sidebar */}
      <DoctorSidebar
        currentTab={activeNav}
        onSelectTab={(tab) => {
          setActiveNav(tab);
          if (tab === "dashboard") router.push("/doctor/dashboard");
          if (tab === "patients") router.push("/doctor/patients/pat-1");
          if (tab === "new_consultation") router.push("/doctor/consultation/new");
        }}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={() => router.push("/login")}
        onNewConsultation={() => router.push("/doctor/consultation/new")}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <DoctorHeader
          searchQuery=""
          onSearchChange={() => {}}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
          alerts={[]}
          onOpenAlert={() => {}}
        />

        {/* Clinical Workspace Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Top Breadcrumb Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Link
                href="/doctor/dashboard"
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                Dashboard
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link
                href={`/doctor/consultation/${consultationId}/analysis`}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                Risk Analysis
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-teal-700 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950/40 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                Prescription Review
              </span>
            </div>

            <button
              onClick={handleBackToAnalysis}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shadow-2xs self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Analysis</span>
            </button>
          </div>

          {/* If successfully completed, show the polished success screen */}
          {isCompletedSuccess ? (
            <PrescriptionSuccessCard
              patientName={patientName}
              patientAge={patientAge}
              patientId={patientId}
              medicationName={medication}
              dosage={dosage}
              frequency={frequency}
              duration={duration}
              overallRisk={overallRisk}
            />
          ) : (
            <div className="space-y-6">
              {/* HEADER & PATIENT BANNER */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                      Consultation Final Step
                    </span>
                    <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Case #{consultationId}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Prescription Review
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                    Review active medications, verified safety factors, and final clinical recommendations before approving this prescription order.
                  </p>
                </div>

                {/* PATIENT PROFILE CARD */}
                <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                    RK
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                      Patient
                    </span>
                    <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                      {patientName}
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {patientAge} years • ID: <span className="font-mono">{patientId}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* MEDICATION SUMMARY: Existing medications + Proposed medication */}
              <MedicationSummarySection
                proposedMedication={{
                  name: medication,
                  dosage,
                  frequency,
                  duration,
                  isSafeAlternative: overallRisk === "LOW",
                }}
                isProposedRemoved={isRemoved}
                onRestoreProposed={handleRestoreProposed}
              />

              {/* RISK SUMMARY: Overall Risk (HIGH/MODERATE/LOW) + Individual factors */}
              <RiskSummaryReviewCard
                overallRisk={overallRisk}
                onSelectRisk={(r) => setOverallRisk(r)}
                patientAge={patientAge}
              />

              {/* DOCTOR DECISION & FINAL SUMMARY CARD */}
              <FinalPrescriptionSummaryCard
                patientName={patientName}
                patientAge={patientAge}
                patientId={patientId}
                medication={medication}
                dosage={dosage}
                frequency={frequency}
                duration={duration}
                overallRisk={overallRisk}
                recommendation={
                  overallRisk === "LOW"
                    ? "Safe for co-administration with Warfarin. Cap total daily dose at 2,000 mg to prevent hepatic overload."
                    : "High bleeding collision detected with active Warfarin. Strongly consider deprescribing or switching to topical non-NSAID alternative."
                }
                onApproveDecision={handleApproveDecision}
                onModifyDecision={handleModifyDecision}
                onRemoveDecision={handleRemoveDecision}
                onConfirmPrescription={handleFinalPrescriptionConfirm}
                onBackToAnalysis={handleBackToAnalysis}
                isRemoved={isRemoved}
              />
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal before approval */}
      <ReviewConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleModalConfirmed}
        patientName={patientName}
        patientAge={patientAge}
        medicationName={medication}
        dosage={dosage}
        overallRisk={overallRisk}
      />

      {/* Modify Prescription Modal */}
      <ModifyPrescriptionModal
        isOpen={isModifyModalOpen}
        onClose={() => setIsModifyModalOpen(false)}
        currentValues={{
          medication,
          dosage,
          frequency,
          duration,
          instructions,
        }}
        onSave={handleSaveModification}
      />
    </div>
  );
}

export default function PrescriptionReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
            <span className="font-bold text-sm">Loading Prescription Review...</span>
          </div>
        </div>
      }
    >
      <PrescriptionReviewContent />
    </Suspense>
  );
}
