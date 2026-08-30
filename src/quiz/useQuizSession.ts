import { useReducer, useCallback, useMemo } from "react";
import {
  quizSessionReducer,
  initialQuizSessionState,
} from "./quizSessionReducer";
import type { Question } from "./types";

export function useQuizSession() {
  const [state, dispatch] = useReducer(
    quizSessionReducer,
    initialQuizSessionState,
  );

  const start = useCallback((questions: Question[], isReviewMode: boolean) => {
    dispatch({ type: "START", questions, isReviewMode });
  }, []);

  const answer = useCallback((ans: string) => {
    dispatch({ type: "ANSWER", answer: ans });
  }, []);

  const next = useCallback(() => {
    dispatch({ type: "NEXT" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const currentQuestion = useMemo(
    () =>
      state.status === "in-progress"
        ? state.questions[state.currentIndex]
        : null,
    [state.status, state.questions, state.currentIndex],
  );

  return {
    ...state,
    currentQuestion,
    totalQuestions: state.questions.length,
    start,
    answer,
    next,
    reset,
  };
}
