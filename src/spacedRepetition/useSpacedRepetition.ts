import { useState, useCallback, useMemo } from "react";
import { getItem, setItem } from "../lib/storage";
import {
  type Card,
  type CardRef,
  cardId,
  createNewCard,
  reviewCard,
  isDue,
  MASTERED_INTERVAL_DAYS,
} from "./card";
import { ALL_CARD_REFS } from "./cardRegistry";

export interface SRStats {
  total: number;
  due: number;
  mastered: number;
  learning: number;
}

const SR_KEY = "spaced-repetition";

type CardMap = Record<string, Card>;

function loadCards(): CardMap {
  return getItem<CardMap>(SR_KEY, {});
}

function persistCards(cards: CardMap): void {
  setItem(SR_KEY, cards);
}

export function useSpacedRepetition() {
  const [cards, setCards] = useState<CardMap>(loadCards);

  const recordReview = useCallback(
    (ref: CardRef, quality: number) => {
      setCards((prev) => {
        const id = cardId(ref);
        const existing = prev[id] ?? createNewCard(ref);
        const updated = reviewCard(existing, quality);
        const next = { ...prev, [id]: updated };
        persistCards(next);
        return next;
      });
    },
    [],
  );

  const getDueCards = useCallback((): Card[] => {
    // Cards that exist and are due
    const dueExisting = Object.values(cards).filter((c) => isDue(c));

    // Questions never reviewed are also "due" (new cards)
    const newCards = ALL_CARD_REFS
      .filter((ref) => !cards[cardId(ref)])
      .map((ref) => createNewCard(ref));

    return [...dueExisting, ...newCards];
  }, [cards]);

  const getCardState = useCallback(
    (ref: CardRef): Card | undefined => cards[cardId(ref)],
    [cards],
  );

  const stats = useMemo(() => {
    const total = ALL_CARD_REFS.length;
    let mastered = 0;
    let learning = 0;
    let due = 0;

    for (const ref of ALL_CARD_REFS) {
      const card = cards[cardId(ref)];
      if (!card) {
        // Never seen = due
        due += 1;
        continue;
      }
      if (card.interval > MASTERED_INTERVAL_DAYS) {
        mastered += 1;
      } else {
        learning += 1;
      }
      if (isDue(card)) {
        due += 1;
      }
    }

    return { total, due, mastered, learning };
  }, [cards]);

  const resetAll = useCallback(() => {
    persistCards({});
    setCards({});
  }, []);

  return { recordReview, getDueCards, getCardState, stats, resetAll };
}
