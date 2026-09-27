"""
MedGuard Backend Phase 1 Verification Script
Runs end-to-end tests against the FastAPI application:
1. Health check verification
2. Doctor & Patient registration
3. Duplicate user rejection
4. Authentication & JWT access token generation
5. Invalid password rejection
6. /auth/me profile verification
7. Strict role protection (Doctor-only & Patient-only access)
"""

import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.user import User

def run_tests():
    print("=" * 60)
    print("MEDGUARD BACKEND PHASE 1 - COMPREHENSIVE VERIFICATION")
    print("=" * 60)

    # 1. Initialize DB tables
    print("\n[1/7] Initializing Database Schema...")
    Base.metadata.create_all(bind=engine)
    print("[PASS] Database tables created/verified successfully.")

    client = TestClient(app)

    # Clean existing test users if re-running
    db = SessionLocal()
    db.query(User).filter(User.email.in_(["dr.sharma.test@medguard.com", "priya.sharma.test@medguard.com"])).delete(synchronize_session=False)
    db.commit()
    db.close()

    # 2. Verify Health Check
    print("\n[2/7] Testing GET /health...")
    health_res = client.get("/health")
    assert health_res.status_code == 200, f"Expected 200, got {health_res.status_code}"
    assert health_res.json() == {"status": "ok"}, f"Unexpected health response: {health_res.json()}"
    print(f"[PASS] Health check response: {health_res.json()} (HTTP {health_res.status_code})")

    # 3. Verify Doctor Registration
    print("\n[3/7] Testing Doctor Registration POST /auth/register...")
    doctor_payload = {
        "name": "Dr. Sharma",
        "email": "dr.sharma.test@medguard.com",
        "password": "SecureDoctorPassword2026!",
        "role": "doctor"
    }
    doc_reg_res = client.post("/auth/register", json=doctor_payload)
    assert doc_reg_res.status_code == 201, f"Expected 201, got {doc_reg_res.status_code}: {doc_reg_res.text}"
    doc_user = doc_reg_res.json()
    assert doc_user["role"] == "doctor"
    assert "hashed_password" not in doc_user
    assert "id" in doc_user
    print(f"[PASS] Doctor registered: ID={doc_user['id']}, Email={doc_user['email']}, Role={doc_user['role']}")

    # 4. Verify Patient Registration & Duplicate Prevention
    print("\n[4/7] Testing Patient Registration & Duplicate Check...")
    patient_payload = {
        "name": "Priya Sharma",
        "email": "priya.sharma.test@medguard.com",
        "password": "PatientSecurePassword2026!",
        "role": "patient"
    }
    pat_reg_res = client.post("/auth/register", json=patient_payload)
    assert pat_reg_res.status_code == 201, f"Expected 201, got {pat_reg_res.status_code}"
    pat_user = pat_reg_res.json()
    assert pat_user["role"] == "patient"
    print(f"[PASS] Patient registered: ID={pat_user['id']}, Email={pat_user['email']}, Role={pat_user['role']}")

    # Duplicate registration check
    dup_res = client.post("/auth/register", json=patient_payload)
    assert dup_res.status_code == 400, f"Expected 400 for duplicate, got {dup_res.status_code}"
    print(f"[PASS] Duplicate registration correctly rejected with HTTP 400: {dup_res.json()['detail']}")

    # 5. Verify Login & JWT Generation
    print("\n[5/7] Testing Login & JWT Token Issuance...")
    # Bad credentials
    bad_login = client.post("/auth/login", json={"email": "dr.sharma.test@medguard.com", "password": "WrongPassword"})
    assert bad_login.status_code == 401, f"Expected 401 for wrong password, got {bad_login.status_code}"
    print("[PASS] Invalid password correctly rejected with HTTP 401 Unauthorized.")

    # Doctor login
    doc_login_res = client.post("/auth/login", json={"email": "dr.sharma.test@medguard.com", "password": "SecureDoctorPassword2026!"})
    assert doc_login_res.status_code == 200, f"Expected 200, got {doc_login_res.status_code}"
    doc_tokens = doc_login_res.json()
    assert "access_token" in doc_tokens
    assert doc_tokens["token_type"] == "bearer"
    doc_token = doc_tokens["access_token"]
    print(f"[PASS] Doctor login successful. JWT token issued (length: {len(doc_token)} chars).")

    # Patient login
    pat_login_res = client.post("/auth/login", json={"email": "priya.sharma.test@medguard.com", "password": "PatientSecurePassword2026!"})
    assert pat_login_res.status_code == 200
    pat_tokens = pat_login_res.json()
    pat_token = pat_tokens["access_token"]
    print(f"[PASS] Patient login successful. JWT token issued (length: {len(pat_token)} chars).")

    # 6. Verify GET /auth/me Profile Access
    print("\n[6/7] Testing GET /auth/me with JWT Authentication...")
    # Unauthenticated
    unauth_me = client.get("/auth/me")
    assert unauth_me.status_code == 401
    print("[PASS] Unauthenticated request to /auth/me rejected with HTTP 401.")

    # Authenticated with Doctor token
    doc_me = client.get("/auth/me", headers={"Authorization": f"Bearer {doc_token}"})
    assert doc_me.status_code == 200
    assert doc_me.json()["email"] == "dr.sharma.test@medguard.com"
    assert doc_me.json()["role"] == "doctor"
    print(f"[PASS] GET /auth/me succeeded for Doctor: Name='{doc_me.json()['name']}', Role='{doc_me.json()['role']}'.")

    # Authenticated with Patient token
    pat_me = client.get("/auth/me", headers={"Authorization": f"Bearer {pat_token}"})
    assert pat_me.status_code == 200
    assert pat_me.json()["email"] == "priya.sharma.test@medguard.com"
    assert pat_me.json()["role"] == "patient"
    print(f"[PASS] GET /auth/me succeeded for Patient: Name='{pat_me.json()['name']}', Role='{pat_me.json()['role']}'.")

    # 7. Verify Doctor vs Patient Role Protection
    print("\n[7/7] Testing Strict Role Protection (Doctor vs Patient isolation)...")
    
    # Doctor accessing Doctor resource -> ALLOWED
    doc_on_doc = client.get("/auth/doctor/protected", headers={"Authorization": f"Bearer {doc_token}"})
    assert doc_on_doc.status_code == 200, f"Expected 200, got {doc_on_doc.status_code}"
    print(f"[PASS] Doctor accessing /auth/doctor/protected: ALLOWED (HTTP 200) -> {doc_on_doc.json()['message']}")

    # Patient accessing Doctor resource -> FORBIDDEN (403)
    pat_on_doc = client.get("/auth/doctor/protected", headers={"Authorization": f"Bearer {pat_token}"})
    assert pat_on_doc.status_code == 403, f"Expected 403 Forbidden, got {pat_on_doc.status_code}"
    print(f"[PASS] Patient accessing /auth/doctor/protected: FORBIDDEN (HTTP 403) -> {pat_on_doc.json()['detail']}")

    # Patient accessing Patient resource -> ALLOWED
    pat_on_pat = client.get("/auth/patient/protected", headers={"Authorization": f"Bearer {pat_token}"})
    assert pat_on_pat.status_code == 200, f"Expected 200, got {pat_on_pat.status_code}"
    print(f"[PASS] Patient accessing /auth/patient/protected: ALLOWED (HTTP 200) -> {pat_on_pat.json()['message']}")

    # Doctor accessing Patient resource -> FORBIDDEN (403)
    doc_on_pat = client.get("/auth/patient/protected", headers={"Authorization": f"Bearer {doc_token}"})
    assert doc_on_pat.status_code == 403, f"Expected 403 Forbidden, got {doc_on_pat.status_code}"
    print(f"[PASS] Doctor accessing /auth/patient/protected: FORBIDDEN (HTTP 403) -> {doc_on_pat.json()['detail']}")

    print("\n" + "=" * 60)
    print("ALL PHASE 1 BACKEND VERIFICATIONS PASSED SUCCESSFULLY! (7/7)")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
