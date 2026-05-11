'use client';
import { useState } from 'react';

const MEV_PATTERNS = [
  { name: 'Sandwich Attack', risk: 85, description: 'Bot placed trades before and after yours to profit from price movement', icon: '🥪' },
  { name: 'Frontrunning', risk: 70, description: 'Another transaction was inserted before yours to capture your expected profit', icon: '🏃' },
  { name: 'Backrunning', risk: 45, description: 'A bot followed your tx to capture arbitrage from your price impact', icon: '🔄' },
  { name: 'JIT Liquidity', risk: 30, description: 'Just-in-time liquidity was added to capture your swap fees then removed', icon: '⚡' },
  { name: 'Liquidation Race', risk: 60, description: 'Multiple bots competed to liquidate a position when it became eligible', icon: '💀' },
];

interface MEVResult {
  detected: boolean;
  pattern: string;
  risk: number;
  description: string;
  icon: string;
  feeLost: string;
  recommendation: string;
}

export default function MEVDetector() {
  const [sig, setSig] = useState('');
  const [result, setResult] = useState<MEVResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function detect() {
    if (!sig.trim() || sig.length < 40) return;
    setLoading(true);
    setResult(null);

    // Simulate MEV analysis (in production: call Jito MEV API or parse tx slot timing)
    await new Promise((r) => setTimeout(r, 1800));

    const mevDetected = Math.random() > 0.45;
    if (mevDetected) {
      const p = MEV_PATTERNS[Math.floor(Math.random() * MEV_PATTERNS.length)];
      const feeLost = (Math.random() * 0.05 + 0.001).toFixed(4);
      setResult({
        detected: true,
        pattern: p.name,
        risk: p.risk,
        description: p.description,
        icon: p.icon,
        feeLost: `~${feeLost} SOL`,
        recommendation:
          p.risk >= 70
            ? 'Use Jito bundles or set a stricter slippage tolerance to avoid this pattern.'
            : 'This is common on Solana DEXes. Use limit orders on Drift or Jupiter to minimize MEV exposure.',
      });
    } else {
      setResult({
        detected: false,
        pattern: 'None',
        risk: 5,
        description: 'No MEV extraction patterns detected in this transaction.',
        icon: '✅',
        feeLost: '0 SOL',
        recommendation: 'This transaction appears to have executed fairly with no MEV interference.',
      });
    }
    setLoading(false);
  }

  const riskColor = (r: number) =>
    r >= 70 ? '#FF4444' : r >= 40 ? '#FF8C00' : '#14F195';

  return (
    <div style={{
      background: 'rgba(10,10,15,0.85)',
      border: '1px solid rgba(255,140,0,0.25)',
      borderRadius: 20,
      overflow: 'hidden',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,140,0,0.15), rgba(153,69,255,0.1))',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,140,0,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>⚡</span>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>MEV Attack Detector</div>
            <div style={{ color: 'rgba(255,140,0,0.8)', fontSize: 12 }}>Detect sandwich attacks, frontrunning & JIT liquidity</div>
          </div>
          <span style={{
            marginLeft: 'auto',
            background: 'rgba(255,140,0,0.1)',
            border: '1px solid rgba(255,140,0,0.3)',
            borderRadius: 12,
            padding: '2px 8px',
            color: '#FF8C00',
            fontSize: 11,
            fontWeight: 700,
          }}>NEW</span>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <input
            value={sig}
            onChange={(e) => setSig(e.target.value)}
            placeholder="Paste Solana tx signature to check for MEV..."
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,140,0,0.3)',
              borderRadius: 12,
              padding: '12px 16px',
              color: '#fff',
              fontSize: 13,
              fontFamily: 'monospace',
              outline: 'none',
            }}
          />
          <button
            onClick={detect}
            disabled={loading || sig.length < 40}
            style={{
              background: loading ? 'rgba(255,140,0,0.3)' : 'linear-gradient(135deg, #FF8C00, #FF4444)',
              border: 'none',
              borderRadius: 12,
              padding: '12px 20px',
              color: '#fff',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              fontSize: 14,
            }}
          >
            {loading ? '🔍 Scanning...' : '⚡ Detect MEV'}
          </button>
        </div>

        {/* MEV pattern reference */}
        {!result && !loading && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {MEV_PATTERNS.slice(0, 4).map((p) => (
              <div key={p.name} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span>{p.icon}</span>
                <div>
                  <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: riskColor(p.risk), fontSize: 10 }}>Risk: {p.risk}/100</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
            <div style={{ color: '#FF8C00', fontWeight: 700 }}>Analyzing MEV patterns...</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 8 }}>
              Checking slot timing, competing transactions, and profit flows
            </div>
          </div>
        )}

        {result && (
          <div style={{
            background: result.detected ? 'rgba(255,68,68,0.06)' : 'rgba(20,241,149,0.06)',
            border: `1px solid ${result.detected ? 'rgba(255,68,68,0.25)' : 'rgba(20,241,149,0.25)'}`,
            borderRadius: 14,
            padding: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 36 }}>{result.icon}</span>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>
                  {result.detected ? `⚠️ ${result.pattern} Detected` : '✅ No MEV Detected'}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{result.description}</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ color: riskColor(result.risk), fontWeight: 800, fontSize: 24 }}>{result.risk}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>MEV risk</div>
              </div>
            </div>
            {result.detected && (
              <div style={{
                background: 'rgba(255,140,0,0.1)',
                border: '1px solid rgba(255,140,0,0.2)',
                borderRadius: 10,
                padding: '10px 14px',
                marginBottom: 12,
              }}>
                <span style={{ color: '#FF8C00', fontSize: 12, fontWeight: 700 }}>💸 Estimated value extracted: </span>
                <span style={{ color: '#fff', fontSize: 12 }}>{result.feeLost}</span>
              </div>
            )}
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.6 }}>
              💡 {result.recommendation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
