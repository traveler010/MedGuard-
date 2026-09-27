'use client';

import React from 'react';
import { RecentAlertItem } from '@/data/mockPatients';
import { RiskBadge } from '@/components/RiskBadge';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface RecentAlertsSectionProps {
  alerts: RecentAlertItem[];
  onOpenAlert: (alert: RecentAlertItem) => void;
  onViewAllAlerts?: () => void;
}

export function RecentAlertsSection({
  alerts,
  onOpenAlert,
  onViewAllAlerts,
}: RecentAlertsSectionProps) {
  // Grab the 3 required recent alerts
  const displayAlerts = alerts.slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 sm:p-6 mb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>Recent Clinical Risk Alerts</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Active Monitoring
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Prioritized pharmacovigilance collision flags requiring attending physician review.
          </p>
        </div>

        {onViewAllAlerts && (
          <button
            onClick={onViewAllAlerts}
            className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All ({alerts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3 Alerts List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {displayAlerts.map((alert) => {
          const isHigh = alert.severity === 'HIGH';
          const isMod = alert.severity === 'MODERATE';

          return (
            <div
              key={alert.id}
              onClick={() => onOpenAlert(alert)}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer group shadow-2xs hover:shadow-md hover:-translate-y-0.5 ${
                isHigh
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 hover:border-rose-300 dark:hover:border-rose-800'
                  : isMod
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 hover:border-amber-300 dark:hover:border-amber-800'
                  : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 hover:border-emerald-300 dark:hover:border-emerald-800'
              }`}
            >
              <div className="space-y-2.5">
                {/* 1. Severity Badge & Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <RiskBadge level={alert.severity} size="sm" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                      {isHigh ? "⚠ High Collision" : isMod ? "⚠ Caution" : "✓ Low"}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {alert.timestamp}
                  </span>
                </div>

                {/* 2. Medicine Collision Title */}
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {alert.title}
                  </h3>
                  {/* Concise one-line impact instead of long paragraph */}
                  <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 mt-1 line-clamp-1">
                    {alert.severity === "HIGH"
                      ? "High bleeding risk & pharmacokinetic collision."
                      : alert.severity === "MODERATE"
                      ? "Cumulative sedation and fall vulnerability."
                      : "Regimen monitoring recommended."}
                  </p>
                </div>

                {/* 3. Patient Name */}
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Patient: <strong className="text-slate-900 dark:text-white font-bold">{alert.patientName}</strong> ({alert.patientAge}y)
                </div>
              </div>

              {/* 4. Action: View Details Button */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {alert.patientMrn}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 dark:text-teal-400 group-hover:underline">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
