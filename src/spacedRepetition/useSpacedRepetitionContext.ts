import { useContext } from "react";
import { SpacedRepetitionContext } from "./context";

export function useSpacedRepetitionContext() {
  const ctx = useContext(SpacedRepetitionContext);
  if (!ctx)
    throw new Error(
      "useSpacedRepetitionContext must be used within SpacedRepetitionProvider",
    );
  return ctx;
}
