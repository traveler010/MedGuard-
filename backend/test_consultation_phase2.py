"""
MedGuard Doctor–Patient Consultation Phase 2 End-to-End Test Suite
Tests:
1. Patient registration & authentication
2. Start consultation (POST /consultations)
3. Add medicine manually (POST /consultations/{id}/medications)
4. Upload prescription image (POST /consultations/{id}/attachments)
5. Upload medical report (POST /consultations/{id}/attachments)
6. Send consultation message (POST /consultations/{id}/messages)
7. Doctor registration & authentication
8. Doctor opens consultation review (GET /doctor/consultations/{id} and GET /consultations/{id})
9. Doctor views medicines & uploaded files
10. Doctor downloads attachment file stream securely (GET /consultations/{id}/attachments/{att_id}/file)
11. Doctor sends clinical response (POST /consultations/{id}/messages)
12. Patient receives response and unread status updates (GET /consultations/{id}/messages)
13. Doctor uploads authorized prescription (POST /consultations/{id}/prescription)
14. Patient receives prescription in their prescription list (GET /patient/prescriptions)
15. Real-time WebSocket connection and messaging (/ws/consultations/{consultation_id})
16. Strict authorization & cross-patient security tests
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
    print("MEDGUARD DOCTOR-PATIENT CONSULTATION PHASE 2 VERIFICATION")
    print("=" * 70)

    Base.metadata.create_all(bind=engine)
    client = TestClient(app)

    # 1. Setup doctor and patient accounts
    print("\n[Step 1] Initializing Test Doctor & Patient Accounts...")
    db = SessionLocal()
    db.query(User).filter(User.email.in_([
        "dr.phase2@medguard.com",
        "patient.phase2@medguard.com",
        "unrelated.patient@medguard.com",
        "unrelated.doctor@medguard.com",
    ])).delete(synchronize_session=False)
    db.commit()
    db.close()

    # Register Doctor
    doc_res = client.post("/auth/register", json={
        "name": "Dr. Sarah Mitchell",
        "email": "dr.phase2@medguard.com",
        "password": "DoctorPassword123!",
        "role": "doctor"
    })
    assert doc_res.status_code == 201, f"Doctor register failed: {doc_res.text}"
    doc_id = doc_res.json()["id"]
    doc_login = client.post("/auth/login", json={"email": "dr.phase2@medguard.com", "password": "DoctorPassword123!"})
    doc_token = doc_login.json()["access_token"]
    doc_headers = {"Authorization": f"Bearer {doc_token}"}

    # Register Patient
    pat_res = client.post("/auth/register", json={
        "name": "Raj Kumar",
        "email": "patient.phase2@medguard.com",
        "password": "PatientPassword123!",
        "role": "patient"
    })
    assert pat_res.status_code == 201, f"Patient register failed: {pat_res.text}"
    pat_id = pat_res.json()["id"]
    pat_login = client.post("/auth/login", json={"email": "patient.phase2@medguard.com", "password": "PatientPassword123!"})
    pat_token = pat_login.json()["access_token"]
    pat_headers = {"Authorization": f"Bearer {pat_token}"}

    # Register Unrelated Patient (for security checks)
    pat2_res = client.post("/auth/register", json={
        "name": "Intruder Patient",
        "email": "unrelated.patient@medguard.com",
        "password": "Password123!",
        "role": "patient"
    })
    pat2_token = client.post("/auth/login", json={"email": "unrelated.patient@medguard.com", "password": "Password123!"}).json()["access_token"]
    pat2_headers = {"Authorization": f"Bearer {pat2_token}"}

    # Register Unrelated Doctor
    doc2_res = client.post("/auth/register", json={
        "name": "Unrelated Doctor",
        "email": "unrelated.doctor@medguard.com",
        "password": "Password123!",
        "role": "doctor"
    })
    doc2_token = client.post("/auth/login", json={"email": "unrelated.doctor@medguard.com", "password": "Password123!"}).json()["access_token"]
    doc2_headers = {"Authorization": f"Bearer {doc2_token}"}

    print("[PASS] Authenticated accounts registered successfully.")

    # 2. Start Consultation (POST /consultations)
    print("\n[Step 2] Patient Starts Consultation (POST /consultations)...")
    create_payload = {
        "doctor_id": doc_id,
        "initial_message": "Hello Dr. Mitchell, experiencing persistent morning dizziness after blood pressure medicine.",
        "symptoms": "Morning lightheadedness and tension headache",
        "duration": "3 days",
        "severity": "Moderate",
        "current_medicines": "Aspirin 75mg, Lisinopril 5mg"
    }
    cons_res = client.post("/consultations", json=create_payload, headers=pat_headers)
    assert cons_res.status_code == 201, f"Failed: {cons_res.text}"
    cons_data = cons_res.json()
    cons_id = cons_data["id"]
    assert cons_data["patient_id"] == pat_id
    assert cons_data["doctor_id"] == doc_id
    assert cons_data["status"] == "waiting_for_doctor"
    assert len(cons_data["messages"]) == 1
    print(f"[PASS] Consultation created: ID={cons_id}, Status={cons_data['status']}")

    # 3. Add Medicine Manually (POST /consultations/{id}/medications)
    print("\n[Step 3] Patient Adds Medicine Manually (POST /consultations/{id}/medications)...")
    med_payload = {
        "medicine_name": "Paracetamol",
        "dose": "500 mg",
        "frequency": "Twice daily",
        "scheduled_times": "08:00 AM • 08:00 PM",
        "start_date": "2026-09-20",
        "instructions": "Take after meals for joint comfort",
        "source": "manual"
    }
    add_med_res = client.post(f"/consultations/{cons_id}/medications", json=med_payload, headers=pat_headers)
    assert add_med_res.status_code == 201, f"Failed: {add_med_res.text}"
    med_data = add_med_res.json()
    assert med_data["medicine_name"] == "Paracetamol"
    assert med_data["source"] == "manual"
    print(f"[PASS] Medication added: {med_data['medicine_name']} ({med_data['dose']})")

    # Add second medicine
    med2_payload = {
        "medicine_name": "Lisinopril",
        "dose": "5 mg",
        "frequency": "Once daily",
        "scheduled_times": "08:00 AM",
        "start_date": "2026-01-15",
        "instructions": "Take in the morning",
        "source": "manual"
    }
    client.post(f"/consultations/{cons_id}/medications", json=med2_payload, headers=pat_headers)

    # Verify GET /consultations/{id}/medications
    get_meds_res = client.get(f"/consultations/{cons_id}/medications", headers=pat_headers)
    assert get_meds_res.status_code == 200
    meds_list = get_meds_res.json()
    assert len(meds_list) == 2
    print(f"[PASS] GET /consultations/{cons_id}/medications verified 2 medications.")

    # 4. Upload Prescription Image (POST /consultations/{id}/attachments)
    print("\n[Step 4] Patient Uploads Prescription Image...")
    fake_img = io.BytesIO(b"\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00" + b"Simulated prescription image bytes")
    files = {"file": ("prescription_dr_mitchell.jpg", fake_img, "image/jpeg")}
    data = {"attachment_type": "prescription"}
    att_rx_res = client.post(f"/consultations/{cons_id}/attachments", files=files, data=data, headers=pat_headers)
    assert att_rx_res.status_code == 201, f"Failed: {att_rx_res.text}"
    rx_att = att_rx_res.json()
    rx_att_id = rx_att["id"]
    assert rx_att["attachment_type"] == "prescription"
    assert rx_att["file_name"] == "prescription_dr_mitchell.jpg"
    print(f"[PASS] Prescription image uploaded: ID={rx_att_id}, Name={rx_att['file_name']}")

    # 5. Upload Medical Report (POST /consultations/{id}/attachments)
    print("\n[Step 5] Patient Uploads Medical Report (PDF)...")
    fake_pdf = io.BytesIO(b"%PDF-1.4 Simulated blood metabolic lab panel report content")
    files_pdf = {"file": ("Metabolic_CBC_Report.pdf", fake_pdf, "application/pdf")}
    data_pdf = {"attachment_type": "medical_report"}
    att_rep_res = client.post(f"/consultations/{cons_id}/attachments", files=files_pdf, data=data_pdf, headers=pat_headers)
    assert att_rep_res.status_code == 201, f"Failed: {att_rep_res.text}"
    rep_att = att_rep_res.json()
    rep_att_id = rep_att["id"]
    assert rep_att["attachment_type"] == "medical_report"
    print(f"[PASS] Medical report attached: ID={rep_att_id}, Name={rep_att['file_name']}")

    # Verify GET /consultations/{id}/attachments
    list_att_res = client.get(f"/consultations/{cons_id}/attachments", headers=pat_headers)
    assert list_att_res.status_code == 200
    assert len(list_att_res.json()) == 2
    print(f"[PASS] Verified {len(list_att_res.json())} attachments present in consultation.")

    # 6. Patient Sends Follow-up Message (POST /consultations/{id}/messages)
    print("\n[Step 6] Patient Sends Consultation Message...")
    msg_payload = {"message": "I also noticed slight dry cough over the weekend."}
    msg_res = client.post(f"/consultations/{cons_id}/messages", json=msg_payload, headers=pat_headers)
    assert msg_res.status_code == 201
    msg_data = msg_res.json()
    assert msg_data["sender_role"] == "patient"
    print(f"[PASS] Message sent by patient: '{msg_data['message']}'")

    # 7. Doctor Opens Consultation Review (GET /doctor/consultations/{id})
    print("\n[Step 7] Doctor Reviews Consultation (GET /doctor/consultations/{id})...")
    doc_detail_res = client.get(f"/doctor/consultations/{cons_id}", headers=doc_headers)
    assert doc_detail_res.status_code == 200, f"Failed: {doc_detail_res.text}"
    review = doc_detail_res.json()
    assert review["patient"]["name"] == "Raj Kumar"
    assert len(review["manually_entered_medicines"]) == 2
    assert len(review["uploaded_prescriptions"]) == 1
    assert len(review["medical_reports"]) == 1
    assert len(review["patient_messages"]) >= 1
    assert review["consultation_status"] == "waiting_for_doctor"
    print("[PASS] Doctor review retrieved full clinical package successfully:")
    print(f"       - Patient: {review['patient']['name']}")
    print(f"       - Manual Medicines: {len(review['manually_entered_medicines'])}")
    print(f"       - Uploaded Prescriptions: {len(review['uploaded_prescriptions'])}")
    print(f"       - Medical Reports: {len(review['medical_reports'])}")
    print(f"       - Status: {review['consultation_status']}")

    # 8. Doctor Secure File Download (GET /consultations/{id}/attachments/{id}/file)
    print("\n[Step 8] Doctor Securely Streams Attached Document...")
    file_stream_res = client.get(f"/consultations/{cons_id}/attachments/{rx_att_id}/file", headers=doc_headers)
    assert file_stream_res.status_code == 200
    assert len(file_stream_res.content) > 0
    print(f"[PASS] File stream verified ({len(file_stream_res.content)} bytes).")

    # 9. Doctor Sends Response Message (POST /consultations/{id}/messages)
    print("\n[Step 9] Doctor Replies with Clinical Guidance...")
    doc_reply_payload = {
        "message": "I reviewed your uploaded prescription and reports. Please follow the medication plan provided below."
    }
    doc_reply_res = client.post(f"/consultations/{cons_id}/messages", json=doc_reply_payload, headers=doc_headers)
    assert doc_reply_res.status_code == 201
    reply_data = doc_reply_res.json()
    assert reply_data["sender_role"] == "doctor"
    print(f"[PASS] Doctor reply delivered: '{reply_data['message']}'")

    # 10. Patient Reads Messages and Checks Status
    print("\n[Step 10] Patient Retrieves Consultation Messages...")
    get_msgs_res = client.get(f"/consultations/{cons_id}/messages", headers=pat_headers)
    assert get_msgs_res.status_code == 200
    all_msgs = get_msgs_res.json()
    assert len(all_msgs) >= 3
    doc_msg_received = next((m for m in all_msgs if m["sender_role"] == "doctor"), None)
    assert doc_msg_received is not None
    assert "I reviewed your uploaded prescription" in doc_msg_received["message"]
    print(f"[PASS] Patient received doctor message: '{doc_msg_received['message']}'")

    # 11. Doctor Uploads Prescription (POST /consultations/{id}/prescription)
    print("\n[Step 11] Doctor Uploads Authorized Prescription (POST /consultations/{id}/prescription)...")
    rx_pdf = io.BytesIO(b"%PDF-1.4 Official Authorized Medical Prescription by Dr. Sarah Mitchell, MD")
    rx_files = {"file": ("Authorized_Prescription_Sep2026.pdf", rx_pdf, "application/pdf")}
    rx_res = client.post(f"/consultations/{cons_id}/prescription", files=rx_files, headers=doc_headers)
    assert rx_res.status_code == 201, f"Failed: {rx_res.text}"
    doc_rx = rx_res.json()
    assert doc_rx["status"] == "Available"
    assert doc_rx["doctor_name"] == "Dr. Sarah Mitchell"
    assert doc_rx["file_name"] == "Authorized_Prescription_Sep2026.pdf"
    print(f"[PASS] Doctor prescription authorized: '{doc_rx['file_name']}', Status='{doc_rx['status']}'")

    # 12. Patient Receives Prescription (GET /patient/prescriptions)
    print("\n[Step 12] Patient Checks Prescriptions (GET /patient/prescriptions)...")
    pat_rx_res = client.get("/patient/prescriptions", headers=pat_headers)
    assert pat_rx_res.status_code == 200
    pat_rx_list = pat_rx_res.json()
    assert len(pat_rx_list) >= 1
    assert pat_rx_list[0]["status"] == "Available"
    assert pat_rx_list[0]["doctor_name"] == "Dr. Sarah Mitchell"
    print(f"[PASS] Patient can view {len(pat_rx_list)} authorized prescription(s).")

    # 13. WebSocket Real-Time Communication Test
    print("\n[Step 13] Testing Real-Time WebSocket Communication (/ws/consultations/{id})...")
    with client.websocket_connect(f"/ws/consultations/{cons_id}?token={pat_token}") as ws:
        init_event = ws.receive_json()
        assert init_event["event"] == "connected"
        assert init_event["consultation_id"] == cons_id
        print(f"[PASS] WebSocket connected successfully: {init_event}")

        # Send ping
        ws.send_text('{"action": "ping"}')
        pong_event = ws.receive_json()
        assert pong_event["event"] == "pong"
        print("[PASS] WebSocket ping/pong verified.")

    # 14. Strict Security & Access Control Tests
    print("\n[Step 14] Testing Security & Access Isolation Rules...")
    # Unrelated patient cannot access this consultation
    intruder_res = client.get(f"/consultations/{cons_id}", headers=pat2_headers)
    assert intruder_res.status_code == 403, f"Expected 403, got {intruder_res.status_code}"
    print("[PASS] Unrelated patient blocked from consultation (HTTP 403 Forbidden).")

    # Unrelated patient cannot access files
    intruder_file_res = client.get(f"/consultations/{cons_id}/attachments/{rx_att_id}/file", headers=pat2_headers)
    assert intruder_file_res.status_code == 403
    print("[PASS] Unrelated patient blocked from attachment stream (HTTP 403 Forbidden).")

    # Unauthenticated request rejected
    unauth_res = client.get(f"/consultations/{cons_id}")
    assert unauth_res.status_code == 401
    print("[PASS] Unauthenticated request rejected (HTTP 401 Unauthorized).")

    print("\n" + "=" * 70)
    print("ALL 14 DOCTOR-PATIENT CONSULTATION PHASE 2 TESTS PASSED!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
