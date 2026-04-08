"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  answers: boolean[];
}

export default function ProgressBar({ current, total, answers }: ProgressBarProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => {
        let color = "bg-slate-200 dark:bg-slate-700";
        if (i < answers.length) {
          color = answers[i] ? "bg-green-500" : "bg-red-500";
        } else if (i === answers.length) {
          color = "bg-amber-400";
        }
        return (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${color}`}
          />
        );
      })}
    </div>
  );
}
