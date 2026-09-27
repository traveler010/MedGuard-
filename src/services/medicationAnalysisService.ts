/**
 * MedGuard Medication Analysis & Doctor Consultation Integration Service
 * Links Polypharmacy Risk Analyzer reports directly to Doctor Consultations,
 * manages doctor clinical reviews, patient-facing summaries, and real-time synchronization.
 */

import {
  PolypharmacyAnalysisResult,
  FullRegimenAnalysisResult,
  MedicationEntry,
  ProposedMedicationInput,
  DrugPairInteraction,
  CategoryAssessment,
  ActionableOption,
  runPolypharmacyAnalysis,
  runFullRegimenAnalysis,
} from "./polypharmacyRiskEngine";
import {
  getStoredConsultations,
  saveOrUpdateConsultation,
  DoctorConsultationItem,
} from "@/data/mockDoctorPortal";

export interface DoctorReviewRecord {
  status: "Agreed" | "Disagreed" | "Clinical Context Added" | "Information Requested" | "Reviewed";
  clinicalNote: string;
  doctorName: string;
  reviewedAt: string;
}

export interface MedicationAnalysisReportItem {
  id: string;
  consultationId?: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  doctorId?: string;
  doctorName?: string;
  date: string;
  timestamp: string;
  status: "Analyzed by MedGuard CDSS" | "Reviewed by Doctor";

  reportType?: "full_profile" | "proposed_medicine";
  fullRegimenResult?: FullRegimenAnalysisResult;
  pdfGenerated?: boolean;
  pdfGeneratedAt?: string;

  // Proposed Medication
  proposedMedication: {
    name: string;
    dose: string;
    frequency: string;
    duration: string;
    instructions?: string;
  };

  // Current Regimen Snapshot
  currentMedicinesCount: number;
  currentMedicines: MedicationEntry[];

  // Core Risk Stratification
  overallRisk: "LOW" | "MODERATE" | "HIGH";
  overallRiskScore: number;
  riskSummary: string;
  whyFlagged: string;

  // Interaction Details
  detectedInteractions: DrugPairInteraction[];

  // 5 Clinical Categories
  categories: {
    drugInteraction: CategoryAssessment;
    dependenceRisk: CategoryAssessment;
    sideEffectLoad: CategoryAssessment;
    ageAppropriateness: CategoryAssessment;
    durationAppropriateness: CategoryAssessment;
  };

  // Dual-Horizon Views
  shortTermRelief: {
    efficacyRating: "High" | "Moderate" | "Limited";
    summary: string;
    clinicalContext: string;
  };
  longTermSafety: {
    safetyRating: "Safe" | "Caution Required" | "Hazardous / High Toxicity";
    summary: string;
    organVulnerabilities: string[];
  };

  // Actionable Verified Alternatives
  actionableOptions: ActionableOption[];

  // Patient / Caregiver Friendly Summary
  patientCaregiverSummary: {
    medicationName: string;
    purpose: string;
    doseSchedule: string;
    keyCaution: string;
    reminderTip: string;
    emergencyWarning: string;
  };

  // Doctor Review Response
  doctorReview?: DoctorReviewRecord;
}

export const MEDICATION_REPORTS_STORAGE_KEY = "medguard_medication_reports";

// Seed realistic default report for Raj Kumar (Age 68, con-2)
export const DEFAULT_RAJ_REPORT: MedicationAnalysisReportItem = {
  id: "rep-poly-8821",
  consultationId: "con-2",
  patientId: "pat-1",
  patientName: "Raj Kumar",
  patientAge: 68,
  doctorId: "doc-1",
  doctorName: "Dr. Sarah Mitchell, MD",
  date: "27 Sep 2026",
  timestamp: "10:18 AM",
  status: "Analyzed by MedGuard CDSS",
  proposedMedication: {
    name: "Pain-relief medicine (Ibuprofen 400 mg)",
    dose: "400 mg",
    frequency: "Every 8 hours as needed",
    duration: "14 days",
    instructions: "For acute knee joint stiffness and discomfort",
  },
  currentMedicinesCount: 4,
  currentMedicines: [
    {
      id: "med-1",
      name: "Warfarin Sodium (Blood Thinner)",
      dose: "5 mg",
      frequency: "Once daily",
      scheduleTime: "06:00 PM",
      duration: "Chronic",
      instructions: "Target INR 2.0–3.0. Take in evening.",
    },
    {
      id: "med-2",
      name: "Blood Pressure Medicine (Lisinopril)",
      dose: "10 mg",
      frequency: "Once daily",
      scheduleTime: "08:00 AM",
      duration: "Chronic",
      instructions: "Take with water in the morning.",
    },
    {
      id: "med-3",
      name: "Amlodipine Besylate",
      dose: "5 mg",
      frequency: "Once daily",
      scheduleTime: "08:00 AM",
      duration: "Chronic",
      instructions: "Calcium channel blocker for hypertension.",
    },
    {
      id: "med-4",
      name: "Atorvastatin Calcium",
      dose: "20 mg",
      frequency: "Once daily at bedtime",
      scheduleTime: "10:00 PM",
      duration: "Chronic",
      instructions: "Lipid-lowering therapy.",
    },
  ],
  overallRisk: "HIGH",
  overallRiskScore: 94,
  riskSummary:
    "High-risk medication combination detected. Adding Ibuprofen to the current 4-medicine regimen introduces critical pharmacological conflicts requiring clinical adjustment.",
  whyFlagged:
    "Potential interaction detected between the proposed medicine and an existing medication. This combination may increase bleeding risk.",
  detectedInteractions: [
    {
      proposedMed: "Ibuprofen (NSAID)",
      existingMed: "Warfarin Sodium (Blood Thinner)",
      existingMedDose: "5 mg",
      severity: "HIGH",
      riskTitle: "Severe Anticoagulant Bleeding Risk",
      clinicalMechanism:
        "NSAID-induced platelet COX-1 inhibition and gastric mucosal irritation combined with anticoagulant suppression of clotting factors.",
      clinicalImpact:
        "Multiplies upper gastrointestinal hemorrhage and internal bleeding risk by 3.8x. Bleeding can occur insidiously before visible symptoms.",
      evidenceSource:
        "American College of Cardiology (ACC) / CHEST Consensus Statement (Grade 1A Warning)",
    },
    {
      proposedMed: "Ibuprofen (NSAID)",
      existingMed: "Lisinopril (Blood Pressure)",
      existingMedDose: "10 mg",
      severity: "MODERATE",
      riskTitle: "Attenuated BP Control & Renal Vasoconstriction",
      clinicalMechanism:
        "NSAIDs inhibit renal vasodilatory prostaglandins, blunting the antihypertensive efficacy of ACE inhibitors and reducing glomerular filtration rate (eGFR).",
      clinicalImpact:
        "May cause acute blood pressure elevation and pre-renal azotemia.",
      evidenceSource:
        "American Heart Association (AHA) Scientific Statement on Drug-Induced Hypertension",
    },
  ],
  categories: {
    drugInteraction: {
      status: "HIGH",
      badge: "High Hazard Collision",
      title: "Drug-Drug Interaction",
      summary:
        "Severe hemorrhagic synergy detected with active Warfarin anticoagulation.",
      details:
        "Ibuprofen + Warfarin: Platelet inhibition and mucosal irritation sharply elevates bleeding risk.",
      clinicalRecommendation:
        "Avoid co-administration. Select a verified non-interacting alternative.",
    },
    dependenceRisk: {
      status: "LOW",
      badge: "Negligible Dependence",
      title: "Dependence Risk",
      summary: "Non-controlled therapeutic agent without habit-forming receptor affinity.",
      details: "Medication does not act upon central mesolimbic reward pathways.",
      clinicalRecommendation: "No tapering needed at therapy completion.",
    },
    sideEffectLoad: {
      status: "HIGH",
      badge: "Compound Organ Toxicity",
      title: "Cumulative Side-Effect Load",
      summary: "Critical cumulative toxicity burden on gastrointestinal mucosa and renal perfusion.",
      details: "Dual antiplatelet and anticoagulant blockade severely elevates ulceration and occult bleeding risk.",
      clinicalRecommendation: "De-escalate ulcerogenic agent. Co-prescribe protective therapy if unavoidable.",
    },
    ageAppropriateness: {
      status: "HIGH",
      badge: "Beers Criteria 2023 Warning",
      title: "Age Appropriateness",
      summary: "Patient age 68 qualifies for geriatric Beers Criteria precautions.",
      details: "At age 68, estimated GFR is physiologically reduced. Systemic NSAID metabolites accumulate, extending elimination half-life.",
      clinicalRecommendation: "Follow AGS Beers Criteria 2023: Avoid chronic systemic NSAIDs in seniors >= 65.",
    },
    durationAppropriateness: {
      status: "HIGH",
      badge: "Exceeds Safe Exposure Window",
      title: "Duration Appropriateness",
      summary: "Proposed 14-day duration exceeds recommended 3–5 day acute threshold.",
      details: "Continuous exposure compounds gastric mucosal thinning and renal vasoconstriction. Risk curve rises sharply past day 5.",
      clinicalRecommendation: "Truncate initial prescription to 3–5 days with clinical re-evaluation before renewal.",
    },
  },
  shortTermRelief: {
    efficacyRating: "High",
    summary: "High immediate anti-inflammatory and analgesic efficacy for acute joint flare within 30–60 minutes.",
    clinicalContext: "Provides rapid acute symptom suppression but does not modify underlying osteoarthritis.",
  },
  longTermSafety: {
    safetyRating: "Hazardous / High Toxicity",
    summary: "Unfavorable long-term safety profile. Ongoing continuous therapy beyond 5 days sharply compounds ulceration, renal decline, and bleeding.",
    organVulnerabilities: [
      "Gastrointestinal Mucosa (Ulceration)",
      "Renal Microvasculature (eGFR drop)",
      "Cardiovascular (BP elevation)",
    ],
  },
  actionableOptions: [
    {
      category: "Safer alternative",
      recommendation: "Acetaminophen (Tylenol) 500 mg — 1 tablet every 6–8h PRN (Max 2,000 mg/day)",
      reason: "Provides effective acute analgesic relief without inhibiting platelet COX-1 or eroding gastric mucosa.",
      sourceStatus: "AGS Beers Criteria 2023 & ACC Guideline Verified",
      isRecommended: true,
    },
    {
      category: "Safer alternative",
      recommendation: "Topical Diclofenac Gel (Voltaren 1%) — 4g applied to knee BID",
      reason: "Delivers localized anti-inflammatory relief with less than 6% systemic bioavailability, preserving GI and kidney safety.",
      sourceStatus: "OARSI Joint Treatment Guideline",
      isRecommended: false,
    },
    {
      category: "Adjusted duration",
      recommendation: "Restrict systemic NSAID exposure to 3-day acute rescue max",
      reason: "Cumulative renal arteriolar vasoconstriction spikes exponentially beyond day 5 of therapy.",
      sourceStatus: "KDIGO Acute Kidney Injury Guideline",
      isRecommended: false,
    },
    {
      category: "Additional monitoring",
      recommendation: "Co-prescribe Omeprazole 20mg daily + baseline serum Creatinine / INR audit",
      reason: "Provides gastroprotective proton-pump inhibition and tracks subclinical coagulation deviations.",
      sourceStatus: "ACG Clinical Practice Guideline",
      isRecommended: false,
    },
  ],
  patientCaregiverSummary: {
    medicationName: "Ibuprofen (Pain Medicine)",
    purpose: "Prescribed to treat acute knee joint stiffness and inflammation.",
    doseSchedule: "400 mg (Every 8 hours as needed) for 14 days",
    keyCaution:
      "CAUTION: Do not take this medicine alongside your blood thinner or blood pressure medicine without explicit doctor approval, as it may cause stomach bleeding.",
    reminderTip:
      "Take with breakfast or lunch. Use MedGuard daily reminder alarms so doses are not missed.",
    emergencyWarning:
      "Seek immediate medical attention if you notice black tarry stools, unusual bruising, or sudden dizziness.",
  },
};

/**
 * Retrieves all stored medication analysis reports from localStorage with fallback defaults.
 */
export function getStoredMedicationReports(): MedicationAnalysisReportItem[] {
  if (typeof window === "undefined") {
    return [DEFAULT_RAJ_REPORT];
  }
  try {
    const raw = localStorage.getItem(MEDICATION_REPORTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MEDICATION_REPORTS_STORAGE_KEY, JSON.stringify([DEFAULT_RAJ_REPORT]));
      return [DEFAULT_RAJ_REPORT];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(MEDICATION_REPORTS_STORAGE_KEY, JSON.stringify([DEFAULT_RAJ_REPORT]));
      return [DEFAULT_RAJ_REPORT];
    }
    return parsed;
  } catch (e) {
    return [DEFAULT_RAJ_REPORT];
  }
}

/**
 * Saves a new or updated medication analysis report to shared storage and notifies listeners.
 */
export function saveMedicationAnalysisReport(report: MedicationAnalysisReportItem): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredMedicationReports();
    const existingIdx = current.findIndex((r) => r.id === report.id);
    let updated: MedicationAnalysisReportItem[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = { ...updated[existingIdx], ...report };
    } else {
      updated = [report, ...current];
    }
    localStorage.setItem(MEDICATION_REPORTS_STORAGE_KEY, JSON.stringify(updated));

    // Also update consultation store if consultationId is present
    if (report.consultationId) {
      attachReportToConsultation(report.consultationId, report);
    }

    // Dispatch real-time cross-window & local event
    window.dispatchEvent(
      new CustomEvent("medguard_medication_reports_updated", {
        detail: { reportId: report.id, consultationId: report.consultationId, patientId: report.patientId },
      })
    );
  } catch (e) {
    console.error("Failed to save medication analysis report", e);
  }
}

/**
 * Returns all reports associated with a specific consultation.
 */
export function getReportsForConsultation(consultationId: string): MedicationAnalysisReportItem[] {
  const all = getStoredMedicationReports();
  const directMatches = all.filter((r) => r.consultationId === consultationId);
  if (directMatches.length > 0) return directMatches;

  // Fallback match by patient if consultation is for Raj Kumar
  if (consultationId === "con-2" || consultationId === "cons-101") {
    return all.filter((r) => r.patientId === "pat-1");
  }
  return [];
}

/**
 * Returns all reports associated with a specific patient.
 */
export function getReportsForPatient(patientId: string): MedicationAnalysisReportItem[] {
  const all = getStoredMedicationReports();
  return all.filter((r) => r.patientId === patientId);
}

/**
 * Attaches or links a report to a consultation record in the doctor consultation store.
 */
export function attachReportToConsultation(
  consultationId: string,
  report: MedicationAnalysisReportItem
): void {
  try {
    const consultations = getStoredConsultations();
    const consult = consultations.find((c) => c.id === consultationId);
    if (consult) {
      // Store reference
      (consult as any).medicationAnalysis = report;
      saveOrUpdateConsultation(consult);
    }
  } catch (e) {
    console.error("Could not attach report to consultation object", e);
  }
}

/**
 * Records doctor review feedback on an analysis report and syncs to consultation response.
 */
export function recordDoctorReview(
  reportId: string,
  consultationId: string,
  review: {
    status: "Agreed" | "Disagreed" | "Clinical Context Added" | "Information Requested" | "Reviewed";
    clinicalNote: string;
    doctorName?: string;
  }
): void {
  if (typeof window === "undefined") return;
  try {
    const all = getStoredMedicationReports();
    const index = all.findIndex((r) => r.id === reportId);
    if (index >= 0) {
      const todayFormatted = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const updatedReport: MedicationAnalysisReportItem = {
        ...all[index],
        status: "Reviewed by Doctor",
        doctorReview: {
          status: review.status,
          clinicalNote: review.clinicalNote,
          doctorName: review.doctorName || "Dr. Sarah Mitchell, MD",
          reviewedAt: todayFormatted,
        },
      };

      all[index] = updatedReport;
      localStorage.setItem(MEDICATION_REPORTS_STORAGE_KEY, JSON.stringify(all));

      // Synchronize into consultation response directly
      const consultations = getStoredConsultations();
      const cIndex = consultations.findIndex((c) => c.id === consultationId);
      if (cIndex >= 0) {
        consultations[cIndex] = {
          ...consultations[cIndex],
          doctorResponse: review.clinicalNote,
          doctorResponseDate: todayFormatted,
          status: "Reviewed",
          reviewedDate: todayFormatted,
          ...( { medicationAnalysis: updatedReport } as any ),
        };
        localStorage.setItem("medguard_consultations", JSON.stringify(consultations));
        window.dispatchEvent(new Event("medguard_consultations_updated"));
      }

      window.dispatchEvent(
        new CustomEvent("medguard_medication_reports_updated", {
          detail: { reportId, consultationId, patientId: updatedReport.patientId },
        })
      );
    }
  } catch (e) {
    console.error("Failed to record doctor review", e);
  }
}

/**
 * Helper to build a complete MedicationAnalysisReportItem from a PolypharmacyAnalysisResult.
 */
export function createReportItemFromResult(params: {
  result: PolypharmacyAnalysisResult;
  proposed: ProposedMedicationInput;
  currentMeds: MedicationEntry[];
  patientId: string;
  consultationId?: string;
  doctorId?: string;
  doctorName?: string;
}): MedicationAnalysisReportItem {
  const { result, proposed, currentMeds, patientId, consultationId, doctorId, doctorName } = params;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  const timeFormatted = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return {
    id: result.analysisId || `rep-${Date.now().toString().slice(-6)}`,
    consultationId,
    patientId,
    patientName: result.patientName,
    patientAge: result.patientAge,
    doctorId,
    doctorName,
    date: dateFormatted,
    timestamp: timeFormatted,
    status: "Analyzed by MedGuard CDSS",
    proposedMedication: {
      name: proposed.name,
      dose: proposed.dose,
      frequency: proposed.frequency,
      duration: proposed.duration || "14 days",
      instructions: proposed.instructions,
    },
    currentMedicinesCount: currentMeds.length,
    currentMedicines: currentMeds,
    overallRisk: result.overallRisk,
    overallRiskScore: result.riskScore,
    riskSummary: result.riskSummary,
    whyFlagged: result.whyFlagged,
    detectedInteractions: result.detectedInteractions,
    categories: result.categories,
    shortTermRelief: result.shortTermRelief,
    longTermSafety: result.longTermSafety,
    actionableOptions: result.actionableOptions,
    patientCaregiverSummary: result.patientCaregiverSummary,
  };
}

/**
 * Helper to build a complete MedicationAnalysisReportItem from a FullRegimenAnalysisResult.
 */
export function createReportItemFromFullRegimen(params: {
  regimenResult: FullRegimenAnalysisResult;
  consultationId?: string;
  doctorId?: string;
  doctorName?: string;
}): MedicationAnalysisReportItem {
  const { regimenResult, consultationId, doctorId, doctorName } = params;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  const timeFormatted = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  const interactions: DrugPairInteraction[] = regimenResult.pairwiseInteractions.map((p) => ({
    proposedMed: p.medA,
    existingMed: p.medB,
    existingMedDose: p.medBDose,
    severity: p.severity,
    riskTitle: p.riskCategory,
    clinicalMechanism: p.explanation,
    clinicalImpact: p.clinicalImpact,
    evidenceSource: p.evidenceSource,
  }));

  return {
    id: regimenResult.analysisId || `rep-reg-${Date.now().toString().slice(-6)}`,
    consultationId,
    patientId: regimenResult.patientId,
    patientName: regimenResult.patientName,
    patientAge: regimenResult.patientAge,
    doctorId,
    doctorName,
    date: dateFormatted,
    timestamp: timeFormatted,
    status: "Analyzed by MedGuard CDSS",
    reportType: "full_profile",
    fullRegimenResult: regimenResult,
    pdfGenerated: true,
    pdfGeneratedAt: `${dateFormatted} at ${timeFormatted}`,
    proposedMedication: {
      name: "Complete Medication Regimen Profile",
      dose: "Multi-Drug Regimen",
      frequency: "Scheduled Daily Profile",
      duration: "Chronic Regimen",
      instructions: "Comprehensive polypharmacy evaluation of all active patient medications.",
    },
    currentMedicinesCount: regimenResult.totalMedicationsCount,
    currentMedicines: regimenResult.currentMeds,
    overallRisk: regimenResult.overallRisk,
    overallRiskScore: regimenResult.overallRiskScore,
    riskSummary: regimenResult.overallExplanation,
    whyFlagged: regimenResult.doctorSummary,
    detectedInteractions: interactions,
    categories: {
      drugInteraction: {
        status: regimenResult.overallRisk,
        badge: regimenResult.pairwiseInteractions.length > 0 ? "Interaction Surveillance" : "Compatible Regimen",
        title: "Drug-Drug Interaction",
        summary: `${regimenResult.pairwiseInteractions.length} interaction relationship(s) evaluated across ${regimenResult.totalMedicationsCount} active medications.`,
        details: regimenResult.pairwiseInteractions.length > 0
          ? regimenResult.pairwiseInteractions.map((p) => `${p.medA} + ${p.medB}: ${p.explanation}`).join(" ")
          : "All active medications operate via compatible metabolic pathways.",
        clinicalRecommendation: "Maintain routine clinical and laboratory surveillance intervals.",
      },
      dependenceRisk: {
        status: regimenResult.dependenceAssessment?.riskLevel || "LOW",
        badge: regimenResult.dependenceAssessment?.riskLevel === "HIGH" ? "Controlled Substance Identified" : "Zero Habit-Forming Agents",
        title: "Dependence Risk",
        summary: regimenResult.dependenceAssessment?.explanation || "No controlled substances detected.",
        details: "Active chronic medications have non-habit-forming receptor targets.",
        clinicalRecommendation: "Maintain current maintenance therapy.",
      },
      sideEffectLoad: {
        status: regimenResult.cumulativeRisks.some((c) => c.load === "HIGH") ? "HIGH" : regimenResult.cumulativeRisks.some((c) => c.load === "MODERATE") ? "MODERATE" : "LOW",
        badge: "Cumulative Regimen Load",
        title: "Cumulative Side-Effect Load",
        summary: regimenResult.cumulativeRisks.map((c) => `${c.category}: ${c.load}`).join(" • "),
        details: regimenResult.cumulativeRisks.map((c) => `${c.category}: ${c.explanation}`).join(" "),
        clinicalRecommendation: "Follow recommended laboratory audits for renal and coagulation markers.",
      },
      ageAppropriateness: {
        status: regimenResult.ageAssessment.riskLevel,
        badge: regimenResult.ageAssessment.isElderly ? "Beers Criteria 2023 Review" : "Age Appropriate",
        title: "Age Appropriateness",
        summary: regimenResult.ageAssessment.summary,
        details: regimenResult.ageAssessment.beersCriteriaNotes,
        clinicalRecommendation: "Standard geriatric precautions applied.",
      },
      durationAppropriateness: {
        status: regimenResult.durationReview.some((d) => d.appropriateness !== "Appropriate") ? "MODERATE" : "LOW",
        badge: "Duration Review",
        title: "Duration Appropriateness",
        summary: `Duration reviewed for all ${regimenResult.totalMedicationsCount} current medications.`,
        details: regimenResult.durationReview.map((d) => `${d.medName}: ${d.currentDuration} (${d.appropriateness})`).join(" • "),
        clinicalRecommendation: "Continue scheduled maintenance therapy with annual review.",
      },
    },
    shortTermRelief: {
      efficacyRating: "High",
      summary: "Effective chronic symptom and disease control across blood pressure, anticoagulation, lipid, and glycemic targets.",
      clinicalContext: "Patient maintains physiological disease control with current regimen.",
    },
    longTermSafety: {
      safetyRating: regimenResult.overallRisk === "HIGH" ? "Caution Required" : "Safe",
      summary: "Long-term regimen safety is favorable under periodic lab surveillance (INR and basic metabolic panel).",
      organVulnerabilities: ["Kidney clearance reserve (Metformin/Lisinopril)", "Coagulation profile (Warfarin)"],
    },
    actionableOptions: regimenResult.actionableRecommendations,
    patientCaregiverSummary: {
      medicationName: "Current Active Medication Regimen",
      purpose: "Manages blood pressure, blood thinning, cholesterol, and diabetes.",
      doseSchedule: "Take medicines according to daily schedule as directed.",
      keyCaution: "Do not take over-the-counter pain relievers (like Ibuprofen or Naproxen) with Warfarin without asking your doctor. Acetaminophen is safer for pain.",
      reminderTip: "Keep all your daily reminders active on MedGuard to stay consistent.",
      emergencyWarning: "Contact your clinic or seek emergency help if you experience unusual bleeding or dark stools.",
    },
  };
}
