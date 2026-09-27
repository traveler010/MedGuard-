import os
import uuid
import re
from typing import List, Optional, Tuple, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, UploadFile, status

from app.models.consultation import (
    Consultation,
    ConsultationMedication,
    ConsultationAttachment,
    ConsultationMessage,
    ConsultationReport,
    ConsultationStatus,
    MedicationSource,
    AttachmentType,
)
from app.models.user import User, UserRole
from app.models.medication import Medication
from app.schemas.consultation import (
    ConsultationCreate,
    ConsultationResponse,
    ConsultationListItem,
    ConsultationReportResponse,
    ConsultationMessageResponse,
    ConsultationMedicationCreate,
    ConsultationMedicationResponse,
    ConsultationAttachmentResponse,
    PatientPrescriptionItem,
    DoctorConsultationDetail,
)
from app.services.websocket_manager import consultation_ws_manager

PRELIMINARY_DISCLAIMER = "Preliminary Symptom Summary — Not a Medical Diagnosis"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/jpg", "application/pdf"}
MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB

def _get_storage_root() -> str:
    """Returns absolute path to controlled uploads directory."""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    storage_dir = os.path.join(base_dir, "uploads", "consultations")
    os.makedirs(storage_dir, exist_ok=True)
    return storage_dir

def _validate_file_security(file: UploadFile, content: bytes) -> str:
    """Validates extension, MIME type, and size. Returns sanitized extension."""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must have a filename."
        )

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension '{ext}' is not supported. Supported: JPG, JPEG, PNG, PDF."
        )

    # Validate size
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of 15 MB (actual: {len(content) / (1024*1024):.1f} MB)."
        )

    # Validate MIME type if provided
    if file.content_type and file.content_type.lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid MIME type '{file.content_type}'. Must be image/jpeg, image/png, or application/pdf."
        )

    return ext

def _build_consultation_summary(data: ConsultationCreate) -> str:
    """Generate structured symptom summary from patient responses. Strictly no medical diagnosis."""
    symptoms = data.symptoms or "General consultation and medication review"
    duration = data.duration or "Unspecified"
    severity = data.severity or "Moderate"
    assoc = data.associated_symptoms or "None reported"
    meds = data.current_medicines or "None reported"
    history = data.relevant_history or "None reported"
    
    return (
        f"Patient reports symptoms of '{symptoms}' with a duration of {duration}. "
        f"Subjective severity is reported as {severity}. "
        f"Associated symptoms: {assoc}. "
        f"Current medications: {meds}. "
        f"Relevant history: {history}."
    )

def _to_consultation_response(consultation: Consultation) -> ConsultationResponse:
    patient_name = consultation.patient.name if consultation.patient else None
    doctor_name = consultation.doctor.name if consultation.doctor else None

    report_resp = None
    if consultation.report:
        report_resp = ConsultationReportResponse.model_validate(consultation.report)

    medications_resp = [
        ConsultationMedicationResponse.model_validate(m) for m in consultation.medications
    ]

    attachments_resp = [
        ConsultationAttachmentResponse(
            id=a.id,
            consultation_id=a.consultation_id,
            uploaded_by=a.uploaded_by,
            file_name=a.file_name,
            file_type=a.file_type,
            attachment_type=a.attachment_type,
            file_size=a.file_size or 0,
            uploaded_at=a.uploaded_at,
            download_url=f"/consultations/{a.consultation_id}/attachments/{a.id}/file",
        )
        for a in consultation.attachments
    ]

    messages_resp = [
        ConsultationMessageResponse(
            id=msg.id,
            consultation_id=msg.consultation_id,
            sender_id=msg.sender_id,
            sender_role=msg.sender_role,
            sender_name=msg.sender.name if msg.sender else None,
            message=msg.message,
            attachment_id=msg.attachment_id,
            created_at=msg.created_at,
            read_at=msg.read_at,
        )
        for msg in consultation.messages
    ]

    return ConsultationResponse(
        id=consultation.id,
        patient_id=consultation.patient_id,
        doctor_id=consultation.doctor_id,
        appointment_id=consultation.appointment_id,
        patient_name=patient_name,
        doctor_name=doctor_name,
        status=consultation.status,
        started_at=consultation.started_at,
        last_activity_at=consultation.last_activity_at,
        completed_at=consultation.completed_at,
        created_at=consultation.created_at,
        updated_at=consultation.updated_at,
        medications=medications_resp,
        attachments=attachments_resp,
        messages=messages_resp,
        report=report_resp,
    )

def _to_consultation_list_item(consultation: Consultation) -> ConsultationListItem:
    patient_name = consultation.patient.name if consultation.patient else None
    doctor_name = consultation.doctor.name if consultation.doctor else None

    symptoms = consultation.report.symptoms if consultation.report else None
    severity = consultation.report.severity if consultation.report else None
    summary = consultation.report.summary if consultation.report else None

    return ConsultationListItem(
        id=consultation.id,
        patient_id=consultation.patient_id,
        doctor_id=consultation.doctor_id,
        patient_name=patient_name,
        doctor_name=doctor_name,
        status=consultation.status,
        started_at=consultation.started_at,
        last_activity_at=consultation.last_activity_at,
        completed_at=consultation.completed_at,
        created_at=consultation.created_at,
        updated_at=consultation.updated_at,
        symptoms=symptoms,
        severity=severity,
        summary=summary,
        message_count=len(consultation.messages),
        medication_count=len(consultation.medications),
        attachment_count=len(consultation.attachments),
    )

def check_consultation_access(consultation: Consultation, user: User) -> None:
    """Verifies that the user is the patient or assigned doctor of this consultation."""
    if user.role == UserRole.PATIENT.value and consultation.patient_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You can only view your own consultation."
        )
    if user.role == UserRole.DOCTOR.value and consultation.doctor_id and consultation.doctor_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You are not the assigned doctor for this consultation."
        )

# ━━━━━━━━━━━━━ CONSULTATION CRUD ━━━━━━━━━━━━━

def create_patient_consultation(
    db: Session, patient_id: str, data: ConsultationCreate, initial_status: Optional[str] = None
) -> ConsultationResponse:
    """Creates a new consultation for an authenticated patient, auto-assigning doctor if unassigned."""
    target_doctor_id = data.doctor_id

    now = datetime.now(timezone.utc)
    status_val = initial_status or (ConsultationStatus.NEW.value if data.symptoms else ConsultationStatus.WAITING_FOR_DOCTOR.value)
    consultation = Consultation(
        patient_id=patient_id,
        doctor_id=target_doctor_id,
        appointment_id=data.appointment_id,
        status=status_val,
        started_at=now,
        last_activity_at=now,
    )
    db.add(consultation)
    db.flush()

    # If questionnaire / symptoms provided, create ConsultationReport
    if data.symptoms:
        summary_text = _build_consultation_summary(data)
        report = ConsultationReport(
            consultation_id=consultation.id,
            symptoms=data.symptoms,
            duration=data.duration or "Recent",
            severity=data.severity or "Moderate",
            associated_symptoms=data.associated_symptoms,
            current_medicines=data.current_medicines,
            relevant_history=data.relevant_history,
            summary=summary_text,
            disclaimer=PRELIMINARY_DISCLAIMER,
        )
        db.add(report)

    # If initial message provided, create ConsultationMessage
    if data.initial_message:
        msg = ConsultationMessage(
            consultation_id=consultation.id,
            sender_id=patient_id,
            sender_role="patient",
            message=data.initial_message.strip(),
        )
        db.add(msg)

    db.commit()
    db.refresh(consultation)
    return _to_consultation_response(consultation)

def get_consultation_by_id(
    db: Session, consultation_id: str, user: User
) -> ConsultationResponse:
    """Fetches consultation by ID and validates patient/doctor authorization."""
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Consultation with ID '{consultation_id}' not found."
        )
    check_consultation_access(consultation, user)
    return _to_consultation_response(consultation)

def get_patient_consultations(
    db: Session, patient_id: str
) -> List[ConsultationListItem]:
    consultations = (
        db.query(Consultation)
        .filter(Consultation.patient_id == patient_id)
        .order_by(Consultation.created_at.desc())
        .all()
    )
    return [_to_consultation_list_item(c) for c in consultations]

def get_doctor_consultations(
    db: Session, doctor_id: str, status_filter: Optional[str] = None
) -> List[ConsultationListItem]:
    query = db.query(Consultation).filter(
        or_(Consultation.doctor_id == doctor_id, Consultation.doctor_id.is_(None))
    )
    if status_filter:
        query = query.filter(Consultation.status == status_filter)
    
    consultations = query.order_by(Consultation.created_at.desc()).all()
    return [_to_consultation_list_item(c) for c in consultations]

def update_consultation_status(
    db: Session, consultation_id: str, doctor_id: str, new_status: str
) -> ConsultationResponse:
    consultation = (
        db.query(Consultation)
        .filter(Consultation.id == consultation_id)
        .first()
    )
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Consultation with ID '{consultation_id}' not found."
        )
    
    # Assign doctor if unassigned
    if not consultation.doctor_id:
        consultation.doctor_id = doctor_id
    elif consultation.doctor_id != doctor_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this consultation."
        )

    consultation.status = new_status
    consultation.last_activity_at = datetime.now(timezone.utc)
    if new_status in [ConsultationStatus.COMPLETED.value, ConsultationStatus.REVIEWED.value]:
        consultation.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(consultation)
    return _to_consultation_response(consultation)

# ━━━━━━━━━━━━━ CONSULTATION MEDICATIONS ━━━━━━━━━━━━━

def add_consultation_medication(
    db: Session, consultation_id: str, data: ConsultationMedicationCreate, user: User
) -> ConsultationMedicationResponse:
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation not found."
        )
    check_consultation_access(consultation, user)

    med = ConsultationMedication(
        consultation_id=consultation_id,
        medicine_name=data.medicine_name.strip(),
        dose=data.dose.strip(),
        frequency=data.frequency.strip(),
        scheduled_times=data.scheduled_times.strip() if data.scheduled_times else None,
        start_date=data.start_date,
        end_date=data.end_date,
        instructions=data.instructions.strip() if data.instructions else None,
        source=data.source or MedicationSource.MANUAL.value,
    )
    db.add(med)
    consultation.last_activity_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(med)
    return ConsultationMedicationResponse.model_validate(med)

def get_consultation_medications(
    db: Session, consultation_id: str, user: User
) -> List[ConsultationMedicationResponse]:
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found.")
    check_consultation_access(consultation, user)

    meds = (
        db.query(ConsultationMedication)
        .filter(ConsultationMedication.consultation_id == consultation_id)
        .order_by(ConsultationMedication.created_at.asc())
        .all()
    )
    return [ConsultationMedicationResponse.model_validate(m) for m in meds]

# ━━━━━━━━━━━━━ FILE ATTACHMENTS ━━━━━━━━━━━━━

def add_consultation_attachment(
    db: Session,
    consultation_id: str,
    file: UploadFile,
    attachment_type: str,
    user: User,
) -> ConsultationAttachmentResponse:
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found.")
    check_consultation_access(consultation, user)

    content = file.file.read()
    ext = _validate_file_security(file, content)

    # Secure storage location
    storage_root = _get_storage_root()
    consultation_dir = os.path.join(storage_root, consultation_id)
    os.makedirs(consultation_dir, exist_ok=True)

    safe_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', file.filename)
    unique_filename = f"{uuid.uuid4().hex[:12]}_{safe_name}"
    abs_file_path = os.path.join(consultation_dir, unique_filename)

    with open(abs_file_path, "wb") as f:
        f.write(content)

    rel_file_path = os.path.join("uploads", "consultations", consultation_id, unique_filename)

    attachment = ConsultationAttachment(
        consultation_id=consultation_id,
        uploaded_by=user.id,
        file_name=file.filename,
        file_type=file.content_type or f"application/{ext.replace('.', '')}",
        file_path=rel_file_path,
        file_size=len(content),
        attachment_type=attachment_type,
    )
    db.add(attachment)

    consultation.last_activity_at = datetime.now(timezone.utc)
    if user.role == UserRole.PATIENT.value:
        consultation.status = ConsultationStatus.WAITING_FOR_DOCTOR.value

    db.commit()
    db.refresh(attachment)

    return ConsultationAttachmentResponse(
        id=attachment.id,
        consultation_id=attachment.consultation_id,
        uploaded_by=attachment.uploaded_by,
        file_name=attachment.file_name,
        file_type=attachment.file_type,
        attachment_type=attachment.attachment_type,
        file_size=attachment.file_size,
        uploaded_at=attachment.uploaded_at,
        download_url=f"/consultations/{consultation_id}/attachments/{attachment.id}/file",
    )

def get_consultation_attachments(
    db: Session, consultation_id: str, user: User
) -> List[ConsultationAttachmentResponse]:
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found.")
    check_consultation_access(consultation, user)

    attachments = (
        db.query(ConsultationAttachment)
        .filter(ConsultationAttachment.consultation_id == consultation_id)
        .order_by(ConsultationAttachment.uploaded_at.asc())
        .all()
    )
    return [
        ConsultationAttachmentResponse(
            id=a.id,
            consultation_id=a.consultation_id,
            uploaded_by=a.uploaded_by,
            file_name=a.file_name,
            file_type=a.file_type,
            attachment_type=a.attachment_type,
            file_size=a.file_size,
            uploaded_at=a.uploaded_at,
            download_url=f"/consultations/{consultation_id}/attachments/{a.id}/file",
        )
        for a in attachments
    ]

def delete_consultation_attachment(
    db: Session, consultation_id: str, attachment_id: str, user: User
) -> None:
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found.")
    check_consultation_access(consultation, user)

    attachment = (
        db.query(ConsultationAttachment)
        .filter(ConsultationAttachment.id == attachment_id, ConsultationAttachment.consultation_id == consultation_id)
        .first()
    )
    if not attachment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attachment not found.")

    if user.role == UserRole.PATIENT.value and attachment.uploaded_by != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only delete your own attachments.")

    # Remove physical file
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    abs_path = os.path.join(base_dir, attachment.file_path)
    if os.path.exists(abs_path):
        try:
            os.remove(abs_path)
        except Exception:
            pass

    db.delete(attachment)
    db.commit()

def get_attachment_file_path(
    db: Session, consultation_id: str, attachment_id: str, user: User
) -> Tuple[str, str, str]:
    """Returns (abs_path, filename, media_type) for secure authenticated streaming."""
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found.")
    check_consultation_access(consultation, user)

    attachment = (
        db.query(ConsultationAttachment)
        .filter(ConsultationAttachment.id == attachment_id, ConsultationAttachment.consultation_id == consultation_id)
        .first()
    )
    if not attachment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attachment not found.")

    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    abs_path = os.path.join(base_dir, attachment.file_path)
    if not os.path.exists(abs_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File content not found on server.")

    return abs_path, attachment.file_name, attachment.file_type

# ━━━━━━━━━━━━━ MESSAGES & REAL-TIME ━━━━━━━━━━━━━

async def add_message_to_consultation(
    db: Session,
    consultation_id: str,
    sender_id: str,
    sender_role: str,
    message_text: str,
    attachment_id: Optional[str] = None,
) -> ConsultationMessageResponse:
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found.")

    sender = db.query(User).filter(User.id == sender_id).first()
    if not sender:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sender user not found.")

    msg = ConsultationMessage(
        consultation_id=consultation_id,
        sender_id=sender_id,
        sender_role=sender_role,
        message=message_text.strip(),
        attachment_id=attachment_id,
    )
    db.add(msg)

    # Update consultation activity and status
    now = datetime.now(timezone.utc)
    consultation.last_activity_at = now
    if sender_role == UserRole.PATIENT.value:
        consultation.status = ConsultationStatus.WAITING_FOR_DOCTOR.value
    elif sender_role == UserRole.DOCTOR.value:
        consultation.status = ConsultationStatus.WAITING_FOR_PATIENT.value

    db.commit()
    db.refresh(msg)

    resp = ConsultationMessageResponse(
        id=msg.id,
        consultation_id=msg.consultation_id,
        sender_id=msg.sender_id,
        sender_role=msg.sender_role,
        sender_name=sender.name,
        message=msg.message,
        attachment_id=msg.attachment_id,
        created_at=msg.created_at,
        read_at=msg.read_at,
    )

    # Real-time WebSocket broadcast
    payload = {
        "event": "new_message",
        "consultation_id": consultation_id,
        "message": resp.model_dump(mode="json"),
        "consultation_status": consultation.status,
    }
    await consultation_ws_manager.broadcast(consultation_id, payload)

    return resp

def get_consultation_messages(
    db: Session, consultation_id: str, user: User
) -> List[ConsultationMessageResponse]:
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found.")
    check_consultation_access(consultation, user)

    # Mark unread messages sent by the other party as read
    other_role = "doctor" if user.role == UserRole.PATIENT.value else "patient"
    unread_messages = (
        db.query(ConsultationMessage)
        .filter(
            ConsultationMessage.consultation_id == consultation_id,
            ConsultationMessage.sender_role == other_role,
            ConsultationMessage.read_at.is_(None),
        )
        .all()
    )
    if unread_messages:
        now = datetime.now(timezone.utc)
        for m in unread_messages:
            m.read_at = now
        db.commit()

    messages = (
        db.query(ConsultationMessage)
        .filter(ConsultationMessage.consultation_id == consultation_id)
        .order_by(ConsultationMessage.created_at.asc())
        .all()
    )

    return [
        ConsultationMessageResponse(
            id=m.id,
            consultation_id=m.consultation_id,
            sender_id=m.sender_id,
            sender_role=m.sender_role,
            sender_name=m.sender.name if m.sender else None,
            message=m.message,
            attachment_id=m.attachment_id,
            created_at=m.created_at,
            read_at=m.read_at,
        )
        for m in messages
    ]

# ━━━━━━━━━━━━━ DOCTOR PRESCRIPTIONS ━━━━━━━━━━━━━

def upload_doctor_prescription(
    db: Session, consultation_id: str, file: UploadFile, doctor: User
) -> PatientPrescriptionItem:
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found.")
    
    if consultation.doctor_id and consultation.doctor_id != doctor.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not the doctor for this consultation.")
    if not consultation.doctor_id:
        consultation.doctor_id = doctor.id

    content = file.file.read()
    ext = _validate_file_security(file, content)

    storage_root = _get_storage_root()
    consultation_dir = os.path.join(storage_root, consultation_id)
    os.makedirs(consultation_dir, exist_ok=True)

    safe_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', file.filename)
    unique_filename = f"rx_{uuid.uuid4().hex[:12]}_{safe_name}"
    abs_file_path = os.path.join(consultation_dir, unique_filename)

    with open(abs_file_path, "wb") as f:
        f.write(content)

    rel_file_path = os.path.join("uploads", "consultations", consultation_id, unique_filename)

    attachment = ConsultationAttachment(
        consultation_id=consultation_id,
        uploaded_by=doctor.id,
        file_name=file.filename,
        file_type=file.content_type or f"application/{ext.replace('.', '')}",
        file_path=rel_file_path,
        file_size=len(content),
        attachment_type=AttachmentType.DOCTOR_PRESCRIPTION.value,
    )
    db.add(attachment)

    consultation.last_activity_at = datetime.now(timezone.utc)
    consultation.status = ConsultationStatus.COMPLETED.value
    consultation.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(attachment)

    return PatientPrescriptionItem(
        id=attachment.id,
        consultation_id=consultation.id,
        doctor_name=doctor.name,
        file_name=attachment.file_name,
        file_type=attachment.file_type,
        uploaded_at=attachment.uploaded_at,
        status="Available",
        download_url=f"/consultations/{consultation.id}/attachments/{attachment.id}/file",
    )

def get_patient_prescriptions(
    db: Session, patient_id: str
) -> List[PatientPrescriptionItem]:
    """Retrieves all doctor prescriptions issued across consultations for this patient."""
    attachments = (
        db.query(ConsultationAttachment)
        .join(Consultation, ConsultationAttachment.consultation_id == Consultation.id)
        .filter(
            Consultation.patient_id == patient_id,
            ConsultationAttachment.attachment_type == AttachmentType.DOCTOR_PRESCRIPTION.value,
        )
        .order_by(ConsultationAttachment.uploaded_at.desc())
        .all()
    )

    results = []
    for att in attachments:
        doc_name = att.consultation.doctor.name if att.consultation and att.consultation.doctor else "Attending Physician"
        results.append(
            PatientPrescriptionItem(
                id=att.id,
                consultation_id=att.consultation_id,
                doctor_name=doc_name,
                file_name=att.file_name,
                file_type=att.file_type,
                uploaded_at=att.uploaded_at,
                status="Available",
                download_url=f"/consultations/{att.consultation_id}/attachments/{att.id}/file",
            )
        )
    return results

# ━━━━━━━━━━━━━ DOCTOR COMPREHENSIVE MEDICATION REVIEW ━━━━━━━━━━━━━

def get_doctor_consultation_detail(
    db: Session, consultation_id: str, doctor_id: str
) -> DoctorConsultationDetail:
    """Returns comprehensive review: patient, current medicines, manual medicines, uploaded prescriptions, medicine images, medical reports, patient message, consultation status."""
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Consultation not found.")
    if consultation.doctor_id and consultation.doctor_id != doctor_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not authorized for this consultation.")

    # 1. Patient info
    patient = consultation.patient
    patient_info = {
        "id": patient.id,
        "name": patient.name,
        "email": patient.email,
        "created_at": patient.created_at.isoformat() if patient.created_at else None,
    }

    # 2. Patient's current active long-term medications
    current_meds_db = (
        db.query(Medication)
        .filter(Medication.patient_id == consultation.patient_id, Medication.active == True)
        .all()
    )
    current_meds_list = [
        {
            "id": m.id,
            "medicine_name": m.medicine_name,
            "dose": m.dose,
            "frequency": m.frequency,
            "instructions": m.instructions,
            "start_date": m.start_date,
            "end_date": m.end_date,
            "schedules": [s.scheduled_time for s in m.schedules],
        }
        for m in current_meds_db
    ]

    # 3. Manually entered medicines in this consultation
    manual_meds = [
        ConsultationMedicationResponse.model_validate(m)
        for m in consultation.medications
        if m.source == MedicationSource.MANUAL.value
    ]

    # 4. Uploaded prescriptions
    uploaded_rx = [
        ConsultationAttachmentResponse(
            id=a.id,
            consultation_id=a.consultation_id,
            uploaded_by=a.uploaded_by,
            file_name=a.file_name,
            file_type=a.file_type,
            attachment_type=a.attachment_type,
            file_size=a.file_size,
            uploaded_at=a.uploaded_at,
            download_url=f"/consultations/{consultation_id}/attachments/{a.id}/file",
        )
        for a in consultation.attachments
        if a.attachment_type == AttachmentType.PRESCRIPTION.value
    ]

    # 5. Medicine images
    medicine_images = [
        ConsultationAttachmentResponse(
            id=a.id,
            consultation_id=a.consultation_id,
            uploaded_by=a.uploaded_by,
            file_name=a.file_name,
            file_type=a.file_type,
            attachment_type=a.attachment_type,
            file_size=a.file_size,
            uploaded_at=a.uploaded_at,
            download_url=f"/consultations/{consultation_id}/attachments/{a.id}/file",
        )
        for a in consultation.attachments
        if a.attachment_type == AttachmentType.MEDICINE_IMAGE.value
    ]

    # 6. Medical reports
    medical_reports = [
        ConsultationAttachmentResponse(
            id=a.id,
            consultation_id=a.consultation_id,
            uploaded_by=a.uploaded_by,
            file_name=a.file_name,
            file_type=a.file_type,
            attachment_type=a.attachment_type,
            file_size=a.file_size,
            uploaded_at=a.uploaded_at,
            download_url=f"/consultations/{consultation_id}/attachments/{a.id}/file",
        )
        for a in consultation.attachments
        if a.attachment_type == AttachmentType.MEDICAL_REPORT.value
    ]

    # 7. Patient messages
    patient_messages = [
        ConsultationMessageResponse(
            id=msg.id,
            consultation_id=msg.consultation_id,
            sender_id=msg.sender_id,
            sender_role=msg.sender_role,
            sender_name=msg.sender.name if msg.sender else None,
            message=msg.message,
            attachment_id=msg.attachment_id,
            created_at=msg.created_at,
            read_at=msg.read_at,
        )
        for msg in consultation.messages
        if msg.sender_role == UserRole.PATIENT.value
    ]

    consultation_resp = _to_consultation_response(consultation)
    return DoctorConsultationDetail(
        id=consultation.id,
        patient_id=consultation.patient_id,
        doctor_id=consultation.doctor_id,
        status=consultation.status,
        report=consultation_resp.report,
        messages=consultation_resp.messages,
        consultation=consultation_resp,
        patient=patient_info,
        current_medicines=current_meds_list,
        manually_entered_medicines=manual_meds,
        uploaded_prescriptions=uploaded_rx,
        medicine_images=medicine_images,
        medical_reports=medical_reports,
        patient_messages=patient_messages,
        consultation_status=consultation.status,
    )

# ━━━━━━━━━━━━━ BACKWARD COMPATIBILITY HELPERS ━━━━━━━━━━━━━

def get_consultation_by_id_for_patient(db: Session, consultation_id: str, patient_id: str):
    c = db.query(Consultation).filter(Consultation.id == consultation_id, Consultation.patient_id == patient_id).first()
    return _to_consultation_response(c) if c else None

def get_consultation_by_id_for_doctor(db: Session, consultation_id: str, doctor_id: str):
    c = db.query(Consultation).filter(
        Consultation.id == consultation_id,
        or_(Consultation.doctor_id == doctor_id, Consultation.doctor_id.is_(None))
    ).first()
    return _to_consultation_response(c) if c else None
