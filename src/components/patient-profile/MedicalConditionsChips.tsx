"use client";

import React, { useState } from "react";
import { Activity, Plus, Check, ShieldCheck, Heart, Sparkles } from "lucide-react";

interface MedicalConditionsChipsProps {
  conditions: string[];
  onAddCondition?: (condition: string) => void;
}

const COMMON_CONDITIONS = [
  "Hypertension",
  "Type 2 Diabetes",
  "Osteoarthritis",
  "Atrial Fibrillation",
  "Chronic Kidney Disease",
  "Gastroesophageal Reflux (GERD)",
  "Hyperlipidemia",
  "Asthma",
  "Depression",
  "Insomnia",
];

export function MedicalConditionsChips({
  conditions: initialConditions,
  onAddCondition,
}: MedicalConditionsChipsProps) {
  const [conditions, setConditions] = useState<string[]>(initialConditions);
  const [isAdding, setIsAdding] = useState(false);
  const [newConditionInput, setNewConditionInput] = useState("");

  const handleAddNew = (conditionName: string) => {
    const trimmed = conditionName.trim();
    if (!trimmed || conditions.includes(trimmed)) return;
    const updated = [...conditions, trimmed];
    setConditions(updated);
    if (onAddCondition) onAddCondition(trimmed);
    setNewConditionInput("");
    setIsAdding(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Medical Conditions & Diagnoses</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active chronic and acute medical conditions affecting pharmacokinetics
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Add Condition</span>
        </button>
      </div>

      {/* Adding Form Popover */}
      {isAdding && (
        <div className="p-3 mb-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60 animate-in fade-in duration-200">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="e.g. Chronic Kidney Disease, Osteoarthritis..."
              value={newConditionInput}
              onChange={(e) => setNewConditionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddNew(newConditionInput);
              }}
              className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 rounded-xl border border-purple-200 dark:border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-800 dark:text-white"
            />
            <button
              onClick={() => handleAddNew(newConditionInput)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold cursor-pointer"
            >
              Add
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold text-purple-800 dark:text-purple-300 uppercase tracking-wider">Quick Suggestions:</span>
            {COMMON_CONDITIONS.filter((c) => !conditions.includes(c))
              .slice(0, 4)
              .map((c) => (
                <button
                  key={c}
                  onClick={() => handleAddNew(c)}
                  className="text-[11px] px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
                >
                  + {c}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Conditions Chips Grid */}
      <div className="flex flex-wrap items-center gap-2">
        {conditions.map((condition, index) => {
          return (
            <div
              key={index}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 border border-slate-200 dark:border-slate-700/60 hover:border-purple-200 dark:hover:border-purple-800 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors group"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>{condition}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
