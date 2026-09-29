'use client';

import React, { useState } from 'react';
import {
  KeyRound,
  X,
  Mail,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
  defaultEmail = '',
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid clinical or caregiver email address.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulated network delay for realistic HealthTech UX
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 900);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <KeyRound className="w-4 h-4 text-teal-400 dark:text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Password Recovery
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                MedGuard Clinical Identity Verification
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Recovery Instructions Sent!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed max-w-xs mx-auto">
                  We have dispatched a secure password reset link to:
                  <br />
                  <strong className="text-slate-900 dark:text-white font-mono mt-1 inline-block">{email}</strong>
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 leading-normal text-left flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>
                  For clinical security, this single-use link expires in 15 minutes. Check your spam folder if it doesn&apos;t appear immediately.
                </span>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Enter your registered clinical or caregiver email address. We will verify your account and send instructions to reset your password.
              </p>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah.almansoor@medguard.clinic"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                {error && (
                  <p className="text-rose-600 dark:text-rose-400 text-[11px] mt-1 font-medium">
                    {error}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 disabled:opacity-50 text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Link</span>
                      <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
