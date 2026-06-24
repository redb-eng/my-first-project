export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type Screen = 'home' | 'quiz' | 'result' | 'create' | 'edit';

export interface CustomCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: number;
  questions: Question[];
}

export interface QuizResult {
  question: Question;
  selectedIndex: number;
  isCorrect: boolean;
}

export interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
  description: string;
}
