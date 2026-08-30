import type { ReactNode } from "react";
import { useSpacedRepetition } from "./useSpacedRepetition";
import { SpacedRepetitionContext } from "./context";

export function SpacedRepetitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useSpacedRepetition();
  return (
    <SpacedRepetitionContext.Provider value={value}>
      {children}
    </SpacedRepetitionContext.Provider>
  );
}
