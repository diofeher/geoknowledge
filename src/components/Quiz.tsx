import { useState, useRef, useCallback } from "react";
import type { Country } from "../data/countries";
import type { QuizMode } from "../quiz/types";
import { generateRandomQuestions, generateQuestionsForRefs } from "../quiz/questionGenerator";
import { useQuizSession } from "../quiz/useQuizSession";
import { useSpacedRepetitionContext } from "../spacedRepetition/useSpacedRepetitionContext";
import { qualityFromCorrectness } from "../spacedRepetition/sm2";
import { sampleSize } from "../lib/arrayUtils";
import QuizModeSelect from "./quiz/QuizModeSelect";
import QuizSession from "./quiz/QuizSession";
import QuizResults from "./quiz/QuizResults";
import "./Quiz.css";

const QUESTIONS_PER_ROUND = 10;
const REVIEW_BATCH_SIZE = 20;

interface QuizProps {
  onClose: () => void;
}

export default function Quiz({ onClose }: QuizProps) {
  const session = useQuizSession();
  const sr = useSpacedRepetitionContext();
  const [mapCountry, setMapCountry] = useState<Country | null>(null);
  const questionStartedAt = useRef(Date.now());

  const startClassic = useCallback(
    (mode: QuizMode) => {
      const questions = generateRandomQuestions(mode, QUESTIONS_PER_ROUND);
      session.start(questions, false);
      setMapCountry(null);
      questionStartedAt.current = Date.now();
    },
    [session],
  );

  const [reviewMode, setReviewMode] = useState<QuizMode | undefined>(undefined);

  const startReview = useCallback((filterMode?: QuizMode) => {
    const dueCards = sr.getDueCards(filterMode);
    if (dueCards.length === 0) return;
    const sampled = sampleSize(dueCards, REVIEW_BATCH_SIZE);
    const refs = sampled.map((c) => ({ countryName: c.countryName, mode: c.mode }));
    const questions = generateQuestionsForRefs(refs);
    if (questions.length === 0) return;
    setReviewMode(filterMode);
    session.start(questions, true);
    setMapCountry(null);
    questionStartedAt.current = Date.now();
  }, [sr, session]);

  const handleAnswer = useCallback(
    (answer: string) => {
      session.answer(answer);
      const q = session.currentQuestion;
      if (!q) return;

      const isCorrect = answer === q.correct;

      // Fly to country on map
      setMapCountry(q.country);

      // Record SR data for review mode
      if (session.isReviewMode) {
        const elapsed = Date.now() - questionStartedAt.current;
        const quality = qualityFromCorrectness(isCorrect, elapsed);
        sr.recordReview({ countryName: q.country.name, mode: q.mode }, quality);
      }
    },
    [session, sr],
  );

  const handleSkip = useCallback(() => {
    const q = session.currentQuestion;
    if (!q) return;
    // Record quality 0 (worst) — "I don't know"
    if (session.isReviewMode) {
      sr.recordReview({ countryName: q.country.name, mode: q.mode }, 0);
    }
    session.skip();
  }, [session, sr]);

  const handleNext = useCallback(() => {
    session.next();
    questionStartedAt.current = Date.now();
  }, [session]);

  // Mode selection screen
  if (session.status === "idle") {
    return (
      <QuizModeSelect
        onSelectMode={startClassic}
        onStartReview={startReview}
        onClose={onClose}
        srStats={sr.stats}
        srStatsByMode={sr.statsByMode}
      />
    );
  }

  // Results screen
  if (session.status === "finished") {
    return (
      <QuizResults
        score={session.score}
        totalQuestions={session.totalQuestions}
        isReviewMode={session.isReviewMode}
        srStats={sr.stats}
        onPlayAgain={session.isReviewMode ? () => startReview(reviewMode) : () => {
          // Find the mode of the first question to replay the same mode
          const mode = session.questions[0]?.mode;
          if (mode) startClassic(mode);
        }}
        onChangeMode={session.reset}
        onClose={onClose}
      />
    );
  }

  // Question screen
  if (!session.currentQuestion) return null;

  return (
    <QuizSession
      question={session.currentQuestion}
      selected={session.selected}
      isSkipped={session.isSkipped}
      isReviewMode={session.isReviewMode}
      currentIndex={session.currentIndex}
      totalQuestions={session.totalQuestions}
      score={session.score}
      mapCountry={mapCountry}
      onAnswer={handleAnswer}
      onSkip={handleSkip}
      onNext={handleNext}
      onClose={onClose}
    />
  );
}
