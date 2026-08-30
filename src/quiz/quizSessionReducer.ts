import type { QuizSessionState, QuizSessionAction } from "./types";

export const initialQuizSessionState: QuizSessionState = {
  status: "idle",
  questions: [],
  currentIndex: 0,
  selected: null,
  score: 0,
  isReviewMode: false,
};

export function quizSessionReducer(
  state: QuizSessionState,
  action: QuizSessionAction,
): QuizSessionState {
  switch (action.type) {
    case "START":
      return {
        status: "in-progress",
        questions: action.questions,
        currentIndex: 0,
        selected: null,
        score: 0,
        isReviewMode: action.isReviewMode,
      };

    case "ANSWER": {
      if (state.selected !== null) return state; // already answered
      const currentQ = state.questions[state.currentIndex];
      const isCorrect = action.answer === currentQ.correct;
      return {
        ...state,
        selected: action.answer,
        score: isCorrect ? state.score + 1 : state.score,
      };
    }

    case "NEXT": {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, status: "finished" };
      }
      return {
        ...state,
        currentIndex: nextIndex,
        selected: null,
      };
    }

    case "RESET":
      return initialQuizSessionState;

    default:
      return state;
  }
}
