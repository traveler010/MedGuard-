// MedGuard useCurrentUser Hook
// Provides the authenticated or active user context.

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getCurrentUser } from '@/services/userService';

export function useCurrentUser(role: 'DOCTOR' | 'PATIENT' = 'DOCTOR') {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getCurrentUser(role).then((data) => {
      if (isMounted) {
        setUser(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [role]);

  return { user, loading };
}
