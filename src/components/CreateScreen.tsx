import { useState } from 'react';
import type { Question, CustomCategory, QuestionType } from '../types';

const COLORS = [
  '#7c3aed', '#db2777', '#ea580c', '#16a34a',
  '#0284c7', '#9333ea', '#dc2626', '#0891b2',
];

const ICONS = ['📚', '✏️', '🔬', '🎵', '🌱', '💻', '🏃', '🍳', '🗺️', '🎨'];

interface DraftQuestion {
  type: QuestionType;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  correctText: string;
  explanation: string;
}

function emptyDraft(): DraftQuestion {
  return {
    type: 'choice',
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    correctText: '',
    explanation: '',
  };
}

interface Props {
  existing?: CustomCategory;
  onSave: (cat: CustomCategory) => void;
  onCancel: () => void;
}

export default function CreateScreen({ existing, onSave, onCancel }: Props) {
  const [name, setName] = useState(existing?.name ?? '');
  const [icon, setIcon] = useState(existing?.icon ?? ICONS[0]);
  const [color, setColor] = useState(existing?.color ?? COLORS[0]);
  const [drafts, setDrafts] = useState<DraftQuestion[]>(
    existing?.questions.length
      ? existing.questions.map((q) => ({
          type: q.type ?? 'choice',
          question: q.question,
          options: (q.options.length === 4 ? q.options : ['', '', '', '']) as [string, string, string, string],
          correctIndex: q.correctIndex,
          correctText: q.correctText ?? '',
          explanation: q.explanation,
        }))
      : [emptyDraft()]
  );
  const [error, setError] = useState('');

  const updateDraft = (i: number, patch: Partial<DraftQuestion>) => {
    setDrafts((prev) => prev.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  };

  const updateOption = (qi: number, oi: number, val: string) => {
    setDrafts((prev) =>
      prev.map((d, idx) => {
        if (idx !== qi) return d;
        const opts = [...d.options] as [string, string, string, string];
        opts[oi] = val;
        return { ...d, options: opts };
      })
    );
  };

  const addQuestion = () => setDrafts((prev) => [...prev, emptyDraft()]);

  const removeQuestion = (i: number) => {
    if (drafts.length === 1) return;
    setDrafts((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSave = () => {
    if (!name.trim()) { setError('カテゴリ名を入力してください'); return; }
    for (let i = 0; i < drafts.length; i++) {
      const d = drafts[i];
      if (!d.question.trim()) { setError(`問題 ${i + 1} の問題文が空です`); return; }
      if (d.type === 'choice') {
        for (let j = 0; j < 4; j++) {
          if (!d.options[j].trim()) {
            setError(`問題 ${i + 1} の選択肢 ${['A', 'B', 'C', 'D'][j]} が空です`);
            return;
          }
        }
      } else {
        if (!d.correctText.trim()) { setError(`問題 ${i + 1} の正解を入力してください`); return; }
      }
    }
    setError('');

    const questions: Question[] = drafts.map((d, i) => ({
      id: Date.now() + i,
      category: name.trim(),
      type: d.type,
      question: d.question.trim(),
      options: d.type === 'choice' ? d.options.map((o) => o.trim()) : [],
      correctIndex: d.type === 'choice' ? d.correctIndex : 0,
      correctText: d.type === 'text' ? d.correctText.trim() : undefined,
      explanation: d.explanation.trim(),
    }));

    onSave({
      id: existing?.id ?? `custom-${Date.now()}`,
      name: name.trim(),
      icon,
      color,
      createdAt: existing?.createdAt ?? Date.now(),
      questions,
    });
  };

  return (
    <div className="create-screen">
      <div className="create-header">
        <button className="quit-btn" onClick={onCancel}>← 戻る</button>
        <h2 className="create-title">{existing ? '問題を編集' : '新しい問題を作る'}</h2>
      </div>

      {/* カテゴリ設定 */}
      <section className="create-section">
        <h3 className="section-label">カテゴリ設定</h3>
        <label className="field-label">カテゴリ名</label>
        <input
          className="text-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：英単語、理科、プログラミング"
          maxLength={20}
        />

        <label className="field-label">アイコン</label>
        <div className="icon-grid">
          {ICONS.map((ic) => (
            <button
              key={ic}
              className={`icon-btn ${icon === ic ? 'icon-btn-active' : ''}`}
              onClick={() => setIcon(ic)}
            >
              {ic}
            </button>
          ))}
        </div>

        <label className="field-label">テーマカラー</label>
        <div className="color-grid">
          {COLORS.map((c) => (
            <button
              key={c}
              className={`color-btn ${color === c ? 'color-btn-active' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </section>

      {/* 問題一覧 */}
      {drafts.map((d, qi) => (
        <section key={qi} className="create-section question-section">
          <div className="question-section-header">
            <h3 className="section-label">問題 {qi + 1}</h3>
            {drafts.length > 1 && (
              <button className="remove-q-btn" onClick={() => removeQuestion(qi)}>削除</button>
            )}
          </div>

          {/* 形式切り替え */}
          <div className="type-toggle">
            <button
              className={`type-toggle-btn ${d.type === 'choice' ? 'type-active' : ''}`}
              onClick={() => updateDraft(qi, { type: 'choice' })}
            >
              選択式
            </button>
            <button
              className={`type-toggle-btn ${d.type === 'text' ? 'type-active' : ''}`}
              onClick={() => updateDraft(qi, { type: 'text' })}
            >
              記述式
            </button>
          </div>

          <label className="field-label">問題文</label>
          <textarea
            className="text-input textarea"
            value={d.question}
            onChange={(e) => updateDraft(qi, { question: e.target.value })}
            placeholder="問題文を入力してください"
            rows={3}
          />

          {d.type === 'choice' ? (
            <>
              <label className="field-label">選択肢（正解をラジオボタンで選択）</label>
              {d.options.map((opt, oi) => (
                <div key={oi} className="option-input-row">
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={d.correctIndex === oi}
                    onChange={() => updateDraft(qi, { correctIndex: oi })}
                    className="radio-input"
                  />
                  <span className="option-input-label">{['A', 'B', 'C', 'D'][oi]}</span>
                  <input
                    className="text-input option-text-input"
                    value={opt}
                    onChange={(e) => updateOption(qi, oi, e.target.value)}
                    placeholder={`選択肢 ${['A', 'B', 'C', 'D'][oi]}`}
                  />
                </div>
              ))}
            </>
          ) : (
            <>
              <label className="field-label">正解テキスト</label>
              <input
                className="text-input"
                value={d.correctText}
                onChange={(e) => updateDraft(qi, { correctText: e.target.value })}
                placeholder="例：東京　※複数の正解は「/」で区切る（東京/Tokyo）"
              />
              <p className="field-hint">入力は大文字・小文字・前後の空白を無視して判定します</p>
            </>
          )}

          <label className="field-label">解説（任意）</label>
          <textarea
            className="text-input textarea"
            value={d.explanation}
            onChange={(e) => updateDraft(qi, { explanation: e.target.value })}
            placeholder="正解の解説や補足を入力（省略可）"
            rows={2}
          />
        </section>
      ))}

      <button className="add-question-btn" onClick={addQuestion}>
        ＋ 問題を追加
      </button>

      {error && <p className="create-error">{error}</p>}

      <button className="save-btn" style={{ background: color }} onClick={handleSave}>
        {existing ? '変更を保存' : `「${name || 'このカテゴリ'}」を保存`}
      </button>
    </div>
  );
}
