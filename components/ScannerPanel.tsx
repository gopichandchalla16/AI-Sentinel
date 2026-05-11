'use client';
import { useState } from 'react';
import ResultPanel from './ResultPanel';
import TransactionChat from './TransactionChat';

// ── Real mainnet transactions (recent, verified, always found on mainnet) ──
// These are well-known Solana program interactions that Helius can always find.
const DEMO_TXS = [
  // Orca DEX swap — always available on mainnet
  '3vZ35RJCBbmwFPzRdMngGBu5zJiMCKBuSHNg2gUHFN3bX7FiPbEbCeBbmRCnKbwAGGFk3k6PoKKkC9JhwWiABwU',
  // System transfer — always available
  '4fzgfWZQFBGJiHjXQw5bLy2S2jLRWdwfXhQKFN8TkUBE7HsNuKf1oiEpL4GGovJvU2FQ8kHEjWUjpaxNrfDV9v',
];

const LOADING_STAGES = [
  '🔗 Connecting to Helius Mainnet RPC...',
  '📡 Fetching transaction data...',
  '🧠 Gemini AI analyzing threat patterns...',
  '🛡️ Cross-referencing known drainer programs...',
  '✅ Generating security report...',
];

export default function ScannerPanel() {
  const [sig, setSig] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState('');
  const [scanCount, setScanCount] = useState(0);

  async function analyze(signature?: string) {
    const s = (signature || sig).trim();
    if (!s || s.length < 40) {
      setError('Please enter a valid Solana transaction signature (minimum 40 characters).');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);
    setStage(0);

    // Stage progression
    const stageInterval = setInterval(() => {
      setStage((prev) => (prev < LOADING_STAGES.length - 1 ? prev + 1 : prev));
    }, 600);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: s }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
        setScanCount((c) => c + 1);
        setSig(s);
      }
    } catch {
      setError('Network error — check your connection and retry.');
    } finally {
      clearInterval(stageInterval);
      setLoading(false);
    }
  }

  const riskColor = (score: number) =>
    score >= 75 ? '#FF4444' : score >= 50 ? '#FF8C00' : score >= 25 ? '#FFD700' : '#14F195';

  const verdictEmoji = (v: string) =>
    ({ SAFE: '✅', CAUTION: '⚠️', HIGH_RISK: '🔴', CRITICAL: '🚨' }[v] || '🔍');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Scan counter */}
      {scanCount > 0 && (
        <div style={{
          textAlign: 'center',
          color: '#14F195',
          fontSize: 13,
          background: 'rgba(20,241,149,0.08)',
          border: '1px solid rgba(20,241,149,0.2)',
          borderRadius: 8,
          padding: '6px 16px',
        }}>
          ✅ {scanCount} scan{scanCount !== 1 ? 's' : ''} completed this session
        </div>
      )}

      {/* Input card */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(153,69,255,0.3)',
        borderRadius: 20,
        padding: 28,
      }}>
        <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 6, margin: 0 }}>
          🔍 Scan Any Solana Transaction
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '8px 0 20px' }}>
          Paste a transaction signature — AI detects drainers, phishing, and malicious programs instantly.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            value={sig}
            onChange={(e) => setSig(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && analyze()}
            placeholder="Paste Solana tx signature (e.g. 5Ry9Kq...)"
            style={{
              flex: 1,
              minWidth: 280,
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(153,69,255,0.4)',
              borderRadius: 12,
              padding: '14px 18px',
              color: '#fff',
              fontSize: 14,
              fontFamily: 'monospace',
              outline: 'none',
            }}
          />
          <button
            onClick={() => analyze()}
            disabled={loading}
            style={{
              background: loading ? 'rgba(153,69,255,0.4)' : 'linear-gradient(135deg, #9945FF, #14F195)',
              border: 'none',
              borderRadius: 12,
              padding: '14px 28px',
              color: '#fff',
              fontWeight: 800,
              fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s',
            }}
          >
            {loading ? '⏳ Analyzing...' : '🛡️ Analyze'}
          </button>
        </div>

        {/* Demo buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Try demos:</span>
          {DEMO_TXS.map((tx, i) => (
            <button
              key={i}
              onClick={() => { setSig(tx); analyze(tx); }}
              style={{
                background: 'rgba(153,69,255,0.12)',
                border: '1px solid rgba(153,69,255,0.35)',
                borderRadius: 8,
                padding: '6px 14px',
                color: '#c084fc',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              Demo #{i + 1} →
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            marginTop: 12,
            padding: '10px 14px',
            background: 'rgba(255,68,68,0.1)',
            border: '1px solid rgba(255,68,68,0.3)',
            borderRadius: 8,
            color: '#ff6b6b',
            fontSize: 14,
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{
          background: 'rgba(153,69,255,0.08)',
          border: '1px solid rgba(153,69,255,0.25)',
          borderRadius: 16,
          padding: 24,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div style={{ color: '#c084fc', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
            Analyzing Transaction...
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LOADING_STAGES.map((s, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 8,
                background: i === stage ? 'rgba(153,69,255,0.15)' : 'transparent',
                transition: 'background 0.3s',
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: i < stage ? '#14F195' : i === stage ? '#9945FF' : 'rgba(255,255,255,0.2)',
                  transition: 'background 0.3s',
                  flexShrink: 0,
                }} />
                <span style={{
                  color: i === stage ? '#c084fc' : i < stage ? '#14F195' : 'rgba(255,255,255,0.3)',
                  fontSize: 14,
                  transition: 'color 0.3s',
                }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Risk Summary Banner */}
          <div style={{
            background: `linear-gradient(135deg, rgba(${(result.riskScore as number) >= 75 ? '255,68,68' : (result.riskScore as number) >= 50 ? '255,140,0' : (result.riskScore as number) >= 25 ? '255,215,0' : '20,241,149'},0.15), rgba(153,69,255,0.1))`,
            border: `1px solid ${riskColor(result.riskScore as number)}40`,
            borderRadius: 20,
            padding: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: `conic-gradient(${riskColor(result.riskScore as number)} ${(result.riskScore as number) * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: '#0d0d1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}>
                    <span style={{ color: riskColor(result.riskScore as number), fontWeight: 800, fontSize: 18 }}>
                      {result.riskScore as number}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>/100</span>
                  </div>
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: 26, fontWeight: 900 }}>
                    {verdictEmoji(result.verdict as string)} {result.verdict as string}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>
                    Risk Score — lower is safer
                  </div>
                  {result.dataSource && (
                    <div style={{
                      marginTop: 6,
                      fontSize: 11,
                      color: (result.dataSource as string).includes('LIVE') ? '#14F195' : 'rgba(255,200,0,0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                      <span>{(result.dataSource as string).includes('LIVE') ? '📡' : '⚠️'}</span>
                      <span>{result.dataSource as string}</span>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => navigator.clipboard.writeText(`AI-Sentinel scan: ${result.verdict} (${result.riskScore}/100) — ${result.summary}`)}
                  style={{
                    background: 'rgba(153,69,255,0.2)',
                    border: '1px solid rgba(153,69,255,0.4)',
                    borderRadius: 8,
                    padding: '8px 14px',
                    color: '#c084fc',
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  📤 Share
                </button>
                <a
                  href={`https://solscan.io/tx/${sig}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'rgba(20,241,149,0.1)',
                    border: '1px solid rgba(20,241,149,0.3)',
                    borderRadius: 8,
                    padding: '8px 14px',
                    color: '#14F195',
                    textDecoration: 'none',
                    fontSize: 13,
                  }}
                >
                  🔍 Solscan ↗
                </a>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {result.summary && (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(153,69,255,0.2)',
              borderRadius: 16,
              padding: 20,
            }}>
              <div style={{ color: '#9945FF', fontWeight: 700, fontSize: 13, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                🧠 AI ANALYSIS
              </div>
              <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
                {result.summary as string}
              </p>
            </div>
          )}

          {/* Red flags */}
          {(result.redFlags as string[])?.length > 0 && (
            <div style={{
              background: 'rgba(255,68,68,0.06)',
              border: '1px solid rgba(255,68,68,0.25)',
              borderRadius: 16,
              padding: 20,
            }}>
              <div style={{ color: '#FF6B6B', fontWeight: 700, fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                🚨 RED FLAGS DETECTED
              </div>
              {(result.redFlags as string[]).map((f, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                  color: '#ffaaaa',
                  fontSize: 14,
                }}>
                  <span style={{ color: '#FF6B6B', flexShrink: 0 }}>⚠️</span>
                  {f}
                </div>
              ))}
            </div>
          )}

          {/* Threat categories */}
          {result.threatCategories && (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: 20,
            }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                🔬 THREAT CATEGORIES SCAN
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.entries(result.threatCategories as Record<string, boolean>).map(([key, val]) => (
                  <div key={key} style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background: val ? 'rgba(255,68,68,0.15)' : 'rgba(20,241,149,0.08)',
                    border: `1px solid ${val ? 'rgba(255,68,68,0.4)' : 'rgba(20,241,149,0.2)'}`,
                    color: val ? '#FF6B6B' : '#14F195',
                  }}>
                    {val ? '🔴' : '✅'} {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assets + Estimated Loss */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              padding: 16,
            }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>AFFECTED ASSETS</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(result.affectedAssets as string[] || []).map((a) => (
                  <span key={a} style={{
                    background: 'rgba(153,69,255,0.2)',
                    border: '1px solid rgba(153,69,255,0.4)',
                    borderRadius: 12,
                    padding: '3px 10px',
                    color: '#c084fc',
                    fontSize: 13,
                    fontWeight: 600,
                  }}>{a}</span>
                ))}
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              padding: 16,
            }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>ESTIMATED EXPOSURE</div>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
                {result.estimatedLoss as string || 'No significant risk'}
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div style={{
            background: `linear-gradient(135deg, rgba(${(result.riskScore as number) < 25 ? '20,241,149' : '255,68,68'},0.1), rgba(153,69,255,0.08))`,
            border: `1px solid rgba(${(result.riskScore as number) < 25 ? '20,241,149' : '255,68,68'},0.25)`,
            borderRadius: 16,
            padding: 20,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>💡 VERDICT</div>
            <div style={{
              fontSize: 20,
              fontWeight: 800,
              color: (result.riskScore as number) < 25 ? '#14F195' : '#FF6B6B',
            }}>
              {result.recommendation === 'SAFE_TO_PROCEED' && '✅ Safe to Proceed'}
              {result.recommendation === 'PROCEED_WITH_CAUTION' && '⚠️ Proceed With Caution'}
              {result.recommendation === 'DO_NOT_SIGN' && '🚨 DO NOT SIGN — High Risk'}
            </div>
          </div>
        </div>
      )}

      {/* AI Chat — always shown after scan */}
      {result && !loading && (
        <TransactionChat result={result} signature={sig} />
      )}
    </div>
  );
}
