import { request } from './client';

export interface HealthMetricsSummary {
  blood_pressure?: string;
  blood_count?: string;
  haemoglobin?: string;
  other_metrics?: string;
  recorded_at?: string;
}

export interface PatientInfoSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  age?: number;
  gender?: string;
  blood_group?: string;
}

export interface PatientDashboardResponse {
  patient_info: PatientInfoSummary;
  health_metrics: HealthMetricsSummary;
  recent_reports: any[];
  current_medicines: any[];
  today_reminders: any[];
  upcoming_appointments: any[];
  recent_consultation_status?: string;
}

export interface DoctorPatientDashboardResponse {
  patient_info: PatientInfoSummary;
  health_metrics: HealthMetricsSummary;
  recent_reports: any[];
  current_medicines: any[];
  medication_adherence: any;
  recent_consultations: any[];
  upcoming_appointments: any[];
}

export const patientsApi = {
  async getDashboard(): Promise<PatientDashboardResponse> {
    return request<PatientDashboardResponse>('/patients/me/dashboard', {
      method: 'GET',
    });
  },

  async getDoctorPatientDashboard(patientId: string): Promise<DoctorPatientDashboardResponse> {
    return request<DoctorPatientDashboardResponse>(`/doctor/patients/${patientId}/dashboard`, {
      method: 'GET',
    });
  },
};
