"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { GameState, Answer } from "@/types";
import { getDailyCountries, getDailyRng, getTodayString } from "@/lib/daily";
import { buildQuestion } from "@/lib/choices";
import { matchesCountryName } from "@/lib/hardMode";
import { getTodayHardResult, saveTodayHardResult, updateStreak } from "@/lib/storage";
import { getProgression, saveProgression, getLevelForXP } from "@/lib/progression";
import { checkAchievements } from "@/lib/achievements";
import { playCorrect, playWrong, playCombo, playLevelUp, playAchievement } from "@/lib/sounds";
import ProgressBar from "@/components/ProgressBar";
import FlagCard from "@/components/FlagCard";
import HardModeInput from "@/components/HardModeInput";
import EducationCard from "@/components/EducationCard";
import ScoreScreen from "@/components/ScoreScreen";
import AchievementToast from "@/components/AchievementToast";
import XPBar from "@/components/XPBar";
import ThemeToggle from "@/components/ThemeToggle";
import Flame from "@/components/icons/Flame";
import type { Achievement } from "@/lib/achievements";
import { getStreak } from "@/lib/storage";

const HARD_BASE_XP = 15; // Higher than daily (10) to reward difficulty

export default function HardPage() {
  const router = useRouter();
  const [game, setGame] = useState<GameState | null>(null);
  const [submittedGuess, setSubmittedGuess] = useState<string | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [today, setToday] = useState("");
  const [totalXP, setTotalXP] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [inGameStreak, setInGameStreak] = useState(0);
  const [toastQueue, setToastQueue] = useState<Achievement[]>([]);
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);
  const prevLevelRef = useRef<number>(1);

  useEffect(() => {
    const prog = getProgression();
    setTotalXP(prog.totalXP);
    prevLevelRef.current = getLevelForXP(prog.totalXP).rank;
  }, []);

  useEffect(() => {
    if (!activeToast && toastQueue.length > 0) {
      setActiveToast(toastQueue[0]);
      setToastQueue((q) => q.slice(1));
    }
  }, [activeToast, toastQueue]);

  useEffect(() => {
    const todayStr = getTodayString();
    setToday(todayStr);
    const existing = getTodayHardResult(todayStr);
    const countries = getDailyCountries(todayStr);
    const rng = getDailyRng(todayStr);
    const questions = countries.map((c) => buildQuestion(c, rng));
    if (existing) {
      setGame({ questions, currentIndex: 10, answers: existing.answers, phase: "finished" });
    } else {
      setGame({ questions, currentIndex: 0, answers: [], phase: "playing" });
    }
  }, []);

  const handleAnswer = useCallback((guess: string) => {
    if (!game || game.phase !== "playing" || submittedGuess !== null) return;
    const correct = game.questions[game.currentIndex].country.name;
    const isCorrect = matchesCountryName(guess, correct);
    setSubmittedGuess(guess);
    setWasCorrect(isCorrect);

    if (isCorrect) {
      const newStreak = inGameStreak + 1;
      setInGameStreak(newStreak);
      const multiplier = newStreak >= 5 ? 2.0 : newStreak >= 3 ? 1.5 : 1.0;
      const xp = Math.round(HARD_BASE_XP * multiplier);
      setXpGained(xp);
      const prog = getProgression();
      const newXP = prog.totalXP + xp;
      const country = game.questions[game.currentIndex].country;
      const cs = { ...prog.continentStats };
      cs[country.continent] = { correct: (cs[country.continent]?.correct ?? 0) + 1, total: (cs[country.continent]?.total ?? 0) + 1 };
      saveProgression({ totalXP: newXP, continentStats: cs });
      setTotalXP(newXP);
      const newLevel = getLevelForXP(newXP).rank;
      if (newLevel > prevLevelRef.current) { prevLevelRef.current = newLevel; playLevelUp(); }
      else if (newStreak >= 3) playCombo(newStreak);
      else playCorrect();
    } else {
      setInGameStreak(0);
      setXpGained(0);
      const prog = getProgression();
      const country = game.questions[game.currentIndex].country;
      const cs = { ...prog.continentStats };
      cs[country.continent] = { correct: cs[country.continent]?.correct ?? 0, total: (cs[country.continent]?.total ?? 0) + 1 };
      saveProgression({ ...prog, continentStats: cs });
      playWrong();
    }
    setGame((prev) => prev ? { ...prev, phase: "revealed" } : prev);
  }, [game, submittedGuess, inGameStreak]);

  const handleNext = useCallback(() => {
    if (!game || wasCorrect === null) return;
    const correct = game.questions[game.currentIndex].country.name;
    const newAnswer: Answer = { questionIndex: game.currentIndex, chosenName: submittedGuess!, correct: wasCorrect };
    const newAnswers = [...game.answers, newAnswer];
    const nextIndex = game.currentIndex + 1;
    const finished = nextIndex >= game.questions.length;

    if (finished) {
      const score = newAnswers.filter((a) => a.correct).length;
      saveTodayHardResult({ date: today, score, answers: newAnswers });
      updateStreak(today);
      const prog = getProgression();
      const streak = getStreak();
      const newAchievements = checkAchievements({ answers: newAnswers, currentStreak: streak.currentStreak, totalXP: prog.totalXP, continentStats: prog.continentStats });
      if (newAchievements.length > 0) { setToastQueue((q) => [...q, ...newAchievements]); playAchievement(); }
      setGame((prev) => prev ? { ...prev, answers: newAnswers, phase: "finished" } : prev);
    } else {
      setGame((prev) => prev ? { ...prev, currentIndex: nextIndex, answers: newAnswers, phase: "playing" } : prev);
      setSubmittedGuess(null);
      setWasCorrect(null);
      setXpGained(0);
    }
  }, [game, submittedGuess, wasCorrect, today]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" && game?.phase === "revealed" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        handleNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [game?.phase, handleNext]);

  if (!game) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400 animate-pulse text-sm">Loading...</div>
      </div>
    );
  }

  const currentQuestion = game.questions[game.currentIndex];
  const multiplier = inGameStreak >= 5 ? 2.0 : inGameStreak >= 3 ? 1.5 : 1.0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-4 px-4">
      <AchievementToast achievement={activeToast} onDone={() => setActiveToast(null)} />
      <div className="w-full max-w-sm space-y-3">

        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            {game.phase !== "finished" && (
              <ProgressBar current={game.currentIndex + 1} total={game.questions.length} answers={game.answers.map((a) => a.correct)} />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hard</span>
            <ThemeToggle />
          </div>
        </div>

        {game.phase === "finished" ? (
          <ScoreScreen
            score={game.answers.filter((a) => a.correct).length}
            total={game.questions.length}
            answers={game.answers}
            questions={game.questions}
            date={today}
          />
        ) : (
          <>
            <XPBar totalXP={totalXP} xpGained={xpGained} />

            {inGameStreak >= 3 && game.phase === "playing" && (
              <div className="flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/30 rounded-lg py-1.5 px-3 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Flame size={14} /> {inGameStreak} in a row · {multiplier}x XP
              </div>
            )}

            <FlagCard country={currentQuestion.country} animationKey={game.currentIndex} />

            <HardModeInput
              phase={game.phase === "revealed" ? "revealed" : "playing"}
              correctName={currentQuestion.country.name}
              submittedGuess={submittedGuess}
              wasCorrect={wasCorrect}
              onSubmit={handleAnswer}
            />

            {game.phase === "revealed" && (
              <>
                <EducationCard country={currentQuestion.country} wasCorrect={wasCorrect ?? false} />
                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-base rounded-xl transition-all duration-200 active:scale-95 border border-amber-300"
                >
                  {game.currentIndex + 1 < game.questions.length ? "Next Flag →" : "See Results 🎉"}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
