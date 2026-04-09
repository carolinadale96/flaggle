"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart2 } from "lucide-react";
import { getTodayString } from "@/lib/daily";
import { getStreak, getTodayResult } from "@/lib/storage";
import { getProgression, getLevelForXP, levelProgress, getNextLevel } from "@/lib/progression";
import type { StreakData, DayResult } from "@/types";
import CountdownTimer from "@/components/CountdownTimer";
import XPBar from "@/components/XPBar";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import InstallBanner from "@/components/InstallBanner";
import { Edit3, Timer, Globe, Zap } from "lucide-react";
import Flame from "@/components/icons/Flame";
import Trophy from "@/components/icons/Trophy";
import CorrectIcon from "@/components/icons/CorrectIcon";
import WrongIcon from "@/components/icons/WrongIcon";

export default function HomePage() {
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, lastPlayedDate: "" });
  const [todayResult, setTodayResult] = useState<DayResult | null>(null);
  const [today, setToday] = useState("");
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    const todayStr = getTodayString();
    setToday(todayStr);
    setStreak(getStreak());
    setTodayResult(getTodayResult(todayStr));
    setTotalXP(getProgression().totalXP);
  }, []);

  const formattedDate = today
    ? new Date(today + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "";

  const alreadyPlayed = !!todayResult;
  const next = getNextLevel(getLevelForXP(totalXP));
  const progress = levelProgress(totalXP);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Logo size={26} />
            <p className="text-slate-400 text-xs mt-0.5">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/stats"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <BarChart2 size={14} />
              Stats
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Level + XP */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 space-y-2">
          <XPBar totalXP={totalXP} />
          <div className="flex justify-between text-xs text-slate-400">
            <span>{totalXP} XP</span>
            {next && <span>{next.title} at {next.xpRequired} XP</span>}
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-4 px-1">
          <div className="flex items-center gap-1.5">
            {streak.currentStreak > 1
              ? <Flame size={20} />
              : <span className="text-base">📅</span>
            }
            <span className={`text-xl font-bold ${streak.currentStreak > 0 ? "text-amber-500 dark:text-amber-400" : "text-slate-400"}`}>
              {streak.currentStreak}
            </span>
            <span className="text-slate-400 text-xs">day streak</span>
          </div>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <Trophy size={20} />
            <span className="text-xl font-bold text-slate-700 dark:text-slate-300">{streak.longestStreak}</span>
            <span className="text-slate-400 text-xs">best</span>
          </div>
        </div>

        {/* Already played */}
        {alreadyPlayed ? (
          <div className="space-y-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Today&apos;s score</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-0.5">
                    {todayResult!.score}<span className="text-slate-400 text-xl">/10</span>
                  </p>
                </div>
                <div className="flex gap-0.5 flex-wrap justify-end max-w-[130px]">
                  {todayResult!.answers.map((a, i) => (
                    a.correct ? <CorrectIcon key={i} size={18} /> : <WrongIcon key={i} size={18} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/play"
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold text-sm rounded-xl transition-all text-center border border-slate-200 dark:border-slate-600"
              >
                Review answers
              </Link>
              <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 py-3">
                <p className="text-slate-400 text-xs">Next game</p>
                <CountdownTimer inline />
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="/play"
            className="block w-full py-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-lg rounded-xl transition-all duration-200 active:scale-95 text-center border border-amber-300 shadow-md"
          >
            Play Today →
          </Link>
        )}

        {/* More modes */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">More modes</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: "/hard", icon: Edit3, label: "Hard mode", desc: "Type the name" },
              { href: "/timed", icon: Timer, label: "Timed mode", desc: "Beat the clock" },
              { href: "/region", icon: Globe, label: "Region mode", desc: "Practice by continent" },
              { href: "/streak", icon: Zap, label: "Streak mode", desc: "How far can you go?" },
            ].map(({ href, icon: Icon, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 hover:border-amber-400 transition-all duration-200 active:scale-95 group"
              >
                <div className="w-8 h-8 bg-amber-50 dark:bg-amber-400/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-amber-100 dark:group-hover:bg-amber-400/20 transition-colors">
                  <Icon size={15} className="text-amber-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{label}</p>
                  <p className="text-xs text-slate-400 leading-tight">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <InstallBanner />

        <p className="text-slate-400 text-xs text-center">197 countries · resets at midnight</p>

      </div>
    </div>
  );
}
