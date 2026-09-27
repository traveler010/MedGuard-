import { request } from './client';

export interface MedicationScheduleItem {
  id: string;
  medication_id: string;
  scheduled_time: string;
  created_at: string;
}

export interface MedicationItem {
  id: string;
  patient_id: string;
  medicine_name: string;
  dose: string;
  frequency: string;
  instructions?: string;
  start_date?: string;
  end_date?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  schedules?: MedicationScheduleItem[];
  current_status?: string;
}

export interface MedicationCreatePayload {
  medicine_name: string;
  dose: string;
  frequency: string;
  instructions?: string;
  start_date?: string;
  end_date?: string;
  active?: boolean;
  scheduled_times?: string[];
}

export interface MedicationUpdatePayload {
  medicine_name?: string;
  dose?: string;
  frequency?: string;
  instructions?: string;
  start_date?: string;
  end_date?: string;
  active?: boolean;
  scheduled_times?: string[];
}

export const medicationsApi = {
  async getMyMedications(activeOnly: boolean = false): Promise<MedicationItem[]> {
    return request<MedicationItem[]>('/patients/me/medications', {
      method: 'GET',
      params: activeOnly ? { active_only: true } : undefined,
    });
  },

  async addMedication(data: MedicationCreatePayload): Promise<MedicationItem> {
    return request<MedicationItem>('/patients/me/medications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMedication(id: string): Promise<MedicationItem> {
    return request<MedicationItem>(`/patients/me/medications/${id}`, {
      method: 'GET',
    });
  },

  async updateMedication(id: string, data: MedicationUpdatePayload): Promise<MedicationItem> {
    return request<MedicationItem>(`/patients/me/medications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteMedication(id: string): Promise<void> {
    return request<void>(`/patients/me/medications/${id}`, {
      method: 'DELETE',
    });
  },

  async getDoctorPatientMedications(patientId: string): Promise<MedicationItem[]> {
    return request<MedicationItem[]>(`/doctor/patients/${patientId}/medications`, {
      method: 'GET',
    });
  },

  async getDoctorPatientHistory(patientId: string): Promise<any[]> {
    return request<any[]>(`/doctor/patients/${patientId}/medication-history`, {
      method: 'GET',
    });
  },

  async getDoctorPatientAdherence(patientId: string): Promise<any> {
    return request<any>(`/doctor/patients/${patientId}/medication-adherence`, {
      method: 'GET',
    });
  },
};
