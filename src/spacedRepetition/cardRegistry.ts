import type { QuizMode } from "../quiz/types";
import type { CardRef } from "./card";
import { quizCountries } from "../data/quizCountries";

export const SR_MODES: QuizMode[] = ["capital", "flag", "country", "population"];

/** Every possible card ref across all countries × all modes */
export const ALL_CARD_REFS: CardRef[] = quizCountries.flatMap((c) =>
  SR_MODES.map((mode) => ({ countryName: c.name, mode })),
);
