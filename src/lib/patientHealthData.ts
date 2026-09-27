"use client";

export interface ExtractedMeasurement {
  label: string;
  value: string;
  unit?: string;
  status?: "Normal" | "Optimal" | "Monitored" | "Attention";
}

export interface PatientReportItem {
  id: string;
  name: string;
  uploadDate: string;
  type: string;
  fileSize?: string;
  summary?: string;
  extractedValues?: { label: string; value: string }[];
}

export const INITIAL_DEFAULT_REPORTS: PatientReportItem[] = [
  {
    id: "rep-1",
    name: "Comprehensive_Metabolic_CBC_Panel.pdf",
    uploadDate: "September 18, 2026",
    type: "Blood Test / Lab",
    fileSize: "2.4 MB",
    summary: "Routine quarterly geriatric metabolic panel and complete blood count.",
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
    name: "Cardiology_INR_Coagulation_Review.pdf",
    uploadDate: "August 24, 2026",
    type: "Cardiology Review",
    fileSize: "1.1 MB",
    summary: "International Normalized Ratio (INR) monitoring for Warfarin therapy.",
    extractedValues: [
      { label: "INR Ratio", value: "2.4 (Target 2.0-3.0)" },
      { label: "Platelets", value: "Normal" },
    ],
  },
];

const STORAGE_KEY = "medguard_patient_reports";

export function getPatientReports(): PatientReportItem[] {
  if (typeof window === "undefined") return INITIAL_DEFAULT_REPORTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      // First time - store initial defaults
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_REPORTS));
      return INITIAL_DEFAULT_REPORTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return INITIAL_DEFAULT_REPORTS;
  }
}

export function savePatientReports(reports: PatientReportItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // ignore
  }
}

export function getLatestPatientReport(): PatientReportItem | null {
  const list = getPatientReports();
  return list.length > 0 ? list[0] : null;
}

export interface DashboardHealthOverview {
  bloodPressure: string;
  haemoglobin: string;
  bloodCount: string;
  additionalMetrics: { label: string; value: string }[];
  hasReport: boolean;
  recentReport: PatientReportItem | null;
}

export function extractReportHealthMetrics(
  report: PatientReportItem | null
): DashboardHealthOverview {
  if (!report || !report.extractedValues || report.extractedValues.length === 0) {
    return {
      bloodPressure: "Not available",
      haemoglobin: "Not available",
      bloodCount: "Not available",
      additionalMetrics: [],
      hasReport: false,
      recentReport: null,
    };
  }

  const values = report.extractedValues;

  const findMetric = (keywords: string[]): string => {
    const match = values.find((item) =>
      keywords.some((k) => item.label.toLowerCase().includes(k))
    );
    return match && match.value.trim() ? match.value : "Not available";
  };

  const bp = findMetric(["blood pressure", "bp"]);
  const haemo = findMetric(["haemoglobin", "hemoglobin", "hgb"]);
  const bc = findMetric(["blood count", "cbc", "white blood", "wbc"]);

  // Collect other clearly available health measurements from the submitted report
  const primaryKeys = ["blood pressure", "bp", "haemoglobin", "hemoglobin", "hgb", "blood count", "cbc", "wbc"];
  const additional = values.filter(
    (item) => !primaryKeys.some((k) => item.label.toLowerCase().includes(k))
  );

  return {
    bloodPressure: bp,
    haemoglobin: haemo,
    bloodCount: bc,
    additionalMetrics: additional,
    hasReport: true,
    recentReport: report,
  };
}
