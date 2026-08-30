import type { QuizMode } from "../quiz/types";
import { type Sm2Params, nextSm2State, isDueOn, todayISO } from "./sm2";

export interface CardRef {
  countryName: string;
  mode: QuizMode;
}

export interface Card extends CardRef {
  id: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewedDate: string | null;
}

export const MASTERED_INTERVAL_DAYS = 21;

/** Produce an opaque card ID — never parse this back */
export function cardId(ref: CardRef): string {
  return `${ref.countryName}::${ref.mode}`;
}

/** Create a fresh card due immediately */
export function createNewCard(ref: CardRef, today = todayISO()): Card {
  return {
    ...ref,
    id: cardId(ref),
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: today,
    lastReviewedDate: null,
  };
}

/** Apply an SM-2 review to a card */
export function reviewCard(
  card: Card,
  quality: number,
  today = todayISO(),
): Card {
  const params: Sm2Params = {
    easeFactor: card.easeFactor,
    interval: card.interval,
    repetitions: card.repetitions,
  };
  const result = nextSm2State(params, quality, today);
  return {
    ...card,
    easeFactor: result.easeFactor,
    interval: result.interval,
    repetitions: result.repetitions,
    nextReviewDate: result.nextReviewDate,
    lastReviewedDate: today,
  };
}

/** Check if a card is due for review */
export function isDue(card: Card, today = todayISO()): boolean {
  return isDueOn(card.nextReviewDate, today);
}
