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

app.post('/api/predict', async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: '画像が提供されていません' });
    }

    let mediaType = 'image/jpeg';
    if (imageBase64.startsWith('/9j/')) {
      mediaType = 'image/jpeg';
    } else if (imageBase64.startsWith('iVBORw0KGgo')) {
      mediaType = 'image/png';
    } else if (imageBase64.startsWith('R0lGODlh')) {
      mediaType = 'image/gif';
    } else if (imageBase64.startsWith('Qk0=')) {
      mediaType = 'image/bmp';
    }

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `この競馬の画像を分析して、以下のJSON形式で予想を返してください：
{
  "horses": [
    {"number": 1, "name": "馬の名前", "prediction": "予想", "confidence": 85},
    ...
  ],
  "bettingAdvice": "推奨される賭け方"
}
最大3頭の馬の予想を含めてください。confidenceは0-100の数値です。`,
            },
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
    console.error('Error:', error);
    res.status(500).json({ error: error.message || '予測中にエラーが発生しました' });
  }
});

app.listen(port, () => {
  console.log(`🤖 API Server running at http://localhost:${port}`);
});
