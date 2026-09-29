// MedGuard useMedicationSchedule Hook
// Powers patient/caregiver today's schedule view with mark-as-taken and undo functionality.

import { useState, useEffect, useCallback } from 'react';
import { MedicationScheduleItem } from '@/types';
import { getMedicationSchedule, toggleMedicationTaken } from '@/services/medicationService';

export function useMedicationSchedule(patientId: string = 'pat-1') {
  const [schedule, setSchedule] = useState<MedicationScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMedicationSchedule(patientId);
      setSchedule(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load medication schedule');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const toggleTaken = async (scheduleId: string) => {
    // Optimistic UI update
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === scheduleId
          ? {
              ...item,
              isTaken: !item.isTaken,
              takenAt: !item.isTaken
                ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : undefined,
            }
          : item
      )
    );

    try {
      await toggleMedicationTaken(scheduleId, patientId);
    } catch (err) {
      console.error('Failed to sync toggle with backend:', err);
      // Revert on error
      fetchSchedule();
    }
  };

  return {
    schedule,
    setSchedule,
    loading,
    error,
    toggleTaken,
    refetch: fetchSchedule,
  };
}
