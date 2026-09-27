import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    age = Column(Integer, nullable=True)
    gender = Column(String(20), nullable=True)
    blood_group = Column(String(10), nullable=True)
    phone = Column(String(30), nullable=True)
    emergency_contact = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship("User", backref="profile")

    def __repr__(self):
        return f"<PatientProfile user_id={self.user_id} age={self.age} blood_group={self.blood_group}>"

class MedicalReport(Base):
    __tablename__ = "medical_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    patient_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    report_type = Column(String(100), nullable=False, default="General Report")
    file_path = Column(String(500), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=False, default=0)
    mime_type = Column(String(100), nullable=False, default="application/pdf")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    patient = relationship("User", foreign_keys=[patient_id])
    health_metrics = relationship("HealthMetrics", back_populates="report", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<MedicalReport id={self.id} title={self.title} patient_id={self.patient_id}>"

class HealthMetrics(Base):
    __tablename__ = "health_metrics"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    patient_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    report_id = Column(String(36), ForeignKey("medical_reports.id", ondelete="SET NULL"), nullable=True, index=True)
    blood_pressure = Column(String(50), nullable=True)   # e.g. "120/80 mmHg"
    blood_count = Column(String(50), nullable=True)      # e.g. "4.8 million/mcL"
    haemoglobin = Column(String(50), nullable=True)      # e.g. "14.2 g/dL"
    other_metrics = Column(Text, nullable=True)          # JSON string of any extracted/additional measurements
    recorded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    patient = relationship("User", foreign_keys=[patient_id])
    report = relationship("MedicalReport", back_populates="health_metrics")

    def __repr__(self):
        return f"<HealthMetrics id={self.id} patient_id={self.patient_id} bp={self.blood_pressure} hb={self.haemoglobin}>"
