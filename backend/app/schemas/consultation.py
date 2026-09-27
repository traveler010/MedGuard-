from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from app.models.consultation import ConsultationStatus, MedicationSource, AttachmentType

# ━━━━━━━━━━━━━ MEDICATION SCHEMAS ━━━━━━━━━━━━━

class ConsultationMedicationCreate(BaseModel):
    medicine_name: str = Field(..., min_length=1, description="Name of the medicine")
    dose: str = Field(..., min_length=1, description="Dosage (e.g. 500 mg)")
    frequency: str = Field(..., min_length=1, description="Frequency (e.g. Twice daily)")
    scheduled_times: Optional[str] = Field(None, description="Intake times (e.g. 08:00 AM • 08:00 PM)")
    start_date: Optional[str] = Field(None, description="Start date (YYYY-MM-DD)")
    end_date: Optional[str] = Field(None, description="End date (YYYY-MM-DD)")
    instructions: Optional[str] = Field(None, description="Patient instructions")
    source: Optional[str] = Field(MedicationSource.MANUAL.value, description="manual, uploaded_prescription, uploaded_medicine_image")

class ConsultationMedicationResponse(BaseModel):
    id: str
    consultation_id: str
    medicine_name: str
    dose: str
    frequency: str
    scheduled_times: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    instructions: Optional[str] = None
    source: str
    created_at: datetime

    class Config:
        from_attributes = True

# ━━━━━━━━━━━━━ ATTACHMENT SCHEMAS ━━━━━━━━━━━━━

class ConsultationAttachmentResponse(BaseModel):
    id: str
    consultation_id: str
    uploaded_by: str
    file_name: str
    file_type: str
    attachment_type: str
    file_size: Optional[int] = 0
    uploaded_at: datetime
    download_url: Optional[str] = None

    class Config:
        from_attributes = True

# ━━━━━━━━━━━━━ MESSAGE SCHEMAS ━━━━━━━━━━━━━

class ConsultationMessageCreate(BaseModel):
    message: str = Field(..., min_length=1, description="Message text")
    attachment_id: Optional[str] = Field(None, description="Optional attached document or prescription ID")

class ConsultationMessageResponse(BaseModel):
    id: str
    consultation_id: str
    sender_id: str
    sender_role: str
    sender_name: Optional[str] = None
    message: str
    attachment_id: Optional[str] = None
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ━━━━━━━━━━━━━ REPORT SCHEMAS (LEGACY BACKWARDS COMPATIBILITY) ━━━━━━━━━━━━━

class ConsultationReportBase(BaseModel):
    symptoms: str = Field(..., min_length=1, description="Primary symptoms described by the patient")
    duration: str = Field(..., min_length=1, description="Duration of symptoms, e.g. '3 days'")
    severity: str = Field(..., min_length=1, description="Subjective severity, e.g. 'Mild', 'Moderate', 'Severe'")
    associated_symptoms: Optional[str] = Field(None, description="Other associated symptoms")
    current_medicines: Optional[str] = Field(None, description="Medicines currently taken")
    relevant_history: Optional[str] = Field(None, description="Relevant medical or family history")

class ConsultationReportResponse(ConsultationReportBase):
    id: str
    consultation_id: str
    summary: str
    disclaimer: str = "Preliminary Symptom Summary — Not a Medical Diagnosis"
    created_at: datetime

    class Config:
        from_attributes = True

# ━━━━━━━━━━━━━ CONSULTATION CORE SCHEMAS ━━━━━━━━━━━━━

class ConsultationCreate(BaseModel):
    doctor_id: Optional[str] = Field(None, description="Assigned doctor ID")
    appointment_id: Optional[str] = Field(None, description="Associated appointment ID")
    initial_message: Optional[str] = Field(None, description="Patient's initial message or question")
    # Legacy questionnaire fields supported as optional
    symptoms: Optional[str] = Field(None, description="Primary symptoms")
    duration: Optional[str] = Field(None, description="Duration of symptoms")
    severity: Optional[str] = Field(None, description="Severity")
    associated_symptoms: Optional[str] = Field(None, description="Associated symptoms")
    current_medicines: Optional[str] = Field(None, description="Current medicines")
    relevant_history: Optional[str] = Field(None, description="Relevant history")

class ConsultationStatusUpdate(BaseModel):
    status: str = Field(..., description="Target status: active, waiting_for_doctor, waiting_for_patient, completed, under_review, reviewed")

class ConsultationResponse(BaseModel):
    id: str
    patient_id: str
    doctor_id: Optional[str] = None
    appointment_id: Optional[str] = None
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    status: str
    started_at: Optional[datetime] = None
    last_activity_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    medications: List[ConsultationMedicationResponse] = []
    attachments: List[ConsultationAttachmentResponse] = []
    messages: List[ConsultationMessageResponse] = []
    report: Optional[ConsultationReportResponse] = None

    class Config:
        from_attributes = True

class ConsultationListItem(BaseModel):
    id: str
    patient_id: str
    doctor_id: Optional[str] = None
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    status: str
    started_at: Optional[datetime] = None
    last_activity_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    symptoms: Optional[str] = None
    severity: Optional[str] = None
    summary: Optional[str] = None
    message_count: int = 0
    medication_count: int = 0
    attachment_count: int = 0

    class Config:
        from_attributes = True

# ━━━━━━━━━━━━━ DOCTOR REVIEW SCHEMAS ━━━━━━━━━━━━━

class PatientPrescriptionItem(BaseModel):
    id: str
    consultation_id: str
    doctor_name: str
    file_name: str
    file_type: str
    uploaded_at: datetime
    status: str = "Available"
    download_url: str

class DoctorConsultationDetail(BaseModel):
    id: Optional[str] = None
    patient_id: Optional[str] = None
    doctor_id: Optional[str] = None
    status: Optional[str] = None
    report: Optional[ConsultationReportResponse] = None
    messages: List[ConsultationMessageResponse] = []
    consultation: ConsultationResponse
    patient: dict
    current_medicines: List[dict] = []
    manually_entered_medicines: List[ConsultationMedicationResponse] = []
    uploaded_prescriptions: List[ConsultationAttachmentResponse] = []
    medicine_images: List[ConsultationAttachmentResponse] = []
    medical_reports: List[ConsultationAttachmentResponse] = []
    patient_messages: List[ConsultationMessageResponse] = []
    consultation_status: str

