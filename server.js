import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const client = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
});

// base64文字列から画像形式を判定
function detectMediaType(base64) {
  if (base64.startsWith('/9j/')) return 'image/jpeg';
  if (base64.startsWith('iVBORw0KGgo')) return 'image/png';
  if (base64.startsWith('R0lGODlh')) return 'image/gif';
  if (base64.startsWith('Qk0=')) return 'image/bmp';
  return 'image/jpeg';
}

app.post('/api/predict', async (req, res) => {
  try {
    // 複数画像（imagesBase64）と単一画像（imageBase64）の両方に対応
    let images = req.body.imagesBase64;
    if (!images && req.body.imageBase64) {
      images = [req.body.imageBase64];
    }

    if (!images || images.length === 0) {
      return res.status(400).json({ error: '画像が提供されていません' });
    }

    console.log('API キー:', process.env.VITE_ANTHROPIC_API_KEY ? '✅ 設定済み' : '❌ 未設定');
    console.log('画像枚数:', images.length);

    // 画像コンテンツを構築
    const imageContents = images.map((base64) => ({
      type: 'image',
      source: {
        type: 'base64',
        media_type: detectMediaType(base64),
        data: base64,
      },
    }));

    const promptText = `あなたはプロの競馬予想家です。複数枚の画像（出馬表・血統表・オッズ・過去走など）が提供されることがあります。すべての画像を統合して分析してください。

【最重要：血統・期待値・妙味を、徹底的に深く考えること】

■ 血統（できる限り深く）
- 父系統（サンデー系/ミスプロ系/ロベルト系/ノーザンダンサー系 等）の特徴と、本レースの距離・芝ダート・馬場状態への適性
- 母父（ブルードメアサイアー）の影響、父×母父のニックス配合の相性
- 距離短縮/延長への対応力、成長曲線（早熟/晩成）、坂・コース形態適性
- 一頭ずつ「なぜ合う/合わないのか」を具体的な系統名を挙げて説明する

■ 期待値（数値で考える）
- 各馬の「推定勝率（％）」を自分で見積もる
- それを「オッズが示す市場の想定勝率（＝1÷単勝オッズに近い値）」と比較する
- 推定勝率 ＞ 市場想定 なら期待値プラス（買い）、逆なら期待値マイナス（消し）
- 単に強い馬ではなく「実力に対してオッズが甘い馬」を評価する

■ 妙味（盲点を突く）
- 人気が被っているが取りこぼしリスクのある馬は割り引く
- 人気薄でも血統・展開・条件好転で一発がある馬を積極的に拾う
- 「みんなが見落としている要素」を一つでも見つけ、reasoningに明記する

【思考の手順（必ずこの順で）】
1. 各馬の血統適性を一頭ずつ吟味（系統名を挙げる）
2. 各馬の推定勝率を見積もり、オッズの市場想定と比較して期待値を判定
3. 展開・枠・斤量・調子・馬場を加味して微調整
4. 妙味（過小評価）の有無を最終チェック
5. 期待値（妙味）の高い順に印を打つ

【AI独自指数について】
各馬に「KEIBA AI指数」を算出すること。これは血統適性・能力・展開利・期待値を総合した独自スコアで、0〜120の数値（120が最強）。基準は「100=勝ち負けの実力」「110以上=軸候補」「90未満=割引」。必ず根拠を持って差をつけること。

必ず以下のJSON形式のみで返答してください（JSON以外の文章は書かない）：
{
  "reasoning": "全体のレース観・展開予想・結論に至った思考過程を3〜5文で",
  "horses": [
    {
      "number": 馬番(数値),
      "name": "馬名",
      "aiIndex": KEIBA AI指数(0-120の数値),
      "winRate": 推定勝率(0-100の数値・パーセント),
      "confidence": 信頼度(0-100の数値),
      "bloodline": "血統評価（父母父の系統と距離・馬場適性を具体的に）",
      "expectedValue": "期待値評価（推定勝率とオッズの比較、妙味の有無）",
      "prediction": "総合的な予想コメント"
    }
  ],
  "notSelected": [
    {
      "number": 馬番(数値),
      "name": "馬名",
      "reason": "なぜ本命・相手に選ばなかったのか（血統面・能力面・期待値面のどこが足りないかを具体的に）"
    }
  ],
  "bettingTickets": [
    {
      "type": "券種（単勝/複勝/馬連/馬単/ワイド/3連複/3連単 など）",
      "combo": "具体的な買い目（例: 11-8、11→8→5、11-8-5 など）",
      "stake": "配分（例: 本線/抑え/勝負 など）",
      "reason": "この買い目を選ぶ理由（期待値・リスクの観点で）"
    }
  ],
  "bettingAdvice": "馬券戦略の総括（軸馬・狙い・資金配分の考え方を一言で）"
}

horsesは指数の高い順に最大5頭まで。notSelectedには、人気上位や注目されそうなのに今回は見送る馬を3〜5頭、理由付きで挙げること。bettingTicketsは2〜4点、期待値重視で具体的に。`;

    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 5000,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContents,
            { type: 'text', text: promptText },
          ],
        },
      ],
    });

    const content = message.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const prediction = JSON.parse(jsonMatch[0]);
      res.json(prediction);
    } else {
      res.status(400).json({ error: '予想の解析に失敗しました' });
    }
  } catch (error) {
    console.error('❌ エラー詳細:', error);
    res.status(500).json({ error: error.message || '予測中にエラーが発生しました' });
  }
});

app.listen(port, () => {
  console.log(`🤖 API Server running at http://localhost:${port}`);
});
