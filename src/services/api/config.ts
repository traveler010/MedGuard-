/**
 * MedGuard Centralized API Configuration
 * Supports NEXT_PUBLIC_API_URL environment variable and dynamically resolves
 * the backend hostname for mobile devices connecting over LAN/Wi-Fi.
 */

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location.hostname) {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:8000`;
  }
  return 'http://localhost:8000';
}

export const API_BASE_URL = getApiBaseUrl();
