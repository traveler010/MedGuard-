'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldAlert,
  Stethoscope,
  HeartHandshake,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Activity,
  Loader2,
  ShieldCheck,
  ChevronLeft,
  Zap,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { ThemeToggle } from '@/components/ThemeToggle';

type UserRole = 'doctor' | 'patient';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const roleParam = searchParams?.get('role');
  const initialRole: UserRole = roleParam === 'patient' ? 'patient' : 'doctor';

  // Role state
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  // Form input state
  const [email, setEmail] = useState(
    initialRole === 'doctor'
      ? 'sarah.almansoor@mediqx.clinic'
      : 'david.vance@caregiver.org'
  );
  const [password, setPassword] = useState(
    initialRole === 'doctor' ? 'ClinicalDoctor2026!' : 'CaregiverVance2026!'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // UX Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Update when role changes
  useEffect(() => {
    if (roleParam === 'patient' || roleParam === 'doctor') {
      setSelectedRole(roleParam);
    }
  }, [roleParam]);

  // Sync default demo credentials when switching role
  useEffect(() => {
    if (selectedRole === 'doctor') {
      setEmail('sarah.almansoor@mediqx.clinic');
      setPassword('ClinicalDoctor2026!');
    } else {
      setEmail('david.vance@caregiver.org');
      setPassword('CaregiverVance2026!');
    }
    setErrorMessage('');
  }, [selectedRole]);

  const executeLogin = (role: UserRole, userEmail: string) => {
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);

      if (typeof window !== 'undefined') {
        localStorage.setItem('medguard_role', role);
        localStorage.setItem('medguard_token', `mock_token_${role}_${Date.now()}`);
        localStorage.setItem(
          'medguard_user',
          JSON.stringify({
            id: role === 'doctor' ? 'doc-1' : 'pat-1',
            email: userEmail,
            role,
            name:
              role === 'doctor'
                ? 'Dr. Sarah Al-Mansoor, MD'
                : 'David Vance (Caregiver)',
            lastLogin: new Date().toISOString(),
          })
        );
      }

      if (role === 'doctor') {
        showToast(
          'Authentication Verified',
          'Welcome Dr. Sarah Al-Mansoor. Loading Clinician Cockpit...',
          'success'
        );
        router.push('/doctor/dashboard');
      } else {
        showToast(
          'Authentication Verified',
          'Welcome David Vance. Loading Patient CareView Portal...',
          'success'
        );
        router.push('/patient/dashboard');
      }
    }, 500);
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    executeLogin(selectedRole, email);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 font-sans">
      {/* ----------------- LEFT SIDE: BRANDING & ABSTRACT MEDICAL VISUALIZATION ----------------- */}
      <div className="lg:w-1/2 relative bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white p-8 lg:p-14 flex flex-col justify-between overflow-hidden">
        {/* Subtle background glow blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar with back to home link */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-teal-400" />
            <span>Back to Landing Page</span>
          </Link>

          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
            Phase 2 Prototype
          </span>
        </div>

        {/* Center Content: Statement & Abstract Visualization */}
        <div className="relative z-10 my-10 lg:my-auto space-y-8 max-w-lg">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-teal-700/20 ring-1 ring-white/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  MEDI<span className="text-teal-400">QX</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  <Sparkles className="w-3 h-3 text-teal-400" /> HealthTech
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Clinical Polypharmacy Risk Intelligence
              </p>
            </div>
          </div>

          <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
            &ldquo;Safer medications start with better information.&rdquo;
          </blockquote>

          <p className="text-sm text-slate-300 leading-relaxed">
            Eliminate adverse drug interactions, unmask prescribing cascades, and safeguard older adults with explainable clinical decision-support.
          </p>

          {/* Abstract Medical / Health Visualization Graphic */}
          <div className="relative rounded-3xl bg-white/5 border border-white/10 p-5 backdrop-blur-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
                <span>Real-Time Pharmacokinetic Telemetry</span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                Safe Baseline
              </span>
            </div>

            <svg
              className="w-full h-16 stroke-teal-400/80 fill-none"
              viewBox="0 0 400 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,30 L60,30 L80,10 L90,50 L100,20 L110,40 L120,30 L200,30 L220,5 L230,55 L240,15 L250,45 L260,30 L340,30 L360,10 L370,50 L380,20 L390,40 L400,30"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Beers Flags</span>
                <span className="text-xs font-bold text-teal-300 font-mono">2023 Rules</span>
              </div>
              <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Risk Delta</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">-42 Pts</span>
              </div>
              <div className="p-2 rounded-xl bg-black/20 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">CareView</span>
                <span className="text-xs font-bold text-cyan-300 font-mono">Adherence</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-[11px] text-slate-400 pt-4 border-t border-white/10 flex items-center justify-between">
          <span>MediQX AI System v2026</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            Healthcare Portal Session
          </span>
        </div>
      </div>

      {/* ----------------- RIGHT SIDE: ROLE SELECTION & LOGIN CARD ----------------- */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex flex-col justify-between items-center bg-slate-50 dark:bg-[#090e17] transition-colors">
        <div className="w-full max-w-md flex justify-end pb-4">
          <ThemeToggle />
        </div>

        <div className="max-w-md w-full space-y-6 my-auto">
          {/* Welcome Text */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sign In to MediQX
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select your role below to launch the clinical decision cockpit or the patient care portal.
            </p>
          </div>

          {/* Quick 1-Click Access Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                1-Click Instant Portals
              </span>
              <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Quick Demo
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => executeLogin('doctor', 'sarah.almansoor@mediqx.clinic')}
                disabled={isLoading}
                className="p-3 rounded-2xl border border-teal-200 dark:border-teal-900 bg-teal-50/80 hover:bg-teal-100/90 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-bold text-xs mb-1">
                  <Stethoscope className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Enter Doctor View</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Dr. Sarah Al-Mansoor</div>
              </button>

              <button
                type="button"
                onClick={() => executeLogin('patient', 'david.vance@caregiver.org')}
                disabled={isLoading}
                className="p-3 rounded-2xl border border-cyan-200 dark:border-cyan-900 bg-cyan-50/80 hover:bg-cyan-100/90 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/50 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-cyan-700 dark:text-cyan-400 font-bold text-xs mb-1">
                  <HeartHandshake className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Enter Patient View</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">David Vance (Caregiver)</div>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-slate-50 dark:bg-[#090e17] px-2.5 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
              Or Sign In With Role Form
            </span>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {/* ROLE SELECTION CARDS (Doctor vs Patient / Caregiver) */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2.5">
              Select Your Access Role:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Doctor Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('doctor')}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  selectedRole === 'doctor'
                    ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-500 shadow-xs ring-2 ring-teal-400/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                      selectedRole === 'doctor'
                        ? 'bg-teal-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                    Doctor
                  </div>
                  <div className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold mt-0.5">
                    Clinician Workspace
                  </div>
                </div>
                {selectedRole === 'doctor' && (
                  <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-400 uppercase tracking-wider mt-2.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400" /> Active Role
                  </span>
                )}
              </button>

              {/* Patient / Caregiver Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('patient')}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  selectedRole === 'patient'
                    ? 'bg-cyan-50/70 dark:bg-teal-950/40 border-cyan-500 dark:border-teal-500 shadow-xs ring-2 ring-cyan-400/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                      selectedRole === 'patient'
                        ? 'bg-cyan-600 dark:bg-teal-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                    Patient / Caregiver
                  </div>
                  <div className="text-[11px] text-cyan-800 dark:text-teal-300 font-semibold mt-0.5">
                    Medication CareView
                  </div>
                </div>
                {selectedRole === 'patient' && (
                  <span className="text-[10px] font-extrabold text-cyan-700 dark:text-teal-400 uppercase tracking-wider mt-2.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-600 dark:text-teal-400" /> Active Role
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Pill Banner */}
          <div className="p-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Demo Preset: <strong>{selectedRole === 'doctor' ? 'Dr. Sarah Al-Mansoor' : 'David Vance'}</strong>
            </span>
            <span className="text-teal-700 dark:text-teal-400 font-bold font-mono">1-Click Ready</span>
          </div>

          {/* Main Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email Field */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {selectedRole === 'doctor' ? 'Clinical Institutional Email' : 'Caregiver / Patient Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-teal-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Password Field with Show/Hide toggle */}
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full text-xs pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-teal-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-2xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-slate-600 dark:text-slate-400 font-medium">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold text-sm transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>
                    Sign In as {selectedRole === 'doctor' ? 'Clinician' : 'Patient/Caregiver'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-teal-400 dark:text-white" />
                </>
              )}
            </button>
          </form>

          {/* Security & Disclaimer Footer */}
          <div className="pt-4 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Encrypted mock authentication session • Doctor &amp; Patient profiles preconfigured
            </p>
          </div>
        </div>

        <div className="w-full max-w-md text-center py-2 text-[11px] text-slate-400 dark:text-slate-500">
          MediQX Secure Access Gateway
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        defaultEmail={email}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#090e17]">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
            <span className="text-sm font-semibold">Loading MediQX Authentication...</span>
          </div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
