import type { Country, Question } from "@/types";
import allCountries from "@/data/countries.json";
import { seededShuffle } from "@/lib/daily";

// Pick N items from an array using a seeded random — no repeats
function seededSample<T>(arr: T[], n: number, random: () => number): T[] {
  const shuffled = seededShuffle(arr, random);
  return shuffled.slice(0, n);
}

// Generate 3 plausible wrong answers for a given country
// Priority: same region → same continent → any country
function getWrongChoices(
  correct: Country,
  allCountriesList: Country[],
  random: () => number
): Country[] {
  const others = allCountriesList.filter((c) => c.name !== correct.name);

  // Try same region first
  let pool = others.filter((c) => c.region === correct.region);

  // Fall back to same continent if not enough
  if (pool.length < 3) {
    pool = others.filter((c) => c.continent === correct.continent);
  }

  // Final fallback: all countries
  if (pool.length < 3) {
    pool = others;
  }

  return seededSample(pool, 3, random);
}

// Build a Question from a country and a seeded RNG
export function buildQuestion(correct: Country, random: () => number): Question {
  const wrongCountries = getWrongChoices(
    correct,
    allCountries as Country[],
    random
  );
  const allChoiceNames = [
    correct.name,
    ...wrongCountries.map((c) => c.name),
  ];
  // Shuffle so the correct answer isn't always in position 0
  const choices = seededShuffle(allChoiceNames, random);
  return { country: correct, choices };
}
