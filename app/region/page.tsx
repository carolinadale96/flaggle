"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Answer, Question, Country } from "@/types";
import { getShuffledCountries } from "@/lib/daily";
import { buildQuestionFromPool } from "@/lib/choices";
import { getProgression, saveProgression, getLevelForXP, streakMultiplier } from "@/lib/progression";

const REGION_XP = 3; // Flat XP per correct, no streak multiplier (practice mode)
import { getRegionStats, saveRegionStats } from "@/lib/storage";
import { playCorrect, playWrong, playCombo, playLevelUp } from "@/lib/sounds";
import ProgressBar from "@/components/ProgressBar";
import FlagCard from "@/components/FlagCard";
import AnswerGrid from "@/components/AnswerGrid";
import EducationCard from "@/components/EducationCard";
import XPBar from "@/components/XPBar";
import ThemeToggle from "@/components/ThemeToggle";
import Flame from "@/components/icons/Flame";
import ContinentIcon from "@/components/icons/ContinentIcon";
import CorrectIcon from "@/components/icons/CorrectIcon";
import WrongIcon from "@/components/icons/WrongIcon";

const CONTINENTS = ["Africa", "Asia", "Europe", "North America", "South America", "Oceania"];

type GamePhase = "playing" | "revealed" | "summary";

interface RoundState {
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  phase: GamePhase;
}

function buildRound(continent: string): { questions: Question[]; countries: Country[] } {
  const countries = getShuffledCountries((c) => c.continent === continent);
  const rng = Math.random;
  const questions = countries.map((c) => buildQuestionFromPool(c, countries, rng));
  return { questions, countries };
}

export default function RegionPage() {
  const router = useRouter();
  const [continent, setContinent] = useState<string | null>(null);
  const [round, setRound] = useState<RoundState | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [totalXP, setTotalXP] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [inGameStreak, setInGameStreak] = useState(0);
  const prevLevelRef = useRef<number>(1);

  useEffect(() => {
    const prog = getProgression();
    setTotalXP(prog.totalXP);
    prevLevelRef.current = getLevelForXP(prog.totalXP).rank;
  }, []);

  function startContinent(c: string) {
    setContinent(c);
    const { questions } = buildRound(c);
    setRound({ questions, currentIndex: 0, answers: [], phase: "playing" });
    setSelected(null);
    setInGameStreak(0);
    setXpGained(0);
  }

  function playAgain() {
    if (!continent) return;
    startContinent(continent);
  }

  const handleAnswer = useCallback((choice: string) => {
    if (!round || round.phase !== "playing" || selected) return;
    setSelected(choice);
    const correct = round.questions[round.currentIndex].country.name;
    const isCorrect = choice === correct;

    if (isCorrect) {
      const newStreak = inGameStreak + 1;
      setInGameStreak(newStreak);
      const xp = REGION_XP;
      setXpGained(xp);
      const prog = getProgression();
      const newXP = prog.totalXP + xp;
      const country = round.questions[round.currentIndex].country;
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
      const country = round.questions[round.currentIndex].country;
      const cs = { ...prog.continentStats };
      cs[country.continent] = { correct: cs[country.continent]?.correct ?? 0, total: (cs[country.continent]?.total ?? 0) + 1 };
      saveProgression({ ...prog, continentStats: cs });
      playWrong();
    }
    setRound((prev) => prev ? { ...prev, phase: "revealed" } : prev);
  }, [round, selected, inGameStreak]);

  const handleNext = useCallback(() => {
    if (!round || !continent) return;
    const correct = round.questions[round.currentIndex].country.name;
    const newAnswer: Answer = { questionIndex: round.currentIndex, chosenName: selected!, correct: selected === correct };
    const newAnswers = [...round.answers, newAnswer];
    const nextIndex = round.currentIndex + 1;

    if (nextIndex >= round.questions.length) {
      // Save region stats
      const score = newAnswers.filter((a) => a.correct).length;
      const accuracy = Math.round((score / newAnswers.length) * 100);
      const stats = getRegionStats();
      const prev = stats[continent] ?? { bestAccuracy: 0, roundsPlayed: 0 };
      stats[continent] = { bestAccuracy: Math.max(prev.bestAccuracy, accuracy), roundsPlayed: prev.roundsPlayed + 1 };
      saveRegionStats(stats);
      setRound({ ...round, answers: newAnswers, phase: "summary" });
    } else {
      setRound({ ...round, currentIndex: nextIndex, answers: newAnswers, phase: "playing" });
      setSelected(null);
      setXpGained(0);
    }
  }, [round, selected, continent]);

  // ── Continent picker ────────────────────────────────────────────────────────
  if (!continent || !round) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-4 px-4">
        <div className="w-full max-w-sm space-y-5">
          <div className="flex items-center justify-between">
            <button onClick={() => router.push("/")} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-slate-900 dark:text-white font-bold text-base">Region mode</h1>
            <ThemeToggle />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center">Pick a continent and practice all its flags.</p>
          <div className="grid grid-cols-2 gap-3">
            {CONTINENTS.map((c) => (
              <button
                key={c}
                onClick={() => startContinent(c)}
                className="flex flex-col items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-3 hover:border-amber-400 hover:shadow-md transition-all duration-200 active:scale-95"
              >
                <ContinentIcon continent={c} size={36} />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center leading-tight">{c}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = round.questions[round.currentIndex];
  const multiplier = streakMultiplier(inGameStreak);

  // ── Round summary ───────────────────────────────────────────────────────────
  if (round.phase === "summary") {
    const score = round.answers.filter((a) => a.correct).length;
    const total = round.answers.length;
    const pct = Math.round((score / total) * 100);
    const stats = getRegionStats();
    const bestAccuracy = stats[continent]?.bestAccuracy ?? pct;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-4 px-4">
        <div className="w-full max-w-sm space-y-4">
          <div className="flex items-center justify-between">
            <button onClick={() => { setContinent(null); setRound(null); }} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-slate-900 dark:text-white font-bold text-base">{continent}</h1>
            <ThemeToggle />
          </div>

          <div className="text-center space-y-1 py-2">
            <ContinentIcon continent={continent} size={48} />
            <p className="text-slate-400 uppercase tracking-widest text-xs font-semibold mt-3">Round complete</p>
            <p className="text-6xl font-bold text-slate-900 dark:text-white">
              {score}<span className="text-slate-400 text-3xl">/{total}</span>
            </p>
            <p className="text-amber-500 dark:text-amber-400 font-medium text-sm">{pct}% accuracy</p>
            {pct >= bestAccuracy && <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Personal best!</p>}
          </div>

          <div className="flex gap-1 justify-center">
            {round.answers.map((a, i) => (
              a.correct ? <CorrectIcon key={i} size={20} /> : <WrongIcon key={i} size={20} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={playAgain}
              className="py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm rounded-xl border border-amber-300 transition-all active:scale-95"
            >
              Play again
            </button>
            <button
              onClick={() => { setContinent(null); setRound(null); }}
              className="py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm rounded-xl transition-all active:scale-95 hover:border-amber-400"
            >
              Change region
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Game ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-4 px-4">
      <div className="w-full max-w-sm space-y-3">

        <div className="flex items-center gap-3">
          <button onClick={() => { setContinent(null); setRound(null); }} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <ProgressBar current={round.currentIndex + 1} total={round.questions.length} answers={round.answers.map((a) => a.correct)} />
          </div>
          <div className="flex items-center gap-1.5">
            <ContinentIcon continent={continent} size={18} />
            <ThemeToggle />
          </div>
        </div>

        <XPBar totalXP={totalXP} xpGained={xpGained} />

        {inGameStreak >= 3 && round.phase === "playing" && (
          <div className="flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/30 rounded-lg py-1.5 px-3 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Flame size={14} /> {inGameStreak} in a row · {multiplier}x XP
          </div>
        )}

        <FlagCard country={currentQuestion.country} animationKey={round.currentIndex} />

        <AnswerGrid
          choices={currentQuestion.choices}
          correctName={currentQuestion.country.name}
          selected={selected}
          onSelect={handleAnswer}
        />

        {round.phase === "revealed" && (
          <>
            <EducationCard country={currentQuestion.country} wasCorrect={selected === currentQuestion.country.name} />
            <button
              onClick={handleNext}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-base rounded-xl transition-all duration-200 active:scale-95 border border-amber-300"
            >
              {round.currentIndex + 1 < round.questions.length ? "Next Flag →" : "Finish Round"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
