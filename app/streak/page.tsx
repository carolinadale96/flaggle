"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Answer, Question } from "@/types";
import { getShuffledCountries } from "@/lib/daily";
import { buildQuestionFromPool } from "@/lib/choices";
import { getProgression, saveProgression, getLevelForXP, streakMultiplier, BASE_XP } from "@/lib/progression";
import { getStreakPB, saveStreakPB } from "@/lib/storage";
import { playCorrect, playWrong, playCombo, playLevelUp } from "@/lib/sounds";
import FlagCard from "@/components/FlagCard";
import AnswerGrid from "@/components/AnswerGrid";
import EducationCard from "@/components/EducationCard";
import XPBar from "@/components/XPBar";
import ThemeToggle from "@/components/ThemeToggle";
import Flame from "@/components/icons/Flame";
import CorrectIcon from "@/components/icons/CorrectIcon";
import WrongIcon from "@/components/icons/WrongIcon";

type Phase = "playing" | "revealed" | "gameover";

interface RunState {
  questions: Question[];
  currentIndex: number;
  runStreak: number;
  lastAnswer: boolean | null;
  phase: Phase;
}

function generateQuestions(): Question[] {
  const countries = getShuffledCountries();
  const rng = Math.random;
  return countries.map((c) => buildQuestionFromPool(c, countries, rng));
}

export default function StreakPage() {
  const router = useRouter();
  const [run, setRun] = useState<RunState | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [totalXP, setTotalXP] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [pb, setPb] = useState(0);
  const [isNewPb, setIsNewPb] = useState(false);
  const prevLevelRef = useRef<number>(1);

  useEffect(() => {
    const prog = getProgression();
    setTotalXP(prog.totalXP);
    prevLevelRef.current = getLevelForXP(prog.totalXP).rank;
    setPb(getStreakPB());
    startRun();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startRun() {
    setRun({ questions: generateQuestions(), currentIndex: 0, runStreak: 0, lastAnswer: null, phase: "playing" });
    setSelected(null);
    setXpGained(0);
    setIsNewPb(false);
  }

  const handleAnswer = useCallback((choice: string) => {
    if (!run || run.phase !== "playing" || selected) return;
    setSelected(choice);
    const correct = run.questions[run.currentIndex].country.name;
    const isCorrect = choice === correct;

    if (isCorrect) {
      const newStreak = run.runStreak + 1;
      const mult = Math.min(streakMultiplier(newStreak), 3.0); // cap at 3x
      const xp = Math.round(BASE_XP * mult);
      setXpGained(xp);
      const prog = getProgression();
      const newXP = prog.totalXP + xp;
      const country = run.questions[run.currentIndex].country;
      const cs = { ...prog.continentStats };
      cs[country.continent] = { correct: (cs[country.continent]?.correct ?? 0) + 1, total: (cs[country.continent]?.total ?? 0) + 1 };
      saveProgression({ totalXP: newXP, continentStats: cs });
      setTotalXP(newXP);
      const newLevel = getLevelForXP(newXP).rank;
      if (newLevel > prevLevelRef.current) { prevLevelRef.current = newLevel; playLevelUp(); }
      else if (newStreak >= 3) playCombo(newStreak);
      else playCorrect();
      setRun((prev) => prev ? { ...prev, runStreak: newStreak, lastAnswer: true, phase: "revealed" } : prev);
    } else {
      setXpGained(0);
      const prog = getProgression();
      const country = run.questions[run.currentIndex].country;
      const cs = { ...prog.continentStats };
      cs[country.continent] = { correct: cs[country.continent]?.correct ?? 0, total: (cs[country.continent]?.total ?? 0) + 1 };
      saveProgression({ ...prog, continentStats: cs });
      playWrong();
      // Update PB
      const currentPb = getStreakPB();
      if (run.runStreak > currentPb) {
        saveStreakPB(run.runStreak);
        setPb(run.runStreak);
        setIsNewPb(true);
      }
      setRun((prev) => prev ? { ...prev, lastAnswer: false, phase: "revealed" } : prev);
    }
  }, [run, selected]);

  const handleNext = useCallback(() => {
    if (!run) return;
    if (!run.lastAnswer) {
      // Game over — stay on revealed to show end screen
      setRun((prev) => prev ? { ...prev, phase: "gameover" } : prev);
      return;
    }
    const nextIndex = run.currentIndex + 1;
    // If we've exhausted the question list, regenerate
    if (nextIndex >= run.questions.length) {
      const newQuestions = generateQuestions();
      setRun((prev) => prev ? { ...prev, questions: newQuestions, currentIndex: 0, phase: "playing" } : prev);
    } else {
      setRun((prev) => prev ? { ...prev, currentIndex: nextIndex, phase: "playing" } : prev);
    }
    setSelected(null);
    setXpGained(0);
  }, [run]);

  if (!run) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400 animate-pulse text-sm">Loading...</div>
      </div>
    );
  }

  const currentQuestion = run.questions[run.currentIndex];
  const multiplier = Math.min(streakMultiplier(run.runStreak), 3.0);

  // ── Game over ───────────────────────────────────────────────────────────────
  if (run.phase === "gameover") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-4 px-4">
        <div className="w-full max-w-sm space-y-5">
          <div className="flex items-center justify-between">
            <button onClick={() => router.push("/")} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-slate-900 dark:text-white font-bold text-base">Streak</h1>
            <ThemeToggle />
          </div>

          <div className="text-center space-y-2 py-2">
            <div className="flex justify-center">
              <WrongIcon size={48} />
            </div>
            <p className="text-slate-400 uppercase tracking-widest text-xs font-semibold">Run over</p>
            <p className="text-7xl font-bold text-slate-900 dark:text-white">{run.runStreak}</p>
            <p className="text-slate-400 text-sm">in a row</p>
            {isNewPb ? (
              <p className="text-amber-500 dark:text-amber-400 font-bold text-sm">New personal best!</p>
            ) : (
              <p className="text-slate-400 text-sm">Best: <span className="font-bold text-slate-700 dark:text-slate-300">{pb}</span></p>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-2">Ended on</p>
            <div className="flex items-center gap-2">
              <span className={`fi fi-${currentQuestion.country.iso2} rounded`} style={{ fontSize: "1.5rem", display: "inline-block" }} />
              <span className="font-semibold text-slate-900 dark:text-white">{currentQuestion.country.name}</span>
            </div>
          </div>

          <button
            onClick={startRun}
            className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-lg rounded-xl border border-amber-300 transition-all active:scale-95"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ── Playing / revealed ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-4 px-4">
      <div className="w-full max-w-sm space-y-3">

        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Flame size={16} />
              <span className="text-2xl font-bold text-amber-500 dark:text-amber-400">{run.runStreak}</span>
              <span className="text-slate-400 text-xs">in a row</span>
              {pb > 0 && <span className="text-slate-400 text-xs ml-auto">Best: {pb}</span>}
            </div>
          </div>
          <ThemeToggle />
        </div>

        <XPBar totalXP={totalXP} xpGained={xpGained} />

        {run.runStreak >= 3 && run.phase === "playing" && (
          <div className="flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/30 rounded-lg py-1.5 px-3 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Flame size={14} /> {run.runStreak} in a row · {multiplier}x XP
          </div>
        )}

        <FlagCard country={currentQuestion.country} animationKey={run.currentIndex} />

        <AnswerGrid
          choices={currentQuestion.choices}
          correctName={currentQuestion.country.name}
          selected={selected}
          onSelect={handleAnswer}
        />

        {run.phase === "revealed" && (
          <>
            {run.lastAnswer && (
              <div className="flex items-center gap-2 justify-center">
                <CorrectIcon size={20} />
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">Keep going!</span>
              </div>
            )}
            <EducationCard country={currentQuestion.country} wasCorrect={run.lastAnswer ?? false} />
            <button
              onClick={handleNext}
              className={`w-full py-3 font-bold text-base rounded-xl transition-all duration-200 active:scale-95 border ${
                run.lastAnswer
                  ? "bg-amber-400 hover:bg-amber-300 text-slate-900 border-amber-300"
                  : "bg-red-500 hover:bg-red-400 text-white border-red-400"
              }`}
            >
              {run.lastAnswer ? "Next Flag →" : "See result"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
