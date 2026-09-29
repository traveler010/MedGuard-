// MedGuard useRiskAnalysis Hook
// Consumes riskService to power the flagship Risk Analysis screen.

import { useState, useEffect, useCallback } from 'react';
import { RiskAnalysis, ProposedMedicationInput } from '@/types';
import { getRiskAnalysis } from '@/services/riskService';

export function useRiskAnalysis(consultationId: string = 'cons-101', proposedMed?: ProposedMedicationInput) {
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRiskAnalysis(consultationId, proposedMed);
      setAnalysis(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to calculate clinical risk analysis');
    } finally {
      setLoading(false);
    }
  }, [consultationId, proposedMed]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  return {
    analysis,
    setAnalysis,
    loading,
    error,
    refetch: fetchAnalysis,
  };
}
