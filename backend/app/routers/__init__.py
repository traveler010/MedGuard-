from app.routers.auth import router as auth_router
from app.routers.patient_medications import router as patient_medications_router
from app.routers.doctor_medications import router as doctor_medications_router

__all__ = [
    "auth_router",
    "patient_medications_router",
    "doctor_medications_router",
]
