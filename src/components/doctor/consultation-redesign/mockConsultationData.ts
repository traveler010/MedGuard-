import {
  ConsultationPatientRecord,
  ProposedMedicineInput,
  RiskAnalysisResult,
  ConsultationMedication,
} from "./types";

export const MOCK_CONSULTATION_PATIENTS: ConsultationPatientRecord[] = [
  {
    id: "pat-1",
    name: "Raj Kumar",
    age: 68,
    gender: "Male",
    patientId: "#QX-94108",
    primaryCondition: "Hypertension, Atrial Fibrillation",
    vitals: {
      bloodPressure: "138/88 mmHg",
      heartRate: "76 bpm",
      eGFR: "54 mL/min/1.73m²",
      creatinine: "1.3 mg/dL",
      hba1c: "6.4%",
      haemoglobin: "13.6 g/dL",
      allergies: ["Penicillin", "Sulfa drugs"],
    },
    previousConsultation: {
      date: "14 Sep 2026",
      chiefComplaint: "Mild persistent morning dizziness and tension headache",
      summary: "Patient reported transient lightheadedness upon standing. Reviewed current antihypertensive timing.",
      doctorResponse: "Advised hydration and spaced morning dosage. Routine follow-up scheduled in 2 weeks.",
      doctorName: "Dr. Sharma, MD",
    },
    appointment: {
      date: "27 Sep 2026",
      time: "10:30 AM",
      type: "Clinical Medication Review & Follow-up",
      status: "Confirmed",
      location: "Consultation Room 3A",
    },
    defaultMedications: [
      {
        id: "med-1",
        name: "Aspirin (Cardio)",
        dose: "75 mg",
        frequency: "Once daily",
        scheduledTime: "08:00 AM",
        startDate: "15 Jan 2026",
        status: "Active",
        importantNotes: "Take in the morning with breakfast and water",
        category: "Antiplatelet",
        purposePlain: "Prevents unwanted blood clots",
        patientExplanation: "Keeps your blood moving smoothly to protect your heart.",
      },
      {
        id: "med-2",
        name: "Blood Pressure Medicine (Lisinopril)",
        dose: "5 mg",
        frequency: "Once daily",
        scheduledTime: "09:00 AM",
        startDate: "02 Feb 2026",
        status: "Active",
        importantNotes: "Monitor blood pressure weekly; report dry cough",
        category: "ACE Inhibitor",
        purposePlain: "Helps control blood pressure",
        patientExplanation: "Relaxes your blood vessels so your heart does not have to pump as hard.",
      },
      {
        id: "med-3",
        name: "Atorvastatin",
        dose: "20 mg",
        frequency: "Once daily at bedtime",
        scheduledTime: "09:00 PM",
        startDate: "10 Mar 2026",
        status: "Active",
        importantNotes: "Take at night; maintain low-fat diet",
        category: "Statin",
        purposePlain: "Maintains healthy cholesterol levels",
        patientExplanation: "Protects your blood vessels from cholesterol buildup while you sleep.",
      },
    ],
    patientIntakeNote: "Hello Doctor, I have been feeling mild morning dizziness over the past 3 days after taking my blood pressure medicine. I uploaded my recent blood test and my updated prescription image for you to review.",
    uploadedPrescriptions: [
      {
        id: "rx-1",
        name: "Prescription_DrSharma_Sep2026.jpg",
        type: "image",
        size: "1.8 MB",
        uploadDate: "27 Sep 2026, 09:15 AM",
        category: "prescription",
      },
    ],
    uploadedReports: [
      {
        id: "rep-1",
        name: "Comprehensive_Metabolic_CBC_Panel.pdf",
        type: "pdf",
        size: "2.4 MB",
        uploadDate: "18 Sep 2026, 02:40 PM",
        category: "report",
      },
    ],
    chatMessages: [
      {
        id: "msg-1",
        sender: "patient",
        senderName: "Raj Kumar",
        text: "Hello Dr. Mitchell, I uploaded my recent blood test and prescription photo. Knee pain has also been noticeable in the mornings.",
        timestamp: "Today, 09:15 AM",
      },
    ],
  },
  {
    id: "pat-2",
    name: "Priya Sharma",
    age: 64,
    gender: "Female",
    patientId: "#QX-88219",
    primaryCondition: "Type 2 Diabetes, Mild Neuropathy",
    vitals: {
      bloodPressure: "128/82 mmHg",
      heartRate: "72 bpm",
      eGFR: "68 mL/min/1.73m²",
      creatinine: "1.0 mg/dL",
      hba1c: "7.1%",
      haemoglobin: "14.1 g/dL",
      allergies: ["Codeine"],
    },
    previousConsultation: {
      date: "08 Sep 2026",
      chiefComplaint: "Tingling sensations in feet during late evenings",
      summary: "Patient reports sensory neuropathy. Fasting sugars trending slightly above target.",
      doctorResponse: "Refined carbohydrate intake advice given. Consider evening B-complex supplement.",
      doctorName: "Dr. Sharma, MD",
    },
    appointment: {
      date: "27 Sep 2026",
      time: "02:15 PM",
      type: "Diabetic Glycemic Control Consultation",
      status: "Upcoming",
      location: "Consultation Room 3B",
    },
    defaultMedications: [
      {
        id: "med-201",
        name: "Metformin Hydrochloride",
        dose: "500 mg",
        frequency: "Twice daily",
        scheduledTime: "08:00 AM, 08:00 PM",
        startDate: "10 Nov 2025",
        status: "Active",
        importantNotes: "Always take with food to minimize GI upset",
        category: "Antidiabetic",
        purposePlain: "Controls blood sugar",
        patientExplanation: "Helps your body naturally handle sugar from meals.",
      },
      {
        id: "med-202",
        name: "Glipizide",
        dose: "5 mg",
        frequency: "Once daily before breakfast",
        scheduledTime: "07:30 AM",
        startDate: "12 Dec 2025",
        status: "Active",
        importantNotes: "Take 30 minutes before first meal of the day",
        category: "Sulfonylurea",
        purposePlain: "Stimulates insulin release",
        patientExplanation: "Helps your pancreas release insulin when you eat breakfast.",
      },
    ],
  },
  {
    id: "pat-new",
    name: "Dev Anand (New Patient)",
    age: 52,
    gender: "Male",
    patientId: "#QX-77304",
    primaryCondition: "First Intake Evaluation",
    vitals: {
      bloodPressure: "124/80 mmHg",
      heartRate: "70 bpm",
      eGFR: "85 mL/min/1.73m²",
      creatinine: "0.9 mg/dL",
      hba1c: "5.6%",
      haemoglobin: "15.0 g/dL",
      allergies: ["None known"],
    },
    previousConsultation: undefined, // Demonstrates "No previous consultation"
    appointment: {
      date: "28 Sep 2026",
      time: "11:00 AM",
      type: "Initial General Health Consultation",
      status: "Confirmed",
      location: "Consultation Room 3A",
    },
    defaultMedications: [], // Demonstrates empty state: "No previous medication record found"
  },
];

/**
 * Mock Risk Analysis Engine
 * Evaluates proposed medicine against current medications, patient age, and duration.
 */
export function analyzeMockMedicationRisk(
  proposed: ProposedMedicineInput,
  currentMeds: ConsultationMedication[],
  patientAge: number
): RiskAnalysisResult {
  const query = (proposed.name || "").toLowerCase().trim();
  const currentNames = currentMeds.map((m) => m.name.toLowerCase());
  const hasAspirin = currentNames.some((n) => n.includes("aspirin"));
  const hasBP = currentNames.some((n) => n.includes("blood pressure") || n.includes("lisinopril"));

  // 1. HIGH RISK SCENARIOS
  if (
    query.includes("ibuprofen") ||
    query.includes("advil") ||
    query.includes("motrin") ||
    query.includes("naproxen") ||
    query.includes("diclofenac")
  ) {
    return {
      level: "HIGH",
      headline: "Potential interaction detected",
      explanation:
        patientAge >= 65
          ? "This combination may increase bleeding and acute kidney injury risk in patients aged 65+, and significantly blunts blood pressure medication efficacy."
          : "Systemic NSAID concurrent with anticoagulant/antiplatelet therapy markedly increases gastrointestinal bleeding risk.",
      interactionRisk: "Severe",
      dependenceRisk: "Low",
      cumulativeSideEffectRisk: "Elevated",
      ageAppropriateness: patientAge >= 65 ? "High Risk (Beers Criteria)" : "Caution (65+)",
      durationAppropriateness:
        proposed.duration.toLowerCase().includes("14") || proposed.duration.toLowerCase().includes("30")
          ? "Exceeds Recommended Window"
          : "Caution (Prolonged)",
      whyAmISeeingThis: {
        mechanism:
          "NSAIDs inhibit renal prostaglandins, leading to sodium retention and diminished glomerular filtration. When combined with Aspirin, platelet aggregation is synergistically blocked, precipitating gastric ulceration.",
        affectedSystems: ["Cardiovascular (Blood Pressure blunting)", "Renal (Decreased eGFR perfusion)", "Gastrointestinal (Erosive bleeding)"],
        clinicalPrecaution:
          "Avoid systemic NSAID in patients taking antiplatelets or ACE inhibitors. Recommend selective paracetamol or targeted topical therapy.",
      },
      saferOptions: [
        {
          id: "alt-1",
          type: "alternative_medicine",
          title: "Switch to Acetaminophen / Paracetamol",
          suggestedOption: "Acetaminophen 500 mg",
          reason: "Zero antiplatelet collision, gastric-sparing profile, and does not interfere with blood pressure medications.",
          actionPayload: {
            name: "Acetaminophen (Paracetamol)",
            dose: "500 mg",
            frequency: "Every 6 hours as needed (PRN)",
            duration: "5 Days",
          },
        },
        {
          id: "alt-2",
          type: "adjusted_dosage",
          title: "Adjust Dosage to Minimal Effective",
          suggestedOption: "Ibuprofen 200 mg with meals",
          reason: "Reduces peak plasma concentration and cumulative renal load by 50%.",
          actionPayload: {
            dose: "200 mg",
            frequency: "Once daily with food",
            duration: "3 Days",
          },
        },
        {
          id: "alt-3",
          type: "shorter_duration",
          title: "Restrict Duration to 3-Day Course",
          suggestedOption: "Short 3-Day Course only",
          reason: "Prevents cumulative nephrotoxicity and persistent gastrointestinal irritation.",
          actionPayload: {
            duration: "3 Days",
          },
        },
      ],
    };
  }

  // 2. SEDATIVE / SLEEP MEDICINE (Zolpidem / Benzodiazepine)
  if (
    query.includes("zolpidem") ||
    query.includes("ambien") ||
    query.includes("diazepam") ||
    query.includes("alprazolam") ||
    query.includes("lorazepam")
  ) {
    return {
      level: "HIGH",
      headline: "Potential interaction & fall risk detected",
      explanation:
        "This combination may increase sedation risk in patients aged 65+. Beers Criteria strongly advises avoiding sedative-hypnotics due to severe ataxia, nocturnal confusion, and fracture hazards.",
      interactionRisk: "Severe",
      dependenceRisk: "High",
      cumulativeSideEffectRisk: "Elevated",
      ageAppropriateness: "High Risk (Beers Criteria)",
      durationAppropriateness: "Exceeds Recommended Window",
      whyAmISeeingThis: {
        mechanism:
          "GABA-A receptor positive allosteric modulation causes central nervous system depression. Slower hepatic clearance in elderly patients results in prolonged drug half-life and morning psychomotor impairment.",
        affectedSystems: ["Central Nervous System (Sedation)", "Musculoskeletal (Fall & Ataxia risk)", "Cognitive (Morning delirium)"],
        clinicalPrecaution:
          "Prioritize non-pharmacologic sleep hygiene. If pharmacotherapy is strictly required, select low-dose melatonin.",
      },
      saferOptions: [
        {
          id: "alt-sed-1",
          type: "alternative_medicine",
          title: "Switch to Melatonin (Geriatric First-Line)",
          suggestedOption: "Melatonin 2 mg Extended-Release",
          reason: "Physiological sleep architecture restoration with zero daytime sedation or dependence risk.",
          actionPayload: {
            name: "Melatonin XR",
            dose: "2 mg",
            frequency: "Once daily at bedtime",
            duration: "14 Days",
          },
        },
        {
          id: "alt-sed-2",
          type: "adjusted_dosage",
          title: "Halve Starting Dose",
          suggestedOption: "Zolpidem 2.5 mg Low-Dose",
          reason: "Complies with geriatric dosing ceiling to mitigate residual morning somnolence.",
          actionPayload: {
            dose: "2.5 mg",
            frequency: "Only as needed (max 2x/week)",
            duration: "5 Days",
          },
        },
        {
          id: "alt-sed-3",
          type: "shorter_duration",
          title: "Limit to 5 Days Acute Therapy",
          suggestedOption: "5-Day Maximum Discontinuation Plan",
          reason: "Curtails psychological habituation and rebound insomnia.",
          actionPayload: {
            duration: "5 Days",
          },
        },
      ],
    };
  }

  // 3. CIPROFLOXACIN / FLUOROQUINOLONES
  if (query.includes("cipro") || query.includes("levofloxacin")) {
    return {
      level: "HIGH",
      headline: "Critical QT prolongation & CYP interaction detected",
      explanation:
        "Fluoroquinolones exhibit strong CYP1A2 inhibition and increase risk of tendon rupture and cardiac dysrhythmias in geriatric demographics.",
      interactionRisk: "Severe",
      dependenceRisk: "Low",
      cumulativeSideEffectRisk: "Elevated",
      ageAppropriateness: "High Risk (Beers Criteria)",
      durationAppropriateness: "Caution (Prolonged)",
      whyAmISeeingThis: {
        mechanism:
          "Potent inhibition of cytochrome P450 enzymes leads to toxic drug accumulation. Cartilage and collagen matrix disruption significantly elevates tendinopathy risk.",
        affectedSystems: ["Cardiovascular (QT prolongation)", "Musculoskeletal (Tendon fragility)", "Metabolic (CYP inhibition)"],
        clinicalPrecaution:
          "Substitute with beta-lactam or macrolide antibiotic with safer cardiovascular tolerability.",
      },
      saferOptions: [
        {
          id: "alt-cipro-1",
          type: "alternative_medicine",
          title: "Switch to Amoxicillin-Clavulanate or Ceftriaxone",
          suggestedOption: "Amoxicillin-Clavulanate 500/125 mg",
          reason: "Broad antimicrobial coverage without CYP inhibition, tendon toxicity, or cardiac dysrhythmia risk.",
          actionPayload: {
            name: "Amoxicillin-Clavulanate",
            dose: "500/125 mg",
            frequency: "Twice daily with meals",
            duration: "7 Days",
          },
        },
        {
          id: "alt-cipro-2",
          type: "adjusted_dosage",
          title: "Reduce to Renal Adjusted Regimen",
          suggestedOption: "Ciprofloxacin 250 mg every 12h",
          reason: "Prevents drug accumulation given patient's borderline eGFR.",
          actionPayload: {
            dose: "250 mg",
            frequency: "Twice daily",
            duration: "5 Days",
          },
        },
      ],
    };
  }

  // 4. MODERATE RISK SCENARIOS (e.g. Steroids, higher doses, or decongestants with hypertension)
  if (
    query.includes("prednisone") ||
    query.includes("pseudoephedrine") ||
    query.includes("steroid") ||
    query.includes("dexamethasone") ||
    (hasBP && query.includes("decongestant"))
  ) {
    return {
      level: "MODERATE",
      headline: "Moderate interaction & glycemic precaution required",
      explanation:
        "Corticosteroid or sympathomimetic therapy may provoke blood pressure elevation and transient glycemic spikes.",
      interactionRisk: "Moderate",
      dependenceRisk: "Moderate",
      cumulativeSideEffectRisk: "Moderate",
      ageAppropriateness: "Caution (65+)",
      durationAppropriateness:
        proposed.duration.toLowerCase().includes("30") || proposed.duration.toLowerCase().includes("60")
          ? "Exceeds Recommended Window"
          : "Appropriate",
      whyAmISeeingThis: {
        mechanism:
          "Systemic steroids cause fluid and sodium retention via mineralocorticoid receptors and stimulate hepatic gluconeogenesis.",
        affectedSystems: ["Endocrine (Blood sugar spike)", "Cardiovascular (Fluid retention)"],
        clinicalPrecaution:
          "Monitor daily blood pressures and fasting capillary blood sugars. Provide rapid tapering protocol.",
      },
      saferOptions: [
        {
          id: "alt-mod-1",
          type: "alternative_medicine",
          title: "Targeted Inhaled / Topical Formulation",
          suggestedOption: "Topical / Inhaled Corticosteroid",
          reason: "Minimizes systemic bio-absorption while maintaining targeted anti-inflammatory efficacy.",
          actionPayload: {
            name: "Budesonide Topical/Inhaled",
            dose: "Standard Local Dose",
            frequency: "Twice daily",
            duration: "7 Days",
          },
        },
        {
          id: "alt-mod-2",
          type: "shorter_duration",
          title: "Taper Course within 5 Days",
          suggestedOption: "Short 5-Day Burst and Stop",
          reason: "Prevents hypothalamic-pituitary-adrenal axis suppression and sustained hypertension.",
          actionPayload: {
            duration: "5 Days",
          },
        },
      ],
    };
  }

  // 5. LOW RISK / SAFE COMPATIBLE REGIMEN (e.g. Paracetamol, Vitamins, Hydration, Topical)
  return {
    level: "LOW",
    headline: "Low risk — Compatibility verified",
    explanation:
      "No critical pharmacodynamic or pharmacokinetic collisions detected against patient's existing regimen, age bracket, or renal profile.",
    interactionRisk: "Minimal",
    dependenceRisk: "Low",
    cumulativeSideEffectRisk: "Low",
    ageAppropriateness: "Appropriate",
    durationAppropriateness: "Appropriate",
    whyAmISeeingThis: {
      mechanism:
        "Proposed agent exhibits standard hepatic glucuronidation/sulfation without competing for renal clearance or CYP enzymes utilized by current medications.",
      affectedSystems: ["All parameters within baseline clinical tolerances"],
      clinicalPrecaution:
        "Proceed with standard dosing and routine patient education on adherence.",
    },
    saferOptions: [],
  };
}
