import type { Country } from "@/types";
import allCountries from "@/data/countries.json";

// djb2 hash: turns a string into a stable integer
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0; // convert to unsigned 32-bit integer
}

// Mulberry32: a fast, seedable pseudo-random number generator
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fisher-Yates shuffle using a seeded random function
export function seededShuffle<T>(arr: T[], random: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Get today's date string in YYYY-MM-DD format (local time)
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Get the seeded RNG for a given date string
export function getDailyRng(dateString: string): () => number {
  const seed = djb2Hash(dateString);
  return mulberry32(seed);
}

// Get today's 10 countries — deterministic, same for everyone on the same date
export function getDailyCountries(dateString?: string): Country[] {
  const date = dateString ?? getTodayString();
  const rng = getDailyRng(date);
  const shuffled = seededShuffle(allCountries as Country[], rng);
  return shuffled.slice(0, 10);
}

// Get countries shuffled fresh with Math.random — for region/streak modes
export function getShuffledCountries(filter?: (c: Country) => boolean): Country[] {
  const pool = filter ? (allCountries as Country[]).filter(filter) : allCountries as Country[];
  return seededShuffle([...pool], Math.random);
}
