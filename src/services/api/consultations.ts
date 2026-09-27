import { request } from './client';

export interface ConsultationCreatePayload {
  symptoms: string;
  duration: string;
  severity: string;
  associated_symptoms?: string;
  current_medicines?: string;
  relevant_history?: string;
  initial_message?: string;
  doctor_id?: string;
}

export interface ConsultationMessageItem {
  id: string;
  consultation_id: string;
  sender_id: string;
  sender_role: 'patient' | 'doctor';
  sender_name?: string;
  message: string;
  created_at: string;
}

export interface ConsultationReportItem {
  id: string;
  consultation_id: string;
  symptoms: string;
  duration: string;
  severity: string;
  associated_symptoms?: string;
  current_medicines?: string;
  relevant_history?: string;
  summary: string;
  disclaimer: string;
  created_at: string;
}

export interface ConsultationDetail {
  id: string;
  patient_id: string;
  doctor_id?: string;
  patient_name?: string;
  doctor_name?: string;
  status: 'new' | 'under_review' | 'reviewed';
  created_at: string;
  updated_at: string;
  completed_at?: string;
  report?: ConsultationReportItem;
  messages: ConsultationMessageItem[];
}

export interface ConsultationListItem {
  id: string;
  patient_id: string;
  doctor_id?: string;
  patient_name?: string;
  doctor_name?: string;
  status: 'new' | 'under_review' | 'reviewed';
  created_at: string;
  updated_at: string;
  completed_at?: string;
  symptoms?: string;
  severity?: string;
  summary?: string;
  message_count: number;
}

export const consultationsApi = {
  async createConsultation(data: ConsultationCreatePayload): Promise<ConsultationDetail> {
    return request<ConsultationDetail>('/patients/me/consultations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyConsultations(): Promise<ConsultationListItem[]> {
    return request<ConsultationListItem[]>('/patients/me/consultations', {
      method: 'GET',
    });
  },

  async getMyConsultation(id: string): Promise<ConsultationDetail> {
    return request<ConsultationDetail>(`/patients/me/consultations/${id}`, {
      method: 'GET',
    });
  },

  async sendPatientMessage(consultationId: string, message: string): Promise<ConsultationMessageItem> {
    return request<ConsultationMessageItem>(`/patients/me/consultations/${consultationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  async getDoctorConsultations(statusFilter?: string): Promise<ConsultationListItem[]> {
    return request<ConsultationListItem[]>('/doctor/consultations', {
      method: 'GET',
      params: statusFilter ? { status: statusFilter } : undefined,
    });
  },

  async getDoctorConsultation(id: string): Promise<ConsultationDetail> {
    return request<ConsultationDetail>(`/doctor/consultations/${id}`, {
      method: 'GET',
    });
  },

  async updateStatus(
    consultationId: string,
    status: 'new' | 'under_review' | 'reviewed'
  ): Promise<ConsultationDetail> {
    return request<ConsultationDetail>(`/doctor/consultations/${consultationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async sendDoctorMessage(consultationId: string, message: string): Promise<ConsultationMessageItem> {
    return request<ConsultationMessageItem>(`/doctor/consultations/${consultationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};
