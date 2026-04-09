"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { GameState, Answer } from "@/types";
import { getDailyCountries, getDailyRng, getTodayString } from "@/lib/daily";
import { buildQuestion } from "@/lib/choices";
import {
  getTodayResult, saveResult, updateStreak, savePartialGame, getPartialGame, getStreak,
} from "@/lib/storage";
import {
  getProgression, saveProgression, xpForAnswer, streakMultiplier, getLevelForXP,
} from "@/lib/progression";
import { checkAchievements } from "@/lib/achievements";
import { playCorrect, playWrong, playCombo, playLevelUp, playAchievement } from "@/lib/sounds";
import ProgressBar from "@/components/ProgressBar";
import FlagCard from "@/components/FlagCard";
import AnswerGrid from "@/components/AnswerGrid";
import EducationCard from "@/components/EducationCard";
import ScoreScreen from "@/components/ScoreScreen";
import AchievementToast from "@/components/AchievementToast";
import XPBar from "@/components/XPBar";
import ThemeToggle from "@/components/ThemeToggle";
import Flame from "@/components/icons/Flame";
import type { Achievement } from "@/lib/achievements";

export default function PlayPage() {
  const router = useRouter();
  const [game, setGame] = useState<GameState | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [today, setToday] = useState<string>("");

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
    const existing = getTodayResult(todayStr);
    if (existing) {
      const countries = getDailyCountries(todayStr);
      const rng = getDailyRng(todayStr);
      const questions = countries.map((c) => buildQuestion(c, rng));
      setGame({ questions, currentIndex: 10, answers: existing.answers, phase: "finished" });
      return;
    }
    const partial = getPartialGame(todayStr);
    const countries = getDailyCountries(todayStr);
    const rng = getDailyRng(todayStr);
    const questions = countries.map((c) => buildQuestion(c, rng));
    if (partial && partial.currentIndex > 0) {
      setGame({ questions, currentIndex: partial.currentIndex, answers: partial.answers, phase: "playing" });
    } else {
      setGame({ questions, currentIndex: 0, answers: [], phase: "playing" });
    }
  }, []);

  const handleAnswer = useCallback((choice: string) => {
    if (!game || game.phase !== "playing" || selected) return;
    setSelected(choice);
    const correct = game.questions[game.currentIndex].country.name;
    const isCorrect = choice === correct;

    if (isCorrect) {
      const newStreak = inGameStreak + 1;
      setInGameStreak(newStreak);
      const xp = xpForAnswer(true, newStreak);
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
  }, [game, selected, inGameStreak]);

  const handleNext = useCallback(() => {
    if (!game) return;
    const correct = game.questions[game.currentIndex].country.name;
    const newAnswer: Answer = { questionIndex: game.currentIndex, chosenName: selected!, correct: selected === correct };
    const newAnswers = [...game.answers, newAnswer];
    const nextIndex = game.currentIndex + 1;
    const finished = nextIndex >= game.questions.length;

    if (finished) {
      const score = newAnswers.filter((a) => a.correct).length;
      saveResult({ date: today, score, answers: newAnswers });
      updateStreak(today);
      const prog = getProgression();
      const streak = getStreak();
      const newAchievements = checkAchievements({ answers: newAnswers, currentStreak: streak.currentStreak, totalXP: prog.totalXP, continentStats: prog.continentStats });
      if (newAchievements.length > 0) { setToastQueue((q) => [...q, ...newAchievements]); playAchievement(); }
      setGame((prev) => prev ? { ...prev, answers: newAnswers, phase: "finished" } : prev);
    } else {
      savePartialGame({ date: today, currentIndex: nextIndex, answers: newAnswers });
      setGame((prev) => prev ? { ...prev, currentIndex: nextIndex, answers: newAnswers, phase: "playing" } : prev);
      setSelected(null);
      setXpGained(0);
    }
  }, [game, selected, today]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" && game?.phase === "revealed") {
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
  const multiplier = streakMultiplier(inGameStreak);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-4 px-4">
      <AchievementToast achievement={activeToast} onDone={() => setActiveToast(null)} />

      <div className="w-full max-w-sm space-y-3">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            {game.phase !== "finished" && (
              <ProgressBar current={game.currentIndex + 1} total={game.questions.length} answers={game.answers.map((a) => a.correct)} />
            )}
          </div>
          <ThemeToggle />
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

            <AnswerGrid
              choices={currentQuestion.choices}
              correctName={currentQuestion.country.name}
              selected={selected}
              onSelect={handleAnswer}
            />

            {game.phase === "revealed" && (
              <>
                <EducationCard country={currentQuestion.country} wasCorrect={selected === currentQuestion.country.name} />
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
