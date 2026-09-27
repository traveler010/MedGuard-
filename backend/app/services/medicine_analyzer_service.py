from typing import Optional, List
from app.schemas.medicine_analyzer import MedicineAnalyzeResponse

ANALYZER_DISCLAIMER = (
    "Preliminary informational check only. This system does not replace professional clinical judgment. "
    "Always consult a licensed physician or pharmacist before combining or changing medications."
)

# Known verified well-documented interactions for explicit demonstration
# Any other combinations strictly return 'insufficient_data' / 'unknown' with no invented information.
VERIFIED_DEMO_INTERACTIONS = {
    frozenset(["aspirin", "warfarin"]): {
        "status": "checked",
        "severity": "high",
        "summary": "Co-administration of Aspirin and Warfarin may significantly increase the risk of bleeding.",
        "details": [
            "Pharmacodynamic synergy: Both agents impair hemostasis through distinct mechanisms (antiplatelet vs anticoagulation).",
            "Clinical monitoring of INR and signs of gastrointestinal bleeding is recommended under physician supervision."
        ],
    },
    frozenset(["lisinopril", "potassium"]): {
        "status": "checked",
        "severity": "moderate",
        "summary": "ACE inhibitors such as Lisinopril may reduce aldosterone secretion, potentially increasing serum potassium levels.",
        "details": [
            "Concurrent potassium supplementation or potassium-sparing diuretics may increase the risk of hyperkalemia.",
            "Routine serum electrolyte monitoring is advised."
        ],
    },
    frozenset(["metformin", "contrast"]): {
        "status": "checked",
        "severity": "moderate",
        "summary": "Iodinated radiocontrast agents may temporarily impair renal function, increasing the risk of metformin-associated lactic acidosis.",
        "details": [
            "Metformin is typically temporarily withheld prior to or at the time of iodinated contrast procedures."
        ],
    },
}

def analyze_medication_compatibility(
    medicine_1: str, medicine_2: str
) -> MedicineAnalyzeResponse:
    """
    Clean, modular service layer for drug-drug interaction telemetry.
    Strict non-fabrication policy: If not in verified dataset, returns 'insufficient_data' / 'unknown'.
    """
    m1_clean = medicine_1.strip().lower()
    m2_clean = medicine_2.strip().lower()

    # Normalize key lookup
    # e.g. "aspirin 81mg" -> find "aspirin"
    m1_key = next((k for k in ["aspirin", "warfarin", "lisinopril", "potassium", "metformin", "contrast"] if k in m1_clean), m1_clean)
    m2_key = next((k for k in ["aspirin", "warfarin", "lisinopril", "potassium", "metformin", "contrast"] if k in m2_clean), m2_clean)

    pair_key = frozenset([m1_key, m2_key])

    if pair_key in VERIFIED_DEMO_INTERACTIONS:
        info = VERIFIED_DEMO_INTERACTIONS[pair_key]
        return MedicineAnalyzeResponse(
            medicine_1=medicine_1,
            medicine_2=medicine_2,
            status=info["status"],
            severity=info["severity"],
            summary=info["summary"],
            details=info["details"],
            disclaimer=ANALYZER_DISCLAIMER,
        )

    # Default fallback: Insufficient data. Do NOT invent medical interactions.
    return MedicineAnalyzeResponse(
        medicine_1=medicine_1,
        medicine_2=medicine_2,
        status="insufficient_data",
        severity=None,
        summary=f"No verified drug interaction data is currently indexed for '{medicine_1}' and '{medicine_2}'.",
        details=[
            "Data source: MedGuard Clinical Verification Gateway.",
            "Verified pharmacology dataset not yet connected for this drug pair. No interaction assumption should be made."
        ],
        disclaimer=ANALYZER_DISCLAIMER,
    )
