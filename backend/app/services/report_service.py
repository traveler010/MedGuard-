import os
import uuid
import shutil
from typing import List, Optional, Tuple
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException, status
from app.models.report import MedicalReport, HealthMetrics, PatientProfile
from app.models.user import User
from app.schemas.report import (
    MedicalReportResponse,
    HealthMetricsResponse,
    HealthMetricsCreate,
)

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

def _get_uploads_directory() -> str:
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    uploads_dir = os.path.join(base_dir, "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    return uploads_dir

def _to_report_response(report: MedicalReport) -> MedicalReportResponse:
    metrics_resp = [
        HealthMetricsResponse(
            id=m.id,
            patient_id=m.patient_id,
            report_id=m.report_id,
            blood_pressure=m.blood_pressure,
            blood_count=m.blood_count,
            haemoglobin=m.haemoglobin,
            other_metrics=m.other_metrics,
            recorded_at=m.recorded_at,
            created_at=m.created_at,
        )
        for m in (report.health_metrics or [])
    ]
    return MedicalReportResponse(
        id=report.id,
        patient_id=report.patient_id,
        title=report.title,
        report_type=report.report_type,
        file_name=report.file_name,
        file_size=report.file_size,
        mime_type=report.mime_type,
        created_at=report.created_at,
        health_metrics=metrics_resp,
    )

def upload_patient_report(
    db: Session,
    patient_id: str,
    file: UploadFile,
    title: str,
    report_type: str = "General Report",
    extracted_bp: Optional[str] = None,
    extracted_bc: Optional[str] = None,
    extracted_hb: Optional[str] = None,
) -> MedicalReportResponse:
    """Validate, securely store file, and record metadata and any extracted health metrics."""
    original_filename = file.filename or "report.pdf"
    _, ext = os.path.splitext(original_filename.lower())

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, PNG, JPG, JPEG.",
        )

    content_type = file.content_type or "application/octet-stream"
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported content type '{content_type}'. Must be PDF or image.",
        )

    # Read content to check size
    file_bytes = file.file.read()
    file_size = len(file_bytes)
    if file_size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of 10 MB. Uploaded size: {file_size / (1024 * 1024):.1f} MB.",
        )

    # Generate secure random storage filename
    safe_filename = f"{uuid.uuid4()}{ext}"
    storage_path = os.path.join(_get_uploads_directory(), safe_filename)

    with open(storage_path, "wb") as f:
        f.write(file_bytes)

    report = MedicalReport(
        patient_id=patient_id,
        title=title.strip() if title else original_filename,
        report_type=report_type.strip() if report_type else "General Report",
        file_path=storage_path,
        file_name=original_filename,
        file_size=file_size,
        mime_type=content_type,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(report)
    db.flush()

    # Record health metrics if provided in report
    if extracted_bp or extracted_bc or extracted_hb:
        metrics = HealthMetrics(
            patient_id=patient_id,
            report_id=report.id,
            blood_pressure=extracted_bp,
            blood_count=extracted_bc,
            haemoglobin=extracted_hb,
            recorded_at=datetime.now(timezone.utc),
            created_at=datetime.now(timezone.utc),
        )
        db.add(metrics)

    db.commit()
    db.refresh(report)
    return _to_report_response(report)

def get_patient_reports(db: Session, patient_id: str) -> List[MedicalReportResponse]:
    """Retrieve all reports for a specific patient."""
    reports = (
        db.query(MedicalReport)
        .filter(MedicalReport.patient_id == patient_id)
        .order_by(MedicalReport.created_at.desc())
        .all()
    )
    return [_to_report_response(r) for r in reports]

def get_report_for_download(
    db: Session, report_id: str, requester_id: str, requester_role: str
) -> Tuple[str, str, str]:
    """Retrieve file path, filename, and mime type after verifying requester authorization."""
    report = db.query(MedicalReport).filter(MedicalReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Medical report with ID '{report_id}' not found.",
        )

    # Patient can only download their own report
    if requester_role == "patient" and report.patient_id != requester_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You can only download your own medical reports.",
        )

    if not os.path.exists(report.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The file content is no longer available on disk.",
        )

    return report.file_path, report.file_name, report.mime_type

def get_latest_health_metrics(db: Session, patient_id: str) -> Optional[HealthMetrics]:
    """Retrieve the most recent health metrics recorded for a patient."""
    return (
        db.query(HealthMetrics)
        .filter(HealthMetrics.patient_id == patient_id)
        .order_by(HealthMetrics.recorded_at.desc())
        .first()
    )

def record_patient_health_metrics(
    db: Session, patient_id: str, data: HealthMetricsCreate, report_id: Optional[str] = None
) -> HealthMetricsResponse:
    """Manually or automatically record verified health metrics."""
    metrics = HealthMetrics(
        patient_id=patient_id,
        report_id=report_id,
        blood_pressure=data.blood_pressure,
        blood_count=data.blood_count,
        haemoglobin=data.haemoglobin,
        other_metrics=data.other_metrics,
        recorded_at=datetime.now(timezone.utc),
        created_at=datetime.now(timezone.utc),
    )
    db.add(metrics)
    db.commit()
    db.refresh(metrics)
    return HealthMetricsResponse.model_validate(metrics)
