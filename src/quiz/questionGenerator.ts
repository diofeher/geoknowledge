import type { Country } from "../data/countries";
import type { CardRef } from "../spacedRepetition/card";
import { quizCountries, quizCountryByName } from "../data/quizCountries";
import { shuffle, pickRandom } from "../lib/arrayUtils";
import type { QuizMode, Question } from "./types";

/** Build a single question for a country in a given mode */
export function buildQuestion(
  country: Country,
  mode: QuizMode,
  pool: Country[] = quizCountries,
): Question {
  if (mode === "capital") {
    const wrong = pickRandom(pool, 3, country).map((c) => c.capital);
    const options = shuffle([country.capital, ...wrong]);
    return { mode, country, options, correct: country.capital };
  }

  if (mode === "flag") {
    const wrong = pickRandom(pool, 3, country).map((c) => c.flag);
    const options = shuffle([country.flag, ...wrong]);
    return { mode, country, options, correct: country.flag };
  }

  if (mode === "country") {
    const wrong = pickRandom(pool, 3, country).map((c) => c.name);
    const options = shuffle([country.name, ...wrong]);
    return { mode, country, options, correct: country.name };
  }

  // population mode
  const countryB = pickRandom(pool, 1, country)[0];
  const options = [country.name, countryB.name];
  const correct =
    country.population >= countryB.population ? country.name : countryB.name;
  return { mode, country, options, correct, countryB };
}

/** Generate a round of random questions for a classic quiz mode */
export function generateRandomQuestions(
  mode: QuizMode,
  count: number,
  pool: Country[] = quizCountries,
): Question[] {
  return shuffle(pool)
    .slice(0, count)
    .map((country) => buildQuestion(country, mode, pool));
}

/** Generate questions from due-card refs (mixed modes) */
export function generateQuestionsForRefs(
  refs: CardRef[],
  pool: Country[] = quizCountries,
): Question[] {
  const questions: Question[] = [];
  for (const ref of refs) {
    const country = quizCountryByName.get(ref.countryName);
    if (!country) continue; // stale card — skip gracefully
    questions.push(buildQuestion(country, ref.mode, pool));
  }
  return questions;
}
