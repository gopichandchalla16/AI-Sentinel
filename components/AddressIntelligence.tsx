'use client';
import { useState } from 'react';

const KNOWN_PROGRAMS: Record<string, { label: string; trust: string; color: string; desc: string }> = {
  '11111111111111111111111111111111': { label: 'System Program', trust: 'VERIFIED', color: '#14F195', desc: 'Native Solana system program. Fully trusted.' },
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf8Ny8suSB8NK': { label: 'SPL Token Program', trust: 'VERIFIED', color: '#14F195', desc: 'Official SPL token program. Safe to interact with.' },
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe8bYh': { label: 'Associated Token Program', trust: 'VERIFIED', color: '#14F195', desc: 'Creates associated token accounts. Safe.' },
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': { label: 'Jupiter v6 Aggregator', trust: 'TRUSTED', color: '#9945FF', desc: 'Leading DEX aggregator. Audited and widely used.' },
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8': { label: 'Raydium AMM', trust: 'TRUSTED', color: '#9945FF', desc: 'Major Solana DEX. Multiple audits completed.' },
};

const QUICK_LOOKUPS = [
  { label: 'System Program', addr: '11111111111111111111111111111111' },
  { label: 'SPL Token', addr: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf8Ny8suSB8NK' },
  { label: 'Jupiter v6', addr: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4' },
  { label: 'Raydium AMM', addr: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8' },
];

export default function AddressIntelligence() {
  const [addr, setAddr] = useState('');
  const [result, setResult] = useState<typeof KNOWN_PROGRAMS[string] & { address: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const lookup = async (address: string) => {
    const a = address.trim();
    if (!a) return;
    setAddr(a);
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 800));
    const known = KNOWN_PROGRAMS[a];
    if (known) {
      setResult({ ...known, address: a });
    } else {
      setResult({
        address: a,
        label: 'Unknown Program',
        trust: 'UNVERIFIED',
        color: '#FF4444',
        desc: 'This program is not in our verified registry. Exercise extreme caution before signing any transaction involving this address.',
      });
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: 'rgba(10,10,15,0.85)',
      border: '1px solid rgba(20,241,149,0.2)',
      borderRadius: 20,
      overflow: 'hidden',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(20,241,149,0.12), rgba(153,69,255,0.1))',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(20,241,149,0.12)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 22 }}>🔎</span>
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Address Intelligence</div>
          <div style={{ color: 'rgba(20,241,149,0.7)', fontSize: 12 }}>Program trust registry + wallet reputation</div>
        </div>
        <span style={{
          marginLeft: 'auto',
          background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.3)',
          borderRadius: 12, padding: '2px 8px', color: '#14F195', fontSize: 11, fontWeight: 700,
        }}>FIRST-ON-SOLANA</span>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <input
            value={addr}
            onChange={e => setAddr(e.target.value)}
            placeholder="Paste any program ID or wallet address..."
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(20,241,149,0.25)',
              borderRadius: 12, padding: '12px 16px',
              color: '#fff', fontSize: 13, fontFamily: 'monospace', outline: 'none',
            }}
          />
          <button
            onClick={() => lookup(addr)}
            disabled={loading}
            style={{
              background: loading ? 'rgba(20,241,149,0.2)' : 'linear-gradient(135deg, #14F195, #9945FF)',
              border: 'none', borderRadius: 12, padding: '12px 20px',
              color: '#000', fontWeight: 800, cursor: loading ? 'wait' : 'pointer',
              fontSize: 14, whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}
          >
            {loading ? '⏳' : '🔎 Lookup'}
          </button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>Quick lookup:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {QUICK_LOOKUPS.map(q => (
              <button
                key={q.label}
                onClick={() => lookup(q.addr)}
                style={{
                  background: 'rgba(20,241,149,0.1)', border: '1px solid #14F19540',
                  borderRadius: 8, padding: '4px 10px',
                  color: '#14F195', fontSize: 11, cursor: 'pointer', fontWeight: 600,
                }}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div style={{
            padding: '14px 16px',
            background: result.trust === 'UNVERIFIED' ? 'rgba(255,68,68,0.08)' : 'rgba(20,241,149,0.07)',
            border: `1px solid ${result.color}40`,
            borderRadius: 12, animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                background: `${result.color}20`, border: `1px solid ${result.color}50`,
                borderRadius: 8, padding: '2px 8px',
                color: result.color, fontSize: 11, fontWeight: 800,
              }}>{result.trust}</span>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{result.label}</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{result.desc}</p>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 6, fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {result.address}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
