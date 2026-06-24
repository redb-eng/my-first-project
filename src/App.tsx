import { useState, useEffect } from 'react';
import type { Screen, QuizResult, CustomCategory } from './types';
import { CATEGORIES, getQuestionsByCategory } from './data/questions';
import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import CreateScreen from './components/CreateScreen';
import './App.css';

function loadCustomCategories(): CustomCategory[] {
  try {
    return JSON.parse(localStorage.getItem('quizCustomCategories') || '[]');
  } catch {
    return [];
  }
}

function saveCustomCategories(cats: CustomCategory[]) {
  localStorage.setItem('quizCustomCategories', JSON.stringify(cats));
}

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(loadCustomCategories);
  const [highScores, setHighScores] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('quizHighScores') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('quizHighScores', JSON.stringify(highScores));
  }, [highScores]);

  const totalQuestions = Object.fromEntries(
    CATEGORIES.map((c) => [c.name, getQuestionsByCategory(c.name).length])
  );

  const currentQuestions = isCustom
    ? (customCategories.find((c) => c.id === selectedCategory)?.questions ?? [])
    : getQuestionsByCategory(selectedCategory);

  const categoryInfo = isCustom
    ? customCategories.find((c) => c.id === selectedCategory)
    : CATEGORIES.find((c) => c.name === selectedCategory);

  const categoryColor = categoryInfo?.color ?? '#4f46e5';
  const categoryName = isCustom
    ? (customCategories.find((c) => c.id === selectedCategory)?.name ?? '')
    : selectedCategory;

  const scoreKey = isCustom ? `custom:${selectedCategory}` : selectedCategory;

  const handleStart = (category: string, custom = false) => {
    setSelectedCategory(category);
    setIsCustom(custom);
    setResults([]);
    setScreen('quiz');
  };

  const handleComplete = (quizResults: QuizResult[]) => {
    setResults(quizResults);
    const score = quizResults.filter((r) => r.isCorrect).length;
    setHighScores((prev) => {
      const best = prev[scoreKey] ?? 0;
      return score > best ? { ...prev, [scoreKey]: score } : prev;
    });
    setScreen('result');
  };

  const handleSaveCustom = (cat: CustomCategory) => {
    setCustomCategories((prev) => {
      const exists = prev.find((c) => c.id === cat.id);
      const next = exists
        ? prev.map((c) => (c.id === cat.id ? cat : c))
        : [...prev, cat];
      saveCustomCategories(next);
      return next;
    });
    setEditingId(null);
    setScreen('home');
  };

  const handleDeleteCustom = (id: string) => {
    if (!window.confirm('この問題セットを削除してもよいですか？')) return;
    setCustomCategories((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveCustomCategories(next);
      return next;
    });
    setHighScores((prev) => {
      const next = { ...prev };
      delete next[`custom:${id}`];
      return next;
    });
  };

  const handleEditCustom = (id: string) => {
    setEditingId(id);
    setScreen('edit');
  };

  const handleImported = (cat: CustomCategory) => {
    setCustomCategories((prev) => {
      const next = [...prev, cat];
      saveCustomCategories(next);
      return next;
    });
    setImportError(null);
  };

  return (
    <div className="app">
      {screen === 'home' && (
        <>
          {importError && (
            <div className="import-error-banner">
              ファイル読み込みエラー：{importError}
              <button onClick={() => setImportError(null)}>×</button>
            </div>
          )}
          <HomeScreen
            categories={CATEGORIES}
            customCategories={customCategories}
            onStart={handleStart}
            onCreateNew={() => { setEditingId(null); setScreen('create'); }}
            onEditCustom={handleEditCustom}
            onDeleteCustom={handleDeleteCustom}
            onImported={handleImported}
            onImportError={setImportError}
            highScores={highScores}
            totalQuestions={totalQuestions}
          />
        </>
      )}
      {(screen === 'create' || screen === 'edit') && (
        <CreateScreen
          existing={editingId ? customCategories.find((c) => c.id === editingId) : undefined}
          onSave={handleSaveCustom}
          onCancel={() => setScreen('home')}
        />
      )}
      {screen === 'quiz' && (
        <QuizScreen
          questions={currentQuestions}
          category={categoryName}
          categoryColor={categoryColor}
          onComplete={handleComplete}
          onQuit={() => setScreen('home')}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          results={results}
          category={categoryName}
          categoryColor={categoryColor}
          onRetry={() => handleStart(selectedCategory, isCustom)}
          onHome={() => setScreen('home')}
        />
      )}
    </div>
  );
}

export default App;
