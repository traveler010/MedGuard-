from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.auth.dependencies import require_patient
from app.schemas.appointment import AppointmentCreate, AppointmentResponse
from app.services.appointment_service import (
    create_appointment,
    get_patient_appointments,
    get_patient_appointment_by_id,
)

router = APIRouter(prefix="/patients/me/appointments", tags=["Patient Appointments"])

@router.get(
    "",
    response_model=List[AppointmentResponse],
    summary="List patient appointments",
    description="Returns all appointments scheduled for the authenticated patient.",
)
def list_appointments(
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    return get_patient_appointments(db, current_patient.id)

@router.post(
    "",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Book a new appointment",
    description="Schedules a new appointment with an assigned or clinic doctor.",
)
def book_appointment(
    data: AppointmentCreate,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    return create_appointment(db, current_patient.id, data)

@router.get(
    "/{appointment_id}",
    response_model=AppointmentResponse,
    summary="Get appointment details",
    description="Retrieves a single appointment by ID ensuring patient isolation.",
)
def get_appointment(
    appointment_id: str,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    appointment = get_patient_appointment_by_id(db, appointment_id, current_patient.id)
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with ID '{appointment_id}' not found.",
        )
    return appointment
