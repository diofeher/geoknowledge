import { useState, useCallback, useEffect } from "react";
import type { Country } from "../data/countries";
import { countries } from "../data/countries";
import MapView from "./MapView";
import "./Quiz.css";

type QuizMode = "capital" | "flag" | "country" | "population";

interface Question {
  country: Country;
  options: string[];
  correct: string;
  // For population mode
  countryB?: Country;
}

const QUESTIONS_PER_ROUND = 10;

// Only use sovereign countries (not territories) for quiz to keep it cleaner
const quizCountries = countries.filter((c) => !c.isTerritory && c.population > 100000);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[], count: number, exclude?: T): T[] {
  const filtered = exclude ? arr.filter((x) => x !== exclude) : [...arr];
  return shuffle(filtered).slice(0, count);
}

function generateQuestions(mode: QuizMode): Question[] {
  const pool = shuffle(quizCountries).slice(0, QUESTIONS_PER_ROUND);

  return pool.map((country) => {
    if (mode === "capital") {
      const wrong = pickRandom(quizCountries, 3, country).map((c) => c.capital);
      const options = shuffle([country.capital, ...wrong]);
      return { country, options, correct: country.capital };
    }

    if (mode === "flag") {
      const wrong = pickRandom(quizCountries, 3, country).map((c) => c.flag);
      const options = shuffle([country.flag, ...wrong]);
      return { country, options, correct: country.flag };
    }

    if (mode === "country") {
      const wrong = pickRandom(quizCountries, 3, country).map((c) => c.name);
      const options = shuffle([country.name, ...wrong]);
      return { country, options, correct: country.name };
    }

    // population mode
    const countryB = pickRandom(quizCountries, 1, country)[0];
    const options = [country.name, countryB.name];
    const correct =
      country.population >= countryB.population ? country.name : countryB.name;
    return { country, options, correct, countryB };
  });
}

const MODES: { key: QuizMode; icon: string; title: string; desc: string }[] = [
  { key: "capital", icon: "🏛️", title: "Guess the Capital", desc: "Name the capital city" },
  { key: "flag", icon: "🏳️", title: "Guess the Flag", desc: "Pick the correct flag" },
  { key: "country", icon: "🌍", title: "Guess the Country", desc: "Identify from its flag" },
  { key: "population", icon: "👥", title: "Who Has More?", desc: "Pick the larger population" },
];

interface QuizProps {
  onClose: () => void;
}

export default function Quiz({ onClose }: QuizProps) {
  const [mode, setMode] = useState<QuizMode | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [mapCountry, setMapCountry] = useState<Country | null>(null);
  const [showMap, setShowMap] = useState(() => window.innerWidth > 900);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const handler = (e: MediaQueryListEvent) => setShowMap(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const startQuiz = useCallback((m: QuizMode) => {
    setMode(m);
    setQuestions(generateQuestions(m));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setMapCountry(null);
  }, []);

  const question = questions[current];

  const handleAnswer = (answer: string) => {
    if (selected) return; // already answered
    setSelected(answer);
    const isCorrect = answer === question.correct;
    if (isCorrect) setScore((s) => s + 1);
    // Fly to country on map
    setMapCountry(question.country);
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const scorePercent = Math.round((score / QUESTIONS_PER_ROUND) * 100);
  const scoreEmoji =
    scorePercent === 100 ? "🏆" : scorePercent >= 70 ? "🎉" : scorePercent >= 40 ? "📚" : "💪";

  // Mode selection screen
  if (!mode) {
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
                onClick={() => startQuiz(m.key)}
              >
                <span className="quiz-mode-icon">{m.icon}</span>
                <span className="quiz-mode-title">{m.title}</span>
                <span className="quiz-mode-desc">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (finished) {
    return (
      <div className="quiz-overlay">
        <div className="quiz-card quiz-results">
          <button className="quiz-close" onClick={onClose}>✕</button>
          <div className="quiz-results-emoji">{scoreEmoji}</div>
          <h2 className="quiz-title">Results</h2>
          <div className="quiz-score-big">
            {score} / {QUESTIONS_PER_ROUND}
          </div>
          <div className="quiz-score-percent">{scorePercent}% correct</div>
          <div className="quiz-results-actions">
            <button className="quiz-btn quiz-btn-primary" onClick={() => startQuiz(mode)}>
              Play Again
            </button>
            <button className="quiz-btn quiz-btn-secondary" onClick={() => setMode(null)}>
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

  // Question screen
  return (
    <div className="quiz-overlay">
      <div className="quiz-game">
        <div className="quiz-game-header">
          <button className="quiz-close" onClick={onClose}>✕</button>
          <div className="quiz-progress-info">
            <span>Question {current + 1} / {QUESTIONS_PER_ROUND}</span>
            <span className="quiz-score-inline">Score: {score}</span>
          </div>
          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{ width: `${((current + 1) / QUESTIONS_PER_ROUND) * 100}%` }}
            />
          </div>
        </div>

        <div className="quiz-game-body">
          {showMap && (
            <div className="quiz-map-panel">
              <MapView hoveredCountry={mapCountry} />
            </div>
          )}

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
                    onClick={() => handleAnswer(opt)}
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
                    ✗ Wrong — answer: <strong>{question.correct}</strong>
                    {mode === "population" && question.countryB && (
                      <span className="quiz-feedback-detail">
                        {" "}({question.country.name}: {(question.country.population / 1e6).toFixed(1)}M
                        {" "}vs {question.countryB.name}: {(question.countryB.population / 1e6).toFixed(1)}M)
                      </span>
                    )}
                  </span>
                )}
                <button className="quiz-btn quiz-btn-primary quiz-next-btn" onClick={nextQuestion}>
                  {current + 1 >= QUESTIONS_PER_ROUND ? "See Results" : "Next →"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
