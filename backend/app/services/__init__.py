from app.services.user_service import (
    get_user_by_email,
    get_user_by_id,
    register_user,
    authenticate_user,
)
from app.services.medication_service import (
    get_patient_medications,
    get_medication_by_id,
    create_patient_medication,
    update_patient_medication,
    delete_patient_medication,
    get_patient_reminders,
    update_reminder_status,
    get_doctor_patient_medication_history,
    get_doctor_patient_medication_adherence,
)

from app.services.consultation_service import (
    create_patient_consultation,
    get_patient_consultations,
    get_consultation_by_id_for_patient,
    get_doctor_consultations,
    get_consultation_by_id_for_doctor,
    update_consultation_status,
    add_message_to_consultation,
)

from app.services.appointment_service import (
    create_appointment,
    get_patient_appointments,
    get_patient_appointment_by_id,
    get_doctor_appointments,
    get_doctor_appointment_by_id,
    update_appointment_status,
)
from app.services.report_service import (
    upload_patient_report,
    get_patient_reports,
    get_report_for_download,
    get_latest_health_metrics,
    record_patient_health_metrics,
)
from app.services.medicine_analyzer_service import (
    analyze_medication_compatibility,
)
from app.services.dashboard_service import (
    get_patient_dashboard_summary,
    get_doctor_patient_dashboard_summary,
)

__all__ = [
    "get_user_by_email",
    "get_user_by_id",
    "register_user",
    "authenticate_user",
    "get_patient_medications",
    "get_medication_by_id",
    "create_patient_medication",
    "update_patient_medication",
    "delete_patient_medication",
    "get_patient_reminders",
    "update_reminder_status",
    "get_doctor_patient_medication_history",
    "get_doctor_patient_medication_adherence",
    "create_patient_consultation",
    "get_patient_consultations",
    "get_consultation_by_id_for_patient",
    "get_doctor_consultations",
    "get_consultation_by_id_for_doctor",
    "update_consultation_status",
    "add_message_to_consultation",
    "create_appointment",
    "get_patient_appointments",
    "get_patient_appointment_by_id",
    "get_doctor_appointments",
    "get_doctor_appointment_by_id",
    "update_appointment_status",
    "upload_patient_report",
    "get_patient_reports",
    "get_report_for_download",
    "get_latest_health_metrics",
    "record_patient_health_metrics",
    "analyze_medication_compatibility",
    "get_patient_dashboard_summary",
    "get_doctor_patient_dashboard_summary",
]
