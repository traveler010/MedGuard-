"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Filter,
} from "lucide-react";
import {
  DoctorAppointment,
  AppointmentStatus,
  AppointmentCategory,
  getStoredAppointments,
  updateAppointmentStatus,
} from "@/data/mockDoctorPortal";
import { useToast } from "@/components/Toast";

interface DoctorAppointmentsViewProps {
  initialPatientFilter?: string;
  onSelectPatient?: (patientId: string) => void;
}

export function DoctorAppointmentsView({
  initialPatientFilter,
  onSelectPatient,
}: DoctorAppointmentsViewProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [activeCategory, setActiveCategory] = useState<AppointmentCategory>("TODAY");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | AppointmentStatus>("ALL");

  const refreshAppointments = () => {
    const list = getStoredAppointments();
    setAppointments(list);
  };

  useEffect(() => {
    refreshAppointments();

    const handleUpdate = () => {
      refreshAppointments();
    };

    window.addEventListener("medguard_appointments_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("medguard_appointments_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const counts = useMemo(() => {
    return {
      today: appointments.filter((a) => a.category === "TODAY").length,
      upcoming: appointments.filter((a) => a.category === "UPCOMING").length,
      completed: appointments.filter((a) => a.category === "COMPLETED").length,
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      if (initialPatientFilter && a.patientId !== initialPatientFilter) {
        return false;
      }

      const matchCategory = a.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        a.patientName.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.time.toLowerCase().includes(q);

      const matchStatus = statusFilter === "ALL" || a.status === statusFilter;

      return matchCategory && matchSearch && matchStatus;
    });
  }, [appointments, activeCategory, searchQuery, statusFilter, initialPatientFilter]);

  const handleStatusChange = (id: string, newStatus: AppointmentStatus, patientName: string) => {
    updateAppointmentStatus(id, newStatus);
    refreshAppointments();
    showToast(
      "Appointment Updated ✓",
      `${patientName}'s appointment marked as ${newStatus}.`,
      "success"
    );
  };

  const getStatusBadgeClass = (status: AppointmentStatus) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Upcoming":
        return "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800";
      case "Completed":
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700";
      case "Cancelled":
        return "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs: TODAY | UPCOMING | COMPLETED */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 overflow-x-auto self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveCategory("TODAY")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeCategory === "TODAY"
                ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-2xs border border-slate-200/60 dark:border-slate-800"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>TODAY</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {counts.today}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory("UPCOMING")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeCategory === "UPCOMING"
                ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-2xs border border-slate-200/60 dark:border-slate-800"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>UPCOMING</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {counts.upcoming}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory("COMPLETED")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeCategory === "COMPLETED"
                ? "bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-2xs border border-slate-200/60 dark:border-slate-800"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>COMPLETED</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {counts.completed}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient or appointment..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
          />
        </div>
      </div>

      {/* APPOINTMENT LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No appointments found in this section.
            </p>
            <p className="text-xs text-slate-400">
              Appointments scheduled for {activeCategory.toLowerCase()} will appear here.
            </p>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-850/40 transition"
            >
              {/* Left: Patient, Date, Time, Type, Status */}
              <div className="flex items-start sm:items-center gap-4">
                {/* Time Badge */}
                <div className="px-3.5 py-2 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 font-mono font-black text-xs sm:text-sm shrink-0 text-center">
                  <span className="block">{apt.time}</span>
                  <span className="text-[10px] text-teal-700 dark:text-teal-400 font-sans font-medium block">
                    {apt.date}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {apt.patientName}
                    </h3>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                        apt.status
                      )}`}
                    >
                      {apt.status}
                    </span>

                    {apt.room && (
                      <span className="text-xs text-slate-400 font-medium">
                        • {apt.room}
                      </span>
                    )}
                  </div>

                  {/* Appointment Type */}
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {apt.type} • <span className="text-slate-400 font-normal">{apt.duration}</span>
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Attending: {apt.doctorName || "Dr. Sharma, MD"} • Patient ID: {apt.patientId}
                  </p>
                </div>
              </div>

              {/* Actions: [View Patient] & [View Consultation] */}
              <div className="flex flex-wrap items-center gap-2 self-end md:self-auto shrink-0">
                {/* Action 1: [View Patient] */}
                <Link
                  href={`/doctor/patients/${apt.patientId}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Patient</span>
                </Link>

                {/* Action 2: [View Consultation] */}
                <Link
                  href="/doctor/consultations"
                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Consultation</span>
                </Link>

                {/* Status Toggle Quick Action */}
                {apt.status !== "Completed" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(apt.id, "Completed", apt.patientName)}
                    className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition cursor-pointer"
                    title="Mark Completed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
