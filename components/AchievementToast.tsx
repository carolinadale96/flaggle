"use client";

import { useEffect, useState } from "react";
import type { Achievement } from "@/lib/achievements";
import AchievementIcon from "@/components/icons/AchievementIcon";

interface AchievementToastProps {
  achievement: Achievement | null;
  onDone: () => void;
}

export default function AchievementToast({ achievement, onDone }: AchievementToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!achievement) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 2800);
    return () => clearTimeout(timer);
  }, [achievement, onDone]);

  if (!achievement) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-400 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-400/50 rounded-2xl px-4 py-3 shadow-2xl">
        <AchievementIcon id={achievement.id} size={40} locked={false} />
        <div>
          <p className="text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-widest">Achievement unlocked</p>
          <p className="text-slate-900 dark:text-white font-bold text-base">{achievement.title}</p>
          <p className="text-slate-500 text-xs">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
}
