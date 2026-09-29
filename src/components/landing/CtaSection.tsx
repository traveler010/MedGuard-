'use client';

import React from 'react';
import { Stethoscope, HeartHandshake, ArrowRight, Sparkles } from 'lucide-react';

interface CtaSectionProps {
  onEnterDoctorDashboard: () => void;
  onExplorePatientView: () => void;
}

export function CtaSection({
  onEnterDoctorDashboard,
  onExplorePatientView,
}: CtaSectionProps) {
  return (
    <section className="py-20 relative overflow-hidden bg-slate-900 text-white">
      {/* Decorative gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-950/70 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs text-teal-300 text-xs font-semibold border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-teal-300" />
          <span>Experience MedGuard Interactive Prototype</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Make every medication decision more informed.
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Try the fully interactive, presentation-ready clinical cockpit or switch into the simplified patient adherence portal.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onEnterDoctorDashboard}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-teal-700/30 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Enter Doctor Dashboard</span>
            <ArrowRight className="w-4 h-4 text-teal-200" />
          </button>

          <button
            onClick={onExplorePatientView}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all backdrop-blur-xs flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4 text-rose-300" />
            <span>Explore Patient View</span>
          </button>
        </div>

        <div className="pt-6 text-xs text-slate-400 font-mono">
          Presentation Phase 1 Prototype • Zero Real API/Backend Dependencies Required
        </div>

      </div>
    </section>
  );
}
