export interface DoctorSummaryMetrics {
  todayAppointmentsCount: number;
  patientsToReviewCount: number;
  missedMedicinesCount: number;
  newConsultationsCount: number;
}

export type AppointmentStatus = "Confirmed" | "Upcoming" | "Completed" | "Cancelled";
export type AppointmentCategory = "TODAY" | "UPCOMING" | "COMPLETED";

export interface DoctorAppointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName?: string;
  date: string;
  time: string;
  type: string;
  duration: string;
  status: AppointmentStatus;
  category: AppointmentCategory;
  room?: string;
  consultationId?: string;
}

export interface PatientAttentionItem {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  reasonType: "new_consultation" | "missed_medicine" | "report_update";
  reasonText: string;
  badgeLabel: string;
  timestamp: string;
  severity: "high" | "medium";
}

export interface DoctorPatientDirectoryItem {
  id: string;
  name: string;
  age: number;
  gender: string;
  primaryCondition: string;
  riskLevel: "HIGH" | "MODERATE" | "LOW";
  activeMedsCount: number;
  attentionNeeded: boolean;
  attentionReason?: string;
  lastVisit: string;
  nextAppointment?: string;
  medications?: string[];
  primaryMedicine?: string;
}

export interface ClinicMedicationTrackerItem {
  id: string;
  patientName: string;
  patientId: string;
  medicineName: string;
  dose: string;
  schedule: string;
  adherenceStatus: "Taken" | "Missed" | "Upcoming";
  missedCount?: number;
  indication: string;
  safetyFlag?: string;
}

export type ConsultationStatus = "New" | "Under Review" | "Reviewed";

export interface DoctorPrescriptionRecord {
  prescription_id: string;
  consultation_id: string;
  patient_id: string;
  doctor_id: string;
  doctor_name: string;
  file_name: string;
  file_type: string;
  file_location: string;
  file_data: string; // Base64 data URI for direct view, print, save
  file_size?: string;
  uploaded_at: string;
  status: "Delivered";
}

export interface DoctorConsultationItem {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  mainSymptom: string;
  chiefComplaint?: string;
  symptoms: string;
  duration: string;
  severity: string;
  associatedSymptoms: string;
  currentMedicines: string;
  relevantInfo: string;
  preliminarySummary: string;
  status: ConsultationStatus;
  reportName?: string;
  doctorResponse?: string;
  doctorResponseDate?: string;
  reviewedDate?: string;
  prescription?: DoctorPrescriptionRecord;
  prescriptions?: DoctorPrescriptionRecord[];
}

export interface DoctorMedicalReportItem {
  id: string;
  patientName: string;
  patientId: string;
  reportName: string;
  date: string;
  facility: string;
  type: string;
  keyFinding: string;
  status: "Normal" | "Flagged Review" | "Reviewed";
  summary?: string;
  extractedValues?: { label: string; value: string }[];
  fileSize?: string;
}

export const DOCTOR_SUMMARY_METRICS: DoctorSummaryMetrics = {
  todayAppointmentsCount: 6,
  patientsToReviewCount: 4,
  missedMedicinesCount: 3,
  newConsultationsCount: 2,
};

export const DOCTOR_APPOINTMENTS_LIST: DoctorAppointment[] = [
  // TODAY
  {
    id: "apt-1",
    patientId: "pat-1",
    patientName: "Raj Kumar",
    doctorName: "Dr. Sharma, MD",
    date: "27 Sep 2026",
    time: "10:15 AM",
    type: "Medication Regimen Audit",
    duration: "45 mins",
    status: "Confirmed",
    category: "TODAY",
    room: "Room 3A",
    consultationId: "con-2",
  },
  {
    id: "apt-2",
    patientId: "pat-2",
    patientName: "Priya Sharma",
    doctorName: "Dr. Sharma, MD",
    date: "27 Sep 2026",
    time: "11:30 AM",
    type: "Endocrine & Glycemic Follow-up",
    duration: "30 mins",
    status: "Upcoming",
    category: "TODAY",
    room: "Virtual 1",
    consultationId: "con-1",
  },
  {
    id: "apt-3",
    patientId: "pat-3",
    patientName: "Rahul Kumar",
    doctorName: "Dr. Sharma, MD",
    date: "27 Sep 2026",
    time: "09:00 AM",
    type: "Cardio Preventive Checkup",
    duration: "30 mins",
    status: "Completed",
    category: "TODAY",
    room: "Room 3A",
    consultationId: "con-4",
  },
  {
    id: "apt-4",
    patientId: "pat-4",
    patientName: "Amit Patel",
    doctorName: "Dr. Sharma, MD",
    date: "27 Sep 2026",
    time: "02:00 PM",
    type: "Lab Results Review",
    duration: "30 mins",
    status: "Confirmed",
    category: "TODAY",
    room: "Room 3A",
  },
  {
    id: "apt-5",
    patientId: "pat-5",
    patientName: "Sunita Verma",
    doctorName: "Dr. Sharma, MD",
    date: "27 Sep 2026",
    time: "03:30 PM",
    type: "Blood Pressure Check",
    duration: "15 mins",
    status: "Upcoming",
    category: "TODAY",
    room: "Room 3A",
  },
  {
    id: "apt-6",
    patientId: "pat-6",
    patientName: "Vikram Rao",
    doctorName: "Dr. Sharma, MD",
    date: "27 Sep 2026",
    time: "04:45 PM",
    type: "Prescription Refill Review",
    duration: "20 mins",
    status: "Upcoming",
    category: "TODAY",
    room: "Virtual 2",
  },

  // UPCOMING
  {
    id: "apt-7",
    patientId: "pat-4",
    patientName: "Anita Desai",
    doctorName: "Dr. Sharma, MD",
    date: "29 Sep 2026",
    time: "02:00 PM",
    type: "Renal Function & Joint Follow-up",
    duration: "30 mins",
    status: "Confirmed",
    category: "UPCOMING",
    room: "Room 3A",
    consultationId: "con-3",
  },
  {
    id: "apt-8",
    patientId: "pat-5",
    patientName: "Sunita Verma",
    doctorName: "Dr. Sharma, MD",
    date: "30 Sep 2026",
    time: "11:00 AM",
    type: "Hypertension Maintenance Audit",
    duration: "20 mins",
    status: "Upcoming",
    category: "UPCOMING",
    room: "Room 3A",
  },
  {
    id: "apt-9",
    patientId: "pat-6",
    patientName: "Vikram Rao",
    doctorName: "Dr. Sharma, MD",
    date: "02 Oct 2026",
    time: "04:30 PM",
    type: "Antihypertensive Adjustment Review",
    duration: "25 mins",
    status: "Upcoming",
    category: "UPCOMING",
    room: "Virtual 1",
  },
  {
    id: "apt-10",
    patientId: "pat-2",
    patientName: "Priya Sharma",
    doctorName: "Dr. Sharma, MD",
    date: "05 Oct 2026",
    time: "10:00 AM",
    type: "Diabetic Neuropathy Progress Check",
    duration: "30 mins",
    status: "Upcoming",
    category: "UPCOMING",
    room: "Room 3A",
  },

  // COMPLETED
  {
    id: "apt-11",
    patientId: "pat-1",
    patientName: "Raj Kumar",
    doctorName: "Dr. Sharma, MD",
    date: "18 Sep 2026",
    time: "10:00 AM",
    type: "Routine Anticoagulation Review",
    duration: "30 mins",
    status: "Completed",
    category: "COMPLETED",
    room: "Room 3A",
  },
  {
    id: "apt-12",
    patientId: "pat-2",
    patientName: "Priya Sharma",
    doctorName: "Dr. Sharma, MD",
    date: "10 Sep 2026",
    time: "11:30 AM",
    type: "Glycemic Baseline Assessment",
    duration: "30 mins",
    status: "Completed",
    category: "COMPLETED",
    room: "Room 3A",
  },
  {
    id: "apt-13",
    patientId: "pat-4",
    patientName: "Anita Desai",
    doctorName: "Dr. Sharma, MD",
    date: "02 Sep 2026",
    time: "03:00 PM",
    type: "Metabolic Panel Review",
    duration: "30 mins",
    status: "Completed",
    category: "COMPLETED",
    room: "Room 3A",
  },
  {
    id: "apt-14",
    patientId: "pat-3",
    patientName: "Rahul Kumar",
    doctorName: "Dr. Sharma, MD",
    date: "14 Aug 2026",
    time: "09:30 AM",
    type: "Cardiopulmonary Assessment",
    duration: "30 mins",
    status: "Completed",
    category: "COMPLETED",
    room: "Room 3A",
  },
  {
    id: "apt-15",
    patientId: "pat-5",
    patientName: "Sunita Verma",
    doctorName: "Dr. Sharma, MD",
    date: "10 Aug 2026",
    time: "11:00 AM",
    type: "Hypertension Routine Audit",
    duration: "25 mins",
    status: "Completed",
    category: "COMPLETED",
    room: "Room 3A",
  },
  {
    id: "apt-16",
    patientId: "pat-6",
    patientName: "Vikram Rao",
    doctorName: "Dr. Sharma, MD",
    date: "05 Aug 2026",
    time: "04:00 PM",
    type: "Lipid Maintenance Check",
    duration: "20 mins",
    status: "Completed",
    category: "COMPLETED",
    room: "Virtual 1",
  },
];

export const TODAY_APPOINTMENTS = DOCTOR_APPOINTMENTS_LIST.filter(
  (a) => a.category === "TODAY"
);

export const APPOINTMENTS_STORAGE_KEY = "medguard_appointments";

export function getStoredAppointments(): DoctorAppointment[] {
  if (typeof window === "undefined") {
    return DOCTOR_APPOINTMENTS_LIST;
  }
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(DOCTOR_APPOINTMENTS_LIST));
      return DOCTOR_APPOINTMENTS_LIST;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(DOCTOR_APPOINTMENTS_LIST));
      return DOCTOR_APPOINTMENTS_LIST;
    }
    return parsed;
  } catch (e) {
    return DOCTOR_APPOINTMENTS_LIST;
  }
}

export function updateAppointmentStatus(
  id: string,
  newStatus: AppointmentStatus
): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredAppointments();
    const index = current.findIndex((a) => a.id === id);
    if (index >= 0) {
      const updated = [...current];
      const prevCat = updated[index].category;
      let newCategory: AppointmentCategory = prevCat;
      if (newStatus === "Completed") newCategory = "COMPLETED";
      updated[index] = {
        ...updated[index],
        status: newStatus,
        category: newCategory,
      };
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("medguard_appointments_updated"));
    }
  } catch (e) {
    console.error("Failed to update appointment status", e);
  }
}

export function getPatientUpcomingAppointment(patientId: string): DoctorAppointment | null {
  const all = getStoredAppointments();
  return (
    all.find(
      (a) =>
        a.patientId === patientId &&
        (a.status === "Confirmed" || a.status === "Upcoming") &&
        (a.category === "TODAY" || a.category === "UPCOMING")
    ) || null
  );
}

export const PATIENTS_REQUIRING_ATTENTION: PatientAttentionItem[] = [
  {
    id: "att-1",
    patientId: "pat-2",
    patientName: "Priya Sharma",
    age: 64,
    reasonType: "missed_medicine",
    reasonText: "Missed 2 scheduled medicines",
    badgeLabel: "Missed Medication",
    timestamp: "Today at 08:30 AM",
    severity: "high",
  },
  {
    id: "att-2",
    patientId: "pat-1",
    patientName: "Raj Kumar",
    age: 68,
    reasonType: "new_consultation",
    reasonText: "New symptom intake submitted: Feeling tired and dizzy",
    badgeLabel: "New Consultation",
    timestamp: "Today at 08:15 AM",
    severity: "medium",
  },
  {
    id: "att-3",
    patientId: "pat-4",
    patientName: "Anita Desai",
    age: 72,
    reasonType: "report_update",
    reasonText: "eGFR decreased to 42 mL/min on latest metabolic panel",
    badgeLabel: "Important Report Update",
    timestamp: "Yesterday, 04:50 PM",
    severity: "high",
  },
  {
    id: "att-4",
    patientId: "pat-6",
    patientName: "Vikram Rao",
    age: 59,
    reasonType: "missed_medicine",
    reasonText: "Missed morning antihypertensive dose",
    badgeLabel: "Missed Medication",
    timestamp: "Today at 07:45 AM",
    severity: "medium",
  },
];

export const DOCTOR_PATIENT_DIRECTORY: DoctorPatientDirectoryItem[] = [
  {
    id: "pat-1",
    name: "Raj Kumar",
    age: 68,
    gender: "Male",
    primaryCondition: "Atrial Fibrillation, Hypertension",
    riskLevel: "HIGH",
    activeMedsCount: 3,
    attentionNeeded: true,
    attentionReason: "New symptom intake submitted",
    lastVisit: "Sep 18, 2026",
    nextAppointment: "Today, 10:15 AM",
    medications: ["Warfarin 5mg", "Metoprolol 50mg", "Lisinopril 10mg"],
    primaryMedicine: "Warfarin 5mg",
  },
  {
    id: "pat-2",
    name: "Priya Sharma",
    age: 64,
    gender: "Female",
    primaryCondition: "Type 2 Diabetes, Neuropathy",
    riskLevel: "HIGH",
    activeMedsCount: 5,
    attentionNeeded: true,
    attentionReason: "Missed 2 scheduled medicines",
    lastVisit: "Sep 10, 2026",
    nextAppointment: "Today, 11:30 AM",
    medications: ["Metformin 1000mg", "Glipizide 5mg", "Gabapentin 300mg", "Atorvastatin 20mg", "Lisinopril 20mg"],
    primaryMedicine: "Metformin 1000mg",
  },
  {
    id: "pat-3",
    name: "Rahul Kumar",
    age: 45,
    gender: "Male",
    primaryCondition: "General Health, Mild Dyslipidemia",
    riskLevel: "LOW",
    activeMedsCount: 1,
    attentionNeeded: false,
    lastVisit: "Aug 12, 2026",
    nextAppointment: "Today, 09:00 AM",
    medications: ["Atorvastatin 10mg"],
    primaryMedicine: "Atorvastatin 10mg",
  },
  {
    id: "pat-4",
    name: "Anita Desai",
    age: 72,
    gender: "Female",
    primaryCondition: "Chronic Kidney Disease Stage 3, Osteoarthritis",
    riskLevel: "HIGH",
    activeMedsCount: 4,
    attentionNeeded: true,
    attentionReason: "eGFR decline on metabolic panel",
    lastVisit: "Sep 02, 2026",
    nextAppointment: "Sep 29, 2026",
    medications: ["Acetaminophen 500mg", "Amlodipine 5mg", "Calcitriol 0.25mcg", "Sodium Bicarbonate 650mg"],
    primaryMedicine: "Acetaminophen 500mg",
  },
  {
    id: "pat-5",
    name: "Sunita Verma",
    age: 58,
    gender: "Female",
    primaryCondition: "Essential Hypertension",
    riskLevel: "MODERATE",
    activeMedsCount: 2,
    attentionNeeded: false,
    lastVisit: "Aug 20, 2026",
    nextAppointment: "Today, 03:30 PM",
    medications: ["Telmisartan 40mg", "Hydrochlorothiazide 12.5mg"],
    primaryMedicine: "Telmisartan 40mg",
  },
  {
    id: "pat-6",
    name: "Vikram Rao",
    age: 59,
    gender: "Male",
    primaryCondition: "CAD Post-PCI, Hypercholesterolemia",
    riskLevel: "MODERATE",
    activeMedsCount: 4,
    attentionNeeded: true,
    attentionReason: "Missed morning antihypertensive",
    lastVisit: "Aug 28, 2026",
    nextAppointment: "Today, 04:45 PM",
    medications: ["Aspirin 81mg", "Clopidogrel 75mg", "Rosuvastatin 20mg"],
    primaryMedicine: "Aspirin 81mg",
  },
];

export const CLINIC_MEDICINE_TRACKER: ClinicMedicationTrackerItem[] = [
  {
    id: "med-1",
    patientName: "Priya Sharma",
    patientId: "pat-2",
    medicineName: "Metformin ER",
    dose: "500 mg",
    schedule: "08:00 AM (Morning)",
    adherenceStatus: "Missed",
    missedCount: 2,
    indication: "Type 2 Diabetes",
    safetyFlag: "Hypoglycemia risk if missed repeatedly",
  },
  {
    id: "med-2",
    patientName: "Raj Kumar",
    patientId: "pat-1",
    medicineName: "Warfarin Sodium",
    dose: "4 mg",
    schedule: "08:00 AM (Morning)",
    adherenceStatus: "Taken",
    indication: "Atrial Fibrillation Anticoagulation",
    safetyFlag: "Avoid NSAIDs / Ibuprofen",
  },
  {
    id: "med-3",
    patientName: "Raj Kumar",
    patientId: "pat-1",
    medicineName: "Lisinopril",
    dose: "10 mg",
    schedule: "08:00 PM (Evening)",
    adherenceStatus: "Upcoming",
    indication: "Hypertension Control",
  },
  {
    id: "med-4",
    patientName: "Vikram Rao",
    patientId: "pat-6",
    medicineName: "Amlodipine Besylate",
    dose: "5 mg",
    schedule: "08:00 AM (Morning)",
    adherenceStatus: "Missed",
    missedCount: 1,
    indication: "Blood Pressure Regulation",
  },
  {
    id: "med-5",
    patientName: "Anita Desai",
    patientId: "pat-4",
    medicineName: "Torsemide",
    dose: "10 mg",
    schedule: "09:00 AM (Morning)",
    adherenceStatus: "Taken",
    indication: "Fluid Retention / CKD",
  },
];

export const DOCTOR_CONSULTATIONS_LIST: DoctorConsultationItem[] = [
  {
    id: "con-1",
    patientName: "Priya Sharma",
    patientId: "pat-2",
    date: "27 Sep 2026",
    mainSymptom: "Headache + dizziness",
    chiefComplaint: "Headache + dizziness",
    status: "New",
    symptoms: "Recurring frontal headaches and lightheadedness when standing up quickly.",
    duration: "4 days",
    severity: "Moderate (slows down daily routine)",
    associatedSymptoms: "Mild nausea and sensitivity to bright lighting",
    currentMedicines: "Metformin ER 500 mg, Glipizide 5 mg, Atorvastatin 20 mg",
    relevantInfo: "Type 2 Diabetes, Diabetic Neuropathy; missed 2 scheduled doses today; BP 134/84 mmHg.",
    preliminarySummary: "Patient reported 4-day history of lightheadedness and tension headaches. Noted missing 2 doses of diabetic regimen. Denies loss of consciousness or speech difficulty.",
    reportName: "Consultation_Summary_Sep27_Priya.pdf",
  },
  {
    id: "con-2",
    patientName: "Raj Kumar",
    patientId: "pat-1",
    date: "27 Sep 2026",
    mainSymptom: "Fatigue and dizziness",
    chiefComplaint: "Fatigue and dizziness",
    status: "New",
    symptoms: "Feeling tired and dizzy, started 2 days ago, mostly after standing up.",
    duration: "2 days",
    severity: "Moderate",
    associatedSymptoms: "Occasional dry mouth, mild heaviness in legs",
    currentMedicines: "Blood Pressure Medicine (Lisinopril 10 mg), Warfarin Sodium 4 mg",
    relevantInfo: "Atrial Fibrillation, Hypertension. Standard anticoagulation monitoring. Latest INR 2.4.",
    preliminarySummary: "Preliminary symptom intake from patient portal. 2-day duration of dizziness upon standing. Vitals stable; patient concerned about blood pressure tablet interaction.",
    reportName: "Consultation_Summary_Sep27_Raj.pdf",
  },
  {
    id: "con-3",
    patientName: "Anita Desai",
    patientId: "pat-4",
    date: "25 Sep 2026",
    mainSymptom: "Bilateral knee joint stiffness",
    chiefComplaint: "Bilateral knee joint stiffness",
    status: "Under Review",
    symptoms: "Bilateral knee stiffness, aggravated by morning movement.",
    duration: "3 weeks",
    severity: "Mild",
    associatedSymptoms: "Morning joint tightness lasting 20-30 minutes, crepitus on stairs",
    currentMedicines: "Torsemide 10 mg, Acetaminophen 500 mg as needed",
    relevantInfo: "Chronic Kidney Disease Stage 3 (eGFR 42 mL/min). Strictly avoid NSAIDs (Ibuprofen / Naproxen).",
    preliminarySummary: "Chronic knee osteoarthritis follow-up. Patient inquiring about pain relief options while protecting kidney function.",
    reportName: "Arthritis_Followup_Sep25.pdf",
    doctorResponse: "Avoid NSAIDs due to current eGFR 42 mL/min. Continue Acetaminophen 500mg as needed; scheduled for physical therapy review on Sep 29.",
    doctorResponseDate: "26 Sep 2026",
  },
  {
    id: "con-4",
    patientName: "Rahul Kumar",
    patientId: "pat-3",
    date: "22 Sep 2026",
    mainSymptom: "Exertional shortness of breath",
    chiefComplaint: "Exertional shortness of breath",
    status: "Reviewed",
    symptoms: "Mild breathlessness when climbing more than two flights of stairs.",
    duration: "1 week",
    severity: "Mild",
    associatedSymptoms: "None reported. No chest tightness or leg edema.",
    currentMedicines: "Atorvastatin 10 mg",
    relevantInfo: "General health maintenance; no prior cardiovascular disease.",
    preliminarySummary: "Mild exertional dyspnea without chest pain or orthopnea. Recent preventive CBC and metabolic labs normal.",
    reportName: "Preventive_Cardio_Sep22.pdf",
    doctorResponse: "Normal resting ECG and metabolic panel reviewed. Recommended gradual aerobic endurance conditioning and follow-up in 3 months.",
    doctorResponseDate: "23 Sep 2026",
    reviewedDate: "23 Sep 2026",
  },
];

export const CONSULTATIONS_STORAGE_KEY = "medguard_consultations";

export function getStoredConsultations(): DoctorConsultationItem[] {
  if (typeof window === "undefined") {
    return DOCTOR_CONSULTATIONS_LIST;
  }
  try {
    const raw = localStorage.getItem(CONSULTATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CONSULTATIONS_STORAGE_KEY, JSON.stringify(DOCTOR_CONSULTATIONS_LIST));
      return DOCTOR_CONSULTATIONS_LIST;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(CONSULTATIONS_STORAGE_KEY, JSON.stringify(DOCTOR_CONSULTATIONS_LIST));
      return DOCTOR_CONSULTATIONS_LIST;
    }
    return parsed;
  } catch (e) {
    return DOCTOR_CONSULTATIONS_LIST;
  }
}

export function saveOrUpdateConsultation(item: DoctorConsultationItem): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredConsultations();
    const existingIndex = current.findIndex((c) => c.id === item.id);
    let updated: DoctorConsultationItem[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], ...item };
    } else {
      updated = [item, ...current];
    }
    localStorage.setItem(CONSULTATIONS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("medguard_consultations_updated"));
  } catch (e) {
    console.error("Failed to save consultation", e);
  }
}

export function updateDoctorConsultationResponse(
  consultationId: string,
  doctorResponse: string,
  newStatus?: ConsultationStatus,
  prescription?: DoctorPrescriptionRecord
): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredConsultations();
    const index = current.findIndex((c) => c.id === consultationId);
    if (index >= 0) {
      const updated = [...current];
      const todayFormatted = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const existingPrescriptions = updated[index].prescriptions || (updated[index].prescription ? [updated[index].prescription] : []);
      const newPrescriptionsList = prescription
        ? [prescription, ...existingPrescriptions.filter(p => p.prescription_id !== prescription.prescription_id)]
        : existingPrescriptions;

      updated[index] = {
        ...updated[index],
        doctorResponse,
        doctorResponseDate: todayFormatted,
        status: newStatus || updated[index].status || "Under Review",
        reviewedDate: newStatus === "Reviewed" ? todayFormatted : updated[index].reviewedDate,
        prescription: prescription || updated[index].prescription,
        prescriptions: newPrescriptionsList,
      };
      localStorage.setItem(CONSULTATIONS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("medguard_consultations_updated"));
    }
  } catch (e) {
    console.error("Failed to update consultation response", e);
  }
}

export function sendDoctorConsultationResponse(
  consultationId: string,
  doctorResponse?: string,
  prescription?: DoctorPrescriptionRecord,
  newStatus?: ConsultationStatus
): DoctorConsultationItem | null {
  if (typeof window === "undefined") return null;
  try {
    const current = getStoredConsultations();
    const index = current.findIndex((c) => c.id === consultationId);
    if (index >= 0) {
      const updated = [...current];
      const todayFormatted = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const existingPrescriptions = updated[index].prescriptions || (updated[index].prescription ? [updated[index].prescription] : []);
      const newPrescriptionsList = prescription
        ? [prescription, ...existingPrescriptions.filter(p => p.prescription_id !== prescription.prescription_id)]
        : existingPrescriptions;

      updated[index] = {
        ...updated[index],
        doctorResponse: doctorResponse !== undefined ? doctorResponse : updated[index].doctorResponse,
        doctorResponseDate: todayFormatted,
        status: newStatus || (updated[index].status === "New" ? "Under Review" : updated[index].status),
        reviewedDate: newStatus === "Reviewed" ? todayFormatted : updated[index].reviewedDate,
        prescription: prescription || updated[index].prescription,
        prescriptions: newPrescriptionsList,
      };

      localStorage.setItem(CONSULTATIONS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("medguard_consultations_updated"));
      return updated[index];
    }
  } catch (e) {
    console.error("Failed to send consultation response and prescription", e);
  }
  return null;
}

export function setConsultationStatus(
  consultationId: string,
  newStatus: ConsultationStatus
): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredConsultations();
    const index = current.findIndex((c) => c.id === consultationId);
    if (index >= 0) {
      const updated = [...current];
      const todayFormatted = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      updated[index] = {
        ...updated[index],
        status: newStatus,
        reviewedDate: newStatus === "Reviewed" ? todayFormatted : updated[index].reviewedDate,
      };
      localStorage.setItem(CONSULTATIONS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("medguard_consultations_updated"));
    }
  } catch (e) {
    console.error("Failed to set consultation status", e);
  }
}

export const DOCTOR_MEDICAL_REPORTS: DoctorMedicalReportItem[] = [
  {
    id: "rep-1",
    patientName: "Raj Kumar",
    patientId: "pat-1",
    reportName: "Comprehensive_Metabolic_CBC_Panel.pdf",
    date: "Sep 18, 2026",
    facility: "Dr. Sharma Geriatric Care Clinic",
    type: "Blood Test / Lab",
    keyFinding: "Blood Pressure 120/80 mmHg, Haemoglobin 13.2 g/dL, Blood Count Normal, Fasting Glucose 98 mg/dL, eGFR 58 mL/min.",
    status: "Normal",
    summary: "Routine quarterly geriatric metabolic panel and complete blood count.",
    fileSize: "2.4 MB",
    extractedValues: [
      { label: "Blood Pressure", value: "120/80 mmHg" },
      { label: "Haemoglobin", value: "13.2 g/dL" },
      { label: "Blood Count", value: "Normal" },
      { label: "Fasting Glucose", value: "98 mg/dL" },
      { label: "Kidney eGFR", value: "58 mL/min" },
    ],
  },
  {
    id: "rep-2",
    patientName: "Raj Kumar",
    patientId: "pat-1",
    reportName: "Coagulation_INR_Panel.pdf",
    date: "Aug 24, 2026",
    facility: "Heart & Vascular Health Center",
    type: "Cardiology Review",
    keyFinding: "INR 2.4 (Optimal therapeutic window 2.0-3.0). Platelets Normal.",
    status: "Normal",
    summary: "International Normalized Ratio (INR) monitoring for anticoagulation therapy.",
    fileSize: "1.1 MB",
    extractedValues: [
      { label: "INR Ratio", value: "2.4 (Target 2.0-3.0)" },
      { label: "Platelets", value: "Normal" },
    ],
  },
  {
    id: "rep-3",
    patientName: "Priya Sharma",
    patientId: "pat-2",
    reportName: "HbA1c_Glycemic_Control.pdf",
    date: "Sep 15, 2026",
    facility: "Metabolic Diagnostic Lab",
    type: "Glycemic Lab",
    keyFinding: "HbA1c 7.6% (Target < 7.0%). Fasting blood glucose 154 mg/dL.",
    status: "Flagged Review",
    summary: "Evaluation of type 2 diabetes glycemic control and medication adherence check.",
    fileSize: "1.8 MB",
    extractedValues: [
      { label: "HbA1c", value: "7.6% (Elevated)" },
      { label: "Fasting Blood Glucose", value: "154 mg/dL" },
    ],
  },
  {
    id: "rep-4",
    patientName: "Rahul Kumar",
    patientId: "pat-3",
    reportName: "Annual_Preventive_CBC.pdf",
    date: "Aug 12, 2026",
    facility: "Metro City Clinical Lab",
    type: "CBC & Vitals",
    keyFinding: "All hematologic parameters within normal reference ranges.",
    status: "Normal",
    summary: "Annual preventive health assessment and complete blood count panel.",
    fileSize: "1.5 MB",
    extractedValues: [
      { label: "Haemoglobin", value: "14.5 g/dL" },
      { label: "Blood Count", value: "Normal" },
      { label: "White Blood Cells", value: "6.8 x10^3/uL" },
    ],
  },
  {
    id: "rep-5",
    patientName: "Anita Desai",
    patientId: "pat-4",
    reportName: "Comprehensive_Metabolic_Panel.pdf",
    date: "Sep 26, 2026",
    facility: "Dr. Sharma Geriatric Care Clinic",
    type: "Metabolic Panel",
    keyFinding: "Blood Pressure 142/88 mmHg, eGFR 42 mL/min (Down from 52 mL/min). Creatinine 1.6 mg/dL.",
    status: "Flagged Review",
    summary: "Renal monitoring panel indicating progressive decline in glomerular filtration rate.",
    fileSize: "2.1 MB",
    extractedValues: [
      { label: "Blood Pressure", value: "142/88 mmHg" },
      { label: "Kidney eGFR", value: "42 mL/min (Reduced)" },
      { label: "Serum Creatinine", value: "1.6 mg/dL" },
      { label: "Serum Potassium", value: "4.8 mEq/L" },
    ],
  },
  {
    id: "rep-6",
    patientName: "Sunita Verma",
    patientId: "pat-5",
    reportName: "Hypertension_Renal_Workup.pdf",
    date: "Sep 14, 2026",
    facility: "City Cardiology Associates",
    type: "Renal & Vitals",
    keyFinding: "Blood pressure 138/84 mmHg. Electrolytes stable.",
    status: "Normal",
    summary: "Renal electrolytes and hemodynamic check for antihypertensive maintenance.",
    fileSize: "1.3 MB",
    extractedValues: [
      { label: "Blood Pressure", value: "138/84 mmHg" },
      { label: "Serum Sodium", value: "140 mEq/L" },
      { label: "Serum Potassium", value: "4.2 mEq/L" },
    ],
  },
  {
    id: "rep-7",
    patientName: "Vikram Rao",
    patientId: "pat-6",
    reportName: "Cardiovascular_Lipid_Profile.pdf",
    date: "Sep 20, 2026",
    facility: "Vascular Diagnostic Center",
    type: "Lipid Profile",
    keyFinding: "Blood pressure 126/80 mmHg. Total cholesterol 210 mg/dL, LDL 132 mg/dL.",
    status: "Normal",
    summary: "Lipid fraction review following statin dose optimization.",
    fileSize: "1.7 MB",
    extractedValues: [
      { label: "Blood Pressure", value: "126/80 mmHg" },
      { label: "Total Cholesterol", value: "210 mg/dL" },
      { label: "LDL Cholesterol", value: "132 mg/dL" },
      { label: "HDL Cholesterol", value: "48 mg/dL" },
    ],
  },
];

export interface ExtractedVitalsResult {
  bloodPressure: string;
  bloodCount: string;
  haemoglobin: string;
  additionalMetrics: { label: string; value: string }[];
  hasReport: boolean;
  latestReport: DoctorMedicalReportItem | null;
}

export function getReportsForPatient(patientId: string): DoctorMedicalReportItem[] {
  if (patientId === "pat-1" && typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("medguard_patient_reports");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            id: item.id || `rep-${Date.now()}`,
            patientName: "Raj Kumar",
            patientId: "pat-1",
            reportName: item.name,
            date: item.uploadDate,
            facility: "Patient Submitted Portal Upload",
            type: item.type,
            keyFinding: item.summary || "Submitted via Patient Portal",
            status: "Normal" as const,
            summary: item.summary,
            fileSize: item.fileSize || "1.8 MB",
            extractedValues: item.extractedValues || [],
          }));
        }
      }
    } catch (e) {}
  }

  const reports = DOCTOR_MEDICAL_REPORTS.filter((r) => r.patientId === patientId);
  return reports.length > 0 ? reports : [DOCTOR_MEDICAL_REPORTS[0]];
}

export function getExtractedVitalsForPatient(patientId: string): ExtractedVitalsResult {
  const reports = getReportsForPatient(patientId);
  if (!reports || reports.length === 0) {
    return {
      bloodPressure: "Not available",
      bloodCount: "Not available",
      haemoglobin: "Not available",
      additionalMetrics: [],
      hasReport: false,
      latestReport: null,
    };
  }

  const latest = reports[0];
  const values = latest.extractedValues || [];

  const findMetric = (keywords: string[]): string => {
    const match = values.find((item) =>
      keywords.some((k) => item.label.toLowerCase().includes(k))
    );
    return match && match.value.trim() ? match.value : "Not available";
  };

  const bp = findMetric(["blood pressure", "bp"]);
  const haemo = findMetric(["haemoglobin", "hemoglobin", "hgb"]);
  const bc = findMetric(["blood count", "cbc", "white blood", "wbc"]);

  const primaryKeys = ["blood pressure", "bp", "haemoglobin", "hemoglobin", "hgb", "blood count", "cbc", "wbc"];
  const additional = values.filter(
    (item) => !primaryKeys.some((k) => item.label.toLowerCase().includes(k))
  );

  return {
    bloodPressure: bp,
    bloodCount: bc,
    haemoglobin: haemo,
    additionalMetrics: additional,
    hasReport: true,
    latestReport: latest,
  };
}

export type MedicineStatus = "✓ Taken" | "⚠ Missed" | "— Skipped" | "○ Upcoming" | string;

export interface PatientCurrentMedicine {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  scheduledTime: string;
  status: MedicineStatus;
  statusType: "taken" | "missed" | "skipped" | "upcoming";
  actionTime?: string;
  instructions?: string;
}

export interface MedicationHistoryItem {
  id: string;
  timelineLabel: string; // e.g. "Today", "Yesterday", "2 days ago", "3 days ago"
  medicineName: string;
  dose: string;
  status: "Taken" | "Missed" | "Skipped";
  statusSymbol: "✓" | "⚠" | "—";
}

export interface PatientWorkspaceData {
  patient: DoctorPatientDirectoryItem;
  adherencePercentage: number;
  adherenceLabel: string;
  currentMedicines: PatientCurrentMedicine[];
  history: MedicationHistoryItem[];
  vitals: {
    bloodPressure: string;
    heartRate: string;
    haemoglobin: string;
    bloodCount: string;
    eGFR: string;
  };
  recentClinicalNote: string;
}

export const PATIENT_WORKSPACE_STORE: Record<string, PatientWorkspaceData> = {
  "pat-1": {
    patient: {
      id: "pat-1",
      name: "Raj Kumar",
      age: 68,
      gender: "Male",
      primaryCondition: "Atrial Fibrillation, Hypertension",
      riskLevel: "HIGH",
      activeMedsCount: 3,
      attentionNeeded: true,
      attentionReason: "New symptom intake submitted: Feeling tired and dizzy",
      lastVisit: "Sep 18, 2026",
      nextAppointment: "Today, 10:15 AM",
    },
    adherencePercentage: 86,
    adherenceLabel: "Medication adherence: 86%",
    currentMedicines: [
      {
        id: "m-1",
        name: "Blood Pressure Medicine (Lisinopril)",
        dose: "10 mg",
        frequency: "Once daily",
        scheduledTime: "08:00 AM",
        status: "✓ Taken",
        statusType: "taken",
      },
      {
        id: "m-2",
        name: "Warfarin Sodium (Blood Thinner)",
        dose: "4 mg",
        frequency: "Once daily",
        scheduledTime: "08:30 AM",
        status: "✓ Taken",
        statusType: "taken",
      },
      {
        id: "m-3",
        name: "Acetaminophen (Joint Pain Relief)",
        dose: "500 mg",
        frequency: "As needed (twice daily)",
        scheduledTime: "01:00 PM",
        status: "— Skipped",
        statusType: "skipped",
      },
      {
        id: "m-4",
        name: "Lisinopril Heart Tablet",
        dose: "10 mg",
        frequency: "Once daily",
        scheduledTime: "08:00 PM",
        status: "○ Upcoming",
        statusType: "upcoming",
      },
    ],
    history: [
      {
        id: "h-1",
        timelineLabel: "Today",
        medicineName: "Blood Pressure Medicine",
        dose: "10 mg",
        status: "Taken",
        statusSymbol: "✓",
      },
      {
        id: "h-2",
        timelineLabel: "Today",
        medicineName: "Warfarin Sodium",
        dose: "4 mg",
        status: "Taken",
        statusSymbol: "✓",
      },
      {
        id: "h-3",
        timelineLabel: "Yesterday",
        medicineName: "Blood Pressure Medicine",
        dose: "10 mg",
        status: "Missed",
        statusSymbol: "⚠",
      },
      {
        id: "h-4",
        timelineLabel: "2 days ago",
        medicineName: "Warfarin Sodium",
        dose: "4 mg",
        status: "Taken",
        statusSymbol: "✓",
      },
      {
        id: "h-5",
        timelineLabel: "3 days ago",
        medicineName: "Blood Pressure Medicine",
        dose: "10 mg",
        status: "Taken",
        statusSymbol: "✓",
      },
    ],
    vitals: {
      bloodPressure: "120/80 mmHg",
      heartRate: "72 bpm",
      haemoglobin: "13.2 g/dL",
      bloodCount: "Normal (6.4 ×10⁹/L)",
      eGFR: "58 mL/min",
    },
    recentClinicalNote:
      "Patient is stable on current Warfarin 4mg regimen. Discontinued candidate NSAID in favor of Acetaminophen 500mg. Reviewing dizziness complaints in today's audit.",
  },
  "pat-2": {
    patient: {
      id: "pat-2",
      name: "Priya Sharma",
      age: 64,
      gender: "Female",
      primaryCondition: "Type 2 Diabetes, Diabetic Neuropathy",
      riskLevel: "HIGH",
      activeMedsCount: 5,
      attentionNeeded: true,
      attentionReason: "Missed 2 scheduled medicines",
      lastVisit: "Sep 10, 2026",
      nextAppointment: "Today, 11:30 AM",
    },
    adherencePercentage: 74,
    adherenceLabel: "Medication adherence: 74%",
    currentMedicines: [
      {
        id: "m-21",
        name: "Metformin ER",
        dose: "500 mg",
        frequency: "Once daily",
        scheduledTime: "08:00 AM",
        status: "⚠ Missed",
        statusType: "missed",
      },
      {
        id: "m-22",
        name: "Glipizide",
        dose: "5 mg",
        frequency: "Twice daily",
        scheduledTime: "01:00 PM",
        status: "⚠ Missed",
        statusType: "missed",
      },
      {
        id: "m-23",
        name: "Atorvastatin",
        dose: "20 mg",
        frequency: "Once daily",
        scheduledTime: "08:00 PM",
        status: "○ Upcoming",
        statusType: "upcoming",
      },
      {
        id: "m-24",
        name: "Pregabalin",
        dose: "75 mg",
        frequency: "Bedtime",
        scheduledTime: "10:00 PM",
        status: "○ Upcoming",
        statusType: "upcoming",
      },
    ],
    history: [
      {
        id: "h-21",
        timelineLabel: "Today",
        medicineName: "Metformin ER",
        dose: "500 mg",
        status: "Missed",
        statusSymbol: "⚠",
      },
      {
        id: "h-22",
        timelineLabel: "Today",
        medicineName: "Glipizide",
        dose: "5 mg",
        status: "Missed",
        statusSymbol: "⚠",
      },
      {
        id: "h-23",
        timelineLabel: "Yesterday",
        medicineName: "Metformin ER",
        dose: "500 mg",
        status: "Taken",
        statusSymbol: "✓",
      },
      {
        id: "h-24",
        timelineLabel: "2 days ago",
        medicineName: "Atorvastatin",
        dose: "20 mg",
        status: "Taken",
        statusSymbol: "✓",
      },
      {
        id: "h-25",
        timelineLabel: "3 days ago",
        medicineName: "Glipizide",
        dose: "5 mg",
        status: "Skipped",
        statusSymbol: "—",
      },
    ],
    vitals: {
      bloodPressure: "134/84 mmHg",
      heartRate: "78 bpm",
      haemoglobin: "12.8 g/dL",
      bloodCount: "Normal",
      eGFR: "68 mL/min",
    },
    recentClinicalNote:
      "HbA1c elevated at 7.6%. Two missed doses noted today. Patient reported mild foot tingling during recent intake.",
  },
};

export function getPatientWorkspace(patientId: string): PatientWorkspaceData {
  if (PATIENT_WORKSPACE_STORE[patientId]) {
    return PATIENT_WORKSPACE_STORE[patientId];
  }

  // Look up patient in persistent storage first, then fallback to built-ins
  const allPatients = getStoredDoctorPatients();
  const found =
    allPatients.find((p) => p.id === patientId) ||
    DOCTOR_PATIENT_DIRECTORY.find((p) => p.id === patientId) ||
    DOCTOR_PATIENT_DIRECTORY[0];

  const medList: PatientCurrentMedicine[] =
    found.medications && found.medications.length > 0
      ? found.medications.map((m, idx) => ({
          id: `med-${patientId}-${idx + 1}`,
          name: m,
          dose: "Standard dose",
          frequency: "Once daily",
          scheduledTime: "08:00 AM",
          status: "○ Upcoming",
          statusType: "upcoming",
        }))
      : found.primaryMedicine
      ? [
          {
            id: `med-${patientId}-1`,
            name: found.primaryMedicine,
            dose: "Standard dose",
            frequency: "Once daily",
            scheduledTime: "08:00 AM",
            status: "○ Upcoming",
            statusType: "upcoming",
          },
        ]
      : [
          {
            id: `med-${patientId}-def`,
            name: "General Health / Maintenance",
            dose: "Standard dose",
            frequency: "Once daily",
            scheduledTime: "08:00 AM",
            status: "○ Upcoming",
            statusType: "upcoming",
          },
        ];

  return {
    patient: found,
    adherencePercentage: 100,
    adherenceLabel: "Medication adherence: 100%",
    currentMedicines: medList,
    history: [
      {
        id: `hf-${patientId}-1`,
        timelineLabel: "Today",
        medicineName: found.primaryMedicine || (found.medications && found.medications[0]) || "Clinical profile registered",
        dose: "Standard",
        status: "Taken",
        statusSymbol: "✓",
      },
    ],
    vitals: {
      bloodPressure: "120/80 mmHg",
      heartRate: "72 bpm",
      haemoglobin: "13.6 g/dL",
      bloodCount: "Normal",
      eGFR: "85 mL/min",
    },
    recentClinicalNote: `Clinical profile for ${found.name}. Active medication regimen tracked.`,
  };
}

export const PATIENT_MEDICINES_STORAGE_KEY = "medguard_patient_medicines";

export function getStoredPatientMedicines(patientId: string): PatientCurrentMedicine[] {
  if (typeof window === "undefined") {
    const ws = PATIENT_WORKSPACE_STORE[patientId];
    return ws ? ws.currentMedicines : getPatientWorkspace(patientId).currentMedicines;
  }
  try {
    const raw = localStorage.getItem(`${PATIENT_MEDICINES_STORAGE_KEY}_${patientId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  const ws = PATIENT_WORKSPACE_STORE[patientId] || getPatientWorkspace(patientId);
  return ws.currentMedicines;
}

export function updateStoredPatientMedicineStatus(
  patientId: string,
  medicineIdOrName: string,
  newStatus: "Taken" | "Skipped" | "Upcoming" | "Missed",
  customActionTime?: string
): void {
  if (typeof window === "undefined") return;
  try {
    const current = [...getStoredPatientMedicines(patientId)];
    const index = current.findIndex(
      (m) =>
        m.id === medicineIdOrName ||
        m.name.toLowerCase() === medicineIdOrName.toLowerCase() ||
        m.name.toLowerCase().includes(medicineIdOrName.toLowerCase()) ||
        medicineIdOrName.toLowerCase().includes(m.name.toLowerCase())
    );

    const nowTimeStr =
      customActionTime ||
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

    if (index >= 0) {
      let statusFormatted: MedicineStatus = "○ Upcoming";
      let statusType: PatientCurrentMedicine["statusType"] = "upcoming";
      let actionTime: string | undefined = undefined;

      if (newStatus === "Taken") {
        statusFormatted = `✓ Taken at ${nowTimeStr}`;
        statusType = "taken";
        actionTime = nowTimeStr;
      } else if (newStatus === "Skipped") {
        statusFormatted = `— Skipped at ${nowTimeStr}`;
        statusType = "skipped";
        actionTime = nowTimeStr;
      } else if (newStatus === "Missed") {
        statusFormatted = "⚠ Missed";
        statusType = "missed";
      }

      current[index] = {
        ...current[index],
        status: statusFormatted,
        statusType,
        actionTime,
      };

      localStorage.setItem(`${PATIENT_MEDICINES_STORAGE_KEY}_${patientId}`, JSON.stringify(current));
      window.dispatchEvent(new Event("medguard_medicines_updated"));
    }
  } catch (e) {
    console.error("Failed to update medicine status", e);
  }
}

export function saveStoredPatientMedicine(patientId: string, medicine: PatientCurrentMedicine): void {
  if (typeof window === "undefined") return;
  try {
    const current = [...getStoredPatientMedicines(patientId)];
    const existingIndex = current.findIndex((m) => m.id === medicine.id);
    if (existingIndex >= 0) {
      current[existingIndex] = medicine;
    } else {
      current.push(medicine);
    }
    localStorage.setItem(`${PATIENT_MEDICINES_STORAGE_KEY}_${patientId}`, JSON.stringify(current));
    window.dispatchEvent(new Event("medguard_medicines_updated"));
  } catch (e) {
    console.error("Failed to save patient medicine", e);
  }
}

export function deleteStoredPatientMedicine(patientId: string, medicineId: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredPatientMedicines(patientId).filter((m) => m.id !== medicineId);
    localStorage.setItem(`${PATIENT_MEDICINES_STORAGE_KEY}_${patientId}`, JSON.stringify(current));
    window.dispatchEvent(new Event("medguard_medicines_updated"));
  } catch (e) {
    console.error("Failed to delete patient medicine", e);
  }
}

export const DOCTOR_PATIENTS_STORAGE_KEY = "medguard_doctor_patients";

export function getStoredDoctorPatients(): DoctorPatientDirectoryItem[] {
  if (typeof window === "undefined") {
    return DOCTOR_PATIENT_DIRECTORY;
  }
  try {
    const raw = localStorage.getItem(DOCTOR_PATIENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with built-in patients so built-ins are always present
        const storedIds = new Set(parsed.map((p: DoctorPatientDirectoryItem) => p.id));
        const missingBuiltins = DOCTOR_PATIENT_DIRECTORY.filter((p) => !storedIds.has(p.id));
        return [...parsed, ...missingBuiltins];
      }
    }
  } catch (e) {
    console.warn("Failed to retrieve stored patients:", e);
  }
  return DOCTOR_PATIENT_DIRECTORY;
}

export function saveNewDoctorPatient(
  newPatient: DoctorPatientDirectoryItem,
  extra?: {
    bloodGroup?: string;
    emergencyContact?: string;
    phone?: string;
    email?: string;
    currentMedications?: string;
    allergies?: string;
    notes?: string;
    vitals?: {
      bloodPressure?: string;
      heartRate?: string;
      haemoglobin?: string;
      bloodCount?: string;
      eGFR?: string;
    };
  }
): void {
  // Update in-memory directory
  const existingIdx = DOCTOR_PATIENT_DIRECTORY.findIndex((p) => p.id === newPatient.id);
  if (existingIdx >= 0) {
    DOCTOR_PATIENT_DIRECTORY[existingIdx] = newPatient;
  } else {
    DOCTOR_PATIENT_DIRECTORY.unshift(newPatient);
  }

  // Update in-memory workspace store
  const parsedMedicines: PatientCurrentMedicine[] = [];
  if (extra?.currentMedications && extra.currentMedications.trim()) {
    const medNames = extra.currentMedications
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    medNames.forEach((medName, idx) => {
      parsedMedicines.push({
        id: `med-${newPatient.id}-${idx + 1}`,
        name: medName,
        dose: "As prescribed",
        frequency: "Once daily",
        scheduledTime: "08:00 AM",
        status: "○ Upcoming",
        statusType: "upcoming",
      });
    });
  }

  PATIENT_WORKSPACE_STORE[newPatient.id] = {
    patient: newPatient,
    adherencePercentage: 100,
    adherenceLabel: "Medication adherence: 100% (New intake)",
    currentMedicines:
      parsedMedicines.length > 0
        ? parsedMedicines
        : [
            {
              id: `med-${newPatient.id}-default`,
              name: "General Health / Maintenance",
              dose: "Standard",
              frequency: "Once daily",
              scheduledTime: "08:00 AM",
              status: "○ Upcoming",
              statusType: "upcoming",
            },
          ],
    history: [
      {
        id: `h-${newPatient.id}-init`,
        timelineLabel: "Today",
        medicineName: "Patient registered in MedGuard Clinical Portal",
        dose: "-",
        status: "Taken",
        statusSymbol: "✓",
      },
    ],
    vitals: {
      bloodPressure: extra?.vitals?.bloodPressure || "120/80 mmHg",
      heartRate: extra?.vitals?.heartRate || "72 bpm",
      haemoglobin: extra?.vitals?.haemoglobin || "13.5 g/dL",
      bloodCount: extra?.vitals?.bloodCount || "Normal",
      eGFR: extra?.vitals?.eGFR || "85 mL/min",
    },
    recentClinicalNote:
      extra?.notes || extra?.allergies
        ? `Intake Notes: ${extra.notes || "None"}. Allergies: ${extra.allergies || "NKDA"}. Emergency Contact: ${extra?.emergencyContact || "N/A"}.`
        : "Newly registered clinical patient profile. Comprehensive baseline evaluation scheduled.",
  };

  // Update localStorage and trigger update event for reactive UI
  if (typeof window !== "undefined") {
    try {
      const stored = getStoredDoctorPatients();
      const sIndex = stored.findIndex((p) => p.id === newPatient.id);
      let updatedList: DoctorPatientDirectoryItem[];
      if (sIndex >= 0) {
        updatedList = [...stored];
        updatedList[sIndex] = newPatient;
      } else {
        updatedList = [newPatient, ...stored];
      }
      localStorage.setItem(DOCTOR_PATIENTS_STORAGE_KEY, JSON.stringify(updatedList));

      if (parsedMedicines.length > 0) {
        localStorage.setItem(
          `${PATIENT_MEDICINES_STORAGE_KEY}_${newPatient.id}`,
          JSON.stringify(parsedMedicines)
        );
      }

      window.dispatchEvent(
        new CustomEvent("medguard_patients_updated", { detail: newPatient })
      );
    } catch (e) {
      console.warn("Failed to persist patient in localStorage:", e);
    }
  }
}


