'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/Toast';
import {
  X,
  UserPlus,
  User,
  Heart,
  Pill,
  ShieldAlert,
  Activity,
  Phone,
  Mail,
  AlertCircle,
  FileText,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  addDoctorPatient,
  AddDoctorPatientPayload,
} from '@/services/patientService';
import { DoctorPatientDirectoryItem } from '@/data/mockDoctorPortal';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientAdded?: (patient: DoctorPatientDirectoryItem) => void;
}

export function AddPatientModal({
  isOpen,
  onClose,
  onPatientAdded,
}: AddPatientModalProps) {
  const { showToast } = useToast();

  const generateDefaultId = () => `pat-${Math.floor(100 + Math.random() * 900)}`;

  const [formData, setFormData] = useState({
    name: '',
    medicine_name: '',
    patient_id: generateDefaultId(),
    age: '50',
    gender: 'Male',
    email: '',
    phone: '',
    blood_group: 'O+',
    primary_condition: '',
    medical_history: '',
    current_medications: '',
    allergies: '',
    emergency_contact: '',
    risk_level: 'LOW' as 'LOW' | 'MODERATE' | 'HIGH',
    blood_pressure: '120/80 mmHg',
    heart_rate: '72',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRegenerateId = () => {
    setFormData((prev) => ({
      ...prev,
      patient_id: generateDefaultId(),
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Patient name cannot be empty.';
    }

    const med = formData.medicine_name.trim() || formData.current_medications.trim();
    if (!med) {
      newErrors.medicine_name = 'Medicine name cannot be empty.';
    }

    if (formData.age) {
      const ageNum = Number(formData.age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 130) {
        newErrors.age = 'Please enter a valid age between 0 and 130.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Validation Error', 'Please check required fields: Patient Name and Medicine Name.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const medValue = formData.medicine_name.trim() || formData.current_medications.trim();
      const payload: AddDoctorPatientPayload = {
        name: formData.name.trim(),
        medicine_name: medValue,
        current_medications: medValue,
        patient_id: formData.patient_id.trim() || undefined,
        age: formData.age ? parseInt(formData.age, 10) : 50,
        gender: formData.gender || 'Male',
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        blood_group: formData.blood_group,
        primary_condition: formData.primary_condition.trim() || 'General Clinical Care',
        medical_history: formData.medical_history.trim() || undefined,
        allergies: formData.allergies.trim() || undefined,
        emergency_contact: formData.emergency_contact.trim() || undefined,
        risk_level: formData.risk_level,
        blood_pressure: formData.blood_pressure.trim() || undefined,
        heart_rate: formData.heart_rate.trim() || undefined,
      };

      const newPatient = await addDoctorPatient(payload);

      showToast(
        'Patient Added Successfully',
        `${newPatient.name} and medicine (${medValue}) have been saved to MedGuard.`,
        'success'
      );

      if (onPatientAdded) {
        onPatientAdded(newPatient);
      }

      // Reset form and close
      setFormData({
        name: '',
        medicine_name: '',
        patient_id: generateDefaultId(),
        age: '50',
        gender: 'Male',
        email: '',
        phone: '',
        blood_group: 'O+',
        primary_condition: '',
        medical_history: '',
        current_medications: '',
        allergies: '',
        emergency_contact: '',
        risk_level: 'LOW',
        blood_pressure: '120/80 mmHg',
        heart_rate: '72',
      });
      setErrors({});
      onClose();
    } catch (err: any) {
      console.error('Failed to add patient:', err);
      showToast(
        'Failed to Save Patient',
        err.message || 'Failed to save patient. Please check input values.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="add-patient-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        id="add-patient-modal-container"
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full my-auto overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
      >
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-6 border-b border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  Doctor Intake
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Clinical Registry
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Add New Patient
              </h2>
            </div>
          </div>

          <button
            type="button"
            id="close-add-patient-modal-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY / FORM */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs sm:text-sm">
          {/* SECTION 1: PRIMARY DEMOGRAPHICS */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              <span>Patient & Prescription Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Patient Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="patient-name-input"
                  required
                  placeholder="e.g., Rajesh Khanna, Smt. Sunita Rao"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 transition text-xs sm:text-sm ${
                    errors.name
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:ring-teal-500/20'
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Medicine Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Medicine Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="patient-medicine-input"
                  required
                  placeholder="e.g., Metformin 500mg, Lisinopril, Paracetamol"
                  value={formData.medicine_name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      medicine_name: e.target.value,
                      current_medications: e.target.value,
                    });
                    if (errors.medicine_name) setErrors({ ...errors, medicine_name: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 transition text-xs sm:text-sm ${
                    errors.medicine_name
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:ring-teal-500/20'
                  }`}
                />
                {errors.medicine_name && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.medicine_name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">

              {/* Patient ID / MRN */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Patient ID / MRN
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="patient-id-input"
                    value={formData.patient_id}
                    onChange={(e) =>
                      setFormData({ ...formData, patient_id: e.target.value })
                    }
                    placeholder="pat-101"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 font-mono text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                  <button
                    type="button"
                    onClick={handleRegenerateId}
                    title="Generate unique ID"
                    className="absolute right-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 p-1 rounded-lg cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Auto-assigned or enter custom clinical ID.
                </span>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Age (Years) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  id="patient-age-input"
                  min="0"
                  max="130"
                  required
                  placeholder="e.g., 58"
                  value={formData.age}
                  onChange={(e) => {
                    setFormData({ ...formData, age: e.target.value });
                    if (errors.age) setErrors({ ...errors, age: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 transition text-xs sm:text-sm ${
                    errors.age
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:ring-teal-500/20'
                  }`}
                />
                {errors.age && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.age}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  id="patient-gender-select"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Blood Group
                </label>
                <select
                  id="patient-blood-group-select"
                  value={formData.blood_group}
                  onChange={(e) =>
                    setFormData({ ...formData, blood_group: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm cursor-pointer"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: CONTACT & EMERGENCY */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>Contact & Emergency Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="patient-phone-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="patient-email-input"
                  placeholder="patient@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm"
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  id="patient-emergency-contact-input"
                  placeholder="Kin Name & Phone"
                  value={formData.emergency_contact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergency_contact: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: CLINICAL DIAGNOSIS & RISK CLASSIFICATION */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span>Clinical Profile & Risk Status</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Primary Condition */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Condition / Chief Complaint
                </label>
                <input
                  type="text"
                  id="patient-primary-condition-input"
                  placeholder="e.g., Hypertension, Type 2 Diabetes, Atrial Fibrillation"
                  value={formData.primary_condition}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      primary_condition: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm"
                />
              </div>

              {/* Risk Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Clinical Risk Level
                </label>
                <select
                  id="patient-risk-level-select"
                  value={formData.risk_level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      risk_level: e.target.value as 'LOW' | 'MODERATE' | 'HIGH',
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm font-bold cursor-pointer"
                >
                  <option value="LOW">LOW Risk (Stable / Monitored)</option>
                  <option value="MODERATE">MODERATE Risk</option>
                  <option value="HIGH">HIGH Risk (Polypharmacy / Fragile)</option>
                </select>
              </div>
            </div>

            {/* Baseline Vitals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Baseline Blood Pressure
                </label>
                <input
                  type="text"
                  id="patient-bp-input"
                  placeholder="120/80 mmHg"
                  value={formData.blood_pressure}
                  onChange={(e) =>
                    setFormData({ ...formData, blood_pressure: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Resting Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  id="patient-hr-input"
                  placeholder="72"
                  value={formData.heart_rate}
                  onChange={(e) =>
                    setFormData({ ...formData, heart_rate: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: MEDICATIONS & ALLERGIES */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-teal-600" />
              <span>Current Medications & Known Allergies</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Active Medications (Separate by commas or lines)
              </label>
              <textarea
                id="patient-medications-input"
                rows={2}
                placeholder="e.g., Metformin 500mg, Lisinopril 10mg, Atorvastatin 20mg"
                value={formData.medicine_name || formData.current_medications}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    medicine_name: e.target.value,
                    current_medications: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm resize-none"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                These medications will be pre-populated into MedGuard Polypharmacy & Interaction audit engine.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Known Allergies / Contraindications
                </label>
                <input
                  type="text"
                  id="patient-allergies-input"
                  placeholder="e.g., Penicillin, NSAIDs, Sulfa"
                  value={formData.allergies}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Medical History & Comorbidities
                </label>
                <input
                  type="text"
                  id="patient-history-input"
                  placeholder="e.g., Type 2 DM (10y), Post-CABG 2021"
                  value={formData.medical_history}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medical_history: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              id="cancel-add-patient-btn"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="submit-add-patient-btn"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Registering Patient...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Register & Save Patient</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
