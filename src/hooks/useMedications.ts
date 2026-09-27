// MediQX useMedications Hook
// Loads patient medications via medicationService.

import { useState, useEffect, useCallback } from 'react';
import { Medication } from '@/types';
import { getMedications } from '@/services/medicationService';

export function useMedications(patientId?: string) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMedications(patientId);
      setMedications(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load medications');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  return {
    medications,
    setMedications,
    loading,
    error,
    refetch: fetchMedications,
  };
}
