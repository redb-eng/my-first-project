import { useState, useRef } from 'react';

interface Horse {
  number: number;
  name: string;
  prediction: string;
  confidence: number;
}

interface Prediction {
  horses: Horse[];
  bettingAdvice: string;
  analysisTime: number;
}

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setPrediction(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('画像を選択してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base64Image = selectedImage.split(',')[1];

      const response = await fetch('http://localhost:3001/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API エラーが発生しました');
      }

      const prediction = await response.json();
      setPrediction(prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#e0e0e0',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '3em',
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>🏇 KEIBA AI</h1>
        <p style={{ textAlign: 'center', fontSize: '1.2em', color: '#b0b0b0', marginBottom: '40px' }}>
          競馬予想AIアプリ
        </p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontWeight: '600',
              color: '#fff',
            }}>
              競馬の画像を選択
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{
                display: 'none',
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1em',
                fontWeight: '600',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              📁 ファイルを選択
            </button>
          </div>

          {selectedImage && (
            <div style={{ marginBottom: '20px' }}>
              <img
                src={selectedImage}
                alt="Selected"
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  border: '2px solid rgba(245, 87, 108, 0.3)',
                }}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: loading ? '#555' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1em',
                  fontWeight: '600',
                  opacity: loading ? 0.7 : 1,
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {loading ? '分析中...' : '🤖 AI予想を生成'}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div style={{
            background: 'rgba(245, 87, 108, 0.15)',
            border: '1px solid rgba(245, 87, 108, 0.5)',
            borderRadius: '8px',
            padding: '15px',
            color: '#ff6b9d',
            marginBottom: '20px',
          }}>
            ❌ {error}
          </div>
        )}

        {prediction && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h2 style={{ marginBottom: '20px', color: '#fff', fontSize: '1.5em' }}>
              🎯 予想結果
            </h2>

            <div style={{ marginBottom: '30px' }}>
              {prediction.horses?.map((horse) => (
                <div
                  key={horse.number}
                  style={{
                    marginBottom: '20px',
                    padding: '15px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: '8px',
                    borderLeft: '4px solid #667eea',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.1em', fontWeight: '600' }}>
                      #{horse.number} - {horse.name}
                    </span>
                    <span style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      padding: '5px 15px',
                      borderRadius: '20px',
                      fontSize: '0.9em',
                      fontWeight: '600',
                    }}>
                      信頼度: {horse.confidence}%
                    </span>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      height: '8px',
                      overflow: 'hidden',
                    }}>
                      <div
                        style={{
                          background: `linear-gradient(90deg, #667eea 0%, #764ba2 100%)`,
                          height: '100%',
                          width: `${horse.confidence}%`,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                  <p style={{ margin: 0, color: '#c0c0c0' }}>
                    {horse.prediction}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(240, 147, 251, 0.1)',
              borderRadius: '8px',
              padding: '15px',
              borderLeft: '4px solid #f093fb',
              marginBottom: '20px',
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#f093fb' }}>💡 馬券推奨</h3>
              <p style={{ margin: 0, lineHeight: '1.6' }}>
                {prediction.bettingAdvice}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedImage(null);
                setPrediction(null);
                setError(null);
              }}
              style={{
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#e0e0e0',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95em',
              }}
            >
              ↺ 別の画像を分析
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
