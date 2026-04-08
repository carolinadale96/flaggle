// XP + Leveling system
// Levels: Tourist → Traveler → Explorer → Geographer → Diplomat → Ambassador → Flag Master

export interface Level {
  rank: number;
  title: string;
  xpRequired: number; // total XP needed to reach this level
  emoji: string;
}

export const LEVELS: Level[] = [
  { rank: 1, title: "Tourist",      xpRequired: 0,    emoji: "🧳" },
  { rank: 2, title: "Traveler",     xpRequired: 300,  emoji: "✈️" },
  { rank: 3, title: "Explorer",     xpRequired: 800,  emoji: "🗺️" },
  { rank: 4, title: "Geographer",   xpRequired: 2000, emoji: "🌐" },
  { rank: 5, title: "Diplomat",     xpRequired: 4000, emoji: "🏛️" },
  { rank: 6, title: "Ambassador",   xpRequired: 6500, emoji: "🎖️" },
  { rank: 7, title: "Flag Master",  xpRequired: 9000, emoji: "👑" },
];

export interface ProgressionData {
  totalXP: number;
  // continent accuracy: map of continent → { correct, total }
  continentStats: Record<string, { correct: number; total: number }>;
}

const PROGRESSION_KEY = "flaggame_progression";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getProgression(): ProgressionData {
  if (!isBrowser()) return { totalXP: 0, continentStats: {} };
  try {
    const raw = localStorage.getItem(PROGRESSION_KEY);
    if (!raw) return { totalXP: 0, continentStats: {} };
    return JSON.parse(raw) as ProgressionData;
  } catch {
    return { totalXP: 0, continentStats: {} };
  }
}

export function saveProgression(data: ProgressionData): void {
  if (!isBrowser()) return;
  localStorage.setItem(PROGRESSION_KEY, JSON.stringify(data));
}

// XP per correct answer. Multiplied by streak bonus.
export const BASE_XP = 10;

export function streakMultiplier(streak: number): number {
  if (streak >= 5) return 2.0;
  if (streak >= 3) return 1.5;
  return 1.0;
}

export function xpForAnswer(correct: boolean, streak: number): number {
  if (!correct) return 0;
  return Math.round(BASE_XP * streakMultiplier(streak));
}

export function getLevelForXP(xp: number): Level {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.xpRequired) level = l;
    else break;
  }
  return level;
}

export function getNextLevel(currentLevel: Level): Level | null {
  const idx = LEVELS.findIndex((l) => l.rank === currentLevel.rank);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

// XP progress within current level (0..1)
export function levelProgress(xp: number): number {
  const current = getLevelForXP(xp);
  const next = getNextLevel(current);
  if (!next) return 1;
  const range = next.xpRequired - current.xpRequired;
  const earned = xp - current.xpRequired;
  return Math.min(earned / range, 1);
}
