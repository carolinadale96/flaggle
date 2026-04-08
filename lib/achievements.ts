import type { Answer } from "@/types";
import { getLevelForXP, LEVELS } from "@/lib/progression";

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_correct",    emoji: "✅", title: "First Blood",     description: "Get your first correct answer" },
  { id: "flawless",         emoji: "👑", title: "Flawless",        description: "Score 10/10 in a single game" },
  { id: "on_fire",          emoji: "🔥", title: "On Fire",         description: "5 correct in a row in one game" },
  { id: "streak_3",         emoji: "📅", title: "Hat Trick",       description: "Play 3 days in a row" },
  { id: "streak_7",         emoji: "🗓️", title: "Dedicated",       description: "Play 7 days in a row" },
  { id: "streak_30",        emoji: "🏆", title: "Obsessed",        description: "Play 30 days in a row" },
  { id: "level_explorer",   emoji: "🗺️", title: "Explorer",        description: "Reach Explorer rank" },
  { id: "level_diplomat",   emoji: "🏛️", title: "Diplomat",        description: "Reach Diplomat rank" },
  { id: "level_master",     emoji: "👑", title: "Flag Master",     description: "Reach the top rank" },
  { id: "africa_expert",    emoji: "🌍", title: "Africa Expert",   description: "90%+ accuracy in Africa (min 5 flags)" },
  { id: "asia_expert",      emoji: "🌏", title: "Asia Expert",     description: "90%+ accuracy in Asia (min 5 flags)" },
  { id: "europe_expert",    emoji: "🏰", title: "Europe Expert",   description: "90%+ accuracy in Europe (min 5 flags)" },
  { id: "americas_expert",  emoji: "🌎", title: "Americas Expert", description: "90%+ accuracy in Americas (min 5 flags)" },
  { id: "globetrotter",     emoji: "🌐", title: "Globetrotter",    description: "Score at least 1 correct on every continent" },
  { id: "comeback",         emoji: "⚡", title: "Comeback",        description: "Finish with 8+ after getting first 2 wrong" },
];

export interface AchievementsData {
  unlocked: string[]; // achievement ids
}

const ACHIEVEMENTS_KEY = "flaggame_achievements";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getAchievements(): AchievementsData {
  if (!isBrowser()) return { unlocked: [] };
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return { unlocked: [] };
    return JSON.parse(raw) as AchievementsData;
  } catch {
    return { unlocked: [] };
  }
}

function saveAchievements(data: AchievementsData): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(data));
}

export interface AchievementCheckInput {
  answers: Answer[];
  currentStreak: number;
  totalXP: number;
  continentStats: Record<string, { correct: number; total: number }>;
}

// Returns newly unlocked achievement ids
export function checkAchievements(input: AchievementCheckInput): Achievement[] {
  const { answers, currentStreak, totalXP, continentStats } = input;
  const data = getAchievements();
  const alreadyUnlocked = new Set(data.unlocked);
  const newlyUnlocked: Achievement[] = [];

  function tryUnlock(id: string) {
    if (!alreadyUnlocked.has(id)) {
      const achievement = ALL_ACHIEVEMENTS.find((a) => a.id === id);
      if (achievement) {
        newlyUnlocked.push(achievement);
        alreadyUnlocked.add(id);
      }
    }
  }

  const score = answers.filter((a) => a.correct).length;

  // first_correct
  if (answers.some((a) => a.correct)) tryUnlock("first_correct");

  // flawless
  if (score === 10) tryUnlock("flawless");

  // on_fire — 5 consecutive correct
  let maxRun = 0, run = 0;
  for (const a of answers) {
    if (a.correct) { run++; maxRun = Math.max(maxRun, run); }
    else run = 0;
  }
  if (maxRun >= 5) tryUnlock("on_fire");

  // comeback — first 2 wrong, finish 8+
  if (answers.length >= 2 && !answers[0].correct && !answers[1].correct && score >= 8) {
    tryUnlock("comeback");
  }

  // streak milestones
  if (currentStreak >= 3)  tryUnlock("streak_3");
  if (currentStreak >= 7)  tryUnlock("streak_7");
  if (currentStreak >= 30) tryUnlock("streak_30");

  // level milestones
  const level = getLevelForXP(totalXP);
  if (level.rank >= LEVELS.findIndex((l) => l.title === "Explorer")  + 1) tryUnlock("level_explorer");
  if (level.rank >= LEVELS.findIndex((l) => l.title === "Diplomat")  + 1) tryUnlock("level_diplomat");
  if (level.rank >= LEVELS.findIndex((l) => l.title === "Flag Master") + 1) tryUnlock("level_master");

  // continent experts
  const continentMap: Record<string, string> = {
    "Africa": "africa_expert",
    "Asia": "asia_expert",
    "Europe": "europe_expert",
  };
  for (const [continent, id] of Object.entries(continentMap)) {
    const s = continentStats[continent];
    if (s && s.total >= 5 && s.correct / s.total >= 0.9) tryUnlock(id);
  }
  // Americas = North + South America combined
  const na = continentStats["North America"] ?? { correct: 0, total: 0 };
  const sa = continentStats["South America"] ?? { correct: 0, total: 0 };
  const americasTotal = na.total + sa.total;
  const americasCorrect = na.correct + sa.correct;
  if (americasTotal >= 5 && americasCorrect / americasTotal >= 0.9) tryUnlock("americas_expert");

  // globetrotter — scored correct on every continent represented
  const continentsWithCorrect = new Set(
    answers
      .filter((a) => a.correct)
      .map((_, i) => i) // we don't have continent per answer here — tracked via continentStats
  );
  const allContinentsHit = Object.values(continentStats).every((s) => s.correct > 0);
  if (Object.keys(continentStats).length >= 5 && allContinentsHit) tryUnlock("globetrotter");

  if (newlyUnlocked.length > 0) {
    saveAchievements({ unlocked: [...alreadyUnlocked] });
  }

  return newlyUnlocked;
}
