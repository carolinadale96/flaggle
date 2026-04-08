"use client";

import type { Answer, Question } from "@/types";
import CountdownTimer from "./CountdownTimer";
import ShareButton from "./ShareButton";
import { buildShareText } from "@/lib/share";
import CorrectIcon from "@/components/icons/CorrectIcon";
import WrongIcon from "@/components/icons/WrongIcon";

interface ScoreScreenProps {
  score: number;
  total: number;
  answers: Answer[];
  questions: Question[];
  date: string;
}

function getScoreMessage(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1)   return "Perfect! Flag master!";
  if (pct >= 0.8)  return "Excellent! Almost flawless!";
  if (pct >= 0.6)  return "Nice work! Solid knowledge!";
  if (pct >= 0.4)  return "Getting there, keep practicing!";
  return "Flags are tough! Come back tomorrow";
}

export default function ScoreScreen({ score, total, answers, questions, date }: ScoreScreenProps) {
  const shareText = buildShareText(date, score, answers);

  return (
    <div className="space-y-4 py-2">

      {/* Score */}
      <div className="text-center space-y-1">
        <p className="text-slate-400 uppercase tracking-widest text-xs font-semibold">Today&apos;s Score</p>
        <p className="text-6xl font-bold text-slate-900 dark:text-white">
          {score}<span className="text-slate-400 text-3xl">/{total}</span>
        </p>
        <p className="text-amber-500 dark:text-amber-400 font-medium text-sm">{getScoreMessage(score, total)}</p>
      </div>

      {/* Icon row */}
      <div className="flex justify-center gap-1">
        {answers.map((a, i) => (
          a.correct ? <CorrectIcon key={i} size={26} /> : <WrongIcon key={i} size={26} />
        ))}
      </div>

      {/* Answer review */}
      <div className="space-y-1.5">
        <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Review</p>
        <div className="grid grid-cols-2 gap-1.5">
          {questions.map((q, i) => {
            const correct = answers[i]?.correct;
            return (
              <div
                key={i}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 border text-sm ${
                  correct
                    ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700/50"
                    : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700/50"
                }`}
              >
                <span className={`fi fi-${q.country.iso2} rounded`} style={{ fontSize: "1rem", display: "inline-block", flexShrink: 0 }} />
                <span className={`truncate font-medium text-xs ${correct ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                  {q.country.name}
                </span>
                <span className="ml-auto shrink-0">
                  {correct ? <CorrectIcon size={16} /> : <WrongIcon size={16} />}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <ShareButton text={shareText} />
      <CountdownTimer />
    </div>
  );
}
