# MedGuard Integrated Clinical Backend API

Production-ready, modular, and secure FastAPI backend service powering MedGuard. Connects the Patient Portal and Doctor Clinical Workspace with PostgreSQL, SQLAlchemy ORM, Alembic migrations, JWT authentication, role-based access control, medication tracking, consultations, appointments, medical reports, and medicine compatibility analysis.

---

## 1. Backend Setup

### Prerequisites
* Python 3.11+ or Python 3.12
* PostgreSQL 14+ (or SQLite local fallback for verification)
* Node.js 18+ (for frontend integration)

### Directory Structure
```
backend/
├── alembic/                 # Database migration scripts & environments
│   ├── versions/            # Versioned migration revisions
│   └── env.py               # Migration context configuration
├── app/
│   ├── main.py              # FastAPI app initialization, CORS, lifespan, routes
│   ├── config.py            # Pydantic BaseSettings & environment variables
│   ├── database.py          # PostgreSQL / SQLAlchemy engine & session factory
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── user.py          # User & UserRole
│   │   ├── medication.py    # Medication, MedicationSchedule, MedicationLog
│   │   ├── consultation.py  # Consultation, ConsultationReport, ConsultationMessage
│   │   ├── appointment.py   # Appointment, AppointmentStatus
│   │   └── report.py        # PatientProfile, MedicalReport, HealthMetrics
│   ├── schemas/             # Pydantic validation & response schemas
│   ├── routers/             # Modular API route controllers
│   │   ├── auth.py
│   │   ├── patient_medications.py
│   │   ├── doctor_medications.py
│   │   ├── patient_consultations.py
│   │   ├── doctor_consultations.py
│   │   ├── patient_appointments.py
│   │   ├── doctor_appointments.py
│   │   ├── reports.py
│   │   ├── medicine_analyzer.py
│   │   └── dashboard.py
│   ├── services/            # Business logic & data access services
│   ├── auth/                # JWT, Bcrypt password hashing, and role dependencies
│   └── utils/               # Structured logging
├── uploads/                 # Secure report file storage (PDF/PNG/JPG)
├── alembic.ini              # Alembic configuration
├── requirements.txt         # Pinned Python dependencies
├── .env.example             # Environment variable template
├── .env                     # Local environment file
├── test_backend.py          # Auth & Role verification suite
├── test_medications.py      # Medication & Reminders verification suite
├── test_consultations.py    # Consultation & Triage verification suite
└── test_complete_workflow.py # Full 15-step end-to-end integration test
```

---

## 2. PostgreSQL Setup

1. Start PostgreSQL server on `localhost:5432` (or your host):
   ```sql
   CREATE DATABASE medguard_db;
   CREATE USER medguard_user WITH ENCRYPTED PASSWORD 'medguard_pass';
   GRANT ALL PRIVILEGES ON DATABASE medguard_db TO medguard_user;
   ```
2. If PostgreSQL is offline, `app/database.py` seamlessly falls back to `sqlite:///./medguard_dev.db` for local test suites and offline verification.

---

## 3. Environment Variables

Configure your `.env` in `backend/.env`:

```env
# Application
PROJECT_NAME="MedGuard Backend"
VERSION="1.0.0"
DEBUG=True

# Database Configuration
DATABASE_URL=postgresql://medguard_user:medguard_pass@localhost:5432/medguard_db
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20

# JWT Security
SECRET_KEY=super-secret-jwt-key-change-this-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
```

---

## 4. Installing Dependencies

Create and activate virtual environment, then install dependencies:

```bash
cd backend

# Windows PowerShell
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install requirements
pip install -r requirements.txt
```

---

## 5. Running Database Migrations

Use Alembic to manage database schema migrations:

```bash
# Run migrations up to latest head
alembic upgrade head

# Generate a new migration revision after model changes
alembic revision --autogenerate -m "describe_changes"

# View current migration state
alembic current
```

---

## 6. Starting FastAPI

Start the API development server with Uvicorn:

```bash
# From backend directory
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 7. Interactive API Documentation

Once the server is running, explore:
* **Interactive Swagger UI**: `http://localhost:8000/docs`
* **ReDoc Specification**: `http://localhost:8000/redoc`
* **Health Check**: `http://localhost:8000/health` &rarr; `{"status": "ok"}`

---

## 8. Frontend Connection

The Next.js frontend connects to the backend through the dedicated, modular API client layer located at `src/services/api/`:

* **Configuration**: Set in root `.env.local` or environment:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```
* **Organized API Modules**:
  * `src/services/api/auth.ts`: Authentication, Registration, Login, Token persistence
  * `src/services/api/patients.ts`: Patient and Doctor dashboard summaries
  * `src/services/api/reports.ts`: Medical report uploads and downloads
  * `src/services/api/medications.ts`: Medication CRUD and Doctor adherence telemetry
  * `src/services/api/reminders.ts`: Medication reminders (Taken / Skipped)
  * `src/services/api/consultations.ts`: Symptom questionnaire submission & clinical review
  * `src/services/api/appointments.ts`: Appointment scheduling & confirmation
  * `src/services/api/medicine-analyzer.ts`: Drug interaction compatibility check

---

## 9. Test Accounts & Seeding

For testing, register accounts via `/auth/register` or run the verification suites:

* **Doctor Account**:
  * **Email**: `dr.sarah@medguard.com`
  * **Password**: `DoctorPassword123!`
  * **Role**: `doctor`
* **Patient Account**:
  * **Email**: `ananya.patient@medguard.com`
  * **Password**: `PatientPassword123!`
  * **Role**: `patient`

---

## 10. Upload & Report Storage Location

* Uploaded medical documents (PDF, PNG, JPG) are securely saved to:
  ```
  backend/uploads/
  ```
* **Security & Confidentiality**:
  * Files are saved with cryptographically random UUID names on disk.
  * Direct public bucket access is prohibited.
  * Files are streamed via authenticated endpoints:
    * `GET /patients/me/reports/{id}/file` (Patient owner only)
    * `GET /doctor/reports/{id}/file` (Verified doctor only)

---

## 11. Complete API Endpoints Summary

### Authentication
* `POST /auth/register` - Create doctor or patient account
* `POST /auth/login` - Authenticate credentials and receive Bearer JWT
* `GET /auth/me` - Retrieve authenticated user profile

### Patient Portal
* `GET /patients/me/dashboard` - Complete patient clinical summary
* `GET /patients/me/medications` - Current active prescriptions
* `POST /patients/me/medications` - Add new medication & intake schedule
* `GET /patients/me/medications/{id}` - Medication details
* `PUT /patients/me/medications/{id}` - Update medication
* `DELETE /patients/me/medications/{id}` - Delete medication
* `GET /patients/me/reminders` - Daily intake reminders
* `POST /patients/me/reminders/{id}/taken` - Mark reminder taken with exact timestamp
* `POST /patients/me/reminders/{id}/skip` - Mark reminder skipped with exact timestamp
* `POST /patients/me/reports` - Upload report (PDF/image) and extract health metrics
* `GET /patients/me/reports` - List uploaded medical reports
* `GET /patients/me/reports/{id}/file` - Download/view own report
* `POST /patients/me/consultations` - Submit questionnaire & create preliminary symptom report
* `GET /patients/me/consultations` - View consultation history
* `GET /patients/me/consultations/{id}` - View consultation thread & doctor responses
* `POST /patients/me/consultations/{id}/messages` - Reply to doctor
* `GET /patients/me/appointments` - View scheduled appointments
* `POST /patients/me/appointments` - Book new appointment

### Doctor Portal
* `GET /doctor/patients/{id}/dashboard` - Complete doctor clinical workspace summary
* `GET /doctor/patients/{id}/medications` - Monitor patient prescriptions & schedules
* `GET /doctor/patients/{id}/medication-history` - Chronological log of Taken/Missed/Skipped doses
* `GET /doctor/patients/{id}/medication-adherence` - Mathematical adherence percentage
* `GET /doctor/reports/{id}/file` - Securely inspect patient medical report file
* `GET /doctor/consultations` - Clinical triage inbox
* `GET /doctor/consultations/{id}` - Open consultation workspace & review symptom report
* `PATCH /doctor/consultations/{id}/status` - Update status (`under_review`, `reviewed`)
* `POST /doctor/consultations/{id}/messages` - Send clinical guidance/response
* `GET /doctor/appointments` - List doctor appointments
* `GET /doctor/appointments/{id}` - View appointment details
* `PATCH /doctor/appointments/{id}/status` - Confirm or complete appointment

### Medicine Compatibility Analyzer
* `POST /medicine/analyze` - Drug-drug compatibility check (returns verified interaction signals without fabricating data)

---

## 12. Verification Suites

Run the comprehensive test suites:

```bash
cd backend

# 1. Auth & Role Isolation (7/7 tests)
.\venv\Scripts\python.exe test_backend.py

# 2. Medication & Reminders Tracking (8/8 tests)
.\venv\Scripts\python.exe test_medications.py

# 3. Doctor-Patient Consultations (8/8 tests)
.\venv\Scripts\python.exe test_consultations.py

# 4. Complete End-to-End Workflow (15/15 tests)
.\venv\Scripts\python.exe test_complete_workflow.py
```
