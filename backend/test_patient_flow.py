import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.user import User

client = TestClient(app)

class TestPatientCreationFlow(unittest.TestCase):

    def setUp(self):
        # Database tables already initialized by lifespan
        pass

    def test_01_get_patients_list(self):
        response = client.get("/doctor/patients")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 6)
        # Check Raj Kumar is present
        names = [p["name"] for p in data]
        self.assertIn("Raj Kumar", names)
        print(f"[PASS] Successfully retrieved {len(data)} patients from database.")

    def test_02_create_new_patient_valid(self):
        import time
        unique_id = f"pat-test-{int(time.time())}"
        payload = {
            "name": "Dr. Testing Vikram",
            "patient_id": unique_id,
            "age": 52,
            "gender": "Male",
            "email": f"{unique_id}@example.com",
            "phone": "+91 91234 56789",
            "blood_group": "B+",
            "primary_condition": "Hypertension, Stage 1 CKD",
            "current_medications": "Amlodipine 5mg, Losartan 50mg",
            "emergency_contact": "Sunita Testing - +91 91234 56780",
            "risk_level": "MODERATE",
        }
        response = client.post("/doctor/patients", json=payload)
        self.assertEqual(response.status_code, 201)
        created = response.json()
        self.assertEqual(created["name"], "Dr. Testing Vikram")
        self.assertEqual(created["id"], unique_id)
        self.assertEqual(created["age"], 52)
        self.assertEqual(created["gender"], "Male")
        self.assertEqual(created["blood_group"], "B+")
        self.assertEqual(created["primaryCondition"], "Hypertension, Stage 1 CKD")
        self.assertEqual(created["riskLevel"], "MODERATE")
        self.assertEqual(created["activeMedsCount"], 2)
        print(f"[PASS] Successfully created new patient: {created['name']} (ID: {created['id']}).")

        # Verify patient is in the list
        list_resp = client.get(f"/doctor/patients?query=Testing Vikram")
        self.assertEqual(list_resp.status_code, 200)
        matches = list_resp.json()
        self.assertTrue(any(p["id"] == unique_id for p in matches))
        print(f"[PASS] New patient appears in search query results.")

        # Verify get by ID
        get_resp = client.get(f"/doctor/patients/{unique_id}")
        self.assertEqual(get_resp.status_code, 200)
        self.assertEqual(get_resp.json()["id"], unique_id)
        print(f"[PASS] New patient details retrieved by ID successfully.")

    def test_03_create_patient_duplicate_id_rejected(self):
        payload = {
            "name": "Duplicate Raj",
            "patient_id": "pat-1",  # Raj Kumar's existing ID
            "age": 68,
            "gender": "Male",
        }
        response = client.post("/doctor/patients", json=payload)
        self.assertEqual(response.status_code, 409)
        self.assertIn("already exists", response.json()["detail"])
        print("[PASS] Duplicate patient ID correctly rejected with 409 Conflict.")

    def test_04_create_patient_validation_empty_name(self):
        payload = {
            "name": "   ",
            "age": 40,
            "gender": "Female",
        }
        response = client.post("/doctor/patients", json=payload)
        self.assertEqual(response.status_code, 422)
        print("[PASS] Empty name correctly rejected with 422 Validation Error.")

    def test_05_create_patient_validation_invalid_age(self):
        payload = {
            "name": "Invalid Age Patient",
            "age": -5,
            "gender": "Female",
        }
        response = client.post("/doctor/patients", json=payload)
        self.assertEqual(response.status_code, 422)
        print("[PASS] Negative age correctly rejected with 422 Validation Error.")

if __name__ == "__main__":
    unittest.main()
