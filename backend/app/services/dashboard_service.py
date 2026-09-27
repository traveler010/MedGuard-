from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.report import PatientProfile, MedicalReport, HealthMetrics
from app.models.appointment import Appointment, AppointmentStatus
from app.models.consultation import Consultation
from app.services.medication_service import (
    get_patient_medications,
    get_patient_reminders,
    get_doctor_patient_medication_adherence,
)
from app.services.appointment_service import get_patient_appointments
from app.services.report_service import get_patient_reports, get_latest_health_metrics
from app.services.consultation_service import get_patient_consultations
from app.schemas.dashboard import (
    PatientDashboardResponse,
    DoctorPatientDashboardResponse,
    HealthMetricsSummary,
    PatientInfoSummary,
)

def _build_health_metrics_summary(metrics: Optional[HealthMetrics]) -> HealthMetricsSummary:
    if not metrics:
        return HealthMetricsSummary(
            blood_pressure="Not available",
            blood_count="Not available",
            haemoglobin="Not available",
            other_metrics=None,
            recorded_at=None,
        )
    return HealthMetricsSummary(
        blood_pressure=metrics.blood_pressure if metrics.blood_pressure else "Not available",
        blood_count=metrics.blood_count if metrics.blood_count else "Not available",
        haemoglobin=metrics.haemoglobin if metrics.haemoglobin else "Not available",
        other_metrics=metrics.other_metrics,
        recorded_at=metrics.recorded_at.isoformat() if metrics.recorded_at else None,
    )

def _build_patient_info_summary(user: User) -> PatientInfoSummary:
    profile = user.profile[0] if getattr(user, "profile", None) else None
    return PatientInfoSummary(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        age=profile.age if profile else None,
        gender=profile.gender if profile else None,
        blood_group=profile.blood_group if profile else None,
    )

def get_patient_dashboard_summary(db: Session, patient_id: str) -> PatientDashboardResponse:
    """Compile aggregated clinical dashboard for the authenticated patient."""
    user = db.query(User).filter(User.id == patient_id).first()
    patient_info = _build_patient_info_summary(user)

    latest_metrics = get_latest_health_metrics(db, patient_id)
    health_metrics = _build_health_metrics_summary(latest_metrics)

    recent_reports = get_patient_reports(db, patient_id)[:5]
    current_medicines = get_patient_medications(db, patient_id, active_only=True)
    today_reminders = get_patient_reminders(db, patient_id)
    all_appointments = get_patient_appointments(db, patient_id)
    upcoming_appointments = [a for a in all_appointments if a.status in [AppointmentStatus.UPCOMING.value, AppointmentStatus.CONFIRMED.value]]

    # Recent consultation status
    latest_consultation = (
        db.query(Consultation)
        .filter(Consultation.patient_id == patient_id)
        .order_by(Consultation.created_at.desc())
        .first()
    )
    recent_consultation_status = latest_consultation.status if latest_consultation else None

    return PatientDashboardResponse(
        patient_info=patient_info,
        health_metrics=health_metrics,
        recent_reports=recent_reports,
        current_medicines=current_medicines,
        today_reminders=today_reminders,
        upcoming_appointments=upcoming_appointments,
        recent_consultation_status=recent_consultation_status,
    )

def get_doctor_patient_dashboard_summary(
    db: Session, patient_id: str, doctor_id: str
) -> DoctorPatientDashboardResponse:
    """Compile concise workspace dashboard for a doctor reviewing a specific patient."""
    patient = db.query(User).filter(User.id == patient_id).first()
    patient_info = _build_patient_info_summary(patient)

    latest_metrics = get_latest_health_metrics(db, patient_id)
    health_metrics = _build_health_metrics_summary(latest_metrics)

    recent_reports = get_patient_reports(db, patient_id)[:5]
    current_medicines = get_patient_medications(db, patient_id, active_only=True)
    adherence = get_doctor_patient_medication_adherence(db, patient_id)
    recent_consultations = get_patient_consultations(db, patient_id)[:5]

    all_appointments = get_patient_appointments(db, patient_id)
    upcoming_appointments = [a for a in all_appointments if a.status in [AppointmentStatus.UPCOMING.value, AppointmentStatus.CONFIRMED.value]]

    return DoctorPatientDashboardResponse(
        patient_info=patient_info,
        health_metrics=health_metrics,
        recent_reports=recent_reports,
        current_medicines=current_medicines,
        medication_adherence=adherence,
        recent_consultations=recent_consultations,
        upcoming_appointments=upcoming_appointments,
    )
