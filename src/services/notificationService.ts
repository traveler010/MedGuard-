// MediQX Notification Service
// Provides notifications for doctors and patients/caregivers with real-time read/unread management.
// Mirrors FastAPI endpoints: GET /api/v1/notifications, POST /api/v1/notifications/{id}/read

import { Notification } from '@/types';
import { MOCK_NOTIFICATIONS } from '@/data/mockNotifications';
import { simulateDelay, apiClient } from './apiClient';

let sessionNotifications: Notification[] = [...MOCK_NOTIFICATIONS];

export async function getNotifications(
  role: 'doctor' | 'patient' | 'both' = 'both'
): Promise<Notification[]> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    try {
      return await apiClient<Notification[]>('/notifications', {
        params: { role: role !== 'both' ? role : undefined },
      });
    } catch (err) {
      console.warn('Backend unavailable, using mock notifications:', err);
    }
  }

  await simulateDelay(50);

  if (role === 'both') {
    return [...sessionNotifications];
  }

  return sessionNotifications.filter((n) => n.role === role || n.role === 'both');
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    try {
      await apiClient(`/notifications/${id}/read`, { method: 'POST' });
      return true;
    } catch (err) {
      console.warn('Backend unavailable, updating local mock state:', err);
    }
  }

  await simulateDelay(30);
  const notif = sessionNotifications.find((n) => n.id === id);
  if (notif) {
    notif.unread = false;
    return true;
  }
  return false;
}

export async function markAllNotificationsAsRead(
  role: 'doctor' | 'patient' | 'both' = 'both'
): Promise<boolean> {
  if (process.env.NEXT_PUBLIC_USE_REAL_API) {
    try {
      await apiClient('/notifications/mark-all-read', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });
      return true;
    } catch (err) {
      console.warn('Backend unavailable, updating local mock state:', err);
    }
  }

  await simulateDelay(30);
  sessionNotifications = sessionNotifications.map((n) => {
    if (role === 'both' || n.role === role || n.role === 'both') {
      return { ...n, unread: false };
    }
    return n;
  });

  return true;
}
