"""
MedGuard Backend - Complete End-to-End Workflow Integration Test
Validates the entire patient-to-doctor clinical loop across:
1. Patient Auth (Register/Login)
2. Medical Report Upload & Health Metric extraction
3. Health Metrics availability on Patient Dashboard
4. Medication addition & schedule generation
5. Reminders generation & Taken/Skipped recording with exact timestamps
6. Drug compatibility analyzer (verified check & non-fabricating fallback)
7. Symptom questionnaire submission & Consultation report generation (with mandatory disclaimer)
8. Appointment booking
9. Doctor Auth (Register/Login)
10. Doctor viewing patient dashboard & health summary
11. Doctor inspecting medical report file
12. Doctor tracking medications & intake adherence
13. Doctor consultation triage, review, and clinical response
14. Patient receiving doctor's response
15. Doctor viewing and confirming appointment
"""

import sys
import os
import io

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.user import User

def run_tests():
    print("=" * 70)
    print("MEDGUARD COMPLETE BACKEND INTEGRATION WORKFLOW TEST")
    print("=" * 70)

    Base.metadata.create_all(bind=engine)
    client = TestClient(app)

    db = SessionLocal()
    # Clean previous test users
    db.query(User).filter(User.email.in_(["workflow.patient@medguard.com", "workflow.doctor@medguard.com"])).delete(synchronize_session=False)
    db.commit()
    db.close()

    # -------------------------------------------------------------
    # 1. PATIENT: Register & Login
    # -------------------------------------------------------------
    print("\n[Step 1/15] Patient Registration & Login...")
    pat_reg = client.post("/auth/register", json={
        "name": "Arjun Patel",
        "email": "workflow.patient@medguard.com",
        "password": "Password123!",
        "role": "patient"
    })
    assert pat_reg.status_code == 201, f"Patient register failed: {pat_reg.text}"
    patient_id = pat_reg.json()["id"]

    pat_login = client.post("/auth/login", json={"email": "workflow.patient@medguard.com", "password": "Password123!"})
    assert pat_login.status_code == 200
    pat_token = pat_login.json()["access_token"]
    pat_headers = {"Authorization": f"Bearer {pat_token}"}
    print(f"[PASS] Patient registered (ID: {patient_id}) and authenticated.")

    # -------------------------------------------------------------
    # 2. PATIENT: Upload Medical Report with Extracted Metrics
    # -------------------------------------------------------------
    print("\n[Step 2/15] Patient Uploads Medical Report...")
    fake_pdf = io.BytesIO(b"%PDF-1.4 Fake Medical Diagnostic Report Content...")
    upload_res = client.post(
        "/patients/me/reports",
        files={"file": ("blood_test_sept2026.pdf", fake_pdf, "application/pdf")},
        data={
            "title": "Comprehensive Blood Panel",
            "report_type": "Hematology",
            "blood_pressure": "122/82 mmHg",
            "blood_count": "4.9 million/mcL",
            "haemoglobin": "14.5 g/dL"
        },
        headers=pat_headers,
    )
    assert upload_res.status_code == 201, f"Report upload failed: {upload_res.text}"
    report_data = upload_res.json()
    report_id = report_data["id"]
    print(f"[PASS] Medical Report uploaded (ID: {report_id}) with verified health metrics.")

    # -------------------------------------------------------------
    # 3. PATIENT: Health Metrics Available in Dashboard
    # -------------------------------------------------------------
    print("\n[Step 3/15] Checking Health Metrics in Patient Dashboard...")
    dash_res = client.get("/patients/me/dashboard", headers=pat_headers)
    assert dash_res.status_code == 200
    dashboard = dash_res.json()
    assert dashboard["health_metrics"]["blood_pressure"] == "122/82 mmHg"
    assert dashboard["health_metrics"]["blood_count"] == "4.9 million/mcL"
    assert dashboard["health_metrics"]["haemoglobin"] == "14.5 g/dL"
    assert len(dashboard["recent_reports"]) >= 1
    print(f"[PASS] Dashboard reflects exact health metrics: BP={dashboard['health_metrics']['blood_pressure']}, Hb={dashboard['health_metrics']['haemoglobin']}.")

    # -------------------------------------------------------------
    # 4. PATIENT: Add Medicines
    # -------------------------------------------------------------
    print("\n[Step 4/15] Patient Adds Medications...")
    med_res = client.post(
        "/patients/me/medications",
        json={
            "medicine_name": "Atorvastatin Calcium",
            "dose": "20 mg",
            "frequency": "Once daily at night",
            "instructions": "Take after dinner with water",
            "scheduled_times": ["09:00 PM"]
        },
        headers=pat_headers,
    )
    assert med_res.status_code == 201
    med_id = med_res.json()["id"]
    print(f"[PASS] Medication created: 'Atorvastatin Calcium' (ID: {med_id}).")

    # -------------------------------------------------------------
    # 5. PATIENT: Medicine Reminder Created
    # -------------------------------------------------------------
    print("\n[Step 5/15] Verifying Daily Medicine Reminders...")
    reminders_res = client.get("/patients/me/reminders", headers=pat_headers)
    assert reminders_res.status_code == 200
    reminders = reminders_res.json()
    assert len(reminders) >= 1
    reminder_id = reminders[0]["id"]
    assert reminders[0]["status"] == "upcoming"
    print(f"[PASS] Reminder generated for 09:00 PM (ID: {reminder_id}).")

    # -------------------------------------------------------------
    # 6. PATIENT: Take/Skip Medicine & Status Recorded
    # -------------------------------------------------------------
    print("\n[Step 6/15] Patient Records Medication Intake (Taken)...")
    taken_res = client.post(f"/patients/me/reminders/{reminder_id}/taken", headers=pat_headers)
    assert taken_res.status_code == 200
    assert taken_res.json()["status"] == "taken"
    assert taken_res.json()["action_time"] is not None
    print(f"[PASS] Reminder recorded as 'taken' at {taken_res.json()['action_time']}.")

    # -------------------------------------------------------------
    # 7. PATIENT: Medicine Compatibility Analyzer
    # -------------------------------------------------------------
    print("\n[Step 7/15] Checking Drug Compatibility in Medicine Analyzer...")
    # Test verified interaction
    compat_res = client.post("/medicine/analyze", json={"medicine_1": "Aspirin", "medicine_2": "Warfarin"})
    assert compat_res.status_code == 200
    compat_data = compat_res.json()
    assert compat_data["status"] == "checked"
    assert compat_data["severity"] == "high"
    assert "bleeding" in compat_data["summary"].lower()
    assert "Preliminary informational check only" in compat_data["disclaimer"]

    # Test unknown pair with non-fabrication rule
    unindexed_res = client.post("/medicine/analyze", json={"medicine_1": "Amoxicillin", "medicine_2": "Cetirizine"})
    assert unindexed_res.status_code == 200
    assert unindexed_res.json()["status"] == "insufficient_data"
    assert unindexed_res.json()["severity"] is None
    print("[PASS] Medicine analyzer verified: Accurate signaling without inventing medical data.")

    # -------------------------------------------------------------
    # 8. PATIENT: Start Consultation & Generate Report
    # -------------------------------------------------------------
    print("\n[Step 8/15] Patient Submits Consultation Questionnaire...")
    consult_res = client.post(
        "/patients/me/consultations",
        json={
            "symptoms": "Mild shortness of breath during exertion",
            "duration": "1 week",
            "severity": "Mild",
            "associated_symptoms": "Occasional dry cough",
            "current_medicines": "Atorvastatin 20mg",
            "relevant_history": "Seasonal allergies",
            "initial_message": "Hello Doctor, noticed this during my evening walks."
        },
        headers=pat_headers,
    )
    assert consult_res.status_code == 201
    consultation = consult_res.json()
    consultation_id = consultation["id"]
    assert consultation["status"] == "new"
    assert consultation["report"]["disclaimer"] == "Preliminary Symptom Summary — Not a Medical Diagnosis"
    print(f"[PASS] Consultation created (ID: {consultation_id}) with mandatory non-diagnosis disclaimer.")

    # -------------------------------------------------------------
    # 9. PATIENT: Book Appointment
    # -------------------------------------------------------------
    print("\n[Step 9/15] Patient Books an Appointment...")
    appt_res = client.post(
        "/patients/me/appointments",
        json={
            "appointment_date": "2026-10-02",
            "appointment_time": "11:00 AM",
            "appointment_type": "Cardiology Consultation",
            "notes": "Follow up on cholesterol and exertion symptoms"
        },
        headers=pat_headers,
    )
    assert appt_res.status_code == 201
    appointment_id = appt_res.json()["id"]
    assert appt_res.json()["status"] == "upcoming"
    print(f"[PASS] Appointment scheduled (ID: {appointment_id}) for 2026-10-02 at 11:00 AM.")

    # -------------------------------------------------------------
    # 10. DOCTOR: Register & Login
    # -------------------------------------------------------------
    print("\n[Step 10/15] Doctor Registers and Logs In...")
    doc_reg = client.post("/auth/register", json={
        "name": "Dr. Robert Chen, MD",
        "email": "workflow.doctor@medguard.com",
        "password": "DoctorPass123!",
        "role": "doctor"
    })
    assert doc_reg.status_code == 201
    doc_id = doc_reg.json()["id"]

    doc_login = client.post("/auth/login", json={"email": "workflow.doctor@medguard.com", "password": "DoctorPass123!"})
    assert doc_login.status_code == 200
    doc_token = doc_login.json()["access_token"]
    doc_headers = {"Authorization": f"Bearer {doc_token}"}
    print(f"[PASS] Doctor registered (ID: {doc_id}) and authenticated.")

    # -------------------------------------------------------------
    # 11. DOCTOR: View Patient Health Summary Workspace
    # -------------------------------------------------------------
    print("\n[Step 11/15] Doctor Opens Patient Clinical Dashboard...")
    doc_dash_res = client.get(f"/doctor/patients/{patient_id}/dashboard", headers=doc_headers)
    assert doc_dash_res.status_code == 200
    doc_dash = doc_dash_res.json()
    assert doc_dash["patient_info"]["name"] == "Arjun Patel"
    assert doc_dash["health_metrics"]["blood_pressure"] == "122/82 mmHg"
    assert len(doc_dash["recent_reports"]) >= 1
    assert len(doc_dash["current_medicines"]) >= 1
    print("[PASS] Doctor viewed patient workspace with health metrics and active prescriptions.")

    # -------------------------------------------------------------
    # 12. DOCTOR: Download & Review Medical Report
    # -------------------------------------------------------------
    print("\n[Step 12/15] Doctor Downloads & Inspects Medical Report File...")
    doc_file_res = client.get(f"/doctor/reports/{report_id}/file", headers=doc_headers)
    assert doc_file_res.status_code == 200
    assert doc_file_res.headers["content-type"] == "application/pdf"
    assert b"%PDF-1.4" in doc_file_res.content
    print("[PASS] Doctor securely accessed and verified patient medical report PDF stream.")

    # -------------------------------------------------------------
    # 13. DOCTOR: Track Patient Adherence & Logs
    # -------------------------------------------------------------
    print("\n[Step 13/15] Doctor Monitors Medication Adherence...")
    adh_res = client.get(f"/doctor/patients/{patient_id}/medication-adherence", headers=doc_headers)
    assert adh_res.status_code == 200
    adh_data = adh_res.json()
    assert adh_data["taken_count"] >= 1
    print(f"[PASS] Adherence calculated: {adh_data['adherence_percentage']}% (Taken: {adh_data['taken_count']}).")

    # -------------------------------------------------------------
    # 14. DOCTOR: Triage, Review, & Respond to Consultation
    # -------------------------------------------------------------
    print("\n[Step 14/15] Doctor Triages and Reviews Consultation...")
    inbox_res = client.get("/doctor/consultations", headers=doc_headers)
    assert inbox_res.status_code == 200
    matched = [c for c in inbox_res.json() if c["id"] == consultation_id]
    assert len(matched) == 1

    # Doctor updates status to under_review
    client.patch(f"/doctor/consultations/{consultation_id}/status", json={"status": "under_review"}, headers=doc_headers)

    # Doctor sends response message
    msg_res = client.post(
        f"/doctor/consultations/{consultation_id}/messages",
        json={"message": "Hello Arjun, I reviewed your blood panel and exertion symptoms. Please avoid heavy evening exercise until our consultation."},
        headers=doc_headers
    )
    assert msg_res.status_code == 201

    # Doctor marks consultation as reviewed
    rev_res = client.patch(f"/doctor/consultations/{consultation_id}/status", json={"status": "reviewed"}, headers=doc_headers)
    assert rev_res.status_code == 200
    assert rev_res.json()["status"] == "reviewed"
    assert rev_res.json()["completed_at"] is not None
    print("[PASS] Doctor reviewed consultation and sent clinical response.")

    # Patient retrieves doctor's response
    pat_check = client.get(f"/patients/me/consultations/{consultation_id}", headers=pat_headers)
    assert pat_check.status_code == 200
    assert any("avoid heavy evening exercise" in m["message"] for m in pat_check.json()["messages"])
    print("[PASS] Patient portal successfully received doctor's clinical response.")

    # -------------------------------------------------------------
    # 15. DOCTOR: Review and Confirm Appointment
    # -------------------------------------------------------------
    print("\n[Step 15/15] Doctor Confirms Appointment...")
    doc_appts = client.get("/doctor/appointments", headers=doc_headers)
    assert doc_appts.status_code == 200
    matched_appts = [a for a in doc_appts.json() if a["id"] == appointment_id]
    assert len(matched_appts) == 1

    confirm_res = client.patch(f"/doctor/appointments/{appointment_id}/status", json={"status": "confirmed"}, headers=doc_headers)
    assert confirm_res.status_code == 200
    assert confirm_res.json()["status"] == "confirmed"

    # Patient checks confirmed appointment
    pat_appt = client.get(f"/patients/me/appointments/{appointment_id}", headers=pat_headers)
    assert pat_appt.status_code == 200
    assert pat_appt.json()["status"] == "confirmed"
    print("[PASS] Appointment confirmed and synchronized between Patient and Doctor portals.")

    print("\n" + "=" * 70)
    print("ALL 15 INTEGRATION WORKFLOW STEPS COMPLETED AND PASSED (100%)!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
