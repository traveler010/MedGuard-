// MedGuard Prescription Service
// Manages prescription orders, approvals, modifications, and clinical history.
// Mirrors FastAPI endpoints: GET /api/v1/prescriptions, POST /api/v1/prescriptions

import { Prescription, PrescriptionItem } from '@/types';
import { MOCK_PRESCRIPTIONS } from '@/data/mockPrescriptions';
import { simulateDelay, apiClient } from './apiClient';

let sessionPrescriptions: Prescription[] = [...MOCK_PRESCRIPTIONS];

export async function getPrescriptions(patientId?: string): Promise<Prescription[]> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    try {
      return await apiClient<Prescription[]>('/prescriptions', {
        params: { patientId },
      });
    } catch (err) {
      console.warn('Backend unavailable, using mock prescriptions:', err);
    }
  }

  await simulateDelay(60);

  if (patientId) {
    return sessionPrescriptions.filter((p) => p.patientId === patientId);
  }

  return [...sessionPrescriptions];
}

export async function getPrescriptionById(id: string): Promise<Prescription | null> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    try {
      return await apiClient<Prescription>(`/prescriptions/${id}`);
    } catch (err) {
      console.warn('Backend unavailable, using mock prescription:', err);
    }
  }

  await simulateDelay(50);
  const found = sessionPrescriptions.find((p) => p.id === id);
  return found ? JSON.parse(JSON.stringify(found)) : null;
}

export async function createPrescription(newRx: Partial<Prescription>): Promise<Prescription> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    return await apiClient<Prescription>('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(newRx),
    });
  }

  await simulateDelay(80);
  const created: Prescription = {
    id: `rx-${Date.now()}`,
    patientId: newRx.patientId || 'pat-1',
    patientName: newRx.patientName || 'Raj Kumar',
    patientAge: newRx.patientAge || 68,
    doctorName: newRx.doctorName || 'Dr. Sharma, MD',
    date: new Date().toISOString().split('T')[0],
    status: newRx.status || 'APPROVED',
    medications: newRx.medications || [],
    overallRisk: newRx.overallRisk || 'LOW',
    riskFactors: newRx.riskFactors || [],
    doctorDecision: newRx.doctorDecision || 'APPROVE',
    decisionNotes: newRx.decisionNotes,
    overrideJustification: newRx.overrideJustification,
  };

  sessionPrescriptions = [created, ...sessionPrescriptions];
  return created;
}

export async function updatePrescriptionDecision(
  id: string,
  decision: 'APPROVE' | 'MODIFY' | 'REMOVE',
  notes?: string
): Promise<Prescription> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    return await apiClient<Prescription>(`/prescriptions/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision, notes }),
    });
  }

  await simulateDelay(60);
  const index = sessionPrescriptions.findIndex((p) => p.id === id);
  if (index !== -1) {
    sessionPrescriptions[index].doctorDecision = decision;
    sessionPrescriptions[index].status = decision === 'APPROVE' ? 'APPROVED' : decision === 'MODIFY' ? 'MODIFIED' : 'DISCONTINUED';
    if (notes) sessionPrescriptions[index].decisionNotes = notes;
    return sessionPrescriptions[index];
  }

  throw new Error(`Prescription ${id} not found`);
}
