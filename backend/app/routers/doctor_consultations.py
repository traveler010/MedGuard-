from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.auth.dependencies import require_doctor
from app.schemas.consultation import (
    ConsultationResponse,
    ConsultationListItem,
    ConsultationStatusUpdate,
    ConsultationMessageCreate,
    ConsultationMessageResponse,
    DoctorConsultationDetail,
)
from app.services.consultation_service import (
    get_doctor_consultations,
    get_consultation_by_id_for_doctor,
    get_doctor_consultation_detail as get_doctor_review,
    update_consultation_status,
    add_message_to_consultation,
)

router = APIRouter(prefix="/doctor/consultations", tags=["Doctor Consultations"])

@router.get(
    "",
    response_model=List[ConsultationListItem],
    summary="View consultations available or assigned to doctor",
    description="Retrieves consultations awaiting clinical review or actively managed by the authenticated doctor."
)
def list_doctor_consultations(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status: new, under_review, reviewed"),
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    return get_doctor_consultations(db, current_doctor.id, status_filter=status_filter)

@router.get(
    "/{consultation_id}",
    response_model=DoctorConsultationDetail,
    summary="Open consultation workspace",
    description="Loads the patient's symptom summary report, clinical message history, medications, and status."
)
def get_doctor_consultation_detail(
    consultation_id: str,
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    return get_doctor_review(db, consultation_id, current_doctor.id)

@router.patch(
    "/{consultation_id}/status",
    response_model=ConsultationResponse,
    summary="Update consultation status",
    description="Enables doctor to update consultation status (e.g. mark as under_review or reviewed)."
)
def update_status(
    consultation_id: str,
    status_data: ConsultationStatusUpdate,
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    updated = update_consultation_status(
        db,
        consultation_id=consultation_id,
        doctor_id=current_doctor.id,
        new_status=status_data.status,
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Consultation with ID '{consultation_id}' not found or update not authorized."
        )
    return updated

@router.post(
    "/{consultation_id}/messages",
    response_model=ConsultationMessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Send clinical doctor response",
    description="Allows the consulting physician to send guidance, advice, or follow-up questions to the patient."
)
async def send_doctor_response(
    consultation_id: str,
    data: ConsultationMessageCreate,
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    from app.models.consultation import Consultation
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation or (consultation.doctor_id and consultation.doctor_id != current_doctor.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Consultation with ID '{consultation_id}' not found or doctor not authorized to post."
        )
    return await add_message_to_consultation(
        db,
        consultation_id=consultation_id,
        sender_id=current_doctor.id,
        sender_role="doctor",
        message_text=data.message,
    )
