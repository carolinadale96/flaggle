import type { DayResult, StreakData, Answer } from "@/types";

const STREAK_KEY = "flaggame_streak";
const HISTORY_KEY = "flaggame_history";
const TODAY_KEY = "flaggame_today";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

// ── Streak ──────────────────────────────────────────────────────────────────

export function getStreak(): StreakData {
  if (!isBrowser()) return { currentStreak: 0, longestStreak: 0, lastPlayedDate: "" };
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { currentStreak: 0, longestStreak: 0, lastPlayedDate: "" };
    return JSON.parse(raw) as StreakData;
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastPlayedDate: "" };
  }
}

export function updateStreak(today: string): void {
  if (!isBrowser()) return;
  const streak = getStreak();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  let newCurrent: number;
  if (streak.lastPlayedDate === today) {
    // Already played today — no change
    return;
  } else if (streak.lastPlayedDate === yesterdayStr) {
    newCurrent = streak.currentStreak + 1;
  } else {
    newCurrent = 1;
  }

  const updated: StreakData = {
    currentStreak: newCurrent,
    longestStreak: Math.max(newCurrent, streak.longestStreak),
    lastPlayedDate: today,
  };
  localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
}

// ── History ──────────────────────────────────────────────────────────────────

export function getHistory(): DayResult[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DayResult[];
  } catch {
    return [];
  }
}

export function saveResult(result: DayResult): void {
  if (!isBrowser()) return;
  const history = getHistory().filter((r) => r.date !== result.date);
  history.push(result);
  // Keep only the last 30 days
  const trimmed = history.slice(-30);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  localStorage.removeItem(TODAY_KEY);
}

export function getTodayResult(today: string): DayResult | null {
  if (!isBrowser()) return null;
  const history = getHistory();
  return history.find((r) => r.date === today) ?? null;
}

// ── Mid-game resume ──────────────────────────────────────────────────────────

export interface PartialGame {
  date: string;
  currentIndex: number;
  answers: Answer[];
}

export function savePartialGame(partial: PartialGame): void {
  if (!isBrowser()) return;
  localStorage.setItem(TODAY_KEY, JSON.stringify(partial));
}

export function getPartialGame(today: string): PartialGame | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(TODAY_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PartialGame;
    // Only valid if it's for today
    return data.date === today ? data : null;
  } catch {
    return null;
  }
}

export function clearPartialGame(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(TODAY_KEY);
}
