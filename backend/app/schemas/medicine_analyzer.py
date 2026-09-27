from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# ==============================================================================
# LEGACY SCHEMAS (Preserved for backwards compatibility with 2-med checks)
# ==============================================================================

class MedicineAnalyzeRequest(BaseModel):
    medicine_1: str = Field(..., min_length=1, description="First medication name, e.g. 'Aspirin' or 'Lisinopril'")
    medicine_2: str = Field(..., min_length=1, description="Second medication name, e.g. 'Warfarin' or 'Ibuprofen'")

class MedicineAnalyzeResponse(BaseModel):
    medicine_1: str
    medicine_2: str
    status: str = Field(..., description="Status of interaction check: 'checked', 'insufficient_data', or 'unknown'")
    severity: Optional[str] = Field(None, description="Severity if verified data exists, else null")
    summary: str = Field(..., description="Clear summary statement")
    details: List[str] = Field(default_factory=list, description="Verified interaction clinical notes")
    disclaimer: str = Field(..., description="Strict medical disclaimer")


# ==============================================================================
# POLYPHARMACY RISK ANALYSIS SCHEMAS
# ==============================================================================

class CurrentMedicationItem(BaseModel):
    medicine_name: str = Field(..., min_length=1, description="Medication commercial or generic name")
    dose: Optional[str] = Field(None, description="Strength / dose, e.g. '5 mg' or '500 mg'")
    frequency: Optional[str] = Field(None, description="Dosing frequency, e.g. 'Once daily', 'BID', 'PRN'")
    scheduled_time: Optional[str] = Field(None, description="Scheduled time, e.g. '08:00 AM'")
    duration: Optional[str] = Field(None, description="Duration of therapy, e.g. '30 days', 'Chronic'")
    instructions: Optional[str] = Field(None, description="Optional instructions, e.g. 'Take with food'")

class PolypharmacyAnalyzeRequest(BaseModel):
    patient_id: Optional[str] = Field(None, description="Patient user identifier")
    doctor_id: Optional[str] = Field(None, description="Doctor user identifier when performed during clinical review")
    patient_age: Optional[int] = Field(65, ge=0, le=130, description="Patient age in years (essential for Beers criteria evaluation)")
    current_medications: List[CurrentMedicationItem] = Field(
        default_factory=list,
        description="Complete active medication profile to check against (supports 2, 3, 5, 10+ medications without limit)"
    )
    proposed_medication: str = Field(..., min_length=1, description="New proposed medicine being considered")
    dose: Optional[str] = Field(None, description="Dose of proposed medicine, e.g. '400 mg'")
    frequency: Optional[str] = Field(None, description="Frequency, e.g. 'Every 8 hours as needed'")
    duration: Optional[str] = Field(None, description="Planned duration, e.g. '14 days' or '3 days'")
    instructions: Optional[str] = Field(None, description="Clinical or patient instructions")
    consultation_id: Optional[str] = Field(None, description="Consultation ID if originated from doctor consultation")

class DrugInteractionItem(BaseModel):
    proposed_medication: str
    existing_medication: str
    existing_medication_dose: Optional[str] = None
    interaction_category: str
    severity: str  # "HIGH", "MODERATE", "LOW"
    risk_title: str
    explanation: str
    clinical_mechanism: Optional[str] = None
    clinical_impact: Optional[str] = None
    verified_source: str

class CategoryAssessment(BaseModel):
    status: str  # "HIGH", "MODERATE", "LOW"
    title: str
    summary: str
    details: str
    clinical_recommendation: str

class SaferOptionItem(BaseModel):
    category: str  # "Safer alternative", "Adjusted dose", "Adjusted duration", "Additional monitoring"
    recommendation: str
    reason: str
    source_reference: str
    is_recommended: bool = False

class ShortTermAssessment(BaseModel):
    efficacy_rating: str  # "High", "Moderate", "Limited"
    summary: str
    clinical_context: str

class LongTermAssessment(BaseModel):
    safety_rating: str  # "Safe", "Caution Required", "Hazardous / High Toxicity"
    summary: str
    organ_vulnerabilities: List[str] = Field(default_factory=list)

class PatientCaregiverSummary(BaseModel):
    medicine_name: str
    purpose: str
    dose_and_schedule: str
    important_caution: str
    reminder_info: str
    emergency_warning: Optional[str] = None

class MedicationAnalysisReportResponse(BaseModel):
    id: str
    patient_id: Optional[str] = None
    doctor_id: Optional[str] = None
    consultation_id: Optional[str] = None
    patient_age: Optional[int] = None
    
    # Medication profiles snapshot
    current_medications_snapshot: List[Dict[str, Any]] = Field(default_factory=list)
    proposed_medication: Dict[str, Any] = Field(default_factory=dict)
    
    # Overall risk ratings
    overall_risk: str  # "HIGH", "MODERATE", "LOW"
    overall_risk_level: str  # "HIGH", "MODERATE", "LOW"
    overall_risk_score: int  # 0 - 100
    risk_score: int  # alias for overall_risk_score

    # Category-level risk ratings
    interaction_risk: str
    dependence_risk: str
    cumulative_side_effect_risk: str
    age_appropriateness: str
    duration_appropriateness: str

    # Explanations and results
    plain_language_summary: str
    why_flagged: Optional[str] = None
    interaction_results: List[DrugInteractionItem] = Field(default_factory=list)
    
    # Specific category assessments
    dependence_result: CategoryAssessment
    cumulative_side_effect_result: CategoryAssessment
    age_result: CategoryAssessment
    duration_result: CategoryAssessment
    short_term_result: ShortTermAssessment
    long_term_result: LongTermAssessment

    # Actionable options
    recommendations: List[SaferOptionItem] = Field(default_factory=list)

    # Simplified patient & caregiver home guidance
    patient_summary: Optional[PatientCaregiverSummary] = None

    # Medical CDSS Disclaimer
    disclaimer: str = (
        "MedGuard Medication Risk Analyzer is a Clinical Decision Support System (CDSS) for informational purposes. "
        "It does not automatically prescribe, approve medications, or diagnose patients. "
        "Final clinical authority remains with the attending physician."
    )
    created_at: Optional[str] = None
