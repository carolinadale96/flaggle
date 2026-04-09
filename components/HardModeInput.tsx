"use client";

import { useState, useEffect, useRef } from "react";

interface HardModeInputProps {
  phase: "playing" | "revealed";
  correctName: string;
  submittedGuess: string | null;
  wasCorrect: boolean | null;
  onSubmit: (guess: string) => void;
}

export default function HardModeInput({ phase, correctName, submittedGuess, wasCorrect, onSubmit }: HardModeInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset and focus on new question
  useEffect(() => {
    if (phase === "playing") {
      setInput("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [phase, correctName]);

  function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  if (phase === "revealed" && submittedGuess !== null) {
    return (
      <div className={`rounded-2xl px-4 py-3 border-2 ${wasCorrect ? "bg-green-50 dark:bg-green-900/20 border-green-400" : "bg-red-50 dark:bg-red-900/20 border-red-400"}`}>
        <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${wasCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          {wasCorrect ? "Correct!" : "Wrong"}
        </p>
        <p className={`font-semibold text-base ${wasCorrect ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}`}>
          You typed: {submittedGuess}
        </p>
        {!wasCorrect && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Answer: <span className="font-bold text-slate-900 dark:text-white">{correctName}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Type the country name..."
        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-base focus:outline-none focus:border-amber-400 transition-colors"
        autoComplete="off"
        autoCapitalize="words"
      />
      <button
        onClick={handleSubmit}
        disabled={!input.trim()}
        className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 text-slate-900 font-bold text-base rounded-xl transition-all duration-200 active:scale-95 border border-amber-300 disabled:border-slate-200 dark:disabled:border-slate-700"
      >
        Submit
      </button>
    </div>
  );
}
