"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProgression, getLevelForXP, getNextLevel, levelProgress } from "@/lib/progression";
import { getAchievements, ALL_ACHIEVEMENTS } from "@/lib/achievements";
import { getStreak } from "@/lib/storage";
import ThemeToggle from "@/components/ThemeToggle";
import LevelIcon from "@/components/icons/LevelIcon";
import ContinentIcon from "@/components/icons/ContinentIcon";
import AchievementIcon from "@/components/icons/AchievementIcon";
import Flame from "@/components/icons/Flame";
import Trophy from "@/components/icons/Trophy";
import type { Achievement } from "@/lib/achievements";

const CONTINENT_TOTAL: Record<string, number> = {
  "Africa": 54,
  "Asia": 48,
  "Europe": 46,
  "North America": 23,
  "South America": 12,
  "Oceania": 14,
};

function SectionTitle({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{children}</p>
      {aside && <span className="text-xs text-slate-400">{aside}</span>}
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 ${className}`}>
      {children}
    </div>
  );
}

function AchievementTile({ achievement, unlocked, selected, onSelect }: {
  achievement: Achievement;
  unlocked: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl pt-3 pb-2 px-1 border-2 transition-all duration-200 aspect-square text-center
        ${selected
          ? "bg-white dark:bg-slate-800 border-amber-400 scale-95 shadow-lg shadow-amber-400/20"
          : unlocked
            ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500 hover:scale-95 active:scale-90"
            : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50 opacity-40 hover:opacity-60 hover:scale-95 active:scale-90"
        }`}
    >
      <AchievementIcon id={achievement.id} size={36} locked={!unlocked} />
      <span className={`text-xs font-semibold leading-tight line-clamp-1 ${unlocked ? "text-slate-700 dark:text-slate-200" : "text-slate-400"}`}>
        {achievement.title}
      </span>
    </button>
  );
}

export default function StatsPage() {
  const [progression, setProgression] = useState({ totalXP: 0, continentStats: {} as Record<string, { correct: number; total: number }> });
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, lastPlayedDate: "" });
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    setProgression(getProgression());
    setUnlockedIds(getAchievements().unlocked);
    setStreak(getStreak());
  }, []);

  const level = getLevelForXP(progression.totalXP);
  const next = getNextLevel(level);
  const progress = levelProgress(progression.totalXP);

  const continentEntries = Object.entries(CONTINENT_TOTAL)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([continent]) => [continent, progression.continentStats[continent] ?? { correct: 0, total: 0 }] as [string, { correct: number; total: number }]);

  function handleSelectAchievement(a: Achievement) {
    setSelectedAchievement((prev) => prev?.id === a.id ? null : a);
  }

  return (
    <div className="min-h-screen bg-sand dark:bg-slate-900 flex flex-col items-center py-4 px-4">
      <div className="w-full max-w-sm space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-slate-900 dark:text-white font-bold text-base">Stats</h1>
          <ThemeToggle />
        </div>

        {/* Level hero */}
        <Card className="px-4 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <LevelIcon rank={level.rank} size={44} />
            <div className="flex-1 min-w-0">
              <p className="text-slate-900 dark:text-white text-xl font-bold leading-none">{level.title}</p>
              <p className="text-slate-400 text-xs mt-0.5">{progression.totalXP} XP total</p>
            </div>
            {next && (
              <div className="text-right shrink-0">
                <p className="text-slate-400 text-xs">Next</p>
                <div className="flex items-center gap-1 justify-end">
                  <LevelIcon rank={next.rank} size={18} />
                  <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">{next.title}</p>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
            {next && (
              <p className="text-xs text-slate-400 text-right">{next.xpRequired - progression.totalXP} XP to {next.title}</p>
            )}
          </div>
        </Card>

        {/* Streak */}
        <div>
          <SectionTitle>Streaks</SectionTitle>
          <div className="grid grid-cols-2 gap-2">
            <Card className="px-4 py-3 text-center space-y-1">
              <div className="flex justify-center">
                {streak.currentStreak > 1 ? <Flame size={28} /> : <span className="text-2xl">📅</span>}
              </div>
              <p className={`text-3xl font-bold ${streak.currentStreak > 0 ? "text-amber-500 dark:text-amber-400" : "text-slate-900 dark:text-white"}`}>
                {streak.currentStreak}
              </p>
              <p className="text-slate-400 text-xs">Current streak</p>
            </Card>
            <Card className="px-4 py-3 text-center space-y-1">
              <div className="flex justify-center">
                <Trophy size={28} />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{streak.longestStreak}</p>
              <p className="text-slate-400 text-xs">Longest streak</p>
            </Card>
          </div>
        </div>

        {/* Continent mastery */}
        <div>
          <SectionTitle>Continent mastery</SectionTitle>
          <Card className="px-4 py-3 space-y-3">
            {continentEntries.map(([continent, stats]) => {
              const total = CONTINENT_TOTAL[continent] ?? stats.total;
              const pct = Math.round((stats.correct / total) * 100);
              const barColor = pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-amber-400" : pct > 0 ? "bg-red-400" : "bg-slate-200 dark:bg-slate-700";
              const textColor = pct >= 80 ? "text-green-600 dark:text-green-400" : pct >= 50 ? "text-amber-500 dark:text-amber-400" : pct > 0 ? "text-red-500 dark:text-red-400" : "text-slate-400";
              return (
                <div key={continent} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ContinentIcon continent={continent} size={20} />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{continent}</span>
                    </div>
                    <span className={`text-xs font-semibold ${textColor}`}>
                      {stats.correct}/{total}
                      <span className="text-slate-400 font-normal ml-1">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Achievements */}
        <div>
          <SectionTitle aside={`${unlockedIds.length}/${ALL_ACHIEVEMENTS.length}`}>Achievements</SectionTitle>

          {selectedAchievement && (() => {
            const isUnlocked = unlockedIds.includes(selectedAchievement.id);
            return (
              <div className={`mb-3 rounded-2xl px-4 py-3 flex items-center gap-3 education-card-enter border-2 ${isUnlocked ? "bg-white dark:bg-slate-800 border-amber-400/60" : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"}`}>
                <AchievementIcon id={selectedAchievement.id} size={44} locked={!isUnlocked} />
                <div>
                  <p className={`font-bold text-base ${isUnlocked ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                    {selectedAchievement.title}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {isUnlocked ? selectedAchievement.description : `🔒 ${selectedAchievement.description}`}
                  </p>
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-4 gap-2">
            {ALL_ACHIEVEMENTS.map((a) => (
              <AchievementTile
                key={a.id}
                achievement={a}
                unlocked={unlockedIds.includes(a.id)}
                selected={selectedAchievement?.id === a.id}
                onSelect={() => handleSelectAchievement(a)}
              />
            ))}
          </div>
          <p className="text-slate-400 text-xs text-center mt-2">Tap any badge to learn more</p>
        </div>

      </div>
    </div>
  );
}
