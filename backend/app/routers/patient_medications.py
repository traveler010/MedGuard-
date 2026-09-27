from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.models.medication import LogStatus
from app.auth.dependencies import require_patient
from app.schemas.medication import (
    MedicationCreate,
    MedicationUpdate,
    MedicationResponse,
    ReminderItemResponse,
    MedicationLogResponse,
)
from app.services.medication_service import (
    get_patient_medications,
    get_medication_by_id,
    create_patient_medication,
    update_patient_medication,
    delete_patient_medication,
    get_patient_reminders,
    update_reminder_status,
)

router = APIRouter(prefix="/patients/me", tags=["Patient Medications & Reminders"])

@router.get(
    "/medications",
    response_model=List[MedicationResponse],
    summary="List patient's prescribed medicines",
    description="Returns all active and scheduled medications for the currently authenticated patient."
)
def list_my_medications(
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    return get_patient_medications(db, current_patient.id)

@router.post(
    "/medications",
    response_model=MedicationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new medication with schedule",
    description="Creates a new medication with scheduled intake times and initializes upcoming reminder logs."
)
def create_medication(
    data: MedicationCreate,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    return create_patient_medication(db, current_patient.id, data)

@router.get(
    "/medications/{id}",
    response_model=MedicationResponse,
    summary="Get single medication details",
    description="Retrieves a specific medication belonging to the authenticated patient."
)
def get_medication(
    id: str,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    medication = get_medication_by_id(db, id, current_patient.id)
    if not medication:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medication not found or does not belong to you."
        )
    return MedicationResponse.model_validate(medication)

@router.put(
    "/medications/{id}",
    response_model=MedicationResponse,
    summary="Update medication details or schedule",
    description="Updates prescription parameters, dosage, or scheduled times for the authenticated patient."
)
def update_medication(
    id: str,
    data: MedicationUpdate,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    medication = get_medication_by_id(db, id, current_patient.id)
    if not medication:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medication not found or does not belong to you."
        )
    return update_patient_medication(db, medication, data)

@router.delete(
    "/medications/{id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a medication",
    description="Permanently removes a medication and its scheduled reminders."
)
def delete_medication(
    id: str,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    medication = get_medication_by_id(db, id, current_patient.id)
    if not medication:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medication not found or does not belong to you."
        )
    delete_patient_medication(db, medication)
    return {"status": "success", "message": f"Medication '{medication.medicine_name}' removed."}

# ━━━━━━━━━━━━━━━━━━ REMINDER ENDPOINTS ━━━━━━━━━━━━━━━━━━

@router.get(
    "/reminders",
    response_model=List[ReminderItemResponse],
    summary="Get active reminders for target date or today",
    description="Returns scheduled medication reminders for the given date (default today) with their current status (upcoming, taken, skipped, missed)."
)
def list_my_reminders(
    target_date: Optional[str] = None,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    return get_patient_reminders(db, current_patient.id, target_date=target_date)

@router.get(
    "/reminders/today",
    response_model=List[ReminderItemResponse],
    summary="Get today's scheduled medicine reminders",
    description="Direct endpoint returning today's scheduled dose reminders with independent daily statuses."
)
def list_my_reminders_today(
    target_date: Optional[str] = None,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    return get_patient_reminders(db, current_patient.id, target_date=target_date)

@router.get(
    "/medication-history",
    response_model=List[MedicationLogResponse],
    summary="Get patient medication intake history",
    description="Returns full chronological record of taken, skipped, and missed doses."
)
def get_my_medication_history(
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    from app.services.medication_service import get_patient_medication_history
    return get_patient_medication_history(db, current_patient.id)

@router.post(
    "/reminders/{id}/taken",
    response_model=MedicationLogResponse,
    status_code=status.HTTP_200_OK,
    summary="Mark reminder as Taken",
    description="Records that the patient has taken the medicine and saves the exact action timestamp. The frontend stops the alarm."
)
def mark_reminder_taken(
    id: str,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    try:
        updated_log = update_reminder_status(db, id, current_patient.id, LogStatus.TAKEN.value)
        return MedicationLogResponse(
            id=updated_log.id,
            medication_id=updated_log.medication_id,
            medicine_name=updated_log.medication.medicine_name if updated_log.medication else None,
            dose=updated_log.medication.dose if updated_log.medication else None,
            scheduled_date=updated_log.scheduled_date,
            scheduled_time=updated_log.scheduled_time,
            status=updated_log.status,
            action_time=updated_log.action_time,
            created_at=updated_log.created_at,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

@router.post(
    "/reminders/{id}/skip",
    response_model=MedicationLogResponse,
    status_code=status.HTTP_200_OK,
    summary="Mark reminder as Skipped",
    description="Records that the patient chose to skip the medicine dose and saves the exact action timestamp. The frontend stops the alarm."
)
def mark_reminder_skipped(
    id: str,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    try:
        updated_log = update_reminder_status(db, id, current_patient.id, LogStatus.SKIPPED.value)
        return MedicationLogResponse(
            id=updated_log.id,
            medication_id=updated_log.medication_id,
            medicine_name=updated_log.medication.medicine_name if updated_log.medication else None,
            dose=updated_log.medication.dose if updated_log.medication else None,
            scheduled_date=updated_log.scheduled_date,
            scheduled_time=updated_log.scheduled_time,
            status=updated_log.status,
            action_time=updated_log.action_time,
            created_at=updated_log.created_at,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
