import type { QuizResult } from '../types';

interface Props {
  results: QuizResult[];
  category: string;
  categoryColor: string;
  onRetry: () => void;
  onHome: () => void;
}

export default function ResultScreen({ results, category, categoryColor, onRetry, onHome }: Props) {
  const score = results.filter((r) => r.isCorrect).length;
  const total = results.length;
  const pct = Math.round((score / total) * 100);

  const grade =
    pct >= 90 ? { label: 'S', message: '完璧です！素晴らしい！', color: '#f59e0b' } :
    pct >= 70 ? { label: 'A', message: 'よくできました！', color: '#10b981' } :
    pct >= 50 ? { label: 'B', message: 'もう少し頑張ろう！', color: '#3b82f6' } :
                { label: 'C', message: '復習してみましょう', color: '#ef4444' };

  return (
    <div className="result-screen">
      <div className="result-header">
        <h2 className="result-category" style={{ color: categoryColor }}>{category}</h2>
        <h1 className="result-title">クイズ完了！</h1>
      </div>

      <div className="score-card">
        <div className="grade-badge" style={{ background: grade.color }}>{grade.label}</div>
        <div className="score-display">
          <span className="score-num">{score}</span>
          <span className="score-sep"> / </span>
          <span className="score-total">{total}</span>
        </div>
        <div className="score-pct">{pct}%</div>
        <p className="grade-message">{grade.message}</p>
      </div>

      <div className="review-list">
        <h3 className="review-title">回答レビュー</h3>
        {results.map((r, i) => (
          <div key={i} className={`review-item ${r.isCorrect ? 'review-correct' : 'review-wrong'}`}>
            <div className="review-item-header">
              <span className="review-num">Q{i + 1}</span>
              <span className={`review-badge ${r.isCorrect ? 'badge-correct' : 'badge-wrong'}`}>
                {r.isCorrect ? '正解' : '不正解'}
              </span>
            </div>
            <div className="review-item-meta">
              <span className="review-type-badge">
                {r.question.type === 'text' ? '記述式' : '選択式'}
              </span>
            </div>
            <p className="review-question">{r.question.question}</p>
            {!r.isCorrect && (
              <div className="review-answers">
                {r.question.type === 'text' ? (
                  <>
                    <p className="review-your-answer">
                      あなたの答え：<span className="wrong-answer">{r.selectedText || '（未回答）'}</span>
                    </p>
                    <p className="review-correct-answer">
                      正解：<span className="correct-answer">
                        {r.question.correctText?.split('/').join(' または ')}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="review-your-answer">
                      あなたの答え：<span className="wrong-answer">{r.question.options[r.selectedIndex]}</span>
                    </p>
                    <p className="review-correct-answer">
                      正解：<span className="correct-answer">{r.question.options[r.question.correctIndex]}</span>
                    </p>
                  </>
                )}
              </div>
            )}
            {r.question.explanation && (
              <p className="review-explanation">{r.question.explanation}</p>
            )}
          </div>
        ))}
      </div>

      <div className="result-actions">
        <button className="btn-retry" style={{ background: categoryColor }} onClick={onRetry}>
          もう一度挑戦
        </button>
        <button className="btn-home" onClick={onHome}>
          ホームに戻る
        </button>
      </div>
    </div>
  );
}
