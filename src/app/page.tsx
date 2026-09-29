'use client';

import React, { useState, useEffect } from 'react';
import {
  Patient,
  Medication,
  DeprescribingRecommendation,
} from '@/types';
import {
  MOCK_PATIENTS,
  SimulatorCandidateDrug,
} from '@/data/mockPatients';
import {
  getPatients,
} from '@/services';

// Landing Page Components
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { TrustStrip } from '@/components/landing/TrustStrip';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { CoreFeaturesSection } from '@/components/landing/CoreFeaturesSection';
import { DoctorSection } from '@/components/landing/DoctorSection';
import { PatientCaregiverSection } from '@/components/landing/PatientCaregiverSection';
import { SafetyStatement } from '@/components/landing/SafetyStatement';
import { CtaSection } from '@/components/landing/CtaSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LoginModal } from '@/components/landing/LoginModal';

// Interactive Product Dashboard Components
import { Navbar } from '@/components/Navbar';
import { PatientHeader } from '@/components/doctor/PatientHeader';
import { RiskOverviewCards } from '@/components/doctor/RiskOverviewCards';
import { InteractionMatrix } from '@/components/doctor/InteractionMatrix';
import { PrescribingCascadeCard } from '@/components/doctor/PrescribingCascadeCard';
import { MedicationTable } from '@/components/doctor/MedicationTable';
import { AiRecommendationsSection } from '@/components/doctor/AiRecommendationsSection';
import { WhatIfSimulatorModal } from '@/components/doctor/WhatIfSimulatorModal';
import { ClinicalReportModal } from '@/components/doctor/ClinicalReportModal';
import { AddMedicationModal } from '@/components/doctor/AddMedicationModal';
import { AdjustDoseModal } from '@/components/doctor/AdjustDoseModal';
import { CareViewHero } from '@/components/patient/CareViewHero';
import { DailyTimelineSchedule } from '@/components/patient/DailyTimelineSchedule';
import { CaregiverSafetyGuide } from '@/components/patient/CaregiverSafetyGuide';
import { CaregiverAiAssistant } from '@/components/patient/CaregiverAiAssistant';
import { PatientWalletCardModal } from '@/components/patient/PatientWalletCardModal';
import { ToastProvider, useToast } from '@/components/Toast';

import {
  AlertCircle,
  Pill,
  BookOpen,
  Sparkles,
  SlidersHorizontal,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  LayoutDashboard,
  Home as HomeIcon,
} from 'lucide-react';

function MedGuardAppContent() {
  const { showToast } = useToast();

  // Navigation View State: 'landing' or 'app'
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');

  // App Workflow State: 'doctor' or 'patient'
  const [currentWorkflow, setCurrentWorkflow] = useState<'doctor' | 'patient'>('doctor');

  // Patients Data State
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [activePatientId, setActivePatientId] = useState<string>('pat-1');

  // Load patients from service
  useEffect(() => {
    let isMounted = true;
    getPatients().then((data) => {
      if (isMounted && data.length > 0) {
        setPatients(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Modals state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [isWalletCardOpen, setIsWalletCardOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [adjustingMed, setAdjustingMed] = useState<Medication | null>(null);

  // Simulation State
  const [simulatedScore, setSimulatedScore] = useState<number | undefined>(undefined);
  const [appliedRecIds, setAppliedRecIds] = useState<string[]>([]);

  // Clinician Cockpit Tabs
  const [activeClinicalTab, setActiveClinicalTab] = useState<'interactions' | 'regimen' | 'beers_audit'>('interactions');

  // Patient Adherence state (Medication IDs marked as taken today)
  const [takenMedIds, setTakenMedIds] = useState<string[]>(['med-1', 'med-3', 'med-8']);

  // Get active patient object
  const activePatient = patients.find((p) => p.id === activePatientId) || patients[0];

  // Navigation Handlers from Landing Page
  const handleLaunchDoctorCockpit = () => {
    setCurrentWorkflow('doctor');
    setViewMode('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Clinician Cockpit Active', 'Loaded Eleanor Vance clinical record', 'info');
  };

  const handleLaunchPatientCareView = () => {
    setCurrentWorkflow('patient');
    setViewMode('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('CareView Portal Active', 'Loaded daily medication schedule', 'info');
  };

  // Switch patient handler
  const handleSelectPatient = (id: string) => {
    setActivePatientId(id);
    setSimulatedScore(undefined);
    setAppliedRecIds([]);
    showToast('Patient Chart Loaded', `Loaded chart for ${patients.find(p => p.id === id)?.name}`, 'info');
  };

  // Toggle med taken in Patient CareView
  const handleToggleTaken = (medId: string) => {
    const isTaken = takenMedIds.includes(medId);
    if (isTaken) {
      setTakenMedIds((prev) => prev.filter((id) => id !== medId));
      showToast('Dose Unchecked', 'Marked dose as pending', 'info');
    } else {
      setTakenMedIds((prev) => [...prev, medId]);
      showToast('Dose Recorded!', 'Maintained 7-day adherence streak', 'success');
    }
  };

  // Deprescribe a medication from clinician table
  const handleDeprescribe = (medId: string) => {
    const med = activePatient.medications.find((m) => m.id === medId);
    if (!med) return;

    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.id !== activePatient.id) return pat;
        const updatedMeds = pat.medications.filter((m) => m.id !== medId);
        const updatedInteractions = pat.interactions.filter(
          (i) => !i.drug1.includes(med.name) && !i.drug2.includes(med.name)
        );
        const updatedCascades = pat.cascades.filter(
          (c) => !c.primaryDrug.includes(med.name) && !c.secondaryDrug.includes(med.name)
        );
        const newScore = Math.max(20, pat.polypharmacyScore - 18);

        return {
          ...pat,
          polypharmacyScore: newScore,
          riskLevel: newScore < 40 ? 'LOW' : newScore < 70 ? 'MODERATE' : 'HIGH',
          totalAcbScore: Math.max(0, pat.totalAcbScore - med.acbScore),
          fallRiskScore: Math.max(1, pat.fallRiskScore - med.fallSedationScore),
          medications: updatedMeds,
          interactions: updatedInteractions,
          cascades: updatedCascades,
        };
      })
    );

    showToast(
      'Medication Deprescribed',
      `Discontinued ${med.name}. Risk score recalculated to ${Math.max(20, activePatient.polypharmacyScore - 18)}.`,
      'success'
    );
  };

  // Adjust dose
  const handleSaveDose = (medId: string, newDose: string, newFreq: string, isTapering: boolean) => {
    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.id !== activePatient.id) return pat;
        return {
          ...pat,
          medications: pat.medications.map((m) =>
            m.id === medId ? { ...m, dosage: newDose, frequency: newFreq, isTapering } : m
          ),
        };
      })
    );

    showToast('Dose Titrated', `Updated regimen schedule for ${newDose}`, 'success');
  };

  // Add new medication
  const handleAddMedication = (newMedPartial: Partial<Medication>) => {
    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: newMedPartial.name || 'New Drug',
      genericName: newMedPartial.name || 'New Drug',
      dosage: newMedPartial.dosage || '10 mg',
      route: newMedPartial.route || 'Oral',
      frequency: newMedPartial.frequency || 'Once daily',
      timingSlot: newMedPartial.timingSlot || 'morning',
      prescriber: newMedPartial.prescriber || 'Dr. Sarah Al-Mansoor',
      indication: newMedPartial.indication || 'Therapeutic management',
      dateStarted: newMedPartial.dateStarted || new Date().toISOString().split('T')[0],
      category: newMedPartial.category || 'Therapeutic Agent',
      pillColor: newMedPartial.pillColor || '#38bdf8',
      pillShape: 'round',
      pillVisualDescription: 'Newly added prescription tablet',
      withFood: 'anytime',
      acbScore: 0,
      fallSedationScore: 0,
      beersCriteriaFlag: false,
      renalAdjustmentNeeded: false,
      isActive: true,
      patientPlainName: newMedPartial.name || 'New Prescription',
      patientWhy: newMedPartial.indication || 'Prescribed therapy',
    };

    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.id !== activePatient.id) return pat;
        return {
          ...pat,
          medications: [newMed, ...pat.medications],
        };
      })
    );

    showToast('Medication Added', `Successfully added ${newMed.name} to patient chart.`, 'success');
  };

  // Apply AI Deprescribing Recommendation
  const handleApplyRecommendation = (rec: DeprescribingRecommendation) => {
    setAppliedRecIds((prev) => [...prev, rec.id]);

    setPatients((prev) =>
      prev.map((pat) => {
        if (pat.id !== activePatient.id) return pat;
        const newScore = Math.max(20, pat.polypharmacyScore - rec.expectedScoreImprovement);
        return {
          ...pat,
          polypharmacyScore: newScore,
          riskLevel: newScore < 40 ? 'LOW' : newScore < 70 ? 'MODERATE' : 'HIGH',
          totalAcbScore: Math.max(0, pat.totalAcbScore - 2),
        };
      })
    );

    showToast(
      'Deprescribing Protocol Applied',
      `Applied ${rec.action} for ${rec.drugName}. Safety score improved by +${rec.expectedScoreImprovement} points.`,
      'success'
    );
  };

  // Apply What-If Simulator results
  const handleApplySimulation = (removedMedIds: string[], addedCandidates: SimulatorCandidateDrug[]) => {
    let scoreAdjustment = 0;
    removedMedIds.forEach(() => { scoreAdjustment -= 12; });
    addedCandidates.forEach((c) => { scoreAdjustment += (c.category === 'NSAID' ? 22 : 6); });

    const newScore = Math.max(10, Math.min(100, activePatient.polypharmacyScore + scoreAdjustment));
    setSimulatedScore(newScore);

    showToast(
      'Simulation Applied to Chart',
      `Projected Risk Score adjusted to ${newScore} / 100.`,
      'warning'
    );
  };

  // Break cascade action
  const handleBreakCascade = () => {
    const furosemide = activePatient.medications.find(m => m.name.toLowerCase().includes('furosemide'));
    if (furosemide) {
      handleDeprescribe(furosemide.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-[#090e17] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white transition-colors duration-200">
      
      {/* -------------------- 1. LANDING PAGE VIEW -------------------- */}
      {viewMode === 'landing' ? (
        <div className="flex-1 flex flex-col">
          {/* Landing Navbar */}
          <LandingNavbar
            onStartConsultation={handleLaunchDoctorCockpit}
            onExplorePatient={handleLaunchPatientCareView}
            onOpenLogin={() => setIsLoginOpen(true)}
          />

          {/* Hero Section */}
          <HeroSection
            onStartConsultation={handleLaunchDoctorCockpit}
            onExploreMedGuard={() => {
              const el = document.getElementById('how-it-works');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Trust / Value Strip */}
          <TrustStrip />

          {/* How It Works Section */}
          <HowItWorksSection />

          {/* Core Features Section */}
          <CoreFeaturesSection />

          {/* Doctor Section */}
          <DoctorSection onEnterDoctorDashboard={handleLaunchDoctorCockpit} />

          {/* Patient/Caregiver Section */}
          <PatientCaregiverSection onExplorePatientView={handleLaunchPatientCareView} />

          {/* Safety Statement */}
          <SafetyStatement />

          {/* Call to Action Section */}
          <CtaSection
            onEnterDoctorDashboard={handleLaunchDoctorCockpit}
            onExplorePatientView={handleLaunchPatientCareView}
          />

          {/* Landing Footer */}
          <LandingFooter />

          {/* Login Modal */}
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onLoginAsDoctor={handleLaunchDoctorCockpit}
            onLoginAsCaregiver={handleLaunchPatientCareView}
          />
        </div>
      ) : (
        /* -------------------- 2. INTERACTIVE PRODUCT APP VIEW -------------------- */
        <div className="flex-1 flex flex-col">
          
          {/* Top Quick Bar to Return to Landing Page */}
          <div className="bg-slate-900 text-white text-xs px-4 py-2 flex items-center justify-between no-print border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">
                MedGuard Live Prototype Environment
              </span>
              <span className="text-slate-400 hidden sm:inline">
                • Fully interactive mock clinical data
              </span>
            </div>

            <button
              onClick={() => {
                setViewMode('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer text-[11px]"
            >
              <HomeIcon className="w-3.5 h-3.5 text-teal-400" />
              <span>← Back to Landing Page</span>
            </button>
          </div>

          {/* Global Navigation Bar */}
          <Navbar
            currentWorkflow={currentWorkflow}
            onWorkflowChange={setCurrentWorkflow}
            patients={patients}
            activePatient={activePatient}
            onSelectPatient={handleSelectPatient}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onOpenReport={() => setIsReportOpen(true)}
            onOpenAddMed={() => setIsAddMedOpen(true)}
            onOpenWalletCard={() => setIsWalletCardOpen(true)}
            isSimulating={simulatedScore !== undefined}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            
            {/* Simulation Banner Alert if active */}
            {simulatedScore !== undefined && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md flex items-center justify-between gap-4 animate-in slide-in-from-top-4">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-bold text-sm block">
                      Interactive Simulation Mode Active
                    </span>
                    <span className="text-xs text-amber-100">
                      Projected Polypharmacy Risk Score: {simulatedScore} / 100 (Original Baseline: {activePatient.polypharmacyScore})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSimulatedScore(undefined)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs transition-colors cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Simulation
                </button>
              </div>
            )}

            {/* ----------------- WORKFLOW 1: CLINICIAN COCKPIT ----------------- */}
            {currentWorkflow === 'doctor' && (
              <div>
                {/* Patient Header Vitals & Lab Bar */}
                <PatientHeader patient={activePatient} />

                {/* High-Level Risk Overview Cards (Gauge, DDIs, ACB, Fall Index) */}
                <RiskOverviewCards
                  patient={activePatient}
                  simulatedScore={simulatedScore}
                  originalScore={activePatient.polypharmacyScore}
                />

                {/* Prescribing Cascade Alert Box (If detected) */}
                <PrescribingCascadeCard
                  cascades={activePatient.cascades}
                  onBreakCascade={handleBreakCascade}
                />

                {/* AI Deprescribing & Optimization Recommendations */}
                <AiRecommendationsSection
                  recommendations={activePatient.recommendations}
                  onApplyRecommendation={handleApplyRecommendation}
                  appliedRecIds={appliedRecIds}
                />

                {/* Tab Navigation for Clinical Drilldown */}
                <div className="flex items-center gap-2 mb-4 border-b border-slate-200/80 pb-2">
                  <button
                    onClick={() => setActiveClinicalTab('interactions')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeClinicalTab === 'interactions'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span>Drug-Drug Interactions ({activePatient.interactions.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveClinicalTab('regimen')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeClinicalTab === 'regimen'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    <Pill className="w-4 h-4 text-teal-600" />
                    <span>Medication Management ({activePatient.medications.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveClinicalTab('beers_audit')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeClinicalTab === 'beers_audit'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>Beers 2023 & Organ Clearance</span>
                  </button>
                </div>

                {/* Active Tab View */}
                {activeClinicalTab === 'interactions' && (
                  <InteractionMatrix
                    interactions={activePatient.interactions}
                    onSimulateAction={(drugName) => {
                      const med = activePatient.medications.find(
                        (m) =>
                          m.name.toLowerCase().includes(drugName.toLowerCase()) ||
                          m.genericName.toLowerCase().includes(drugName.toLowerCase())
                      );
                      if (med) handleDeprescribe(med.id);
                    }}
                  />
                )}

                {activeClinicalTab === 'regimen' && (
                  <MedicationTable
                    medications={activePatient.medications}
                    onDeprescribe={handleDeprescribe}
                    onAdjustDose={(med) => setAdjustingMed(med)}
                  />
                )}

                {activeClinicalTab === 'beers_audit' && (
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-amber-600" />
                        AGS Beers Criteria® 2023 & STOPP/START v3 Safety Audit
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Evaluates potentially inappropriate medications (PIMs) in older adults with multimorbidity.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activePatient.medications
                        .filter((m) => m.beersCriteriaFlag)
                        .map((med) => (
                          <div
                            key={med.id}
                            className="p-4 rounded-xl border border-rose-200 bg-rose-50/50"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-sm text-slate-900">
                                {med.name} ({med.dosage})
                              </span>
                              <span className="text-[10px] uppercase font-extrabold bg-rose-600 text-white px-2 py-0.5 rounded">
                                Beers Violation
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 mb-2">
                              {med.category} • ACB Score: {med.acbScore} • Sedation Score: {med.fallSedationScore}
                            </div>
                            <p className="text-xs text-rose-900 font-medium leading-relaxed bg-white p-3 rounded-lg border border-rose-200/80">
                              {med.beersRationale}
                            </p>
                          </div>
                        ))}
                    </div>

                    {activePatient.medications.filter((m) => m.beersCriteriaFlag).length === 0 && (
                      <div className="text-center py-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-600 font-medium">
                          No medications in the current regimen violate AGS Beers Criteria 2023.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ----------------- WORKFLOW 2: PATIENT & CAREGIVER (CAREVIEW) ----------------- */}
            {currentWorkflow === 'patient' && (
              <div>
                {/* CareView Greeting & Daily Progress */}
                <CareViewHero
                  patient={activePatient}
                  takenCount={takenMedIds.length}
                  totalCount={activePatient.medications.length}
                  onOpenWalletCard={() => setIsWalletCardOpen(true)}
                />

                {/* Daily Timeline Schedule (Morning / Noon / Evening / Bedtime) */}
                <DailyTimelineSchedule
                  medications={activePatient.medications}
                  takenMedIds={takenMedIds}
                  onToggleTaken={handleToggleTaken}
                />

                {/* Caregiver Plain-Language Safety Guide */}
                <CaregiverSafetyGuide />

                {/* Caregiver AI Assistant */}
                <CaregiverAiAssistant patient={activePatient} />
              </div>
            )}

          </main>

          {/* Global Modals */}
          <WhatIfSimulatorModal
            isOpen={isSimulatorOpen}
            onClose={() => setIsSimulatorOpen(false)}
            patient={activePatient}
            onApplySimulation={handleApplySimulation}
          />

          <ClinicalReportModal
            isOpen={isReportOpen}
            onClose={() => setIsReportOpen(false)}
            patient={activePatient}
          />

          <AddMedicationModal
            isOpen={isAddMedOpen}
            onClose={() => setIsAddMedOpen(false)}
            patient={activePatient}
            onAddMedication={handleAddMedication}
          />

          <AdjustDoseModal
            isOpen={adjustingMed !== null}
            onClose={() => setAdjustingMed(null)}
            medication={adjustingMed}
            onSaveDose={handleSaveDose}
          />

          <PatientWalletCardModal
            isOpen={isWalletCardOpen}
            onClose={() => setIsWalletCardOpen(false)}
            patient={activePatient}
          />

          {/* App Footer */}
          <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#090e17] py-6 mt-12 text-xs text-slate-500 dark:text-slate-400 text-center no-print">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-800 dark:text-white">MEDGUARD</span>
                <span>• AI-Powered Polypharmacy Risk Assistant</span>
              </div>
              <button
                onClick={() => {
                  setViewMode('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[11px] text-teal-700 dark:text-teal-400 hover:underline font-semibold cursor-pointer"
              >
                Return to Landing Page
              </button>
            </div>
          </footer>
        </div>
      )}

      {/* Floating Mode Switcher Badge (Allows Judges / Users to toggle instantly anywhere) */}
      <div className="fixed bottom-5 left-5 z-40 no-print">
        <button
          onClick={() => {
            const nextMode = viewMode === 'landing' ? 'app' : 'landing';
            setViewMode(nextMode);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showToast(
              nextMode === 'landing' ? 'Landing Page View' : 'Interactive App View',
              nextMode === 'landing' ? 'Returned to marketing showcase' : 'Loaded interactive prototype',
              'info'
            );
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700/80 backdrop-blur-md transition-all cursor-pointer hover:scale-105"
        >
          {viewMode === 'landing' ? (
            <>
              <LayoutDashboard className="w-3.5 h-3.5 text-teal-400" />
              <span>Launch Interactive App</span>
            </>
          ) : (
            <>
              <HomeIcon className="w-3.5 h-3.5 text-teal-400" />
              <span>Show Landing Page</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <MedGuardAppContent />
    </ToastProvider>
  );
}
