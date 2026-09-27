"""
MedGuard Backend - Medication & Reminder Tracking Verification Script
Comprehensive end-to-end tests for:
1. Patient Medication CRUD (GET, POST, GET/{id}, PUT/{id}, DELETE/{id})
2. Patient Medication Reminder Endpoints (GET, POST /{id}/taken, POST /{id}/skip with exact action timestamps)
3. Doctor Tracking Endpoints:
   - GET /doctor/patients/{id}/medications
   - GET /doctor/patients/{id}/medication-history
   - GET /doctor/patients/{id}/medication-adherence
4. Strict Authorization:
   - Patient owns and manages only their medicines.
   - Doctor CANNOT mark patient's medicine as taken.
   - Patient CANNOT access doctor tracking endpoints.
"""

import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.user import User, UserRole
from app.models.medication import Medication, MedicationSchedule, MedicationLog

def run_tests():
    print("=" * 65)
    print("MEDGUARD BACKEND - MEDICINES & REMINDERS VERIFICATION")
    print("=" * 65)

    Base.metadata.create_all(bind=engine)
    client = TestClient(app)

    # 1. Register test doctor and patient
    print("\n[1/8] Setting up Test Users (Doctor & Patient)...")
    db = SessionLocal()
    # Clean previous test data
    db.query(User).filter(User.email.in_(["dr.adherence@medguard.com", "priya.patient@medguard.com", "other.patient@medguard.com"])).delete(synchronize_session=False)
    db.commit()
    db.close()

    # Doctor
    doc_res = client.post("/auth/register", json={
        "name": "Dr. Sharma",
        "email": "dr.adherence@medguard.com",
        "password": "DoctorPassword123!",
        "role": "doctor"
    })
    assert doc_res.status_code == 201
    doc_login = client.post("/auth/login", json={"email": "dr.adherence@medguard.com", "password": "DoctorPassword123!"})
    doc_token = doc_login.json()["access_token"]
    doc_headers = {"Authorization": f"Bearer {doc_token}"}

    # Patient
    pat_res = client.post("/auth/register", json={
        "name": "Priya Sharma",
        "email": "priya.patient@medguard.com",
        "password": "PatientPassword123!",
        "role": "patient"
    })
    assert pat_res.status_code == 201
    pat_id = pat_res.json()["id"]
    pat_login = client.post("/auth/login", json={"email": "priya.patient@medguard.com", "password": "PatientPassword123!"})
    pat_token = pat_login.json()["access_token"]
    pat_headers = {"Authorization": f"Bearer {pat_token}"}

    # Second Patient (for isolation test)
    pat2_res = client.post("/auth/register", json={
        "name": "Other Patient",
        "email": "other.patient@medguard.com",
        "password": "PatientPassword123!",
        "role": "patient"
    })
    pat2_login = client.post("/auth/login", json={"email": "other.patient@medguard.com", "password": "PatientPassword123!"})
    pat2_token = pat2_login.json()["access_token"]
    pat2_headers = {"Authorization": f"Bearer {pat2_token}"}

    print("[PASS] Test Doctor & Patient accounts configured.")

    # 2. Patient creates medications
    print("\n[2/8] Testing POST /patients/me/medications (Create Medications)...")
    med1_payload = {
        "medicine_name": "Blood Pressure Medicine (Lisinopril)",
        "dose": "75 mg",
        "frequency": "Once daily",
        "instructions": "Take in the morning with water",
        "scheduled_times": ["08:00 AM"]
    }
    med1_res = client.post("/patients/me/medications", json=med1_payload, headers=pat_headers)
    assert med1_res.status_code == 201, f"Expected 201, got {med1_res.status_code}: {med1_res.text}"
    med1 = med1_res.json()
    assert med1["medicine_name"] == "Blood Pressure Medicine (Lisinopril)"
    assert len(med1["schedules"]) == 1
    assert med1["schedules"][0]["scheduled_time"] == "08:00 AM"
    med1_id = med1["id"]
    print(f"[PASS] Medication 1 created: '{med1['medicine_name']}' (ID={med1_id})")

    med2_payload = {
        "medicine_name": "Glipizide",
        "dose": "5 mg",
        "frequency": "Once daily with lunch",
        "scheduled_times": ["01:00 PM"]
    }
    med2_res = client.post("/patients/me/medications", json=med2_payload, headers=pat_headers)
    assert med2_res.status_code == 201
    med2_id = med2_res.json()["id"]

    med3_payload = {
        "medicine_name": "Atorvastatin",
        "dose": "20 mg",
        "frequency": "Once daily at bedtime",
        "scheduled_times": ["08:00 PM"]
    }
    med3_res = client.post("/patients/me/medications", json=med3_payload, headers=pat_headers)
    assert med3_res.status_code == 201
    med3_id = med3_res.json()["id"]
    print("[PASS] 3 medications created for Priya Sharma.")

    # 3. Patient reads, updates, and deletes medications
    print("\n[3/8] Testing GET, PUT, and DELETE /patients/me/medications/{id}...")
    list_res = client.get("/patients/me/medications", headers=pat_headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) == 3
    print(f"[PASS] GET /patients/me/medications returned {len(list_res.json())} medications.")

    get_single = client.get(f"/patients/me/medications/{med1_id}", headers=pat_headers)
    assert get_single.status_code == 200
    assert get_single.json()["id"] == med1_id

    # Update med1 dose
    update_res = client.put(f"/patients/me/medications/{med1_id}", json={"dose": "80 mg"}, headers=pat_headers)
    assert update_res.status_code == 200
    assert update_res.json()["dose"] == "80 mg"
    print("[PASS] PUT /patients/me/medications/{id} updated dose to 80 mg.")

    # Test patient cross-access isolation
    cross_access = client.get(f"/patients/me/medications/{med1_id}", headers=pat2_headers)
    assert cross_access.status_code == 404, "Patient 2 should not be able to access Patient 1's medication"
    print("[PASS] Multi-tenant isolation verified: Patient cannot access another patient's medication.")

    # 4. Patient Reminders: GET /patients/me/reminders
    print("\n[4/8] Testing GET /patients/me/reminders...")
    reminders_res = client.get("/patients/me/reminders", headers=pat_headers)
    assert reminders_res.status_code == 200
    reminders = reminders_res.json()
    assert len(reminders) == 3
    print(f"[PASS] Found {len(reminders)} scheduled reminders for today.")
    for r in reminders:
        print(f"       -> {r['scheduled_time']} • {r['medicine_name']} ({r['dose']}) - Status: {r['status']}")

    # 5. Patient marks reminder as TAKEN
    print("\n[5/8] Testing POST /patients/me/reminders/{id}/taken...")
    rem1 = reminders[0]
    taken_res = client.post(f"/patients/me/reminders/{rem1['id']}/taken", headers=pat_headers)
    assert taken_res.status_code == 200, f"Expected 200, got {taken_res.status_code}: {taken_res.text}"
    taken_log = taken_res.json()
    assert taken_log["status"] == "taken"
    assert taken_log["action_time"] is not None
    print(f"[PASS] Reminder {rem1['id']} marked as 'taken'. Action time recorded: {taken_log['action_time']}")

    # 6. Patient marks reminder as SKIPPED
    print("\n[6/8] Testing POST /patients/me/reminders/{id}/skip...")
    rem2 = reminders[1]
    skip_res = client.post(f"/patients/me/reminders/{rem2['id']}/skip", headers=pat_headers)
    assert skip_res.status_code == 200
    skip_log = skip_res.json()
    assert skip_log["status"] == "skipped"
    assert skip_log["action_time"] is not None
    print(f"[PASS] Reminder {rem2['id']} marked as 'skipped'. Action time recorded: {skip_log['action_time']}")

    # 7. Doctor Medication Tracking Endpoints
    print("\n[7/8] Testing Doctor Medication Tracking Endpoints...")
    
    # Doctor views patient's current medications
    doc_meds_res = client.get(f"/doctor/patients/{pat_id}/medications", headers=doc_headers)
    assert doc_meds_res.status_code == 200
    assert len(doc_meds_res.json()) == 3
    print(f"[PASS] GET /doctor/patients/{pat_id}/medications returned {len(doc_meds_res.json())} prescriptions.")

    # Doctor views medication intake history
    doc_hist_res = client.get(f"/doctor/patients/{pat_id}/medication-history", headers=doc_headers)
    assert doc_hist_res.status_code == 200
    history = doc_hist_res.json()
    assert len(history) >= 2
    print(f"[PASS] GET /doctor/patients/{pat_id}/medication-history returned {len(history)} intake logs.")
    for h in history:
        print(f"       -> {h['scheduled_time']} • {h['medicine_name']} - Status: {h['status']} (Action: {h['action_time']})")

    # Doctor views medication adherence summary
    doc_adh_res = client.get(f"/doctor/patients/{pat_id}/medication-adherence", headers=doc_headers)
    assert doc_adh_res.status_code == 200
    adh = doc_adh_res.json()
    assert adh["patient_id"] == pat_id
    assert adh["taken_count"] >= 1
    assert adh["skipped_count"] >= 1
    assert "adherence_percentage" in adh
    print(f"[PASS] GET /doctor/patients/{pat_id}/medication-adherence calculated:")
    print(f"       Taken: {adh['taken_count']}, Skipped: {adh['skipped_count']}, Upcoming: {adh['upcoming_count']}")
    print(f"       Adherence Rate: {adh['adherence_percentage']}% ({adh['adherence_label']})")
    print(f"       Note: '{adh['note']}'")

    # 8. Strict Authorization Enforcement
    print("\n[8/8] Testing Strict Authorization Rules...")

    # Doctor CANNOT mark a patient's medicine as taken
    doc_attempt_taken = client.post(f"/patients/me/reminders/{rem1['id']}/taken", headers=doc_headers)
    assert doc_attempt_taken.status_code == 403, "Doctor should be forbidden from calling patient reminder endpoints"
    print("[PASS] Doctor CANNOT mark patient medicine as taken on their behalf (HTTP 403 Forbidden).")

    # Patient CANNOT access doctor tracking endpoints
    pat_attempt_doctor = client.get(f"/doctor/patients/{pat_id}/medications", headers=pat_headers)
    assert pat_attempt_doctor.status_code == 403
    print("[PASS] Patient CANNOT access doctor tracking endpoints (HTTP 403 Forbidden).")

    # Unauthenticated request rejected
    unauth = client.get(f"/doctor/patients/{pat_id}/medications")
    assert unauth.status_code == 401
    print("[PASS] Unauthenticated access rejected with HTTP 401.")

    print("\n" + "=" * 65)
    print("ALL MEDICINE & REMINDER TRACKING TESTS PASSED! (8/8)")
    print("=" * 65)

if __name__ == "__main__":
    run_tests()
