from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from app.models.medication import LogStatus

class ScheduleCreate(BaseModel):
    scheduled_time: str = Field(..., description="Scheduled time, e.g. '08:00 AM' or '13:00'")

class ScheduleResponse(BaseModel):
    id: str
    medication_id: str
    scheduled_time: str
    created_at: datetime

    class Config:
        from_attributes = True

class MedicationCreate(BaseModel):
    medicine_name: str = Field(..., min_length=1, max_length=150, description="Name of medicine, e.g. 'Lisinopril'")
    dose: str = Field(..., min_length=1, max_length=50, description="Dose with units, e.g. '10 mg'")
    frequency: str = Field(..., min_length=1, max_length=100, description="Intake frequency, e.g. 'Once daily'")
    instructions: Optional[str] = Field(None, max_length=255, description="Instructions, e.g. 'Take with water after breakfast'")
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    active: bool = True
    scheduled_times: List[str] = Field(default_factory=list, description="List of times, e.g. ['08:00 AM', '08:00 PM']")

class MedicationUpdate(BaseModel):
    medicine_name: Optional[str] = Field(None, min_length=1, max_length=150)
    dose: Optional[str] = Field(None, min_length=1, max_length=50)
    frequency: Optional[str] = Field(None, min_length=1, max_length=100)
    instructions: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    active: Optional[bool] = None
    scheduled_times: Optional[List[str]] = None

class MedicationResponse(BaseModel):
    id: str
    patient_id: str
    medicine_name: str
    dose: str
    frequency: str
    instructions: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    active: bool
    created_at: datetime
    updated_at: datetime
    schedules: List[ScheduleResponse] = []
    current_status: Optional[str] = None

    class Config:
        from_attributes = True

class MedicationLogResponse(BaseModel):
    id: str
    medication_id: str
    medicine_name: Optional[str] = None
    dose: Optional[str] = None
    scheduled_date: Optional[str] = None
    scheduled_time: str
    status: str
    action_time: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ReminderItemResponse(BaseModel):
    id: str  # Unique identifier for the reminder (log_id or schedule_id)
    medication_id: str
    schedule_id: Optional[str] = None
    medicine_name: str
    dose: str
    frequency: str
    scheduled_date: Optional[str] = None
    scheduled_time: str
    status: str  # "upcoming", "taken", "skipped", "missed"
    action_time: Optional[datetime] = None

class AdherenceSummaryResponse(BaseModel):
    patient_id: str
    patient_name: str
    total_active_medicines: int
    total_logs_recorded: int
    taken_count: int
    missed_count: int
    skipped_count: int
    upcoming_count: int
    adherence_percentage: float  # e.g. 85.0
    adherence_label: str
    note: str = "Mathematical adherence percentage calculated from medication logs. No clinical diagnosis generated."
