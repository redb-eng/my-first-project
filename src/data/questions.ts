import type { Question, CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    name: '英語',
    icon: '🇬🇧',
    color: '#4f46e5',
    description: '英単語・文法・表現',
  },
  {
    name: '数学',
    icon: '📐',
    color: '#0891b2',
    description: '計算・図形・公式',
  },
  {
    name: '歴史',
    icon: '📜',
    color: '#b45309',
    description: '日本史・世界史',
  },
  {
    name: '一般常識',
    icon: '🌍',
    color: '#059669',
    description: '科学・地理・文化',
  },
];

export const questions: Question[] = [
  // ── 英語 ──────────────────────────────────────────────
  {
    id: 1,
    category: '英語',
    question: '"Grateful" の意味として最も適切なものはどれですか？',
    options: ['怒っている', '感謝している', '悲しんでいる', '驚いている'],
    correctIndex: 1,
    explanation: '"Grateful" は「感謝している」という意味です。\n例：I am grateful for your help.（助けてくれてありがとう）',
  },
  {
    id: 2,
    category: '英語',
    question: '次の英文の空欄に入る正しい語句はどれですか？\n"She has been studying English ___ three years."',
    options: ['since', 'for', 'during', 'while'],
    correctIndex: 1,
    explanation: '期間を表す場合は "for" を使います。特定の起点から現在までを表す場合は "since" を使います。\n例：for three years（3年間）/ since 2021（2021年から）',
  },
  {
    id: 3,
    category: '英語',
    question: '"Ambiguous" の意味はどれですか？',
    options: ['明確な', '曖昧な', '積極的な', '退屈な'],
    correctIndex: 1,
    explanation: '"Ambiguous" は「曖昧な、二重の意味を持つ」という意味です。\n例：His answer was ambiguous.（彼の答えは曖昧だった）',
  },
  {
    id: 4,
    category: '英語',
    question: '受動態の文として正しいのはどれですか？',
    options: [
      'She writes a letter.',
      'She is writing a letter.',
      'A letter was written by her.',
      'She had written a letter.',
    ],
    correctIndex: 2,
    explanation: '受動態は「be動詞 + 過去分詞」の形です。\n"A letter was written by her." は「手紙は彼女によって書かれた」という受動態の文です。',
  },
  {
    id: 5,
    category: '英語',
    question: '"Persevere" の意味として最も近いものはどれですか？',
    options: ['あきらめる', '説得する', '忍耐強く続ける', '急ぐ'],
    correctIndex: 2,
    explanation: '"Persevere" は「忍耐強く続ける、頑張り通す」という意味です。\n例：You must persevere to succeed.（成功するには忍耐強く続けなければなりません）',
  },
  {
    id: 6,
    category: '英語',
    question: '比較級の使い方として正しい文はどれですか？',
    options: [
      'Tokyo is more big than Osaka.',
      'Tokyo is bigger than Osaka.',
      'Tokyo is most big than Osaka.',
      'Tokyo is biggest than Osaka.',
    ],
    correctIndex: 1,
    explanation: '1音節の形容詞の比較級は語尾に "-er" を付けます。\nbig → bigger（もっと大きい）\n"more" は2音節以上の形容詞に使います。',
  },

  // ── 数学 ──────────────────────────────────────────────
  {
    id: 7,
    category: '数学',
    question: '√144 の値はいくつですか？',
    options: ['10', '11', '12', '14'],
    correctIndex: 2,
    explanation: '√144 = 12\n12 × 12 = 144 なので、144の平方根は12です。',
  },
  {
    id: 8,
    category: '数学',
    question: '円の面積を求める公式はどれですか？（r = 半径）',
    options: ['2πr', 'πr²', '4πr²', '2πr²'],
    correctIndex: 1,
    explanation: '円の面積 = πr²（π × 半径²）\n半径が5cmの円の面積は π × 5² = 25π ≈ 78.5 cm² です。',
  },
  {
    id: 9,
    category: '数学',
    question: '2次方程式 x² - 5x + 6 = 0 の解はどれですか？',
    options: ['x = 1, x = 6', 'x = 2, x = 3', 'x = -2, x = -3', 'x = 1, x = -6'],
    correctIndex: 1,
    explanation: 'x² - 5x + 6 = 0 を因数分解すると (x-2)(x-3) = 0\nよって x = 2 または x = 3',
  },
  {
    id: 10,
    category: '数学',
    question: '三角形の内角の和は何度ですか？',
    options: ['90°', '180°', '270°', '360°'],
    correctIndex: 1,
    explanation: '三角形の3つの内角を足すと必ず 180° になります。\nこれはユークリッド幾何学の基本定理の一つです。',
  },
  {
    id: 11,
    category: '数学',
    question: '1から10までの整数の合計はいくつですか？',
    options: ['45', '50', '55', '60'],
    correctIndex: 2,
    explanation: '1+2+3+4+5+6+7+8+9+10 = 55\n公式：n(n+1)/2 = 10×11/2 = 55',
  },
  {
    id: 12,
    category: '数学',
    question: 'log₂(8) の値はいくつですか？',
    options: ['2', '3', '4', '8'],
    correctIndex: 1,
    explanation: 'log₂(8) = 3\n2³ = 8 なので、2を底とする8の対数は3です。',
  },

  // ── 歴史 ──────────────────────────────────────────────
  {
    id: 13,
    category: '歴史',
    question: '江戸幕府を開いた人物は誰ですか？',
    options: ['豊臣秀吉', '織田信長', '徳川家康', '徳川秀忠'],
    correctIndex: 2,
    explanation: '徳川家康は1603年に江戸に幕府を開きました。\n265年にわたる江戸時代の始まりで、日本は比較的平和な時代を迎えました。',
  },
  {
    id: 14,
    category: '歴史',
    question: '第一次世界大戦が始まった年はいつですか？',
    options: ['1904年', '1914年', '1918年', '1939年'],
    correctIndex: 1,
    explanation: '第一次世界大戦は1914年に始まりました。\nサラエヴォ事件（オーストリア皇太子暗殺）が引き金となり、ヨーロッパ各国が次々と参戦しました。',
  },
  {
    id: 15,
    category: '歴史',
    question: 'ルネサンス期に「モナ・リザ」を描いた芸術家は誰ですか？',
    options: ['ミケランジェロ', 'レオナルド・ダ・ヴィンチ', 'ラファエロ', 'ボッティチェッリ'],
    correctIndex: 1,
    explanation: '「モナ・リザ」はレオナルド・ダ・ヴィンチが1503〜1519年頃に描いたとされる作品です。\n現在はパリのルーブル美術館に所蔵されています。',
  },
  {
    id: 16,
    category: '歴史',
    question: '大化の改新が起きたのはいつですか？',
    options: ['593年', '645年', '710年', '794年'],
    correctIndex: 1,
    explanation: '大化の改新は645年、中大兄皇子（後の天智天皇）と中臣鎌足が蘇我氏を倒して行った政治改革です。\n日本初の年号「大化」もこのときに制定されました。',
  },
  {
    id: 17,
    category: '歴史',
    question: 'アメリカ独立宣言が発表されたのは何年ですか？',
    options: ['1765年', '1776年', '1783年', '1787年'],
    correctIndex: 1,
    explanation: 'アメリカ独立宣言は1776年7月4日に発表されました。\nこの日はアメリカの独立記念日として現在も祝日となっています。',
  },
  {
    id: 18,
    category: '歴史',
    question: '明治維新で廃止された制度はどれですか？',
    options: ['天皇制', '武士（士族）の特権', '仏教', '農業'],
    correctIndex: 1,
    explanation: '明治維新（1868年）では、封建制度が廃止され、武士（士族）の特権が廃止されました。\n廃刀令（1876年）により帯刀が禁止され、武士階級は消滅しました。',
  },

  // ── 一般常識 ──────────────────────────────────────────
  {
    id: 19,
    category: '一般常識',
    question: '太陽系で最も大きい惑星はどれですか？',
    options: ['土星', '木星', '天王星', '海王星'],
    correctIndex: 1,
    explanation: '木星は太陽系最大の惑星で、地球の約11倍の直径を持ちます。\n木星の大きな渦（大赤斑）は地球がすっぽり入るほどの大きさです。',
  },
  {
    id: 20,
    category: '一般常識',
    question: '光の速さに最も近いのはどれですか？',
    options: ['約30万km/秒', '約3万km/秒', '約300km/秒', '約3億km/秒'],
    correctIndex: 0,
    explanation: '光の速さは約299,792km/秒（≒ 約30万km/秒）です。\n1秒で地球を約7.5周できる速さです。',
  },
  {
    id: 21,
    category: '一般常識',
    question: '人体で最も長い骨はどれですか？',
    options: ['脊椎', '大腿骨（太もも）', '橈骨（前腕）', '腓骨（すね）'],
    correctIndex: 1,
    explanation: '大腿骨（太ももの骨）は人体で最も長く、成人で平均約45〜50cmあります。\n体重を支える重要な骨でもあります。',
  },
  {
    id: 22,
    category: '一般常識',
    question: '日本の国土面積はおよそどれくらいですか？',
    options: ['約18万km²', '約28万km²', '約38万km²', '約48万km²'],
    correctIndex: 2,
    explanation: '日本の国土面積は約37.8万km²です。\n世界では61位程度で、ドイツ（35.7万km²）より少し大きい規模です。',
  },
  {
    id: 23,
    category: '一般常識',
    question: 'DNA の「二重らせん構造」を発見したのは誰ですか？',
    options: ['アインシュタインとボーア', 'ワトソンとクリック', 'キュリーとパスツール', 'ダーウィンとメンデル'],
    correctIndex: 1,
    explanation: 'DNAの二重らせん構造は1953年、ジェームズ・ワトソンとフランシス・クリックによって発見されました。\nこの発見で2人は1962年にノーベル生理学・医学賞を受賞しました。',
  },
  {
    id: 24,
    category: '一般常識',
    question: '元素記号「Au」は何の元素ですか？',
    options: ['銀', '鉄', '金', 'アルミニウム'],
    correctIndex: 2,
    explanation: '「Au」は金（Gold）の元素記号です。\nラテン語の「Aurum（黄金）」に由来します。\n銀はAg、鉄はFe、アルミニウムはAlです。',
  },
];

export function getQuestionsByCategory(category: string): Question[] {
  return questions.filter((q) => q.category === category);
}
