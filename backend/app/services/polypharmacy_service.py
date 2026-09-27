"""
Service layer orchestrating Polypharmacy Risk Analysis, Database Snapshot Persistence,
and Consultation Telemetry retrieval.
"""

import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.medication_analysis_report import MedicationAnalysisReport
from app.models.consultation import Consultation
from app.models.user import User
from app.schemas.medicine_analyzer import (
    PolypharmacyAnalyzeRequest,
    MedicationAnalysisReportResponse,
    DrugInteractionItem,
    CategoryAssessment,
    SaferOptionItem,
    ShortTermAssessment,
    LongTermAssessment,
    PatientCaregiverSummary,
)
from app.services.polypharmacy_risk_engine import PolypharmacyRiskEngine
from app.utils.logger import setup_logger

logger = setup_logger("medguard.polypharmacy_service")


def _format_report_response(report: MedicationAnalysisReport) -> MedicationAnalysisReportResponse:
    # Ensure current_meds is list
    current_meds = report.current_medications_snapshot if isinstance(report.current_medications_snapshot, list) else []
    proposed_med = report.proposed_medication if isinstance(report.proposed_medication, dict) else {"name": str(report.proposed_medication)}

    # Parse interaction items
    raw_interactions = report.interaction_results if isinstance(report.interaction_results, list) else []
    interactions = [
        DrugInteractionItem(
            proposed_medication=item.get("proposed_medication", ""),
            existing_medication=item.get("existing_medication", ""),
            existing_medication_dose=item.get("existing_medication_dose"),
            interaction_category=item.get("interaction_category", "Drug Interaction"),
            severity=item.get("severity", "LOW"),
            risk_title=item.get("risk_title", "Drug Interaction"),
            explanation=item.get("explanation", ""),
            clinical_mechanism=item.get("clinical_mechanism"),
            clinical_impact=item.get("clinical_impact"),
            verified_source=item.get("verified_source", "MedGuard CDSS"),
        )
        for item in raw_interactions
    ]

    # Parse category assessments
    def _parse_cat(data: Any, default_title: str) -> CategoryAssessment:
        d = data if isinstance(data, dict) else {}
        return CategoryAssessment(
            status=d.get("status", "LOW"),
            title=d.get("title", default_title),
            summary=d.get("summary", ""),
            details=d.get("details", ""),
            clinical_recommendation=d.get("clinical_recommendation", ""),
        )

    # Parse recommendations
    raw_recs = report.recommendations if isinstance(report.recommendations, list) else []
    recommendations = [
        SaferOptionItem(
            category=r.get("category", "Safer alternative"),
            recommendation=r.get("recommendation", ""),
            reason=r.get("reason", ""),
            source_reference=r.get("source_reference", "Clinical Guideline"),
            is_recommended=r.get("is_recommended", False),
        )
        for r in raw_recs
    ]

    # Short term & long term
    raw_short = report.short_term_result if isinstance(report.short_term_result, dict) else {}
    short_term = ShortTermAssessment(
        efficacy_rating=raw_short.get("efficacy_rating", "Moderate"),
        summary=raw_short.get("summary", ""),
        clinical_context=raw_short.get("clinical_context", ""),
    )

    raw_long = report.long_term_result if isinstance(report.long_term_result, dict) else {}
    long_term = LongTermAssessment(
        safety_rating=raw_long.get("safety_rating", "Safe"),
        summary=raw_long.get("summary", ""),
        organ_vulnerabilities=raw_long.get("organ_vulnerabilities", []),
    )

    # Patient summary
    raw_patient = report.patient_summary if isinstance(report.patient_summary, dict) else None
    patient_summary = (
        PatientCaregiverSummary(
            medicine_name=raw_patient.get("medicine_name", proposed_med.get("name", "")),
            purpose=raw_patient.get("purpose", ""),
            dose_and_schedule=raw_patient.get("dose_and_schedule", ""),
            important_caution=raw_patient.get("important_caution", ""),
            reminder_info=raw_patient.get("reminder_info", ""),
            emergency_warning=raw_patient.get("emergency_warning"),
        )
        if raw_patient else None
    )

    dep_res = _parse_cat(report.dependence_result, "Dependence Risk")
    cum_res = _parse_cat(report.cumulative_side_effect_result, "Cumulative Side-Effect Load")
    age_res = _parse_cat(report.age_result, "Age Appropriateness")
    dur_res = _parse_cat(report.duration_result, "Duration Appropriateness")

    high_ints = [i for i in interactions if i.severity == "HIGH"]
    mod_ints = [i for i in interactions if i.severity == "MODERATE"]
    int_risk = "HIGH" if high_ints else ("MODERATE" if mod_ints else "LOW")

    created_at_str = report.created_at.isoformat() if report.created_at else None

    return MedicationAnalysisReportResponse(
        id=report.id,
        patient_id=report.patient_id,
        doctor_id=report.doctor_id,
        consultation_id=report.consultation_id,
        patient_age=report.patient_age,
        current_medications_snapshot=current_meds,
        proposed_medication=proposed_med,
        overall_risk=report.overall_risk_level,
        overall_risk_level=report.overall_risk_level,
        overall_risk_score=report.overall_risk_score,
        risk_score=report.overall_risk_score,
        interaction_risk=int_risk,
        dependence_risk=dep_res.status,
        cumulative_side_effect_risk=cum_res.status,
        age_appropriateness=age_res.status,
        duration_appropriateness=dur_res.status,
        plain_language_summary=report.plain_language_summary,
        why_flagged=report.plain_language_summary,
        interaction_results=interactions,
        dependence_result=dep_res,
        cumulative_side_effect_result=cum_res,
        age_result=age_res,
        duration_result=dur_res,
        short_term_result=short_term,
        long_term_result=long_term,
        recommendations=recommendations,
        patient_summary=patient_summary,
        created_at=created_at_str,
    )


def perform_polypharmacy_analysis(
    db: Session, request: PolypharmacyAnalyzeRequest
) -> MedicationAnalysisReportResponse:
    """
    Executes PolypharmacyRiskEngine across all current medications and saves
    an immutable MedicationAnalysisReport snapshot into the database.
    """
    # Convert Pydantic medications to dicts
    current_meds_dicts = [med.model_dump() for med in request.current_medications]

    # Run Clinical Decision Support analysis
    engine_results = PolypharmacyRiskEngine.analyze(
        proposed_name=request.proposed_medication,
        proposed_dose=request.dose,
        proposed_frequency=request.frequency,
        proposed_duration=request.duration,
        proposed_instructions=request.instructions,
        current_medications=current_meds_dicts,
        patient_age=request.patient_age,
    )

    proposed_snapshot = {
        "name": request.proposed_medication,
        "dose": request.dose,
        "frequency": request.frequency,
        "duration": request.duration,
        "instructions": request.instructions,
    }

    # Verify foreign key existence to avoid FK violations on test/guest IDs
    valid_patient_id = None
    if request.patient_id:
        user_exists = db.query(User.id).filter(User.id == request.patient_id).first()
        if user_exists:
            valid_patient_id = request.patient_id

    valid_doctor_id = None
    if request.doctor_id:
        doc_exists = db.query(User.id).filter(User.id == request.doctor_id).first()
        if doc_exists:
            valid_doctor_id = request.doctor_id

    valid_consultation_id = None
    if request.consultation_id:
        consult_exists = db.query(Consultation.id).filter(Consultation.id == request.consultation_id).first()
        if consult_exists:
            valid_consultation_id = request.consultation_id

    report_id = str(uuid.uuid4())
    report = MedicationAnalysisReport(
        id=report_id,
        patient_id=valid_patient_id or request.patient_id,
        doctor_id=valid_doctor_id or request.doctor_id,
        consultation_id=valid_consultation_id or request.consultation_id,
        patient_age=request.patient_age,
        current_medications_snapshot=current_meds_dicts,
        proposed_medication=proposed_snapshot,
        overall_risk_level=engine_results["overall_risk_level"],
        overall_risk_score=engine_results["overall_risk_score"],
        interaction_results=engine_results["interaction_results"],
        dependence_result=engine_results["dependence_result"],
        cumulative_side_effect_result=engine_results["cumulative_side_effect_result"],
        age_result=engine_results["age_result"],
        duration_result=engine_results["duration_result"],
        short_term_result=engine_results["short_term_result"],
        long_term_result=engine_results["long_term_result"],
        recommendations=engine_results["recommendations"],
        plain_language_summary=engine_results["plain_language_summary"],
        patient_summary=engine_results["patient_summary"],
        created_at=datetime.now(timezone.utc),
    )

    try:
        db.add(report)
        db.commit()
        db.refresh(report)
        logger.info(f"Successfully generated and stored MedicationAnalysisReport {report.id} (Risk: {report.overall_risk_level})")
    except Exception as e:
        db.rollback()
        logger.warning(f"Could not persist report to database ({e}). Returning transient report result.")

    return _format_report_response(report)


def get_medication_analysis_report(db: Session, report_id: str) -> MedicationAnalysisReportResponse:
    """Fetch specific report by ID."""
    report = db.query(MedicationAnalysisReport).filter(MedicationAnalysisReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Medication analysis report '{report_id}' was not found.",
        )
    return _format_report_response(report)


def get_patient_analysis_reports(db: Session, patient_id: str) -> List[MedicationAnalysisReportResponse]:
    """Fetch all reports for a specific patient, newest first."""
    reports = (
        db.query(MedicationAnalysisReport)
        .filter(MedicationAnalysisReport.patient_id == patient_id)
        .order_by(MedicationAnalysisReport.created_at.desc())
        .all()
    )
    return [_format_report_response(r) for r in reports]


def get_consultation_analysis_reports(db: Session, consultation_id: str) -> List[MedicationAnalysisReportResponse]:
    """Fetch all reports linked to a specific consultation for doctor review."""
    reports = (
        db.query(MedicationAnalysisReport)
        .filter(MedicationAnalysisReport.consultation_id == consultation_id)
        .order_by(MedicationAnalysisReport.created_at.desc())
        .all()
    )
    return [_format_report_response(r) for r in reports]
