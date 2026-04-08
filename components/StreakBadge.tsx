"use client";

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
  return (
    <div className="flex gap-4 justify-center">
      <div className="flex flex-col items-center bg-slate-800 rounded-2xl px-6 py-4 border border-slate-700">
        <span
          className={`text-3xl font-bold ${
            currentStreak > 0 ? "text-amber-400" : "text-slate-500"
          }`}
        >
          {currentStreak}
        </span>
        <span className="text-slate-400 text-xs uppercase tracking-widest mt-1 font-medium">
          Current streak
        </span>
        {currentStreak > 1 && (
          <span className="text-lg mt-1">🔥</span>
        )}
      </div>
      <div className="flex flex-col items-center bg-slate-800 rounded-2xl px-6 py-4 border border-slate-700">
        <span className="text-3xl font-bold text-slate-300">{longestStreak}</span>
        <span className="text-slate-400 text-xs uppercase tracking-widest mt-1 font-medium">
          Best streak
        </span>
        <span className="text-lg mt-1">🏆</span>
      </div>
    </div>
  );
}
