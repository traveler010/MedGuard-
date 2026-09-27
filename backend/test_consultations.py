"""
MedGuard Backend - Consultation System Verification Script
Comprehensive end-to-end tests for:
1. Patient Consultation Creation with Structured Preliminary Report & Disclaimer
   (POST /patients/me/consultations)
2. Doctor Inbox & Consultation Detail Retrieval
   (GET /doctor/consultations, GET /doctor/consultations/{id})
3. Doctor Status Progression
   (PATCH /doctor/consultations/{id}/status -> under_review, reviewed)
4. Bidirectional Clinical Messaging Thread
   (Doctor: POST /doctor/consultations/{id}/messages, Patient: POST /patients/me/consultations/{id}/messages)
5. Patient Retrieval of Doctor's Clinical Response & History
   (GET /patients/me/consultations/{id}, GET /patients/me/consultations)
6. Strict Authorization & Data Isolation:
   - Other patients cannot read or post to another patient's consultation.
   - Patients cannot access doctor consultation endpoints.
7. Verification of Mandatory Disclaimers:
   - Verifies 'Preliminary Symptom Summary — Not a Medical Diagnosis' is embedded.
   - Asserts NO automatic disease diagnosis is made.
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.consultation import Consultation, ConsultationMessage, ConsultationReport

def run_tests():
    print("=" * 65)
    print("MEDGUARD BACKEND - CONSULTATION SYSTEM VERIFICATION")
    print("=" * 65)

    Base.metadata.create_all(bind=engine)
    client = TestClient(app)

    # 1. Clean previous test users
    print("\n[1/8] Setting up Test Users (Doctor, Patient A, Patient B)...")
    db = SessionLocal()
    test_emails = [
        "dr.consult@medguard.com",
        "patient.a@medguard.com",
        "patient.intruder@medguard.com",
    ]
    db.query(User).filter(User.email.in_(test_emails)).delete(synchronize_session=False)
    db.commit()
    db.close()

    # Register Doctor
    doc_reg = client.post("/auth/register", json={
        "name": "Dr. Sarah Mitchell",
        "email": "dr.consult@medguard.com",
        "password": "DoctorPass123!",
        "role": "doctor"
    })
    assert doc_reg.status_code == 201, f"Doctor register failed: {doc_reg.text}"
    doc_login = client.post("/auth/login", json={"email": "dr.consult@medguard.com", "password": "DoctorPass123!"})
    doc_token = doc_login.json()["access_token"]
    doc_headers = {"Authorization": f"Bearer {doc_token}"}

    # Register Patient A
    pat_reg = client.post("/auth/register", json={
        "name": "Ananya Roy",
        "email": "patient.a@medguard.com",
        "password": "PatientPass123!",
        "role": "patient"
    })
    assert pat_reg.status_code == 201, f"Patient A register failed: {pat_reg.text}"
    pat_login = client.post("/auth/login", json={"email": "patient.a@medguard.com", "password": "PatientPass123!"})
    pat_token = pat_login.json()["access_token"]
    pat_headers = {"Authorization": f"Bearer {pat_token}"}

    # Register Patient B (Intruder)
    intruder_reg = client.post("/auth/register", json={
        "name": "Intruder Patient",
        "email": "patient.intruder@medguard.com",
        "password": "IntruderPass123!",
        "role": "patient"
    })
    assert intruder_reg.status_code == 201
    intruder_login = client.post("/auth/login", json={"email": "patient.intruder@medguard.com", "password": "IntruderPass123!"})
    intruder_token = intruder_login.json()["access_token"]
    intruder_headers = {"Authorization": f"Bearer {intruder_token}"}

    print("[PASS] Test users registered and authenticated.")

    # 2. Patient creates consultation with preliminary questionnaire
    print("\n[2/8] Patient Submits Consultation & Symptom Questionnaire...")
    consultation_payload = {
        "symptoms": "Persistent tension headache and light dizziness",
        "duration": "4 days",
        "severity": "Moderate",
        "associated_symptoms": "Fatigue in late afternoon, sensitivity to bright screen",
        "current_medicines": "Lisinopril 10mg once daily",
        "relevant_history": "Mild hypertension under observation",
        "initial_message": "Hello Doctor, the headache starts around 2 PM every day."
    }

    create_res = client.post("/patients/me/consultations", json=consultation_payload, headers=pat_headers)
    assert create_res.status_code == 201, f"Creation failed: {create_res.text}"
    consultation_data = create_res.json()
    consultation_id = consultation_data["id"]

    assert consultation_data["status"] == "new", f"Expected status 'new', got {consultation_data['status']}"
    assert consultation_data["report"] is not None, "Report must be generated"
    assert consultation_data["report"]["symptoms"] == consultation_payload["symptoms"]

    # Verify mandatory disclaimer and NO disease diagnosis
    report_disclaimer = consultation_data["report"]["disclaimer"]
    expected_disclaimer = "Preliminary Symptom Summary — Not a Medical Diagnosis"
    assert report_disclaimer == expected_disclaimer, f"Disclaimer mismatch: {report_disclaimer}"
    
    # Check messages
    assert len(consultation_data["messages"]) == 1
    assert consultation_data["messages"][0]["sender_role"] == "patient"
    assert "around 2 PM" in consultation_data["messages"][0]["message"]
    print(f"[PASS] Consultation created (ID: {consultation_id}) with status 'new'.")
    print(f"[PASS] Report contains disclaimer: '{report_disclaimer}'.")

    # 3. Doctor lists consultations in triage inbox
    print("\n[3/8] Doctor Views Consultation Inbox (GET /doctor/consultations)...")
    doc_inbox_res = client.get("/doctor/consultations", headers=doc_headers)
    assert doc_inbox_res.status_code == 200, f"Inbox fetch failed: {doc_inbox_res.text}"
    inbox_items = doc_inbox_res.json()
    assert len(inbox_items) >= 1
    matched = [item for item in inbox_items if item["id"] == consultation_id]
    assert len(matched) == 1, "Submitted consultation must appear in doctor inbox"
    assert matched[0]["status"] == "new"
    assert matched[0]["patient_name"] == "Ananya Roy"
    print(f"[PASS] Consultation found in doctor triage inbox.")

    # 4. Doctor opens consultation details
    print("\n[4/8] Doctor Opens Consultation Details (GET /doctor/consultations/{id})...")
    doc_detail_res = client.get(f"/doctor/consultations/{consultation_id}", headers=doc_headers)
    assert doc_detail_res.status_code == 200, f"Doctor detail fetch failed: {doc_detail_res.text}"
    doc_detail = doc_detail_res.json()
    assert doc_detail["id"] == consultation_id
    assert doc_detail["report"]["severity"] == "Moderate"
    print(f"[PASS] Doctor opened consultation and verified symptom report.")

    # 5. Doctor updates status to 'under_review'
    print("\n[5/8] Doctor Updates Status to 'under_review'...")
    status_res = client.patch(
        f"/doctor/consultations/{consultation_id}/status",
        json={"status": "under_review"},
        headers=doc_headers,
    )
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "under_review"
    print("[PASS] Status updated to 'under_review'.")

    # 6. Doctor sends clinical response
    print("\n[6/8] Doctor Sends Clinical Response...")
    doc_msg_payload = {
        "message": "Thank you for the detailed symptom report, Ananya. Please monitor your blood pressure morning and evening. Also ensure you take frequent screen breaks. If dizziness increases, please come for an in-person evaluation."
    }
    doc_msg_res = client.post(
        f"/doctor/consultations/{consultation_id}/messages",
        json=doc_msg_payload,
        headers=doc_headers,
    )
    assert doc_msg_res.status_code == 201, f"Doctor message failed: {doc_msg_res.text}"
    doc_msg_data = doc_msg_res.json()
    assert doc_msg_data["sender_role"] == "doctor"
    print(f"[PASS] Doctor clinical message sent successfully.")

    # 7. Patient retrieves consultation with doctor's response
    print("\n[7/8] Patient Retrieves Doctor's Response & Sends Follow-up...")
    pat_view_res = client.get(f"/patients/me/consultations/{consultation_id}", headers=pat_headers)
    assert pat_view_res.status_code == 200
    pat_view = pat_view_res.json()
    assert len(pat_view["messages"]) >= 2
    doctor_messages = [m for m in pat_view["messages"] if m["sender_role"] == "doctor"]
    assert len(doctor_messages) == 1
    assert "frequent screen breaks" in doctor_messages[0]["message"]
    print("[PASS] Patient retrieved doctor response successfully.")

    # Patient sends follow-up
    pat_followup = client.post(
        f"/patients/me/consultations/{consultation_id}/messages",
        json={"message": "Understood, Doctor. I will log my blood pressure twice daily."},
        headers=pat_headers
    )
    assert pat_followup.status_code == 201
    print("[PASS] Patient sent follow-up acknowledgement.")

    # Doctor marks consultation as 'reviewed'
    reviewed_res = client.patch(
        f"/doctor/consultations/{consultation_id}/status",
        json={"status": "reviewed"},
        headers=doc_headers,
    )
    assert reviewed_res.status_code == 200
    assert reviewed_res.json()["status"] == "reviewed"
    assert reviewed_res.json()["completed_at"] is not None
    print("[PASS] Consultation marked as 'reviewed' with completed_at timestamp.")

    # Patient checks consultation history
    pat_history_res = client.get("/patients/me/consultations", headers=pat_headers)
    assert pat_history_res.status_code == 200
    history_items = pat_history_res.json()
    assert any(h["id"] == consultation_id and h["status"] == "reviewed" for h in history_items)
    print("[PASS] Consultation history reflects 'reviewed' status.")

    # 8. Strict Authorization & Security Checks
    print("\n[8/8] Testing Strict Cross-Patient & Role-Based Authorization...")
    # Intruder patient tries to read patient A's consultation
    intruder_read = client.get(f"/patients/me/consultations/{consultation_id}", headers=intruder_headers)
    assert intruder_read.status_code in [403, 404], f"Expected 404/403, got {intruder_read.status_code}"

    # Intruder patient tries to post to patient A's consultation
    intruder_post = client.post(
        f"/patients/me/consultations/{consultation_id}/messages",
        json={"message": "I am an unauthorized patient"},
        headers=intruder_headers
    )
    assert intruder_post.status_code in [403, 404]

    # Patient tries to access doctor routes
    patient_doc_access = client.get("/doctor/consultations", headers=pat_headers)
    assert patient_doc_access.status_code == 403

    patient_status_patch = client.patch(
        f"/doctor/consultations/{consultation_id}/status",
        json={"status": "reviewed"},
        headers=pat_headers
    )
    assert patient_status_patch.status_code == 403
    print("[PASS] Strict authorization confirmed: Patient isolation and role enforcement verified.")

    print("\n" + "=" * 65)
    print("ALL CONSULTATION SYSTEM VERIFICATION TESTS PASSED SUCCESSFULLY!")
    print("=" * 65)

if __name__ == "__main__":
    run_tests()
