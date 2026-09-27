import { getApiBaseUrl } from './api/config';

// MedGuard Consultation Service — Phase 3 Integration
// Connects patient and doctor portals to the FastAPI consultation backend.
// Falls back to mock data when NEXT_PUBLIC_USE_REAL_API is not set.

const USE_REAL = !!process.env.NEXT_PUBLIC_USE_REAL_API;

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('medguard_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const API = getApiBaseUrl();
  const url = `${API}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers: Record<string, string> = {
    ...getAuthHeaders(),
    ...(options.headers as Record<string, string> || {}),
  };
  // Don't set Content-Type for FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

// ━━━━━━━━━━━━━ TYPES ━━━━━━━━━━━━━

export interface ConsultationItem {
  id: string;
  patient_id: string;
  doctor_id?: string;
  patient_name?: string;
  doctor_name?: string;
  status: string;
  started_at?: string;
  last_activity_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  medications?: ConsultationMed[];
  attachments?: ConsultationAttachment[];
  messages?: ConsultationMsg[];
  report?: ConsultationReport | null;
}

export interface ConsultationMed {
  id: string;
  consultation_id: string;
  medicine_name: string;
  dose: string;
  frequency: string;
  scheduled_times?: string;
  start_date?: string;
  end_date?: string;
  instructions?: string;
  source: string;
  created_at: string;
}

export interface ConsultationAttachment {
  id: string;
  consultation_id: string;
  uploaded_by: string;
  file_name: string;
  file_type: string;
  attachment_type: string;
  file_size?: number;
  uploaded_at: string;
  download_url: string;
}

export interface ConsultationMsg {
  id: string;
  consultation_id: string;
  sender_id: string;
  sender_role: string;
  sender_name?: string;
  message: string;
  attachment_id?: string;
  created_at: string;
  read_at?: string;
}

export interface ConsultationReport {
  id: string;
  consultation_id: string;
  symptoms: string;
  duration: string;
  severity: string;
  associated_symptoms?: string;
  current_medicines?: string;
  relevant_history?: string;
  summary: string;
  disclaimer: string;
  created_at: string;
}

export interface DoctorConsultationReview {
  id: string;
  patient_id: string;
  doctor_id?: string;
  status: string;
  report?: ConsultationReport | null;
  messages: ConsultationMsg[];
  consultation: ConsultationItem;
  patient: {
    id: string;
    name: string;
    email: string;
    created_at?: string;
  };
  current_medicines: Array<{
    id: string;
    medicine_name: string;
    dose: string;
    frequency: string;
    instructions?: string;
    start_date?: string;
    end_date?: string;
    schedules?: string[];
  }>;
  manually_entered_medicines: ConsultationMed[];
  uploaded_prescriptions: ConsultationAttachment[];
  medicine_images: ConsultationAttachment[];
  medical_reports: ConsultationAttachment[];
  patient_messages: ConsultationMsg[];
  consultation_status: string;
}

export interface PrescriptionItem {
  id: string;
  consultation_id: string;
  doctor_name: string;
  file_name: string;
  file_type: string;
  uploaded_at: string;
  status: string;
  download_url: string;
}

export interface ConsultationListItem {
  id: string;
  patient_id: string;
  doctor_id?: string;
  patient_name?: string;
  doctor_name?: string;
  status: string;
  started_at?: string;
  last_activity_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  symptoms?: string;
  severity?: string;
  summary?: string;
  message_count: number;
  medication_count: number;
  attachment_count: number;
}

// ━━━━━━━━━━━━━ PATIENT API ━━━━━━━━━━━━━

export async function startConsultation(data: {
  doctor_id?: string;
  appointment_id?: string;
  initial_message?: string;
  symptoms?: string;
  duration?: string;
  severity?: string;
  associated_symptoms?: string;
  current_medicines?: string;
  relevant_history?: string;
}): Promise<ConsultationItem> {
  return apiFetch<ConsultationItem>('/consultations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getConsultation(id: string): Promise<ConsultationItem> {
  return apiFetch<ConsultationItem>(`/consultations/${id}`);
}

export async function addConsultationMedicine(
  consultationId: string,
  data: {
    medicine_name: string;
    dose: string;
    frequency: string;
    scheduled_times?: string;
    start_date?: string;
    end_date?: string;
    instructions?: string;
    source?: string;
  }
): Promise<ConsultationMed> {
  return apiFetch<ConsultationMed>(`/consultations/${consultationId}/medications`, {
    method: 'POST',
    body: JSON.stringify({ source: 'manual', ...data }),
  });
}

export async function getConsultationMedications(
  consultationId: string
): Promise<ConsultationMed[]> {
  return apiFetch<ConsultationMed[]>(`/consultations/${consultationId}/medications`);
}

export async function uploadConsultationAttachment(
  consultationId: string,
  file: File,
  attachmentType: string
): Promise<ConsultationAttachment> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('attachment_type', attachmentType);
  return apiFetch<ConsultationAttachment>(`/consultations/${consultationId}/attachments`, {
    method: 'POST',
    body: formData,
  });
}

export async function getConsultationAttachments(
  consultationId: string
): Promise<ConsultationAttachment[]> {
  return apiFetch<ConsultationAttachment[]>(`/consultations/${consultationId}/attachments`);
}

export async function deleteConsultationAttachment(
  consultationId: string,
  attachmentId: string
): Promise<void> {
  await apiFetch<{ status: string }>(`/consultations/${consultationId}/attachments/${attachmentId}`, {
    method: 'DELETE',
  });
}

export function getAttachmentStreamUrl(consultationId: string, attachmentId: string): string {
  return `${getApiBaseUrl()}/consultations/${consultationId}/attachments/${attachmentId}/file`;
}

export async function sendConsultationMessage(
  consultationId: string,
  message: string,
  attachmentId?: string
): Promise<ConsultationMsg> {
  return apiFetch<ConsultationMsg>(`/consultations/${consultationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message, attachment_id: attachmentId }),
  });
}

export async function getConsultationMessages(
  consultationId: string
): Promise<ConsultationMsg[]> {
  return apiFetch<ConsultationMsg[]>(`/consultations/${consultationId}/messages`);
}

// ━━━━━━━━━━━━━ PATIENT PRESCRIPTIONS ━━━━━━━━━━━━━

export async function getPatientPrescriptions(): Promise<PrescriptionItem[]> {
  return apiFetch<PrescriptionItem[]>('/patient/prescriptions');
}

// ━━━━━━━━━━━━━ DOCTOR API ━━━━━━━━━━━━━

export async function getDoctorConsultations(
  statusFilter?: string
): Promise<ConsultationListItem[]> {
  const params = statusFilter ? `?status=${statusFilter}` : '';
  return apiFetch<ConsultationListItem[]>(`/doctor/consultations${params}`);
}

export async function getDoctorConsultationDetail(
  consultationId: string
): Promise<DoctorConsultationReview> {
  return apiFetch<DoctorConsultationReview>(`/doctor/consultations/${consultationId}`);
}

export async function uploadDoctorPrescription(
  consultationId: string,
  file: File
): Promise<ConsultationAttachment> {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch<ConsultationAttachment>(`/consultations/${consultationId}/prescription`, {
    method: 'POST',
    body: formData,
  });
}

export async function updateConsultationStatus(
  consultationId: string,
  status: string
): Promise<ConsultationItem> {
  return apiFetch<ConsultationItem>(`/doctor/consultations/${consultationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ━━━━━━━━━━━━━ RISK ANALYSIS ━━━━━━━━━━━━━

export interface RiskAnalysisRequest {
  medicine_1: string;
  medicine_2: string;
}

export interface RiskAnalysisResponse {
  medicine_1: string;
  medicine_2: string;
  interaction_level: string;
  summary: string;
  details: string;
  recommendation: string;
  data_source: string;
  disclaimer: string;
}

export async function analyzeMedicineRisk(
  medicine1: string,
  medicine2: string
): Promise<RiskAnalysisResponse> {
  return apiFetch<RiskAnalysisResponse>('/medicine/analyze', {
    method: 'POST',
    body: JSON.stringify({ medicine_1: medicine1, medicine_2: medicine2 }),
  });
}

// ━━━━━━━━━━━━━ WEBSOCKET ━━━━━━━━━━━━━

export function createConsultationWebSocket(
  consultationId: string,
  onMessage: (data: unknown) => void,
  onError?: (err: Event) => void
): WebSocket | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('medguard_token');
  if (!token) return null;

  const wsBase = getApiBaseUrl().replace(/^http/, 'ws');
  const ws = new WebSocket(`${wsBase}/ws/consultations/${consultationId}?token=${token}`);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch {
      onMessage(event.data);
    }
  };

  ws.onerror = (err) => {
    console.warn('WebSocket error:', err);
    onError?.(err);
  };

  return ws;
}

// ━━━━━━━━━━━━━ NOTIFICATIONS ━━━━━━━━━━━━━

export interface ConsultationNotification {
  id: string;
  type: 'new_consultation' | 'doctor_reply' | 'prescription_available' | 'new_message' | 'report_uploaded';
  title: string;
  description: string;
  consultationId: string;
  timestamp: string;
  read: boolean;
}

// Notification polling (falls back to REST when WebSocket is not connected)
export async function getPatientNotifications(): Promise<ConsultationNotification[]> {
  // For now, derive notifications from consultation status changes
  try {
    const prescriptions = await getPatientPrescriptions();
    const notifications: ConsultationNotification[] = [];
    prescriptions.forEach((p) => {
      notifications.push({
        id: `notif-rx-${p.id}`,
        type: 'prescription_available',
        title: 'New Prescription Available',
        description: `${p.doctor_name} uploaded a prescription.`,
        consultationId: p.consultation_id,
        timestamp: p.uploaded_at,
        read: false,
      });
    });
    return notifications;
  } catch {
    return [];
  }
}

// ━━━━━━━━━━━━━ AUTH HELPERS ━━━━━━━━━━━━━

export async function loginUser(
  email: string,
  password: string
): Promise<{ access_token: string; user: { id: string; name: string; email: string; role: string } }> {
  const res = await apiFetch<{ access_token: string; user: { id: string; name: string; email: string; role: string } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (typeof window !== 'undefined') {
    localStorage.setItem('medguard_token', res.access_token);
    localStorage.setItem('medguard_user', JSON.stringify(res.user));
  }
  return res;
}

export function getStoredConsultationUser(): { id: string; name: string; email: string; role: string } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('medguard_user');
  return raw ? JSON.parse(raw) : null;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('medguard_token');
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('medguard_token');
  localStorage.removeItem('medguard_user');
}
