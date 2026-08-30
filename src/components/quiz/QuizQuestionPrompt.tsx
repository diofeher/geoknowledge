import type { Question } from "../../quiz/types";
import { quizCountries } from "../../data/quizCountries";
import "../Quiz.css";

interface QuizQuestionPromptProps {
  question: Question;
  selected: string | null;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  isLast: boolean;
}

export default function QuizQuestionPrompt({
  question,
  selected,
  onAnswer,
  onNext,
  isLast,
}: QuizQuestionPromptProps) {
  const { mode } = question;

  return (
    <div className="quiz-question-panel">
      <div className="quiz-prompt">
        {mode === "capital" && (
          <>
            <span className="quiz-prompt-flag">{question.country.flag}</span>
            <span>What is the capital of <strong>{question.country.name}</strong>?</span>
          </>
        )}
        {mode === "flag" && (
          <span>Which flag belongs to <strong>{question.country.name}</strong>?</span>
        )}
        {mode === "country" && (
          <>
            <span className="quiz-prompt-flag-big">{question.country.flag}</span>
            <span>Which country does this flag belong to?</span>
          </>
        )}
        {mode === "population" && (
          <>
            <span>Which country has a larger population?</span>
            <div className="quiz-vs">
              <span className="quiz-vs-flag">{question.country.flag}</span>
              <span className="quiz-vs-text">vs</span>
              <span className="quiz-vs-flag">{question.countryB!.flag}</span>
            </div>
          </>
        )}
      </div>

      <div className={`quiz-options ${mode === "flag" ? "quiz-options-flags" : ""}`}>
        {question.options.map((opt) => {
          let cls = "quiz-option";
          if (selected) {
            if (opt === question.correct) cls += " quiz-option-correct";
            else if (opt === selected) cls += " quiz-option-wrong";
            else cls += " quiz-option-dim";
          }
          return (
            <button
              key={opt}
              className={cls}
              onClick={() => onAnswer(opt)}
              disabled={!!selected}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="quiz-feedback">
          {selected === question.correct ? (
            <span className="quiz-feedback-correct">✓ Correct!</span>
          ) : (
            <span className="quiz-feedback-wrong">
              ✗ Wrong — answer:{" "}
              {mode !== "flag" && (
                <span className="quiz-feedback-flag">
                  {mode === "population" && question.countryB
                    ? question.correct === question.country.name
                      ? question.country.flag
                      : question.countryB.flag
                    : question.country.flag}{" "}
                </span>
              )}
              <strong>{question.correct}</strong>
              {mode === "flag" && (
                <span className="quiz-feedback-detail">
                  {" "}— you picked: {selected} {quizCountries.find((c) => c.flag === selected)?.name}
                </span>
              )}
            </span>
          )}
          {mode === "population" && question.countryB && (
            <span className="quiz-feedback-detail">
              ({question.country.name}: {(question.country.population / 1e6).toFixed(1)}M
              {" "}vs {question.countryB.name}: {(question.countryB.population / 1e6).toFixed(1)}M)
            </span>
          )}
          <button className="quiz-btn quiz-btn-primary quiz-next-btn" onClick={onNext}>
            {isLast ? "See Results" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}
