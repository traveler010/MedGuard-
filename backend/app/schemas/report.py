from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

class HealthMetricsBase(BaseModel):
    blood_pressure: Optional[str] = Field(None, description="e.g. '120/80 mmHg'")
    blood_count: Optional[str] = Field(None, description="e.g. '4.8 million/mcL'")
    haemoglobin: Optional[str] = Field(None, description="e.g. '14.2 g/dL'")
    other_metrics: Optional[str] = Field(None, description="Additional metrics as string or JSON")

class HealthMetricsCreate(HealthMetricsBase):
    pass

class HealthMetricsResponse(HealthMetricsBase):
    id: str
    patient_id: str
    report_id: Optional[str] = None
    recorded_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class MedicalReportResponse(BaseModel):
    id: str
    patient_id: str
    title: str
    report_type: str
    file_name: str
    file_size: int
    mime_type: str
    created_at: datetime
    health_metrics: List[HealthMetricsResponse] = []

    class Config:
        from_attributes = True

class PatientProfileResponse(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None

    class Config:
        from_attributes = True
