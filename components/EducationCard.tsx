"use client";

import { useState } from "react";
import type { Country } from "@/types";

interface EducationCardProps {
  country: Country;
  wasCorrect: boolean;
}

export default function EducationCard({ country, wasCorrect }: EducationCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="education-card-enter mt-2 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/80 overflow-hidden">

      {/* Header */}
      <div className={`px-4 py-3 flex items-center gap-3 ${wasCorrect ? "bg-green-50 dark:bg-green-700/40" : "bg-red-50 dark:bg-red-700/40"}`}>
        <span className="text-xl">{wasCorrect ? "✓" : "✗"}</span>
        <div>
          <p className={`text-xs font-semibold uppercase tracking-widest ${wasCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {wasCorrect ? "Correct!" : "The answer was"}
          </p>
          <p className="text-slate-900 dark:text-white text-lg font-bold">{country.name}</p>
        </div>
        <span
          className={`fi fi-${country.iso2} ml-auto rounded-md overflow-hidden shadow`}
          style={{ fontSize: "2rem", lineHeight: 1, display: "block" }}
        />
      </div>

      {/* Fun fact — always visible */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{country.funFact}</p>
      </div>

      {/* Dig deeper toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-sm border-t border-slate-100 dark:border-slate-700/60 transition-colors text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300"
      >
        <span className="font-semibold">{expanded ? "Show less" : "Dig deeper →"}</span>
        <span className="text-slate-400 text-xs">anatomy · look-alikes</span>
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-700/60">

          {/* Capital + Region */}
          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="flex items-start gap-2">
              <span className="text-base mt-0.5">🏛️</span>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Capital</p>
                <p className="text-slate-900 dark:text-white font-medium text-sm">{country.capital}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-base mt-0.5">🌍</span>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Region</p>
                <p className="text-slate-900 dark:text-white font-medium text-sm">{country.region}</p>
                <p className="text-slate-400 text-xs">{country.continent}</p>
              </div>
            </div>
          </div>

          {/* Flag anatomy */}
          {country.flagElements && country.flagElements.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">🎨 Flag anatomy</p>
              {country.flagElements.map((fe, i) => (
                <div key={i} className="flex items-baseline gap-2 text-sm">
                  <span className="text-amber-500 dark:text-amber-400 font-semibold shrink-0">{fe.element}</span>
                  <span className="text-slate-300 dark:text-slate-500 shrink-0">→</span>
                  <span className="text-slate-600 dark:text-slate-300">{fe.meaning}</span>
                </div>
              ))}
            </div>
          )}

          {/* Confused with */}
          {country.confusedWith && country.confusedWith.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">🤔 Often confused with</p>
              {country.confusedWith.map((c, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-600/50">
                  <span className={`fi fi-${c.iso2} rounded`} style={{ fontSize: "1.25rem", display: "inline-block", flexShrink: 0 }} />
                  <div>
                    <p className="text-slate-900 dark:text-white text-sm font-medium">{c.name}</p>
                    <p className="text-slate-500 text-xs leading-snug">{c.note}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
