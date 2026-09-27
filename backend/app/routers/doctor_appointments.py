from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.auth.dependencies import require_doctor
from app.schemas.appointment import AppointmentResponse, AppointmentStatusUpdate
from app.services.appointment_service import (
    get_doctor_appointments,
    get_doctor_appointment_by_id,
    update_appointment_status,
)

router = APIRouter(prefix="/doctor/appointments", tags=["Doctor Appointments"])

@router.get(
    "",
    response_model=List[AppointmentResponse],
    summary="List doctor appointments",
    description="Retrieves upcoming, confirmed, or completed clinical appointments.",
)
def list_appointments(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status: upcoming, confirmed, completed, cancelled"),
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    return get_doctor_appointments(db, current_doctor.id, status_filter=status_filter)

@router.get(
    "/{appointment_id}",
    response_model=AppointmentResponse,
    summary="Get doctor appointment details",
    description="Loads complete appointment information including patient data and notes.",
)
def get_appointment(
    appointment_id: str,
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    appointment = get_doctor_appointment_by_id(db, appointment_id, current_doctor.id)
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with ID '{appointment_id}' not found or access unauthorized.",
        )
    return appointment

@router.patch(
    "/{appointment_id}/status",
    response_model=AppointmentResponse,
    summary="Update appointment status",
    description="Enables doctor to update appointment status (e.g. confirmed, completed, cancelled).",
)
def update_status(
    appointment_id: str,
    data: AppointmentStatusUpdate,
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    updated = update_appointment_status(
        db,
        appointment_id=appointment_id,
        doctor_id=current_doctor.id,
        new_status=data.status,
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Appointment with ID '{appointment_id}' not found or update unauthorized.",
        )
    return updated
