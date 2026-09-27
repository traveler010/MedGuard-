// MediQX Medication Service
// Handles medication regimens, schedules, and administration logging.
// Supports both clinician and patient/caregiver views.

import { Medication, MedicationScheduleItem } from '@/types';
import { MOCK_PATIENTS } from '@/data/mockPatients';
import { MOCK_SCHEDULE_ITEMS } from '@/data/mockMedicationSchedule';
import { simulateDelay, apiClient } from './apiClient';

let sessionSchedule: MedicationScheduleItem[] = [...MOCK_SCHEDULE_ITEMS];

export async function getMedications(patientId?: string): Promise<Medication[]> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    try {
      return await apiClient<Medication[]>('/medications', {
        params: { patientId },
      });
    } catch (err) {
      console.warn('Backend unavailable, using mock medications:', err);
    }
  }

  await simulateDelay(60);

  if (patientId) {
    const patient = MOCK_PATIENTS.find((p) => p.id === patientId);
    return patient ? [...patient.medications] : [];
  }

  // Aggregate all medications across mock patients
  const allMeds: Medication[] = [];
  MOCK_PATIENTS.forEach((p) => {
    p.medications.forEach((m) => {
      if (!allMeds.some((existing) => existing.name === m.name)) {
        allMeds.push(m);
      }
    });
  });

  return allMeds;
}

export async function getMedicationSchedule(patientId: string = 'pat-1'): Promise<MedicationScheduleItem[]> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    try {
      return await apiClient<MedicationScheduleItem[]>(`/patients/${patientId}/schedule`);
    } catch (err) {
      console.warn('Backend unavailable, using mock schedule:', err);
    }
  }

  await simulateDelay(50);
  return [...sessionSchedule];
}

export async function toggleMedicationTaken(
  scheduleId: string,
  patientId: string = 'pat-1'
): Promise<{ success: boolean; isTaken: boolean; item?: MedicationScheduleItem }> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    try {
      return await apiClient<{ success: boolean; isTaken: boolean; item?: MedicationScheduleItem }>(
        `/patients/${patientId}/schedule/${scheduleId}/toggle-taken`,
        { method: 'POST' }
      );
    } catch (err) {
      console.warn('Backend unavailable, falling back to mock toggle:', err);
    }
  }

  await simulateDelay(40);
  const index = sessionSchedule.findIndex((item) => item.id === scheduleId);
  if (index === -1) {
    return { success: false, isTaken: false };
  }

  const current = sessionSchedule[index];
  const newStatus = !current.isTaken;

  sessionSchedule[index] = {
    ...current,
    isTaken: newStatus,
    takenAt: newStatus ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
  };

  return {
    success: true,
    isTaken: newStatus,
    item: sessionSchedule[index],
  };
}

export async function addMedicationToPatient(
  patientId: string,
  newMed: Medication
): Promise<Medication> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    return await apiClient<Medication>(`/patients/${patientId}/medications`, {
      method: 'POST',
      body: JSON.stringify(newMed),
    });
  }

  await simulateDelay(80);
  return newMed;
}
