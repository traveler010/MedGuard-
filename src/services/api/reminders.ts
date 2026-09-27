import { request } from './client';

export interface ReminderItem {
  id: string;
  medication_id: string;
  medicine_name: string;
  dose: string;
  instructions?: string;
  scheduled_time: string;
  status: 'upcoming' | 'taken' | 'skipped' | 'missed';
  action_time?: string;
}

export const remindersApi = {
  async getMyReminders(): Promise<ReminderItem[]> {
    return request<ReminderItem[]>('/patients/me/reminders', {
      method: 'GET',
    });
  },

  async getTodayReminders(): Promise<ReminderItem[]> {
    return request<ReminderItem[]>('/patients/me/reminders/today', {
      method: 'GET',
    });
  },

  async markTaken(reminderId: string): Promise<ReminderItem> {
    return request<ReminderItem>(`/patients/me/reminders/${reminderId}/taken`, {
      method: 'POST',
    });
  },

  async markSkipped(reminderId: string): Promise<ReminderItem> {
    return request<ReminderItem>(`/patients/me/reminders/${reminderId}/skip`, {
      method: 'POST',
    });
  },

  async getMedicationHistory(): Promise<any[]> {
    return request<any[]>('/patients/me/medication-history', {
      method: 'GET',
    });
  },
};

