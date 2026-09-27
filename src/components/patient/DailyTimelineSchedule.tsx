'use client';

import React from 'react';
import { Medication } from '@/data/mockPatients';
import {
  Sun,
  Sunset,
  Moon,
  Clock,
  Check,
  Utensils,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';

interface DailyTimelineScheduleProps {
  medications: Medication[];
  takenMedIds: string[];
  onToggleTaken: (medId: string) => void;
}

export function DailyTimelineSchedule({
  medications,
  takenMedIds,
  onToggleTaken,
}: DailyTimelineScheduleProps) {
  // Group medications by timing slot
  const slots = [
    {
      id: 'morning',
      title: 'Morning Routine',
      time: '8:00 AM',
      subtitle: 'With or right before breakfast',
      icon: Sun,
      iconColor: 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400',
      meds: medications.filter((m) => m.timingSlot === 'morning'),
    },
    {
      id: 'noon',
      title: 'Midday / Lunch',
      time: '1:00 PM',
      subtitle: 'Take with a glass of water',
      icon: Clock,
      iconColor: 'text-teal-600 bg-teal-50 border-teal-200 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-400',
      meds: medications.filter((m) => m.timingSlot === 'noon'),
    },
    {
      id: 'evening',
      title: 'Evening / Dinner',
      time: '6:30 PM',
      subtitle: 'Take around dinnertime',
      icon: Sunset,
      iconColor: 'text-orange-500 bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-400',
      meds: medications.filter((m) => m.timingSlot === 'evening'),
    },
    {
      id: 'bedtime',
      title: 'Bedtime',
      time: '9:30 PM',
      subtitle: 'Right before going to sleep',
      icon: Moon,
      iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-400',
      meds: medications.filter((m) => m.timingSlot === 'bedtime'),
    },
  ];

  return (
    <div className="space-y-8 mb-8">
      {slots.map((slot) => {
        if (slot.meds.length === 0) return null;
        const Icon = slot.icon;

        return (
          <div key={slot.id} className="relative">
            {/* Slot Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs ${slot.iconColor}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {slot.title}
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                    {slot.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{slot.subtitle}</p>
              </div>
            </div>

            {/* Pill Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slot.meds.map((med) => {
                const isTaken = takenMedIds.includes(med.id);

                return (
                  <div
                    key={med.id}
                    className={`rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between ${
                      isTaken
                        ? 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-75'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-teal-300 dark:hover:border-teal-500'
                    }`}
                  >
                    <div>
                      {/* Top bar with pill preview & food rule */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {/* Visual Pill Rendering */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-2xs shrink-0 ${
                              med.pillShape === 'capsule'
                                ? 'rounded-full'
                                : med.pillShape === 'oval'
                                ? 'rounded-2xl'
                                : 'rounded-full'
                            }`}
                            style={{
                              backgroundColor: med.pillColor,
                              borderColor: '#cbd5e1',
                            }}
                            title={med.pillVisualDescription}
                          >
                            <span className="text-[10px] font-bold text-slate-700/80 uppercase font-mono">
                              Rx
                            </span>
                          </div>

                          <div>
                            <h4
                              className={`text-sm font-extrabold text-slate-900 dark:text-white leading-tight ${
                                isTaken ? 'line-through text-slate-500 dark:text-slate-500' : ''
                              }`}
                            >
                              {med.patientPlainName}
                            </h4>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                              {med.name} • {med.dosage}
                            </div>
                          </div>
                        </div>

                        {/* Food instruction tag */}
                        <div className="shrink-0">
                          {med.withFood === 'with_food' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                              <Utensils className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                              Take with food
                            </span>
                          ) : med.withFood === 'empty_stomach' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                              Empty stomach (30m before)
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                              Take anytime
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Plain-Language Purpose */}
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50/60 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 mb-3">
                        <span className="font-bold text-slate-900 dark:text-white">Why you take this: </span>
                        {med.patientWhy}
                      </p>

                      {/* Special Warnings (e.g. Dizziness or interaction) */}
                      {med.patientSpecialNotice && (
                        <div
                          className={`text-xs p-2.5 rounded-xl border mb-3 flex items-start gap-2 ${
                            med.patientSpecialNotice.includes('WARNING') ||
                            med.patientSpecialNotice.includes('CRITICAL')
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-semibold'
                              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span className="leading-snug">
                            {med.patientSpecialNotice}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action: "Mark as Taken" button */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {med.pillVisualDescription}
                      </span>

                      <button
                        onClick={() => onToggleTaken(med.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                          isTaken
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>{isTaken ? 'Taken Today' : 'Mark as Taken'}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
