export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  route: string;
  frequency: string;
  timingSlot: 'morning' | 'noon' | 'evening' | 'bedtime';
  prescriber: string;
  indication: string;
  dateStarted: string;
  category: string;
  pillColor: string;
  pillShape: 'round' | 'oval' | 'capsule' | 'oblong';
  pillVisualDescription: string;
  withFood: 'with_food' | 'empty_stomach' | 'anytime';
  acbScore: number; // 0, 1, 2, 3 Anticholinergic Cognitive Burden
  fallSedationScore: number; // 0 to 3
  beersCriteriaFlag: boolean;
  beersRationale?: string;
  renalAdjustmentNeeded: boolean;
  renalNote?: string;
  isActive: boolean;
  isTapering?: boolean;
  patientPlainName: string;
  patientWhy: string;
  patientSpecialNotice?: string;
}

export interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: 'HIGH' | 'MODERATE' | 'LOW';
  mechanism: string;
  clinicalConsequence: string;
  recommendation: string;
  evidenceSource: string;
  isActive: boolean;
}

export interface PrescribingCascade {
  id: string;
  primaryDrug: string;
  adverseEffect: string;
  secondaryDrug: string;
  secondaryDrugIndicationPresumed: string;
  clinicalGuidance: string;
  isActive: boolean;
}

export interface DeprescribingRecommendation {
  id: string;
  drugId: string;
  drugName: string;
  action: 'DISCONTINUE' | 'TAPER_OFF' | 'SUBSTITUTE' | 'DOSE_REDUCE';
  priority: 'URGENT' | 'HIGH' | 'ROUTINE';
  clinicalRationale: string;
  expectedScoreImprovement: number;
  evidenceCitation: string;
  monitoringPlan: string;
  suggestedAlternative?: string;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male';
  dob: string;
  weightKg: number;
  heightCm: number;
  bloodPressure: string;
  heartRate: number;
  eGFR: number; // mL/min/1.73m2
  creatinine: number; // mg/dL
  potassium: number; // mEq/L
  inr?: number;
  allergies: string[];
  diagnoses: string[];
  primaryDoctor: string;
  lastReviewDate: string;
  lastConsultation?: string;
  caregiverName?: string;
  caregiverPhone?: string;
  
  // Risk metrics calculated
  polypharmacyScore: number; // 0-100
  riskLevel: RiskLevel;
  totalAcbScore: number;
  fallRiskScore: number; // 0-10
  sedationIndex: number; // 0-10
  
  medications: Medication[];
  interactions: DrugInteraction[];
  cascades: PrescribingCascade[];
  recommendations: DeprescribingRecommendation[];
}

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    mrn: 'MG-80419',
    name: 'Eleanor Vance',
    age: 74,
    gender: 'Female',
    dob: '1952-03-14',
    weightKg: 62.5,
    heightCm: 160,
    bloodPressure: '142/88 mmHg',
    heartRate: 76,
    eGFR: 34, // CKD Stage 3b
    creatinine: 1.8,
    potassium: 5.3,
    inr: 3.8,
    allergies: ['Penicillin (Hives)', 'Sulfa Drugs (Rash)'],
    diagnoses: [
      'Atrial Fibrillation (Non-valvular)',
      'Chronic Kidney Disease (Stage 3b)',
      'Essential Hypertension',
      'Severe Knee Osteoarthritis',
      'Chronic Insomnia',
      'Gastroesophageal Reflux Disease (GERD)'
    ],
    primaryDoctor: 'Dr. Sharma, MD',
    lastReviewDate: '2026-09-18',
    lastConsultation: 'Today, 09:00 AM',
    caregiverName: 'David Vance (Son)',
    caregiverPhone: '(555) 382-9014',
    polypharmacyScore: 86,
    riskLevel: 'HIGH',
    totalAcbScore: 4,
    fallRiskScore: 8,
    sedationIndex: 7,
    medications: [
      {
        id: 'med-1',
        name: 'Warfarin Sodium',
        genericName: 'Warfarin',
        dosage: '4 mg',
        route: 'Oral',
        frequency: 'Once daily at 6:00 PM',
        timingSlot: 'evening',
        prescriber: 'Dr. Sarah Al-Mansoor',
        indication: 'Stroke prevention in Atrial Fibrillation',
        dateStarted: '2023-04-10',
        category: 'Anticoagulant (Vitamin K Antagonist)',
        pillColor: '#60a5fa',
        pillShape: 'round',
        pillVisualDescription: 'Small blue round scored tablet (marked "4")',
        withFood: 'anytime',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Blood Thinner (Warfarin)',
        patientWhy: 'Helps prevent dangerous blood clots and protects your heart rhythm from causing a stroke.',
        patientSpecialNotice: 'Take at the exact same time every evening. Avoid sudden dietary changes in spinach or dark greens.'
      },
      {
        id: 'med-2',
        name: 'Fluconazole',
        genericName: 'Fluconazole',
        dosage: '150 mg',
        route: 'Oral',
        frequency: 'Daily (Acute course - Day 3 of 7)',
        timingSlot: 'morning',
        prescriber: 'Dr. Robert Jenkins (Urgent Care)',
        indication: 'Oral candidiasis / Fungal infection',
        dateStarted: '2026-09-24',
        category: 'Triazole Antifungal (Potent CYP2C9 inhibitor)',
        pillColor: '#f87171',
        pillShape: 'capsule',
        pillVisualDescription: 'Pink & white gelatin capsule',
        withFood: 'with_food',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: true,
        renalNote: 'Fluconazole is 80% renally cleared. In eGFR < 50 mL/min, 50% dose reduction recommended.',
        isActive: true,
        patientPlainName: 'Antifungal Infection Pill',
        patientWhy: 'Prescribed to treat a thrush fungal infection in the mouth.',
        patientSpecialNotice: '⚠️ CRITICAL: Interacts with your blood thinner. Contact your doctor immediately.'
      },
      {
        id: 'med-3',
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        dosage: '20 mg',
        route: 'Oral',
        frequency: 'Once daily with breakfast',
        timingSlot: 'morning',
        prescriber: 'Dr. Marcus Webb',
        indication: 'Hypertension & Renal Protection',
        dateStarted: '2021-08-15',
        category: 'ACE Inhibitor',
        pillColor: '#facc15',
        pillShape: 'round',
        pillVisualDescription: 'Yellow round tablet (marked "L20")',
        withFood: 'with_food',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: true,
        renalNote: 'Dose titration required due to baseline hyperkalemia (K=5.3) and eGFR 34.',
        isActive: true,
        patientPlainName: 'Blood Pressure Tablet (Lisinopril)',
        patientWhy: 'Relaxes blood vessels and keeps blood pressure at safe levels.',
        patientSpecialNotice: 'Take in the morning with a glass of water.'
      },
      {
        id: 'med-4',
        name: 'Spironolactone',
        genericName: 'Spironolactone',
        dosage: '25 mg',
        route: 'Oral',
        frequency: 'Once daily in morning',
        timingSlot: 'morning',
        prescriber: 'Dr. Marcus Webb',
        indication: 'Resistant Hypertension adjunct',
        dateStarted: '2024-02-11',
        category: 'Aldosterone Antagonist (Potassium-Sparing)',
        pillColor: '#e2e8f0',
        pillShape: 'oval',
        pillVisualDescription: 'White oval tablet with peppermint aroma',
        withFood: 'with_food',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: true,
        renalNote: 'Avoid when eGFR < 30 mL/min; high risk of severe hyperkalemia when combined with ACEi.',
        isActive: true,
        patientPlainName: 'Water & Pressure Pill (Spironolactone)',
        patientWhy: 'Helps remove extra fluid and manage blood pressure.',
        patientSpecialNotice: 'Avoid potassium salt substitutes (like "Lite Salt") while taking this.'
      },
      {
        id: 'med-5',
        name: 'Amlodipine Besylate',
        genericName: 'Amlodipine',
        dosage: '10 mg',
        route: 'Oral',
        frequency: 'Once daily in morning',
        timingSlot: 'morning',
        prescriber: 'Dr. Marcus Webb',
        indication: 'Hypertension',
        dateStarted: '2022-01-20',
        category: 'Dihydropyridine Calcium Channel Blocker',
        pillColor: '#f1f5f9',
        pillShape: 'round',
        pillVisualDescription: 'White round tablet (marked "A10")',
        withFood: 'anytime',
        acbScore: 0,
        fallSedationScore: 1,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Blood Pressure Pill (Amlodipine)',
        patientWhy: 'Keeps blood vessels open to prevent strain on your heart.',
        patientSpecialNotice: 'Can cause mild swelling in the ankles. Keep feet elevated when resting.'
      },
      {
        id: 'med-6',
        name: 'Furosemide',
        genericName: 'Furosemide',
        dosage: '40 mg',
        route: 'Oral',
        frequency: 'Once daily at 8:00 AM',
        timingSlot: 'morning',
        prescriber: 'Dr. Marcus Webb',
        indication: 'Bilateral lower extremity edema',
        dateStarted: '2022-05-18',
        category: 'Loop Diuretic',
        pillColor: '#fde047',
        pillShape: 'round',
        pillVisualDescription: 'Small pale yellow round tablet',
        withFood: 'anytime',
        acbScore: 0,
        fallSedationScore: 1,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Water Pill (Furosemide)',
        patientWhy: 'Flushes out excess fluid buildup to reduce swelling in legs and ankles.',
        patientSpecialNotice: 'Expect increased urination for 3-4 hours after taking. Take before 10 AM to prevent nighttime bathroom trips.'
      },
      {
        id: 'med-7',
        name: 'Diphenhydramine HCl',
        genericName: 'Diphenhydramine',
        dosage: '25 mg',
        route: 'Oral',
        frequency: '1 tablet nightly at bedtime PRN',
        timingSlot: 'bedtime',
        prescriber: 'Self-prescribed (Over-The-Counter Sominex/Benadryl)',
        indication: 'Chronic insomnia & nighttime itch',
        dateStarted: '2024-09-01',
        category: 'First-Generation H1 Antihistamine',
        pillColor: '#c084fc',
        pillShape: 'capsule',
        pillVisualDescription: 'Small pink/purple oval capsule',
        withFood: 'anytime',
        acbScore: 3, // Severe anticholinergic
        fallSedationScore: 3, // Severe sedative
        beersCriteriaFlag: true,
        beersRationale: 'AGS Beers Criteria 2023: Strongly avoid in older adults. Highly anticholinergic; causes confusion, daytime grogginess, delirium, constipation, urinary retention, and >2.5x fall risk.',
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Nighttime Sleep Aid (OTC)',
        patientWhy: 'Taken to help fall asleep at night.',
        patientSpecialNotice: '⚠️ WARNING: High risk of nighttime dizziness, morning confusion, and falls. Talk to doctor about safer alternatives.'
      },
      {
        id: 'med-8',
        name: 'Omeprazole',
        genericName: 'Omeprazole',
        dosage: '40 mg',
        route: 'Oral',
        frequency: 'Once daily 30 min before breakfast',
        timingSlot: 'morning',
        prescriber: 'Dr. Elena Rostova',
        indication: 'GERD & mucosal gastroprotection with NSAID/Warfarin',
        dateStarted: '2022-11-05',
        category: 'Proton Pump Inhibitor (PPI)',
        pillColor: '#fb923c',
        pillShape: 'capsule',
        pillVisualDescription: 'Orange & brown delayed-release capsule',
        withFood: 'empty_stomach',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: true,
        beersRationale: 'Beers Criteria: Prolonged use (>8 weeks) without ongoing peptic ulcer disease increases risk of C. diff infection, hypomagnesemia, bone fractures, and CKD progression.',
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Stomach Acid Protector (Omeprazole)',
        patientWhy: 'Protects the stomach lining and reduces painful acid reflux/heartburn.',
        patientSpecialNotice: 'Take 30 minutes before your first meal of the day.'
      },
      {
        id: 'med-9',
        name: 'Tramadol HCl',
        genericName: 'Tramadol',
        dosage: '50 mg',
        route: 'Oral',
        frequency: 'Every 8 hours as needed for joint pain',
        timingSlot: 'noon',
        prescriber: 'Dr. Gregory Thorne (Orthopedics)',
        indication: 'Moderate to severe bilateral knee osteoarthritis',
        dateStarted: '2025-01-14',
        category: 'Synthetic Opioid Analgesic / SNRI',
        pillColor: '#ffffff',
        pillShape: 'round',
        pillVisualDescription: 'White round tablet scored on one side',
        withFood: 'with_food',
        acbScore: 1,
        fallSedationScore: 3,
        beersCriteriaFlag: true,
        beersRationale: 'Beers Criteria: Synergistic CNS depression, SIADH/hyponatremia risk, and severe fall hazard when co-administered with other sedatives.',
        renalAdjustmentNeeded: true,
        renalNote: 'Elimination half-life prolonged in CKD. Max recommended dose is 100 mg/day in eGFR < 30.',
        isActive: true,
        patientPlainName: 'Pain Relief Medicine (Tramadol)',
        patientWhy: 'Controls sharp pain in knees from severe arthritis.',
        patientSpecialNotice: 'May cause drowsiness and slowed reflexes. Do not drive or walk without mobility aid if feeling lightheaded.'
      }
    ],
    interactions: [
      {
        id: 'ddi-1',
        drug1: 'Warfarin Sodium',
        drug2: 'Fluconazole',
        severity: 'HIGH',
        mechanism: 'Fluconazole is a potent inhibitor of CYP2C9, the primary enzyme responsible for the metabolic clearance of the active S-enantiomer of Warfarin.',
        clinicalConsequence: 'Life-threatening hemorrhage risk. Patient INR has spiked to 3.8 (therapeutic target 2.0-3.0). Marked risk of intracranial or gastrointestinal bleed.',
        recommendation: 'URGENT: Discontinue or replace Fluconazole with topical Nystatin or reduce Warfarin dose by 50% immediately with daily INR telemetry.',
        evidenceSource: 'FDA Black Box Warning & CHEST Antithrombotic Guidelines Level 1A',
        isActive: true
      },
      {
        id: 'ddi-2',
        drug1: 'Lisinopril',
        drug2: 'Spironolactone',
        severity: 'HIGH',
        mechanism: 'Concomitant inhibition of aldosterone and angiotensin II in a patient with reduced glomerular filtration (eGFR 34 mL/min).',
        clinicalConsequence: 'Severe Hyperkalemia (Current Serum Potassium: 5.3 mEq/L, trending toward cardiotoxic levels > 5.8 mEq/L) leading to fatal ventricular arrhythmias.',
        recommendation: 'Temporarily withhold Spironolactone; re-check serum creatinine and potassium in 48 hours. Consider dose reduction of Lisinopril.',
        evidenceSource: 'AHA/ACC Heart Failure & KDIGO CKD Guidelines',
        isActive: true
      },
      {
        id: 'ddi-3',
        drug1: 'Diphenhydramine HCl',
        drug2: 'Tramadol HCl',
        severity: 'HIGH',
        mechanism: 'Cumulative Central Nervous System depression and additive anticholinergic / serotonergic toxicity.',
        clinicalConsequence: 'Marked daytime sedation, cognitive delirium, acute urinary retention, and 3.2x increased incidence of hip fractures / nocturnal falls.',
        recommendation: 'Deprescribe OTC Diphenhydramine immediately. Transition to non-pharmacologic sleep hygiene or low-dose Melatonin (0.5-1mg).',
        evidenceSource: 'American Geriatrics Society Beers Criteria 2023',
        isActive: true
      },
      {
        id: 'ddi-4',
        drug1: 'Furosemide',
        drug2: 'Lisinopril',
        severity: 'MODERATE',
        mechanism: 'Dual hemodynamic insult on renal perfusion: Loop diuretic volume depletion compounded by efferent arteriolar vasodilation from ACEi.',
        clinicalConsequence: 'Pre-renal azotemia and acceleration of chronic kidney disease (eGFR has declined from 42 to 34 over 6 months).',
        recommendation: 'Evaluate clinical volume status. If peripheral edema was drug-induced by Amlodipine, taper and discontinue Furosemide.',
        evidenceSource: 'Kidney Disease Improving Global Outcomes (KDIGO)',
        isActive: true
      }
    ],
    cascades: [
      {
        id: 'casc-1',
        primaryDrug: 'Amlodipine Besylate (10 mg)',
        adverseEffect: 'Peripheral Vasodilatory Ankle Edema (DHP-CCB side effect)',
        secondaryDrug: 'Furosemide (40 mg)',
        secondaryDrugIndicationPresumed: 'Presumed congestive heart failure / venous insufficiency',
        clinicalGuidance: 'Classic Prescribing Cascade. Loop diuretics are largely ineffective for CCB-induced capillary transudate. Patient was placed on Furosemide unnecessarily, driving renal decline and hypokalemia risk.',
        isActive: true
      }
    ],
    recommendations: [
      {
        id: 'rec-1',
        drugId: 'med-2',
        drugName: 'Fluconazole',
        action: 'SUBSTITUTE',
        priority: 'URGENT',
        clinicalRationale: 'Eliminate CYP2C9 inhibition to prevent catastrophic bleeding in patient taking Warfarin with INR 3.8. Switch to non-systemic topical Nystatin oral suspension.',
        expectedScoreImprovement: 18,
        evidenceCitation: 'CHEST 2022 Anticoagulation Guidelines & FDA DDI Guidance',
        monitoringPlan: 'Repeat STAT INR tomorrow morning; titrate Warfarin dose to return INR to 2.0-3.0.',
        suggestedAlternative: 'Nystatin Oral Suspension 100,000 U/mL (Swish & Swallow)'
      },
      {
        id: 'rec-2',
        drugId: 'med-7',
        drugName: 'Diphenhydramine HCl',
        action: 'DISCONTINUE',
        priority: 'URGENT',
        clinicalRationale: 'Single highest anticholinergic and sedative burden medication (ACB=3). Strongest Beers Criteria recommendation to deprescribe in adults over 65.',
        expectedScoreImprovement: 16,
        evidenceCitation: 'AGS Beers Criteria 2023 & STOPP/START v3 Criteria (Section K)',
        monitoringPlan: 'Assess sleep quality at 1 week. Implement CBT-I sleep hygiene protocol.',
        suggestedAlternative: 'Non-pharmacologic CBT-I protocol ± Melatonin 1 mg QHS'
      },
      {
        id: 'rec-3',
        drugId: 'med-6',
        drugName: 'Furosemide',
        action: 'TAPER_OFF',
        priority: 'HIGH',
        clinicalRationale: 'Resolve prescribing cascade. Taper Furosemide while reducing Amlodipine from 10mg to 5mg (or adding low-dose ARB/ACEi). Will spare eGFR and prevent pre-renal azotemia.',
        expectedScoreImprovement: 12,
        evidenceCitation: 'Annals of Internal Medicine: Drug-Induced Edema Cascades',
        monitoringPlan: 'Check weight daily for 10 days; monitor serum creatinine & electrolytes in 14 days.',
        suggestedAlternative: 'Reduce Amlodipine to 5 mg; discontinue Furosemide over 4 days'
      },
      {
        id: 'rec-4',
        drugId: 'med-4',
        drugName: 'Spironolactone',
        action: 'DOSE_REDUCE',
        priority: 'HIGH',
        clinicalRationale: 'Patient has eGFR 34 and Potassium 5.3 mEq/L on Lisinopril 20mg. Concomitant full-dose MRA presents high hyperkalemia hazard.',
        expectedScoreImprovement: 10,
        evidenceCitation: 'KDIGO 2024 Clinical Practice Guideline for CKD Management',
        monitoringPlan: 'Withhold for 48h, re-evaluate serum potassium. Resume at 12.5 mg every other day if needed.',
        suggestedAlternative: 'Withhold or reduce to 12.5 mg every other day with dietary potassium restriction'
      },
      {
        id: 'rec-5',
        drugId: 'med-8',
        drugName: 'Omeprazole',
        action: 'TAPER_OFF',
        priority: 'ROUTINE',
        clinicalRationale: 'Continuous PPI therapy for >3 years without documented active ulcer. Associated with CKD progression, hypomagnesemia, and bone density loss in postmenopausal female.',
        expectedScoreImprovement: 6,
        evidenceCitation: 'Gastroenterology Deprescribing Guidelines & Beers 2023',
        monitoringPlan: 'Taper to 20 mg daily for 2 weeks, then 20 mg PRN. Step down to Famotidine 10mg if needed.',
        suggestedAlternative: 'Famotidine 10 mg PRN or calcium antacids as needed'
      }
    ]
  },
  {
    id: 'pat-2',
    mrn: 'MG-71932',
    name: 'Robert Chen',
    age: 68,
    gender: 'Male',
    dob: '1958-07-22',
    weightKg: 84.0,
    heightCm: 172,
    bloodPressure: '136/82 mmHg',
    heartRate: 68,
    eGFR: 42,
    creatinine: 1.6,
    potassium: 4.8,
    allergies: ['Codeine (Nausea/Vomiting)'],
    diagnoses: [
      'Type 2 Diabetes Mellitus (HbA1c 8.4%)',
      'Heart Failure with Preserved Ejection Fraction (HFpEF)',
      'Hyperlipidemia',
      'Chronic Gouty Arthritis'
    ],
    primaryDoctor: 'Dr. Sharma, MD',
    lastReviewDate: '2026-08-30',
    lastConsultation: 'Yesterday, 02:15 PM',
    caregiverName: 'Grace Chen (Spouse)',
    caregiverPhone: '(555) 604-1882',
    polypharmacyScore: 64,
    riskLevel: 'MODERATE',
    totalAcbScore: 1,
    fallRiskScore: 4,
    sedationIndex: 3,
    medications: [
      {
        id: 'med-201',
        name: 'Metformin HCl',
        genericName: 'Metformin',
        dosage: '1000 mg',
        route: 'Oral',
        frequency: 'Twice daily with meals',
        timingSlot: 'morning',
        prescriber: 'Dr. Michael Chang',
        indication: 'Type 2 Diabetes',
        dateStarted: '2018-05-12',
        category: 'Biguanide',
        pillColor: '#ffffff',
        pillShape: 'oval',
        pillVisualDescription: 'Large white oval tablet (marked "M1000")',
        withFood: 'with_food',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: true,
        renalNote: 'Dose must be capped at 1000 mg total daily dose when eGFR 30-44 mL/min due to lactic acidosis risk.',
        isActive: true,
        patientPlainName: 'Blood Sugar Pill (Metformin)',
        patientWhy: 'Controls blood glucose levels after meals.',
        patientSpecialNotice: 'Always take with food to prevent upset stomach.'
      },
      {
        id: 'med-202',
        name: 'Empagliflozin',
        genericName: 'Empagliflozin',
        dosage: '10 mg',
        route: 'Oral',
        frequency: 'Once daily in morning',
        timingSlot: 'morning',
        prescriber: 'Dr. Michael Chang',
        indication: 'T2D & Cardiorenal Protection',
        dateStarted: '2023-01-10',
        category: 'SGLT2 Inhibitor',
        pillColor: '#fde047',
        pillShape: 'round',
        pillVisualDescription: 'Light yellow round film-coated tablet',
        withFood: 'anytime',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Heart & Kidney Sugar Pill (Jardiance)',
        patientWhy: 'Lowers blood sugar and protects heart and kidney function.',
        patientSpecialNotice: 'Drink plenty of water throughout the day.'
      },
      {
        id: 'med-203',
        name: 'Naproxen',
        genericName: 'Naproxen',
        dosage: '500 mg',
        route: 'Oral',
        frequency: 'Twice daily PRN during gout flare',
        timingSlot: 'noon',
        prescriber: 'Self / OTC Pharmacy',
        indication: 'Gout flare joint swelling',
        dateStarted: '2026-09-10',
        category: 'Nonsteroidal Anti-inflammatory Drug (NSAID)',
        pillColor: '#38bdf8',
        pillShape: 'oval',
        pillVisualDescription: 'Light blue oval tablet',
        withFood: 'with_food',
        acbScore: 0,
        fallSedationScore: 1,
        beersCriteriaFlag: true,
        beersRationale: 'NSAIDs in CKD Stage 3+ induce acute renal decompensation, fluid retention, and blunted antihypertensive response.',
        renalAdjustmentNeeded: true,
        renalNote: 'Contraindicated with baseline eGFR < 45 and heart failure.',
        isActive: true,
        patientPlainName: 'Anti-inflammatory Pain Pill (Aleve)',
        patientWhy: 'Taken to calm joint pain during a gout attack.',
        patientSpecialNotice: '⚠️ WARNING: Can cause kidney damage when kidneys are already strained.'
      },
      {
        id: 'med-204',
        name: 'Allopurinol',
        genericName: 'Allopurinol',
        dosage: '300 mg',
        route: 'Oral',
        frequency: 'Once daily after breakfast',
        timingSlot: 'morning',
        prescriber: 'Dr. Michael Chang',
        indication: 'Uric acid reduction in Gout',
        dateStarted: '2022-03-15',
        category: 'Xanthine Oxidase Inhibitor',
        pillColor: '#f1f5f9',
        pillShape: 'round',
        pillVisualDescription: 'Small white round scored tablet',
        withFood: 'with_food',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: true,
        renalNote: 'Renal clearance required; titrate based on eGFR.',
        isActive: true,
        patientPlainName: 'Gout Prevention Pill (Allopurinol)',
        patientWhy: 'Lowers uric acid in blood to stop crystals forming in joints.',
        patientSpecialNotice: 'Take consistently every day even when you have no joint pain.'
      },
      {
        id: 'med-205',
        name: 'Carvedilol',
        genericName: 'Carvedilol',
        dosage: '12.5 mg',
        route: 'Oral',
        frequency: 'Twice daily with breakfast and dinner',
        timingSlot: 'evening',
        prescriber: 'Dr. Sarah Al-Mansoor',
        indication: 'Heart Failure & BP',
        dateStarted: '2023-06-20',
        category: 'Non-selective Beta-blocker / Alpha-1 blocker',
        pillColor: '#ffffff',
        pillShape: 'round',
        pillVisualDescription: 'White round tablet (marked "12.5")',
        withFood: 'with_food',
        acbScore: 0,
        fallSedationScore: 1,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Heart Support Pill (Carvedilol)',
        patientWhy: 'Calms heartbeat and protects heart muscle from excessive work.',
        patientSpecialNotice: 'Take with food to minimize feeling dizzy when standing.'
      },
      {
        id: 'med-206',
        name: 'Atorvastatin',
        genericName: 'Atorvastatin',
        dosage: '40 mg',
        route: 'Oral',
        frequency: 'Once daily at bedtime',
        timingSlot: 'bedtime',
        prescriber: 'Dr. Michael Chang',
        indication: 'Atherosclerotic cardiovascular prevention',
        dateStarted: '2020-04-10',
        category: 'HMG-CoA Reductase Inhibitor',
        pillColor: '#ffffff',
        pillShape: 'oval',
        pillVisualDescription: 'White oval film-coated tablet',
        withFood: 'anytime',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Cholesterol Shield (Atorvastatin)',
        patientWhy: 'Lowers LDL bad cholesterol and keeps arteries clean.',
        patientSpecialNotice: 'Take at bedtime. Report any unusual unexplained muscle soreness.'
      },
      {
        id: 'med-207',
        name: 'Colchicine',
        genericName: 'Colchicine',
        dosage: '0.6 mg',
        route: 'Oral',
        frequency: 'Once daily prophylaxis',
        timingSlot: 'morning',
        prescriber: 'Dr. Michael Chang',
        indication: 'Gout flare prophylaxis',
        dateStarted: '2026-08-01',
        category: 'Tubulin inhibitor / Anti-gout',
        pillColor: '#a7f3d0',
        pillShape: 'capsule',
        pillVisualDescription: 'Purple/white small capsule',
        withFood: 'anytime',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: true,
        beersRationale: 'Reduce dose in CKD. High risk of severe myopathy when combined with high-dose statin (Atorvastatin).',
        renalAdjustmentNeeded: true,
        renalNote: 'Requires dose adjustment to 0.3mg daily or 0.6mg every 2-3 days in eGFR 42.',
        isActive: true,
        patientPlainName: 'Gout Flare Blocker (Colchicine)',
        patientWhy: 'Prevents acute painful swelling in big toe and joints.',
        patientSpecialNotice: 'Do not take extra doses if diarrhea develops.'
      }
    ],
    interactions: [
      {
        id: 'ddi-201',
        drug1: 'Atorvastatin',
        drug2: 'Colchicine',
        severity: 'HIGH',
        mechanism: 'Concurrent inhibition of CYP3A4 and P-glycoprotein transport pathways; both drugs have independent muscle toxicity risks.',
        clinicalConsequence: 'Additive risk of severe myopathy, elevated CK levels, and potential rhabdomyolysis resulting in acute kidney injury.',
        recommendation: 'Reduce Colchicine dosing frequency (0.3mg daily or 0.6mg every other day) and educate patient on early symptoms of muscle tenderness or dark urine.',
        evidenceSource: 'FDA Drug Safety Communication & ACR Guidelines',
        isActive: true
      },
      {
        id: 'ddi-202',
        drug1: 'Naproxen',
        drug2: 'Carvedilol',
        severity: 'MODERATE',
        mechanism: 'NSAID inhibits vasodilatory prostaglandins, attenuating the antihypertensive and cardioprotective efficacy of beta-blockers.',
        clinicalConsequence: 'Fluid retention, elevated systolic BP (+8-12 mmHg), and worsening renal function in stage 3 CKD.',
        recommendation: 'Deprescribe Naproxen. Use intra-articular steroid or low-dose oral prednisone short-burst for acute gout instead of systemic NSAID.',
        evidenceSource: 'American College of Rheumatology 2020 Guidelines',
        isActive: true
      }
    ],
    cascades: [],
    recommendations: [
      {
        id: 'rec-201',
        drugId: 'med-203',
        drugName: 'Naproxen',
        action: 'DISCONTINUE',
        priority: 'URGENT',
        clinicalRationale: 'NSAID is nephrotoxic in patient with eGFR 42 and blunts cardiovascular response. High risk of precipitating acute-on-chronic renal failure.',
        expectedScoreImprovement: 15,
        evidenceCitation: 'Kidney International & KDIGO Guidelines on NSAID avoidance in CKD',
        monitoringPlan: 'Substitute with short-course low-dose Prednisone (20mg daily x 5 days) for acute gout.',
        suggestedAlternative: 'Prednisone 20 mg daily x 5 days for flares'
      },
      {
        id: 'rec-202',
        drugId: 'med-201',
        drugName: 'Metformin HCl',
        action: 'DOSE_REDUCE',
        priority: 'HIGH',
        clinicalRationale: 'Patient is taking 2000mg/day (1000mg BID). FDA guidelines mandate maximum 1000mg/day when eGFR is 30-44 mL/min to prevent lactic acidosis.',
        expectedScoreImprovement: 12,
        evidenceCitation: 'FDA Drug Safety Revision on Metformin in Chronic Kidney Disease',
        monitoringPlan: 'Reduce to 500 mg BID with meals; check eGFR and HbA1c in 3 months.',
        suggestedAlternative: 'Metformin 500 mg BID with breakfast and dinner'
      }
    ]
  },
  {
    id: 'pat-3',
    mrn: 'MG-94108',
    name: 'Margaret Miller',
    age: 82,
    gender: 'Female',
    dob: '1944-11-09',
    weightKg: 54.0,
    heightCm: 155,
    bloodPressure: '128/74 mmHg',
    heartRate: 72,
    eGFR: 55,
    creatinine: 1.1,
    potassium: 4.4,
    allergies: ['Aspirin (Bronchospasm/Asthma)'],
    diagnoses: [
      'Mild Cognitive Impairment (MoCA 22/30)',
      'Severe Urge Incontinence / Overactive Bladder',
      'Severe Osteoporosis (T-score -3.1)',
      'History of 2 Falls in Past 6 Months (Hip contusion)',
      'Neuropathic Pain (Post-herpetic)'
    ],
    primaryDoctor: 'Dr. Sharma, MD',
    lastReviewDate: '2026-09-02',
    lastConsultation: '24 Sep 2026',
    caregiverName: 'Rebecca Miller (Daughter)',
    caregiverPhone: '(555) 714-2209',
    polypharmacyScore: 92,
    riskLevel: 'HIGH',
    totalAcbScore: 6,
    fallRiskScore: 9,
    sedationIndex: 9,
    medications: [
      {
        id: 'med-301',
        name: 'Oxybutynin Chloride',
        genericName: 'Oxybutynin',
        dosage: '5 mg',
        route: 'Oral',
        frequency: 'Three times daily',
        timingSlot: 'morning',
        prescriber: 'Dr. Katherine Wells (Urology)',
        indication: 'Overactive bladder',
        dateStarted: '2024-03-10',
        category: 'Antimuscarinic / Anticholinergic',
        pillColor: '#93c5fd',
        pillShape: 'round',
        pillVisualDescription: 'Light blue round tablet',
        withFood: 'anytime',
        acbScore: 3,
        fallSedationScore: 2,
        beersCriteriaFlag: true,
        beersRationale: 'Strongly anticholinergic. Crosses blood-brain barrier causing cognitive acceleration, hallucination, memory decline, and constipation in MCI patients.',
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Bladder Control Pill (Oxybutynin)',
        patientWhy: 'Reduces sudden bladder spasms and urgency.',
        patientSpecialNotice: '⚠️ High impact on memory and concentration. Report severe dry mouth or disorientation.'
      },
      {
        id: 'med-302',
        name: 'Zolpidem Tartrate',
        genericName: 'Zolpidem',
        dosage: '10 mg',
        route: 'Oral',
        frequency: 'Once at bedtime',
        timingSlot: 'bedtime',
        prescriber: 'Dr. James Sullivan',
        indication: 'Sleep maintenance insomnia',
        dateStarted: '2023-09-15',
        category: 'Non-benzodiazepine GABA-A Agonist (Z-Drug)',
        pillColor: '#f43f5e',
        pillShape: 'oval',
        pillVisualDescription: 'Pink oval film-coated tablet',
        withFood: 'empty_stomach',
        acbScore: 0,
        fallSedationScore: 3,
        beersCriteriaFlag: true,
        beersRationale: 'Beers Criteria: Strongly avoid in older adults. Quadruples nocturnal fall & hip fracture hazard; causes sleepwalking and daytime ataxia.',
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Sleep Medication (Ambien)',
        patientWhy: 'Taken right before getting into bed to induce sleep.',
        patientSpecialNotice: '⚠️ DO NOT get out of bed without assistance after taking this medication.'
      },
      {
        id: 'med-303',
        name: 'Gabapentin',
        genericName: 'Gabapentin',
        dosage: '300 mg',
        route: 'Oral',
        frequency: 'Three times daily',
        timingSlot: 'evening',
        prescriber: 'Dr. James Sullivan',
        indication: 'Neuropathic shingles pain',
        dateStarted: '2024-11-20',
        category: 'Gabapentinoid / Anticonvulsant',
        pillColor: '#fed7aa',
        pillShape: 'capsule',
        pillVisualDescription: 'Yellow/orange capsule (marked "300")',
        withFood: 'anytime',
        acbScore: 0,
        fallSedationScore: 3,
        beersCriteriaFlag: true,
        beersRationale: 'Severe synergistic sedation with Zolpidem and Clonazepam. Causes gait instability and peripheral edema.',
        renalAdjustmentNeeded: true,
        renalNote: 'Requires clearance adjustment.',
        isActive: true,
        patientPlainName: 'Nerve Pain Capsule (Gabapentin)',
        patientWhy: 'Soothes shooting nerve pain from previous shingles.',
        patientSpecialNotice: 'Causes significant drowsiness. Hold handrails on stairs.'
      },
      {
        id: 'med-304',
        name: 'Clonazepam',
        genericName: 'Clonazepam',
        dosage: '0.5 mg',
        route: 'Oral',
        frequency: 'Once daily at bedtime PRN anxiety',
        timingSlot: 'bedtime',
        prescriber: 'Dr. James Sullivan',
        indication: 'Anxiety and restless legs',
        dateStarted: '2022-07-10',
        category: 'Long-acting Benzodiazepine',
        pillColor: '#e0e7ff',
        pillShape: 'round',
        pillVisualDescription: 'Orange-pink round scored tablet',
        withFood: 'anytime',
        acbScore: 0,
        fallSedationScore: 3,
        beersCriteriaFlag: true,
        beersRationale: 'Beers Criteria: Avoid benzodiazepines in older adults. Pronounced prolongation of half-life (>40 hrs); leads to daytime cognitive slowing and motor incoordination.',
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Calming & Restless Leg Pill (Klonopin)',
        patientWhy: 'Calms nighttime muscle restlessness and anxious thoughts.',
        patientSpecialNotice: '⚠️ High danger of falls when combined with Ambien. Must be tapered carefully.'
      }
    ],
    interactions: [
      {
        id: 'ddi-301',
        drug1: 'Zolpidem Tartrate',
        drug2: 'Clonazepam',
        severity: 'HIGH',
        mechanism: 'Profound additive GABAergic Central Nervous System depression.',
        clinicalConsequence: 'Severe risk of respiratory depression, coma, profound morning ataxia, and catastrophic hip fracture.',
        recommendation: 'Taper and eliminate Zolpidem; plan gradual slow taper for Clonazepam.',
        evidenceSource: 'FDA Black Box Warning on Combined Sedatives & AGS Beers 2023',
        isActive: true
      },
      {
        id: 'ddi-302',
        drug1: 'Oxybutynin Chloride',
        drug2: 'Mild Cognitive Impairment (Disease-Drug)',
        severity: 'HIGH',
        mechanism: 'Centrally-active antimuscarinic blockade in the cholinergic hippocampus.',
        clinicalConsequence: 'Direct acceleration of memory loss, delirium episodes, and functional dependence.',
        recommendation: 'Discontinue Oxybutynin immediately. Transition to beta-3 adrenergic agonist (Mirabegron) which does not cross blood-brain barrier.',
        evidenceSource: 'American Urological Association (AUA) & Geriatric Society Guidelines',
        isActive: true
      }
    ],
    cascades: [],
    recommendations: [
      {
        id: 'rec-301',
        drugId: 'med-301',
        drugName: 'Oxybutynin Chloride',
        action: 'SUBSTITUTE',
        priority: 'URGENT',
        clinicalRationale: 'Highest cognitive burden drug. Switching to Mirabegron 25mg eliminates central anticholinergic toxicity while preserving bladder control.',
        expectedScoreImprovement: 24,
        evidenceCitation: 'Lancet Healthy Longevity: Cognitive Deprescribing in Dementia',
        monitoringPlan: 'Monitor blood pressure weekly after starting Mirabegron.',
        suggestedAlternative: 'Mirabegron 25 mg daily (Beta-3 agonist without central anticholinergic effects)'
      },
      {
        id: 'rec-302',
        drugId: 'med-302',
        drugName: 'Zolpidem Tartrate',
        action: 'DISCONTINUE',
        priority: 'URGENT',
        clinicalRationale: 'Patient has had 2 prior falls with hip trauma. 10mg Zolpidem represents extreme fall hazard.',
        expectedScoreImprovement: 22,
        evidenceCitation: 'CDC STEADI Fall Prevention Guidelines & Beers 2023',
        monitoringPlan: 'Taper to 5mg for 4 nights, then discontinue. Introduce sleep hygiene.',
        suggestedAlternative: 'CBT for Insomnia + environmental night lights'
      }
    ]
  },
  {
    id: 'pat-4',
    mrn: 'MG-41203',
    name: 'Arthur Pendelton',
    age: 61,
    gender: 'Male',
    dob: '1965-04-18',
    weightKg: 78.0,
    heightCm: 178,
    bloodPressure: '122/76 mmHg',
    heartRate: 64,
    eGFR: 88,
    creatinine: 0.9,
    potassium: 4.2,
    allergies: ['No Known Drug Allergies (NKDA)'],
    diagnoses: [
      'Well-Controlled Essential Hypertension',
      'Mild Hyperlipidemia'
    ],
    primaryDoctor: 'Dr. Marcus Webb, MD',
    lastReviewDate: '2026-07-15',
    caregiverName: 'Self-managing',
    polypharmacyScore: 22,
    riskLevel: 'LOW',
    totalAcbScore: 0,
    fallRiskScore: 1,
    sedationIndex: 0,
    medications: [
      {
        id: 'med-401',
        name: 'Losartan Potassium',
        genericName: 'Losartan',
        dosage: '50 mg',
        route: 'Oral',
        frequency: 'Once daily in morning',
        timingSlot: 'morning',
        prescriber: 'Dr. Marcus Webb',
        indication: 'Hypertension',
        dateStarted: '2021-02-14',
        category: 'Angiotensin II Receptor Blocker (ARB)',
        pillColor: '#ffffff',
        pillShape: 'oval',
        pillVisualDescription: 'White oval tablet (marked "93 7365")',
        withFood: 'anytime',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Blood Pressure Tablet (Losartan)',
        patientWhy: 'Maintains optimal blood pressure protecting your heart and arteries.',
        patientSpecialNotice: 'Take once daily in the morning.'
      },
      {
        id: 'med-402',
        name: 'Atorvastatin Calcium',
        genericName: 'Atorvastatin',
        dosage: '20 mg',
        route: 'Oral',
        frequency: 'Once daily at bedtime',
        timingSlot: 'bedtime',
        prescriber: 'Dr. Marcus Webb',
        indication: 'Primary cardiovascular prevention',
        dateStarted: '2022-09-08',
        category: 'Statin',
        pillColor: '#f1f5f9',
        pillShape: 'round',
        pillVisualDescription: 'Small white round tablet',
        withFood: 'anytime',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Cholesterol Shield (Atorvastatin)',
        patientWhy: 'Protects blood vessels from cholesterol plaque buildup.',
        patientSpecialNotice: 'Take at bedtime.'
      }
    ],
    lastConsultation: '22 Sep 2026',
    interactions: [],
    cascades: [],
    recommendations: []
  },
  {
    id: 'pat-5',
    mrn: 'MG-88102',
    name: 'Raj Kumar',
    age: 71,
    gender: 'Male',
    dob: '1955-08-14',
    weightKg: 82.0,
    heightCm: 174,
    bloodPressure: '148/92 mmHg',
    heartRate: 78,
    eGFR: 41,
    creatinine: 1.7,
    potassium: 5.4,
    inr: 4.2, // Supratherapeutic critical
    allergies: ['Penicillin (Anaphylaxis)', 'Codeine (Nausea)'],
    diagnoses: [
      'Heart Failure with Preserved Ejection Fraction (HFpEF)',
      'Essential Hypertension',
      'Chronic Gouty Arthritis',
      'Atrial Fibrillation (Paroxysmal)'
    ],
    primaryDoctor: 'Dr. Sharma, MD',
    lastReviewDate: '2026-09-26',
    lastConsultation: 'Today, 10:15 AM',
    caregiverName: 'Anil Kumar (Son)',
    caregiverPhone: '(555) 890-4122',
    polypharmacyScore: 88,
    riskLevel: 'HIGH',
    totalAcbScore: 2,
    fallRiskScore: 7,
    sedationIndex: 6,
    medications: [
      {
        id: 'med-501',
        name: 'Warfarin Sodium',
        genericName: 'Warfarin',
        dosage: '5 mg',
        route: 'Oral',
        frequency: 'Daily evening',
        timingSlot: 'evening',
        prescriber: 'Dr. Sharma',
        indication: 'Stroke prophylaxis in AFib',
        dateStarted: '2023-01-10',
        category: 'Anticoagulant',
        pillColor: '#f87171',
        pillShape: 'round',
        pillVisualDescription: 'Peach round scored tablet',
        withFood: 'anytime',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Blood Thinner (Warfarin)',
        patientWhy: 'Protects from stroke and dangerous blood clots.',
        patientSpecialNotice: '⚠️ STAT ALERT: INR is 4.2. Stop taking until clinic review.'
      },
      {
        id: 'med-502',
        name: 'Fluconazole',
        genericName: 'Fluconazole',
        dosage: '200 mg',
        route: 'Oral',
        frequency: 'Once daily (Acute)',
        timingSlot: 'morning',
        prescriber: 'Urgent Care Walk-In',
        indication: 'Systemic fungal infection',
        dateStarted: '2026-09-25',
        category: 'CYP2C9 Inhibitor / Antifungal',
        pillColor: '#c084fc',
        pillShape: 'oval',
        pillVisualDescription: 'Purple oval tablet',
        withFood: 'with_food',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: true,
        renalNote: 'Dose reduction needed for eGFR 41.',
        isActive: true,
        patientPlainName: 'Antifungal Medicine',
        patientWhy: 'Treats acute fungal infection.',
        patientSpecialNotice: 'CRITICAL INTERACTION with Warfarin.'
      },
      {
        id: 'med-503',
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        dosage: '20 mg',
        route: 'Oral',
        frequency: 'Once daily morning',
        timingSlot: 'morning',
        prescriber: 'Dr. Sharma',
        indication: 'Hypertension & Heart Failure',
        dateStarted: '2020-05-12',
        category: 'ACE Inhibitor',
        pillColor: '#facc15',
        pillShape: 'round',
        pillVisualDescription: 'Yellow round tablet',
        withFood: 'with_food',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: true,
        isActive: true,
        patientPlainName: 'Blood Pressure Tablet',
        patientWhy: 'Keeps heart and kidney pressure stable.'
      },
      {
        id: 'med-504',
        name: 'Spironolactone',
        genericName: 'Spironolactone',
        dosage: '25 mg',
        route: 'Oral',
        frequency: 'Once daily morning',
        timingSlot: 'morning',
        prescriber: 'Dr. Sharma',
        indication: 'Heart Failure fluid balance',
        dateStarted: '2024-04-10',
        category: 'Aldosterone Antagonist',
        pillColor: '#ffffff',
        pillShape: 'oval',
        pillVisualDescription: 'White oval tablet',
        withFood: 'with_food',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: true,
        isActive: true,
        patientPlainName: 'Potassium Sparing Water Pill',
        patientWhy: 'Protects heart muscle from extra fluid.'
      }
    ],
    interactions: [
      {
        id: 'ddi-501',
        drug1: 'Warfarin Sodium',
        drug2: 'Fluconazole',
        severity: 'HIGH',
        mechanism: 'Potent competitive inhibition of CYP2C9 metabolic pathway for S-warfarin.',
        clinicalConsequence: 'Supratherapeutic INR (4.2). Imminent catastrophic hemorrhage hazard.',
        recommendation: 'Discontinue oral Fluconazole immediately. Substitute with topical Nystatin oral suspension. STAT repeat INR in 24 hours.',
        evidenceSource: 'FDA Black Box & CHEST Antithrombotic Guidelines 2022',
        isActive: true
      }
    ],
    cascades: [],
    recommendations: [
      {
        id: 'rec-501',
        drugId: 'med-502',
        drugName: 'Fluconazole',
        action: 'SUBSTITUTE',
        priority: 'URGENT',
        clinicalRationale: 'Eliminate CYP2C9 blockade causing INR spike to 4.2 in patient taking Warfarin.',
        expectedScoreImprovement: 26,
        evidenceCitation: 'CHEST 2022 Guidelines',
        monitoringPlan: 'Repeat STAT INR telemetry tomorrow; hold next Warfarin dose.',
        suggestedAlternative: 'Nystatin Oral Suspension 100,000 U/mL (Swish & Swallow)'
      }
    ]
  },
  {
    id: 'pat-6',
    mrn: 'MG-62140',
    name: 'Sunita Patel',
    age: 66,
    gender: 'Female',
    dob: '1960-02-28',
    weightKg: 65.0,
    heightCm: 162,
    bloodPressure: '134/80 mmHg',
    heartRate: 70,
    eGFR: 64,
    creatinine: 1.0,
    potassium: 4.3,
    allergies: ['Sulfa Drugs (Rash)'],
    diagnoses: [
      'Adult-Onset Asthma',
      'Gastroesophageal Reflux Disease (GERD)',
      'Knee Osteoarthritis',
      'Chronic Sleep Maintenance Insomnia'
    ],
    primaryDoctor: 'Dr. Sharma, MD',
    lastReviewDate: '2026-09-25',
    lastConsultation: 'Yesterday, 04:30 PM',
    caregiverName: 'Pooja Patel (Daughter)',
    caregiverPhone: '(555) 723-9011',
    polypharmacyScore: 62,
    riskLevel: 'MODERATE',
    totalAcbScore: 3,
    fallRiskScore: 6,
    sedationIndex: 7,
    medications: [
      {
        id: 'med-601',
        name: 'Diphenhydramine HCl',
        genericName: 'Diphenhydramine',
        dosage: '50 mg',
        route: 'Oral',
        frequency: 'Nightly at bedtime (OTC Sominex)',
        timingSlot: 'bedtime',
        prescriber: 'Self-prescribed OTC',
        indication: 'Chronic insomnia',
        dateStarted: '2025-06-15',
        category: 'First-Gen Antihistamine',
        pillColor: '#f472b6',
        pillShape: 'capsule',
        pillVisualDescription: 'Pink/blue capsule',
        withFood: 'anytime',
        acbScore: 3,
        fallSedationScore: 3,
        beersCriteriaFlag: true,
        beersRationale: 'AGS Beers Criteria 2023: Strongly avoid in older adults. Highly anticholinergic; pronounced fall risk and morning ataxia.',
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Nighttime Sleep Aid (OTC)',
        patientWhy: 'Taken to fall asleep.'
      },
      {
        id: 'med-602',
        name: 'Tramadol HCl',
        genericName: 'Tramadol',
        dosage: '50 mg',
        route: 'Oral',
        frequency: 'Twice daily PRN knee pain',
        timingSlot: 'noon',
        prescriber: 'Dr. Thorne (Orthopedics)',
        indication: 'Osteoarthritis joint pain',
        dateStarted: '2024-10-01',
        category: 'Opioid Analgesic',
        pillColor: '#ffffff',
        pillShape: 'round',
        pillVisualDescription: 'White round tablet',
        withFood: 'with_food',
        acbScore: 1,
        fallSedationScore: 3,
        beersCriteriaFlag: true,
        beersRationale: 'Synergistic CNS sedation with Diphenhydramine; severe nocturnal fall risk.',
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Pain Pill (Tramadol)',
        patientWhy: 'Pain relief for knee osteoarthritis.'
      }
    ],
    interactions: [
      {
        id: 'ddi-601',
        drug1: 'Diphenhydramine HCl',
        drug2: 'Tramadol HCl',
        severity: 'MODERATE',
        mechanism: 'Additive central nervous system depression and anticholinergic synergism.',
        clinicalConsequence: 'Daytime grogginess, impaired balance, elevated fall and motor vehicle accident hazard.',
        recommendation: 'Deprescribe Diphenhydramine. Transition to non-pharmacologic sleep hygiene or Melatonin 1mg.',
        evidenceSource: 'AGS Beers Criteria 2023 & STOPP/START v3',
        isActive: true
      }
    ],
    cascades: [],
    recommendations: [
      {
        id: 'rec-601',
        drugId: 'med-601',
        drugName: 'Diphenhydramine HCl',
        action: 'DISCONTINUE',
        priority: 'HIGH',
        clinicalRationale: 'Highest anticholinergic and sedative burden drug on Beers 2023 list for older adults.',
        expectedScoreImprovement: 18,
        evidenceCitation: 'AGS Beers Criteria 2023',
        monitoringPlan: 'Evaluate sleep patterns in 7 days; implement sleep hygiene protocol.',
        suggestedAlternative: 'Melatonin 1 mg QHS'
      }
    ]
  },
  {
    id: 'pat-7',
    mrn: 'MG-31904',
    name: 'David Miller',
    age: 58,
    gender: 'Male',
    dob: '1968-04-12',
    weightKg: 76.0,
    heightCm: 175,
    bloodPressure: '124/78 mmHg',
    heartRate: 66,
    eGFR: 84,
    creatinine: 0.9,
    potassium: 4.1,
    allergies: ['No Known Drug Allergies (NKDA)'],
    diagnoses: ['Essential Hypertension (Controlled)', 'Pre-diabetes'],
    primaryDoctor: 'Dr. Sharma, MD',
    lastReviewDate: '2026-07-20',
    lastConsultation: '19 Sep 2026',
    caregiverName: 'Self-managing',
    polypharmacyScore: 20,
    riskLevel: 'LOW',
    totalAcbScore: 0,
    fallRiskScore: 0,
    sedationIndex: 0,
    medications: [
      {
        id: 'med-701',
        name: 'Amlodipine Besylate',
        genericName: 'Amlodipine',
        dosage: '5 mg',
        route: 'Oral',
        frequency: 'Once daily morning',
        timingSlot: 'morning',
        prescriber: 'Dr. Sharma',
        indication: 'Hypertension',
        dateStarted: '2022-03-10',
        category: 'Calcium Channel Blocker',
        pillColor: '#ffffff',
        pillShape: 'round',
        pillVisualDescription: 'White round tablet',
        withFood: 'anytime',
        acbScore: 0,
        fallSedationScore: 0,
        beersCriteriaFlag: false,
        renalAdjustmentNeeded: false,
        isActive: true,
        patientPlainName: 'Blood Pressure Pill',
        patientWhy: 'Controls blood pressure.'
      }
    ],
    interactions: [],
    cascades: [],
    recommendations: []
  }
];

// Helper database of common candidate drugs for the "What-If" simulator
export interface SimulatorCandidateDrug {
  id: string;
  name: string;
  category: string;
  defaultDose: string;
  addedAcb: number;
  addedFallRisk: number;
  renalHazardForEgfrUnder50: boolean;
  typicalInteractions: {
    withDrug: string;
    severity: 'HIGH' | 'MODERATE' | 'LOW';
    mechanism: string;
  }[];
}

export const SIMULATOR_CANDIDATE_DRUGS: SimulatorCandidateDrug[] = [
  {
    id: 'sim-1',
    name: 'Ibuprofen (Advil/Motrin 400mg)',
    category: 'NSAID',
    defaultDose: '400 mg TID',
    addedAcb: 0,
    addedFallRisk: 1,
    renalHazardForEgfrUnder50: true,
    typicalInteractions: [
      {
        withDrug: 'Warfarin Sodium',
        severity: 'HIGH',
        mechanism: 'Platelet inhibition + gastrointestinal mucosal ulceration dramatically escalates GI bleed risk.'
      },
      {
        withDrug: 'Lisinopril',
        severity: 'HIGH',
        mechanism: 'Triple whammy nephrotoxicity: Afferent vasoconstriction + efferent vasodilation -> Acute Kidney Injury.'
      },
      {
        withDrug: 'Spironolactone',
        severity: 'HIGH',
        mechanism: 'Hyperkalemia synergy and blunted diuretic effect.'
      }
    ]
  },
  {
    id: 'sim-2',
    name: 'Ciprofloxacin (Cipro 500mg)',
    category: 'Fluoroquinolone Antibiotic',
    defaultDose: '500 mg BID',
    addedAcb: 0,
    addedFallRisk: 1,
    renalHazardForEgfrUnder50: true,
    typicalInteractions: [
      {
        withDrug: 'Warfarin Sodium',
        severity: 'HIGH',
        mechanism: 'Inhibits CYP1A2 and alters gut flora synthesis of Vitamin K, leading to severe INR prolongation.'
      }
    ]
  },
  {
    id: 'sim-3',
    name: 'Hydroxyzine (Atarax 25mg)',
    category: '1st-Gen Antihistamine',
    defaultDose: '25 mg QHS',
    addedAcb: 3,
    addedFallRisk: 3,
    renalHazardForEgfrUnder50: false,
    typicalInteractions: [
      {
        withDrug: 'Tramadol HCl',
        severity: 'HIGH',
        mechanism: 'Additive CNS sedation, respiratory depression, and seizure threshold reduction.'
      }
    ]
  },
  {
    id: 'sim-4',
    name: 'Acetaminophen (Tylenol 500mg)',
    category: 'Analgesic / Antipyretic',
    defaultDose: '500 mg q6h PRN',
    addedAcb: 0,
    addedFallRisk: 0,
    renalHazardForEgfrUnder50: false,
    typicalInteractions: []
  },
  {
    id: 'sim-5',
    name: 'Melatonin (1mg)',
    category: 'Sleep Aid Supplement',
    defaultDose: '1 mg QHS',
    addedAcb: 0,
    addedFallRisk: 0,
    renalHazardForEgfrUnder50: false,
    typicalInteractions: []
  }
];

export interface RecentAlertItem {
  id: string;
  severity: 'HIGH' | 'MODERATE' | 'LOW';
  title: string;
  patientName: string;
  patientMrn: string;
  patientAge: number;
  statusText: string;
  description: string;
  recommendedAction: string;
  timestamp: string;
  category: 'Interaction' | 'Beers Criteria' | 'Cascade' | 'Stable';
  isRead?: boolean;
}

export const RECENT_ALERTS: RecentAlertItem[] = [
  {
    id: 'alert-1',
    severity: 'HIGH',
    title: 'Potential interaction detected',
    patientName: 'Raj Kumar',
    patientMrn: 'MG-88102',
    patientAge: 71,
    statusText: 'Review required',
    description: 'Fluconazole potent CYP2C9 inhibition co-administered with Warfarin. INR has elevated to 4.2 with severe bleeding risk.',
    recommendedAction: 'Discontinue oral Fluconazole; substitute with topical Nystatin oral suspension. Schedule STAT INR telemetry.',
    timestamp: '12m ago',
    category: 'Interaction',
    isRead: false,
  },
  {
    id: 'alert-2',
    severity: 'MODERATE',
    title: 'Age-related medication risk',
    patientName: 'Sunita Patel',
    patientMrn: 'MG-62140',
    patientAge: 66,
    statusText: 'Beers Criteria Flag',
    description: 'Diphenhydramine (first-generation antihistamine) combined with Tramadol exhibits cumulative sedative index of 7/10 and high fall hazard.',
    recommendedAction: 'Taper Diphenhydramine; recommend non-pharmacological sleep hygiene or low-dose Melatonin (1mg).',
    timestamp: '1h ago',
    category: 'Beers Criteria',
    isRead: false,
  },
  {
    id: 'alert-3',
    severity: 'LOW',
    title: 'No significant interaction',
    patientName: 'Arthur Pendelton',
    patientMrn: 'MG-41203',
    patientAge: 61,
    statusText: 'Regimen stable',
    description: 'Biannual review of Losartan 50mg and Atorvastatin 20mg confirmed stable renal clearance (eGFR 88) and zero metabolic collisions.',
    recommendedAction: 'Continue current regimen; schedule next routine follow-up in 6 months.',
    timestamp: '3h ago',
    category: 'Stable',
    isRead: true,
  },
];

