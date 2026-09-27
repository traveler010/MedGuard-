import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import enum
from app.database import Base

class LogStatus(str, enum.Enum):
    UPCOMING = "upcoming"
    TAKEN = "taken"
    SKIPPED = "skipped"
    MISSED = "missed"

class Medication(Base):
    __tablename__ = "medications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    patient_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    medicine_name = Column(String(150), nullable=False)
    dose = Column(String(50), nullable=False)
    frequency = Column(String(100), nullable=False)
    instructions = Column(Text, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    schedules = relationship("MedicationSchedule", back_populates="medication", cascade="all, delete-orphan", order_by="MedicationSchedule.scheduled_time")
    logs = relationship("MedicationLog", back_populates="medication", cascade="all, delete-orphan", order_by="desc(MedicationLog.created_at)")

    def __repr__(self):
        return f"<Medication id={self.id} name={self.medicine_name} patient_id={self.patient_id} active={self.active}>"

class MedicationSchedule(Base):
    __tablename__ = "medication_schedules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    medication_id = Column(String(36), ForeignKey("medications.id", ondelete="CASCADE"), nullable=False, index=True)
    scheduled_time = Column(String(20), nullable=False)  # e.g., "08:00 AM" or "08:00"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    medication = relationship("Medication", back_populates="schedules")

    def __repr__(self):
        return f"<MedicationSchedule id={self.id} med_id={self.medication_id} time={self.scheduled_time}>"

class MedicationLog(Base):
    __tablename__ = "medication_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    medication_id = Column(String(36), ForeignKey("medications.id", ondelete="CASCADE"), nullable=False, index=True)
    schedule_id = Column(String(36), ForeignKey("medication_schedules.id", ondelete="SET NULL"), nullable=True, index=True)
    scheduled_date = Column(String(20), nullable=True, default=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d"), index=True)
    scheduled_time = Column(String(20), nullable=False)
    status = Column(String(20), nullable=False, default=LogStatus.UPCOMING.value)
    action_time = Column(DateTime, nullable=True)  # Exact timestamp when patient took or skipped
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    medication = relationship("Medication", back_populates="logs")

    def __repr__(self):
        return f"<MedicationLog id={self.id} med_id={self.medication_id} status={self.status} time={self.scheduled_time}>"
