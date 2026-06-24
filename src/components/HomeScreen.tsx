import type { CategoryInfo, CustomCategory } from '../types';

interface Props {
  categories: CategoryInfo[];
  customCategories: CustomCategory[];
  onStart: (category: string, isCustom?: boolean) => void;
  onCreateNew: () => void;
  onEditCustom: (id: string) => void;
  onDeleteCustom: (id: string) => void;
  highScores: Record<string, number>;
  totalQuestions: Record<string, number>;
}

export default function HomeScreen({
  categories,
  customCategories,
  onStart,
  onCreateNew,
  onEditCustom,
  onDeleteCustom,
  highScores,
  totalQuestions,
}: Props) {
  return (
    <div className="home-screen">
      <div className="home-header">
        <h1 className="home-title">クイズ学習アプリ</h1>
        <p className="home-subtitle">カテゴリを選んで学習を始めよう</p>
      </div>

      {/* プリセットカテゴリ */}
      <h2 className="section-heading">収録問題</h2>
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
                <span className="category-best">ベスト {best}/{total}（{pct}%）</span>
              )}
              <span className="category-start">スタート →</span>
            </button>
          );
        })}
      </div>

      {/* カスタムカテゴリ */}
      <div className="custom-section-header">
        <h2 className="section-heading">自作の問題</h2>
        <button className="create-new-btn" onClick={onCreateNew}>＋ 新しく作る</button>
      </div>

      {customCategories.length === 0 ? (
        <div className="empty-custom">
          <p>まだ自作の問題がありません</p>
          <button className="create-new-btn-large" onClick={onCreateNew}>
            ＋ 最初の問題を作る
          </button>
        </div>
      ) : (
        <div className="category-grid">
          {customCategories.map((cat) => {
            const best = highScores[`custom:${cat.id}`];
            const total = cat.questions.length;
            const pct = best !== undefined && total > 0 ? Math.round((best / total) * 100) : null;
            return (
              <div
                key={cat.id}
                className="category-card custom-card"
                style={{ '--cat-color': cat.color } as React.CSSProperties}
              >
                <button
                  className="custom-card-body"
                  onClick={() => onStart(cat.id, true)}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                  <span className="category-count">{total}問（自作）</span>
                  {pct !== null && (
                    <span className="category-best">ベスト {best}/{total}（{pct}%）</span>
                  )}
                  <span className="category-start">スタート →</span>
                </button>
                <div className="custom-card-actions">
                  <button
                    className="edit-btn"
                    onClick={(e) => { e.stopPropagation(); onEditCustom(cat.id); }}
                  >
                    編集
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => { e.stopPropagation(); onDeleteCustom(cat.id); }}
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
