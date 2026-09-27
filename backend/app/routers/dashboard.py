from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.auth.dependencies import require_patient, require_doctor
from app.schemas.dashboard import PatientDashboardResponse, DoctorPatientDashboardResponse
from app.services.dashboard_service import (
    get_patient_dashboard_summary,
    get_doctor_patient_dashboard_summary,
)

router = APIRouter(tags=["Clinical Dashboards"])

@router.get(
    "/patients/me/dashboard",
    response_model=PatientDashboardResponse,
    summary="Get complete patient health dashboard",
    description=(
        "Returns only the data required by the redesigned patient portal: "
        "basic patient info, available health metrics, recent reports, current medicines, "
        "today's medication reminders, upcoming appointments, and recent consultation status."
    )
)
def get_patient_dashboard(
    current_patient: User = Depends(require_patient),
    db: Session = Depends(get_db),
):
    return get_patient_dashboard_summary(db, current_patient.id)

@router.get(
    "/doctor/patients/{patient_id}/dashboard",
    response_model=DoctorPatientDashboardResponse,
    summary="Get complete doctor patient summary",
    description=(
        "Returns the focused workspace data for a doctor: patient info, available health metrics, "
        "recent reports, current medicines, medication adherence percentage, recent consultations, "
        "and upcoming appointments. No unnecessary data."
    )
)
def get_doctor_patient_dashboard(
    patient_id: str,
    current_doctor: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    patient = db.query(User).filter(User.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found.",
        )
    return get_doctor_patient_dashboard_summary(db, patient_id, current_doctor.id)
