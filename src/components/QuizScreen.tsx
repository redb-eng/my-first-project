import { useState, useRef, useEffect } from 'react';
import type { Question, QuizResult } from '../types';

function normalizeAnswer(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function checkText(input: string, correctText: string): boolean {
  const n = normalizeAnswer(input);
  return correctText.split('/').map(normalizeAnswer).includes(n);
}

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
  const [textInput, setTextInput] = useState('');
  const [results, setResults] = useState<QuizResult[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = questions[currentIndex];
  const isText = current.type === 'text';
  const isAnswered = showExplanation;
  const isLast = currentIndex === questions.length - 1;
  const progress = (currentIndex / questions.length) * 100;

  useEffect(() => {
    if (isText && !isAnswered) inputRef.current?.focus();
  }, [currentIndex, isText, isAnswered]);

  const submitChoice = (index: number) => {
    if (isAnswered) return;
    const correct = index === current.correctIndex;
    setSelectedIndex(index);
    setIsCorrect(correct);
    setShowExplanation(true);
  };

  const submitText = () => {
    if (isAnswered || !textInput.trim()) return;
    const correct = checkText(textInput, current.correctText ?? '');
    setIsCorrect(correct);
    setShowExplanation(true);
  };

  const handleNext = () => {
    const result: QuizResult = isText
      ? { question: current, selectedIndex: -1, selectedText: textInput.trim(), isCorrect }
      : { question: current, selectedIndex: selectedIndex!, isCorrect };

    const newResults = [...results, result];
    if (isLast) {
      onComplete(newResults);
    } else {
      setResults(newResults);
      setCurrentIndex((i) => i + 1);
      setSelectedIndex(null);
      setTextInput('');
      setShowExplanation(false);
      setIsCorrect(false);
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
        <span className="question-type-badge" style={{ background: isText ? '#f0f0f5' : '#e8f4fd', color: isText ? '#6e6e73' : '#0284c7' }}>
          {isText ? '記述式' : '選択式'}
        </span>
        <p className="question-text">{current.question}</p>
      </div>

      {isText ? (
        <div className="text-answer-area">
          <input
            ref={inputRef}
            className={`text-answer-input ${isAnswered ? (isCorrect ? 'text-input-correct' : 'text-input-wrong') : ''}`}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitText()}
            placeholder="答えを入力してください"
            disabled={isAnswered}
          />
          {isAnswered && !isCorrect && current.correctText && (
            <p className="text-correct-reveal">
              正解：<span>{current.correctText.split('/').join(' または ')}</span>
            </p>
          )}
          {!isAnswered && (
            <button
              className="submit-text-btn"
              style={{ background: categoryColor }}
              onClick={submitText}
              disabled={!textInput.trim()}
            >
              回答する
            </button>
          )}
        </div>
      ) : (
        <div className="options-list">
          {current.options.map((opt, i) => (
            <button key={i} className={optionClass(i)} onClick={() => submitChoice(i)}>
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
      )}

      {isAnswered && (
        <div className="explanation-card" style={{ borderColor: categoryColor }}>
          <div className="explanation-header">
            {isCorrect
              ? <span className="result-tag correct-tag">正解！</span>
              : <span className="result-tag wrong-tag">不正解</span>}
          </div>
          {current.explanation && (
            <p className="explanation-text">{current.explanation}</p>
          )}
        </div>
      )}

      {isAnswered && (
        <button className="next-btn" style={{ background: categoryColor }} onClick={handleNext}>
          {isLast ? '結果を見る' : '次の問題 →'}
        </button>
      )}
    </div>
  );
}
