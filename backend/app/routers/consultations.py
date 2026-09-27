from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    Query,
    WebSocket,
    WebSocketDisconnect,
    status,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import json

from app.database import get_db, SessionLocal
from app.models.user import User, UserRole
from app.auth.dependencies import get_current_user, require_patient, require_doctor
from app.auth.jwt import decode_access_token
from app.models.consultation import Consultation, AttachmentType, ConsultationStatus
from app.schemas.consultation import (
    ConsultationCreate,
    ConsultationResponse,
    ConsultationListItem,
    ConsultationMedicationCreate,
    ConsultationMedicationResponse,
    ConsultationAttachmentResponse,
    ConsultationMessageCreate,
    ConsultationMessageResponse,
    PatientPrescriptionItem,
    DoctorConsultationDetail,
)
from app.services.consultation_service import (
    create_patient_consultation,
    get_consultation_by_id,
    get_doctor_consultations,
    add_consultation_medication,
    get_consultation_medications,
    add_consultation_attachment,
    get_consultation_attachments,
    delete_consultation_attachment,
    get_attachment_file_path,
    add_message_to_consultation,
    get_consultation_messages,
    upload_doctor_prescription,
    get_patient_prescriptions,
    get_doctor_consultation_detail,
)
from app.services.websocket_manager import consultation_ws_manager

router = APIRouter(tags=["Consultations & Real-Time Telemetry"])

# ━━━━━━━━━━━━━ 1. CONSULTATION LIFECYCLE ━━━━━━━━━━━━━

@router.post(
    "/consultations",
    response_model=ConsultationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Start / Create Consultation",
    description="Initiates a consultation between authenticated patient and assigned doctor.",
)
def start_consultation(
    data: ConsultationCreate,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    return create_patient_consultation(
        db, current_patient.id, data, initial_status=ConsultationStatus.WAITING_FOR_DOCTOR.value
    )

@router.get(
    "/consultations/{id}",
    response_model=ConsultationResponse,
    summary="Get Consultation Details",
    description="Loads consultation data for authorized patient or doctor.",
)
def get_consultation(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_consultation_by_id(db, id, current_user)

# ━━━━━━━━━━━━━ 2. CONSULTATION MEDICATIONS ━━━━━━━━━━━━━

@router.post(
    "/consultations/{id}/medications",
    response_model=ConsultationMedicationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add Medicine to Consultation",
    description="Records a manual or image-extracted medication entry without overwriting historical records.",
)
def add_medication(
    id: str,
    data: ConsultationMedicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return add_consultation_medication(db, id, data, current_user)

@router.get(
    "/consultations/{id}/medications",
    response_model=List[ConsultationMedicationResponse],
    summary="List Consultation Medications",
    description="Returns all medications linked to this consultation session.",
)
def list_medications(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_consultation_medications(db, id, current_user)

# ━━━━━━━━━━━━━ 3. ATTACHMENTS & PRESCRIPTION UPLOADS ━━━━━━━━━━━━━

@router.post(
    "/consultations/{id}/attachments",
    response_model=ConsultationAttachmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Prescription or Medical Document",
    description="Accepts JPG, JPEG, PNG, or PDF file with validation of extension, MIME type, and size.",
)
def upload_attachment(
    id: str,
    file: UploadFile = File(...),
    attachment_type: str = Form(default=AttachmentType.PRESCRIPTION.value),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return add_consultation_attachment(
        db,
        consultation_id=id,
        file=file,
        attachment_type=attachment_type,
        user=current_user,
    )

@router.get(
    "/consultations/{id}/attachments",
    response_model=List[ConsultationAttachmentResponse],
    summary="List Consultation Attachments",
    description="Returns all uploaded files, prescription images, and reports for this consultation.",
)
def list_attachments(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_consultation_attachments(db, id, current_user)

@router.delete(
    "/consultations/{id}/attachments/{attachment_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Attachment",
    description="Removes an uploaded prescription or document from the consultation.",
)
def delete_attachment(
    id: str,
    attachment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    delete_consultation_attachment(db, id, attachment_id, current_user)
    return {"status": "success", "message": f"Attachment '{attachment_id}' removed."}

@router.get(
    "/consultations/{id}/attachments/{attachment_id}/file",
    summary="Secure File Stream / Download",
    description="Streams the requested document or prescription image for authorized patient or doctor.",
)
def stream_attachment_file(
    id: str,
    attachment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    abs_path, file_name, file_type = get_attachment_file_path(db, id, attachment_id, current_user)
    return FileResponse(path=abs_path, filename=file_name, media_type=file_type)

# ━━━━━━━━━━━━━ 4. CONSULTATION CHAT MESSAGES ━━━━━━━━━━━━━

@router.post(
    "/consultations/{id}/messages",
    response_model=ConsultationMessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Send Message in Consultation",
    description="Posts a consultation message and broadcasts in real-time to active WebSocket connections.",
)
async def send_message(
    id: str,
    data: ConsultationMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return await add_message_to_consultation(
        db,
        consultation_id=id,
        sender_id=current_user.id,
        sender_role=current_user.role,
        message_text=data.message,
        attachment_id=data.attachment_id,
    )

@router.get(
    "/consultations/{id}/messages",
    response_model=List[ConsultationMessageResponse],
    summary="Get Consultation Message History",
    description="Loads chronological messages and updates read receipts.",
)
def list_messages(
    id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_consultation_messages(db, id, current_user)

# ━━━━━━━━━━━━━ 5. DOCTOR PRESCRIPTION UPLOADS ━━━━━━━━━━━━━

@router.post(
    "/consultations/{id}/prescription",
    response_model=PatientPrescriptionItem,
    status_code=status.HTTP_201_CREATED,
    summary="Doctor Uploads Authorized Prescription",
    description="Dedicated doctor action allowing upload of verified prescription file (PDF, JPG, PNG).",
)
def doctor_upload_prescription(
    id: str,
    file: UploadFile = File(...),
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    return upload_doctor_prescription(db, id, file, current_doctor)

@router.get(
    "/patient/prescriptions",
    response_model=List[PatientPrescriptionItem],
    summary="Patient View Authorized Prescriptions",
    description="Returns all doctor prescriptions authorized across consultations for the authenticated patient.",
)
def list_my_prescriptions(
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    return get_patient_prescriptions(db, current_patient.id)

# ━━━━━━━━━━━━━ 6. DOCTOR REVIEW & CONSULTATIONS INBOX ━━━━━━━━━━━━━

@router.get(
    "/doctor/consultations",
    response_model=List[ConsultationListItem],
    summary="Doctor Consultations Inbox",
    description="Retrieves all consultations assigned to or pending review by the authenticated doctor.",
)
def doctor_list_consultations(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    return get_doctor_consultations(db, current_doctor.id, status_filter=status_filter)

@router.get(
    "/doctor/consultations/{consultation_id}",
    response_model=DoctorConsultationDetail,
    summary="Doctor Detailed Medication Review",
    description="Retrieves patient profile, current medications, manual medicines, uploaded prescriptions, images, reports, and messages.",
)
def doctor_review_consultation(
    consultation_id: str,
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    return get_doctor_consultation_detail(db, consultation_id, current_doctor.id)

# ━━━━━━━━━━━━━ 7. WEBSOCKET REAL-TIME TELEMETRY ━━━━━━━━━━━━━

@router.websocket("/ws/consultations/{consultation_id}")
async def websocket_consultation_endpoint(
    websocket: WebSocket,
    consultation_id: str,
    token: Optional[str] = Query(None),
):
    """
    WebSocket endpoint for real-time consultation communication.
    Clients connect to /ws/consultations/{consultation_id}?token=<jwt_token>
    """
    db = SessionLocal()
    try:
        # Validate authentication
        if not token:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        payload = decode_access_token(token)
        if not payload or not payload.get("sub"):
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        # Check consultation access
        consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
        if not consultation:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        if user.role == UserRole.PATIENT.value and consultation.patient_id != user.id:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
        if user.role == UserRole.DOCTOR.value and consultation.doctor_id and consultation.doctor_id != user.id:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        # Connect
        await consultation_ws_manager.connect(consultation_id, websocket)

        # Notify initial connection status
        await websocket.send_text(
            json.dumps({
                "event": "connected",
                "consultation_id": consultation_id,
                "user": user.name,
                "role": user.role,
                "status": consultation.status,
            })
        )

        # Listening loop
        while True:
            data_text = await websocket.receive_text()
            try:
                data = json.loads(data_text)
                action = data.get("action")

                if action == "message":
                    msg_text = data.get("message", "").strip()
                    if msg_text:
                        await add_message_to_consultation(
                            db=db,
                            consultation_id=consultation_id,
                            sender_id=user.id,
                            sender_role=user.role,
                            message_text=msg_text,
                            attachment_id=data.get("attachment_id"),
                        )
                elif action == "ping":
                    await websocket.send_text(json.dumps({"event": "pong"}))
            except Exception as e:
                await websocket.send_text(json.dumps({"event": "error", "detail": str(e)}))

    except WebSocketDisconnect:
        consultation_ws_manager.disconnect(consultation_id, websocket)
    except Exception:
        consultation_ws_manager.disconnect(consultation_id, websocket)
    finally:
        db.close()
