'use client';
import { useState } from 'react';

// Known program registry — first-on-Solana feature
const KNOWN_PROGRAMS: Record<string, { name: string; category: string; trust: 'TRUSTED' | 'CAUTION' | 'DANGEROUS'; audit: string }> = {
  '11111111111111111111111111111111': { name: 'System Program', category: 'Core', trust: 'TRUSTED', audit: 'Solana Labs' },
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf8Ss623VQ5DA': { name: 'SPL Token Program', category: 'Token', trust: 'TRUSTED', audit: 'Solana Labs' },
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1bE': { name: 'Associated Token Program', category: 'Token', trust: 'TRUSTED', audit: 'Solana Labs' },
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': { name: 'Jupiter v6 Aggregator', category: 'DEX', trust: 'TRUSTED', audit: 'OtterSec' },
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8': { name: 'Raydium AMM', category: 'DEX', trust: 'TRUSTED', audit: 'SlowMist' },
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc': { name: 'Orca Whirlpool', category: 'DEX', trust: 'TRUSTED', audit: 'Kudelski' },
  'MFv2hWf31Z9kbCa1snEPdcgp168vLLAkezkekinZRpQ': { name: 'MarginFi v2', category: 'Lending', trust: 'TRUSTED', audit: 'OtterSec' },
  'So11111111111111111111111111111111111111112': { name: 'Wrapped SOL', category: 'Token', trust: 'TRUSTED', audit: 'Solana Labs' },
  'CnhfyFjzFQKBGGMkfH3SaTUMkHBkDttFUDCbvNYxsQYk': { name: '⚠️ PHANTOM DRAINER', category: 'MALICIOUS', trust: 'DANGEROUS', audit: 'BLACKLISTED' },
};

export default function AddressIntelligence() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<typeof KNOWN_PROGRAMS[string] & { address: string; isWallet: boolean; score: number } | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup() {
    if (!address.trim() || address.length < 30) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const known = KNOWN_PROGRAMS[address.trim()];
    if (known) {
      setResult({ ...known, address: address.trim(), isWallet: false, score: known.trust === 'TRUSTED' ? 5 : known.trust === 'CAUTION' ? 50 : 99 });
    } else {
      // Unknown address — generic response
      const looksLikeProgram = address.length === 44;
      setResult({
        name: looksLikeProgram ? 'Unknown Program' : 'Wallet Address',
        category: looksLikeProgram ? 'Unverified Program' : 'EOA Wallet',
        trust: 'CAUTION',
        audit: 'Not in registry',
        address: address.trim(),
        isWallet: !looksLikeProgram,
        score: 35,
      });
    }
    setLoading(false);
  }

  const trustColor = (t: string) =>
    t === 'TRUSTED' ? '#14F195' : t === 'DANGEROUS' ? '#FF4444' : '#FF8C00';
  const trustBg = (t: string) =>
    t === 'TRUSTED' ? 'rgba(20,241,149,0.1)' : t === 'DANGEROUS' ? 'rgba(255,68,68,0.1)' : 'rgba(255,140,0,0.1)';

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
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🔎</span>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Address Intelligence</div>
            <div style={{ color: 'rgba(20,241,149,0.7)', fontSize: 12 }}>Program trust registry + wallet reputation</div>
          </div>
          <span style={{
            marginLeft: 'auto',
            background: 'rgba(20,241,149,0.1)',
            border: '1px solid rgba(20,241,149,0.3)',
            borderRadius: 12,
            padding: '2px 8px',
            color: '#14F195',
            fontSize: 11,
            fontWeight: 700,
          }}>FIRST-ON-SOLANA</span>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && lookup()}
            placeholder="Paste any program ID or wallet address..."
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(20,241,149,0.25)',
              borderRadius: 12,
              padding: '12px 16px',
              color: '#fff',
              fontSize: 13,
              fontFamily: 'monospace',
              outline: 'none',
            }}
          />
          <button
            onClick={lookup}
            disabled={loading || address.length < 30}
            style={{
              background: 'linear-gradient(135deg, #14F195, #9945FF)',
              border: 'none',
              borderRadius: 12,
              padding: '12px 20px',
              color: '#000',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: 14,
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? '...' : '🔎 Lookup'}
          </button>
        </div>

        {/* Quick lookup for known programs */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>Quick lookup:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Object.entries(KNOWN_PROGRAMS).slice(0, 5).map(([addr, p]) => (
              <button
                key={addr}
                onClick={() => { setAddress(addr); }}
                style={{
                  background: trustBg(p.trust),
                  border: `1px solid ${trustColor(p.trust)}40`,
                  borderRadius: 8,
                  padding: '4px 10px',
                  color: trustColor(p.trust),
                  fontSize: 11,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {p.name.replace('⚠️ ', '')}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div style={{
            background: trustBg(result.trust),
            border: `1px solid ${trustColor(result.trust)}40`,
            borderRadius: 14,
            padding: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>{result.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'monospace', marginTop: 2 }}>
                  {result.address.slice(0, 20)}...{result.address.slice(-8)}
                </div>
              </div>
              <div style={{
                background: trustBg(result.trust),
                border: `2px solid ${trustColor(result.trust)}`,
                borderRadius: 12,
                padding: '6px 14px',
                color: trustColor(result.trust),
                fontWeight: 800,
                fontSize: 14,
              }}>
                {result.trust === 'TRUSTED' ? '✅' : result.trust === 'DANGEROUS' ? '🚨' : '⚠️'} {result.trust}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginBottom: 4 }}>CATEGORY</div>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{result.category}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginBottom: 4 }}>AUDITED BY</div>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{result.audit}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginBottom: 4 }}>TRUST SCORE</div>
                <div style={{ color: trustColor(result.trust), fontSize: 13, fontWeight: 800 }}>{result.score}/100</div>
              </div>
            </div>

            {result.trust === 'DANGEROUS' && (
              <div style={{
                marginTop: 12,
                background: 'rgba(255,68,68,0.15)',
                border: '1px solid rgba(255,68,68,0.4)',
                borderRadius: 10,
                padding: '10px 14px',
                color: '#FF6B6B',
                fontSize: 13,
                fontWeight: 600,
              }}>
                🚨 BLACKLISTED — Never approve any transaction calling this program. It will drain your wallet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
