'use client';

import React, { useState } from 'react';
import { Patient } from '@/data/mockPatients';
import {
  Sparkles,
  Send,
  MessageSquare,
  Bot,
  User,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

interface CaregiverAiAssistantProps {
  patient: Patient;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const FAQ_PROMPTS = [
  'Can Mom take Tylenol (Acetaminophen) for a headache?',
  'What should we do if we forgot the 8:00 AM morning pills?',
  'Why did Dr. Al-Mansoor advise stopping the OTC sleep aid?',
  'Can she drink coffee with her morning medicine?',
];

export function CaregiverAiAssistant({ patient }: CaregiverAiAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello! I am your MediQX Care Assistant. I have Eleanor's complete doctor-verified medication schedule and safety notes in front of me. How can I help you support her today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (queryText?: string) => {
    const query = queryText || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Realistic intelligent response logic based on patient's actual regimen
    setTimeout(() => {
      let responseText = '';
      const q = query.toLowerCase();

      if (q.includes('tylenol') || q.includes('acetaminophen') || q.includes('headache')) {
        responseText = `Yes, Tylenol (Acetaminophen) is generally safe for Eleanor! Unlike Advil/Aleve/Ibuprofen (which cause serious bleeding with her Warfarin and hurt her kidneys), Tylenol does not harm the stomach lining. Keep the dose under 500 mg per dose and do not exceed 2,000 mg in a 24-hour period.`;
      } else if (q.includes('missed') || q.includes('forgot')) {
        responseText = `If it has only been 2 to 4 hours since her scheduled 8:00 AM dose, she can go ahead and take it with a snack. However, if it is already past 2:00 PM, skip the missed morning dose and resume at normal time tomorrow. NEVER double up pills to make up for a forgotten dose!`;
      } else if (q.includes('sleep') || q.includes('sominex') || q.includes('benadryl') || q.includes('allergy')) {
        responseText = `Dr. Al-Mansoor strongly recommends stopping over-the-counter sleep aids (like Benadryl/Diphenhydramine). In older adults, these medicines linger in the body for up to 24 hours, causing morning dizziness, confusion, urinary retention, and significantly increase the risk of nighttime tripping and falls. A warm bath and low-dose Melatonin (1mg) are much safer.`;
      } else if (q.includes('coffee') || q.includes('tea') || q.includes('caffeine')) {
        responseText = `A single cup of morning coffee is generally fine, but wait about 30 minutes after taking her Omeprazole stomach pill before drinking coffee or breakfast, as Omeprazole needs an empty stomach to coat and protect properly.`;
      } else {
        responseText = `Based on Eleanor's current 9 active prescriptions and reduced kidney clearance (eGFR 34), we always advise double-checking any new supplement, tea, or painkiller before taking it. Tylenol is safe for pain, but avoid all NSAIDs (Ibuprofen, Naproxen, Aspirin). If she is experiencing nausea, dizziness, or unusual tiredness, notify Dr. Al-Mansoor's clinic at (555) 382-9014.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'ai',
          text: responseText,
          timestamp: 'Just now',
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden mb-8">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Ask MediQX Care AI
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Caregiver Helper
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear, safe answers tailored to {patient.name}&apos;s specific prescriptions.
            </p>
          </div>
        </div>

        <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Clinical Safety Engine
        </span>
      </div>

      {/* Suggested Questions */}
      <div className="p-4 bg-teal-50/40 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
          Frequently Asked by Family & Caregivers:
        </span>
        <div className="flex flex-wrap gap-2">
          {FAQ_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-teal-200/80 dark:border-teal-900/60 hover:border-teal-400 dark:hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-2xs text-left cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="p-5 max-h-80 overflow-y-auto space-y-3.5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 font-bold ${
                msg.sender === 'user'
                  ? 'bg-slate-900 dark:bg-teal-600 text-white'
                  : 'bg-teal-600 text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-slate-900 dark:bg-teal-600 text-white rounded-tr-xs'
                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-xs'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic pl-10">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
            <span>MediQX AI checking clinical pharmacology...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask a question about food, missed doses, side effects, or OTC medicines..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-teal-500 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
}
