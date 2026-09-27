"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Sparkles,
  FileText,
  Clock,
  Stethoscope,
} from "lucide-react";

export type CareNavDestination =
  | "dashboard"
  | "analyzer"
  | "reports"
  | "reminders"
  | "consultation";

interface CareNavigationBarProps {
  currentDestination?: CareNavDestination;
  onSelectTab?: (dest: CareNavDestination) => void;
  pendingRemindersCount?: number;
}

export function CareNavigationBar({
  currentDestination,
  onSelectTab,
  pendingRemindersCount = 0,
}: CareNavigationBarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      id: "dashboard" as CareNavDestination,
      label: "Dashboard",
      shortLabel: "Dashboard",
      subLabel: "My health",
      href: "/patient/dashboard",
      icon: Activity,
    },
    {
      id: "analyzer" as CareNavDestination,
      label: "Medicine Analyzer",
      shortLabel: "Analyzer",
      subLabel: "My medicines",
      href: "/patient/analyzer",
      icon: Sparkles,
    },
    {
      id: "reports" as CareNavDestination,
      label: "Medical Reports",
      shortLabel: "Reports",
      subLabel: "My reports",
      href: "/patient/reports",
      icon: FileText,
    },
    {
      id: "reminders" as CareNavDestination,
      label: "Medicine Reminders",
      shortLabel: "Reminders",
      subLabel: "My reminders",
      href: "/patient/reminders",
      icon: Clock,
      badge: pendingRemindersCount > 0 ? pendingRemindersCount : undefined,
    },
    {
      id: "consultation" as CareNavDestination,
      label: "Doctor Consultation",
      shortLabel: "Consult",
      subLabel: "My consultation",
      href: "/patient/consultation",
      icon: Stethoscope,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-2xl px-1 sm:px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:py-2.5 transition-all"
      aria-label="Patient Navigation"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-0.5 sm:gap-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive =
            currentDestination === item.id ||
            pathname === item.href ||
            (item.id === "dashboard" && pathname === "/patient");

          const handleClick = (e: React.MouseEvent) => {
            if (onSelectTab) {
              onSelectTab(item.id);
            }
          };

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={handleClick}
              className={`flex-1 py-1 sm:py-2 px-0.5 sm:px-2 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all duration-200 relative cursor-pointer text-center min-h-[48px] touch-manipulation ${
                isActive
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/25 scale-[1.02]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="relative">
                <IconComponent
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    isActive ? "stroke-[2.5]" : "stroke-[2]"
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-teal-500 text-white font-black text-[9px] sm:text-[10px] flex items-center justify-center border-2 border-white dark:border-slate-900">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] sm:text-xs font-bold tracking-tight leading-none block truncate max-w-[62px] sm:max-w-none ${
                  isActive ? "text-white" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
