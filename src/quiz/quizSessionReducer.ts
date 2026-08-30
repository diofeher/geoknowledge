import type { QuizSessionState, QuizSessionAction } from "./types";

export const initialQuizSessionState: QuizSessionState = {
  status: "idle",
  questions: [],
  currentIndex: 0,
  selected: null,
  isSkipped: false,
  score: 0,
  skipped: 0,
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
        isSkipped: false,
        score: 0,
        skipped: 0,
        isReviewMode: action.isReviewMode,
      };

    case "ANSWER": {
      if (state.selected !== null || state.isSkipped) return state;
      const currentQ = state.questions[state.currentIndex];
      const isCorrect = action.answer === currentQ.correct;
      return {
        ...state,
        selected: action.answer,
        isSkipped: false,
        score: isCorrect ? state.score + 1 : state.score,
      };
    }

    case "SKIP": {
      if (state.selected !== null || state.isSkipped) return state;
      return {
        ...state,
        selected: null,
        isSkipped: true,
        skipped: state.skipped + 1,
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
        isSkipped: false,
      };
    }

    case "RESET":
      return initialQuizSessionState;

    default:
      return state;
  }
}
