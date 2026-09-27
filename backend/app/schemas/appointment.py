from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from app.models.appointment import AppointmentStatus

class AppointmentCreate(BaseModel):
    doctor_id: Optional[str] = Field(None, description="Optional target doctor ID")
    appointment_date: str = Field(..., description="Date of appointment, e.g. '2026-09-28'")
    appointment_time: str = Field(..., description="Time of appointment, e.g. '10:30 AM'")
    appointment_type: str = Field(default="General Consultation", description="Appointment specialty or category")
    notes: Optional[str] = Field(None, description="Optional patient notes or reason for visit")

class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus = Field(..., description="Updated status: upcoming, confirmed, completed, cancelled")

class AppointmentResponse(BaseModel):
    id: str
    patient_id: str
    doctor_id: Optional[str] = None
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    appointment_date: str
    appointment_time: str
    appointment_type: str
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
