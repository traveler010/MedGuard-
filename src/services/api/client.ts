/**
 * MedGuard API Base Client
 * Centralized fetch client using NEXT_PUBLIC_API_URL.
 * Supports token injection, query string building, and consistent error handling.
 */

import { getApiBaseUrl } from './config';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  token?: string;
  timeoutMs?: number;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, token, headers: customHeaders, timeoutMs = 15000, ...customConfig } = options;
  const baseUrl = getApiBaseUrl();

  let url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  // Only set Content-Type to application/json if body is not FormData
  if (!(customConfig.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Token injection: from options or localStorage in browser
  const authToken =
    token || (typeof window !== 'undefined' ? localStorage.getItem('medguard_token') : null);
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  // AbortController for network timeouts on mobile
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      ...customConfig,
      headers,
      signal: customConfig.signal || controller.signal,
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError(408, 'Request timed out. Please check your network connection and try again.');
    }
    throw new ApiError(0, 'Unable to connect to the server. Please check your internet connection and try again.', { originalError: err?.message });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let errorDetail = response.statusText;
    let errorData = null;
    try {
      errorData = await response.json();
      if (errorData && (errorData.detail || errorData.message)) {
        errorDetail = errorData.detail || errorData.message;
      }
    } catch {
      // Body wasn't JSON
    }
    if (response.status === 401) {
      errorDetail = 'Session expired. Please log in again to continue.';
    } else if (response.status === 403) {
      errorDetail = 'Access denied. You do not have permission for this medical record.';
    } else if (response.status >= 500) {
      errorDetail = 'Medical service is temporarily unavailable. Please retry in a few moments.';
    }
    throw new ApiError(response.status, errorDetail, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
