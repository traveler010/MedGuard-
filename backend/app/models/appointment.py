import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import enum
from app.database import Base

class AppointmentStatus(str, enum.Enum):
    UPCOMING = "upcoming"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    patient_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    appointment_date = Column(String(20), nullable=False, index=True)  # e.g. "2026-09-28"
    appointment_time = Column(String(20), nullable=False)              # e.g. "10:30 AM"
    appointment_type = Column(String(100), nullable=False, default="General Consultation")
    status = Column(String(20), nullable=False, default=AppointmentStatus.UPCOMING.value, index=True)
    notes = Column(Text, nullable=True)
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

    def __repr__(self):
        return f"<Appointment id={self.id} patient_id={self.patient_id} status={self.status}>"
