import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class MedicationAnalysisReport(Base):
    __tablename__ = "medication_analysis_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    patient_id = Column(String(100), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    doctor_id = Column(String(100), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    consultation_id = Column(String(100), ForeignKey("consultations.id", ondelete="SET NULL"), nullable=True, index=True)
    patient_age = Column(Integer, nullable=True)

    # Snapshot of all current medications reviewed at analysis timestamp
    current_medications_snapshot = Column(JSON, nullable=False, default=list)
    
    # Snapshot of the proposed medication considered
    proposed_medication = Column(JSON, nullable=False, default=dict)

    # Risk Metrics
    overall_risk_level = Column(String(20), nullable=False, index=True)  # LOW, MODERATE, HIGH
    overall_risk_score = Column(Integer, nullable=False)  # 0 - 100

    # Category results stored as structured JSON snapshots
    interaction_results = Column(JSON, nullable=False, default=list)
    dependence_result = Column(JSON, nullable=False, default=dict)
    cumulative_side_effect_result = Column(JSON, nullable=False, default=dict)
    age_result = Column(JSON, nullable=False, default=dict)
    duration_result = Column(JSON, nullable=False, default=dict)
    short_term_result = Column(JSON, nullable=False, default=dict)
    long_term_result = Column(JSON, nullable=False, default=dict)

    # Actionable options / recommendations
    recommendations = Column(JSON, nullable=False, default=list)

    # Explanations and Summaries
    plain_language_summary = Column(Text, nullable=False)
    patient_summary = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    # Optional relationships if records exist in respective tables
    patient = relationship("User", foreign_keys=[patient_id], backref="medication_analysis_reports", lazy="joined")
    doctor = relationship("User", foreign_keys=[doctor_id], lazy="joined")
    consultation = relationship("Consultation", foreign_keys=[consultation_id], lazy="joined")

    def __repr__(self):
        return (
            f"<MedicationAnalysisReport id={self.id} patient_id={self.patient_id} "
            f"risk={self.overall_risk_level} score={self.overall_risk_score}>"
        )
