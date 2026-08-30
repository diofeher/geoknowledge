import type { QuizMode } from "../../quiz/types";
import type { SRStats, SRStatsByMode } from "../../spacedRepetition/useSpacedRepetition";
import "../Quiz.css";

interface QuizModeSelectProps {
  onSelectMode: (mode: QuizMode) => void;
  onStartReview: (mode?: QuizMode) => void;
  onClose: () => void;
  srStats: SRStats;
  srStatsByMode: SRStatsByMode;
}

const MODES: { key: QuizMode; icon: string; title: string; desc: string }[] = [
  { key: "capital", icon: "🏛️", title: "Guess the Capital", desc: "Name the capital city" },
  { key: "flag", icon: "🏳️", title: "Guess the Flag", desc: "Pick the correct flag" },
  { key: "country", icon: "🌍", title: "Guess the Country", desc: "Identify from its flag" },
  { key: "population", icon: "👥", title: "Who Has More?", desc: "Pick the larger population" },
];

export default function QuizModeSelect({
  onSelectMode,
  onStartReview,
  onClose,
  srStats,
  srStatsByMode,
}: QuizModeSelectProps) {
  return (
    <div className="quiz-overlay">
      <div className="quiz-card quiz-menu">
        <button className="quiz-close" onClick={onClose}>✕</button>
        <h2 className="quiz-title">🎮 Quiz Mode</h2>
        <p className="quiz-subtitle">Test your geography knowledge!</p>
        <div className="quiz-modes">
          {MODES.map((m) => (
            <button
              key={m.key}
              className="quiz-mode-btn"
              onClick={() => onSelectMode(m.key)}
            >
              <span className="quiz-mode-icon">{m.icon}</span>
              <span className="quiz-mode-title">{m.title}</span>
              <span className="quiz-mode-desc">{m.desc}</span>
            </button>
          ))}
        </div>

        <h3 className="quiz-review-heading">🔁 Spaced Review</h3>
        <p className="quiz-review-subtitle">
          <span className="quiz-sr-stat">📬 {srStats.due} due</span>
          <span className="quiz-sr-stat">📖 {srStats.learning} learning</span>
          <span className="quiz-sr-stat">✅ {srStats.mastered} mastered</span>
        </p>
        <div className="quiz-modes">
          {MODES.map((m) => {
            const modeStats = srStatsByMode[m.key];
            return (
              <button
                key={`review-${m.key}`}
                className="quiz-mode-btn quiz-mode-review-item"
                onClick={() => onStartReview(m.key)}
                disabled={modeStats.due === 0}
              >
                <span className="quiz-mode-icon">{m.icon}</span>
                <span className="quiz-mode-title">{m.title}</span>
                <span className="quiz-mode-desc">
                  {modeStats.due === 0 ? "All caught up!" : `${modeStats.due} due`}
                </span>
              </button>
            );
          })}
          <button
            className="quiz-mode-btn quiz-mode-review"
            onClick={() => onStartReview()}
            disabled={srStats.due === 0}
          >
            <span className="quiz-mode-icon">🔀</span>
            <span className="quiz-mode-title">All Modes</span>
            <span className="quiz-mode-desc">
              {srStats.due === 0 ? "All caught up!" : `${srStats.due} due (mixed)`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
