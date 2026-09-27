// MediQX API Client Abstraction
// Handles HTTP requests to the backend with seamless mock fallback.
// In production or with a running FastAPI backend, set NEXT_PUBLIC_API_URL (e.g. http://localhost:8000/api/v1).

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const USE_MOCK = !process.env.NEXT_PUBLIC_USE_REAL_API;
const SIMULATED_LATENCY_MS = 120; // Fast and snappy UI feel

export async function simulateDelay(ms: number = SIMULATED_LATENCY_MS): Promise<void> {
  if (ms <= 0) return;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  if (USE_MOCK || !API_BASE_URL) {
    throw new Error(`[Mock Mode] No remote endpoint configured for ${endpoint}. Use mock service.`);
  }

  const { params, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...customConfig.headers,
  };

  const response = await fetch(url, {
    ...customConfig,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error ${response.status}: ${errorBody || response.statusText}`);
  }

  return response.json();
}
