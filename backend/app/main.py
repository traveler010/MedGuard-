import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine
from app.routers.auth import router as auth_router
from app.routers.patient_medications import router as patient_medications_router
from app.routers.doctor_medications import router as doctor_medications_router
from app.routers.patient_consultations import router as patient_consultations_router
from app.routers.doctor_consultations import router as doctor_consultations_router
from app.routers.patient_appointments import router as patient_appointments_router
from app.routers.doctor_appointments import router as doctor_appointments_router
from app.routers.reports import router as reports_router
from app.routers.medicine_analyzer import router as medicine_analyzer_router
from app.routers.dashboard import router as dashboard_router
from app.routers.consultations import router as consultations_router
from app.routers.patients import router as patients_router
from app.utils.logger import setup_logger

logger = setup_logger("medguard.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure database tables are created
    logger.info("Initializing MedGuard database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        from app.database import ensure_schema_compatibility
        ensure_schema_compatibility(engine)
        logger.info("[OK] Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
    
    # Ensure uploads directory exists
    uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    
    yield
    logger.info("Shutting down MedGuard API...")

app = FastAPI(
    title="MedGuard Clinical API",
    version=settings.VERSION,
    description="MedGuard Integrated Clinical Backend API: Auth, Medications, Consultations, Appointments, Medical Reports, Medicine Compatibility Analyzer, and Clinical Dashboards.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core Health Check Endpoint (Required format)
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}

# Routers
app.include_router(auth_router)
app.include_router(patient_medications_router)
app.include_router(doctor_medications_router)
app.include_router(patient_consultations_router)
app.include_router(doctor_consultations_router)
app.include_router(patient_appointments_router)
app.include_router(doctor_appointments_router)
app.include_router(reports_router)
app.include_router(medicine_analyzer_router)
app.include_router(dashboard_router)
app.include_router(consultations_router)
app.include_router(patients_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
