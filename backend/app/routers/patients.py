from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.auth.dependencies import require_doctor, get_current_user
from app.schemas.patient import PatientCreateRequest, PatientResponse
from app.schemas.medication import MedicationResponse
from app.services.medication_service import get_patient_medications
from app.services.patient_service import (
    create_patient_record,
    get_all_patients_records,
    get_patient_record_by_id,
)

router = APIRouter(tags=["Patients Management"])

@router.post(
    "/doctor/patients",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new patient record (Doctor)",
    description="Registers a new clinical patient case with demographics, conditions, and medications permanently in the database.",
)
@router.post(
    "/patients",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new patient record",
    description="Alias endpoint for adding patient records.",
)
def add_patient(
    patient_data: PatientCreateRequest,
    db: Session = Depends(get_db),
):
    """Add a new patient record to the database."""
    return create_patient_record(db, patient_data)

@router.get(
    "/doctor/patients",
    response_model=List[PatientResponse],
    summary="List all patients (Doctor Directory)",
    description="Returns all registered patients with search filtering and clinical status flags.",
)
@router.get(
    "/patients",
    response_model=List[PatientResponse],
    summary="List all patients",
    description="Alias endpoint for listing patients.",
)
def list_patients(
    query: Optional[str] = Query(None, description="Search by name, ID, or condition"),
    risk: Optional[str] = Query(None, description="Filter by risk level (HIGH, MODERATE, LOW, ATTENTION)"),
    db: Session = Depends(get_db),
):
    """Get all patients from the database."""
    return get_all_patients_records(db, query=query, risk_filter=risk)

@router.get(
    "/doctor/patients/{patient_id}",
    response_model=PatientResponse,
    summary="Get patient details by ID",
    description="Returns full demographic and clinical summary for a specific patient.",
)
@router.get(
    "/patients/{patient_id}",
    response_model=PatientResponse,
    summary="Get patient details by ID",
    description="Alias endpoint for retrieving patient by ID.",
)
def get_patient(
    patient_id: str,
    db: Session = Depends(get_db),
):
    """Get a single patient record by ID."""
    patient = get_patient_record_by_id(db, patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found.",
        )
    return patient

@router.get(
    "/patients/{patient_id}/medications",
    response_model=List[MedicationResponse],
    summary="Get patient medications",
    description="Returns all active medications and schedules for a patient.",
)
def get_patient_medications_list(
    patient_id: str,
    db: Session = Depends(get_db),
):
    """Get all medications for a specific patient."""
    patient = db.query(User).filter(User.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found.",
        )
    return get_patient_medications(db, patient_id)

