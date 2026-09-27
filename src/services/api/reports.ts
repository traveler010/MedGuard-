import { request } from './client';
import { getApiBaseUrl } from './config';

export interface HealthMetricItem {
  id: string;
  patient_id: string;
  report_id?: string;
  blood_pressure?: string;
  blood_count?: string;
  haemoglobin?: string;
  other_metrics?: string;
  recorded_at: string;
}

export interface MedicalReportItem {
  id: string;
  patient_id: string;
  title: string;
  report_type: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  health_metrics?: HealthMetricItem[];
}

export const reportsApi = {
  async uploadReport(formData: FormData): Promise<MedicalReportItem> {
    return request<MedicalReportItem>('/patients/me/reports', {
      method: 'POST',
      body: formData,
    });
  },

  async getMyReports(): Promise<MedicalReportItem[]> {
    return request<MedicalReportItem[]>('/patients/me/reports', {
      method: 'GET',
    });
  },

  getReportDownloadUrl(reportId: string, role: 'patient' | 'doctor' = 'patient'): string {
    const baseUrl = getApiBaseUrl();
    return `${baseUrl}/${role === 'doctor' ? 'doctor' : 'patients/me'}/reports/${reportId}/file`;
  },
};
