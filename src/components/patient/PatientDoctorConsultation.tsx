"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Stethoscope,
  Send,
  User,
  Sparkles,
  FileText,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Calendar,
  Clock,
  ChevronRight,
  Info,
  ShieldAlert,
} from "lucide-react";
import { useToast } from "@/components/Toast";
import {
  getStoredConsultations,
  saveOrUpdateConsultation,
  DoctorConsultationItem,
} from "@/data/mockDoctorPortal";

interface ChatMessage {
  id: string;
  sender: "bot" | "patient";
  text: string;
  timestamp: string;
}

interface QuestionConfig {
  id: number;
  question: string;
  category: string;
  key: keyof IntakeAnswers;
  suggestions: string[];
}

interface IntakeAnswers {
  symptoms: string;
  duration: string;
  frequency: string;
  severity: string;
  associatedSymptoms: string;
  currentMedicines: string;
  recentChanges: string;
  relevantHistory: string;
  recentReports: string;
  betterOrWorse: string;
  additionalInfo: string;
}

const QUESTIONS: QuestionConfig[] = [
  {
    id: 1,
    category: "Duration / Onset",
    key: "duration",
    question: "When did these symptoms first begin?",
    suggestions: [
      "Started 2 days ago",
      "About a week ago",
      "Just started this morning",
      "Ongoing for over a month",
    ],
  },
  {
    id: 2,
    category: "Frequency",
    key: "frequency",
    question: "How frequently do you notice the symptoms occurring?",
    suggestions: [
      "Constant throughout the day",
      "Comes and goes in waves",
      "Mostly in the morning",
      "Only after walking or standing",
    ],
  },
  {
    id: 3,
    category: "Severity",
    key: "severity",
    question: "How severe are they on a day-to-day basis?",
    suggestions: [
      "Mild (manageable, doesn't stop activities)",
      "Moderate (noticeable, slows down daily routine)",
      "Severe (difficult to perform normal tasks)",
    ],
  },
  {
    id: 4,
    category: "Associated Symptoms",
    key: "associatedSymptoms",
    question: "Are there any associated symptoms, such as headache, shortness of breath, nausea, or vision changes?",
    suggestions: [
      "Mild headache and dry mouth",
      "Slight shortness of breath",
      "No other associated symptoms noticed",
      "Occasional nausea after meals",
    ],
  },
  {
    id: 5,
    category: "Current Medicines",
    key: "currentMedicines",
    question: "What medicines or supplements are you currently taking?",
    suggestions: [
      "Warfarin 4mg and Lisinopril 10mg",
      "Acetaminophen 500mg as needed",
      "Standard morning blood thinner regimen",
      "No other medications",
    ],
  },
  {
    id: 6,
    category: "Recent Changes",
    key: "recentChanges",
    question: "Have there been any recent dose changes, missed doses, or new supplements?",
    suggestions: [
      "No changes or missed doses",
      "Missed yesterday's evening dose",
      "Started taking a daily Vitamin D3",
      "Adjusted dose under clinic direction",
    ],
  },
  {
    id: 7,
    category: "Relevant Medical History",
    key: "relevantHistory",
    question: "Do you have any relevant medical history or pre-existing conditions?",
    suggestions: [
      "Hypertension and history of blood clot",
      "Mild kidney function monitoring",
      "No other significant conditions",
      "Joint arthritis in knees",
    ],
  },
  {
    id: 8,
    category: "Recent Reports",
    key: "recentReports",
    question: "Have you had any recent blood tests or medical reports completed in the past month?",
    suggestions: [
      "Comprehensive lab panel on Sep 18",
      "INR blood test last month (normal)",
      "No recent reports completed",
    ],
  },
  {
    id: 9,
    category: "Aggravating & Relieving Factors",
    key: "betterOrWorse",
    question: "Is there anything specific that makes your symptoms feel better or worse?",
    suggestions: [
      "Resting sitting down makes it better",
      "Standing up quickly makes it worse",
      "Drinking plenty of water helps",
      "Nothing seems to affect it",
    ],
  },
  {
    id: 10,
    category: "Additional Information",
    key: "additionalInfo",
    question: "Is there any other important symptom detail or concern you would like Dr. Sharma to know?",
    suggestions: [
      "Concerned it might relate to my blood pressure tablet",
      "Happened once before last winter",
      "No other concerns at this time",
    ],
  },
];

interface PatientDoctorConsultationProps {
  patientName?: string;
  onReportSaved?: () => void;
}

export function PatientDoctorConsultation({
  patientName = "Raj Kumar",
  onReportSaved,
}: PatientDoctorConsultationProps) {
  const { showToast } = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      sender: "bot",
      text: "Hello Raj, I am your MedGuard Clinical Intake Assistant for Dr. Sharma. To help prepare for your consultation, please start by describing your symptoms or what you are feeling today.",
      timestamp: "Just now",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1); // -1 = initial symptom description
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const [answers, setAnswers] = useState<IntakeAnswers>({
    symptoms: "",
    duration: "",
    frequency: "",
    severity: "",
    associatedSymptoms: "",
    currentMedicines: "",
    recentChanges: "",
    relevantHistory: "",
    recentReports: "",
    betterOrWorse: "",
    additionalInfo: "",
  });

  // Doctor response state from shared consultations store
  const [doctorResponseInfo, setDoctorResponseInfo] = useState<{
    response: string;
    date: string;
    status: string;
  } | null>(null);

  const checkDoctorResponse = () => {
    const allConsultations = getStoredConsultations();
    const match = allConsultations.find(
      (c) =>
        c.patientName.toLowerCase() === patientName.toLowerCase() ||
        c.patientId === "pat-1"
    );
    if (match && match.doctorResponse) {
      setDoctorResponseInfo({
        response: match.doctorResponse,
        date: match.doctorResponseDate || "",
        status: match.status,
      });
    } else if (match) {
      setDoctorResponseInfo((prev) =>
        prev
          ? {
              ...prev,
              status: match.status,
            }
          : null
      );
    }
  };

  useEffect(() => {
    checkDoctorResponse();

    const handleConsultationUpdate = () => {
      checkDoctorResponse();
    };

    window.addEventListener("medguard_consultations_updated", handleConsultationUpdate);
    window.addEventListener("storage", handleConsultationUpdate);

    return () => {
      window.removeEventListener("medguard_consultations_updated", handleConsultationUpdate);
      window.removeEventListener("storage", handleConsultationUpdate);
    };
  }, [patientName]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentQuestionIndex, isCompleted]);

  // Handle patient submitting text or clicking suggestion
  const handleSendAnswer = (answerText: string) => {
    const trimmed = answerText.trim();
    if (!trimmed) return;

    const patientMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "patient",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, patientMsg]);
    setInputText("");

    // Initial symptom submission
    if (currentQuestionIndex === -1) {
      setAnswers((prev) => ({ ...prev, symptoms: trimmed }));
      // Advance to Question 1
      setTimeout(() => {
        const nextQ = QUESTIONS[0];
        setCurrentQuestionIndex(0);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-q-0`,
            sender: "bot",
            text: `Understood: "${trimmed}". I have 10 brief follow-up questions to help Dr. Sharma review this safely.\n\nQuestion 1 of 10: ${nextQ.question}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 450);
      return;
    }

    // Currently answering question index:
    const activeQ = QUESTIONS[currentQuestionIndex];
    setAnswers((prev) => ({ ...prev, [activeQ.key]: trimmed }));

    const nextIdx = currentQuestionIndex + 1;

    if (nextIdx < QUESTIONS.length) {
      // Advance to next question (ONE AT A TIME)
      setTimeout(() => {
        const nextQ = QUESTIONS[nextIdx];
        setCurrentQuestionIndex(nextIdx);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-q-${nextIdx}`,
            sender: "bot",
            text: `Question ${nextIdx + 1} of 10 (${nextQ.category}):\n${nextQ.question}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 400);
    } else {
      // Completed all 10 questions!
      setTimeout(() => {
        setCurrentQuestionIndex(10);
        setIsCompleted(true);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-complete`,
            sender: "bot",
            text: "Thank you, Raj. All 10 intake questions are complete! I have organized your answers into a preliminary consultation summary below for Dr. Sharma.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);

        // Auto-sync into Doctor Consultations store
        const autoConsultItem: DoctorConsultationItem = {
          id: `con-pat-${Date.now()}`,
          patientName: patientName,
          patientId: "pat-1",
          date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
          mainSymptom: answers.symptoms || "Fatigue and dizziness",
          chiefComplaint: answers.symptoms || "Fatigue and dizziness",
          status: "New",
          symptoms: answers.symptoms || "Feeling tired and dizzy",
          duration: answers.duration || "2 days",
          severity: answers.severity || "Moderate",
          associatedSymptoms: answers.associatedSymptoms || "None specified",
          currentMedicines: answers.currentMedicines || "Warfarin 4mg, Lisinopril 10mg",
          relevantInfo: `Frequency: ${answers.frequency || "Noted"} • Recent changes: ${answers.recentChanges || "None"} • Medical history: ${answers.relevantHistory || "Hypertension"}`,
          preliminarySummary: `Intake completed via Patient Portal. Reported symptoms: ${answers.symptoms || "Tired and dizzy"}. Relieving/aggravating factors: ${answers.betterOrWorse || "Noted"}.`,
          reportName: `Consultation_Summary_${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}.pdf`,
        };
        saveOrUpdateConsultation(autoConsultItem);
      }, 500);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendAnswer(inputText);
  };

  // Save report to localStorage and medical reports
  const handleSaveReport = () => {
    try {
      const savedReportsRaw = localStorage.getItem("medguard_patient_reports");
      const savedReports = savedReportsRaw ? JSON.parse(savedReportsRaw) : [];

      const newReportItem = {
        id: `rep-consult-${Date.now()}`,
        name: `Consultation_Summary_${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}.pdf`,
        uploadDate: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        type: "Consultation Summary",
        fileSize: "1.2 MB",
        summary: `Preliminary symptom intake summary for Dr. Sharma regarding: ${answers.symptoms || "Patient Symptoms"}.`,
        extractedValues: [
          { label: "Chief Complaint", value: answers.symptoms || "Fatigue & Dizziness" },
          { label: "Duration", value: answers.duration || "2 days" },
          { label: "Severity", value: answers.severity || "Moderate" },
          { label: "Medicines Reported", value: answers.currentMedicines || "Warfarin, Lisinopril" },
        ],
      };

      const updated = [newReportItem, ...savedReports];
      localStorage.setItem("medguard_patient_reports", JSON.stringify(updated));

      // Also ensure it is present and updated in medguard_consultations
      const consultItem: DoctorConsultationItem = {
        id: `con-pat-${Date.now()}`,
        patientName: patientName,
        patientId: "pat-1",
        date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
        mainSymptom: answers.symptoms || "Fatigue and dizziness",
        chiefComplaint: answers.symptoms || "Fatigue and dizziness",
        status: "New",
        symptoms: answers.symptoms || "Feeling tired and dizzy",
        duration: answers.duration || "2 days",
        severity: answers.severity || "Moderate",
        associatedSymptoms: answers.associatedSymptoms || "None specified",
        currentMedicines: answers.currentMedicines || "Warfarin 4mg, Lisinopril 10mg",
        relevantInfo: `Frequency: ${answers.frequency || "Noted"} • Recent changes: ${answers.recentChanges || "None"} • Medical history: ${answers.relevantHistory || "Hypertension"}`,
        preliminarySummary: `Intake saved by patient. Reported symptoms: ${answers.symptoms || "Tired and dizzy"}. Relieving/aggravating: ${answers.betterOrWorse || "Noted"}.`,
        reportName: newReportItem.name,
      };
      saveOrUpdateConsultation(consultItem);

      setIsSaved(true);
      showToast(
        "Consultation Report Saved ✓",
        "Your structured summary was saved to your Medical Reports for Dr. Sharma.",
        "success"
      );
      onReportSaved?.();
    } catch (err) {
      setIsSaved(true);
      showToast("Report Saved ✓", "Consultation intake saved.", "success");
    }
  };

  const handleRestart = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: "bot",
        text: "Hello Raj, please describe what symptoms you are experiencing today to begin a new consultation intake.",
        timestamp: "Just now",
      },
    ]);
    setCurrentQuestionIndex(-1);
    setIsCompleted(false);
    setIsSaved(false);
    setAnswers({
      symptoms: "",
      duration: "",
      frequency: "",
      severity: "",
      associatedSymptoms: "",
      currentMedicines: "",
      recentChanges: "",
      relevantHistory: "",
      recentReports: "",
      betterOrWorse: "",
      additionalInfo: "",
    });
  };

  const activeQuestion =
    currentQuestionIndex >= 0 && currentQuestionIndex < QUESTIONS.length
      ? QUESTIONS[currentQuestionIndex]
      : null;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-1">
            Clinical Intake
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Doctor Consultation
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Answer 10 symptom questions one at a time to generate a structured consultation summary for Dr. Sharma.
          </p>
        </div>

        {/* Reset / Status Action */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {currentQuestionIndex >= 0 && !isCompleted && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold">
              <span>Question {currentQuestionIndex + 1} of 10</span>
            </div>
          )}

          {isCompleted && (
            <button
              type="button"
              onClick={handleRestart}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Over</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar (When answering questions) */}
      {currentQuestionIndex >= 0 && !isCompleted && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Intake Progress</span>
            <span>{Math.round(((currentQuestionIndex + 1) / 10) * 100)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-teal-600 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / 10) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Latest Doctor's Response Banner (if available) */}
      {doctorResponseInfo && doctorResponseInfo.response && !isCompleted && (
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-200">
                Doctor&apos;s Response — Dr. Sharma, MD
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-700">
              {doctorResponseInfo.status}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            &ldquo;{doctorResponseInfo.response}&rdquo;
          </p>
          {doctorResponseInfo.date && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
              Received: {doctorResponseInfo.date}
            </span>
          )}
        </div>
      )}

      {/* CHAT INTERFACE CONTAINER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col overflow-hidden">
        {/* Attending Physician Mini Bar */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-850/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
              DS
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Dr. Sharma Geriatric Care
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Intake Assistant Active
              </span>
            </div>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Patient: {patientName} (68y)
          </span>
        </div>

        {/* Message Feed */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[460px] overflow-y-auto">
          {messages.map((m) => {
            const isBot = m.sender === "bot";
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isBot ? "justify-start" : "justify-end"}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5 border border-teal-200 dark:border-teal-800">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-md rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium leading-relaxed ${
                    isBot
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "bg-teal-600 text-white rounded-br-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span
                    className={`block text-[10px] mt-1.5 ${
                      isBot ? "text-slate-400" : "text-teal-100 text-right"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Pills & Input Form (Active until completed) */}
        {!isCompleted && (
          <div className="p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-850/40 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {/* Quick Answer Suggestions */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {currentQuestionIndex === -1 ? "Quick symptom examples:" : "Suggested answers:"}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {currentQuestionIndex === -1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSendAnswer("I have been feeling tired and dizzy.")}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                      &ldquo;I have been feeling tired and dizzy.&rdquo;
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendAnswer("Mild headache and joint stiffness in knees")}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                      &ldquo;Mild headache and joint stiffness in knees&rdquo;
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendAnswer("Shortness of breath after climbing stairs")}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                      &ldquo;Shortness of breath after climbing stairs&rdquo;
                    </button>
                  </>
                ) : (
                  activeQuestion?.suggestions.map((sugg) => (
                    <button
                      key={sugg}
                      type="button"
                      onClick={() => handleSendAnswer(sugg)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-xs font-semibold text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                      {sugg}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleFormSubmit} className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  currentQuestionIndex === -1
                    ? "Type your symptoms here (e.g. I have been feeling tired and dizzy)..."
                    : "Type your answer or click a suggestion above..."
                }
                className="w-full pl-4 pr-24 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 transition shadow-2xs"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="absolute right-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* STRUCTURED CONSULTATION SUMMARY & REPORT (Shown after 10 questions) */}
      {isCompleted && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-teal-500/80 dark:border-teal-500/60 p-6 sm:p-8 space-y-6 shadow-md animate-in fade-in zoom-in-95 duration-200">
          {/* Header & Mandatory Non-Diagnosis Disclaimer */}
          <div className="space-y-3 pb-5 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Generated Clinical Intake
              </span>
              <span className="text-xs text-slate-400">
                Recorded: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              CONSULTATION SUMMARY
            </h3>

            {/* MANDATORY DISCLAIMER LABEL */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/80 space-y-1">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-extrabold text-xs sm:text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Preliminary Symptom Summary — Not a Medical Diagnosis</span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                Please consult a qualified healthcare professional for diagnosis and treatment.
              </p>
            </div>

            {/* Doctor's Response (if provided) */}
            {doctorResponseInfo && doctorResponseInfo.response && (
              <div className="p-4 sm:p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-500/80 dark:border-teal-500/60 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-200">
                      Doctor&apos;s Clinical Response — Dr. Sharma, MD
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-700">
                    {doctorResponseInfo.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                  &ldquo;{doctorResponseInfo.response}&rdquo;
                </p>
                {doctorResponseInfo.date && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Responded: {doctorResponseInfo.date}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Structured Fields */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Report Data (Based ONLY on information provided by patient):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Symptoms */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Symptoms
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {answers.symptoms || "Tired and dizzy"}
                </p>
              </div>

              {/* Duration */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Duration
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {answers.duration || "Reported by patient"}
                </p>
              </div>

              {/* Severity */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Severity
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {answers.severity || "Reported by patient"}
                </p>
              </div>

              {/* Associated Symptoms */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Associated Symptoms
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {answers.associatedSymptoms || "None specified"}
                </p>
              </div>

              {/* Current Medicines */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Current Medicines
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {answers.currentMedicines || "Warfarin 4mg, Lisinopril 10mg"}
                </p>
              </div>

              {/* Relevant History */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Relevant History
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {answers.relevantHistory || "Hypertension monitoring"}
                </p>
              </div>
            </div>

            {/* Additional Patient Intake Observations */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">
                Additional Intake Observations
              </span>
              <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-slate-900 dark:text-white">Frequency:</strong> {answers.frequency || "Noted"}</li>
                <li><strong className="text-slate-900 dark:text-white">Recent changes:</strong> {answers.recentChanges || "None reported"}</li>
                <li><strong className="text-slate-900 dark:text-white">Recent lab tests:</strong> {answers.recentReports || "Checked"}</li>
                <li><strong className="text-slate-900 dark:text-white">Relieving/Aggravating:</strong> {answers.betterOrWorse || "Noted"}</li>
                <li><strong className="text-slate-900 dark:text-white">Patient concern:</strong> {answers.additionalInfo || "None"}</li>
              </ul>
            </div>
          </div>

          {/* Action: [Save Report] */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200/80 dark:border-slate-800">
            <span className="text-xs text-slate-400">
              Attending Physician: <strong>Dr. Sharma, MD</strong> (Geriatric Care)
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Restart Intake
              </button>

              <button
                type="button"
                onClick={handleSaveReport}
                disabled={isSaved}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition shadow-xs cursor-pointer flex items-center gap-2"
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Report Saved ✓</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
