import { createContext } from "react";
import type { useSpacedRepetition } from "./useSpacedRepetition";

export type SpacedRepetitionContextValue = ReturnType<typeof useSpacedRepetition>;

export const SpacedRepetitionContext =
  createContext<SpacedRepetitionContextValue | null>(null);
