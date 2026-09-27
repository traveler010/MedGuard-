export type ReminderStatus = "upcoming" | "completed" | "missed";

export interface MedicationReminderItem {
  id: string;
  medicineName: string;
  simpleDescription: string;
  time: string;
  status: ReminderStatus;
  dosage: string;
  pillColor: string;
  scheduledTime: string;
  instructions: string;
  lastUpdated?: string;
  snoozedUntil?: string;
}

export type SafetyAlertLevel = "LOW" | "MODERATE" | "HIGH";

export interface PatientSafetyAlert {
  id: string;
  level: SafetyAlertLevel;
  title: string;
  simpleMessage: string;
  timestamp: string;
  recommendedAction: string;
  isAcknowledged: boolean;
  relatedMedicine?: string;
}

export type NotificationRole = "doctor" | "patient";

export interface AppNotification {
  id: string;
  role: NotificationRole;
  category: 
    // Doctor categories
    | "new_high_risk_review"
    | "patient_med_updated"
    | "consultation_completed"
    // Patient categories
    | "medicine_reminder"
    | "schedule_update"
    | "doctor_instruction";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  severity?: "HIGH" | "MODERATE" | "LOW" | "INFO";
  actionUrl?: string;
  patientName?: string;
}

// 1. Initial Mock Reminders for Patient (Raj Kumar)
export const INITIAL_REMINDERS: MedicationReminderItem[] = [
  {
    id: "rem-1",
    medicineName: "Medicine B (Acetaminophen)",
    simpleDescription: "Knee Joint Pain Relief Tablet",
    time: "01:00 PM",
    scheduledTime: "13:00",
    status: "upcoming",
    dosage: "500 mg (1 white tablet)",
    pillColor: "#059669",
    instructions: "Take with a glass of water after lunch.",
  },
  {
    id: "rem-2",
    medicineName: "Medicine C (Lisinopril)",
    simpleDescription: "Evening Blood Pressure Tablet",
    time: "08:00 PM",
    scheduledTime: "20:00",
    status: "upcoming",
    dosage: "10 mg (1 yellow tablet)",
    pillColor: "#d97706",
    instructions: "Take every evening after dinner.",
  },
  {
    id: "rem-3",
    medicineName: "Medicine A (Warfarin Sodium)",
    simpleDescription: "Morning Blood Thinner Tablet",
    time: "08:00 AM",
    scheduledTime: "08:00",
    status: "completed",
    dosage: "4 mg (1 blue tablet)",
    pillColor: "#0284c7",
    instructions: "Take at 8:00 AM sharp every morning.",
    lastUpdated: "Today at 8:05 AM",
  },
  {
    id: "rem-4",
    medicineName: "Calcium & Vitamin D",
    simpleDescription: "Bone Strength Supplement",
    time: "Yesterday, 12:00 PM",
    scheduledTime: "12:00",
    status: "missed",
    dosage: "600 mg / 400 IU",
    pillColor: "#9333ea",
    instructions: "Midday supplement for bone health.",
  },
];

// 2. Patient-Facing Safety Alerts with Simple Language (No complex jargon)
export const INITIAL_SAFETY_ALERTS: PatientSafetyAlert[] = [
  {
    id: "alert-1",
    level: "HIGH",
    title: "Important: Medication Safety Update",
    simpleMessage:
      "Please pause Pain Medication X. Dr. Sharma has prescribed safe Acetaminophen instead to protect your blood thinner and stomach.",
    timestamp: "Today, 10:30 AM",
    recommendedAction: "Take safe Acetaminophen tablet instead",
    isAcknowledged: false,
    relatedMedicine: "Pain Medication X",
  },
  {
    id: "alert-2",
    level: "MODERATE",
    title: "Mealtime Reminder for Your Medicine",
    simpleMessage:
      "Taking your joint pain medicine with lunch or a small snack helps protect your stomach and keeps you feeling comfortable.",
    timestamp: "Today, 08:30 AM",
    recommendedAction: "Take with food or milk",
    isAcknowledged: false,
    relatedMedicine: "Joint Pain Relief",
  },
  {
    id: "alert-3",
    level: "LOW",
    title: "Schedule Verified by Care Team",
    simpleMessage: "Your medication schedule has been updated.",
    timestamp: "Yesterday, 04:15 PM",
    recommendedAction: "View updated schedule",
    isAcknowledged: true,
  },
];

// 3. Notification Center Items (Both Doctor & Patient)
export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  // Doctor Notifications
  {
    id: "notif-doc-1",
    role: "doctor",
    category: "new_high_risk_review",
    title: "New high-risk review",
    message: "Raj Kumar (68y): Critical Warfarin + NSAID bleeding interaction flagged by MediQX Safety Engine.",
    timestamp: "10 mins ago",
    isRead: false,
    severity: "HIGH",
    patientName: "Raj Kumar",
    actionUrl: "/doctor/consultation/cons-101/analysis",
  },
  {
    id: "notif-doc-2",
    role: "doctor",
    category: "patient_med_updated",
    title: "Patient medication updated",
    message: "Raj Kumar: Successfully substituted Pain Medication X with Acetaminophen 500mg (Regimen collision cleared).",
    timestamp: "45 mins ago",
    isRead: false,
    severity: "MODERATE",
    patientName: "Raj Kumar",
    actionUrl: "/doctor/consultation/cons-101/review",
  },
  {
    id: "notif-doc-3",
    role: "doctor",
    category: "consultation_completed",
    title: "Consultation completed",
    message: "Consultation #cons-101 for Raj Kumar signed and electronic Rx order dispatched to hospital pharmacy.",
    timestamp: "2 hours ago",
    isRead: true,
    severity: "LOW",
    patientName: "Raj Kumar",
    actionUrl: "/doctor/dashboard",
  },

  // Patient Notifications
  {
    id: "notif-pat-1",
    role: "patient",
    category: "medicine_reminder",
    title: "Medicine reminder",
    message: "Time for your 1:00 PM Medicine B (Acetaminophen) for joint comfort.",
    timestamp: "5 mins ago",
    isRead: false,
    severity: "INFO",
    actionUrl: "/patient/dashboard",
  },
  {
    id: "notif-pat-2",
    role: "patient",
    category: "schedule_update",
    title: "Schedule update",
    message: "Your medication schedule has been updated by Dr. Sharma. Your evening tablet is ready.",
    timestamp: "1 hour ago",
    isRead: false,
    severity: "LOW",
    actionUrl: "/patient/dashboard",
  },
  {
    id: "notif-pat-3",
    role: "patient",
    category: "doctor_instruction",
    title: "Doctor instruction",
    message: "Dr. Sharma says: 'Drink plenty of water and remember to take your evening blood pressure tablet with dinner.'",
    timestamp: "3 hours ago",
    isRead: true,
    severity: "MODERATE",
    actionUrl: "/patient/dashboard",
  },
];
