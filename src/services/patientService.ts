// MedGuard Patient Service
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

import {
  DoctorPatientDirectoryItem,
  getStoredDoctorPatients,
  saveNewDoctorPatient,
  DOCTOR_PATIENTS_STORAGE_KEY,
  PATIENT_MEDICINES_STORAGE_KEY,
} from '@/data/mockDoctorPortal';

export interface AddDoctorPatientPayload {
  name: string;
  patient_id?: string;
  medicine_name?: string;
  age?: number;
  gender?: string;
  email?: string;
  phone?: string;
  blood_group?: string;
  primary_condition?: string;
  medical_history?: string;
  current_medications?: string;
  emergency_contact?: string;
  risk_level?: 'HIGH' | 'MODERATE' | 'LOW';
  allergies?: string;
  blood_pressure?: string;
  heart_rate?: string;
  doctor_assigned?: string;
}

export async function fetchDoctorPatients(): Promise<DoctorPatientDirectoryItem[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  try {
    const res = await fetch(`${apiUrl}/doctor/patients`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Map backend PatientResponse to DoctorPatientDirectoryItem
        const mapped: DoctorPatientDirectoryItem[] = data.map((item: any) => ({
          id: item.id || `pat-${Math.random().toString(36).substring(2, 7)}`,
          name: item.name,
          age: item.age || 50,
          gender: item.gender || 'Unknown',
          primaryCondition: item.primaryCondition || item.primary_condition || 'General Health',
          riskLevel: (item.riskLevel || item.risk_level || 'LOW') as 'HIGH' | 'MODERATE' | 'LOW',
          activeMedsCount:
            typeof item.activeMedsCount === 'number'
              ? item.activeMedsCount
              : Array.isArray(item.medications)
              ? item.medications.length
              : 0,
          attentionNeeded: Boolean(item.attentionNeeded),
          attentionReason: item.attentionReason,
          lastVisit: item.lastVisit || 'Today',
          nextAppointment: item.nextAppointment || 'None scheduled',
          medications: Array.isArray(item.medications) ? item.medications : [],
          primaryMedicine:
            item.primaryMedicine ||
            item.primary_medicine ||
            (Array.isArray(item.medications) && item.medications[0]) ||
            '',
        }));

        // Merge with locally stored patients
        const local = getStoredDoctorPatients();
        const serverIds = new Set(mapped.map((p) => p.id));
        const customLocalOnly = local.filter((p) => !serverIds.has(p.id));
        const merged = [...mapped, ...customLocalOnly];

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(DOCTOR_PATIENTS_STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {}
        }

        return merged;
      }
    }
  } catch (err) {
    // API not reachable or timeout, seamlessly return stored patients
  }
  return getStoredDoctorPatients();
}

export async function addDoctorPatient(
  payload: AddDoctorPatientPayload
): Promise<DoctorPatientDirectoryItem> {
  const patientId =
    payload.patient_id?.trim() ||
    `pat-${Math.floor(100 + Math.random() * 900)}`;

  const medString =
    payload.medicine_name?.trim() ||
    payload.current_medications?.trim() ||
    '';

  const parsedMeds = medString
    ? medString
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const medCount = parsedMeds.length;

  const directoryItem: DoctorPatientDirectoryItem = {
    id: patientId,
    name: payload.name.trim(),
    age: payload.age ? Number(payload.age) : 50,
    gender: payload.gender || 'Male',
    primaryCondition: payload.primary_condition?.trim() || 'General Clinical Care',
    riskLevel: (payload.risk_level as 'HIGH' | 'MODERATE' | 'LOW') || 'LOW',
    activeMedsCount: medCount > 0 ? medCount : 1,
    attentionNeeded: payload.risk_level === 'HIGH',
    attentionReason:
      payload.risk_level === 'HIGH' ? 'New high-risk patient intake' : undefined,
    lastVisit: 'Today',
    nextAppointment: 'Intake consultation scheduled',
    medications: parsedMeds,
    primaryMedicine: parsedMeds[0] || medString || undefined,
  };

  // 1. Attempt to sync with backend API
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  try {
    const res = await fetch(`${apiUrl}/doctor/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: payload.name.trim(),
        patient_id: patientId,
        age: payload.age ? Number(payload.age) : 50,
        gender: payload.gender || 'Male',
        email: payload.email?.trim() || undefined,
        phone: payload.phone?.trim() || undefined,
        blood_group: payload.blood_group?.trim() || undefined,
        primary_condition: payload.primary_condition?.trim() || 'General Clinical Care',
        medical_history: payload.medical_history?.trim() || undefined,
        medicine_name: medString || undefined,
        current_medications: medString || undefined,
        emergency_contact: payload.emergency_contact?.trim() || undefined,
        risk_level: payload.risk_level || 'LOW',
      }),
      signal: AbortSignal.timeout(6000),
    });

    if (res.ok) {
      const serverPatient = await res.json();
      if (serverPatient.id) {
        directoryItem.id = serverPatient.id;
      }
      if (serverPatient.name) {
        directoryItem.name = serverPatient.name;
      }
      if (Array.isArray(serverPatient.medications) && serverPatient.medications.length > 0) {
        directoryItem.medications = serverPatient.medications;
        directoryItem.primaryMedicine = serverPatient.medications[0];
      }
      if (typeof serverPatient.activeMedsCount === 'number') {
        directoryItem.activeMedsCount = serverPatient.activeMedsCount;
      }
    } else {
      let errMsg = 'Failed to save patient to backend database.';
      try {
        const errJson = await res.json();
        if (errJson.detail) {
          errMsg =
            typeof errJson.detail === 'string'
              ? errJson.detail
              : JSON.stringify(errJson.detail);
        }
      } catch {
        const errTxt = await res.text();
        if (errTxt) errMsg = errTxt;
      }
      throw new Error(errMsg);
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
    console.warn('Backend API connection notice (fallback saving):', err);
  }

  // 2. Persist in client storage and mock store
  saveNewDoctorPatient(directoryItem, {
    bloodGroup: payload.blood_group,
    emergencyContact: payload.emergency_contact,
    phone: payload.phone,
    email: payload.email,
    currentMedications: medString,
    allergies: payload.allergies,
    notes: payload.medical_history,
    vitals: {
      bloodPressure: payload.blood_pressure || '120/80 mmHg',
      heartRate: payload.heart_rate ? `${payload.heart_rate} bpm` : '72 bpm',
    },
  });

  return directoryItem;
}

