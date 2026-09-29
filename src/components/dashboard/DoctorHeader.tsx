'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  X,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { RecentAlertItem } from '@/data/mockPatients';
import { NotificationDropdown } from '@/components/reminders-alerts/NotificationDropdown';
import { ThemeToggle } from '@/components/ThemeToggle';

interface DoctorHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMobileMenu: () => void;
  onToggleCollapse?: () => void;
  isSidebarCollapsed?: boolean;
  alerts: RecentAlertItem[];
  onOpenAlert: (alert: RecentAlertItem) => void;
}

export function DoctorHeader({
  searchQuery,
  onSearchChange,
  onOpenMobileMenu,
  onToggleCollapse,
  isSidebarCollapsed = false,
  alerts,
  onOpenAlert,
}: DoctorHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [localAlerts, setLocalAlerts] = useState<RecentAlertItem[]>(alerts);

  const unreadCount = localAlerts.filter((a) => !a.isRead).length;

  const handleMarkAllRead = () => {
    setLocalAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const handleDismissAlert = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleMenuClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      if (onToggleCollapse) onToggleCollapse();
    } else {
      onOpenMobileMenu();
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#090e17]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/90 shadow-2xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Menu Toggle & Doctor Greeting */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Unified Menu Toggle Button (Mobile: Open Drawer, Desktop: Collapse/Expand Sidebar) */}
            <button
              onClick={handleMenuClick}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Greeting */}
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 truncate">
                <span>Good morning, Dr. Sharma</span>
                <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block truncate">
                Thursday, Sep 26 • 3 critical polypharmacy alerts require your review.
              </p>
            </div>
          </div>

          {/* Right: Search, Theme Toggle, Notifications & Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Search Input */}
            <div className="relative hidden md:block w-64 lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient, MRN, drug..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-teal-500 bg-slate-50/70 dark:bg-slate-900/70 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Unified Notification Center (Doctor & Patient modes) */}
            <NotificationDropdown initialRole="doctor" allowRoleSwitch={true} />

            {/* Profile Avatar Pill */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-700 to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs ring-1 ring-slate-200 dark:ring-slate-700">
                  DS
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                    Dr. Sharma
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Attending Physician
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-white">Dr. Sharma, MD</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">sarah.sharma@medguard.clinic</div>
                    <div className="text-[10px] font-mono text-teal-600 dark:text-teal-400 mt-0.5">NPI: 1849204192</div>
                  </div>
                  <div className="py-1">
                    <div className="px-2 py-1.5 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                      Clinical Profile & Credentials
                    </div>
                    <div className="px-2 py-1.5 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                      Decision-Support Preferences
                    </div>
                    <div className="px-2 py-1.5 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                      Audit Trail & Logs
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Search input row */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient, MRN, condition..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-base sm:text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-teal-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

      </div>
    </header>
  );
}
