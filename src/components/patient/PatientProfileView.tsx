"use client";

import React from "react";
import {
  User,
  Phone,
  Heart,
  Stethoscope,
  Building2,
  ShieldCheck,
  FileText,
  AlertCircle,
} from "lucide-react";

export function PatientProfileView() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-1">
        <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
          Patient & Care Network
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          My Care Profile
        </h2>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Your personal health identification and trusted emergency contacts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Patient Personal Info */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
              RK
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Raj Kumar</h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                68 Years Old • Male • ID: #QX-94108
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 dark:text-slate-500">Date of Birth:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">April 12, 1958</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 dark:text-slate-500">Primary Health Condition:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">Atrial Fibrillation, High BP</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400 dark:text-slate-500">Known Allergies:</span>
              <span className="font-bold text-rose-700 dark:text-rose-400">Penicillin (Skin Rash)</span>
            </div>
          </div>
        </div>

        {/* Authorized Caregiver */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 font-black text-lg flex items-center justify-center shadow-xs">
              DV
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
                Primary Family Caregiver
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">David Kumar</h3>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Son & Authorized Proxy</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <a
              href="tel:5553829014"
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors"
            >
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400" /> (555) 382-9014
              </span>
              <span className="text-teal-700 dark:text-teal-400 text-xs">Call Caregiver</span>
            </a>
          </div>
        </div>

        {/* Primary Doctor */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">Dr. Sharma, MD</h4>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Lead Geriatric Specialist</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Clinic: Memorial Geriatric Health Center • Room 402
          </p>
          <a
            href="tel:5551234567"
            className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-center font-bold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            Call Doctor&apos;s Office: (555) 123-4567
          </a>
        </div>

        {/* Pharmacy Details */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">Memorial Outpatient Pharmacy</h4>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Rx Fulfillment & Home Delivery</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Open Monday - Saturday: 8:00 AM - 8:00 PM
          </p>
          <a
            href="tel:5559876543"
            className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-center font-bold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
          >
            Call Pharmacy: (555) 987-6543
          </a>
        </div>
      </div>
    </div>
  );
}
