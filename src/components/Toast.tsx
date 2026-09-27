'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, message?: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast viewport */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => {
          const config = {
            success: {
              border: 'border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-slate-900 text-emerald-950 dark:text-emerald-100',
              icon: CheckCircle2,
              iconColor: 'text-emerald-600 dark:text-emerald-400',
              bar: 'bg-emerald-500',
            },
            warning: {
              border: 'border-amber-200 dark:border-amber-800/80 bg-white dark:bg-slate-900 text-amber-950 dark:text-amber-100',
              icon: AlertTriangle,
              iconColor: 'text-amber-600 dark:text-amber-400',
              bar: 'bg-amber-500',
            },
            error: {
              border: 'border-rose-200 dark:border-rose-800/80 bg-white dark:bg-slate-900 text-rose-950 dark:text-rose-100',
              icon: AlertCircle,
              iconColor: 'text-rose-600 dark:text-rose-400',
              bar: 'bg-rose-500',
            },
            info: {
              border: 'border-cyan-200 dark:border-cyan-800/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100',
              icon: Info,
              iconColor: 'text-teal-600 dark:text-teal-400',
              bar: 'bg-teal-500',
            },
          }[toast.type];

          const Icon = config.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto relative overflow-hidden rounded-xl border ${config.border} p-4 shadow-lg shadow-slate-900/10 dark:shadow-black/40 transition-all duration-300 animate-in slide-in-from-bottom-5`}
            >
              <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${config.bar}`} />
              <div className="flex items-start gap-3 pl-1">
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-sm font-semibold">{toast.title}</h4>
                  {toast.message && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {toast.message}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  aria-label="Dismiss notification"
                  className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200 p-1 -mr-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
