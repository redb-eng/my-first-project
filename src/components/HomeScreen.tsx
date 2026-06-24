import type { CategoryInfo } from '../types';

interface Props {
  categories: CategoryInfo[];
  onStart: (category: string) => void;
  highScores: Record<string, number>;
  totalQuestions: Record<string, number>;
}

export default function HomeScreen({ categories, onStart, highScores, totalQuestions }: Props) {
  return (
    <div className="home-screen">
      <div className="home-header">
        <h1 className="home-title">クイズ学習アプリ</h1>
        <p className="home-subtitle">カテゴリを選んで学習を始めよう</p>
      </div>

      <div className="category-grid">
        {categories.map((cat) => {
          const best = highScores[cat.name];
          const total = totalQuestions[cat.name] ?? 0;
          const pct = best !== undefined && total > 0 ? Math.round((best / total) * 100) : null;

          return (
            <button
              key={cat.name}
              className="category-card"
              style={{ '--cat-color': cat.color } as React.CSSProperties}
              onClick={() => onStart(cat.name)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
              <span className="category-desc">{cat.description}</span>
              <span className="category-count">{total}問</span>
              {pct !== null && (
                <span className="category-best">
                  ベスト {best}/{total}（{pct}%）
                </span>
              )}
              <span className="category-start">スタート →</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
