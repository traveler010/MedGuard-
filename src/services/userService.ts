// MedGuard User Profile & Authentication Service
// Ready to connect to FastAPI JWT/OAuth endpoints: /api/v1/auth/me

import { User } from '@/types';
import { MOCK_USERS, CURRENT_DOCTOR, CURRENT_PATIENT } from '@/data/mockUsers';
import { simulateDelay, apiClient } from './apiClient';

export async function getCurrentUser(role: 'DOCTOR' | 'PATIENT' = 'DOCTOR'): Promise<User> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    try {
      return await apiClient<User>('/auth/me');
    } catch (err) {
      console.warn('Backend unavailable, using mock user profile:', err);
    }
  }

  await simulateDelay(40);
  return role === 'DOCTOR' ? CURRENT_DOCTOR : CURRENT_PATIENT;
}

export async function getUsers(): Promise<User[]> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    try {
      return await apiClient<User[]>('/users');
    } catch (err) {
      console.warn('Backend unavailable, using mock users:', err);
    }
  }

  await simulateDelay(40);
  return [...MOCK_USERS];
}
