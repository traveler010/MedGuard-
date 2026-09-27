"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Stethoscope,
  Info,
  Layers,
  ChevronRight,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { getRiskAnalysis } from "@/services";

// Layout Components
import { DoctorSidebar, NavItem } from "@/components/dashboard/DoctorSidebar";
import { DoctorHeader } from "@/components/dashboard/DoctorHeader";
import { useToast } from "@/components/Toast";

// Risk Analysis Components
import { StructuredMedicationAnalysis } from "@/components/risk-analysis/StructuredMedicationAnalysis";
import { RiskScoreHero } from "@/components/risk-analysis/RiskScoreHero";
import { RiskBreakdownGrid } from "@/components/risk-analysis/RiskBreakdownGrid";
import { WhyFlaggedSection } from "@/components/risk-analysis/WhyFlaggedSection";
import { RecommendedActionPanel } from "@/components/risk-analysis/RecommendedActionPanel";
import {
  AlternativesList,
  AlternativeMedication,
} from "@/components/risk-analysis/AlternativesList";
import {
  RiskDetailModal,
  RiskCardType,
} from "@/components/risk-analysis/RiskDetailModal";
import { AdjustMedicationModal } from "@/components/risk-analysis/AdjustMedicationModal";
import { ContinueReviewModal } from "@/components/risk-analysis/ContinueReviewModal";
import { AnalysisLoadingOverlay } from "@/components/risk-analysis/AnalysisLoadingOverlay";

function RiskAnalysisContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const consultationId = (params?.id as string) || "demo-consultation";
  const urlMedParam = searchParams.get("med");
  const urlDosageParam = searchParams.get("dosage");

  // Navigation & Sidebar Layout State
  const [activeNav, setActiveNav] = useState<NavItem>("new_consultation");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Patient & Proposed Medication State (Defaults to Raj Kumar, 68 & Pain Medication X)
  const [patientName] = useState("Raj Kumar");
  const [patientAge] = useState(68);
  const [existingMedication] = useState("Warfarin Sodium (4 mg daily)");
  const [proposedMedicine, setProposedMedicine] = useState(
    urlMedParam || "Pain Medication X"
  );
  const [proposedDosage, setProposedDosage] = useState(
    urlDosageParam || "10 mg Oral Tablet (Q8H)"
  );
  const [prescriptionDuration, setPrescriptionDuration] = useState("14 Days");

  // Clinical Decision / Neutralized State
  const [isNeutralized, setIsNeutralized] = useState(false);
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string | null>(
    null
  );
  const [neutralizedMedicineName, setNeutralizedMedicineName] = useState(
    "Acetaminophen 500mg"
  );
  const [riskScore, setRiskScore] = useState(94);

  // Consume getRiskAnalysis service
  useEffect(() => {
    let isMounted = true;
    getRiskAnalysis(consultationId).then((data) => {
      if (isMounted && data) {
        setRiskScore(data.riskScore);
        if (data.proposedMedication?.name && !urlMedParam) {
          setProposedMedicine(data.proposedMedication.name);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [consultationId, urlMedParam]);

  // Modals & Overlay States
  const [activeModalType, setActiveModalType] = useState<RiskCardType>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [isLoadingScan, setIsLoadingScan] = useState(false);

  // Action Handlers
  const handleOpenDetailModal = (type: RiskCardType) => {
    setActiveModalType(type);
  };

  const handleSelectAlternative = (alt: AlternativeMedication) => {
    setSelectedAlternativeId(alt.id);
    setNeutralizedMedicineName(`${alt.name} (${alt.dosage})`);
    setIsNeutralized(true);
    setRiskScore(alt.riskScore);

    showToast(
      "Alternative Selected",
      `Switched to ${alt.name}. Polypharmacy risk reduced from 94 to ${alt.riskScore}.`,
      "success"
    );
  };

  const handleRevertToOriginal = () => {
    setIsNeutralized(false);
    setSelectedAlternativeId(null);
    setRiskScore(94);
    showToast(
      "Reverted to Original",
      "Showing analysis for Pain Medication X (High Risk)",
      "info"
    );
  };

  const handleApplyAdjustment = (adjusted: {
    dosage: string;
    frequency: string;
    duration: string;
    reducedRisk: boolean;
  }) => {
    setProposedDosage(`${adjusted.dosage} • ${adjusted.frequency}`);
    setPrescriptionDuration(adjusted.duration);
    setIsNeutralized(true);
    setNeutralizedMedicineName(`Pain Medication X (${adjusted.dosage}) [Adjusted Short-Course]`);
    setRiskScore(38);

    showToast(
      "Regimen Adjusted",
      `Reduced to ${adjusted.duration} with gastro-protection. Risk lowered to 38/100.`,
      "success"
    );
  };

  const handleProceedWithOverride = (justification: string) => {
    showToast(
      "Clinical Override Documented",
      "Justification signed and recorded in electronic health ledger.",
      "warning"
    );
  };

  const handleFinalizePrescription = () => {
    showToast(
      "Prescription Ready for Review",
      `Opening final prescription review for ${patientName}`,
      "success"
    );
    router.push(
      `/doctor/consultation/${consultationId}/review?med=${encodeURIComponent(
        isNeutralized ? neutralizedMedicineName : proposedMedicine
      )}&dosage=${encodeURIComponent(proposedDosage)}&risk=${
        isNeutralized ? "LOW" : "HIGH"
      }`
    );
  };

  const handleScrollToAlternatives = () => {
    const el = document.getElementById("alternatives-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTriggerRescan = () => {
    setIsLoadingScan(true);
  };

  const handleScanCompleted = () => {
    setIsLoadingScan(false);
    showToast(
      "Safety Verification Complete",
      "Multi-point clinical review refreshed for current patient parameters.",
      "info"
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#090e17] text-slate-800 dark:text-slate-100 flex font-sans antialiased selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* 1. Left Navigation Sidebar */}
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
          {/* Top Breadcrumb & Return Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Link
                href="/doctor/dashboard"
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1"
              >
                Dashboard
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
              <Link
                href="/doctor/consultation/new"
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                Consultations
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
              <span className="text-slate-900 dark:text-white font-bold">{patientName}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
              <span className="text-teal-700 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950/40 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800/60">
                Risk Analysis
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/doctor/consultation/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Consultation</span>
              </Link>

              <Link
                href={`/doctor/consultation/${consultationId}/review?med=${encodeURIComponent(
                  isNeutralized ? neutralizedMedicineName : proposedMedicine
                )}&dosage=${encodeURIComponent(proposedDosage)}&risk=${
                  isNeutralized ? "LOW" : "HIGH"
                }`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Prescription Review</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Demonstration Notice Banner (Hackathon Requirement) */}
          <div className="rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-300/80 dark:border-amber-800/60 p-3.5 px-4 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 transition-colors">
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong>Demonstration Prototype:</strong> Medical risk evaluations, scores, and drug suggestions are simulated mock demonstration data and do not provide real medical advice.
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-200/60 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-md shrink-0 hidden sm:inline-block">
              Hackathon Demo Mode
            </span>
          </div>

          {/* CENTRAL INTELLIGENT CLINICAL INTERFACE: Structured Medication Analysis & Safety Illustration */}
          <StructuredMedicationAnalysis
            patientName={patientName}
            patientAge={patientAge}
            existingMedicine={existingMedication}
            proposedMedicine={proposedMedicine}
            proposedDosage={proposedDosage}
            prescriptionDuration={prescriptionDuration}
            isNeutralized={isNeutralized}
            neutralizedMedicineName={neutralizedMedicineName}
            riskScore={riskScore}
            onSelectAlternative={handleScrollToAlternatives}
            onAdjustDose={() => setIsAdjustModalOpen(true)}
            onClinicalOverride={() => setIsOverrideModalOpen(true)}
            onResetToOriginal={handleRevertToOriginal}
          />

          {/* 4. RECOMMENDED ACTION: Highlighted Action Panel */}
          <RecommendedActionPanel
            onViewAlternatives={handleScrollToAlternatives}
            onAdjustMedication={() => setIsAdjustModalOpen(true)}
            onContinueReview={() => setIsOverrideModalOpen(true)}
            isNeutralized={isNeutralized}
          />

          {/* 5. ALTERNATIVES: Alternative Medication Cards */}
          <AlternativesList
            onSelectAlternative={handleSelectAlternative}
            selectedAlternativeId={selectedAlternativeId}
            onFinalizePrescription={handleFinalizePrescription}
            onRevertToOriginal={handleRevertToOriginal}
          />
        </main>
      </div>

      {/* Deep-Dive Risk Details Modal */}
      <RiskDetailModal
        type={activeModalType}
        onClose={() => setActiveModalType(null)}
        patientName={patientName}
        patientAge={patientAge}
        medicationName={proposedMedicine}
      />

      {/* Adjust Medication Modal */}
      <AdjustMedicationModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        currentMedication={{
          name: proposedMedicine,
          dosage: proposedDosage,
          frequency: "Every 8 hours",
          duration: prescriptionDuration,
        }}
        onSaveAdjusted={handleApplyAdjustment}
      />

      {/* Continue Review / Clinical Override Modal */}
      <ContinueReviewModal
        isOpen={isOverrideModalOpen}
        onClose={() => setIsOverrideModalOpen(false)}
        patientName={patientName}
        medicationName={proposedMedicine}
        onProceedWithOverride={handleProceedWithOverride}
      />

      {/* Animated Re-scan Loading State */}
      <AnalysisLoadingOverlay
        isOpen={isLoadingScan}
        onComplete={handleScanCompleted}
        patientName={patientName}
        proposedMedicine={proposedMedicine}
      />
    </div>
  );
}

export default function RiskAnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
            <span className="font-bold text-sm">Loading Risk Analysis Engine...</span>
          </div>
        </div>
      }
    >
      <RiskAnalysisContent />
    </Suspense>
  );
}
