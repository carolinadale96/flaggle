"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { GameState, Answer } from "@/types";
import { getDailyCountries, getDailyRng, getTodayString } from "@/lib/daily";
import { buildQuestion } from "@/lib/choices";
import { getTodayTimedResult, saveTodayTimedResult, updateStreak, getStreak } from "@/lib/storage";
import { getProgression, saveProgression, getLevelForXP } from "@/lib/progression";
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

const TIMER_SECONDS = 8;
const TIMER_TICKS = TIMER_SECONDS * 10; // tenths of a second

function timeMultiplier(ticksLeft: number): number {
  const secsLeft = ticksLeft / 10;
  if (secsLeft > 5) return 2.0;  // answered in ≤3s
  if (secsLeft > 2) return 1.5;  // answered in ≤6s
  return 1.0;
}

export default function TimedPage() {
  const router = useRouter();
  const [game, setGame] = useState<GameState | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [today, setToday] = useState("");
  const [totalXP, setTotalXP] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [inGameStreak, setInGameStreak] = useState(0);
  const [toastQueue, setToastQueue] = useState<Achievement[]>([]);
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_TICKS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevLevelRef = useRef<number>(1);
  const gameRef = useRef<GameState | null>(null);
  const selectedRef = useRef<string | null>(null);

  // Keep refs in sync for use inside interval callback
  useEffect(() => { gameRef.current = game; }, [game]);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

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
    const existing = getTodayTimedResult(todayStr);
    const countries = getDailyCountries(todayStr);
    const rng = getDailyRng(todayStr);
    const questions = countries.map((c) => buildQuestion(c, rng));
    if (existing) {
      setGame({ questions, currentIndex: 10, answers: existing.answers, phase: "finished" });
    } else {
      setGame({ questions, currentIndex: 0, answers: [], phase: "playing" });
    }
  }, []);

  // Timer — starts/resets when phase is "playing"
  useEffect(() => {
    if (!game || game.phase !== "playing") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setTimeLeft(TIMER_TICKS);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          // Auto-submit wrong if no answer given
          if (!selectedRef.current && gameRef.current?.phase === "playing") {
            autoSubmitWrong();
          }
          return 0;
        }
        return t - 1;
      });
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.currentIndex, game?.phase]);

  function autoSubmitWrong() {
    const g = gameRef.current;
    if (!g || g.phase !== "playing") return;
    setSelected("__timeout__");
    setXpGained(0);
    setInGameStreak(0);
    const prog = getProgression();
    const country = g.questions[g.currentIndex].country;
    const cs = { ...prog.continentStats };
    cs[country.continent] = { correct: cs[country.continent]?.correct ?? 0, total: (cs[country.continent]?.total ?? 0) + 1 };
    saveProgression({ ...prog, continentStats: cs });
    playWrong();
    setGame((prev) => prev ? { ...prev, phase: "revealed" } : prev);
  }

  const handleAnswer = useCallback((choice: string) => {
    if (!game || game.phase !== "playing" || selected) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(choice);
    const correct = game.questions[game.currentIndex].country.name;
    const isCorrect = choice === correct;

    if (isCorrect) {
      const newStreak = inGameStreak + 1;
      setInGameStreak(newStreak);
      const tMult = timeMultiplier(timeLeft);
      const xp = Math.round(10 * tMult);
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
  }, [game, selected, inGameStreak, timeLeft]);

  const handleNext = useCallback(() => {
    if (!game) return;
    const correct = game.questions[game.currentIndex].country.name;
    const isCorrect = selected !== "__timeout__" && selected === correct;
    const newAnswer: Answer = { questionIndex: game.currentIndex, chosenName: selected ?? "", correct: isCorrect };
    const newAnswers = [...game.answers, newAnswer];
    const nextIndex = game.currentIndex + 1;
    const finished = nextIndex >= game.questions.length;

    if (finished) {
      const score = newAnswers.filter((a) => a.correct).length;
      saveTodayTimedResult({ date: today, score, answers: newAnswers });
      updateStreak(today);
      const prog = getProgression();
      const streak = getStreak();
      const newAchievements = checkAchievements({ answers: newAnswers, currentStreak: streak.currentStreak, totalXP: prog.totalXP, continentStats: prog.continentStats });
      if (newAchievements.length > 0) { setToastQueue((q) => [...q, ...newAchievements]); playAchievement(); }
      setGame((prev) => prev ? { ...prev, answers: newAnswers, phase: "finished" } : prev);
    } else {
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
  const timedSelected = selected === "__timeout__" ? null : selected;

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
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Timed</span>
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

            {/* Timer bar */}
            {game.phase === "playing" && (
              <div className="space-y-1">
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-none ${timeLeft > 30 ? "bg-amber-400" : timeLeft > 15 ? "bg-orange-400" : "bg-red-500"}`}
                    style={{ width: `${(timeLeft / TIMER_TICKS) * 100}%`, transition: "width 0.1s linear" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{timeMultiplier(timeLeft)}x XP</span>
                  <span>{(timeLeft / 10).toFixed(1)}s</span>
                </div>
              </div>
            )}

            {inGameStreak >= 3 && game.phase === "playing" && (
              <div className="flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/30 rounded-lg py-1.5 px-3 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Flame size={14} /> {inGameStreak} in a row
              </div>
            )}

            <FlagCard country={currentQuestion.country} animationKey={game.currentIndex} />

            <AnswerGrid
              choices={currentQuestion.choices}
              correctName={currentQuestion.country.name}
              selected={timedSelected}
              onSelect={handleAnswer}
            />

            {game.phase === "revealed" && (
              <>
                <EducationCard country={currentQuestion.country} wasCorrect={timedSelected === currentQuestion.country.name} />
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
