from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.auth.dependencies import require_patient
from app.schemas.consultation import (
    ConsultationCreate,
    ConsultationResponse,
    ConsultationListItem,
    ConsultationMessageCreate,
    ConsultationMessageResponse,
)
from app.services.consultation_service import (
    create_patient_consultation,
    get_patient_consultations,
    get_consultation_by_id_for_patient,
    add_message_to_consultation,
)

from app.models.consultation import ConsultationStatus

router = APIRouter(prefix="/patients/me/consultations", tags=["Patient Consultations"])

@router.post(
    "",
    response_model=ConsultationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit symptom questionnaire and create consultation",
    description=(
        "Registers a patient consultation with a preliminary symptom summary report. "
        "Strictly provides an objective symptom summary and does NOT provide automated medical diagnosis."
    )
)
def submit_consultation(
    data: ConsultationCreate,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    return create_patient_consultation(db, current_patient.id, data, initial_status=ConsultationStatus.NEW.value)

@router.get(
    "",
    response_model=List[ConsultationListItem],
    summary="View patient consultation history",
    description="Returns all consultations submitted by the authenticated patient in chronological order."
)
def list_my_consultations(
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    return get_patient_consultations(db, current_patient.id)

@router.get(
    "/{consultation_id}",
    response_model=ConsultationResponse,
    summary="View consultation details, report, and messages",
    description="Retrieves the detailed consultation thread including the preliminary symptom report and clinical messages."
)
def get_my_consultation_detail(
    consultation_id: str,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    consultation = get_consultation_by_id_for_patient(db, consultation_id, current_patient.id)
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Consultation with ID '{consultation_id}' not found for current patient."
        )
    return consultation

@router.post(
    "/{consultation_id}/messages",
    response_model=ConsultationMessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Send a message in the consultation thread",
    description="Enables the patient to send follow-up details or responses to the consulting physician."
)
async def send_patient_message(
    consultation_id: str,
    data: ConsultationMessageCreate,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    from app.models.consultation import Consultation
    consultation = db.query(Consultation).filter(
        Consultation.id == consultation_id,
        Consultation.patient_id == current_patient.id
    ).first()
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Consultation with ID '{consultation_id}' not found for current patient."
        )
    return await add_message_to_consultation(
        db,
        consultation_id=consultation_id,
        sender_id=current_patient.id,
        sender_role="patient",
        message_text=data.message,
    )
