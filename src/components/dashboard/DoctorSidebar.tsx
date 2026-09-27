'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  Pill,
  MessageSquare,
  Calendar,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  X,
} from 'lucide-react';

export type NavItem =
  | 'dashboard'
  | 'patients'
  | 'medicines'
  | 'consultations'
  | 'appointments'
  | 'reports'
  | 'new_consultation'
  | 'risk_alerts'
  | 'med_history'
  | 'settings';

interface DoctorSidebarProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  onNewConsultation?: () => void;
}

export function DoctorSidebar({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  onLogout,
}: DoctorSidebarProps) {
  const navItems = [
    {
      id: 'dashboard' as NavItem,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'patients' as NavItem,
      label: 'Patients',
      icon: Users,
      badge: '6',
    },
    {
      id: 'consultations' as NavItem,
      label: 'Consultations',
      icon: MessageSquare,
      badge: '2 New',
      badgeColor: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/20',
    },
    {
      id: 'appointments' as NavItem,
      label: 'Appointments',
      icon: Calendar,
      badge: '6 Today',
    },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    onSelectTab(item.id);
    onCloseMobile();
  };

  const renderSidebarContent = (isDesktop: boolean) => {
    const isCollapsed = isDesktop && collapsed;

    return (
      <div className="h-full flex flex-col justify-between bg-white dark:bg-[#090e17] text-slate-700 dark:text-slate-300 select-none transition-colors">
        {/* Top Branding */}
        <div>
          <div
            className={`p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <Link href="/doctor/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0 ring-1 ring-white/10 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                      MED<span className="text-teal-600 dark:text-teal-400">GUARD</span>
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30">
                      Doctor
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
                    Clinical Workspace
                  </p>
                </div>
              )}
            </Link>

            {/* Desktop Collapse Toggle */}
            {isDesktop ? (
              <button
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={collapsed ? 'Expand menu' : 'Collapse menu'}
                aria-label="Toggle menu"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            ) : (
              /* Mobile Close Button */
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                aria-label="Close mobile menu"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation List */}
          <nav className="p-3 space-y-1.5 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl min-h-[44px] transition-all duration-200 cursor-pointer group ${
                    isActive
                      ? 'bg-teal-600 text-white font-bold shadow-sm shadow-teal-900/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400'
                    }`}
                  />

                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                            item.badgeColor ||
                            (isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300')
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile and Sign Out */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
          {/* Patient Portal Link */}
          <Link
            href="/patient/dashboard"
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title="Switch to Patient Portal"
          >
            <Stethoscope className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="truncate">Patient Portal</span>}
          </Link>

          {/* Attending Physician Badge */}
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/60 ${
              isCollapsed ? 'justify-center p-1.5' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
              DS
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  Dr. Sharma, MD
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Geriatric Specialist
                </p>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title="Sign out of Doctor Portal"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar: sticky left rail */}
      <aside
        className={`hidden md:block sticky top-0 h-screen shrink-0 border-r border-slate-200 dark:border-slate-800/80 z-30 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {renderSidebarContent(true)}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`md:hidden fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-[#090e17] z-50 shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>
    </>
  );
}
