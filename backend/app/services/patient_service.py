import uuid
import json
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User, UserRole
from app.models.report import PatientProfile, HealthMetrics
from app.models.medication import Medication, MedicationSchedule
from app.models.appointment import Appointment, AppointmentStatus
from app.auth.password import hash_password
from app.schemas.patient import PatientCreateRequest, PatientResponse
from app.utils.logger import setup_logger

logger = setup_logger("medguard.patient_service")

DEFAULT_PATIENTS = [
    {
        "id": "pat-1",
        "name": "Raj Kumar",
        "email": "raj.kumar@medguard.clinic",
        "age": 68,
        "gender": "Male",
        "phone": "+91 98765 43210",
        "blood_group": "B+",
        "emergency_contact": "Anita Kumar (Wife) - +91 98765 43219",
        "primaryCondition": "Atrial Fibrillation, Hypertension",
        "riskLevel": "HIGH",
        "activeMedsCount": 3,
        "attentionNeeded": True,
        "attentionReason": "New symptom intake submitted",
        "lastVisit": "Sep 18, 2026",
        "nextAppointment": "Today, 10:15 AM",
        "medications": ["Warfarin 5mg", "Metoprolol 50mg", "Lisinopril 10mg"],
    },
    {
        "id": "pat-2",
        "name": "Priya Sharma",
        "email": "priya.sharma@medguard.clinic",
        "age": 64,
        "gender": "Female",
        "phone": "+91 98765 43211",
        "blood_group": "A+",
        "emergency_contact": "Amit Sharma (Son) - +91 98765 43220",
        "primaryCondition": "Type 2 Diabetes, Neuropathy",
        "riskLevel": "HIGH",
        "activeMedsCount": 5,
        "attentionNeeded": True,
        "attentionReason": "Missed 2 scheduled medicines",
        "lastVisit": "Sep 10, 2026",
        "nextAppointment": "Today, 11:30 AM",
        "medications": ["Metformin 1000mg", "Glipizide 5mg", "Gabapentin 300mg", "Atorvastatin 20mg", "Lisinopril 20mg"],
    },
    {
        "id": "pat-3",
        "name": "Rahul Kumar",
        "email": "rahul.kumar@medguard.clinic",
        "age": 45,
        "gender": "Male",
        "phone": "+91 98765 43212",
        "blood_group": "O+",
        "emergency_contact": "Sunita Kumar (Sister) - +91 98765 43221",
        "primaryCondition": "General Health, Mild Dyslipidemia",
        "riskLevel": "LOW",
        "activeMedsCount": 1,
        "attentionNeeded": False,
        "attentionReason": None,
        "lastVisit": "Aug 12, 2026",
        "nextAppointment": "Today, 09:00 AM",
        "medications": ["Atorvastatin 10mg"],
    },
    {
        "id": "pat-4",
        "name": "Anita Desai",
        "email": "anita.desai@medguard.clinic",
        "age": 72,
        "gender": "Female",
        "phone": "+91 98765 43213",
        "blood_group": "AB+",
        "emergency_contact": "Rohit Desai (Son) - +91 98765 43222",
        "primaryCondition": "Chronic Kidney Disease Stage 3, Osteoarthritis",
        "riskLevel": "HIGH",
        "activeMedsCount": 4,
        "attentionNeeded": True,
        "attentionReason": "eGFR decline on metabolic panel",
        "lastVisit": "Sep 02, 2026",
        "nextAppointment": "Sep 29, 2026",
        "medications": ["Acetaminophen 500mg", "Amlodipine 5mg", "Calcitriol 0.25mcg", "Sodium Bicarbonate 650mg"],
    },
    {
        "id": "pat-5",
        "name": "Sunita Verma",
        "email": "sunita.verma@medguard.clinic",
        "age": 58,
        "gender": "Female",
        "phone": "+91 98765 43214",
        "blood_group": "O-",
        "emergency_contact": "Ramesh Verma (Husband) - +91 98765 43223",
        "primaryCondition": "Essential Hypertension",
        "riskLevel": "MODERATE",
        "activeMedsCount": 2,
        "attentionNeeded": False,
        "attentionReason": None,
        "lastVisit": "Aug 20, 2026",
        "nextAppointment": "Oct 04, 2026",
        "medications": ["Telmisartan 40mg", "Hydrochlorothiazide 12.5mg"],
    },
    {
        "id": "pat-6",
        "name": "Vikram Rao",
        "email": "vikram.rao@medguard.clinic",
        "age": 59,
        "gender": "Male",
        "phone": "+91 98765 43215",
        "blood_group": "A-",
        "emergency_contact": "Meera Rao (Wife) - +91 98765 43224",
        "primaryCondition": "Coronary Artery Disease, Dyslipidemia",
        "riskLevel": "MODERATE",
        "activeMedsCount": 3,
        "attentionNeeded": True,
        "attentionReason": "Missed morning antihypertensive dose",
        "lastVisit": "Sep 15, 2026",
        "nextAppointment": "Oct 08, 2026",
        "medications": ["Aspirin 81mg", "Clopidogrel 75mg", "Rosuvastatin 20mg"],
    },
]

def ensure_default_patients(db: Session):
    """Seed existing clinical directory patients into the database if not present."""
    try:
        for dp in DEFAULT_PATIENTS:
            existing = db.query(User).filter((User.id == dp["id"]) | (User.email == dp["email"])).first()
            if not existing:
                default_pw = hash_password("MedGuardPatient2026!")
                user = User(
                    id=dp["id"],
                    name=dp["name"],
                    email=dp["email"],
                    hashed_password=default_pw,
                    role=UserRole.PATIENT.value,
                )
                db.add(user)
                db.flush()

                profile = PatientProfile(
                    user_id=user.id,
                    age=dp["age"],
                    gender=dp["gender"],
                    blood_group=dp["blood_group"],
                    phone=dp["phone"],
                    emergency_contact=dp["emergency_contact"],
                )
                db.add(profile)

                # Store primary condition & initial metrics
                metrics = HealthMetrics(
                    patient_id=user.id,
                    blood_pressure="120/80 mmHg",
                    other_metrics=json.dumps({
                        "primary_condition": dp["primaryCondition"],
                        "risk_level": dp["riskLevel"],
                        "attention_needed": dp["attentionNeeded"],
                        "attention_reason": dp["attentionReason"],
                        "last_visit": dp["lastVisit"],
                        "next_appointment": dp["nextAppointment"],
                    })
                )
                db.add(metrics)

                # Store sample medications
                for med_name in dp.get("medications", []):
                    med = Medication(
                        patient_id=user.id,
                        medicine_name=med_name,
                        dose="Standard dose",
                        frequency="Daily",
                        active=True,
                    )
                    db.add(med)

        db.commit()
    except Exception as e:
        db.rollback()
        logger.warning(f"Default patients seed warning: {e}")

def create_patient_record(db: Session, data: PatientCreateRequest) -> PatientResponse:
    """Create a new patient record permanently in the database."""
    # Ensure default patients exist first
    ensure_default_patients(db)

    # 1. Determine and validate unique patient ID
    patient_id = (data.patient_id.strip() if data.patient_id and data.patient_id.strip() 
                  else f"pat-{int(datetime.now(timezone.utc).timestamp())}")

    # Check if ID already exists
    existing_id = db.query(User).filter(User.id == patient_id).first()
    if existing_id:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A patient record with ID '{patient_id}' already exists. Please choose a different ID.",
        )

    # 2. Determine and validate unique email
    email = data.email.strip() if data.email else f"{patient_id}@medguard.clinic"
    existing_email = db.query(User).filter(User.email == email).first()
    if existing_email:
        # If user explicitly entered an email that exists, report conflict
        if data.email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"A patient record with email '{email}' already exists.",
            )
        else:
            email = f"{patient_id}-{uuid.uuid4().hex[:4]}@medguard.clinic"

    # 3. Create User record
    hashed_pwd = hash_password("MedGuardPatient2026!")
    new_user = User(
        id=patient_id,
        name=data.name.strip(),
        email=email,
        hashed_password=hashed_pwd,
        role=UserRole.PATIENT.value,
    )
    db.add(new_user)
    db.flush()

    # 4. Create PatientProfile
    new_profile = PatientProfile(
        user_id=new_user.id,
        age=data.age,
        gender=data.gender,
        blood_group=data.blood_group,
        phone=data.phone,
        emergency_contact=data.emergency_contact,
    )
    db.add(new_profile)

    # 5. Store Primary Condition & Medical History in HealthMetrics
    primary_cond = data.primary_condition.strip() if data.primary_condition else "General Consultation"
    other_data = {
        "primary_condition": primary_cond,
        "medical_history": data.medical_history.strip() if data.medical_history else "",
        "address": data.address.strip() if data.address else "",
        "risk_level": data.risk_level or "LOW",
        "last_visit": "Today",
        "next_appointment": "None scheduled",
    }
    metrics = HealthMetrics(
        patient_id=new_user.id,
        blood_pressure="120/80 mmHg",
        other_metrics=json.dumps(other_data),
    )
    db.add(metrics)

    # 6. Parse and store current medications / medicine_name if provided
    meds_count = 0
    raw_meds = []
    if data.medicine_name and data.medicine_name.strip():
        raw_meds.extend([m.strip() for m in data.medicine_name.replace("\n", ",").split(",") if m.strip()])
    if data.current_medications and data.current_medications.strip():
        raw_meds.extend([m.strip() for m in data.current_medications.replace("\n", ",").split(",") if m.strip()])

    # Deduplicate while preserving order
    unique_meds = []
    seen = set()
    for m in raw_meds:
        if m.lower() not in seen:
            seen.add(m.lower())
            unique_meds.append(m)

    for med_name in unique_meds:
        med_id = str(uuid.uuid4())
        med_entry = Medication(
            id=med_id,
            patient_id=new_user.id,
            medicine_name=med_name,
            dose="Standard dose",
            frequency="Daily",
            active=True,
        )
        db.add(med_entry)
        db.flush()

        # Create corresponding schedule for reminders and tracking
        sched = MedicationSchedule(
            medication_id=med_entry.id,
            scheduled_time="08:00 AM",
        )
        db.add(sched)
        meds_count += 1

    try:
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        logger.error(f"Error saving patient to database: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save patient record to the database. Please try again.",
        )

    primary_med = unique_meds[0] if unique_meds else None

    # Build and return response
    return PatientResponse(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        age=data.age,
        gender=data.gender,
        phone=data.phone,
        blood_group=data.blood_group,
        emergency_contact=data.emergency_contact,
        primaryCondition=primary_cond,
        riskLevel=data.risk_level or "LOW",
        activeMedsCount=meds_count,
        attentionNeeded=False,
        attentionReason=None,
        lastVisit="Today",
        nextAppointment="None scheduled",
        created_at=new_user.created_at.isoformat() if new_user.created_at else None,
        medications=unique_meds,
        primary_medicine=primary_med,
        primaryMedicine=primary_med,
    )

def get_all_patients_records(
    db: Session,
    query: Optional[str] = None,
    risk_filter: Optional[str] = None,
) -> List[PatientResponse]:
    """Retrieve all patients from the database with search and risk filtering."""
    ensure_default_patients(db)

    # Query all users with role patient
    patients_query = db.query(User).filter(User.role == UserRole.PATIENT.value)
    users = patients_query.all()

    results: List[PatientResponse] = []
    for u in users:
        # Get profile
        profile = db.query(PatientProfile).filter(PatientProfile.user_id == u.id).first()
        # Count active medications
        meds_count = db.query(Medication).filter(Medication.patient_id == u.id, Medication.active == True).count()
        # Get latest metrics
        latest_metrics = (
            db.query(HealthMetrics)
            .filter(HealthMetrics.patient_id == u.id)
            .order_by(HealthMetrics.recorded_at.desc())
            .first()
        )

        primary_cond = "General Consultation"
        risk_lvl = "LOW"
        attention_needed = False
        attention_reason = None
        last_visit = "Recent"
        next_apt = "None scheduled"

        if latest_metrics and latest_metrics.other_metrics:
            try:
                parsed = json.loads(latest_metrics.other_metrics)
                if isinstance(parsed, dict):
                    primary_cond = parsed.get("primary_condition", primary_cond)
                    risk_lvl = parsed.get("risk_level", risk_lvl)
                    attention_needed = parsed.get("attention_needed", False)
                    attention_reason = parsed.get("attention_reason", None)
                    last_visit = parsed.get("last_visit", last_visit)
                    next_apt = parsed.get("next_appointment", next_apt)
            except Exception:
                pass

        # Also check appointments table for next appointment
        upcoming_apt = (
            db.query(Appointment)
            .filter(
                Appointment.patient_id == u.id,
                Appointment.status.in_([AppointmentStatus.UPCOMING.value, AppointmentStatus.CONFIRMED.value])
            )
            .order_by(Appointment.appointment_date.asc())
            .first()
        )
        if upcoming_apt:
            next_apt = f"{upcoming_apt.appointment_date}, {upcoming_apt.appointment_time}"

        # Get active medications
        user_meds = db.query(Medication).filter(Medication.patient_id == u.id, Medication.active == True).all()
        med_names = [m.medicine_name for m in user_meds]
        meds_count = len(med_names)
        primary_med = med_names[0] if med_names else None

        pat_resp = PatientResponse(
            id=u.id,
            name=u.name,
            email=u.email,
            age=profile.age if profile else None,
            gender=profile.gender if profile else None,
            phone=profile.phone if profile else None,
            blood_group=profile.blood_group if profile else None,
            emergency_contact=profile.emergency_contact if profile else None,
            primaryCondition=primary_cond,
            riskLevel=risk_lvl,
            activeMedsCount=meds_count,
            attentionNeeded=attention_needed,
            attentionReason=attention_reason,
            lastVisit=last_visit,
            nextAppointment=next_apt,
            created_at=u.created_at.isoformat() if u.created_at else None,
            medications=med_names,
            primary_medicine=primary_med,
            primaryMedicine=primary_med,
        )

        # Apply query search filter
        if query:
            q = query.lower().strip()
            name_match = q in pat_resp.name.lower()
            id_match = q in pat_resp.id.lower()
            cond_match = q in pat_resp.primaryCondition.lower()
            med_match = any(q in m.lower() for m in med_names)
            if not (name_match or id_match or cond_match or med_match):
                continue

        # Apply risk filter
        if risk_filter and risk_filter.upper() != "ALL":
            rf = risk_filter.upper()
            if rf == "ATTENTION":
                if not pat_resp.attentionNeeded:
                    continue
            elif rf == "HIGH_RISK":
                if pat_resp.riskLevel != "HIGH":
                    continue
            elif rf == "STABLE":
                if pat_resp.attentionNeeded or pat_resp.riskLevel == "HIGH":
                    continue
            elif pat_resp.riskLevel != rf:
                continue

        results.append(pat_resp)

    return results

def get_patient_record_by_id(db: Session, patient_id: str) -> Optional[PatientResponse]:
    """Retrieve a single patient record by ID from the database."""
    ensure_default_patients(db)

    user = db.query(User).filter(User.id == patient_id, User.role == UserRole.PATIENT.value).first()
    if not user:
        return None

    profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
    user_meds = db.query(Medication).filter(Medication.patient_id == user.id, Medication.active == True).all()
    med_names = [m.medicine_name for m in user_meds]
    meds_count = len(med_names)
    primary_med = med_names[0] if med_names else None

    latest_metrics = (
        db.query(HealthMetrics)
        .filter(HealthMetrics.patient_id == user.id)
        .order_by(HealthMetrics.recorded_at.desc())
        .first()
    )

    primary_cond = "General Consultation"
    risk_lvl = "LOW"
    attention_needed = False
    attention_reason = None
    last_visit = "Recent"
    next_apt = "None scheduled"

    if latest_metrics and latest_metrics.other_metrics:
        try:
            parsed = json.loads(latest_metrics.other_metrics)
            if isinstance(parsed, dict):
                primary_cond = parsed.get("primary_condition", primary_cond)
                risk_lvl = parsed.get("risk_level", risk_lvl)
                attention_needed = parsed.get("attention_needed", False)
                attention_reason = parsed.get("attention_reason", None)
                last_visit = parsed.get("last_visit", last_visit)
                next_apt = parsed.get("next_appointment", next_apt)
        except Exception:
            pass

    return PatientResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        age=profile.age if profile else None,
        gender=profile.gender if profile else None,
        phone=profile.phone if profile else None,
        blood_group=profile.blood_group if profile else None,
        emergency_contact=profile.emergency_contact if profile else None,
        primaryCondition=primary_cond,
        riskLevel=risk_lvl,
        activeMedsCount=meds_count,
        attentionNeeded=attention_needed,
        attentionReason=attention_reason,
        lastVisit=last_visit,
        nextAppointment=next_apt,
        created_at=user.created_at.isoformat() if user.created_at else None,
        medications=med_names,
        primary_medicine=primary_med,
        primaryMedicine=primary_med,
    )
