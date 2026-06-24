import { useState, useEffect } from 'react';
import type { Screen, QuizResult } from './types';
import { CATEGORIES, getQuestionsByCategory } from './data/questions';
import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import './App.css';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [results, setResults] = useState<QuizResult[]>([]);
  const [highScores, setHighScores] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('quizHighScores') || '{}');
    } catch {
      return {};
    }
  });

  const totalQuestions = Object.fromEntries(
    CATEGORIES.map((c) => [c.name, getQuestionsByCategory(c.name).length])
  );

  const categoryInfo = CATEGORIES.find((c) => c.name === selectedCategory);
  const currentQuestions = selectedCategory ? getQuestionsByCategory(selectedCategory) : [];

  useEffect(() => {
    localStorage.setItem('quizHighScores', JSON.stringify(highScores));
  }, [highScores]);

  const handleStart = (category: string) => {
    setSelectedCategory(category);
    setResults([]);
    setScreen('quiz');
  };

  const handleComplete = (quizResults: QuizResult[]) => {
    setResults(quizResults);
    const score = quizResults.filter((r) => r.isCorrect).length;
    setHighScores((prev) => {
      const best = prev[selectedCategory] ?? 0;
      return score > best ? { ...prev, [selectedCategory]: score } : prev;
    });
    setScreen('result');
  };

  return (
    <div className="app">
      {screen === 'home' && (
        <HomeScreen
          categories={CATEGORIES}
          onStart={handleStart}
          highScores={highScores}
          totalQuestions={totalQuestions}
        />
      )}
      {screen === 'quiz' && categoryInfo && (
        <QuizScreen
          questions={currentQuestions}
          category={selectedCategory}
          categoryColor={categoryInfo.color}
          onComplete={handleComplete}
          onQuit={() => setScreen('home')}
        />
      )}
      {screen === 'result' && categoryInfo && (
        <ResultScreen
          results={results}
          category={selectedCategory}
          categoryColor={categoryInfo.color}
          onRetry={() => handleStart(selectedCategory)}
          onHome={() => setScreen('home')}
        />
      )}
    </div>
  );
}

export default App;
