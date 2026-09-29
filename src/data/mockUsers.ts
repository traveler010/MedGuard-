// MedGuard Mock Users Data
import { User } from '@/types';

export const MOCK_USERS: User[] = [
  {
    id: 'user-doc-1',
    name: 'Dr. Priya Sharma, MD',
    email: 'sharma.md@medguard-health.org',
    role: 'DOCTOR',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
    specialty: 'Internal Medicine & Geriatric Pharmacotherapy',
    licenseNumber: 'MD-849201-NY',
    clinicName: 'MedGuard Comprehensive Geriatric Clinic',
    phone: '+1 (555) 234-8900',
  },
  {
    id: 'user-pat-1',
    name: 'Raj Kumar',
    email: 'raj.kumar@email.com',
    role: 'PATIENT',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    phone: '+1 (555) 839-2041',
  },
  {
    id: 'user-care-1',
    name: 'Sunita Kumar',
    email: 'sunita.k@email.com',
    role: 'CAREGIVER',
    phone: '+1 (555) 839-2042',
  },
];

export const CURRENT_DOCTOR: User = MOCK_USERS[0];
export const CURRENT_PATIENT: User = MOCK_USERS[1];
