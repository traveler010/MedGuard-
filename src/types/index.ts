// MedGuard Unified Type Definitions
// Defines core interfaces for Patient, Medication, RiskAlert, RiskAnalysis, Prescription, Notification, and User.

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export type UserRole = 'DOCTOR' | 'PATIENT' | 'CAREGIVER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  specialty?: string;
  licenseNumber?: string;
  clinicName?: string;
  phone?: string;
}

export type TimingSlot = 'morning' | 'noon' | 'evening' | 'bedtime';

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  route: string;
  frequency: string;
  timingSlot: TimingSlot;
  prescriber: string;
  indication: string;
  dateStarted: string;
  category: string;
  pillColor: string;
  pillShape: 'round' | 'oval' | 'capsule' | 'oblong';
  pillVisualDescription: string;
  withFood: 'with_food' | 'empty_stomach' | 'anytime';
  acbScore: number; // 0, 1, 2, 3 Anticholinergic Cognitive Burden
  fallSedationScore: number; // 0 to 3
  beersCriteriaFlag: boolean;
  beersRationale?: string;
  renalAdjustmentNeeded: boolean;
  renalNote?: string;
  isActive: boolean;
  isTapering?: boolean;
  patientPlainName: string;
  patientWhy: string;
  patientSpecialNotice?: string;
}

export interface MedicationScheduleItem {
  id: string;
  medicineId: string;
  name: string;
  simpleName: string;
  time: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  purpose: string;
  dosage: string;
  pillDescription: string;
  whenToTake: string;
  doctorInstructions: string;
  safetyInfo: string[];
  doctorName: string;
  pillColor: string;
  isTaken: boolean;
  takenAt?: string;
}

export interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: RiskLevel;
  mechanism: string;
  clinicalConsequence: string;
  recommendation: string;
  evidenceSource: string;
  isActive: boolean;
}

export interface PrescribingCascade {
  id: string;
  primaryDrug: string;
  adverseEffect: string;
  secondaryDrug: string;
  secondaryDrugIndicationPresumed: string;
  clinicalGuidance: string;
  isActive: boolean;
}

export interface DeprescribingRecommendation {
  id: string;
  drugId: string;
  drugName: string;
  action: 'DISCONTINUE' | 'TAPER_OFF' | 'SUBSTITUTE' | 'DOSE_REDUCE';
  priority: 'URGENT' | 'HIGH' | 'ROUTINE';
  clinicalRationale: string;
  expectedScoreImprovement: number;
  evidenceCitation: string;
  monitoringPlan: string;
  suggestedAlternative?: string;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male';
  dob: string;
  weightKg: number;
  heightCm: number;
  bloodPressure: string;
  heartRate: number;
  eGFR: number; // mL/min/1.73m2
  creatinine: number; // mg/dL
  potassium: number; // mEq/L
  inr?: number;
  allergies: string[];
  diagnoses: string[];
  primaryDoctor: string;
  lastReviewDate: string;
  lastConsultation?: string;
  caregiverName?: string;
  caregiverPhone?: string;
  
  // Risk metrics
  polypharmacyScore: number; // 0-100
  riskLevel: RiskLevel;
  totalAcbScore: number;
  fallRiskScore: number; // 0-10
  sedationIndex: number; // 0-10
  
  medications: Medication[];
  interactions: DrugInteraction[];
  cascades: PrescribingCascade[];
  recommendations: DeprescribingRecommendation[];
}

export interface RiskAlert {
  id: string;
  patientId: string;
  patientName: string;
  severity: RiskLevel;
  title: string;
  description: string;
  category: 'INTERACTION' | 'RENAL' | 'BEERS' | 'CASCADE' | 'SCHEDULE' | 'SYSTEM';
  timestamp: string;
  acknowledged?: boolean;
  actionRequired?: string;
  recommendedAction?: string;
}

export interface RecentAlertItem {
  id: string;
  severity: RiskLevel;
  title: string;
  patientName: string;
  patientMrn: string;
  patientAge: number;
  statusText: string;
  description: string;
  recommendedAction: string;
  timestamp: string;
  category: 'Interaction' | 'Beers Criteria' | 'Cascade' | 'Stable';
  isRead?: boolean;
}

export interface SimulatorCandidateDrug {
  id: string;
  name: string;
  category: string;
  defaultDose: string;
  addedAcb: number;
  addedFallRisk: number;
  renalHazardForEgfrUnder50: boolean;
  typicalInteractions: {
    withDrug: string;
    severity: RiskLevel;
    mechanism: string;
  }[];
}

// Risk Analysis Specific Types
export interface RiskFactor {
  factor: string;
  impact: string;
  hazardScore?: number;
}

export interface RiskCardDetail {
  status: RiskLevel;
  badge: string;
  title: string;
  shortExplanation: string;
  detailedMechanism: string;
  patientImpact: string[];
  guideline: string;
  safeRecommendation?: string;
}

export interface ProposedMedicationInput {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  indication: string;
}

export interface MedicationAlternative {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  riskScore: number;
  riskLevel: RiskLevel;
  clinicalAdvantage: string;
  isRecommended?: boolean;
}

export interface RiskAnalysis {
  id: string;
  consultationId?: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  proposedMedication: ProposedMedicationInput;
  overallRisk: RiskLevel;
  riskScore: number; // 0-100
  riskSummary: string;
  breakdown: {
    drugInteraction: RiskCardDetail;
    ageRisk: RiskCardDetail;
    durationRisk: RiskCardDetail;
    sideEffectLoad: RiskCardDetail;
  };
  whyFlagged: {
    coreWarning: string;
    clinicalExplanation: string;
    contributingFactors: RiskFactor[];
  };
  recommendedActions: {
    type: 'ALTERNATIVE' | 'ADJUST' | 'OVERRIDE';
    title: string;
    description: string;
  }[];
  alternatives: MedicationAlternative[];
}

export interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  riskLevel: RiskLevel;
  isProposed?: boolean;
  status?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  doctorName: string;
  date: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'MODIFIED' | 'DISCONTINUED' | 'ACTIVE';
  medications: PrescriptionItem[];
  overallRisk: RiskLevel;
  riskFactors: string[];
  doctorDecision?: 'APPROVE' | 'MODIFY' | 'REMOVE';
  decisionNotes?: string;
  overrideJustification?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'schedule' | 'clinical' | 'patient';
  unread: boolean;
  role: 'doctor' | 'patient' | 'both';
  link?: string;
}
