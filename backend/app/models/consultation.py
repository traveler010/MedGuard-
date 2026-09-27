import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer
from sqlalchemy.orm import relationship
import enum
from app.database import Base

class ConsultationStatus(str, enum.Enum):
    ACTIVE = "active"
    WAITING_FOR_DOCTOR = "waiting_for_doctor"
    WAITING_FOR_PATIENT = "waiting_for_patient"
    COMPLETED = "completed"
    # Legacy aliases for backwards compatibility
    NEW = "new"
    UNDER_REVIEW = "under_review"
    REVIEWED = "reviewed"

class MedicationSource(str, enum.Enum):
    MANUAL = "manual"
    UPLOADED_PRESCRIPTION = "uploaded_prescription"
    UPLOADED_MEDICINE_IMAGE = "uploaded_medicine_image"

class AttachmentType(str, enum.Enum):
    PRESCRIPTION = "prescription"
    MEDICINE_IMAGE = "medicine_image"
    MEDICAL_REPORT = "medical_report"
    DOCTOR_PRESCRIPTION = "doctor_prescription"
    OTHER = "other"

class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    patient_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    appointment_id = Column(String(36), ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True, index=True)
    
    status = Column(String(30), nullable=False, default=ConsultationStatus.WAITING_FOR_DOCTOR.value, index=True)
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    last_activity_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    patient = relationship("User", foreign_keys=[patient_id])
    doctor = relationship("User", foreign_keys=[doctor_id])
    appointment = relationship("Appointment", foreign_keys=[appointment_id])
    
    medications = relationship(
        "ConsultationMedication",
        back_populates="consultation",
        cascade="all, delete-orphan",
        order_by="ConsultationMedication.created_at",
    )
    attachments = relationship(
        "ConsultationAttachment",
        back_populates="consultation",
        cascade="all, delete-orphan",
        order_by="ConsultationAttachment.uploaded_at",
    )
    messages = relationship(
        "ConsultationMessage",
        back_populates="consultation",
        cascade="all, delete-orphan",
        order_by="ConsultationMessage.created_at",
    )
    report = relationship(
        "ConsultationReport",
        back_populates="consultation",
        uselist=False,
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<Consultation id={self.id} patient_id={self.patient_id} doctor_id={self.doctor_id} status={self.status}>"

class ConsultationMedication(Base):
    __tablename__ = "consultation_medications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    consultation_id = Column(String(36), ForeignKey("consultations.id", ondelete="CASCADE"), nullable=False, index=True)
    medicine_name = Column(String(200), nullable=False)
    dose = Column(String(100), nullable=False)
    frequency = Column(String(100), nullable=False)
    scheduled_times = Column(String(255), nullable=True)
    start_date = Column(String(50), nullable=True)
    end_date = Column(String(50), nullable=True)
    instructions = Column(Text, nullable=True)
    source = Column(String(50), nullable=False, default=MedicationSource.MANUAL.value)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    consultation = relationship("Consultation", back_populates="medications")

    def __repr__(self):
        return f"<ConsultationMedication id={self.id} medicine={self.medicine_name} source={self.source}>"

class ConsultationAttachment(Base):
    __tablename__ = "consultation_attachments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    consultation_id = Column(String(36), ForeignKey("consultations.id", ondelete="CASCADE"), nullable=False, index=True)
    uploaded_by = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(100), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=True, default=0)
    attachment_type = Column(String(50), nullable=False, default=AttachmentType.PRESCRIPTION.value)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    consultation = relationship("Consultation", back_populates="attachments")
    uploader = relationship("User", foreign_keys=[uploaded_by])

    def __repr__(self):
        return f"<ConsultationAttachment id={self.id} file={self.file_name} type={self.attachment_type}>"

class ConsultationMessage(Base):
    __tablename__ = "consultation_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    consultation_id = Column(String(36), ForeignKey("consultations.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sender_role = Column(String(20), nullable=False)  # "patient" or "doctor"
    message = Column(Text, nullable=False)
    attachment_id = Column(String(36), ForeignKey("consultation_attachments.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    read_at = Column(DateTime, nullable=True)

    consultation = relationship("Consultation", back_populates="messages")
    sender = relationship("User", foreign_keys=[sender_id])
    attachment = relationship("ConsultationAttachment", foreign_keys=[attachment_id])

    def __repr__(self):
        return f"<ConsultationMessage id={self.id} sender_role={self.sender_role} consultation_id={self.consultation_id}>"

class ConsultationReport(Base):
    __tablename__ = "consultation_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    consultation_id = Column(String(36), ForeignKey("consultations.id", ondelete="CASCADE"), unique=True, nullable=False)
    symptoms = Column(Text, nullable=False)
    duration = Column(String(100), nullable=False)
    severity = Column(String(50), nullable=False)
    associated_symptoms = Column(Text, nullable=True)
    current_medicines = Column(Text, nullable=True)
    relevant_history = Column(Text, nullable=True)
    summary = Column(Text, nullable=False)
    disclaimer = Column(
        String(255),
        nullable=False,
        default="Preliminary Symptom Summary — Not a Medical Diagnosis"
    )
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    consultation = relationship("Consultation", back_populates="report")

    def __repr__(self):
        return f"<ConsultationReport id={self.id} consultation_id={self.consultation_id}>"
