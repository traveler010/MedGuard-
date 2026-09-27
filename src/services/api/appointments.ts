import { request } from './client';

export interface AppointmentPayload {
  doctor_id?: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type?: string;
  notes?: string;
}

export interface AppointmentItem {
  id: string;
  patient_id: string;
  doctor_id?: string;
  patient_name?: string;
  doctor_name?: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  status: 'upcoming' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const appointmentsApi = {
  async getMyAppointments(): Promise<AppointmentItem[]> {
    return request<AppointmentItem[]>('/patients/me/appointments', {
      method: 'GET',
    });
  },

  async bookAppointment(data: AppointmentPayload): Promise<AppointmentItem> {
    return request<AppointmentItem>('/patients/me/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyAppointment(id: string): Promise<AppointmentItem> {
    return request<AppointmentItem>(`/patients/me/appointments/${id}`, {
      method: 'GET',
    });
  },

  async getDoctorAppointments(statusFilter?: string): Promise<AppointmentItem[]> {
    return request<AppointmentItem[]>('/doctor/appointments', {
      method: 'GET',
      params: statusFilter ? { status: statusFilter } : undefined,
    });
  },

  async getDoctorAppointment(id: string): Promise<AppointmentItem> {
    return request<AppointmentItem>(`/doctor/appointments/${id}`, {
      method: 'GET',
    });
  },

  async updateStatus(
    id: string,
    status: 'upcoming' | 'confirmed' | 'completed' | 'cancelled'
  ): Promise<AppointmentItem> {
    return request<AppointmentItem>(`/doctor/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
