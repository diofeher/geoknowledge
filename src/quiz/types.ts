import type { Country } from "../data/countries";

export type QuizMode = "capital" | "flag" | "country" | "population";

export interface Question {
  mode: QuizMode;
  country: Country;
  options: string[];
  correct: string;
  countryB?: Country;
}

export interface QuizSessionState {
  status: "idle" | "in-progress" | "finished";
  questions: Question[];
  currentIndex: number;
  selected: string | null;
  score: number;
  isReviewMode: boolean;
}

export type QuizSessionAction =
  | { type: "START"; questions: Question[]; isReviewMode: boolean }
  | { type: "ANSWER"; answer: string }
  | { type: "NEXT" }
  | { type: "RESET" };
