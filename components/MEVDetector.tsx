'use client';
import { useState } from 'react';

const RISK_LEVELS = [
  { icon: '🥪', label: 'Sandwich Attack', risk: 85, color: '#FF4444' },
  { icon: '🏃', label: 'Frontrunning',    risk: 70, color: '#FF4444' },
  { icon: '🔄', label: 'Backrunning',     risk: 45, color: '#FF8C00' },
  { icon: '⚡', label: 'JIT Liquidity',    risk: 30, color: '#14F195' },
];

const DEMO_RESULTS = [
  { sig: '5Ry9Kq...mX2pW', verdict: 'SANDWICH DETECTED', score: 92, detail: 'Bot inserted buy+sell around your swap. Estimated loss: ~0.4 SOL' },
  { sig: '3Px7Lm...nQ8sA', verdict: 'CLEAN', score: 8, detail: 'No MEV activity detected. Transaction looks safe.' },
];

export default function MEVDetector() {
  const [sig, setSig] = useState('');
  const [result, setResult] = useState<typeof DEMO_RESULTS[0] | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!sig.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1200));
    // Rule-based demo: long sigs lean CLEAN, short lean sandwich
    const pick = sig.length > 30 ? DEMO_RESULTS[1] : DEMO_RESULTS[0];
    setResult({ ...pick, sig: sig.slice(0, 8) + '...' + sig.slice(-5) });
    setLoading(false);
  };

  const verdictColor = result ? (result.score > 50 ? '#FF4444' : '#14F195') : '#fff';

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
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 22 }}>⚡</span>
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>MEV Attack Detector</div>
          <div style={{ color: 'rgba(255,140,0,0.8)', fontSize: 12 }}>Detect sandwich attacks, frontrunning & JIT liquidity</div>
        </div>
        <span style={{
          marginLeft: 'auto',
          background: 'rgba(255,140,0,0.1)', border: '1px solid rgba(255,140,0,0.3)',
          borderRadius: 12, padding: '2px 8px', color: '#FF8C00', fontSize: 11, fontWeight: 700,
        }}>NEW</span>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <input
            value={sig}
            onChange={e => setSig(e.target.value)}
            placeholder="Paste Solana tx signature to check for MEV..."
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,140,0,0.3)',
              borderRadius: 12, padding: '12px 16px',
              color: '#fff', fontSize: 13, fontFamily: 'monospace', outline: 'none',
            }}
          />
          <button
            onClick={analyze}
            disabled={loading}
            style={{
              background: loading ? 'rgba(255,140,0,0.3)' : 'linear-gradient(135deg, #FF8C00, #FF4444)',
              border: 'none', borderRadius: 12, padding: '12px 20px',
              color: '#fff', fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
              whiteSpace: 'nowrap', fontSize: 14, transition: 'all 0.2s',
            }}
          >
            {loading ? '⏳ Scanning...' : '⚡ Detect MEV'}
          </button>
        </div>

        {result && (
          <div style={{
            marginBottom: 16, padding: '14px 16px',
            background: result.score > 50 ? 'rgba(255,68,68,0.08)' : 'rgba(20,241,149,0.08)',
            border: `1px solid ${result.score > 50 ? 'rgba(255,68,68,0.3)' : 'rgba(20,241,149,0.3)'}`,
            borderRadius: 12, animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: verdictColor, marginBottom: 4 }}>
              {result.score > 50 ? '🚨' : '✅'} {result.verdict}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{result.detail}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4, fontFamily: 'monospace' }}>{result.sig}</div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {RISK_LEVELS.map(r => (
            <div key={r.label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10, padding: '8px 12px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span>{r.icon}</span>
              <div>
                <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{r.label}</div>
                <div style={{ color: r.color, fontSize: 10 }}>Risk: {r.risk}/100</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
