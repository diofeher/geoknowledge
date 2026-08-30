/** SM-2 spaced repetition algorithm — pure functions, domain-agnostic */

export interface Sm2Params {
  easeFactor: number;
  interval: number; // days
  repetitions: number;
}

export interface Sm2Result extends Sm2Params {
  nextReviewDate: string; // ISO date (YYYY-MM-DD)
}

export function todayISO(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * SM-2 algorithm: calculate next review based on answer quality.
 * @param quality 0–5 scale (0-2 = fail, 3-5 = pass)
 * @param today injectable for testing
 */
export function nextSm2State(
  prev: Sm2Params,
  quality: number,
  today = todayISO(),
): Sm2Result {
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  let { easeFactor, interval, repetitions } = prev;

  // Adjust ease factor
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  if (q >= 3) {
    // Correct answer
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  } else {
    // Incorrect — reset
    repetitions = 0;
    interval = 1;
  }

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: addDays(today, interval),
  };
}

/** Check if a card is due for review */
export function isDueOn(nextReviewDate: string, today = todayISO()): boolean {
  return nextReviewDate <= today;
}

/**
 * Auto-calculate quality from answer correctness and response time.
 * Wrong → 1, Correct+slow(>15s) → 3, Correct+medium(5-15s) → 4, Correct+fast(<5s) → 5
 */
export function qualityFromCorrectness(
  correct: boolean,
  responseTimeMs: number,
): number {
  if (!correct) return 1;
  if (responseTimeMs > 15_000) return 3;
  if (responseTimeMs > 5_000) return 4;
  return 5;
}
