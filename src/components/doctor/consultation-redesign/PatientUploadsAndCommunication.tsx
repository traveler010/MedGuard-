"use client";

import React, { useState } from "react";
import {
  ConsultationPatientRecord,
  PatientUploadedFile,
  PatientChatMessage,
} from "./types";
import {
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Send,
  Upload,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  Download,
  X,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { useToast } from "@/components/Toast";

interface PatientUploadsAndCommunicationProps {
  patient: ConsultationPatientRecord;
  onSendClinicalResponse?: (message: string) => void;
  onUploadPrescription?: (file: File) => void;
}

export function PatientUploadsAndCommunication({
  patient,
  onSendClinicalResponse,
  onUploadPrescription,
}: PatientUploadsAndCommunicationProps) {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"uploads" | "chat" | "prescription">("uploads");
  const [previewFile, setPreviewFile] = useState<PatientUploadedFile | null>(null);

  // Chat state
  const [messages, setMessages] = useState<PatientChatMessage[]>(
    patient.chatMessages || [
      {
        id: "msg-init-1",
        sender: "patient",
        senderName: patient.name,
        text: patient.patientIntakeNote || "Hello Doctor, I have uploaded my recent test reports and prescription image for your review.",
        timestamp: "Today, 09:15 AM",
      },
    ]
  );
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Doctor Upload Prescription state
  const [uploadedDoctorPrescription, setUploadedDoctorPrescription] = useState<{
    name: string;
    size: string;
    date: string;
  } | null>(null);

  const prescriptions = patient.uploadedPrescriptions || [];
  const reports = patient.uploadedReports || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSending(true);
    const newMsg: PatientChatMessage = {
      id: `msg-doc-${Date.now()}`,
      sender: "doctor",
      senderName: "Dr. Sarah Mitchell",
      text: replyText.trim(),
      timestamp: "Just now",
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, newMsg]);
      if (onSendClinicalResponse) {
        onSendClinicalResponse(replyText.trim());
      }
      showToast(
        "Response Delivered",
        `Sent clinical guidance to ${patient.name}`,
        "success"
      );
      setReplyText("");
      setIsSending(false);
    }, 400);
  };

  const handleDoctorFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onUploadPrescription) {
      onUploadPrescription(file);
    }

    setUploadedDoctorPrescription({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: "Just now",
    });

    // Also post a clinical confirmation message into chat
    const rxMsg: PatientChatMessage = {
      id: `msg-doc-rx-${Date.now()}`,
      sender: "doctor",
      senderName: "Dr. Sarah Mitchell",
      text: `Authorized prescription file '${file.name}' has been uploaded and linked to your portal. Please review dosage instructions before confirming.`,
      timestamp: "Just now",
    };
    setMessages((prev) => [...prev, rxMsg]);

    showToast(
      "Prescription Authorized",
      `Uploaded and signed ${file.name} for ${patient.name}`,
      "success"
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 sm:p-7 space-y-6">
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block mb-0.5">
            Patient Submissions & Telehealth
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Patient Files, Intake & Chat
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("uploads")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "uploads"
                ? "bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-2xs font-extrabold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Files ({prescriptions.length + reports.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "chat"
                ? "bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-2xs font-extrabold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat ({messages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("prescription")}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "prescription"
                ? "bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-2xs font-extrabold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Authorize Rx</span>
          </button>
        </div>
      </div>

      {/* ━━━━━━━━━━ TAB 1: PATIENT UPLOADS ━━━━━━━━━━ */}
      {activeTab === "uploads" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Patient Note Card */}
          {patient.patientIntakeNote && (
            <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-800/60 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300">
                <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                <span>Patient Written Consultation Message</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic">
                &ldquo;{patient.patientIntakeNote}&rdquo;
              </p>
            </div>
          )}

          {/* Uploaded Prescriptions & Medicine Photos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Patient Uploaded Prescriptions & Images ({prescriptions.length})
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">Click to preview document</span>
            </div>

            {prescriptions.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                No prescription images uploaded by patient for this session.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prescriptions.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:border-teal-500/60 transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {file.size} • {file.uploadDate}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewFile(file)}
                      className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shared Medical Reports & Lab Results */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Shared Medical Reports & Lab Panels ({reports.length})
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">Verified lab records</span>
            </div>

            {reports.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                No medical reports linked to this intake.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reports.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:border-cyan-500/60 transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {file.size} • {file.uploadDate}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewFile(file)}
                      className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━ TAB 2: DOCTOR-PATIENT CHAT ━━━━━━━━━━ */}
      {activeTab === "chat" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 max-h-72 overflow-y-auto space-y-3">
            {messages.map((m) => {
              const isDoc = m.sender === "doctor";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isDoc ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mb-1">
                    <span>{m.senderName}</span>
                    <span>•</span>
                    <span className="font-mono">{m.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-md text-xs font-medium leading-relaxed ${
                      isDoc
                        ? "bg-teal-600 text-white rounded-tr-xs shadow-xs"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 rounded-tl-xs shadow-2xs"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Guidance Presets */}
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 self-center mr-1">
              Quick Templates:
            </span>
            {[
              "Reviewed your lab results; renal function is within safe target range.",
              "Adjusted analgesic candidate to avoid ACE inhibitor collision.",
              "Please take with morning meal and plenty of water.",
              "Authorized prescription attached; schedule doses in your reminders.",
            ].map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setReplyText(tmpl)}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              >
                {tmpl.slice(0, 36)}...
              </button>
            ))}
          </div>

          {/* Send Message Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Write clinical message or response to ${patient.name}...`}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 shadow-2xs"
            />
            <button
              type="submit"
              disabled={isSending || !replyText.trim()}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* ━━━━━━━━━━ TAB 3: AUTHORIZE PRESCRIPTION ━━━━━━━━━━ */}
      {activeTab === "prescription" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 space-y-2">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-teal-900 dark:text-teal-200">
                Doctor Authorized Prescription Upload
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Upload your signed prescription document (PDF or JPG). Once uploaded, the patient receives an instant notification in their portal, can view/download the document, and confirm adding the medication to their daily schedule.
            </p>
          </div>

          {/* Upload Area */}
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-teal-300 dark:border-teal-800/80 rounded-2xl bg-teal-50/30 dark:bg-teal-950/10 hover:bg-teal-50/60 dark:hover:bg-teal-950/20 transition cursor-pointer text-center space-y-2">
            <Upload className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            <div className="text-xs">
              <span className="font-bold text-teal-700 dark:text-teal-300">
                Click to upload authorized prescription
              </span>
              <span className="text-slate-400"> (PDF, JPG, PNG up to 10MB)</span>
            </div>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleDoctorFileUpload}
              className="hidden"
            />
          </label>

          {/* Current Uploaded Prescription Status */}
          {uploadedDoctorPrescription && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {uploadedDoctorPrescription.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {uploadedDoctorPrescription.size} • Authorized {uploadedDoctorPrescription.date}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300">
                Available to Patient
              </span>
            </div>
          )}
        </div>
      )}

      {/* FULL PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {previewFile.type === "image" ? (
                  <ImageIcon className="w-4 h-4 text-teal-600" />
                ) : (
                  <FileText className="w-4 h-4 text-cyan-600" />
                )}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-md">
                  {previewFile.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Body */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-300 flex items-center justify-center mx-auto">
                {previewFile.type === "image" ? (
                  <ImageIcon className="w-8 h-8" />
                ) : (
                  <FileText className="w-8 h-8" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {previewFile.name}
                </p>
                <p className="text-xs text-slate-400">
                  {previewFile.size} • Uploaded {previewFile.uploadDate}
                </p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Secure stream verified through HIPAA/GDPR clinical file gateway. Authenticated for Dr. Sarah Mitchell.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
