import { useState, useRef } from 'react';

interface Horse {
  number: number;
  name: string;
  prediction: string;
  confidence: number;
  aiIndex?: number;
  winRate?: number;
  bloodline?: string;
  expectedValue?: string;
}

interface BettingTicket {
  type: string;
  combo: string;
  stake?: string;
  reason?: string;
}

interface NotSelectedHorse {
  number: number;
  name: string;
  reason: string;
}

interface Prediction {
  reasoning?: string;
  horses: Horse[];
  notSelected?: NotSelectedHorse[];
  bettingTickets?: BettingTicket[];
  bettingAdvice: string;
}

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 画像を読み込み、長辺が maxSize を超えないよう縮小してJPEGのdataURLにする
  const resizeImage = (file: File, maxSize = 1500): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxSize || height > maxSize) {
            if (width >= height) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            } else {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('画像の処理に失敗しました'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const images = await Promise.all(
        Array.from(files).map((file) => resizeImage(file))
      );
      // 既存に追加していく（複数回選んでも貯まる）
      setSelectedImages((prev) => [...prev, ...images]);
      setPrediction(null);
      setError(null);
    } catch {
      setError('画像の処理中にエラーが発生しました');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (selectedImages.length === 0) {
      setError('画像を選択してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const imagesBase64 = selectedImages.map((img) => img.split(',')[1]);

      const response = await fetch('http://localhost:3001/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imagesBase64,
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
              競馬の画像を選択（複数枚OK：出馬表・血統・オッズ・過去走など）
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
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
              📁 ファイルを選択（追加できます）
            </button>
          </div>

          {selectedImages.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '12px', color: '#b0b0b0', fontSize: '0.9em' }}>
                選択中: {selectedImages.length}枚
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '15px',
              }}>
                {selectedImages.map((img, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={img}
                      alt={`選択画像 ${index + 1}`}
                      style={{
                        width: '140px',
                        height: '140px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid rgba(245, 87, 108, 0.3)',
                      }}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#f5576c',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        lineHeight: '1',
                      }}
                      title="削除"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
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
                {loading ? '🧠 じっくり分析中...' : '🤖 AI予想を生成'}
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

            {prediction.reasoning && (
              <div style={{
                background: 'rgba(102, 126, 234, 0.12)',
                borderRadius: '8px',
                padding: '15px',
                borderLeft: '4px solid #764ba2',
                marginBottom: '25px',
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#a5b4fc' }}>🧠 AIの分析・思考</h3>
                <p style={{ margin: 0, lineHeight: '1.7', color: '#d0d0d0' }}>
                  {prediction.reasoning}
                </p>
              </div>
            )}

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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.1em', fontWeight: '600' }}>
                      #{horse.number} - {horse.name}
                    </span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {typeof horse.aiIndex === 'number' && (
                        <span style={{
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          padding: '6px 16px',
                          borderRadius: '20px',
                          fontSize: '1em',
                          fontWeight: '700',
                        }}>
                          AI指数 {horse.aiIndex}
                        </span>
                      )}
                      {typeof horse.winRate === 'number' && (
                        <span style={{
                          background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
                          padding: '5px 15px',
                          borderRadius: '20px',
                          fontSize: '0.9em',
                          fontWeight: '600',
                        }}>
                          勝率 {horse.winRate}%
                        </span>
                      )}
                      <span style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '5px 15px',
                        borderRadius: '20px',
                        fontSize: '0.9em',
                        fontWeight: '600',
                      }}>
                        信頼度 {horse.confidence}%
                      </span>
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
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

                  {horse.bloodline && (
                    <p style={{ margin: '0 0 8px 0', color: '#c0c0c0', fontSize: '0.95em' }}>
                      <span style={{ color: '#7dd3fc', fontWeight: '600' }}>🧬 血統: </span>
                      {horse.bloodline}
                    </p>
                  )}
                  {horse.expectedValue && (
                    <p style={{ margin: '0 0 8px 0', color: '#c0c0c0', fontSize: '0.95em' }}>
                      <span style={{ color: '#fcd34d', fontWeight: '600' }}>💰 期待値: </span>
                      {horse.expectedValue}
                    </p>
                  )}
                  <p style={{ margin: 0, color: '#c0c0c0' }}>
                    <span style={{ color: '#f093fb', fontWeight: '600' }}>📝 総合: </span>
                    {horse.prediction}
                  </p>
                </div>
              ))}
            </div>

            {prediction.notSelected && prediction.notSelected.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#94a3b8' }}>🚫 選ばなかった馬と理由</h3>
                {prediction.notSelected.map((horse, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(148, 163, 184, 0.08)',
                      borderRadius: '8px',
                      padding: '12px 15px',
                      borderLeft: '4px solid #64748b',
                      marginBottom: '10px',
                    }}
                  >
                    <span style={{ fontWeight: '600', color: '#cbd5e1' }}>
                      #{horse.number} - {horse.name}
                    </span>
                    <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '0.9em', lineHeight: '1.6' }}>
                      {horse.reason}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {prediction.bettingTickets && prediction.bettingTickets.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#fcd34d' }}>🎫 買い目</h3>
                {prediction.bettingTickets.map((ticket, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(252, 211, 77, 0.08)',
                      borderRadius: '8px',
                      padding: '12px 15px',
                      borderLeft: '4px solid #fcd34d',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: ticket.reason ? '6px' : 0 }}>
                      <span style={{
                        background: '#fcd34d',
                        color: '#1a1a2e',
                        padding: '3px 12px',
                        borderRadius: '6px',
                        fontWeight: '700',
                        fontSize: '0.9em',
                      }}>
                        {ticket.type}
                      </span>
                      <span style={{ fontSize: '1.15em', fontWeight: '700', color: '#fff', letterSpacing: '1px' }}>
                        {ticket.combo}
                      </span>
                      {ticket.stake && (
                        <span style={{ color: '#fcd34d', fontSize: '0.9em', fontWeight: '600' }}>
                          [{ticket.stake}]
                        </span>
                      )}
                    </div>
                    {ticket.reason && (
                      <p style={{ margin: 0, color: '#c0c0c0', fontSize: '0.9em' }}>{ticket.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{
              background: 'rgba(240, 147, 251, 0.1)',
              borderRadius: '8px',
              padding: '15px',
              borderLeft: '4px solid #f093fb',
              marginBottom: '20px',
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#f093fb' }}>💡 馬券戦略</h3>
              <p style={{ margin: 0, lineHeight: '1.6' }}>
                {prediction.bettingAdvice}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedImages([]);
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
