"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import {
  ConsultationPatientRecord,
  ConsultationMedication,
  ProposedMedicineInput,
  RiskAnalysisResult,
  SaferAlternativeOption,
} from "./types";
import {
  MOCK_CONSULTATION_PATIENTS,
  analyzeMockMedicationRisk,
} from "./mockConsultationData";
import { ConsultationEntryHeader } from "./ConsultationEntryHeader";
import { CurrentMedicationsSection } from "./CurrentMedicationsSection";
import { ProposeMedicineForm } from "./ProposeMedicineForm";
import { RiskAnalysisCard } from "./RiskAnalysisCard";
import { ConsultationSummaryCard } from "./ConsultationSummaryCard";
import { PatientCaregiverPreview } from "./PatientCaregiverPreview";
import { ScanMedicationModal } from "./ScanMedicationModal";
import { AddEditMedicineModal } from "./AddEditMedicineModal";
import { PatientUploadsAndCommunication } from "./PatientUploadsAndCommunication";
import {
  Stethoscope,
  Heart,
  LayoutGrid,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Info,
  Calendar,
} from "lucide-react";

interface DoctorConsultationWorkspaceProps {
  initialPatientId?: string | null;
}

export function DoctorConsultationWorkspace({
  initialPatientId,
}: DoctorConsultationWorkspaceProps) {
  const router = useRouter();
  const { showToast } = useToast();

  // All patients list
  const [patients] = useState<ConsultationPatientRecord[]>(
    MOCK_CONSULTATION_PATIENTS
  );

  // Active patient
  const [selectedPatient, setSelectedPatient] = useState<ConsultationPatientRecord>(
    () => {
      if (initialPatientId) {
        const found = MOCK_CONSULTATION_PATIENTS.find(
          (p) => p.id === initialPatientId || p.patientId === initialPatientId
        );
        if (found) return found;
      }
      return MOCK_CONSULTATION_PATIENTS[0];
    }
  );

  // Consultation Session State
  const [isConsultationStarted, setIsConsultationStarted] = useState(true);
  const [activeViewTab, setActiveViewTab] = useState<"clinical" | "caregiver">("clinical");

  // Current Working Medications for active patient
  const [currentMedications, setCurrentMedications] = useState<ConsultationMedication[]>(
    selectedPatient.defaultMedications
  );

  // Proposed Medicine Form State
  const [proposedMedicine, setProposedMedicine] = useState<ProposedMedicineInput>({
    name: "Ibuprofen (Advil)",
    dose: "400 mg",
    frequency: "Three times daily with food",
    duration: "10 Days",
    instructions: "Take with food or milk for pain relief.",
  });

  // Risk Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskResult, setRiskResult] = useState<RiskAnalysisResult | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>("Under Review");
  const [doctorNotes, setDoctorNotes] = useState<string>(
    "Patient presenting for clinical regimen review. Evaluated candidate analgesic against concurrent antihypertensive and antiplatelet therapy."
  );

  // Modals state
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [medicationToEdit, setMedicationToEdit] = useState<ConsultationMedication | null>(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);

  // Synchronize when selectedPatient changes
  const handleSelectPatient = (patient: ConsultationPatientRecord) => {
    setSelectedPatient(patient);
    setCurrentMedications(patient.defaultMedications);
    setRiskResult(null);
    setSelectedAction("Initial Review");
    setDoctorNotes(`Clinical consultation initiated for ${patient.name}.`);
    showToast(
      "Patient Record Loaded",
      `Opened consultation chart for ${patient.name} (${patient.patientId})`,
      "info"
    );
  };

  // Perform Initial Mock Risk Analysis on Mount (or when candidate changes)
  useEffect(() => {
    if (proposedMedicine.name.trim().length > 0) {
      const initialEval = analyzeMockMedicationRisk(
        proposedMedicine,
        currentMedications,
        selectedPatient.age
      );
      setRiskResult(initialEval);
      setSelectedAction(
        initialEval.level === "HIGH"
          ? "Potential interaction detected — Reviewing safer alternatives"
          : initialEval.level === "MODERATE"
          ? "Moderate precaution required — Dosage review recommended"
          : "Approved standard candidate regimen"
      );
    }
  }, []);

  // Handler for Analyze Button click
  const handleRunRiskAnalysis = () => {
    if (!proposedMedicine.name.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const res = analyzeMockMedicationRisk(
        proposedMedicine,
        currentMedications,
        selectedPatient.age
      );
      setRiskResult(res);
      setSelectedAction(
        res.level === "HIGH"
          ? "High risk interaction detected — Safety intervention required"
          : res.level === "MODERATE"
          ? "Moderate caution noted — Dose/duration adjustment recommended"
          : "Regimen addition safe — Compatibility verified"
      );
      showToast(
        "Risk Analysis Complete",
        `Finished clinical compatibility check for ${proposedMedicine.name}: ${res.level} Risk`,
        res.level === "HIGH" ? "error" : res.level === "MODERATE" ? "warning" : "success"
      );
    }, 1200);
  };

  // Handler for applying Safer Option
  const handleApplySaferOption = (option: SaferAlternativeOption) => {
    const updated = { ...proposedMedicine };

    if (option.actionPayload.name) updated.name = option.actionPayload.name;
    if (option.actionPayload.dose) updated.dose = option.actionPayload.dose;
    if (option.actionPayload.frequency) updated.frequency = option.actionPayload.frequency;
    if (option.actionPayload.duration) updated.duration = option.actionPayload.duration;

    setProposedMedicine(updated);
    setSelectedAction(`Applied Safer Option: ${option.suggestedOption}`);

    // Re-evaluate risk with the new safer choice
    setTimeout(() => {
      const newEval = analyzeMockMedicationRisk(
        updated,
        currentMedications,
        selectedPatient.age
      );
      setRiskResult(newEval);
      showToast(
        "Prescription Updated",
        `Applied alternative: ${updated.name} (${updated.dose}). Collision neutralized!`,
        "success"
      );
    }, 400);
  };

  // Medication handlers
  const handleAddMedicine = (newMed: ConsultationMedication) => {
    setCurrentMedications((prev) => [newMed, ...prev]);
    showToast("Medication Added", `Added ${newMed.name} to regimen`, "success");
  };

  const handleEditMedicine = (updatedMed: ConsultationMedication) => {
    setCurrentMedications((prev) =>
      prev.map((m) => (m.id === updatedMed.id ? updatedMed : m))
    );
    showToast("Medication Updated", `Saved changes for ${updatedMed.name}`, "info");
  };

  const handleRemoveMedicine = (id: string) => {
    const med = currentMedications.find((m) => m.id === id);
    setCurrentMedications((prev) => prev.filter((m) => m.id !== id));
    showToast(
      "Medication Removed",
      `Removed ${med?.name || "medicine"} from active consultation regimen`,
      "info"
    );
  };

  const handleLoadPreviousRecords = () => {
    setCurrentMedications(selectedPatient.defaultMedications);
    showToast(
      "Records Reloaded",
      `Restored verified default medication records for ${selectedPatient.name}`,
      "info"
    );
  };

  const handleAddScannedMedications = (scanned: ConsultationMedication[]) => {
    setCurrentMedications((prev) => [...scanned, ...prev]);
    showToast(
      "Scanned Meds Added",
      `Successfully imported ${scanned.length} scanned medications to patient regimen`,
      "success"
    );
  };

  const handleContinueConsultation = () => {
    setIsCompletionModalOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. CONSULTATION ENTRY HEADER (Requirement 1) */}
      <ConsultationEntryHeader
        patient={selectedPatient}
        allPatients={patients}
        onSelectPatient={handleSelectPatient}
        currentMedications={currentMedications}
        isConsultationStarted={isConsultationStarted}
        onStartConsultation={() => {
          setIsConsultationStarted(true);
          showToast(
            "Consultation Started",
            `Active clinical session initiated for ${selectedPatient.name}`,
            "success"
          );
        }}
        onAddMedicineManually={() => {
          setMedicationToEdit(null);
          setIsAddEditModalOpen(true);
        }}
      />

      {/* Navigation Switcher: Clinical Workspace vs Patient & Caregiver View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveViewTab("clinical")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeViewTab === "clinical"
                ? "bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-2xs font-extrabold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinical Workspace (Doctor CDS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab("caregiver")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeViewTab === "caregiver"
                ? "bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-2xs font-extrabold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Patient & Caregiver View</span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 text-xs text-slate-500 dark:text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          <span>Attending: <strong>Dr. Sharma, MD</strong> • Room 3A</span>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE VIEW */}
      {activeViewTab === "caregiver" ? (
        /* PATIENT & CAREGIVER VIEW (Requirement 8) */
        <PatientCaregiverPreview
          medications={currentMedications}
          proposedMedicine={proposedMedicine}
          patientName={selectedPatient.name}
        />
      ) : (
        /* CLINICAL WORKSPACE: TWO-COLUMN DESKTOP LAYOUT (Requirement 6) */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Patient + Medication Information (Width: 6/12 on large screens) */}
            <div className="lg:col-span-6 space-y-6">
              {/* CURRENT MEDICATIONS (Requirement 2) */}
              <CurrentMedicationsSection
                medications={currentMedications}
                onAddMedicine={() => {
                  setMedicationToEdit(null);
                  setIsAddEditModalOpen(true);
                }}
                onEditMedicine={(med) => {
                  setMedicationToEdit(med);
                  setIsAddEditModalOpen(true);
                }}
                onRemoveMedicine={handleRemoveMedicine}
                onScanList={() => setIsScanModalOpen(true)}
                onLoadPreviousRecords={handleLoadPreviousRecords}
              />

              {/* PROPOSE NEW MEDICINE (Requirement 3) */}
              <ProposeMedicineForm
                proposed={proposedMedicine}
                onChange={(field, value) => {
                  setProposedMedicine((prev) => ({ ...prev, [field]: value }));
                }}
                onAnalyze={handleRunRiskAnalysis}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {/* RIGHT COLUMN: Risk Analysis + Recommendations (Width: 6/12 on large screens) */}
            <div className="lg:col-span-6 space-y-6">
              {riskResult ? (
                /* RISK ANALYSIS RESULT & SAFER ALTERNATIVES (Requirements 4 & 5) */
                <RiskAnalysisCard
                  result={riskResult}
                  proposed={proposedMedicine}
                  onApplySaferOption={handleApplySaferOption}
                />
              ) : (
                /* Empty / Ready to Analyze State */
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Medication Safety Engine Ready
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      Enter a candidate medicine in the &ldquo;Propose New Medicine&rdquo; form on the left and click &ldquo;Analyze Medication Risk&rdquo; to evaluate interactions, fall hazards, and geriatric safety.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PATIENT UPLOADS, INTAKE & TELEHEALTH (Phase 3 Integration) */}
          <PatientUploadsAndCommunication
            patient={selectedPatient}
            onSendClinicalResponse={(msg) => {
              setDoctorNotes((prev) => `${prev}\n\nClinical Guidance Delivered: "${msg}"`);
            }}
            onUploadPrescription={(file) => {
              showToast(
                "Prescription Synced",
                `Authorized Rx '${file.name}' linked to patient profile`,
                "success"
              );
            }}
          />

          {/* 7. CONSULTATION SUMMARY (Requirement 7) */}
          <ConsultationSummaryCard
            existingMedications={currentMedications}
            proposedMedicine={proposedMedicine}
            riskResult={riskResult}
            selectedAction={selectedAction}
            doctorNotes={doctorNotes}
            onDoctorNotesChange={setDoctorNotes}
            onContinueConsultation={handleContinueConsultation}
          />
        </div>
      )}

      {/* SCAN MEDICATION MODAL */}
      <ScanMedicationModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onAddScannedMedications={handleAddScannedMedications}
      />

      {/* ADD/EDIT MEDICATION MODAL */}
      <AddEditMedicineModal
        isOpen={isAddEditModalOpen}
        medicationToEdit={medicationToEdit}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={(med) => {
          if (medicationToEdit) {
            handleEditMedicine(med);
          } else {
            handleAddMedicine(med);
          }
        }}
      />

      {/* CONSULTATION CONCLUSION CONFIRMATION MODAL */}
      {isCompletionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Consultation Finalized & Synchronized
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prescription choices, safety checks, and caregiver schedules for <strong>{selectedPatient.name}</strong> have been recorded in the clinical decision support ledger.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedPatient.name} ({selectedPatient.patientId})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prescribed Candidate:</span>
                <span className="font-bold text-teal-600 dark:text-teal-400 font-mono">
                  {proposedMedicine.name} ({proposedMedicine.dose})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Clinical Safety Verdict:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {riskResult?.level || "LOW"} Risk — Verified
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Caregiver View:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Synced to Patient App
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCompletionModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Back to Workspace
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCompletionModalOpen(false);
                  router.push(`/doctor/patients/${selectedPatient.id}`);
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Open Patient Chart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
