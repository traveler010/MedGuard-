import uuid
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime

class PatientCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Full name of patient")
    patient_id: Optional[str] = Field(None, max_length=50, description="Custom patient ID or MRN (auto-generated if omitted)")
    age: Optional[int] = Field(50, ge=0, le=130, description="Age in years (0-130)")
    gender: Optional[str] = Field("Male", max_length=20, description="Gender (Male, Female, Other)")
    email: Optional[EmailStr] = Field(None, description="Patient contact email")
    phone: Optional[str] = Field(None, max_length=30, description="Contact phone number")
    address: Optional[str] = Field(None, max_length=255, description="Residential address or city")
    blood_group: Optional[str] = Field(None, max_length=10, description="Blood group (e.g., A+, O+, B-)")
    primary_condition: Optional[str] = Field(None, max_length=255, description="Primary clinical condition or diagnosis")
    medical_history: Optional[str] = Field(None, max_length=1000, description="Past medical history / comorbidities")
    medicine_name: Optional[str] = Field(None, max_length=255, description="Prescribed medicine name")
    current_medications: Optional[str] = Field(None, max_length=1000, description="Comma or line separated active medications")
    emergency_contact: Optional[str] = Field(None, max_length=100, description="Emergency contact name & phone")
    risk_level: Optional[str] = Field("LOW", description="Risk level: HIGH, MODERATE, LOW")

    @field_validator("name")
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Patient name cannot be empty.")
        return v

    @field_validator("gender")
    def validate_gender(cls, v: Optional[str]) -> str:
        if not v:
            return "Male"
        v = v.strip()
        if not v:
            return "Male"
        valid = ["male", "female", "other", "non-binary"]
        if v.lower() not in valid:
            return v.capitalize()
        return v.capitalize()

    @field_validator("risk_level")
    def validate_risk_level(cls, v: Optional[str]) -> str:
        if not v:
            return "LOW"
        v_upper = v.upper().strip()
        if v_upper not in ["HIGH", "MODERATE", "LOW"]:
            return "LOW"
        return v_upper

class PatientResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    blood_group: Optional[str] = None
    emergency_contact: Optional[str] = None
    primaryCondition: str = "General Consultation"
    riskLevel: str = "LOW"
    activeMedsCount: int = 0
    attentionNeeded: bool = False
    attentionReason: Optional[str] = None
    lastVisit: str = "Today"
    nextAppointment: Optional[str] = "None scheduled"
    created_at: Optional[str] = None
    medications: List[str] = Field(default_factory=list)
    primary_medicine: Optional[str] = None
    primaryMedicine: Optional[str] = None

    class Config:
        from_attributes = True
