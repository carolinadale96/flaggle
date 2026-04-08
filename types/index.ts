export interface FlagElement {
  element: string;
  meaning: string;
}

export interface ConfusedWith {
  iso2: string;
  name: string;
  note: string;
}

export interface Country {
  name: string;
  iso2: string;
  capital: string;
  continent: string;
  region: string;
  symbolism: string;
  funFact: string;
  flagElements: FlagElement[];
  confusedWith: ConfusedWith[];
}

export interface Question {
  country: Country;
  choices: string[];
}

export interface Answer {
  questionIndex: number;
  chosenName: string;
  correct: boolean;
}

export interface DayResult {
  date: string;
  score: number;
  answers: Answer[];
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string;
}

export type GamePhase = "playing" | "revealed" | "finished";

export interface GameState {
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  phase: GamePhase;
}
