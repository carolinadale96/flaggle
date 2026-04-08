"use client";

interface AnswerButtonProps {
  label: string;
  state: "default" | "correct" | "wrong" | "disabled";
  onClick: () => void;
}

export default function AnswerButton({ label, state, onClick }: AnswerButtonProps) {
  const base =
    "w-full py-3 px-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left border leading-snug min-h-[48px] flex items-center gap-2";

  const styles: Record<string, string> = {
    default:
      "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-slate-700 active:scale-95 cursor-pointer",
    correct:
      "bg-green-500 dark:bg-green-600 border-green-400 dark:border-green-500 text-white cursor-default",
    wrong:
      "bg-red-500 dark:bg-red-600 border-red-400 dark:border-red-500 text-white answer-shake cursor-default",
    disabled:
      "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-default",
  };

  const icons: Record<string, string> = {
    default: "", correct: "✓", wrong: "✗", disabled: "",
  };

  return (
    <button
      className={`${base} ${styles[state]}`}
      onClick={state === "default" ? onClick : undefined}
      disabled={state !== "default"}
    >
      {icons[state] && <span className="font-bold shrink-0">{icons[state]}</span>}
      <span>{label}</span>
    </button>
  );
}
