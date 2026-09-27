"""
MedGuard Phase 3 End-to-End Integration Test
=============================================
Tests the COMPLETE doctor–patient consultation workflow:

PATIENT FLOW:
Login → Start Consultation → Add medicine manually → Upload prescription image →
Upload medical report → Write message → Send

DOCTOR FLOW:
Login → Open Consultation → View medicines → View prescription → View report →
Read message → Chat → Analyze proposed medicine → Review risk → Upload prescription →
Send response

PATIENT FOLLOW-UP:
Receives response → Receives prescription → View prescription file →
Add confirmed medicines to reminders

DOCTOR TRACKER:
Opens Medicine Tracker → Sees schedule → Sees Taken/Upcoming status
"""

import sys
import os
import io

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.user import User


def run_phase3_test():
    print("=" * 70)
    print("MEDGUARD PHASE 3 — COMPLETE END-TO-END INTEGRATION TEST")
    print("=" * 70)

    Base.metadata.create_all(bind=engine)
    client = TestClient(app)

    # ━━━━━━━━━━━━━ SETUP ━━━━━━━━━━━━━
    print("\n[Setup] Cleaning test accounts...")
    db = SessionLocal()
    db.query(User).filter(User.email.in_([
        "dr.phase3@medguard.com",
        "patient.phase3@medguard.com",
    ])).delete(synchronize_session=False)
    db.commit()
    db.close()

    # Register Doctor
    doc_res = client.post("/auth/register", json={
        "name": "Dr. Sarah Mitchell",
        "email": "dr.phase3@medguard.com",
        "password": "DoctorPassword123!",
        "role": "doctor"
    })
    assert doc_res.status_code == 201
    doc_login = client.post("/auth/login", json={
        "email": "dr.phase3@medguard.com",
        "password": "DoctorPassword123!"
    })
    doc_token = doc_login.json()["access_token"]
    doc_headers = {"Authorization": f"Bearer {doc_token}"}
    doctor_id = doc_login.json()["user"]["id"]

    # Register Patient
    pat_res = client.post("/auth/register", json={
        "name": "Raj Kumar",
        "email": "patient.phase3@medguard.com",
        "password": "PatientPassword123!",
        "role": "patient"
    })
    assert pat_res.status_code == 201
    pat_login = client.post("/auth/login", json={
        "email": "patient.phase3@medguard.com",
        "password": "PatientPassword123!"
    })
    pat_token = pat_login.json()["access_token"]
    pat_headers = {"Authorization": f"Bearer {pat_token}"}
    patient_id = pat_login.json()["user"]["id"]

    print("[PASS] Doctor and Patient accounts initialized.\n")

    # ━━━━━━━━━━━━━ 1. PATIENT STARTS CONSULTATION ━━━━━━━━━━━━━
    print("[Step 1/15] Patient Starts Consultation...")
    cons_res = client.post("/consultations", json={
        "doctor_id": doctor_id,
        "initial_message": "Hello Doctor, I have been experiencing knee pain for the past week.",
    }, headers=pat_headers)
    assert cons_res.status_code == 201, f"Consultation creation failed: {cons_res.text}"
    consultation = cons_res.json()
    consultation_id = consultation["id"]
    assert consultation["status"] == "waiting_for_doctor"
    print(f"[PASS] Consultation created: {consultation_id}, Status: waiting_for_doctor\n")

    # ━━━━━━━━━━━━━ 2. PATIENT ADDS MEDICINE MANUALLY ━━━━━━━━━━━━━
    print("[Step 2/15] Patient Adds Current Medicine Manually...")
    med1 = client.post(f"/consultations/{consultation_id}/medications", json={
        "medicine_name": "Paracetamol",
        "dose": "500 mg",
        "frequency": "Twice daily",
        "scheduled_times": "08:00 AM, 08:00 PM",
        "start_date": "2026-09-20",
        "instructions": "Take with food for knee pain",
        "source": "manual",
    }, headers=pat_headers)
    assert med1.status_code == 201
    med2 = client.post(f"/consultations/{consultation_id}/medications", json={
        "medicine_name": "Lisinopril",
        "dose": "5 mg",
        "frequency": "Once daily",
        "scheduled_times": "08:00 AM",
        "instructions": "Blood pressure medication",
        "source": "manual",
    }, headers=pat_headers)
    assert med2.status_code == 201
    print(f"[PASS] 2 medicines added manually.\n")

    # ━━━━━━━━━━━━━ 3. PATIENT UPLOADS PRESCRIPTION IMAGE ━━━━━━━━━━━━━
    print("[Step 3/15] Patient Uploads Previous Prescription Image...")
    rx_img = io.BytesIO(b"\xFF\xD8\xFF\xE0" + b"\x00" * 50)  # minimal JPEG header
    rx_upload = client.post(
        f"/consultations/{consultation_id}/attachments",
        files={"file": ("prescription_old.jpg", rx_img, "image/jpeg")},
        data={"attachment_type": "prescription"},
        headers=pat_headers,
    )
    assert rx_upload.status_code == 201
    rx_att_id = rx_upload.json()["id"]
    print(f"[PASS] Prescription image uploaded: {rx_att_id}\n")

    # ━━━━━━━━━━━━━ 4. PATIENT UPLOADS MEDICAL REPORT ━━━━━━━━━━━━━
    print("[Step 4/15] Patient Uploads Medical Report...")
    report_pdf = io.BytesIO(b"%PDF-1.4\nBlood Test Report - Hemoglobin 14.5 g/dL")
    report_upload = client.post(
        f"/consultations/{consultation_id}/attachments",
        files={"file": ("blood_test_sep2026.pdf", report_pdf, "application/pdf")},
        data={"attachment_type": "medical_report"},
        headers=pat_headers,
    )
    assert report_upload.status_code == 201
    report_att_id = report_upload.json()["id"]
    print(f"[PASS] Medical report uploaded: {report_att_id}\n")

    # ━━━━━━━━━━━━━ 5. PATIENT SENDS MESSAGE ━━━━━━━━━━━━━
    print("[Step 5/15] Patient Sends Written Message...")
    msg_res = client.post(f"/consultations/{consultation_id}/messages", json={
        "message": "Doctor, I also attached my latest blood test report. The knee pain is worse in the morning.",
    }, headers=pat_headers)
    assert msg_res.status_code == 201
    print(f"[PASS] Patient message sent.\n")

    # ━━━━━━━━━━━━━ 6. DOCTOR OPENS CONSULTATION INBOX ━━━━━━━━━━━━━
    print("[Step 6/15] Doctor Views Consultations Inbox...")
    inbox = client.get("/doctor/consultations", headers=doc_headers)
    assert inbox.status_code == 200
    inbox_items = inbox.json()
    matched = [c for c in inbox_items if c["id"] == consultation_id]
    assert len(matched) >= 1, "Consultation not found in doctor inbox"
    print(f"[PASS] Consultation visible in doctor inbox.\n")

    # ━━━━━━━━━━━━━ 7. DOCTOR OPENS CONSULTATION WORKSPACE ━━━━━━━━━━━━━
    print("[Step 7/15] Doctor Opens Consultation Workspace...")
    review = client.get(f"/doctor/consultations/{consultation_id}", headers=doc_headers)
    assert review.status_code == 200
    review_data = review.json()
    assert review_data["patient"]["name"] == "Raj Kumar"
    assert len(review_data["manually_entered_medicines"]) == 2
    assert len(review_data["uploaded_prescriptions"]) == 1
    assert len(review_data["medical_reports"]) == 1
    assert len(review_data["patient_messages"]) >= 1
    print(f"[PASS] Doctor workspace loaded:")
    print(f"       - Patient: {review_data['patient']['name']}")
    print(f"       - Manual Medicines: {len(review_data['manually_entered_medicines'])}")
    print(f"       - Prescriptions: {len(review_data['uploaded_prescriptions'])}")
    print(f"       - Reports: {len(review_data['medical_reports'])}")
    print(f"       - Patient Messages: {len(review_data['patient_messages'])}\n")

    # ━━━━━━━━━━━━━ 8. DOCTOR VIEWS PRESCRIPTION IMAGE ━━━━━━━━━━━━━
    print("[Step 8/15] Doctor Views Uploaded Prescription Image...")
    file_stream = client.get(
        f"/consultations/{consultation_id}/attachments/{rx_att_id}/file",
        headers=doc_headers
    )
    assert file_stream.status_code == 200
    print(f"[PASS] Doctor streamed prescription file ({len(file_stream.content)} bytes).\n")

    # ━━━━━━━━━━━━━ 9. DOCTOR READS PATIENT MESSAGE & CHATS ━━━━━━━━━━━━━
    print("[Step 9/15] Doctor Reads Messages and Responds via Chat...")
    messages = client.get(f"/consultations/{consultation_id}/messages", headers=doc_headers)
    assert messages.status_code == 200
    assert len(messages.json()) >= 1

    doc_reply = client.post(f"/consultations/{consultation_id}/messages", json={
        "message": "Thank you Raj. I've reviewed your medicines and blood test report. Let me check a potential medication for your knee pain.",
    }, headers=doc_headers)
    assert doc_reply.status_code == 201
    print(f"[PASS] Doctor sent chat response.\n")

    # ━━━━━━━━━━━━━ 10. DOCTOR ANALYZES PROPOSED MEDICINE (RISK ANALYSIS) ━━━━━━━━━━━━━
    print("[Step 10/15] Doctor Analyzes Proposed Medicine (Risk Check)...")
    risk_res = client.post("/medicine/analyze", json={
        "medicine_1": "Ibuprofen",
        "medicine_2": "Lisinopril",
    })
    assert risk_res.status_code == 200
    risk = risk_res.json()
    assert "status" in risk
    assert "summary" in risk
    print(f"[PASS] Risk analysis complete:")
    print(f"       - Status: {risk['status']}")
    print(f"       - Severity: {risk.get('severity')}")
    print(f"       - Summary: {risk['summary'][:80]}...\n")

    # ━━━━━━━━━━━━━ 11. DOCTOR SENDS CLINICAL RESPONSE ━━━━━━━━━━━━━
    print("[Step 11/15] Doctor Sends Clinical Decision Response...")
    clinical_msg = client.post(f"/consultations/{consultation_id}/messages", json={
        "message": "Based on my review: Ibuprofen interacts with your Lisinopril. I am prescribing Paracetamol 500mg instead, which is safer. Please follow the attached prescription.",
    }, headers=doc_headers)
    assert clinical_msg.status_code == 201
    print(f"[PASS] Doctor clinical decision sent.\n")

    # ━━━━━━━━━━━━━ 12. DOCTOR UPLOADS PRESCRIPTION ━━━━━━━━━━━━━
    print("[Step 12/15] Doctor Uploads Authorized Prescription...")
    rx_file = io.BytesIO(b"%PDF-1.4\nPrescription: Paracetamol 500mg twice daily")
    rx_upload = client.post(
        f"/consultations/{consultation_id}/prescription",
        files={"file": ("Prescription_DrMitchell_Sep2026.pdf", rx_file, "application/pdf")},
        headers=doc_headers,
    )
    assert rx_upload.status_code == 201
    print(f"[PASS] Doctor prescription uploaded successfully.\n")

    # ━━━━━━━━━━━━━ 13. PATIENT RECEIVES RESPONSE & PRESCRIPTION ━━━━━━━━━━━━━
    print("[Step 13/15] Patient Receives Doctor's Response and Prescription...")
    # Check messages
    pat_msgs = client.get(f"/consultations/{consultation_id}/messages", headers=pat_headers)
    assert pat_msgs.status_code == 200
    doctor_msgs = [m for m in pat_msgs.json() if m["sender_role"] == "doctor"]
    assert len(doctor_msgs) >= 2, f"Expected at least 2 doctor messages, got {len(doctor_msgs)}"

    # Check prescriptions
    prescriptions = client.get("/patient/prescriptions", headers=pat_headers)
    assert prescriptions.status_code == 200
    rx_list = prescriptions.json()
    assert len(rx_list) >= 1
    assert rx_list[0]["status"] == "Available"
    assert rx_list[0]["doctor_name"] == "Dr. Sarah Mitchell"
    print(f"[PASS] Patient received {len(doctor_msgs)} doctor messages.")
    print(f"[PASS] Patient has {len(rx_list)} prescription(s) available.\n")

    # ━━━━━━━━━━━━━ 14. PATIENT ADDS MEDICINE TO REMINDERS ━━━━━━━━━━━━━
    print("[Step 14/15] Patient Adds Prescribed Medicine to Reminders...")
    reminder_med = client.post("/patients/me/medications", json={
        "medicine_name": "Paracetamol (Prescribed)",
        "dose": "500 mg",
        "frequency": "Twice daily",
        "scheduled_times": ["08:00 AM", "08:00 PM"],
        "start_date": "2026-09-27T00:00:00Z",
        "end_date": "2026-10-10T00:00:00Z",
        "instructions": "Prescribed by Dr. Sarah Mitchell for knee pain",
    }, headers=pat_headers)
    assert reminder_med.status_code == 201
    med_id = reminder_med.json()["id"]

    # Check reminders for today
    reminders = client.get("/patients/me/reminders", headers=pat_headers)
    assert reminders.status_code == 200
    rem_list = reminders.json()
    matched_reminders = [r for r in rem_list if r["medicine_name"] == "Paracetamol (Prescribed)"]
    assert len(matched_reminders) >= 1
    print(f"[PASS] Medicine added to reminders: {len(matched_reminders)} dose(s) scheduled.\n")

    # Mark one dose as taken
    if matched_reminders:
        taken_res = client.post(
            f"/patients/me/reminders/{matched_reminders[0]['id']}/taken",
            headers=pat_headers
        )
        assert taken_res.status_code == 200

    # ━━━━━━━━━━━━━ 15. DOCTOR VIEWS MEDICINE TRACKER ━━━━━━━━━━━━━
    print("[Step 15/15] Doctor Views Patient Medicine Tracker...")
    tracker = client.get(f"/doctor/patients/{patient_id}/medication-history", headers=doc_headers)
    assert tracker.status_code == 200
    tracker_data = tracker.json()
    assert len(tracker_data) >= 1

    adherence = client.get(f"/doctor/patients/{patient_id}/medication-adherence", headers=doc_headers)
    assert adherence.status_code == 200
    adh_data = adherence.json()
    assert "taken_count" in adh_data
    print(f"[PASS] Doctor medicine tracker:")
    print(f"       - Total doses tracked: {len(tracker_data)}")
    print(f"       - Taken: {adh_data['taken_count']}, Skipped: {adh_data['skipped_count']}")
    print(f"       - Adherence: {adh_data['adherence_percentage']}%\n")

    # ━━━━━━━━━━━━━ VERIFY CONSULTATION STATUS ━━━━━━━━━━━━━
    print("[Verification] Checking final consultation status...")
    final = client.get(f"/consultations/{consultation_id}", headers=pat_headers)
    assert final.status_code == 200
    final_status = final.json()["status"]
    print(f"[PASS] Final consultation status: {final_status}")

    # ━━━━━━━━━━━━━ VERIFY WEBSOCKET CONNECTIVITY ━━━━━━━━━━━━━
    print("\n[Verification] Testing WebSocket connectivity...")
    with client.websocket_connect(f"/ws/consultations/{consultation_id}?token={pat_token}") as ws:
        data = ws.receive_json()
        assert data["event"] == "connected"
        assert data["consultation_id"] == consultation_id
        ws.send_json({"action": "ping"})
        pong = ws.receive_json()
        assert pong.get("event") == "pong"
    print("[PASS] WebSocket real-time communication verified.\n")

    print("=" * 70)
    print("ALL 15 PHASE 3 END-TO-END INTEGRATION STEPS PASSED!")
    print("=" * 70)
    print()
    print("VERIFIED WORKFLOW:")
    print("  [+] Patient login & consultation creation")
    print("  [+] Manual medicine entry")
    print("  [+] Prescription image upload")
    print("  [+] Medical report upload")
    print("  [+] Patient messaging")
    print("  [+] Doctor consultation inbox")
    print("  [+] Doctor comprehensive workspace review")
    print("  [+] Secure file streaming")
    print("  [+] Real-time chat")
    print("  [+] Medicine risk analysis")
    print("  [+] Clinical decision & response")
    print("  [+] Doctor prescription upload")
    print("  [+] Patient prescription receipt")
    print("  [+] Prescription -> Medicine reminder")
    print("  [+] Doctor medicine tracker & adherence")
    print("  [+] WebSocket real-time connectivity")


if __name__ == "__main__":
    run_phase3_test()
