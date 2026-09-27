import { redirect } from 'next/navigation';

export default function PatientLoginPage() {
  redirect('/login?role=patient');
}
