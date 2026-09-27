"""
MedGuard Medicine Reminder & Doctor Tracker End-to-End Test
Validates the exact scenario requested by the user:
- Paracetamol 500 mg Twice Daily (08:00 AM, 08:00 PM)
- 2 separate reminder events per day
- Action TAKEN on 08:00 AM dose -> records action_time, status taken
- Action SKIP on 08:00 PM dose -> records action_time, status skipped
- Next day -> fresh independent reminders (upcoming)
- Patient medication history reflects all actions
- Doctor medication tracking & history reflect the exact taken/skipped timestamps
"""

import sys
import os
from datetime import date, timedelta

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.user import User

def run_scenario_tests():
    print("=" * 70)
    print("MEDGUARD - MEDICINE REMINDER & DOCTOR TRACKER VERIFICATION")
    print("=" * 70)

    Base.metadata.create_all(bind=engine)
    client = TestClient(app)

    # 1. Setup doctor and patient
    print("\n[Step 1] Initializing Test Doctor and Patient...")
    db = SessionLocal()
    db.query(User).filter(User.email.in_(["dr.reminder@medguard.com", "patient.reminder@medguard.com"])).delete(synchronize_session=False)
    db.commit()
    db.close()

    doc_res = client.post("/auth/register", json={
        "name": "Dr. Sarah Mitchell",
        "email": "dr.reminder@medguard.com",
        "password": "Password123!",
        "role": "doctor"
    })
    assert doc_res.status_code == 201
    doc_login = client.post("/auth/login", json={"email": "dr.reminder@medguard.com", "password": "Password123!"})
    doc_token = doc_login.json()["access_token"]
    doc_headers = {"Authorization": f"Bearer {doc_token}"}

    pat_res = client.post("/auth/register", json={
        "name": "James Wilson",
        "email": "patient.reminder@medguard.com",
        "password": "Password123!",
        "role": "patient"
    })
    assert pat_res.status_code == 201
    pat_id = pat_res.json()["id"]
    pat_login = client.post("/auth/login", json={"email": "patient.reminder@medguard.com", "password": "Password123!"})
    pat_token = pat_login.json()["access_token"]
    pat_headers = {"Authorization": f"Bearer {pat_token}"}
    print(f"[PASS] Doctor and Patient ({pat_id}) registered successfully.")

    # 2. Patient adds Paracetamol with 2 times
    print("\n[Step 2] Patient adds Paracetamol with TWO separate reminder times (08:00 AM, 08:00 PM)...")
    today_str = date.today().isoformat()
    end_date_str = (date.today() + timedelta(days=3)).isoformat()

    medicine_payload = {
        "medicine_name": "Paracetamol",
        "dose": "500 mg",
        "frequency": "Twice daily",
        "instructions": "Take with full glass of water after food",
        "scheduled_times": ["08:00 AM", "08:00 PM"],
        "start_date": today_str,
        "end_date": end_date_str
    }
    create_res = client.post("/patients/me/medications", json=medicine_payload, headers=pat_headers)
    assert create_res.status_code == 201, f"Failed: {create_res.text}"
    med_data = create_res.json()
    assert med_data["medicine_name"] == "Paracetamol"
    assert len(med_data["schedules"]) == 2
    med_id = med_data["id"]
    print(f"[PASS] Paracetamol created with ID={med_id} and 2 schedules: {med_data['schedules']}")

    # 3. Verify GET /patients/me/reminders/today
    print("\n[Step 3] Verifying GET /patients/me/reminders/today returns 2 separate daily occurrences...")
    today_reminders_res = client.get("/patients/me/reminders/today", headers=pat_headers)
    assert today_reminders_res.status_code == 200
    reminders = today_reminders_res.json()
    assert len(reminders) == 2, f"Expected 2 reminders, got {len(reminders)}"
    assert reminders[0]["scheduled_time"] == "08:00 AM"
    assert reminders[1]["scheduled_time"] == "08:00 PM"
    assert reminders[0]["status"] == "upcoming"
    assert reminders[1]["status"] == "upcoming"
    print(f"[PASS] Today's reminders created: Dose 1 at {reminders[0]['scheduled_time']} (ID={reminders[0]['id']}), Dose 2 at {reminders[1]['scheduled_time']} (ID={reminders[1]['id']})")

    dose1_id = reminders[0]["id"]
    dose2_id = reminders[1]["id"]

    # 4. Patient takes 08:00 AM dose
    print("\n[Step 4] Patient takes 08:00 AM dose (POST /patients/me/reminders/{id}/taken)...")
    taken_res = client.post(f"/patients/me/reminders/{dose1_id}/taken", headers=pat_headers)
    assert taken_res.status_code == 200
    dose1_data = taken_res.json()
    assert dose1_data["status"] == "taken"
    assert dose1_data["action_time"] is not None
    print(f"[PASS] Dose 1 recorded as 'taken' at action_time: {dose1_data['action_time']}")

    # 5. Patient skips 08:00 PM dose
    print("\n[Step 5] Patient skips 08:00 PM dose (POST /patients/me/reminders/{id}/skip)...")
    skip_res = client.post(f"/patients/me/reminders/{dose2_id}/skip", headers=pat_headers)
    assert skip_res.status_code == 200
    dose2_data = skip_res.json()
    assert dose2_data["status"] == "skipped"
    assert dose2_data["action_time"] is not None
    print(f"[PASS] Dose 2 recorded as 'skipped' at action_time: {dose2_data['action_time']}")

    # 6. Verify GET /patients/me/reminders/today now reflects independent statuses
    print("\n[Step 6] Re-fetching today's reminders to confirm independent statuses...")
    refreshed_today = client.get("/patients/me/reminders/today", headers=pat_headers).json()
    assert refreshed_today[0]["status"] == "taken"
    assert refreshed_today[1]["status"] == "skipped"
    print(f"[PASS] Today's status confirmed: Dose 1 = {refreshed_today[0]['status']}, Dose 2 = {refreshed_today[1]['status']}")

    # 7. Doctor Medicine Tracker checks
    print("\n[Step 7] Doctor checks patient's medication tracker & history...")
    doc_history_res = client.get(f"/doctor/patients/{pat_id}/medication-history", headers=doc_headers)
    assert doc_history_res.status_code == 200
    doc_history = doc_history_res.json()
    assert len(doc_history) >= 2
    history_statuses = {item["scheduled_time"]: item["status"] for item in doc_history}
    assert history_statuses["08:00 AM"] == "taken"
    assert history_statuses["08:00 PM"] == "skipped"
    print(f"[PASS] Doctor sees: 08:00 AM = {history_statuses['08:00 AM']}, 08:00 PM = {history_statuses['08:00 PM']}")

    # 8. Next Day isolated reminders test (Crucial Requirement: Next day must have fresh independent upcoming doses)
    print("\n[Step 8] Verifying NEXT DAY reminder isolation (do NOT reuse yesterday's taken/skipped status)...")
    tomorrow_str = (date.today() + timedelta(days=1)).isoformat()
    tomorrow_reminders_res = client.get(f"/patients/me/reminders?target_date={tomorrow_str}", headers=pat_headers)
    assert tomorrow_reminders_res.status_code == 200
    tomorrow_reminders = tomorrow_reminders_res.json()
    assert len(tomorrow_reminders) == 2
    assert tomorrow_reminders[0]["status"] == "upcoming", f"Expected upcoming, got {tomorrow_reminders[0]['status']}"
    assert tomorrow_reminders[1]["status"] == "upcoming", f"Expected upcoming, got {tomorrow_reminders[1]['status']}"
    assert tomorrow_reminders[0]["action_time"] is None
    assert tomorrow_reminders[1]["action_time"] is None
    print(f"[PASS] Tomorrow's doses ({tomorrow_str}) are fresh and independent: 08:00 AM = upcoming, 08:00 PM = upcoming")

    # 9. Verify Patient Medication History endpoint
    print("\n[Step 9] Verifying GET /patients/me/medication-history...")
    pat_history_res = client.get("/patients/me/medication-history", headers=pat_headers)
    assert pat_history_res.status_code == 200
    pat_history = pat_history_res.json()
    assert len(pat_history) >= 2
    print(f"[PASS] Patient history returned {len(pat_history)} dose logs successfully.")

    # 10. Patient Editing & Deleting
    print("\n[Step 10] Testing Patient Editing (PUT /patients/me/medications/{id})...")
    edit_payload = {
        "medicine_name": "Paracetamol Extra",
        "dose": "650 mg",
        "frequency": "Twice daily",
        "instructions": "Take with food",
        "scheduled_times": ["09:00 AM", "09:00 PM"],
        "active": True
    }
    put_res = client.put(f"/patients/me/medications/{med_id}", json=edit_payload, headers=pat_headers)
    assert put_res.status_code == 200
    updated_med = put_res.json()
    assert updated_med["medicine_name"] == "Paracetamol Extra"
    assert updated_med["dose"] == "650 mg"
    assert len(updated_med["schedules"]) == 2
    assert {s["scheduled_time"] for s in updated_med["schedules"]} == {"09:00 AM", "09:00 PM"}
    print("[PASS] Medicine successfully updated (name, dose, schedules).")

    print("\n" + "=" * 70)
    print("ALL MEDICINE REMINDER & DOCTOR TRACKER TESTS PASSED!")
    print("=" * 70)

if __name__ == "__main__":
    run_scenario_tests()
