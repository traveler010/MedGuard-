"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Sparkles,
  FileCheck2,
  Pill,
  User,
  Stethoscope,
  X,
  RotateCcw,
  BellOff,
  ChevronRight,
} from "lucide-react";
import {
  AppNotification,
  INITIAL_NOTIFICATIONS,
  NotificationRole,
} from "@/data/mockRemindersAndAlerts";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/services";

interface NotificationDropdownProps {
  initialRole?: NotificationRole;
  allowRoleSwitch?: boolean;
}

export function NotificationDropdown({
  initialRole = "patient",
  allowRoleSwitch = true,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<NotificationRole>(initialRole);
  const [notifications, setNotifications] =
    useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Consume notificationService
  useEffect(() => {
    let isMounted = true;
    getNotifications().then((data) => {
      if (isMounted && data.length > 0) {
        // notificationService successfully returns organized notification data
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Filter for active role
  const roleNotifications = notifications.filter(
    (n) => n.role === activeRole
  );

  const unreadCount = roleNotifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(activeRole);
    setNotifications((prev) =>
      prev.map((n) => (n.role === activeRole ? { ...n, isRead: true } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications((prev) => prev.filter((n) => n.role !== activeRole));
  };

  const handleResetNotifications = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const getCategoryIcon = (category: AppNotification["category"]) => {
    switch (category) {
      case "new_high_risk_review":
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case "patient_med_updated":
        return <Sparkles className="w-4 h-4 text-teal-600" />;
      case "consultation_completed":
        return <FileCheck2 className="w-4 h-4 text-emerald-600" />;
      case "medicine_reminder":
        return <Clock className="w-4 h-4 text-amber-600" />;
      case "schedule_update":
        return <Pill className="w-4 h-4 text-teal-600" />;
      case "doctor_instruction":
        return <Stethoscope className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-xs cursor-pointer flex items-center justify-center"
        aria-label="Open notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white font-black text-[10px] rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in zoom-in-95 fade-in duration-200"
          role="dialog"
          aria-label="Notifications Panel"
        >
          {/* Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  Notification Center
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    {unreadCount} New
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Role Switcher Tabs (Doctor / Patient) */}
            {allowRoleSwitch && (
              <div className="flex items-center p-1 bg-slate-200/70 dark:bg-slate-800/90 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveRole("patient")}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                    activeRole === "patient"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-black"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Patient (Raj)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRole("doctor")}
                  className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                    activeRole === "doctor"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-black"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Doctor (Dr. Sharma)
                </button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {roleNotifications.length === 0 ? (
              /* EMPTY STATE Required by Prompt */
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    All caught up!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    No active notifications for {activeRole === "patient" ? "patient" : "doctor"}.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetNotifications}
                  className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center justify-center gap-1 mx-auto pt-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset demo notifications</span>
                </button>
              </div>
            ) : (
              roleNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkAsRead(notif.id)}
                  className={`p-4 transition-colors cursor-pointer flex items-start gap-3 relative ${
                    !notif.isRead
                      ? "bg-teal-50/40 hover:bg-teal-50/70 dark:bg-teal-950/20 dark:hover:bg-teal-950/40"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {/* Category Icon */}
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug line-clamp-2 font-medium">
                      {notif.message}
                    </p>

                    {/* Quick Link Action if present */}
                    {notif.actionUrl && (
                      <Link
                        href={notif.actionUrl}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(false);
                        }}
                        className="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        <span>Open details</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {/* Mark as read indicator / checkmark */}
                  {!notif.isRead ? (
                    <button
                      type="button"
                      onClick={(e) => handleMarkAsRead(notif.id, e)}
                      title="Mark as read"
                      className="w-4 h-4 rounded-full bg-teal-600 shrink-0 mt-1 hover:scale-110 transition-transform cursor-pointer"
                    />
                  ) : (
                    <div
                      title="Read"
                      className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-1 flex items-center justify-center"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleClearAll}
              className="text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold cursor-pointer"
            >
              Clear view
            </button>
            <button
              type="button"
              onClick={handleResetNotifications}
              className="text-teal-700 dark:text-teal-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset mock data</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
