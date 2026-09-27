export type TimelineEventType =
  | 'added'
  | 'changed'
  | 'discontinued'
  | 'risk_detected'
  | 'updated';

export interface MedicationTimelineEvent {
  id: string;
  type: TimelineEventType;
  date: string;
  relativeTime: string;
  title: string;
  description: string;
  medicationName: string;
  dosage?: string;
  prescriber: string;
  severity?: 'HIGH' | 'MODERATE' | 'LOW' | 'INFO';
  badgeText: string;
}

export const PATIENT_TIMELINES: Record<string, MedicationTimelineEvent[]> = {
  'pat-1': [
    {
      id: 'evt-1',
      type: 'risk_detected',
      date: '2026-09-24',
      relativeTime: '2 days ago',
      title: 'High-Risk Polypharmacy Collision Detected',
      description: 'AI engine detected dual Hyperkalemia hazard (Lisinopril + Spironolactone) compounded by eGFR 34 mL/min and NSAID co-prescription.',
      medicationName: 'Lisinopril + Spironolactone',
      prescriber: 'MediQX AI Engine',
      severity: 'HIGH',
      badgeText: 'Risk Detected',
    },
    {
      id: 'evt-2',
      type: 'added',
      date: '2026-09-15',
      relativeTime: '11 days ago',
      title: 'Medication Added: Zolpidem Tartrate',
      description: 'Initiated 5 mg PO at bedtime for severe chronic insomnia secondary to osteoarthritis discomfort.',
      medicationName: 'Zolpidem',
      dosage: '5 mg Bedtime',
      prescriber: 'Dr. Sarah Al-Mansoor',
      severity: 'MODERATE',
      badgeText: 'Medication Added',
    },
    {
      id: 'evt-3',
      type: 'changed',
      date: '2026-08-10',
      relativeTime: '6 weeks ago',
      title: 'Dose Titrated: Lisinopril',
      description: 'Dose increased from 10 mg daily to 20 mg daily due to suboptimal systolic BP control (148/92 mmHg).',
      medicationName: 'Lisinopril',
      dosage: '20 mg Once Daily (was 10 mg)',
      prescriber: 'Dr. Sharma, MD',
      severity: 'INFO',
      badgeText: 'Medication Changed',
    },
    {
      id: 'evt-4',
      type: 'updated',
      date: '2026-07-22',
      relativeTime: '2 months ago',
      title: 'Prescription Updated: Warfarin Sodium',
      description: 'Target INR adjusted to 2.0–3.0. Maintenance dose re-calibrated to 4 mg PO daily at 6:00 PM.',
      medicationName: 'Warfarin Sodium',
      dosage: '4 mg Daily',
      prescriber: 'Dr. Sarah Al-Mansoor',
      severity: 'LOW',
      badgeText: 'Prescription Updated',
    },
    {
      id: 'evt-5',
      type: 'discontinued',
      date: '2026-06-04',
      relativeTime: '3 months ago',
      title: 'Medication Discontinued: Amitriptyline',
      description: 'Discontinued due to AGS Beers Criteria anticholinergic toxicity, daytime orthostasis, and dry mouth.',
      medicationName: 'Amitriptyline',
      dosage: '25 mg Bedtime',
      prescriber: 'Dr. Sharma, MD',
      severity: 'LOW',
      badgeText: 'Medication Discontinued',
    },
  ],
  'pat-2': [
    {
      id: 'evt-201',
      type: 'risk_detected',
      date: '2026-09-22',
      relativeTime: '4 days ago',
      title: 'Anticholinergic Overload (ACB Score 5)',
      description: 'Concurrent Diphenhydramine and Oxybutynin creating extreme delirium and memory deficit probability.',
      medicationName: 'Diphenhydramine + Oxybutynin',
      prescriber: 'MediQX AI Engine',
      severity: 'HIGH',
      badgeText: 'Risk Detected',
    },
    {
      id: 'evt-202',
      type: 'added',
      date: '2026-09-01',
      relativeTime: '3 weeks ago',
      title: 'Medication Added: Oxybutynin Chloride',
      description: 'Prescribed for urge urinary incontinence symptoms.',
      medicationName: 'Oxybutynin',
      dosage: '5 mg BID',
      prescriber: 'Dr. Lisa Chen',
      severity: 'MODERATE',
      badgeText: 'Medication Added',
    },
    {
      id: 'evt-203',
      type: 'changed',
      date: '2026-08-14',
      relativeTime: '1 month ago',
      title: 'Dosage Reduced: Gabapentin',
      description: 'Step-down titration from 300 mg TID to 100 mg TID for peripheral diabetic neuropathy.',
      medicationName: 'Gabapentin',
      dosage: '100 mg TID',
      prescriber: 'Dr. Sharma, MD',
      severity: 'INFO',
      badgeText: 'Medication Changed',
    },
  ],
  'pat-4': [
    {
      id: 'evt-401',
      type: 'risk_detected',
      date: '2026-09-26',
      relativeTime: '12m ago',
      title: 'Critical CYP2C9 Hemorrhage Collision',
      description: 'Fluconazole potently inhibits CYP2C9 metabolic breakdown of Warfarin, causing INR spike to 4.2.',
      medicationName: 'Warfarin + Fluconazole',
      prescriber: 'MediQX Engine',
      severity: 'HIGH',
      badgeText: 'Risk Detected',
    },
    {
      id: 'evt-402',
      type: 'added',
      date: '2026-09-25',
      relativeTime: 'Yesterday',
      title: 'Medication Added: Fluconazole',
      description: 'Initiated 150 mg PO single dose for fungal candidiasis.',
      medicationName: 'Fluconazole',
      dosage: '150 mg PO',
      prescriber: 'Urgent Care Center',
      severity: 'HIGH',
      badgeText: 'Medication Added',
    },
  ],
};

export function getPatientTimeline(patientId: string): MedicationTimelineEvent[] {
  if (PATIENT_TIMELINES[patientId]) {
    return PATIENT_TIMELINES[patientId];
  }
  // Fallback realistic timeline for any patient
  return [
    {
      id: `evt-${patientId}-1`,
      type: 'risk_detected',
      date: '2026-09-20',
      relativeTime: '6 days ago',
      title: 'Baseline Polypharmacy Risk Assessed',
      description: 'Annual clinical review identified regimen optimization opportunities.',
      medicationName: 'Multiple Agents',
      prescriber: 'MediQX AI Engine',
      severity: 'LOW',
      badgeText: 'Risk Detected',
    },
    {
      id: `evt-${patientId}-2`,
      type: 'updated',
      date: '2026-08-15',
      relativeTime: '1 month ago',
      title: 'Prescription Refilled & Verified',
      description: 'Refill authorized for standard maintenance medication regimen.',
      medicationName: 'Maintenance Therapy',
      prescriber: 'Dr. Sharma, MD',
      severity: 'INFO',
      badgeText: 'Prescription Updated',
    },
    {
      id: `evt-${patientId}-3`,
      type: 'added',
      date: '2026-06-10',
      relativeTime: '3 months ago',
      title: 'Medication Added',
      description: 'Initiated therapeutic agent under standard protocol.',
      medicationName: 'Therapeutic Agent',
      prescriber: 'Dr. Sharma, MD',
      severity: 'INFO',
      badgeText: 'Medication Added',
    },
  ];
}
