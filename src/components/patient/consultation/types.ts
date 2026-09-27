export interface PatientManualMedicine {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  times: string;
  startDate?: string;
  endDate?: string;
  instructions?: string;
}

export interface UploadedPrescriptionItem {
  id: string;
  name: string;
  fileSize: string;
  uploadTime: string;
  type: "image" | "pdf";
  dataUrl?: string; // for thumbnail/preview
  status: "Uploaded for doctor review";
}

export interface AttachedReportItem {
  id: string;
  name: string;
  type: string;
  date: string;
  fileSize?: string;
  isExisting: boolean;
}

export interface DoctorResponseData {
  doctorName: string;
  doctorRole: string;
  responseTime?: string;
  message?: string;
  status: "Waiting for doctor response" | "Reviewed" | "Under Review";
  prescriptionAttachments?: {
    id: string;
    medicineName: string;
    dose: string;
    instructions: string;
    date: string;
  }[];
}

export interface ConsultationDoctorInfo {
  doctorName: string;
  specialty: string;
  clinic: string;
  status: "Available for Consultation" | "In Clinic" | "Reviewing Cases";
  lastConsultationDate?: string;
  lastConsultationSummary?: string;
  appointmentInfo?: {
    date: string;
    time: string;
    type: string;
    location: string;
  };
}
