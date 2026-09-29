// MedGuard usePatients Hook
// Consumes patientService to provide reactive patient panel data.

import { useState, useEffect, useCallback } from 'react';
import { Patient, RiskLevel } from '@/types';
import { getPatients } from '@/services/patientService';

export function usePatients(initialQuery?: string, initialRiskFilter: 'ALL' | RiskLevel = 'ALL') {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery || '');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>(initialRiskFilter);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPatients({ query, riskFilter });
      setPatients(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, [query, riskFilter]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    loading,
    error,
    refetch: fetchPatients,
    query,
    setQuery,
    riskFilter,
    setRiskFilter,
  };
}
