import { useState, useEffect } from "react";
import type { Country } from "../../data/countries";
import type { Question } from "../../quiz/types";
import MapView from "../MapView";
import QuizQuestionPrompt from "./QuizQuestionPrompt";
import "../Quiz.css";

interface QuizSessionProps {
  question: Question;
  selected: string | null;
  isSkipped: boolean;
  isReviewMode: boolean;
  currentIndex: number;
  totalQuestions: number;
  score: number;
  mapCountry: Country | null;
  onAnswer: (answer: string) => void;
  onSkip: () => void;
  onNext: () => void;
  onClose: () => void;
}

export default function QuizSession({
  question,
  selected,
  isSkipped,
  isReviewMode,
  currentIndex,
  totalQuestions,
  score,
  mapCountry,
  onAnswer,
  onSkip,
  onNext,
  onClose,
}: QuizSessionProps) {
  const [showMap, setShowMap] = useState(() => window.innerWidth > 900);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const handler = (e: MediaQueryListEvent) => setShowMap(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isLast = currentIndex + 1 >= totalQuestions;

  return (
    <div className="quiz-overlay">
      <div className="quiz-game">
        <div className="quiz-game-header">
          <button className="quiz-close" onClick={onClose}>✕</button>
          <div className="quiz-progress-info">
            <span>Question {currentIndex + 1} / {totalQuestions}</span>
            <span className="quiz-score-inline">Score: {score}</span>
          </div>
          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="quiz-game-body">
          {showMap && (
            <div className="quiz-map-panel">
              <MapView hoveredCountry={mapCountry} />
            </div>
          )}

          <QuizQuestionPrompt
            question={question}
            selected={selected}
            isSkipped={isSkipped}
            isReviewMode={isReviewMode}
            onAnswer={onAnswer}
            onSkip={onSkip}
            onNext={onNext}
            isLast={isLast}
          />
        </div>
      </div>
    </div>
  );
}
