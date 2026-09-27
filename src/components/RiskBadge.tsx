'use client';

import React from 'react';
import { RiskLevel } from '@/data/mockPatients';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  score?: number;
  className?: string;
}

export function RiskBadge({
  level,
  size = 'md',
  showIcon = true,
  score,
  className = ''
}: RiskBadgeProps) {
  const config = {
    LOW: {
      label: 'Low Risk',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      dotColor: 'bg-emerald-500',
      icon: CheckCircle2,
    },
    MODERATE: {
      label: 'Moderate Risk',
      bgColor: 'bg-amber-50 dark:bg-amber-950/50',
      textColor: 'text-amber-800 dark:text-amber-300',
      borderColor: 'border-amber-200 dark:border-amber-800',
      dotColor: 'bg-amber-500',
      icon: AlertTriangle,
    },
    HIGH: {
      label: 'High Risk',
      bgColor: 'bg-rose-50 dark:bg-rose-950/50',
      textColor: 'text-rose-700 dark:text-rose-300',
      borderColor: 'border-rose-200 dark:border-rose-800',
      dotColor: 'bg-rose-500',
      icon: AlertCircle,
    },
  }[level];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses} ${className} transition-all duration-200 shadow-xs`}
    >
      {showIcon && (
        <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      )}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="opacity-80 font-mono text-[11px] ml-0.5">({score})</span>
      )}
    </span>
  );
}
