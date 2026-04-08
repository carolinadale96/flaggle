"use client";

import { getLevelForXP, getNextLevel, levelProgress } from "@/lib/progression";
import LevelIcon from "@/components/icons/LevelIcon";

interface XPBarProps {
  totalXP: number;
  xpGained?: number;
}

export default function XPBar({ totalXP, xpGained }: XPBarProps) {
  const level = getLevelForXP(totalXP);
  const next = getNextLevel(level);
  const progress = levelProgress(totalXP);

  return (
    <div className="flex items-center gap-2">
      <LevelIcon rank={level.rank} size={20} />
      <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">{level.title}</span>
      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-700"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      {xpGained && xpGained > 0 ? (
        <span className="text-xs text-amber-500 dark:text-amber-400 font-bold shrink-0 animate-pulse">+{xpGained}</span>
      ) : (
        <span className="text-xs text-slate-400 dark:text-slate-600 shrink-0">{next ? `${next.xpRequired - totalXP} to go` : "Max"}</span>
      )}
    </div>
  );
}
