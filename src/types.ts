export type QuestionType = 'choice' | 'text';

export interface Question {
  id: number;
  category: string;
  type?: QuestionType; // default: 'choice'
  question: string;
  image?: string; // 問題に表示する図のパス（public配下）
  // choice
  options: string[];
  correctIndex: number;
  // text — 正解テキスト。複数の許容回答は "/" で区切る
  correctText?: string;
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
  selectedIndex: number; // text問題は -1
  selectedText?: string; // text問題のユーザー回答
  isCorrect: boolean;
}

export interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
  description: string;
}
