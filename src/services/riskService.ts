// MedGuard Clinical Risk Analysis Service
// Interfaces with the MedGuard Pharmacological Inference Engine.
// Formulated to directly mirror FastAPI backend schema: POST /api/v1/risk-analysis

import { RiskAnalysis, RiskAlert, ProposedMedicationInput } from '@/types';
import { MOCK_RISK_ANALYSES } from '@/data/mockRiskAnalysis';
import { RECENT_ALERTS } from '@/data/mockPatients';
import { simulateDelay, apiClient } from './apiClient';

export async function getRiskAnalysis(
  consultationId: string = 'cons-101',
  proposedMed?: ProposedMedicationInput
): Promise<RiskAnalysis> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    try {
      return await apiClient<RiskAnalysis>(`/consultations/${consultationId}/risk-analysis`, {
        method: proposedMed ? 'POST' : 'GET',
        body: proposedMed ? JSON.stringify(proposedMed) : undefined,
      });
    } catch (err) {
      console.warn('Backend unavailable, using mock risk analysis:', err);
    }
  }

  await simulateDelay(100);

  // Return specific consultation analysis or the default primary case (Raj Kumar)
  const analysis = MOCK_RISK_ANALYSES[consultationId] || MOCK_RISK_ANALYSES['cons-101'];

  // If a specific proposed med was passed, overlay it onto the mock response
  if (proposedMed) {
    return {
      ...analysis,
      proposedMedication: proposedMed,
    };
  }

  return JSON.parse(JSON.stringify(analysis));
}

export async function getRiskAlerts(patientId?: string): Promise<RiskAlert[]> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    try {
      return await apiClient<RiskAlert[]>('/alerts', {
        params: { patientId },
      });
    } catch (err) {
      console.warn('Backend unavailable, using mock risk alerts:', err);
    }
  }

  await simulateDelay(60);

  return RECENT_ALERTS.map((alert) => ({
    id: alert.id,
    patientId: alert.patientMrn || 'p1',
    patientName: alert.patientName,
    severity: alert.severity,
    title: alert.title,
    description: alert.description,
    category: (alert.category === 'Interaction' ? 'INTERACTION' : alert.category === 'Beers Criteria' ? 'BEERS' : alert.category === 'Cascade' ? 'CASCADE' : 'SYSTEM') as any,
    timestamp: alert.timestamp,
    actionRequired: alert.recommendedAction,
    recommendedAction: alert.recommendedAction,
  }));
}
