'use client';

import React from 'react';
import {
  ShieldAlert,
  Footprints,
  AlertTriangle,
  Apple,
  PhoneCall,
  CheckCircle2,
  Info,
} from 'lucide-react';

export function CaregiverSafetyGuide() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            Caregiver & Patient Safety Guardrails
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Plain-English guidelines to prevent accidental falls, adverse interactions, and emergencies at home.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        
        {/* Card 1: Fall & Dizziness Prevention */}
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Footprints className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Fall & Dizziness Prevention
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Stand up slowly:</strong> Sit at the edge of the bed for 30 seconds before standing to prevent sudden blood pressure drops.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Nighttime lighting:</strong> Keep a nightlight plugged in on the path from bed to the bathroom.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">No OTC sleep aids:</strong> Avoid store-bought allergy or sleep pills (like Benadryl/ZzzQuil)—they cause severe confusion and falls in seniors.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Card 2: Food & Beverage Precautions */}
        <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-teal-950/30 border border-cyan-200/80 dark:border-teal-800/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-950 dark:text-teal-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Apple className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Dietary & Food Precautions
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">No Grapefruit:</strong> Do not eat grapefruit or drink grapefruit juice; it interferes with how your body processes blood pressure and cholesterol medicines.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Consistent greens:</strong> Eat roughly the same amount of leafy green vegetables each week to keep your blood thinner working safely.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Avoid &quot;Lite Salt&quot;:</strong> Salt substitutes contain high potassium, which can be dangerous when taken with your heart pills.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Card 3: When to Call Doctor Immediately */}
        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-800/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-900 dark:text-rose-300 font-bold text-xs uppercase tracking-wider mb-2">
              <PhoneCall className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              When to Contact Clinic / 911
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Unusual bruising or bleeding:</strong> Bleeding gums, dark black stools, or cuts that don&apos;t stop bleeding after 5 minutes.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Sudden shortness of breath:</strong> Or sudden swelling in ankles, legs, or a rapid weight gain of &gt;3 lbs in 2 days.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Severe confusion or disorientation:</strong> Difficulty recognizing familiar surroundings or sudden speech changes.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
