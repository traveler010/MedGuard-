from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.schemas.medication import MedicationResponse, ReminderItemResponse, AdherenceSummaryResponse
from app.schemas.report import MedicalReportResponse
from app.schemas.appointment import AppointmentResponse
from app.schemas.consultation import ConsultationListItem

class HealthMetricsSummary(BaseModel):
    blood_pressure: Optional[str] = "Not available"
    blood_count: Optional[str] = "Not available"
    haemoglobin: Optional[str] = "Not available"
    other_metrics: Optional[str] = None
    recorded_at: Optional[str] = None

class PatientInfoSummary(BaseModel):
    id: str
    name: str
    email: str
    role: str
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None

class PatientDashboardResponse(BaseModel):
    patient_info: PatientInfoSummary
    health_metrics: HealthMetricsSummary
    recent_reports: List[MedicalReportResponse] = []
    current_medicines: List[MedicationResponse] = []
    today_reminders: List[ReminderItemResponse] = []
    upcoming_appointments: List[AppointmentResponse] = []
    recent_consultation_status: Optional[str] = None

class DoctorPatientDashboardResponse(BaseModel):
    patient_info: PatientInfoSummary
    health_metrics: HealthMetricsSummary
    recent_reports: List[MedicalReportResponse] = []
    current_medicines: List[MedicationResponse] = []
    medication_adherence: AdherenceSummaryResponse
    recent_consultations: List[ConsultationListItem] = []
    upcoming_appointments: List[AppointmentResponse] = []
