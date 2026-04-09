"use client";

import { useState, useEffect } from "react";
import { ChevronRight, X } from "lucide-react";
import CountryFlag from "@/components/CountryFlag";

const ONBOARDING_KEY = "flaggle_onboarded";

const STEPS = [
  {
    flag: "br",
    title: "Guess the flag",
    body: "Every day you get 10 flags from around the world. Pick the right country from 4 choices.",
  },
  {
    flag: "jp",
    title: "Learn as you go",
    body: "After each answer you'll see the flag anatomy, capital, and fun facts. Even wrong answers teach you something.",
  },
  {
    flag: "za",
    title: "Build your streak",
    body: "Come back every day to grow your streak and level up from Tourist all the way to Flag Master. 197 countries await.",
  },
];

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      setOpen(true);
    }
  }, []);

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  }

  function dismiss() {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  const s = STEPS[step];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dismiss} />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden">

        {/* Dismiss */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 z-10"
        >
          <X size={18} />
        </button>

        {/* Flag hero */}
        <div className="bg-amber-50 dark:bg-amber-400/10 flex justify-center py-8">
          <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
            <CountryFlag iso2={s.flag} style={{ width: "9rem", height: "6rem", display: "block" }} />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pt-5 pb-6 space-y-4">
          <div className="space-y-1.5">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              {step + 1} of {STEPS.length}
            </p>
            <h2 className="text-slate-900 dark:text-white text-xl font-extrabold">{s.title}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.body}</p>
          </div>

          {/* Step dots */}
          <div className="flex gap-1.5 justify-center">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-amber-400" : "w-1.5 bg-slate-200 dark:bg-slate-700"}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-base rounded-2xl transition-all duration-200 active:scale-95 border border-amber-300 flex items-center justify-center gap-2"
          >
            {step < STEPS.length - 1 ? (
              <>Next <ChevronRight size={18} /></>
            ) : (
              "Let's play!"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
