import type { SRStats } from "../../spacedRepetition/useSpacedRepetition";
import "../Quiz.css";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  isReviewMode: boolean;
  srStats?: SRStats;
  onPlayAgain: () => void;
  onChangeMode: () => void;
  onClose: () => void;
}

export default function QuizResults({
  score,
  totalQuestions,
  isReviewMode,
  srStats,
  onPlayAgain,
  onChangeMode,
  onClose,
}: QuizResultsProps) {
  const scorePercent = Math.round((score / totalQuestions) * 100);
  const scoreEmoji =
    scorePercent === 100
      ? "🏆"
      : scorePercent >= 70
        ? "🎉"
        : scorePercent >= 40
          ? "📚"
          : "💪";

  return (
    <div className="quiz-overlay">
      <div className="quiz-card quiz-results">
        <button className="quiz-close" onClick={onClose}>✕</button>
        <div className="quiz-results-emoji">{scoreEmoji}</div>
        <h2 className="quiz-title">Results</h2>
        <div className="quiz-score-big">
          {score} / {totalQuestions}
        </div>
        <div className="quiz-score-percent">{scorePercent}% correct</div>

        {isReviewMode && srStats && (
          <div className="quiz-sr-results">
            <div className="quiz-sr-results-grid">
              <div className="quiz-sr-results-stat">
                <span className="quiz-sr-results-value">{srStats.due}</span>
                <span className="quiz-sr-results-label">Due</span>
              </div>
              <div className="quiz-sr-results-stat">
                <span className="quiz-sr-results-value">{srStats.learning}</span>
                <span className="quiz-sr-results-label">Learning</span>
              </div>
              <div className="quiz-sr-results-stat">
                <span className="quiz-sr-results-value">{srStats.mastered}</span>
                <span className="quiz-sr-results-label">Mastered</span>
              </div>
              <div className="quiz-sr-results-stat">
                <span className="quiz-sr-results-value">{srStats.total}</span>
                <span className="quiz-sr-results-label">Total</span>
              </div>
            </div>
          </div>
        )}

        <div className="quiz-results-actions">
          <button className="quiz-btn quiz-btn-primary" onClick={onPlayAgain}>
            {isReviewMode ? "🔁 Review More" : "Play Again"}
          </button>
          <button className="quiz-btn quiz-btn-secondary" onClick={onChangeMode}>
            Change Mode
          </button>
          <button className="quiz-btn quiz-btn-secondary" onClick={onClose}>
            Exit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
