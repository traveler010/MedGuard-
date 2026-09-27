from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.user import User
from app.auth.dependencies import require_patient, require_doctor, get_current_user
from app.schemas.report import MedicalReportResponse
from app.services.report_service import (
    upload_patient_report,
    get_patient_reports,
    get_report_for_download,
)

router = APIRouter(tags=["Medical Reports"])

@router.post(
    "/patients/me/reports",
    response_model=MedicalReportResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload patient medical report",
    description="Securely uploads a medical report (PDF, PNG, JPG - max 10MB) and records metadata and any extracted health metrics.",
)
def upload_report(
    file: UploadFile = File(..., description="Report document (PDF or image)"),
    title: str = Form(..., description="Descriptive title for report, e.g. 'Annual Blood Work'"),
    report_type: str = Form("General Report", description="Type of report, e.g. 'Complete Blood Count'"),
    blood_pressure: Optional[str] = Form(None, description="Optional verified BP metric, e.g. '120/80 mmHg'"),
    blood_count: Optional[str] = Form(None, description="Optional verified Blood Count, e.g. '4.8 million/mcL'"),
    haemoglobin: Optional[str] = Form(None, description="Optional verified Haemoglobin, e.g. '14.2 g/dL'"),
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    return upload_patient_report(
        db,
        patient_id=current_patient.id,
        file=file,
        title=title,
        report_type=report_type,
        extracted_bp=blood_pressure,
        extracted_bc=blood_count,
        extracted_hb=haemoglobin,
    )

@router.get(
    "/patients/me/reports",
    response_model=List[MedicalReportResponse],
    summary="List patient medical reports",
    description="Returns all reports uploaded by the authenticated patient.",
)
def list_my_reports(
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    return get_patient_reports(db, current_patient.id)

@router.get(
    "/patients/me/reports/{report_id}/file",
    summary="Download/view own medical report file",
    description="Secure streaming download of medical report file with strict ownership validation.",
)
def download_patient_report_file(
    report_id: str,
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    file_path, filename, mime_type = get_report_for_download(
        db, report_id, requester_id=current_patient.id, requester_role="patient"
    )
    return FileResponse(
        path=file_path,
        media_type=mime_type,
        filename=filename,
    )

@router.get(
    "/doctor/reports/{report_id}/file",
    summary="Doctor download/view patient medical report",
    description="Allows verified clinical doctor to review a patient's medical report document.",
)
def download_doctor_report_file(
    report_id: str,
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    file_path, filename, mime_type = get_report_for_download(
        db, report_id, requester_id=current_doctor.id, requester_role="doctor"
    )
    return FileResponse(
        path=file_path,
        media_type=mime_type,
        filename=filename,
    )
