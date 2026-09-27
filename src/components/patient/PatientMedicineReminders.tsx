"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Clock,
  CheckCircle2,
  Check,
  XCircle,
  RotateCcw,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  AlertCircle,
  Plus,
  Trash2,
  X,
  Pill,
  ShieldCheck,
  AlertTriangle,
  Play,
} from "lucide-react";
import { useToast } from "@/components/Toast";
import {
  updateStoredPatientMedicineStatus,
  saveStoredPatientMedicine,
  deleteStoredPatientMedicine,
} from "@/data/mockDoctorPortal";
import { remindersApi } from "@/services/api/reminders";
import { medicationsApi } from "@/services/api/medications";

export type ReminderStatus = "Upcoming" | "Taken" | "Skipped" | "Missed";

export interface ScheduledDoseItem {
  id: string;             // Unique identifier for this dose occurrence
  medicationId?: string;  // Parent medicine id
  name: string;
  dose: string;
  frequency: string;
  scheduledTime: string;  // e.g. "08:00 AM"
  scheduledDate: string;  // e.g. "2026-09-27"
  status: ReminderStatus;
  statusLabel?: string;   // e.g. "✓ Taken at 08:04 AM" or "— Skipped at 08:12 PM"
  actionTime?: string;    // e.g. "08:04 AM"
  instructions?: string;
  startDate?: string;
  endDate?: string;
}

const DEFAULT_SCHEDULED_DOSES: ScheduledDoseItem[] = [
  {
    id: "dose-1",
    medicationId: "med-1",
    name: "Paracetamol",
    dose: "500 mg",
    frequency: "Twice daily",
    scheduledTime: "08:00 AM",
    scheduledDate: new Date().toISOString().split("T")[0],
    status: "Taken",
    statusLabel: "✓ Taken at 08:04 AM",
    actionTime: "08:04 AM",
    instructions: "Take with water after breakfast.",
    startDate: "2026-09-27",
    endDate: "2026-09-30",
  },
  {
    id: "dose-2",
    medicationId: "med-2",
    name: "Joint Pain Relief Tablet",
    dose: "500 mg",
    frequency: "Once daily",
    scheduledTime: "01:00 PM",
    scheduledDate: new Date().toISOString().split("T")[0],
    status: "Upcoming",
    instructions: "Take with lunch to soothe joint pain.",
    startDate: "2026-09-27",
    endDate: "2026-10-05",
  },
  {
    id: "dose-3",
    medicationId: "med-1",
    name: "Paracetamol",
    dose: "500 mg",
    frequency: "Twice daily",
    scheduledTime: "08:00 PM",
    scheduledDate: new Date().toISOString().split("T")[0],
    status: "Upcoming",
    instructions: "Take after dinner before sleep.",
    startDate: "2026-09-27",
    endDate: "2026-09-30",
  },
];

interface PatientMedicineRemindersProps {
  initialMedicines?: ScheduledDoseItem[];
  onStatusChange?: (id: string, newStatus: ReminderStatus) => void;
}

export function PatientMedicineReminders({
  initialMedicines = DEFAULT_SCHEDULED_DOSES,
  onStatusChange,
}: PatientMedicineRemindersProps) {
  const { showToast } = useToast();

  // Primary dose items
  const [doses, setDoses] = useState<ScheduledDoseItem[]>(initialMedicines);

  // Active Reminder State
  const [activeAlarmDose, setActiveAlarmDose] = useState<ScheduledDoseItem | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [audioAutoplayBlocked, setAudioAutoplayBlocked] = useState<boolean>(false);

  // Add Medicine Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [medName, setMedName] = useState<string>("");
  const [medDose, setMedDose] = useState<string>("");
  const [medFrequency, setMedFrequency] = useState<string>("Twice daily");
  const [medTimes, setMedTimes] = useState<string[]>(["08:00 AM", "08:00 PM"]);
  const [newTimeInput, setNewTimeInput] = useState<string>("12:00 PM");
  const [medStartDate, setMedStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [medEndDate, setMedEndDate] = useState<string>("");
  const [medInstructions, setMedInstructions] = useState<string>("");

  // Web Audio Context & Beeper Interval references
  const audioContextRef = useRef<AudioContext | null>(null);
  const alarmIntervalRef = useRef<any>(null);
  const firedDoseIdsRef = useRef<Set<string>>(new Set());

  // Initialize or resume Web Audio context
  const getAudioContext = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume().catch(() => {
          setAudioAutoplayBlocked(true);
        });
      } else {
        setAudioAutoplayBlocked(false);
      }
      return audioContextRef.current;
    } catch {
      return null;
    }
  };

  // Beep Sound Synthesizer via Web Audio API
  const playChimeTone = () => {
    if (isAudioMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx || ctx.state === "suspended") {
        setAudioAutoplayBlocked(true);
        return;
      }
      setAudioAutoplayBlocked(false);

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      // Dual tone: F5 (698.46Hz) to A5 (880Hz)
      osc.frequency.setValueAtTime(698.46, now);
      osc.frequency.setValueAtTime(880.0, now + 0.14);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.start(now);
      osc.stop(now + 0.54);
    } catch (err) {
      console.warn("Web Audio tone playback error:", err);
    }
  };

  // Start continuous alarm sequence until stopped explicitly by TAKEN or SKIP
  const startAlarm = (dose: ScheduledDoseItem) => {
    setActiveAlarmDose(dose);

    // Stop any existing loop first
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
    }

    // Play tone immediately
    playChimeTone();

    // Repeat alarm chime every 1.5 seconds until patient selects Taken or Skip
    alarmIntervalRef.current = setInterval(() => {
      playChimeTone();
    }, 1500);

    // Send browser desktop notification if permission was granted
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      try {
        new Notification(`💊 Medicine Reminder: ${dose.name}`, {
          body: `Time: ${dose.scheduledTime} (${dose.dose}). Click to take or skip.`,
          icon: "/favicon.ico",
        });
      } catch (e) {}
    }
  };

  // Stop the alarm immediately
  const stopAlarm = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
    setActiveAlarmDose(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {}
      }
    };
  }, []);

  // Continuous Clock Monitoring
  useEffect(() => {
    const clockTimer = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // Convert current time to total minutes from midnight
      const nowTotalMinutes = currentHours * 60 + currentMinutes;

      doses.forEach((dose) => {
        if (dose.status !== "Upcoming" || firedDoseIdsRef.current.has(dose.id)) {
          return;
        }

        const parsedMinutes = parseTimeToMinutes(dose.scheduledTime);
        if (parsedMinutes === null) return;

        // If current time arrives at scheduled time
        if (nowTotalMinutes >= parsedMinutes && nowTotalMinutes <= parsedMinutes + 3) {
          firedDoseIdsRef.current.add(dose.id);
          startAlarm(dose);
        }
      });
    }, 2000);

    return () => clearInterval(clockTimer);
  }, [doses]);

  function parseTimeToMinutes(timeStr: string): number | null {
    try {
      const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (!match) return null;
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3] ? match[3].toUpperCase() : null;

      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      return hours * 60 + minutes;
    } catch {
      return null;
    }
  }

  // Action: [✓ TAKEN]
  const handleMarkTaken = async (id: string, doseName: string) => {
    stopAlarm();
    const actionTimeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setDoses((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "Taken",
              actionTime: actionTimeStr,
              statusLabel: `✓ Taken at ${actionTimeStr}`,
            }
          : d
      )
    );

    updateStoredPatientMedicineStatus("pat-1", doseName, "Taken", actionTimeStr);
    updateStoredPatientMedicineStatus("pat-2", doseName, "Taken", actionTimeStr);

    try {
      await remindersApi.markTaken(id);
    } catch {}

    onStatusChange?.(id, "Taken");
    showToast(
      "Medicine Taken ✓",
      `Marked ${doseName} as taken at ${actionTimeStr}. Exact time recorded.`,
      "success"
    );
  };

  // Action: [SKIP]
  const handleMarkSkipped = async (id: string, doseName: string) => {
    stopAlarm();
    const actionTimeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    setDoses((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "Skipped",
              actionTime: actionTimeStr,
              statusLabel: `— Skipped at ${actionTimeStr}`,
            }
          : d
      )
    );

    updateStoredPatientMedicineStatus("pat-1", doseName, "Skipped", actionTimeStr);
    updateStoredPatientMedicineStatus("pat-2", doseName, "Skipped", actionTimeStr);

    try {
      await remindersApi.markSkipped(id);
    } catch {}

    onStatusChange?.(id, "Skipped");
    showToast(
      "Medicine Skipped",
      `Marked ${doseName} as skipped for this dose at ${actionTimeStr}.`,
      "info"
    );
  };

  // Action: Reset back to Upcoming
  const handleResetToUpcoming = (id: string, doseName: string) => {
    setDoses((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "Upcoming",
              actionTime: undefined,
              statusLabel: undefined,
            }
          : d
      )
    );
    updateStoredPatientMedicineStatus("pat-1", doseName, "Upcoming");
    updateStoredPatientMedicineStatus("pat-2", doseName, "Upcoming");
    onStatusChange?.(id, "Upcoming");
    showToast("Status Reset", `Returned ${doseName} to upcoming.`, "info");
  };

  const handleOpenAddModal = () => {
    setMedName("");
    setMedDose("");
    setMedFrequency("Twice daily");
    setMedTimes(["08:00 AM", "08:00 PM"]);
    setMedStartDate(new Date().toISOString().split("T")[0]);
    setMedEndDate("");
    setMedInstructions("");
    setShowAddModal(true);
  };

  const handleAddTime = () => {
    if (newTimeInput && !medTimes.includes(newTimeInput)) {
      setMedTimes([...medTimes, newTimeInput]);
    }
  };

  const handleRemoveTime = (timeToRemove: string) => {
    if (medTimes.length > 1) {
      setMedTimes(medTimes.filter((t) => t !== timeToRemove));
    } else {
      showToast("Time Required", "Medicine must have at least one scheduled time.", "info");
    }
  };

  const handleSaveMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim() || !medDose.trim()) {
      showToast("Fields Required", "Please enter medicine name and dosage.", "info");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const newDoseItems: ScheduledDoseItem[] = [];

    medTimes.forEach((time, index) => {
      const doseId = `dose-${Date.now()}-${index}`;
      newDoseItems.push({
        id: doseId,
        medicationId: `med-${Date.now()}`,
        name: medName.trim(),
        dose: medDose.trim(),
        frequency: medFrequency,
        scheduledTime: time,
        scheduledDate: todayStr,
        status: "Upcoming",
        instructions: medInstructions.trim() || undefined,
        startDate: medStartDate,
        endDate: medEndDate || undefined,
      });

      // Save each occurrence in doctor portal sync store
      saveStoredPatientMedicine("pat-1", {
        id: doseId,
        name: medName.trim(),
        dose: medDose.trim(),
        frequency: medFrequency,
        scheduledTime: time,
        status: "○ Upcoming",
        statusType: "upcoming",
        instructions: medInstructions.trim() || undefined,
      });
      saveStoredPatientMedicine("pat-2", {
        id: doseId,
        name: medName.trim(),
        dose: medDose.trim(),
        frequency: medFrequency,
        scheduledTime: time,
        status: "○ Upcoming",
        statusType: "upcoming",
        instructions: medInstructions.trim() || undefined,
      });
    });

    setDoses((prev) => [...prev, ...newDoseItems]);
    showToast(
      "Medicine Added ✓",
      `Scheduled ${medTimes.length} daily reminder event(s) for ${medName}.`,
      "success"
    );

    try {
      await medicationsApi.addMedication({
        medicine_name: medName.trim(),
        dose: medDose.trim(),
        frequency: medFrequency,
        instructions: medInstructions.trim() || undefined,
        scheduled_times: medTimes,
      });
    } catch {}

    setShowAddModal(false);
  };

  const handleDeleteDose = (id: string, name: string) => {
    setDoses((prev) => prev.filter((d) => d.id !== id));
    deleteStoredPatientMedicine("pat-1", id);
    deleteStoredPatientMedicine("pat-2", id);
    showToast("Medicine Removed", `Removed ${name} from schedule.`, "info");
  };

  // Group into Timeline categories: PAST, CURRENT, UPCOMING
  const timelineCategories = useMemo(() => {
    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    const past: ScheduledDoseItem[] = [];
    const current: ScheduledDoseItem[] = [];
    const upcoming: ScheduledDoseItem[] = [];

    doses.forEach((d) => {
      if (d.status === "Taken" || d.status === "Skipped") {
        past.push(d);
        return;
      }

      const scheduledMinutes = parseTimeToMinutes(d.scheduledTime) ?? currentTotalMinutes;
      const diff = scheduledMinutes - currentTotalMinutes;

      if (activeAlarmDose?.id === d.id || (diff >= -30 && diff <= 15 && d.status === "Upcoming")) {
        current.push(d);
      } else if (scheduledMinutes < currentTotalMinutes) {
        past.push({
          ...d,
          status: "Missed",
          statusLabel: "⚠ Missed / Pending Action",
        });
      } else {
        upcoming.push(d);
      }
    });

    return { past, current, upcoming };
  }, [doses, activeAlarmDose]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Actions Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-1">
            Medication Schedule &amp; Alarms
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Medicine Reminders
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Continuous clock monitoring with audible chimes. Each scheduled dose is tracked independently.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Audio permission / Test Beeper */}
          <button
            type="button"
            onClick={() => {
              getAudioContext();
              playChimeTone();
              showToast("Alarm Test", "Playing sample melodic chime tone.", "info");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
            title="Test audible chime sound"
          >
            <Play className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Test Sound</span>
          </button>

          {/* Add Medicine Primary Action Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold uppercase tracking-wider transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Browser Autoplay Warning Banner if browser blocked audio */}
      {audioAutoplayBlocked && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Browser audio restricted: Click &apos;Enable Alarm Audio&apos; so medicine alarm chimes can play freely.</span>
          </div>
          <button
            type="button"
            onClick={() => {
              getAudioContext();
              playChimeTone();
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0 cursor-pointer"
          >
            Enable Alarm Audio
          </button>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ACTIVE REMINDER POPUP / OVERLAY (DOES NOT AUTO-DISMISS)
          Audible alarm continues until patient clicks TAKEN or SKIP
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {activeAlarmDose && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-teal-500/15 via-cyan-500/15 to-emerald-500/15 dark:from-teal-950/60 dark:via-cyan-950/50 dark:to-emerald-950/50 border-2 border-teal-500 shadow-2xl shadow-teal-500/20 space-y-6 animate-in zoom-in-95 duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center animate-bounce shadow-lg shrink-0">
                <BellRing className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">
                    💊 Medicine Reminder
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {activeAlarmDose.name}
                </h3>
                <p className="text-sm font-bold text-teal-700 dark:text-teal-400 mt-0.5">
                  It&apos;s time to take your medicine.
                </p>
              </div>
            </div>

            {/* Dose & Scheduled Time Badges */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 shadow-sm text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Dose</span>
                <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                  {activeAlarmDose.dose}
                </span>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 shadow-sm text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Time</span>
                <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                  {activeAlarmDose.scheduledTime}
                </span>
              </div>
            </div>
          </div>

          {activeAlarmDose.instructions && (
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-4 rounded-2xl border border-teal-200/80 dark:border-teal-900/80 font-medium">
              💡 <span className="font-bold">Instructions:</span> {activeAlarmDose.instructions}
            </div>
          )}

          {/* Alarm Status & Sound Toggle */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Alarm chime is sounding continuously. Make a choice to silence it.
            </span>
            <button
              type="button"
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              {isAudioMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-rose-500" />
                  <span>Unmute Alarm</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>Mute Sound</span>
                </>
              )}
            </button>
          </div>

          {/* Explicit Choice Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => handleMarkTaken(activeAlarmDose.id, activeAlarmDose.name)}
              className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm uppercase tracking-wider transition shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>✓ TAKEN</span>
            </button>

            <button
              type="button"
              onClick={() => handleMarkSkipped(activeAlarmDose.id, activeAlarmDose.name)}
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-sm uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              <span>SKIP</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile / Android Audio Policy Note */}
      <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-700 dark:text-slate-300">Android &amp; Mobile Browser Notice:</strong> Mobile browsers restrict audio playback when the screen is locked or browser is minimized. When MedGuard is active on your device, audible reminder chimes and visual alert cards sound continuously until you confirm <strong>TAKEN</strong> or <strong>SKIP</strong>.
        </p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          TODAY'S TIMELINE: PAST, CURRENT, UPCOMING
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Today&apos;s Medicine Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Each dose occurrence tracked independently for today.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-3 py-1 rounded-xl border border-teal-200 dark:border-teal-800">
            {new Date().toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
          </span>
        </div>

        {/* Section 1: CURRENT ACTION REQUIRED */}
        {timelineCategories.current.length > 0 && (
          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              CURRENT • TAKE MEDICINE
            </span>
            <div className="space-y-2">
              {timelineCategories.current.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border-2 border-teal-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      🔔
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-teal-800 dark:text-teal-300">
                          {item.scheduledTime}
                        </span>
                        <span className="text-xs font-bold text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-500">{item.frequency}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {item.name} <span className="font-normal text-slate-500 text-sm">({item.dose})</span>
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleMarkTaken(item.id, item.name)}
                      className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Taken</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkSkipped(item.id, item.name)}
                      className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: PAST DOSES */}
        {timelineCategories.past.length > 0 && (
          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>PAST</span>
              <span className="text-[10px] font-semibold text-slate-400">({timelineCategories.past.length})</span>
            </span>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              {timelineCategories.past.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-mono font-bold text-slate-500 w-20 shrink-0">
                      {item.scheduledTime}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.name} <span className="font-normal text-slate-400 text-xs">({item.dose})</span>
                      </h4>
                      {item.instructions && (
                        <p className="text-[11px] text-slate-400">{item.instructions}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                        item.status === "Taken"
                          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                          : item.status === "Skipped"
                          ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                          : "bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                      }`}
                    >
                      {item.statusLabel || (item.status === "Taken" ? "✓ Taken" : item.status === "Skipped" ? "— Skipped" : "⚠ Missed")}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleResetToUpcoming(item.id, item.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Undo action"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: UPCOMING DOSES */}
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span>UPCOMING</span>
            <span className="text-[10px] font-semibold text-slate-400">({timelineCategories.upcoming.length})</span>
          </span>
          {timelineCategories.upcoming.length === 0 ? (
            <p className="text-xs text-slate-400 italic p-4 text-center rounded-2xl bg-slate-50 dark:bg-slate-850/50">
              No further scheduled medicines remaining for today.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              {timelineCategories.upcoming.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 w-20 shrink-0">
                      {item.scheduledTime}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.name} <span className="font-normal text-slate-400 text-xs">({item.dose})</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">{item.frequency}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                      ○ Upcoming
                    </span>
                    <button
                      type="button"
                      onClick={() => startAlarm(item)}
                      className="px-2.5 py-1 text-xs font-bold text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/60 rounded-lg transition"
                      title="Trigger reminder alarm"
                    >
                      Ring Now
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDose(item.id, item.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Delete medicine"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Safety & Educational Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p>
          <span className="font-bold text-slate-700 dark:text-slate-300">MedGuard Observational Tracking:</span>{" "}
          This system reminds you about the schedule you or your healthcare provider entered. It does not replace professional clinical judgment. Patients remain responsible for following their prescribing physician&apos;s instructions.
        </p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          ADD MEDICINE MODAL
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Pill className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Add Medicine
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMedicine} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paracetamol"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-teal-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Dose *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500 mg"
                    value={medDose}
                    onChange={(e) => setMedDose(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-teal-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Frequency
                  </label>
                  <select
                    value={medFrequency}
                    onChange={(e) => setMedFrequency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-teal-500 font-medium"
                  >
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Four times daily">Four times daily</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>
              </div>

              {/* Multiple Reminder Times */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Scheduled Reminder Time(s) * (Multiple allowed)
                </label>
                <div className="flex flex-wrap gap-2 mb-2.5">
                  {medTimes.map((time) => (
                    <span
                      key={time}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 font-mono font-bold text-xs"
                    >
                      {time}
                      <button
                        type="button"
                        onClick={() => handleRemoveTime(time)}
                        className="hover:text-rose-500 cursor-pointer"
                        title="Remove time"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM or 08:00 PM"
                    value={newTimeInput}
                    onChange={(e) => setNewTimeInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleAddTime}
                    className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    + Add Time
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={medStartDate}
                    onChange={(e) => setMedStartDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={medEndDate}
                    onChange={(e) => setMedEndDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Optional Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Take with a full glass of water after breakfast."
                  value={medInstructions}
                  onChange={(e) => setMedInstructions(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-teal-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
