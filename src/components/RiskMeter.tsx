'use client';

import React from 'react';
import { RiskLevel } from '@/data/mockPatients';

interface RiskMeterProps {
  score: number; // 0 - 100
  previousScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showBands?: boolean;
  animate?: boolean;
}

export function RiskMeter({
  score,
  previousScore,
  size = 'md',
  showBands = true,
}: RiskMeterProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  const getRiskLevel = (val: number): RiskLevel => {
    if (val < 40) return 'LOW';
    if (val < 70) return 'MODERATE';
    return 'HIGH';
  };

  const riskLevel = getRiskLevel(clampedScore);

  const colors = {
    LOW: {
      text: 'text-emerald-600 dark:text-emerald-400',
      stroke: '#10b981', // emerald-500
      glow: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.25))',
      bgRing: '#d1fae5',
      label: 'Low Polypharmacy Risk',
      subtext: 'Regimen is pharmacokinetically stable',
    },
    MODERATE: {
      text: 'text-amber-600 dark:text-amber-400',
      stroke: '#f59e0b', // amber-500
      glow: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.25))',
      bgRing: '#fef3c7',
      label: 'Moderate Polypharmacy Risk',
      subtext: 'Actionable drug interactions detected',
    },
    HIGH: {
      text: 'text-rose-600 dark:text-rose-400',
      stroke: '#f43f5e', // rose-500
      glow: 'drop-shadow(0 0 12px rgba(244, 63, 94, 0.35))',
      bgRing: '#ffe4e6',
      label: 'Critical Polypharmacy Hazard',
      subtext: 'High hazard of acute hospitalization',
    },
  }[riskLevel];

  // SVG Gauge calculations
  // Semi-circle / 240 degree arc gauge
  const radius = size === 'sm' ? 44 : size === 'lg' ? 84 : 64;
  const strokeWidth = size === 'sm' ? 8 : size === 'lg' ? 14 : 11;
  const circumference = 2 * Math.PI * radius;
  // Arc covering 240 degrees (from 150 deg to 390 deg)
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - (arcLength * clampedScore) / 100;

  const width = size === 'sm' ? 120 : size === 'lg' ? 220 : 170;
  const height = size === 'sm' ? 95 : size === 'lg' ? 175 : 135;

  const delta = previousScore !== undefined ? clampedScore - previousScore : null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width, height }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          {/* Background track arc */}
          <circle
            cx={width / 2}
            cy={height * 0.72}
            r={radius}
            fill="none"
            className="stroke-slate-200 dark:stroke-slate-800 transition-colors"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(150 ${width / 2} ${height * 0.72})`}
          />

          {/* Color filled progress arc */}
          <circle
            cx={width / 2}
            cy={height * 0.72}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(150 ${width / 2} ${height * 0.72})`}
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease',
              filter: colors.glow,
            }}
          />
        </svg>

        {/* Center score readout */}
        <div
          className="absolute flex flex-col items-center text-center"
          style={{ top: height * 0.32 }}
        >
          <div className="flex items-baseline justify-center">
            <span
              className={`font-mono font-bold tracking-tight ${colors.text} ${
                size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-5xl' : 'text-4xl'
              }`}
            >
              {clampedScore}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-semibold text-xs ml-0.5">/100</span>
          </div>
          <span
            className={`font-semibold uppercase tracking-wider ${colors.text} ${
              size === 'sm' ? 'text-[9px]' : 'text-[11px]'
            }`}
          >
            {riskLevel}
          </span>
        </div>
      </div>

      {/* Delta indicator if simulating */}
      {delta !== null && delta !== 0 && (
        <div className="mt-1 flex items-center gap-1 text-xs font-medium">
          {delta < 0 ? (
            <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full font-mono">
              ↓ {Math.abs(delta)} pts (Safety Improvement)
            </span>
          ) : (
            <span className="text-rose-700 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950/50 px-2 py-0.5 rounded-full font-mono">
              ↑ +{delta} pts (Risk Increased)
            </span>
          )}
        </div>
      )}

      {/* Visual reference bands */}
      {showBands && size !== 'sm' && (
        <div className="flex items-center gap-2 mt-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> 0-39 Low
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> 40-69 Mod
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> 70-100 High
          </span>
        </div>
      )}
    </div>
  );
}
