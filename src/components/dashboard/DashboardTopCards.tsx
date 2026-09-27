'use client';

import React from 'react';
import {
  CalendarCheck2,
  AlertCircle,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

interface DashboardTopCardsProps {
  consultationsCount?: number;
  highRiskCount?: number;
  totalPatientsCount?: number;
  pendingReviewsCount?: number;
  onFilterRisk?: (risk: 'HIGH' | 'ALL') => void;
}

export function DashboardTopCards({
  consultationsCount = 14,
  highRiskCount = 6,
  totalPatientsCount = 248,
  pendingReviewsCount = 9,
  onFilterRisk,
}: DashboardTopCardsProps) {
  const cards = [
    {
      id: 'consultations',
      label: "Today's Consultations",
      number: consultationsCount,
      icon: CalendarCheck2,
      trend: '+3 from yesterday',
      trendPositive: true,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/60',
      badgeBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200/60 dark:border-teal-800/60',
      subtext: '4 completed • 10 scheduled',
    },
    {
      id: 'high_risk',
      label: 'High-Risk Alerts',
      number: highRiskCount,
      icon: AlertCircle,
      trend: 'Requires immediate action',
      trendAlert: true,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/60',
      subtext: '3 Critical DDIs • 3 Beers Flags',
      onClick: () => onFilterRisk?.('HIGH'),
    },
    {
      id: 'patients',
      label: 'Total Patients',
      number: totalPatientsCount,
      icon: Users,
      trend: '+12 new this week',
      trendPositive: true,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60',
      badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/60',
      subtext: 'Active in geriatric registry',
    },
    {
      id: 'pending_reviews',
      label: 'Pending Reviews',
      number: pendingReviewsCount,
      icon: Clock,
      trend: '4 urgent lab follow-ups',
      trendWarning: true,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60',
      subtext: 'Awaiting physician sign-off',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            onClick={card.onClick}
            className={`p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${
              card.onClick ? 'cursor-pointer hover:border-rose-300 dark:hover:border-rose-700' : ''
            }`}
          >
            <div>
              {/* Header row: Label & Icon */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {card.label}
                </span>
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${card.color} shadow-2xs transition-transform group-hover:scale-105`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Number Readout */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {card.number}
                </span>
              </div>
            </div>

            {/* Bottom Status / Trend Indicator */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span
                className={`inline-flex items-center gap-1 font-bold text-[11px] px-2 py-0.5 rounded-full border ${card.badgeBg}`}
              >
                {card.trendAlert ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                ) : card.trendWarning ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                ) : (
                  <TrendingUp className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                )}
                <span>{card.trend}</span>
              </span>

              <span className="text-[11px] text-slate-400 font-medium truncate max-w-[120px] text-right">
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
