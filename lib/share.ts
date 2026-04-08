import type { Answer } from "@/types";

export function buildShareText(
  date: string,
  score: number,
  answers: Answer[]
): string {
  const dateObj = new Date(date + "T00:00:00");
  const formatted = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const emojiRow = answers.map((a) => (a.correct ? "✅" : "❌")).join("");

  return [
    `Flaggle — ${formatted}`,
    `${score}/10`,
    "",
    emojiRow,
    "",
    "Play at flaggame.vercel.app",
  ].join("\n");
}
