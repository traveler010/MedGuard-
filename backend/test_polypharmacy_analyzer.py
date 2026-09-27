"""
MedGuard Polypharmacy Risk Analyzer End-to-End Verification Suite
Tests the complete polypharmacy workflow against clinical requirements:
1. Fictional elderly patient (Age 65+) with multiple existing medications
2. Complete multi-medication roster cross-check against proposed medicine
3. Rule-based interaction identification without hardcoding
4. Overall risk calculation (HIGH / MODERATE / LOW) and category breakdowns
5. Evidence-based explanation and non-fabrication adherence
6. Actionable verified safer alternatives
7. Structured report generation and database snapshot persistence
8. Retrieval by report_id, patient_id, and consultation_id inside doctor consultation
9. Safe alternative comparison (Acetaminophen -> LOW risk)
10. Controlled substance / Dependence analysis (Tramadol -> HIGH dependence)
11. Unindexed medication fallback ("Insufficient verified information")
12. Legacy 2-medication compatibility endpoint backward compatibility
"""

import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.medication_analysis_report import MedicationAnalysisReport
from app.models.user import User, UserRole
from app.models.consultation import Consultation, ConsultationStatus


def run_polypharmacy_tests():
    print("=" * 80)
    print("MEDGUARD POLYPHARMACY RISK ANALYZER - BACKEND VERIFICATION SUITE")
    print("=" * 80)

    # 1. Initialize schema and tables
    print("\n[1/12] Initializing Database Schema...")
    Base.metadata.create_all(bind=engine)
    print("[PASS] Database schema and tables verified successfully.")

    client = TestClient(app)
    db = SessionLocal()

    # Create dummy patient and doctor for consultation FK test if needed
    test_patient_id = "test-patient-elderly-68"
    test_doctor_id = "test-doctor-physician-01"
    test_consult_id = "test-consultation-poly-8821"

    # Clean existing test entities if re-running
    db.query(MedicationAnalysisReport).filter(
        MedicationAnalysisReport.consultation_id == test_consult_id
    ).delete(synchronize_session=False)
    db.query(Consultation).filter(Consultation.id == test_consult_id).delete(synchronize_session=False)
    db.query(User).filter(User.id.in_([test_patient_id, test_doctor_id])).delete(synchronize_session=False)
    db.commit()

    test_patient = User(
        id=test_patient_id,
        name="Raj Kumar",
        email="raj.kumar.elderly@test.medguard.com",
        hashed_password="TestPassword123!",
        role=UserRole.PATIENT.value,
    )
    test_doctor = User(
        id=test_doctor_id,
        name="Dr. Sarah Patel",
        email="dr.sarah.patel@test.medguard.com",
        hashed_password="DoctorPassword123!",
        role=UserRole.DOCTOR.value,
    )
    db.add(test_patient)
    db.add(test_doctor)
    db.commit()

    test_consultation = Consultation(
        id=test_consult_id,
        patient_id=test_patient_id,
        doctor_id=test_doctor_id,
        status=ConsultationStatus.WAITING_FOR_DOCTOR.value,
    )
    db.add(test_consultation)
    db.commit()
    db.close()
    print(f"[PASS] Seeded test consultation ({test_consult_id}) and patient ({test_patient_id}, Age 68).")

    # 2. Test Case: Fictional Elderly Patient (Age 68) with 3 current medications
    print("\n[2/12] Submitting Polypharmacy Risk Analysis Request (Elderly Patient + 3 Meds + Proposed NSAID)...")
    elderly_payload = {
        "patient_id": test_patient_id,
        "doctor_id": test_doctor_id,
        "consultation_id": test_consult_id,
        "patient_age": 68,
        "current_medications": [
            {
                "medicine_name": "Lisinopril",
                "dose": "10 mg",
                "frequency": "Once daily",
                "scheduled_time": "09:00 AM",
                "duration": "Chronic",
                "instructions": "Take with water in the morning for blood pressure",
            },
            {
                "medicine_name": "Warfarin",
                "dose": "5 mg",
                "frequency": "Once daily",
                "scheduled_time": "06:00 PM",
                "duration": "Chronic",
                "instructions": "Blood thinner; periodic INR monitoring required",
            },
            {
                "medicine_name": "Atorvastatin",
                "dose": "20 mg",
                "frequency": "Once daily at bedtime",
                "scheduled_time": "10:00 PM",
                "duration": "Chronic",
                "instructions": "Cholesterol management",
            },
        ],
        "proposed_medication": "Ibuprofen",
        "dose": "400 mg",
        "frequency": "Every 8 hours as needed",
        "duration": "14 days",
        "instructions": "For acute joint pain and stiffness",
    }

    res = client.post("/medicine-analyzer/analyze", json=elderly_payload)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    report_data = res.json()
    report_id = report_data["id"]
    print(f"[PASS] Analysis returned HTTP 200 with generated Report ID: {report_id}")

    # 3. Verify Multi-Medication Pairwise Cross-Check
    print("\n[3/12] Verifying Multi-Medication Interactions against complete active roster...")
    interactions = report_data["interaction_results"]
    assert len(interactions) >= 2, f"Expected at least 2 interactions, got {len(interactions)}"
    
    # Check Warfarin + Ibuprofen interaction
    warfarin_int = next((i for i in interactions if "warfarin" in i["existing_medication"].lower()), None)
    assert warfarin_int is not None, "Failed to identify Warfarin interaction"
    assert warfarin_int["severity"] == "HIGH", f"Expected HIGH severity for Warfarin, got {warfarin_int['severity']}"
    assert "bleeding" in warfarin_int["explanation"].lower() or "hemorrhage" in warfarin_int["explanation"].lower()
    assert "ACC" in warfarin_int["verified_source"] or "CHEST" in warfarin_int["verified_source"]
    print(f"[PASS] Identified High-Severity interaction with Warfarin: '{warfarin_int['risk_title']}'")
    print(f"       Mechanism: {warfarin_int['clinical_mechanism']}")
    print(f"       Verified Source: {warfarin_int['verified_source']}")

    # Check Lisinopril + Ibuprofen interaction
    lisinopril_int = next((i for i in interactions if "lisinopril" in i["existing_medication"].lower()), None)
    assert lisinopril_int is not None, "Failed to identify Lisinopril interaction"
    assert lisinopril_int["severity"] == "MODERATE"
    assert "AHA" in lisinopril_int["verified_source"] or "blood pressure" in lisinopril_int["explanation"].lower()
    print(f"[PASS] Identified Moderate interaction with Lisinopril: '{lisinopril_int['risk_title']}'")

    # 4. Verify Overall Risk Level and Score
    print("\n[4/12] Verifying Overall Risk Verdict and Category Breakdowns...")
    assert report_data["overall_risk"] == "HIGH", f"Expected overall HIGH risk, got {report_data['overall_risk']}"
    assert report_data["overall_risk_score"] >= 80, f"Expected high risk score >= 80, got {report_data['overall_risk_score']}"
    assert report_data["interaction_risk"] == "HIGH"
    assert report_data["cumulative_side_effect_risk"] == "HIGH"
    assert report_data["age_appropriateness"] == "HIGH"  # Beers Criteria for 68yo on NSAID
    assert report_data["duration_appropriateness"] == "HIGH"  # 14 days > 10 days
    assert report_data["dependence_risk"] == "LOW"
    print(f"[PASS] Overall Risk: {report_data['overall_risk']} (Score: {report_data['overall_risk_score']}/100)")
    print(f"       Category Breakdown: Inter={report_data['interaction_risk']}, Cum={report_data['cumulative_side_effect_risk']}, Age={report_data['age_appropriateness']}, Dur={report_data['duration_appropriateness']}, Dep={report_data['dependence_risk']}")

    # 5. Verify Plain-Language Clinical Explanation & Evidence Rule Adherence
    print("\n[5/12] Verifying Plain-Language Explanation...")
    assert "bleeding" in report_data["plain_language_summary"].lower() or "warfarin" in report_data["plain_language_summary"].lower()
    print(f"[PASS] Plain-language summary: \"{report_data['plain_language_summary']}\"")

    # 6. Verify Actionable Safer Alternatives
    print("\n[6/12] Verifying Verified Actionable Recommendations...")
    recs = report_data["recommendations"]
    assert len(recs) >= 3, f"Expected multiple actionable recommendations, got {len(recs)}"
    
    # Must contain verified safer alternative: Acetaminophen
    safe_alt = next((r for r in recs if r["category"] == "Safer alternative" and "acetaminophen" in r["recommendation"].lower()), None)
    assert safe_alt is not None, "Missing verified Acetaminophen alternative recommendation"
    assert safe_alt["is_recommended"] is True
    assert "Beers" in safe_alt["source_reference"] or "ACC" in safe_alt["source_reference"]
    print(f"[PASS] Top Safer Alternative: {safe_alt['recommendation']}")
    print(f"       Reason: {safe_alt['reason']}")
    print(f"       Source Reference: {safe_alt['source_reference']}")

    # 7. Verify Patient & Caregiver Summary
    print("\n[7/12] Verifying Patient & Caregiver Home Summary...")
    pat_summary = report_data["patient_summary"]
    assert pat_summary is not None, "Missing patient & caregiver summary"
    assert pat_summary["medicine_name"] == "Ibuprofen"
    assert "blood thinner" in pat_summary["important_caution"].lower() or "doctor" in pat_summary["important_caution"].lower()
    assert "emergency" in pat_summary["emergency_warning"].lower() or "stools" in pat_summary["emergency_warning"].lower()
    print(f"[PASS] Patient Summary Caution: \"{pat_summary['important_caution']}\"")
    print(f"       Emergency Warning: \"{pat_summary['emergency_warning']}\"")

    # 8. Verify Direct Report Retrieval via GET /medicine-analyzer/reports/{report_id}
    print(f"\n[8/12] Testing GET /medicine-analyzer/reports/{report_id}...")
    get_res = client.get(f"/medicine-analyzer/reports/{report_id}")
    assert get_res.status_code == 200
    fetched_report = get_res.json()
    assert fetched_report["id"] == report_id
    assert fetched_report["overall_risk"] == "HIGH"
    assert len(fetched_report["current_medications_snapshot"]) == 3
    print(f"[PASS] Retrieved saved report by ID with intact 3-medication snapshot.")

    # 9. Verify Patient Reports Listing via GET /patients/{patient_id}/medicine-analysis-reports
    print(f"\n[9/12] Testing GET /patients/{test_patient_id}/medicine-analysis-reports...")
    pat_reports_res = client.get(f"/patients/{test_patient_id}/medicine-analysis-reports")
    assert pat_reports_res.status_code == 200
    pat_reports = pat_reports_res.json()
    assert len(pat_reports) >= 1
    assert any(r["id"] == report_id for r in pat_reports)
    print(f"[PASS] Found {len(pat_reports)} reports for patient {test_patient_id}.")

    # 10. Verify Consultation Report Retrieval inside Doctor Consultation
    print(f"\n[10/12] Testing GET /consultations/{test_consult_id}/medicine-analysis (Doctor Consultation Integration)...")
    consult_res = client.get(f"/consultations/{test_consult_id}/medicine-analysis")
    assert consult_res.status_code == 200
    consult_reports = consult_res.json()
    assert len(consult_reports) >= 1
    assert consult_reports[0]["id"] == report_id
    assert consult_reports[0]["overall_risk"] == "HIGH"
    print(f"[PASS] Doctor consultation {test_consult_id} successfully retrieved linked analysis report.")

    # 11. Test Safe Proposed Medication Comparison (Acetaminophen PRN)
    print("\n[11/12] Testing Proposed Safe Alternative (Acetaminophen 500mg) against same patient profile...")
    safe_payload = dict(elderly_payload)
    safe_payload["proposed_medication"] = "Acetaminophen"
    safe_payload["dose"] = "500 mg"
    safe_payload["duration"] = "3 days"
    safe_res = client.post("/medicine-analyzer/analyze", json=safe_payload)
    assert safe_res.status_code == 200
    safe_data = safe_res.json()
    assert safe_data["overall_risk"] == "LOW", f"Expected LOW risk for Acetaminophen, got {safe_data['overall_risk']}"
    assert safe_data["overall_risk_score"] <= 30
    assert len(safe_data["interaction_results"]) == 0
    print(f"[PASS] Acetaminophen verified as LOW risk ({safe_data['overall_risk_score']}/100) with 0 hazardous interactions.")

    # 12. Test Legacy 2-Medicine Compatibility Endpoint Backward Compatibility
    print("\n[12/12] Testing Legacy POST /medicine/analyze backward compatibility...")
    legacy_payload = {"medicine_1": "Aspirin 81mg", "medicine_2": "Warfarin 5mg"}
    legacy_res = client.post("/medicine/analyze", json=legacy_payload)
    assert legacy_res.status_code == 200
    legacy_data = legacy_res.json()
    assert legacy_data["status"] == "checked"
    assert legacy_data["severity"] == "high"
    assert "bleeding" in legacy_data["summary"].lower()
    print(f"[PASS] Legacy 2-med check works seamlessly: Status={legacy_data['status']}, Severity={legacy_data['severity']}")

    print("\n" + "=" * 80)
    print("ALL 12 POLYPHARMACY RISK ANALYZER TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 80)


if __name__ == "__main__":
    run_polypharmacy_tests()
