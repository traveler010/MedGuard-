'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'icon' | 'pill';
  showLabel?: boolean;
}

export function ThemeToggle({
  className = '',
  variant = 'icon',
  showLabel = false,
}: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        title={label}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer btn-press ${
          isDark
            ? 'bg-slate-800/90 text-amber-300 border-slate-700 hover:bg-slate-700'
            : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-50 shadow-2xs'
        } ${className}`}
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 rotate-0 scale-100 transition-all duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 rotate-0 scale-100 transition-all duration-300" />
          )}
        </div>
        <span className="text-xs font-bold">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`relative p-2 rounded-xl transition-all border cursor-pointer btn-press flex items-center justify-center ${
        isDark
          ? 'bg-slate-800 text-amber-400 border-slate-700/80 hover:bg-slate-700 hover:text-amber-300 shadow-2xs'
          : 'bg-white text-slate-600 border-slate-200/90 hover:bg-slate-100 hover:text-slate-900 shadow-2xs'
      } ${className}`}
    >
      <span className="sr-only">{label}</span>
      <div className="w-5 h-5 flex items-center justify-center transition-transform duration-300">
        {isDark ? (
          <Sun className="w-4.5 h-4.5 text-amber-400 animate-in spin-in-90 duration-200" />
        ) : (
          <Moon className="w-4.5 h-4.5 text-slate-700 animate-in spin-in-90 duration-200" />
        )}
      </div>
      {showLabel && (
        <span className="ml-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
