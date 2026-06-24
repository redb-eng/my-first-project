import type { CustomCategory } from '../types';

/** シンプルなCSVパーサー（クォート対応） */
function parseCSVRows(text: string): string[][] {
  const rows: string[][] = [];
  let cur = '';
  let inQ = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQ && text[i + 1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === ',' && !inQ) {
      row.push(cur.trim()); cur = '';
    } else if ((ch === '\n' || ch === '\r') && !inQ) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cur.trim()); cur = '';
      if (row.some((c) => c !== '')) rows.push(row);
      row = [];
    } else {
      cur += ch;
    }
  }
  row.push(cur.trim());
  if (row.some((c) => c !== '')) rows.push(row);
  return rows;
}

function toCorrectIndex(val: string): number {
  const v = val.trim().toUpperCase();
  if (v === 'A' || v === '1') return 0;
  if (v === 'B' || v === '2') return 1;
  if (v === 'C' || v === '3') return 2;
  if (v === 'D' || v === '4') return 3;
  const n = parseInt(val, 10);
  if (n >= 0 && n <= 3) return n;
  throw new Error(`正解列の値が不正です: "${val}" （A/B/C/D または 0〜3 を使ってください）`);
}

const COLORS = ['#7c3aed','#db2777','#ea580c','#16a34a','#0284c7','#9333ea','#dc2626','#0891b2'];
const ICONS  = ['📚','✏️','🔬','🎵','🌱','💻','🏃','🍳','🗺️','🎨'];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * CSVから CustomCategory を生成する。
 *
 * 期待する列順（1行目がヘッダーなら自動スキップ）:
 *   問題文, 選択肢A, 選択肢B, 選択肢C, 選択肢D, 正解(A/B/C/D or 0-3), 解説(省略可)
 */
export function importFromCSV(text: string, fileName: string): CustomCategory {
  const rows = parseCSVRows(text);
  if (rows.length === 0) throw new Error('ファイルが空です');

  // ヘッダー行の検出: 正解列が数値でも A/B/C/D でもなければヘッダーとみなす
  let dataRows = rows;
  const firstCorrectCell = (rows[0][5] ?? '').trim().toUpperCase();
  const isHeader = !['A','B','C','D','0','1','2','3'].includes(firstCorrectCell);
  if (isHeader) dataRows = rows.slice(1);

  if (dataRows.length === 0) throw new Error('問題データが見つかりません（ヘッダーのみのファイルです）');

  const questions = dataRows.map((cols, i) => {
    if (cols.length < 6) throw new Error(`${i + 1}行目: 列数が足りません（最低6列必要）`);
    const [question, a, b, c, d, correct, explanation = ''] = cols;
    if (!question) throw new Error(`${i + 1}行目: 問題文が空です`);
    if (!a || !b || !c || !d) throw new Error(`${i + 1}行目: 選択肢が不足しています`);
    return {
      id: Date.now() + i,
      category: fileName,
      question,
      options: [a, b, c, d],
      correctIndex: toCorrectIndex(correct),
      explanation,
    };
  });

  return {
    id: `custom-${Date.now()}`,
    name: fileName.replace(/\.[^.]+$/, ''),
    icon: randomPick(ICONS),
    color: randomPick(COLORS),
    createdAt: Date.now(),
    questions,
  };
}

/**
 * JSONから CustomCategory を生成する。
 *
 * 期待するスキーマ:
 * {
 *   "name": "カテゴリ名",
 *   "icon": "📚",        // 省略可
 *   "color": "#4f46e5",  // 省略可
 *   "questions": [
 *     {
 *       "question": "問題文",
 *       "options": ["A", "B", "C", "D"],
 *       "correctIndex": 0,   // 0〜3
 *       "explanation": "解説" // 省略可
 *     }
 *   ]
 * }
 */
export function importFromJSON(text: string): CustomCategory {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('JSONの形式が正しくありません');
  }

  const obj = data as Record<string, unknown>;
  if (typeof obj.name !== 'string' || !obj.name) throw new Error('"name" フィールドが必要です');
  if (!Array.isArray(obj.questions) || obj.questions.length === 0) {
    throw new Error('"questions" 配列が必要です');
  }

  const questions = (obj.questions as unknown[]).map((q, i) => {
    const qObj = q as Record<string, unknown>;
    if (typeof qObj.question !== 'string' || !qObj.question)
      throw new Error(`questions[${i}]: "question" が必要です`);
    if (!Array.isArray(qObj.options) || qObj.options.length !== 4)
      throw new Error(`questions[${i}]: "options" に4つの選択肢が必要です`);
    if (typeof qObj.correctIndex !== 'number' || qObj.correctIndex < 0 || qObj.correctIndex > 3)
      throw new Error(`questions[${i}]: "correctIndex" は 0〜3 の数値が必要です`);
    return {
      id: Date.now() + i,
      category: obj.name as string,
      question: qObj.question as string,
      options: qObj.options as string[],
      correctIndex: qObj.correctIndex as number,
      explanation: typeof qObj.explanation === 'string' ? qObj.explanation : '',
    };
  });

  return {
    id: `custom-${Date.now()}`,
    name: obj.name as string,
    icon: typeof obj.icon === 'string' ? obj.icon : randomPick(ICONS),
    color: typeof obj.color === 'string' ? obj.color : randomPick(COLORS),
    createdAt: Date.now(),
    questions,
  };
}

/** サンプルCSVテンプレートをダウンロードする */
export function downloadCSVTemplate() {
  const csv = [
    '問題文,選択肢A,選択肢B,選択肢C,選択肢D,正解(A/B/C/D),解説',
    '日本の首都はどこですか？,東京,大阪,京都,札幌,A,東京は1869年から日本の首都です。',
    '2 + 3 はいくつですか？,3,4,5,6,C,2 + 3 = 5 です。',
  ].join('\r\n');

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'quiz_template.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}
