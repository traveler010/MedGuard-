from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.appointment import Appointment, AppointmentStatus
from app.models.user import User
from app.schemas.appointment import AppointmentCreate, AppointmentResponse

def _to_appointment_response(appointment: Appointment) -> AppointmentResponse:
    patient_name = appointment.patient.name if appointment.patient else None
    doctor_name = appointment.doctor.name if appointment.doctor else None

    return AppointmentResponse(
        id=appointment.id,
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        patient_name=patient_name,
        doctor_name=doctor_name,
        appointment_date=appointment.appointment_date,
        appointment_time=appointment.appointment_time,
        appointment_type=appointment.appointment_type,
        status=appointment.status,
        notes=appointment.notes,
        created_at=appointment.created_at,
        updated_at=appointment.updated_at,
    )

def create_appointment(
    db: Session, patient_id: str, data: AppointmentCreate
) -> AppointmentResponse:
    """Create a new appointment for patient."""
    appointment = Appointment(
        patient_id=patient_id,
        doctor_id=data.doctor_id,
        appointment_date=data.appointment_date,
        appointment_time=data.appointment_time,
        appointment_type=data.appointment_type,
        status=AppointmentStatus.UPCOMING.value,
        notes=data.notes,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return _to_appointment_response(appointment)

def get_patient_appointments(
    db: Session, patient_id: str
) -> List[AppointmentResponse]:
    """Retrieve all appointments belonging to a patient."""
    appointments = (
        db.query(Appointment)
        .filter(Appointment.patient_id == patient_id)
        .order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc())
        .all()
    )
    return [_to_appointment_response(a) for a in appointments]

def get_patient_appointment_by_id(
    db: Session, appointment_id: str, patient_id: str
) -> Optional[AppointmentResponse]:
    """Retrieve a single appointment for a patient ensuring isolation."""
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id, Appointment.patient_id == patient_id)
        .first()
    )
    if not appointment:
        return None
    return _to_appointment_response(appointment)

def get_doctor_appointments(
    db: Session, doctor_id: str, status_filter: Optional[str] = None
) -> List[AppointmentResponse]:
    """Retrieve appointments for a doctor (assigned to them or open clinic appointments)."""
    query = db.query(Appointment).filter(
        or_(Appointment.doctor_id == doctor_id, Appointment.doctor_id == None)
    )
    if status_filter:
        query = query.filter(Appointment.status == status_filter)

    appointments = query.order_by(Appointment.appointment_date.asc(), Appointment.appointment_time.asc()).all()
    return [_to_appointment_response(a) for a in appointments]

def get_doctor_appointment_by_id(
    db: Session, appointment_id: str, doctor_id: str
) -> Optional[AppointmentResponse]:
    """Retrieve a specific appointment for a doctor with authorization check."""
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id)
        .first()
    )
    if not appointment:
        return None

    if appointment.doctor_id is not None and appointment.doctor_id != doctor_id:
        return None

    return _to_appointment_response(appointment)

def update_appointment_status(
    db: Session, appointment_id: str, doctor_id: str, new_status: AppointmentStatus
) -> Optional[AppointmentResponse]:
    """Update appointment status (e.g. confirmed, completed, cancelled)."""
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id)
        .first()
    )
    if not appointment:
        return None

    if appointment.doctor_id is not None and appointment.doctor_id != doctor_id:
        return None

    if appointment.doctor_id is None:
        appointment.doctor_id = doctor_id

    appointment.status = new_status.value
    appointment.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(appointment)
    return _to_appointment_response(appointment)
