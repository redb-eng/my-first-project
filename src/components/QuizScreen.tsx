import { useState } from 'react';
import type { Question, QuizResult } from '../types';

interface Props {
  questions: Question[];
  category: string;
  categoryColor: string;
  onComplete: (results: QuizResult[]) => void;
  onQuit: () => void;
}

export default function QuizScreen({ questions, category, categoryColor, onComplete, onQuit }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const current = questions[currentIndex];
  const isAnswered = selectedIndex !== null;
  const isLast = currentIndex === questions.length - 1;
  const progress = ((currentIndex) / questions.length) * 100;

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    setShowExplanation(true);
  };

  const handleNext = () => {
    const result: QuizResult = {
      question: current,
      selectedIndex: selectedIndex!,
      isCorrect: selectedIndex === current.correctIndex,
    };
    const newResults = [...results, result];

    if (isLast) {
      onComplete(newResults);
    } else {
      setResults(newResults);
      setCurrentIndex((i) => i + 1);
      setSelectedIndex(null);
      setShowExplanation(false);
    }
  };

  const optionClass = (index: number) => {
    if (!isAnswered) return 'option';
    if (index === current.correctIndex) return 'option option-correct';
    if (index === selectedIndex) return 'option option-wrong';
    return 'option option-dim';
  };

  return (
    <div className="quiz-screen">
      <div className="quiz-header">
        <button className="quit-btn" onClick={onQuit}>← 終了</button>
        <span className="quiz-category" style={{ color: categoryColor }}>{category}</span>
        <span className="quiz-counter">{currentIndex + 1} / {questions.length}</span>
      </div>

      <div className="progress-bar-wrap">
        <div className="progress-bar" style={{ width: `${progress}%`, background: categoryColor }} />
      </div>

      <div className="question-card">
        <p className="question-text">{current.question}</p>
      </div>

      <div className="options-list">
        {current.options.map((opt, i) => (
          <button
            key={i}
            className={optionClass(i)}
            onClick={() => handleSelect(i)}
          >
            <span className="option-label">{['A', 'B', 'C', 'D'][i]}</span>
            <span className="option-text">{opt}</span>
            {isAnswered && i === current.correctIndex && (
              <span className="option-badge correct-badge">✓</span>
            )}
            {isAnswered && i === selectedIndex && i !== current.correctIndex && (
              <span className="option-badge wrong-badge">✗</span>
            )}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="explanation-card" style={{ borderColor: categoryColor }}>
          <div className="explanation-header">
            {selectedIndex === current.correctIndex
              ? <span className="result-tag correct-tag">正解！</span>
              : <span className="result-tag wrong-tag">不正解</span>}
          </div>
          <p className="explanation-text">{current.explanation}</p>
        </div>
      )}

      {isAnswered && (
        <button
          className="next-btn"
          style={{ background: categoryColor }}
          onClick={handleNext}
        >
          {isLast ? '結果を見る' : '次の問題 →'}
        </button>
      )}
    </div>
  );
}
