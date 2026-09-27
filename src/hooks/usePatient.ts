// MediQX usePatient Hook
// Fetches and manages a single patient by ID.

import { useState, useEffect, useCallback } from 'react';
import { Patient } from '@/types';
import { getPatientById } from '@/services/patientService';

export function usePatient(patientId: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPatientById(patientId);
      setPatient(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load patient');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  return {
    patient,
    setPatient,
    loading,
    error,
    refetch: fetchPatient,
  };
}
