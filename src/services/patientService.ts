// MediQX Patient Service
// Provides patient data retrieval, filtering, and updates.
// Ready to swap to FastAPI backend (e.g. GET /api/v1/patients) without UI modifications.

import { Patient, RiskLevel } from '@/types';
import { MOCK_PATIENTS } from '@/data/mockPatients';
import { simulateDelay, apiClient } from './apiClient';

// In-memory store for frontend session state
let sessionPatients: Patient[] = [...MOCK_PATIENTS];

export async function getPatients(options?: {
  query?: string;
  riskFilter?: 'ALL' | RiskLevel;
  limit?: number;
}): Promise<Patient[]> {
  // If real API configured:
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    try {
      return await apiClient<Patient[]>('/patients', {
        params: {
          search: options?.query,
          risk: options?.riskFilter !== 'ALL' ? options?.riskFilter : undefined,
          limit: options?.limit,
        },
      });
    } catch (err) {
      console.warn('Backend unavailable, falling back to mock service:', err);
    }
  }

  // Simulated latency for realistic UX & skeletons
  await simulateDelay(80);

  let results = [...sessionPatients];

  if (options?.query) {
    const q = options.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.diagnoses.some((d) => d.toLowerCase().includes(q)) ||
        p.medications.some((m) => m.name.toLowerCase().includes(q))
    );
  }

  if (options?.riskFilter && options.riskFilter !== 'ALL') {
    results = results.filter((p) => p.riskLevel === options.riskFilter);
  }

  if (options?.limit && options.limit > 0) {
    results = results.slice(0, options.limit);
  }

  return results;
}

export async function getPatientById(id: string): Promise<Patient | null> {
  // If real API configured:
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    try {
      return await apiClient<Patient>(`/patients/${id}`);
    } catch (err) {
      console.warn(`Backend error fetching patient ${id}, falling back to mock:`, err);
    }
  }

  await simulateDelay(60);
  const patient = sessionPatients.find((p) => p.id === id);
  return patient ? JSON.parse(JSON.stringify(patient)) : null;
}

export async function createPatient(newPatientData: Partial<Patient>): Promise<Patient> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    return await apiClient<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(newPatientData),
    });
  }

  await simulateDelay(100);
  const newPatient: Patient = {
    id: `pat-${Date.now()}`,
    mrn: `MG-${Math.floor(10000 + Math.random() * 90000)}`,
    name: newPatientData.name || 'New Patient',
    age: newPatientData.age || 65,
    gender: newPatientData.gender || 'Female',
    dob: newPatientData.dob || '1961-01-01',
    weightKg: newPatientData.weightKg || 70,
    heightCm: newPatientData.heightCm || 165,
    bloodPressure: newPatientData.bloodPressure || '120/80 mmHg',
    heartRate: newPatientData.heartRate || 72,
    eGFR: newPatientData.eGFR || 60,
    creatinine: newPatientData.creatinine || 1.0,
    potassium: newPatientData.potassium || 4.2,
    allergies: newPatientData.allergies || [],
    diagnoses: newPatientData.diagnoses || [],
    primaryDoctor: 'Dr. Sharma, MD',
    lastReviewDate: new Date().toISOString().split('T')[0],
    polypharmacyScore: newPatientData.polypharmacyScore || 25,
    riskLevel: newPatientData.riskLevel || 'LOW',
    totalAcbScore: 0,
    fallRiskScore: 1,
    sedationIndex: 0,
    medications: newPatientData.medications || [],
    interactions: [],
    cascades: [],
    recommendations: [],
  };

  sessionPatients = [newPatient, ...sessionPatients];
  return newPatient;
}

export async function updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    return await apiClient<Patient>(`/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  await simulateDelay(80);
  const index = sessionPatients.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error(`Patient with ID ${id} not found`);
  }

  sessionPatients[index] = {
    ...sessionPatients[index],
    ...updates,
  };

  return sessionPatients[index];
}
