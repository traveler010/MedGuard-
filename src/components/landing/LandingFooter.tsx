'use client';

import React from 'react';
import { ShieldAlert, Heart, ExternalLink, Mail, Phone } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-white dark:bg-[#090e17] border-t border-slate-200 dark:border-slate-800/80 pt-16 pb-12 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-100 dark:border-slate-800/60">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-cyan-500 flex items-center justify-center text-white shadow-xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                MEDI<span className="text-teal-600 dark:text-teal-400">QX</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              AI-Powered Polypharmacy Risk Assistant designed to help healthcare teams identify drug-drug interactions, anticholinergic burden, and prescribing cascades before adverse outcomes occur.
            </p>
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px]">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for National HealthTech Innovation</span>
            </div>
          </div>

          {/* Product Col */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#how-it-works" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#for-doctors" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Clinician Cockpit
                </a>
              </li>
              <li>
                <a href="#for-patients" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  CareView Portal
                </a>
              </li>
              <li>
                <a href="#home" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  What-If Simulator
                </a>
              </li>
            </ul>
          </div>

          {/* Features Col */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  DDI Detection
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Beers 2023 Audit
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Prescribing Cascades
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  EHR SOAP Generator
                </a>
              </li>
            </ul>
          </div>

          {/* Privacy & Contact Col */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] mb-3">
              Governance & Contact
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  Privacy Policy & HIPAA
                </span>
              </li>
              <li>
                <span className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer">
                  Clinical Trial Evidence
                </span>
              </li>
              <li className="pt-1 flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>clinical@mediqx.health</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>+1 (800) 555-MEDIQX</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Medical Disclaimer Row */}
        <div className="pt-8 space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong className="text-slate-700 dark:text-slate-300">Official Medical Disclaimer:</strong> MediQX is an algorithmic clinical decision-support application built for informational and educational demonstrations. It is not intended to provide definitive medical diagnosis or replace personalized clinical judgment by licensed medical practitioners. In case of acute medical emergencies, always contact emergency medical services (911) immediately.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500 pt-2">
            <div>
              © 2026 MediQX HealthTech. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">Security Protocol</span>
              <span>•</span>
              <span className="hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">HIPAA Compliance</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
