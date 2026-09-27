"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Info,
  ArrowRight,
  Sparkles,
  Plus,
  Pill,
  Clock,
  Calendar,
  Edit2,
  Trash2,
  RefreshCw,
  FileText,
  Heart,
  Check,
  Activity,
  Layers,
  Zap,
  Printer,
  Download,
  Eye,
  User,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MedicationEntry,
  ProposedMedicationInput,
  PolypharmacyAnalysisResult,
  FullRegimenAnalysisResult,
  runPolypharmacyAnalysis,
  runFullRegimenAnalysis,
} from "@/services/polypharmacyRiskEngine";
import {
  createReportItemFromResult,
  createReportItemFromFullRegimen,
  saveMedicationAnalysisReport,
} from "@/services/medicationAnalysisService";
import { AddEditMedicineModal } from "./analyzer/AddEditMedicineModal";
import { RiskReportModal } from "./analyzer/RiskReportModal";
import { PatientCaregiverSummaryModal } from "./analyzer/PatientCaregiverSummaryModal";
import { ClinicalPdfReportModal } from "./analyzer/ClinicalPdfReportModal";
import { useToast } from "@/components/Toast";

interface PatientMedicineAnalyzerProps {
  onNavigateToDoctor?: () => void;
  initialPatientId?: string;
  initialRole?: "patient" | "doctor";
}

const PATIENT_CHARTS: Record<string, { name: string; age: number; meds: MedicationEntry[] }> = {
  "pat-1": {
    name: "Raj Kumar",
    age: 68,
    meds: [
      {
        id: "med-1",
        name: "Blood Pressure Medicine (Lisinopril)",
        dose: "10 mg",
        frequency: "Once daily",
        scheduleTime: "08:00 AM",
        duration: "Ongoing / Chronic",
        instructions: "Take in the morning with a full glass of water. Monitor BP.",
        source: "Patient Health Record",
      },
      {
        id: "med-2",
        name: "Blood Thinner (Warfarin Sodium)",
        dose: "4 mg",
        frequency: "Once daily",
        scheduleTime: "06:00 PM",
        duration: "Ongoing / Chronic",
        instructions: "Take in evening. Target INR 2.0–3.0. Avoid NSAIDs.",
        source: "Patient Health Record",
      },
      {
        id: "med-3",
        name: "Cholesterol Medicine (Atorvastatin)",
        dose: "20 mg",
        frequency: "Once daily",
        scheduleTime: "09:00 PM",
        duration: "Ongoing / Chronic",
        instructions: "Take at bedtime.",
        source: "Patient Health Record",
      },
      {
        id: "med-4",
        name: "Metformin ER",
        dose: "500 mg",
        frequency: "Twice daily",
        scheduleTime: "08:00 AM • 08:00 PM",
        duration: "Ongoing / Chronic",
        instructions: "Take with morning and evening meals.",
        source: "Patient Health Record",
      },
    ],
  },
  "pat-2": {
    name: "Priya Sharma",
    age: 52,
    meds: [
      { id: "p2-1", name: "Metformin ER", dose: "500 mg", frequency: "Twice daily", scheduleTime: "08:00 AM • 08:00 PM", duration: "Ongoing", instructions: "With food", source: "Patient Health Record" },
      { id: "p2-2", name: "Glipizide", dose: "5 mg", frequency: "Once daily", scheduleTime: "Morning", duration: "Ongoing", instructions: "30 min before breakfast", source: "Patient Health Record" },
      { id: "p2-3", name: "Atorvastatin", dose: "20 mg", frequency: "Once daily", scheduleTime: "Bedtime", duration: "Ongoing", source: "Patient Health Record" },
    ],
  },
  "pat-4": {
    name: "Anita Desai",
    age: 71,
    meds: [
      { id: "p4-1", name: "Torsemide (Diuretic)", dose: "10 mg", frequency: "Once daily", scheduleTime: "09:00 AM", duration: "Ongoing", instructions: "Take in the morning", source: "Patient Health Record" },
      { id: "p4-2", name: "Acetaminophen", dose: "500 mg", frequency: "As needed", duration: "PRN", instructions: "For knee osteoarthritis", source: "Patient Health Record" },
    ],
  },
};

export function PatientMedicineAnalyzer({
  onNavigateToDoctor,
  initialPatientId = "pat-1",
  initialRole = "patient",
}: PatientMedicineAnalyzerProps) {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const activePatientId = searchParams?.get("patientId") || initialPatientId;
  const consultationId = searchParams?.get("consultationId") || undefined;
  const role = searchParams?.get("role") || initialRole;

  const currentChart = PATIENT_CHARTS[activePatientId] || PATIENT_CHARTS["pat-1"];

  // 1. Patient Profile State
  const [patientName, setPatientName] = useState(currentChart.name);
  const [patientAge, setPatientAge] = useState<number>(currentChart.age);
  const [isRecordLoaded, setIsRecordLoaded] = useState(true);

  // 2. Current Medications List (Supports 2, 3, 5, 10+ medicines)
  const [currentMeds, setCurrentMeds] = useState<MedicationEntry[]>(currentChart.meds);

  // 3. Proposed Medication State
  const [proposedMed, setProposedMed] = useState<ProposedMedicationInput>({
    name: "Pain Medication X (NSAID / Ibuprofen 400 mg)",
    dose: "400 mg oral tablet",
    frequency: "Every 8 hours (TID)",
    duration: "14 days",
    instructions: "Take after meals as needed for acute right knee joint flare",
  });

  // 4a. Primary Analysis State: Full Regimen (All Medications) (Requirement 1, 2, 4)
  const [fullRegimenResult, setFullRegimenResult] = useState<FullRegimenAnalysisResult | null>(null);
  const [isAnalyzingFullProfile, setIsAnalyzingFullProfile] = useState(false);
  const [fullProfileStep, setFullProfileStep] = useState<string>("");
  const [activeAnalysisMode, setActiveAnalysisMode] = useState<"full_profile" | "new_medicine">("full_profile");

  // 4b. Secondary Analysis State: Proposed Medicine Check (Requirement 3, 19)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [result, setResult] = useState<PolypharmacyAnalysisResult | null>(null);

  // 5. Expandable Category Details
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // 6. Modals & PDF Report Generation (Requirement 12, 13)
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [medEditing, setMedEditing] = useState<MedicationEntry | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isPdfGenerated, setIsPdfGenerated] = useState(false);

  // Run initial analysis automatically on mount so the workspace opens populated with full profile
  useEffect(() => {
    const chart = PATIENT_CHARTS[activePatientId] || PATIENT_CHARTS["pat-1"];
    setPatientName(chart.name);
    setPatientAge(chart.age);
    setCurrentMeds(chart.meds);
    setIsRecordLoaded(true);

    // 1. Primary: Run Full Regimen Analysis across all active medications
    const initialFullResult = runFullRegimenAnalysis({
      currentMeds: chart.meds,
      patientAge: chart.age,
      patientName: chart.name,
      patientId: activePatientId,
    });
    setFullRegimenResult(initialFullResult);

    // 2. Secondary: Run Proposed Medicine check against regimen
    const initialResult = runPolypharmacyAnalysis({
      proposed: proposedMed,
      currentMeds: chart.meds,
      patientAge: chart.age,
      patientName: chart.name,
    });
    setResult(initialResult);

    if (consultationId) {
      try {
        const fullReportItem = createReportItemFromFullRegimen({
          regimenResult: initialFullResult,
          consultationId,
          doctorId: role === "doctor" ? "doc-1" : undefined,
          doctorName: role === "doctor" ? "Dr. Sarah Mitchell, MD" : undefined,
        });
        saveMedicationAnalysisReport(fullReportItem);
      } catch (err) {
        console.error("Auto attach on mount failed", err);
      }
    }
  }, [activePatientId, consultationId, role]);

  // Handlers for Current Medications
  const handleOpenAddMed = () => {
    setMedEditing(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditMed = (med: MedicationEntry) => {
    setMedEditing(med);
    setIsAddEditModalOpen(true);
  };

  const handleSaveMed = (saved: MedicationEntry) => {
    if (medEditing) {
      setCurrentMeds((prev) => prev.map((m) => (m.id === saved.id ? saved : m)));
      showToast("Medication Updated", `Updated ${saved.name}`, "info");
    } else {
      setCurrentMeds((prev) => [...prev, saved]);
      showToast("Medication Added", `Added ${saved.name} to active list`, "success");
    }
  };

  const handleRemoveMed = (id: string) => {
    if (currentMeds.length <= 1) {
      showToast("Warning", "At least one current medication is required for comparison.", "warning");
      return;
    }
    const target = currentMeds.find((m) => m.id === id);
    setCurrentMeds((prev) => prev.filter((m) => m.id !== id));
    showToast("Medication Removed", `Removed ${target?.name || "medicine"}`, "info");
  };

  const handleResetToPatientRecord = () => {
    const chart = PATIENT_CHARTS[activePatientId] || PATIENT_CHARTS["pat-1"];
    setCurrentMeds(chart.meds);
    setPatientAge(chart.age);
    setPatientName(chart.name);
    setIsRecordLoaded(true);
    showToast("Record Restored", `Reloaded active medications from ${chart.name}'s patient chart`, "info");
  };

  // PRIMARY ACTION: Full Regimen Polypharmacy Risk Analysis (Requirement 1, 2, 4)
  const handleAnalyzeFullProfile = () => {
    if (currentMeds.length === 0) {
      showToast("Medications Required", "Please maintain at least one current medication in the patient profile.", "warning");
      return;
    }

    setIsAnalyzingFullProfile(true);
    setFullProfileStep(`Scanning complete profile (${currentMeds.length} medications)...`);

    setTimeout(() => {
      setFullProfileStep("Evaluating pairwise interactions across complete regimen...");

      setTimeout(() => {
        setFullProfileStep("Synthesizing cumulative side-effect loads & Beers criteria...");

        setTimeout(() => {
          const outcome = runFullRegimenAnalysis({
            currentMeds,
            patientAge,
            patientName,
            patientId: activePatientId,
          });

          setFullRegimenResult(outcome);
          setIsAnalyzingFullProfile(false);
          setFullProfileStep("");
          setActiveAnalysisMode("full_profile");

          // Save report linked to consultation (Requirement 1, 14, 18)
          try {
            const reportItem = createReportItemFromFullRegimen({
              regimenResult: outcome,
              consultationId: consultationId || "con-2",
              doctorId: role === "doctor" ? "doc-1" : undefined,
              doctorName: role === "doctor" ? "Dr. Sarah Mitchell, MD" : undefined,
            });
            saveMedicationAnalysisReport(reportItem);
          } catch (e) {
            console.error("Failed to save full profile report", e);
          }

          showToast(
            "Full Profile Analyzed",
            `Evaluated all ${currentMeds.length} medications together. Overall risk: ${outcome.overallRisk}.`,
            outcome.overallRisk === "HIGH" ? "error" : outcome.overallRisk === "MODERATE" ? "warning" : "success"
          );
        }, 400);
      }, 400);
    }, 400);
  };

  // Generate Official PDF Report (Requirement 12, 13, 14)
  const handleGeneratePdfReport = () => {
    setIsPdfGenerated(true);
    if (fullRegimenResult) {
      try {
        const reportItem = createReportItemFromFullRegimen({
          regimenResult: fullRegimenResult,
          consultationId: consultationId || "con-2",
          doctorId: role === "doctor" ? "doc-1" : undefined,
          doctorName: role === "doctor" ? "Dr. Sarah Mitchell, MD" : undefined,
        });
        saveMedicationAnalysisReport(reportItem);
      } catch (e) {
        console.error("Failed to save PDF generated report", e);
      }
    }
    showToast(
      "Medication Risk Report Generated",
      "Official printable clinical decision-support document generated and linked to doctor portal.",
      "success"
    );
    setIsPdfModalOpen(true);
  };

  // SECONDARY ACTION: Check Proposed Medicine Against All Current Medications (Requirement 3, 19)
  const handleAnalyze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!proposedMed.name.trim()) {
      showToast("Input Required", "Please enter a proposed medication name.", "warning");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    // Step 1: Checking medication profile...
    setAnalysisStep("Checking medication profile...");

    setTimeout(() => {
      // Step 2: Cross-checking current medications...
      setAnalysisStep("Cross-checking current medications...");

      setTimeout(() => {
        // Step 3: Preparing risk assessment...
        setAnalysisStep("Preparing risk assessment...");

        setTimeout(() => {
          const outcome = runPolypharmacyAnalysis({
            proposed: proposedMed,
            currentMeds,
            patientAge,
            patientName,
          });

          setResult(outcome);
          setIsAnalyzing(false);
          setAnalysisStep("");
          setActiveAnalysisMode("new_medicine");

          // Automatically link and save the analysis report for doctor consultation cross-checking (Requirement 1)
          try {
            const reportItem = createReportItemFromResult({
              result: outcome,
              proposed: proposedMed,
              currentMeds,
              patientId: activePatientId,
              consultationId: consultationId || "con-2",
              doctorId: role === "doctor" ? "doc-1" : undefined,
              doctorName: role === "doctor" ? "Dr. Sarah Mitchell, MD" : undefined,
            });
            saveMedicationAnalysisReport(reportItem);
          } catch (e) {
            console.error("Failed to auto-save medication report", e);
          }

          showToast(
            "Analysis Complete",
            `Evaluated proposed medicine against all ${currentMeds.length} active medications.`,
            outcome.overallRisk === "HIGH" ? "error" : outcome.overallRisk === "MODERATE" ? "warning" : "success"
          );
        }, 450);
      }, 450);
    }, 450);
  };

  // Quick Preset Scenarios for demonstration
  const handleLoadScenario = (type: "nsaid_high" | "safe_alt" | "opioid_sedative" | "antibiotic_safe") => {
    if (type === "nsaid_high") {
      setProposedMed({
        name: "Pain Medication X (Ibuprofen / NSAID)",
        dose: "400 mg oral tablet",
        frequency: "Every 8 hours",
        duration: "14 days",
        instructions: "Take with food for acute knee stiffness",
      });
      showToast("Scenario Loaded", "High Risk: NSAID + Active Warfarin Anticoagulation", "info");
    } else if (type === "safe_alt") {
      setProposedMed({
        name: "Acetaminophen (Tylenol)",
        dose: "500 mg oral tablet",
        frequency: "Every 6-8 hours PRN (Max 2,000 mg/day)",
        duration: "5 days",
        instructions: "Safe pain relief with zero platelet suppression",
      });
      showToast("Scenario Loaded", "Low Risk Alternative: Acetaminophen PRN", "success");
    } else if (type === "opioid_sedative") {
      setProposedMed({
        name: "Tramadol Hydrochloride",
        dose: "50 mg oral tablet",
        frequency: "Twice daily",
        duration: "10 days",
        instructions: "For moderate chronic joint pain",
      });
      showToast("Scenario Loaded", "Moderate/High Risk: Controlled Substance / Dependence", "warning");
    } else if (type === "antibiotic_safe") {
      setProposedMed({
        name: "Amoxicillin",
        dose: "500 mg oral capsule",
        frequency: "Three times daily",
        duration: "7 days",
        instructions: "Complete entire course for dental prophylaxis",
      });
      showToast("Scenario Loaded", "Compatible Antibiotic Regimen", "info");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Consultation Linkage Banner (Requirement 1) */}
      {consultationId && (
        <div className="p-4 sm:p-5 rounded-3xl bg-teal-50/90 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-teal-800 dark:text-teal-300 uppercase tracking-wider">
                  Linked to Consultation #{consultationId}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-200/80 dark:bg-teal-900 text-teal-900 dark:text-teal-200 font-bold">
                  Active Link
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Patient: <strong className="text-slate-900 dark:text-white">{patientName}</strong> • Generated reports will automatically attach to this consultation for physician review.
              </p>
            </div>
          </div>
          <Link
            href={
              role === "doctor"
                ? `/doctor/consultations?consultationId=${consultationId}`
                : `/patient/consultation`
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs self-start sm:self-auto cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span>Return to Consultation Review</span>
          </Link>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━ 1. WORKSPACE HEADER & TITLE ━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Clinical Decision Support
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Multi-Drug Polypharmacy Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Medication Risk Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Check a proposed medicine against the patient&apos;s complete medication profile.
            </p>
          </div>

          {/* Quick Scenario Selector Strip */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto text-xs">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Presets:</span>
            <button
              type="button"
              onClick={() => handleLoadScenario("nsaid_high")}
              className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900/60 transition cursor-pointer"
            >
              NSAID + Warfarin (High)
            </button>
            <button
              type="button"
              onClick={() => handleLoadScenario("safe_alt")}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-900/60 transition cursor-pointer"
            >
              Acetaminophen (Low)
            </button>
            <button
              type="button"
              onClick={() => handleLoadScenario("opioid_sedative")}
              className="px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-900/60 transition cursor-pointer"
            >
              Tramadol (Dependence)
            </button>
          </div>
        </div>

        {/* Patient Profile & Age Banner (Requirement 3 & 4) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Patient:</span>
              <strong className="text-slate-900 dark:text-white font-extrabold">{patientName}</strong>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="patient-age-input" className="text-slate-400 font-bold uppercase text-[10px]">
                Patient Age:
              </label>
              <div className="flex items-center gap-1">
                <input
                  id="patient-age-input"
                  type="number"
                  min={1}
                  max={120}
                  value={patientAge}
                  onChange={(e) => setPatientAge(parseInt(e.target.value) || 68)}
                  className="w-16 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-center text-slate-900 dark:text-white"
                />
                <span className="text-slate-400 font-medium">years</span>
              </div>
            </div>

            {isRecordLoaded && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/80 font-bold text-[11px]">
                <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Current medications loaded from patient record</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetToPatientRecord}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer self-start sm:self-auto"
            title="Reload initial medications from patient profile"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reload Patient Chart</span>
          </button>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━ 2. TWO MAIN SECTIONS: CURRENT MEDICATIONS & PROPOSED MEDICATION ━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT COLUMN: CURRENT MEDICATIONS (Supports unlimited medicines) ── */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center">
                  <Pill className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Current Medications
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Active medication regimen ({currentMeds.length} verified medicines in cross-check list).
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddMed}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medicine</span>
            </button>
          </div>

          {/* Compact Medication Cards Grid (Requirement 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentMeds.map((med, index) => (
              <div
                key={med.id}
                className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 hover:border-teal-300 dark:hover:border-teal-700 transition flex flex-col justify-between space-y-3 group shadow-2xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                      #{index + 1}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      {med.scheduleTime || "Daily"}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug break-words">
                    {med.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-extrabold text-teal-900 dark:text-teal-200 bg-teal-100/60 dark:bg-teal-950/80 px-2 py-0.5 rounded-md">
                      {med.dose}
                    </span>
                    <span>•</span>
                    <span className="font-medium">{med.frequency}</span>
                  </div>

                  {med.instructions && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                      {med.instructions}
                    </p>
                  )}
                </div>

                {/* Card Action Controls: Edit & Remove */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/80 text-xs">
                  <span className="text-[10px] text-slate-400">
                    {med.duration || "Ongoing"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditMed(med)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                      title="Edit medicine"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveMed(med.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="Remove medicine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Supports 2, 3, 5, 10+ medications without fixed limits.</span>
            <button
              type="button"
              onClick={handleOpenAddMed}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              + Add another medicine
            </button>
          </div>

          {/* ── PRIMARY ACTION: ANALYZE FULL MEDICATION PROFILE ── */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={handleAnalyzeFullProfile}
              disabled={isAnalyzingFullProfile || currentMeds.length === 0}
              className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer transform active:scale-[0.99]"
            >
              {isAnalyzingFullProfile ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{fullProfileStep}</span>
                </span>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Analyze Full Medication Profile</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 leading-snug">
              Primary clinical evaluation: Analyzes all {currentMeds.length} active medications together for drug-drug interactions, cumulative risks, age appropriateness, and duration.
            </p>
          </div>

          {/* Full Profile Real-time Progress Bar */}
          {isAnalyzingFullProfile && (
            <div className="p-3.5 rounded-2xl bg-teal-100/70 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 text-xs space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-bold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                <span>{fullProfileStep}</span>
              </div>
              <div className="w-full bg-teal-200 dark:bg-teal-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full transition-all duration-300"
                  style={{
                    width:
                      fullProfileStep === "Loading complete medication profile..."
                        ? "25%"
                        : fullProfileStep === "Evaluating all pairwise drug combinations..."
                        ? "55%"
                        : fullProfileStep === "Analyzing cumulative side-effect load & Beers criteria..."
                        ? "80%"
                        : "98%",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: PROPOSED MEDICATION (Highlighted section) ── */}
        <div className="lg:col-span-5 bg-gradient-to-b from-white via-white to-teal-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/20 rounded-3xl border-2 border-teal-500/80 dark:border-teal-500/60 p-6 sm:p-7 shadow-md space-y-4">
          <div className="pb-3 border-b border-teal-100 dark:border-teal-900/60">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-0.5">
              Optional Secondary Check
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              New Medicine Being Considered
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Checks candidate medicine against all {currentMeds.length} active medications simultaneously.
            </p>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-3.5 text-xs">
            {/* Medicine Name */}
            <div className="space-y-1">
              <label className="font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                Medicine Name *
              </label>
              <input
                type="text"
                required
                value={proposedMed.name}
                onChange={(e) => setProposedMed({ ...proposedMed, name: e.target.value })}
                placeholder="e.g. Pain Medication X, Ibuprofen, Tramadol..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-base sm:text-sm focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
              />
            </div>

            {/* Dose & Frequency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                  Dose *
                </label>
                <input
                  type="text"
                  required
                  value={proposedMed.dose}
                  onChange={(e) => setProposedMed({ ...proposedMed, dose: e.target.value })}
                  placeholder="e.g. 400 mg, 10 mg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-base sm:text-sm focus:outline-hidden focus:border-teal-500 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                  Frequency
                </label>
                <input
                  type="text"
                  value={proposedMed.frequency}
                  onChange={(e) => setProposedMed({ ...proposedMed, frequency: e.target.value })}
                  placeholder="e.g. Every 8 hours, Once daily"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-base sm:text-sm focus:outline-hidden focus:border-teal-500 transition"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                Duration
              </label>
              <input
                type="text"
                value={proposedMed.duration || ""}
                onChange={(e) => setProposedMed({ ...proposedMed, duration: e.target.value })}
                placeholder="e.g. 14 days, 3 days, 1 month"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-base sm:text-sm focus:outline-hidden focus:border-teal-500 transition"
              />
            </div>

            {/* Optional Instructions */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                Optional Instructions / Indication
              </label>
              <input
                type="text"
                value={proposedMed.instructions || ""}
                onChange={(e) => setProposedMed({ ...proposedMed, instructions: e.target.value })}
                placeholder="e.g. Acute joint flare, after meals"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-base sm:text-sm focus:outline-hidden focus:border-teal-500 transition"
              />
            </div>

            {/* Submit Action Button: Check New Medicine */}
            <div className="pt-2 space-y-1.5">
              <button
                type="submit"
                disabled={isAnalyzing || !proposedMed.name.trim()}
                className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer transform active:scale-[0.99]"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{analysisStep}</span>
                  </span>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Check New Medicine</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                Optional check: Evaluates this medicine against all {currentMeds.length} active medications.
              </p>
            </div>
          </form>

          {/* Real-time Step Indicator (Requirement 6) */}
          {isAnalyzing && (
            <div className="p-3.5 rounded-2xl bg-teal-100/70 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 text-xs space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-bold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                <span>{analysisStep}</span>
              </div>
              <div className="w-full bg-teal-200 dark:bg-teal-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full transition-all duration-300"
                  style={{
                    width:
                      analysisStep === "Checking medication profile..."
                        ? "33%"
                        : analysisStep === "Cross-checking current medications..."
                        ? "66%"
                        : "95%",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━ 3. RISK RESULT & ANALYSIS CATEGORIES ━━━━━━━━━━━━━━━━━━ */}
      {(fullRegimenResult || result) && (
        <div className="space-y-6 animate-in fade-in zoom-in-98 duration-200">
          {/* Analysis View Mode Switcher (Requirements 1, 2, 3, 12, 13) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveAnalysisMode("full_profile")}
                className={`py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeAnalysisMode === "full_profile"
                    ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs border border-slate-200/80 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Full Medication Profile ({currentMeds.length} Meds)</span>
                {fullRegimenResult && (
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      fullRegimenResult.overallRisk === "HIGH"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : fullRegimenResult.overallRisk === "MODERATE"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {fullRegimenResult.overallRisk}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveAnalysisMode("new_medicine")}
                className={`py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeAnalysisMode === "new_medicine"
                    ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs border border-slate-200/80 dark:border-slate-700"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Search className="w-4 h-4 text-teal-600" />
                <span>Proposed Check ({proposedMed.name || "Target"})</span>
                {result && (
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      result.overallRisk === "HIGH"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : result.overallRisk === "MODERATE"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {result.overallRisk}
                  </span>
                )}
              </button>
            </div>

            {/* PDF Report Controls (Requirement 12, 13) */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              {isPdfGenerated ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Medication Risk Report Generated</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPdfModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPdfModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-teal-600" />
                    <span>Download PDF</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGeneratePdfReport}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate PDF Report</span>
                </button>
              )}
            </div>
          </div>

          {/* ═══════════════ VIEW A: FULL MEDICATION PROFILE ANALYSIS ═══════════════ */}
          {activeAnalysisMode === "full_profile" && fullRegimenResult && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Overall Regimen Risk Hero (Requirements 4 & 5) */}
              <div
                className={`rounded-3xl border p-6 sm:p-7 shadow-xs space-y-4 ${
                  fullRegimenResult.overallRisk === "HIGH"
                    ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800"
                    : fullRegimenResult.overallRisk === "MODERATE"
                    ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
                    : "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
                        fullRegimenResult.overallRisk === "HIGH"
                          ? "bg-rose-600"
                          : fullRegimenResult.overallRisk === "MODERATE"
                          ? "bg-amber-600"
                          : "bg-emerald-600"
                      }`}
                    >
                      {fullRegimenResult.overallRisk === "HIGH" ? (
                        <ShieldAlert className="w-7 h-7" />
                      ) : fullRegimenResult.overallRisk === "MODERATE" ? (
                        <AlertTriangle className="w-7 h-7" />
                      ) : (
                        <ShieldCheck className="w-7 h-7" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                        Overall Medication Regimen Risk ({fullRegimenResult.totalMedicationsCount} Current Medicines)
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          OVERALL MEDICATION RISK: {fullRegimenResult.overallRisk}
                        </span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          Score: {fullRegimenResult.riskScore}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsPdfModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View PDF Decision Report</span>
                    </button>
                  </div>
                </div>

                {/* Category-Level Risk Summary Grid (Requirement 5) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                      Drug Interaction Risk
                    </span>
                    <span
                      className={`text-xs font-black uppercase ${
                        fullRegimenResult.categoryRisks.drugInteractionRisk === "HIGH"
                          ? "text-rose-600 dark:text-rose-400"
                          : fullRegimenResult.categoryRisks.drugInteractionRisk === "MODERATE"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {fullRegimenResult.categoryRisks.drugInteractionRisk}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                      Cumulative Risk
                    </span>
                    <span
                      className={`text-xs font-black uppercase ${
                        fullRegimenResult.categoryRisks.cumulativeRisk === "HIGH"
                          ? "text-rose-600 dark:text-rose-400"
                          : fullRegimenResult.categoryRisks.cumulativeRisk === "MODERATE"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {fullRegimenResult.categoryRisks.cumulativeRisk}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                      Age Appropriateness
                    </span>
                    <span
                      className={`text-xs font-black uppercase ${
                        fullRegimenResult.categoryRisks.ageAppropriateness === "HIGH"
                          ? "text-rose-600 dark:text-rose-400"
                          : fullRegimenResult.categoryRisks.ageAppropriateness === "MODERATE"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {fullRegimenResult.categoryRisks.ageAppropriateness}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">
                      Duration Risk
                    </span>
                    <span
                      className={`text-xs font-black uppercase ${
                        fullRegimenResult.categoryRisks.durationRisk === "HIGH"
                          ? "text-rose-600 dark:text-rose-400"
                          : fullRegimenResult.categoryRisks.durationRisk === "MODERATE"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {fullRegimenResult.categoryRisks.durationRisk}
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-1 text-xs">
                  <span className="font-extrabold uppercase text-[11px] text-slate-900 dark:text-white block">
                    Regimen Clinical Summary
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    &ldquo;{fullRegimenResult.whyFlagged}&rdquo;
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {fullRegimenResult.regimenSummary}
                  </p>
                </div>
              </div>

              {/* ━━━━━━━━━━━━━━━━━━ 6. WHICH MEDICINES CAUSED THE RISK (Requirements 1 & 6) ━━━━━━━━━━━━━━━━━━ */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                      All Pairwise Interaction Findings ({fullRegimenResult.pairwiseMatrix.length} Combinations Evaluated)
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Evaluated across all {fullRegimenResult.totalMedicationsCount} current medications
                  </span>
                </div>

                {fullRegimenResult.pairwiseMatrix.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3">
                    Add at least 2 medications to evaluate pairwise drug combinations.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {fullRegimenResult.pairwiseMatrix.map((pair, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border text-xs space-y-2 transition ${
                          pair.isFlagged
                            ? pair.severity === "HIGH"
                              ? "bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800"
                              : "bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800"
                            : "bg-slate-50/90 dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700/80"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white break-words">
                              {pair.medA}
                            </span>
                            <span className="text-teal-600 dark:text-teal-400 font-black text-sm">
                              +
                            </span>
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white break-words">
                              {pair.medB}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400">
                              Category: {pair.category}
                            </span>
                            <span
                              className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                pair.severity === "HIGH"
                                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                  : pair.severity === "MODERATE"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              }`}
                            >
                              {pair.isFlagged ? `INTERACTION DETECTED (${pair.severity})` : "NO DIRECT COLLISION"}
                            </span>
                          </div>
                        </div>

                        {pair.isFlagged ? (
                          <div className="space-y-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/80">
                            <p className="font-bold text-slate-900 dark:text-white">
                              Risk: {pair.riskTitle}
                            </p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                              {pair.explanation}
                            </p>
                            {pair.clinicalMechanism && (
                              <p className="text-[11px] text-slate-500 italic">
                                Mechanism: {pair.clinicalMechanism}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified independent clearance routes. No significant pharmacokinetic clash.</span>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ━━━━━━━━━━━━━━━━━━ 7. CUMULATIVE RISK ANALYSIS (Requirement 7) ━━━━━━━━━━━━━━━━━━ */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                      Cumulative Side-Effect Load Across Complete Regimen
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                    Evaluating Organ-System Burdens
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {fullRegimenResult.cumulativeRisks.map((cat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 space-y-2 text-xs flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                            {cat.categoryName}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              cat.loadLevel === "HIGH"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                : cat.loadLevel === "MODERATE"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            }`}
                          >
                            CUMULATIVE LOAD: {cat.loadLevel}
                          </span>
                        </div>

                        <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                          {cat.clinicalSummary}
                        </p>

                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">
                            Contributing Medicines in Current Regimen:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {cat.contributingMedicines.length > 0 ? (
                              cat.contributingMedicines.map((m, mIdx) => (
                                <span
                                  key={mIdx}
                                  className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                                >
                                  {m}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 italic">None detected</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {cat.monitoringAdvice && (
                        <p className="text-[11px] text-teal-700 dark:text-teal-400 font-bold pt-1">
                          Clinical Monitoring: {cat.monitoringAdvice}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ━━━━━━━━━━━━━━━━━━ 8. PATIENT AGE & BEERS CRITERIA (Requirement 8) ━━━━━━━━━━━━━━━━━━ */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                      Age Appropriateness Assessment (Patient Age: {fullRegimenResult.patientAge} Years)
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      fullRegimenResult.ageAssessment.status === "HIGH"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : fullRegimenResult.ageAssessment.status === "MODERATE"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    AGE APPROPRIATENESS: {fullRegimenResult.ageAssessment.status}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      Clinical Guideline: {fullRegimenResult.ageAssessment.criteriaUsed}
                    </span>
                    <span className="text-slate-400 font-medium">
                      Evaluated for Age &ge; 65 Geriatric Vulnerabilities
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-200 font-semibold leading-relaxed">
                    {fullRegimenResult.ageAssessment.explanation}
                  </p>

                  {fullRegimenResult.ageAssessment.concerningMedicines.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Medicines Requiring Geriatric Precaution:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {fullRegimenResult.ageAssessment.concerningMedicines.map((cm, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                          >
                            ⚠️ {cm}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ━━━━━━━━━━━━━━━━━━ 9 & 10. DURATION & DOSE/FREQUENCY REVIEW (Requirements 9 & 10) ━━━━━━━━━━━━━━━━━━ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Duration Review */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-3 text-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <h3 className="font-extrabold uppercase tracking-wider text-slate-900 dark:text-white text-xs">
                      Duration Review
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {fullRegimenResult.durationReview.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {item.medicineName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Current: {item.currentDuration}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                          {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dose & Frequency Review */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-3 text-xs">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Pill className="w-4 h-4 text-teal-600" />
                    <h3 className="font-extrabold uppercase tracking-wider text-slate-900 dark:text-white text-xs">
                      Dose &amp; Frequency Review
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {fullRegimenResult.doseFrequencyReview.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {item.medicineName}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            {item.appropriateness}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {item.dose} • {item.frequency}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                          {item.clinicalRemarks}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ━━━━━━━━━━━━━━━━━━ 10b. ACTIONABLE RECOMMENDATIONS (Requirement 10) ━━━━━━━━━━━━━━━━━━ */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                    Actionable Recommendations for Attending Physician
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Guidance for clinical decision support. Does not substitute professional medical judgment.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {fullRegimenResult.actionableRecommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 space-y-2 text-xs flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <span className="font-extrabold uppercase text-[10px] text-teal-700 dark:text-teal-400">
                          {rec.category}
                        </span>
                        <h4 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                          {rec.recommendation}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                          {rec.rationale}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ━━━━━━━━━━━━━━━━━━ 11. PLAIN-LANGUAGE SUMMARY FOR DOCTOR (Requirement 11) ━━━━━━━━━━━━━━━━━━ */}
              <div className="p-5 sm:p-6 rounded-3xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-teal-900 dark:text-teal-200 font-black uppercase tracking-wider text-xs">
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  <span>Summary for Doctor</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {fullRegimenResult.doctorSummary}
                </p>
              </div>

              {/* Clinical Decision Support Safety Notice */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800/80 space-y-1 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2 font-black">
                  <Stethoscope className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Mandatory Clinical Decision Support Rule</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                  The MedGuard Full Regimen Analyzer is clinical decision support. It does not automatically prescribe, approve a medicine, diagnose the patient, or invent alternatives. The final clinical decision remains strictly with the attending physician.
                </p>
              </div>
            </div>
          )}

          {/* ═══════════════ VIEW B: PROPOSED MEDICINE CHECK (OPTIONAL SECONDARY CHECK) ═══════════════ */}
          {activeAnalysisMode === "new_medicine" && result && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Main Risk Hero Banner */}
              <div
                className={`rounded-3xl border p-6 sm:p-7 shadow-xs space-y-4 ${
                  result.overallRisk === "HIGH"
                    ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800"
                    : result.overallRisk === "MODERATE"
                    ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
                    : "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
                        result.overallRisk === "HIGH"
                          ? "bg-rose-600"
                          : result.overallRisk === "MODERATE"
                          ? "bg-amber-600"
                          : "bg-emerald-600"
                      }`}
                    >
                      {result.overallRisk === "HIGH" ? (
                        <ShieldAlert className="w-7 h-7" />
                      ) : result.overallRisk === "MODERATE" ? (
                        <AlertTriangle className="w-7 h-7" />
                      ) : (
                        <ShieldCheck className="w-7 h-7" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                        New Medicine Risk Result
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          {proposedMed.name}: {result.overallRisk} RISK
                        </span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          Score: {result.riskScore}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        if (result) {
                          try {
                            const reportItem = createReportItemFromResult({
                              result,
                              proposed: proposedMed,
                              currentMeds,
                              patientId: activePatientId,
                              consultationId: consultationId || "con-2",
                              doctorId: role === "doctor" ? "doc-1" : undefined,
                              doctorName: role === "doctor" ? "Dr. Sarah Mitchell, MD" : undefined,
                            });
                            saveMedicationAnalysisReport(reportItem);
                            showToast(
                              "Report Linked",
                              `Analysis report attached to consultation #${consultationId || "con-2"} for physician cross-check.`,
                              "success"
                            );
                          } catch (err) {
                            console.error(err);
                          }
                        }
                        setIsReportModalOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Risk Report</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsSummaryModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <span>Patient Summary</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-slate-900 dark:text-white block">
                    Why this risk was detected
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    &ldquo;{result.whyFlagged}&rdquo;
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {result.riskSummary}
                  </p>
                </div>
              </div>

              {/* Multiple-Medicine Interaction View */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                      Candidate Medicine Checked Against Active Regimen
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Checked against {currentMeds.length} active medications
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                        NEW
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-teal-800 dark:text-teal-300 uppercase">
                          PROPOSED MEDICATION
                        </span>
                        <p className="text-xs font-black text-slate-900 dark:text-white">
                          {proposedMed.name} ({proposedMed.dose})
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400">
                      Target Evaluation
                    </span>
                  </div>

                  <div className="pl-4 border-l-2 border-dashed border-teal-300 dark:border-teal-800 ml-4 space-y-2 py-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      ↓ CHECKED AGAINST INDIVIDUAL PROFILE MEDICATIONS ↓
                    </span>

                    <div className="space-y-2">
                      {currentMeds.map((med) => {
                        const match = result.detectedInteractions.find(
                          (i) => i.existingMed.toLowerCase() === med.name.toLowerCase() || med.name.toLowerCase().includes(i.existingMed.toLowerCase())
                        );

                        return (
                          <div
                            key={med.id}
                            className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              match
                                ? match.severity === "HIGH"
                                  ? "bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800"
                                  : "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800"
                                : "bg-slate-50/90 dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700/80"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900 dark:text-white">
                                  {med.name}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  ({med.dose}, {med.frequency})
                                </span>
                              </div>

                              {match ? (
                                <div className="text-[11px] font-semibold text-rose-800 dark:text-rose-300 space-y-0.5">
                                  <p className="font-bold">
                                    ⚠️ Potential interaction: {proposedMed.name} + {med.name}
                                  </p>
                                  <p className="text-slate-600 dark:text-slate-300">
                                    Risk: {match.riskTitle}. {match.clinicalMechanism}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Independent metabolic pathways. No significant collision.</span>
                                </p>
                              )}
                            </div>

                            <span
                              className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase self-start sm:self-auto shrink-0 ${
                                match
                                  ? match.severity === "HIGH"
                                    ? "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200"
                                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                              }`}
                            >
                              {match ? `${match.severity} INTERACTION` : "COMPATIBLE"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Categories */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                    Detailed Clinical Category Breakdown
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {Object.entries(result.categories).map(([key, cat]) => {
                    const isExpanded = expandedCategory === key;
                    return (
                      <div
                        key={key}
                        className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 space-y-2 text-xs flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                              {cat.title}
                            </span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                                cat.status === "HIGH"
                                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                  : cat.status === "MODERATE"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                  : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              }`}
                            >
                              {cat.status}
                            </span>
                          </div>

                          <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                            {cat.summary}
                          </p>

                          {isExpanded && (
                            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5 animate-in fade-in duration-150">
                              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                {cat.details}
                              </p>
                              <p className="text-[11px] font-bold text-teal-700 dark:text-teal-400">
                                Clinical Direction: {cat.clinicalRecommendation}
                              </p>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedCategory(isExpanded ? null : key)}
                          className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                        >
                          <span>{isExpanded ? "Hide Details" : "View Mechanism"}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actionable Options */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                    Actionable Options &amp; Verified Alternatives
                  </h3>
                </div>

                {result.actionableOptions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-4 text-center">
                    No verified alternative available.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {result.actionableOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 space-y-2 text-xs flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-extrabold uppercase text-[10px] text-teal-700 dark:text-teal-400">
                              {opt.category}
                            </span>
                            {opt.isRecommended && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                Recommended
                              </span>
                            )}
                          </div>
                          <h4 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                            {opt.recommendation}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                            {opt.reason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━ MODALS ━━━━━━━━━━━━━━━━━━ */}
      {/* 1. Add / Edit Medicine Modal */}
      <AddEditMedicineModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveMed}
        initialData={medEditing}
      />

      {/* 2. Structured Risk Report Modal (Requirement 11) */}
      {result && (
        <RiskReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          result={result}
          currentMeds={currentMeds}
          proposedMed={proposedMed}
        />
      )}

      {/* 3. Patient & Caregiver Summary Modal (Requirement 12) */}
      {result && (
        <PatientCaregiverSummaryModal
          isOpen={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)}
          result={result}
        />
      )}

      {/* 4. Full Regimen Clinical PDF Decision Report Modal (Requirements 12, 13, 14) */}
      {fullRegimenResult && (
        <ClinicalPdfReportModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          result={fullRegimenResult}
        />
      )}
    </div>
  );
}
