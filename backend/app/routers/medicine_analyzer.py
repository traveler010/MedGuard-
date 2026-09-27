from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.auth.dependencies import security
from app.auth.jwt import decode_access_token
from app.models.user import User
from app.schemas.medicine_analyzer import (
    MedicineAnalyzeRequest,
    MedicineAnalyzeResponse,
    PolypharmacyAnalyzeRequest,
    MedicationAnalysisReportResponse,
)
from app.services.medicine_analyzer_service import analyze_medication_compatibility
from app.services.polypharmacy_service import (
    perform_polypharmacy_analysis,
    get_medication_analysis_report,
    get_patient_analysis_reports,
    get_consultation_analysis_reports,
)

router = APIRouter(tags=["Medicine Risk Analyzer"])


def get_optional_user(
    credentials=Depends(security),
    db: Session = Depends(get_db),
) -> Optional[User]:
    if not credentials or not credentials.credentials:
        return None
    payload = decode_access_token(credentials.credentials)
    if not payload:
        return None
    user_id = payload.get("sub")
    if not user_id:
        return None
    return db.query(User).filter(User.id == user_id).first()


# ==============================================================================
# POLYPHARMACY RISK ANALYSIS WORKSPACE ENDPOINTS
# ==============================================================================

@router.post(
    "/medicine-analyzer/analyze",
    response_model=MedicationAnalysisReportResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze polypharmacy risk for proposed medicine against complete medication profile",
    description=(
        "Cross-checks a proposed medication against an unlimited roster of active medications. "
        "Evaluates drug-drug interactions, dependence risk, cumulative side-effect load, "
        "Beers criteria age-appropriateness (65+), and duration parameters. "
        "Persists an immutable clinical analysis snapshot."
    ),
)
def analyze_polypharmacy(
    data: PolypharmacyAnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    # Auto-fill user identifiers if omitted and authenticated
    if current_user:
        if current_user.role == "doctor" and not data.doctor_id:
            data.doctor_id = current_user.id
        elif current_user.role == "patient" and not data.patient_id:
            data.patient_id = current_user.id

    return perform_polypharmacy_analysis(db, data)


@router.get(
    "/medicine-analyzer/reports/{report_id}",
    response_model=MedicationAnalysisReportResponse,
    summary="Retrieve structured medication analysis report by ID",
    description="Fetches an existing polypharmacy risk analysis report snapshot including patient and doctor views.",
)
def get_report(
    report_id: str,
    db: Session = Depends(get_db),
):
    return get_medication_analysis_report(db, report_id)


@router.get(
    "/patients/{patient_id}/medicine-analysis-reports",
    response_model=List[MedicationAnalysisReportResponse],
    summary="List polypharmacy risk analysis reports for a patient",
    description="Returns all historical medication analysis reports generated for this patient, newest first.",
)
def list_patient_reports(
    patient_id: str,
    db: Session = Depends(get_db),
):
    return get_patient_analysis_reports(db, patient_id)


@router.get(
    "/consultations/{consultation_id}/medicine-analysis",
    response_model=List[MedicationAnalysisReportResponse],
    summary="Retrieve polypharmacy analysis reports for a consultation",
    description="Allows attending doctors to view risk reports generated during or for this patient consultation.",
)
def get_consultation_reports(
    consultation_id: str,
    db: Session = Depends(get_db),
):
    return get_consultation_analysis_reports(db, consultation_id)


# ==============================================================================
# LEGACY 2-MEDICINE ENDPOINT (Preserved for backwards compatibility)
# ==============================================================================

@router.post(
    "/medicine/analyze",
    response_model=MedicineAnalyzeResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze drug-drug compatibility between two medicines (legacy endpoint)",
    description=(
        "Performs a verified interaction check between two medications. "
        "Strict non-fabrication rule: If a pair is not in the verified dataset, "
        "it returns 'insufficient_data'."
    ),
)
def analyze_two_medicines(data: MedicineAnalyzeRequest):
    return analyze_medication_compatibility(data.medicine_1, data.medicine_2)
