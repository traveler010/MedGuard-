'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  X,
  Stethoscope,
  HeartHandshake,
  ArrowRight,
  User,
  KeyRound,
  ExternalLink,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAsDoctor: () => void;
  onLoginAsCaregiver: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onLoginAsDoctor,
  onLoginAsCaregiver,
}: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('sarah.almansoor@medguard.clinic');
  const [password, setPassword] = useState('••••••••••••');

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('medguard_role', 'doctor');
      localStorage.setItem('medguard_token', `mock_token_doctor_${Date.now()}`);
    }
    onClose();
    router.push('/doctor/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Sign In to MedGuard
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Secure HealthTech Portal Access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close login modal"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Quick Demo Role Selector */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
              Instant Demo Access:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('medguard_role', 'doctor');
                      localStorage.setItem('medguard_token', `mock_token_doctor_${Date.now()}`);
                    }
                    onClose();
                    router.push('/doctor/dashboard');
                  }}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 bg-white dark:bg-slate-800/60 hover:bg-teal-50/40 dark:hover:bg-teal-950/30 text-left transition-all cursor-pointer group"
                >
                  <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900 dark:text-white text-xs">Doctor Portal</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Dr. Sarah Al-Mansoor</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onLoginAsDoctor();
                    onClose();
                  }}
                  className="w-full py-1 text-[10px] font-semibold text-teal-600 dark:text-teal-400 hover:underline text-center block cursor-pointer"
                >
                  Quick Cockpit Preview
                </button>
              </div>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('medguard_role', 'patient');
                      localStorage.setItem('medguard_token', `mock_token_patient_${Date.now()}`);
                    }
                    onClose();
                    router.push('/patient/dashboard');
                  }}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500 bg-white dark:bg-slate-800/60 hover:bg-cyan-50/40 dark:hover:bg-cyan-950/30 text-left transition-all cursor-pointer group"
                >
                  <HeartHandshake className="w-4 h-4 text-cyan-600 dark:text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900 dark:text-white text-xs">Patient Portal</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">David Vance (Caregiver)</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onLoginAsCaregiver();
                    onClose();
                  }}
                  className="w-full py-1 text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline text-center block cursor-pointer"
                >
                  Quick CareView Preview
                </button>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-2.5 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
              Or Sign In With Email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-3.5">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Clinical Email Address
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 font-mono transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Authenticate Session</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400 dark:text-slate-900" />
            </button>
          </form>

          <div className="text-center pt-1">
            <Link
              href="/login"
              onClick={onClose}
              className="inline-flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-semibold"
            >
              <span>Go to full dedicated login page</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
