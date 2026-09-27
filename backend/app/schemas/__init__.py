from app.schemas.user import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse,
)
from app.schemas.medication import (
    ScheduleCreate,
    ScheduleResponse,
    MedicationCreate,
    MedicationUpdate,
    MedicationResponse,
    MedicationLogResponse,
    ReminderItemResponse,
    AdherenceSummaryResponse,
)

from app.schemas.consultation import (
    ConsultationCreate,
    ConsultationReportResponse,
    ConsultationMessageCreate,
    ConsultationMessageResponse,
    ConsultationStatusUpdate,
    ConsultationResponse,
    ConsultationListItem,
)

from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentStatusUpdate,
    AppointmentResponse,
)
from app.schemas.report import (
    HealthMetricsCreate,
    HealthMetricsResponse,
    MedicalReportResponse,
    PatientProfileResponse,
)
from app.schemas.medicine_analyzer import (
    MedicineAnalyzeRequest,
    MedicineAnalyzeResponse,
)
from app.schemas.dashboard import (
    PatientDashboardResponse,
    DoctorPatientDashboardResponse,
    HealthMetricsSummary,
    PatientInfoSummary,
)

__all__ = [
    "UserRegisterRequest",
    "UserLoginRequest",
    "UserResponse",
    "TokenResponse",
    "ScheduleCreate",
    "ScheduleResponse",
    "MedicationCreate",
    "MedicationUpdate",
    "MedicationResponse",
    "MedicationLogResponse",
    "ReminderItemResponse",
    "AdherenceSummaryResponse",
    "ConsultationCreate",
    "ConsultationReportResponse",
    "ConsultationMessageCreate",
    "ConsultationMessageResponse",
    "ConsultationStatusUpdate",
    "ConsultationResponse",
    "ConsultationListItem",
    "AppointmentCreate",
    "AppointmentStatusUpdate",
    "AppointmentResponse",
    "HealthMetricsCreate",
    "HealthMetricsResponse",
    "MedicalReportResponse",
    "PatientProfileResponse",
    "MedicineAnalyzeRequest",
    "MedicineAnalyzeResponse",
    "PatientDashboardResponse",
    "DoctorPatientDashboardResponse",
    "HealthMetricsSummary",
    "PatientInfoSummary",
]
