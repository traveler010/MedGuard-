'use client';

import React from 'react';
import { Patient } from '@/data/mockPatients';
import {
  Heart,
  Flame,
  CheckCircle2,
  Calendar,
  Phone,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';

interface CareViewHeroProps {
  patient: Patient;
  takenCount: number;
  totalCount: number;
  onOpenWalletCard: () => void;
}

export function CareViewHero({
  patient,
  takenCount,
  totalCount,
  onOpenWalletCard,
}: CareViewHeroProps) {
  const percentTaken = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-md mb-8 relative overflow-hidden">
      {/* Decorative subtle medical background glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Warm Greeting & Status */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-teal-200 text-xs font-semibold mb-3 border border-white/10">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>CareView • Patient & Family Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Good day, {patient.name}!
          </h1>
          <p className="text-sm text-teal-100/90 mt-1 leading-relaxed">
            Here is your personalized, doctor-reviewed daily medication schedule. Simple to follow, verified for safety.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-teal-200/80 mt-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-300" />
              Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            {patient.caregiverName && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-300" />
                Caregiver: {patient.caregiverName}
              </span>
            )}
          </div>
        </div>

        {/* Daily Adherence Progress Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 min-w-[280px] shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
              Today's Adherence
            </span>
            <span className="flex items-center gap-1 text-xs font-extrabold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-300/30">
              <Flame className="w-3.5 h-3.5 fill-amber-300" />
              7-Day Streak!
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <div className="text-2xl font-bold font-mono text-white">
              {takenCount} <span className="text-sm font-normal text-teal-200">of {totalCount} Taken</span>
            </div>
            <span className="text-sm font-bold text-teal-300 font-mono">
              {percentTaken}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/10">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${percentTaken}%` }}
            />
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-teal-200">
            <span>
              {takenCount === totalCount
                ? 'All set for today! Great job!'
                : `${totalCount - takenCount} medicines remaining`}
            </span>
            <button
              onClick={onOpenWalletCard}
              className="text-white hover:text-teal-200 underline font-semibold cursor-pointer"
            >
              Print Med-Card
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
