from typing import List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.medication import Medication, MedicationSchedule, MedicationLog, LogStatus
from app.models.user import User
from app.schemas.medication import (
    MedicationCreate,
    MedicationUpdate,
    MedicationResponse,
    ScheduleResponse,
    MedicationLogResponse,
    ReminderItemResponse,
    AdherenceSummaryResponse,
)

def get_patient_medications(
    db: Session, patient_id: str, active_only: bool = False
) -> List[MedicationResponse]:
    """Retrieve all medications belonging to a patient with their schedules."""
    query = db.query(Medication).filter(Medication.patient_id == patient_id)
    if active_only:
        query = query.filter(Medication.active == True)
    meds = query.order_by(Medication.created_at.desc()).all()

    result = []
    for med in meds:
        latest_log = (
            db.query(MedicationLog)
            .filter(MedicationLog.medication_id == med.id)
            .order_by(MedicationLog.created_at.desc())
            .first()
        )
        current_status = latest_log.status if latest_log else LogStatus.UPCOMING.value

        schedules = [
            ScheduleResponse.model_validate(s) for s in med.schedules
        ]

        result.append(
            MedicationResponse(
                id=med.id,
                patient_id=med.patient_id,
                medicine_name=med.medicine_name,
                dose=med.dose,
                frequency=med.frequency,
                instructions=med.instructions,
                start_date=med.start_date,
                end_date=med.end_date,
                active=med.active,
                created_at=med.created_at,
                updated_at=med.updated_at,
                schedules=schedules,
                current_status=current_status,
            )
        )
    return result

def get_medication_by_id(
    db: Session, medication_id: str, patient_id: Optional[str] = None
) -> Optional[Medication]:
    """Retrieve a single medication, optionally asserting patient ownership."""
    query = db.query(Medication).filter(Medication.id == medication_id)
    if patient_id:
        query = query.filter(Medication.patient_id == patient_id)
    return query.first()

def create_patient_medication(
    db: Session, patient_id: str, data: MedicationCreate
) -> MedicationResponse:
    """Create a new medication along with its scheduled times and initial upcoming logs."""
    medication = Medication(
        patient_id=patient_id,
        medicine_name=data.medicine_name.strip(),
        dose=data.dose.strip(),
        frequency=data.frequency.strip(),
        instructions=data.instructions.strip() if data.instructions else None,
        start_date=data.start_date or datetime.now(timezone.utc),
        end_date=data.end_date,
        active=data.active,
    )
    db.add(medication)
    db.flush()

    # Create schedules
    created_schedules = []
    for sched_time in data.scheduled_times:
        clean_time = sched_time.strip()
        if clean_time:
            schedule = MedicationSchedule(
                medication_id=medication.id,
                scheduled_time=clean_time,
            )
            db.add(schedule)
            db.flush()
            created_schedules.append(schedule)

            # Create initial upcoming log for today
            today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            initial_log = MedicationLog(
                medication_id=medication.id,
                schedule_id=schedule.id,
                scheduled_date=today_str,
                scheduled_time=clean_time,
                status=LogStatus.UPCOMING.value,
            )
            db.add(initial_log)

    db.commit()
    db.refresh(medication)

    return MedicationResponse(
        id=medication.id,
        patient_id=medication.patient_id,
        medicine_name=medication.medicine_name,
        dose=medication.dose,
        frequency=medication.frequency,
        instructions=medication.instructions,
        start_date=medication.start_date,
        end_date=medication.end_date,
        active=medication.active,
        created_at=medication.created_at,
        updated_at=medication.updated_at,
        schedules=[ScheduleResponse.model_validate(s) for s in created_schedules],
        current_status=LogStatus.UPCOMING.value,
    )

def update_patient_medication(
    db: Session, medication: Medication, data: MedicationUpdate
) -> MedicationResponse:
    """Update medication details and optionally replace schedules."""
    if data.medicine_name is not None:
        medication.medicine_name = data.medicine_name.strip()
    if data.dose is not None:
        medication.dose = data.dose.strip()
    if data.frequency is not None:
        medication.frequency = data.frequency.strip()
    if data.instructions is not None:
        medication.instructions = data.instructions.strip() if data.instructions else None
    if data.start_date is not None:
        medication.start_date = data.start_date
    if data.end_date is not None:
        medication.end_date = data.end_date
    if data.active is not None:
        medication.active = data.active

    # If scheduled_times explicitly provided, update schedules
    if data.scheduled_times is not None:
        # Remove existing schedules
        db.query(MedicationSchedule).filter(MedicationSchedule.medication_id == medication.id).delete()
        for sched_time in data.scheduled_times:
            clean_time = sched_time.strip()
            if clean_time:
                s = MedicationSchedule(
                    medication_id=medication.id,
                    scheduled_time=clean_time,
                )
                db.add(s)
                db.flush()
                today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
                l = MedicationLog(
                    medication_id=medication.id,
                    schedule_id=s.id,
                    scheduled_date=today_str,
                    scheduled_time=clean_time,
                    status=LogStatus.UPCOMING.value,
                )
                db.add(l)

    medication.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(medication)

    latest_log = (
        db.query(MedicationLog)
        .filter(MedicationLog.medication_id == medication.id)
        .order_by(MedicationLog.created_at.desc())
        .first()
    )

    return MedicationResponse(
        id=medication.id,
        patient_id=medication.patient_id,
        medicine_name=medication.medicine_name,
        dose=medication.dose,
        frequency=medication.frequency,
        instructions=medication.instructions,
        start_date=medication.start_date,
        end_date=medication.end_date,
        active=medication.active,
        created_at=medication.created_at,
        updated_at=medication.updated_at,
        schedules=[ScheduleResponse.model_validate(s) for s in medication.schedules],
        current_status=latest_log.status if latest_log else LogStatus.UPCOMING.value,
    )

def delete_patient_medication(db: Session, medication: Medication) -> None:
    """Delete a medication record and its cascaded schedules and logs."""
    db.delete(medication)
    db.commit()

def get_patient_reminders(
    db: Session, patient_id: str, target_date: Optional[str] = None
) -> List[ReminderItemResponse]:
    """Return all active medication reminders for target date (defaults to today)."""
    date_str = target_date or datetime.now(timezone.utc).strftime("%Y-%m-%d")
    medications = (
        db.query(Medication)
        .filter(Medication.patient_id == patient_id, Medication.active == True)
        .all()
    )

    reminders: List[ReminderItemResponse] = []
    for med in medications:
        for sched in med.schedules:
            # Find the log for this specific schedule and day
            log = (
                db.query(MedicationLog)
                .filter(
                    MedicationLog.medication_id == med.id,
                    MedicationLog.schedule_id == sched.id,
                    MedicationLog.scheduled_date == date_str,
                )
                .first()
            )

            # If no log exists for this date yet, create a fresh upcoming log
            if not log:
                log = MedicationLog(
                    medication_id=med.id,
                    schedule_id=sched.id,
                    scheduled_date=date_str,
                    scheduled_time=sched.scheduled_time,
                    status=LogStatus.UPCOMING.value,
                )
                db.add(log)
                db.commit()
                db.refresh(log)

            reminders.append(
                ReminderItemResponse(
                    id=log.id,
                    medication_id=med.id,
                    schedule_id=sched.id,
                    medicine_name=med.medicine_name,
                    dose=med.dose,
                    frequency=med.frequency,
                    scheduled_date=log.scheduled_date or date_str,
                    scheduled_time=sched.scheduled_time,
                    status=log.status,
                    action_time=log.action_time,
                )
            )

    # Sort reminders by scheduled_time
    reminders.sort(key=lambda r: r.scheduled_time)
    return reminders

def update_reminder_status(
    db: Session, reminder_identifier: str, patient_id: str, new_status: str
) -> MedicationLog:
    """
    Update a reminder's status to 'taken' or 'skipped' and record the exact action time.
    reminder_identifier can be a MedicationLog.id, a MedicationSchedule.id, or a Medication.id.
    """
    # 1. Try finding by MedicationLog.id
    log = (
        db.query(MedicationLog)
        .join(Medication, MedicationLog.medication_id == Medication.id)
        .filter(MedicationLog.id == reminder_identifier, Medication.patient_id == patient_id)
        .first()
    )

    # 2. If not found, try by MedicationSchedule.id
    if not log:
        sched = (
            db.query(MedicationSchedule)
            .join(Medication, MedicationSchedule.medication_id == Medication.id)
            .filter(MedicationSchedule.id == reminder_identifier, Medication.patient_id == patient_id)
            .first()
        )
        if sched:
            # Find or create log
            log = (
                db.query(MedicationLog)
                .filter(MedicationLog.schedule_id == sched.id)
                .order_by(MedicationLog.created_at.desc())
                .first()
            )
            if not log:
                log = MedicationLog(
                    medication_id=sched.medication_id,
                    schedule_id=sched.id,
                    scheduled_time=sched.scheduled_time,
                )
                db.add(log)

    # 3. If not found, try by Medication.id
    if not log:
        med = (
            db.query(Medication)
            .filter(Medication.id == reminder_identifier, Medication.patient_id == patient_id)
            .first()
        )
        if med:
            log = (
                db.query(MedicationLog)
                .filter(MedicationLog.medication_id == med.id)
                .order_by(MedicationLog.created_at.desc())
                .first()
            )
            if not log:
                sched = med.schedules[0] if med.schedules else None
                log = MedicationLog(
                    medication_id=med.id,
                    schedule_id=sched.id if sched else None,
                    scheduled_time=sched.scheduled_time if sched else "08:00 AM",
                )
                db.add(log)

    if not log:
        raise ValueError("Reminder not found or you do not have permission to update this reminder.")

    # Record exact action time
    log.status = new_status
    log.action_time = datetime.now(timezone.utc)
    db.commit()
    db.refresh(log)
    return log

def get_doctor_patient_medication_history(
    db: Session, patient_id: str
) -> List[MedicationLogResponse]:
    """Retrieve complete chronological medication intake history for a patient."""
    logs = (
        db.query(MedicationLog)
        .join(Medication, MedicationLog.medication_id == Medication.id)
        .filter(Medication.patient_id == patient_id)
        .order_by(MedicationLog.created_at.desc())
        .all()
    )

    result = []
    for l in logs:
        med = l.medication
        result.append(
            MedicationLogResponse(
                id=l.id,
                medication_id=l.medication_id,
                medicine_name=med.medicine_name if med else None,
                dose=med.dose if med else None,
                scheduled_date=l.scheduled_date,
                scheduled_time=l.scheduled_time,
                status=l.status,
                action_time=l.action_time,
                created_at=l.created_at,
            )
        )
    return result

def get_patient_medication_history(
    db: Session, patient_id: str
) -> List[MedicationLogResponse]:
    """Retrieve complete chronological medication intake history for a patient."""
    return get_doctor_patient_medication_history(db, patient_id)

def get_doctor_patient_medication_adherence(
    db: Session, patient_id: str
) -> AdherenceSummaryResponse:
    """Calculate statistical adherence percentage for a patient based on medication logs."""
    patient = db.query(User).filter(User.id == patient_id).first()
    patient_name = patient.name if patient else "Patient"

    medications = db.query(Medication).filter(Medication.patient_id == patient_id, Medication.active == True).all()
    logs = (
        db.query(MedicationLog)
        .join(Medication, MedicationLog.medication_id == Medication.id)
        .filter(Medication.patient_id == patient_id)
        .all()
    )

    taken_count = sum(1 for l in logs if l.status == LogStatus.TAKEN.value)
    missed_count = sum(1 for l in logs if l.status == LogStatus.MISSED.value)
    skipped_count = sum(1 for l in logs if l.status == LogStatus.SKIPPED.value)
    upcoming_count = sum(1 for l in logs if l.status == LogStatus.UPCOMING.value)
    total_logs = len(logs)

    # Simple adherence calculation: taken / (taken + missed + skipped)
    completed_doses = taken_count + missed_count + skipped_count
    if completed_doses > 0:
        adherence_pct = round((taken_count / completed_doses) * 100.0, 1)
        adherence_label = f"{adherence_pct}% adherence"
    elif total_logs > 0 and upcoming_count > 0:
        adherence_pct = 100.0
        adherence_label = "100% (All upcoming)"
    else:
        adherence_pct = 0.0
        adherence_label = "No logs recorded"

    return AdherenceSummaryResponse(
        patient_id=patient_id,
        patient_name=patient_name,
        total_active_medicines=len(medications),
        total_logs_recorded=total_logs,
        taken_count=taken_count,
        missed_count=missed_count,
        skipped_count=skipped_count,
        upcoming_count=upcoming_count,
        adherence_percentage=adherence_pct,
        adherence_label=adherence_label,
        note="Mathematical adherence percentage calculated from medication logs. No clinical diagnosis generated.",
    )
