from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.auth.dependencies import require_doctor
from app.schemas.medication import (
    MedicationResponse,
    MedicationLogResponse,
    AdherenceSummaryResponse,
)
from app.services.medication_service import (
    get_patient_medications,
    get_doctor_patient_medication_history,
    get_doctor_patient_medication_adherence,
)

router = APIRouter(prefix="/doctor/patients", tags=["Doctor Medication Tracking"])

@router.get(
    "/{patient_id}/medications",
    response_model=List[MedicationResponse],
    summary="View patient's current medicines and schedules",
    description="Allows an authenticated doctor to monitor all active prescriptions and scheduled times for a specific patient."
)
def get_patient_medications_for_doctor(
    patient_id: str,
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    patient = db.query(User).filter(User.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found."
        )
    return get_patient_medications(db, patient_id)

@router.get(
    "/{patient_id}/medication-history",
    response_model=List[MedicationLogResponse],
    summary="View patient's chronological medication history",
    description="Returns chronological intake history including Taken, Missed, and Skipped doses with exact action timestamps."
)
def get_patient_medication_history_for_doctor(
    patient_id: str,
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    patient = db.query(User).filter(User.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found."
        )
    return get_doctor_patient_medication_history(db, patient_id)

@router.get(
    "/{patient_id}/medication-adherence",
    response_model=AdherenceSummaryResponse,
    summary="View patient's medication adherence summary",
    description="Provides mathematical adherence rate calculated from intake logs (Taken vs Missed/Skipped). Strictly observational; no automated diagnosis."
)
def get_patient_medication_adherence_for_doctor(
    patient_id: str,
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    patient = db.query(User).filter(User.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found."
        )
    return get_doctor_patient_medication_adherence(db, patient_id)
