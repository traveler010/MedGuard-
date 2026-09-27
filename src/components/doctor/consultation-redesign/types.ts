export type ClinicalRiskLevel = "LOW" | "MODERATE" | "HIGH";

export interface ConsultationPatientVitals {
  bloodPressure: string;
  heartRate: string;
  eGFR: string;
  creatinine?: string;
  hba1c?: string;
  haemoglobin?: string;
  allergies: string[];
}

export interface PreviousConsultationInfo {
  date: string;
  chiefComplaint: string;
  summary: string;
  doctorResponse: string;
  doctorName: string;
}

export interface CurrentAppointmentInfo {
  date: string;
  time: string;
  type: string;
  status: "Confirmed" | "Upcoming" | "Completed" | "Pending";
  location: string;
}

export interface ConsultationMedication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  scheduledTime: string;
  startDate?: string;
  endDate?: string;
  status: "Active" | "Verified" | "Discontinued" | "Under Review";
  importantNotes?: string;
  category?: string;
  purposePlain?: string; // for caregiver view
  patientExplanation?: string; // for caregiver view
}

export interface ProposedMedicineInput {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface SaferAlternativeOption {
  id: string;
  type: "alternative_medicine" | "adjusted_dosage" | "shorter_duration";
  title: string;
  suggestedOption: string;
  reason: string;
  actionPayload: {
    name?: string;
    dose?: string;
    frequency?: string;
    duration?: string;
  };
}

export interface RiskAnalysisResult {
  level: ClinicalRiskLevel;
  headline: string;
  explanation: string;
  interactionRisk: "Minimal" | "Moderate" | "Severe";
  dependenceRisk: "Low" | "Moderate" | "High";
  cumulativeSideEffectRisk: "Low" | "Moderate" | "Elevated";
  ageAppropriateness: "Appropriate" | "Caution (65+)" | "High Risk (Beers Criteria)";
  durationAppropriateness: "Appropriate" | "Caution (Prolonged)" | "Exceeds Recommended Window";
  whyAmISeeingThis: {
    mechanism: string;
    affectedSystems: string[];
    clinicalPrecaution: string;
  };
  saferOptions: SaferAlternativeOption[];
}

export interface PatientUploadedFile {
  id: string;
  name: string;
  type: "image" | "pdf";
  size: string;
  uploadDate: string;
  url?: string;
  category?: "prescription" | "report";
}

export interface PatientChatMessage {
  id: string;
  sender: "doctor" | "patient";
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ConsultationPatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  patientId: string;
  primaryCondition: string;
  vitals: ConsultationPatientVitals;
  previousConsultation?: PreviousConsultationInfo;
  appointment?: CurrentAppointmentInfo;
  defaultMedications: ConsultationMedication[];
  uploadedPrescriptions?: PatientUploadedFile[];
  uploadedReports?: PatientUploadedFile[];
  chatMessages?: PatientChatMessage[];
  patientIntakeNote?: string;
}
