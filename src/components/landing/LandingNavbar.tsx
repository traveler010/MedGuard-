'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Menu,
  X,
  Stethoscope,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface LandingNavbarProps {
  onStartConsultation: () => void;
  onExplorePatient: () => void;
  onOpenLogin: () => void;
}

export function LandingNavbar({
  onStartConsultation,
  onExplorePatient,
  onOpenLogin,
}: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#090e17]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* MediQX Logo */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20 ring-1 ring-white/20 transition-transform group-hover:scale-105">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white" suppressHydrationWarning>
                  MEDI<span className="text-teal-600 dark:text-teal-400">QX</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60">
                  <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" /> Clinical AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Polypharmacy Risk Assistant
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#home" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Home
            </a>
            <a href="#how-it-works" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              Features
            </a>
            <Link
              href="/doctor/dashboard"
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1.5"
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>For Doctors</span>
            </Link>
            <Link
              href="/patient/dashboard"
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1.5"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>For Patients</span>
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            {/* Login Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLoginMenuOpen(!loginMenuOpen)}
                className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Login</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {loginMenuOpen && (
                <div
                  onMouseLeave={() => setLoginMenuOpen(false)}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95"
                >
                  <Link
                    href="/login?role=doctor"
                    onClick={() => setLoginMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/40 text-slate-900 dark:text-white transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">Doctor Login</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Clinical Decision Cockpit</div>
                    </div>
                  </Link>

                  <Link
                    href="/login?role=patient"
                    onClick={() => setLoginMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-900 dark:text-white transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">Patient Login</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">CareView &amp; Schedule</div>
                    </div>
                  </Link>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setLoginMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition"
                  >
                    Open Quick Demo Modal...
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/login"
              className="text-xs font-bold text-white bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 btn-press"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400 dark:text-white" />
            </Link>
          </div>

          {/* Mobile Right Bar: Theme Toggle + Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              How It Works
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Features
            </a>
            <Link
              href="/doctor/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" /> For Doctors (Dashboard)
            </Link>
            <Link
              href="/patient/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-teal-600 dark:text-teal-400" /> For Patients (Dashboard)
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <Link
              href="/login?role=doctor"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl border border-teal-500/40 text-xs font-bold text-teal-700 dark:text-teal-300 text-center block bg-teal-50/50 dark:bg-teal-950/30"
            >
              Doctor Login
            </Link>
            <Link
              href="/login?role=patient"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl border border-cyan-500/40 text-xs font-bold text-cyan-700 dark:text-cyan-300 text-center block bg-cyan-50/50 dark:bg-cyan-950/30"
            >
              Patient Login
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onStartConsultation();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-teal-600 text-white text-xs font-bold text-center block cursor-pointer"
            >
              Start Clinical Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
