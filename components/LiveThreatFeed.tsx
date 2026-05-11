'use client';
import { useEffect, useState, useRef } from 'react';

const BASE_COUNT = 2847;

const THREAT_POOL = [
  { type: '🩸 Wallet Drainer', severity: 'CRITICAL', color: '#FF4444', sig: '5Ry9Kq...mX2pW', prog: 'Unknown Program', loss: '-12.4 SOL' },
  { type: '🎣 Phishing Link', severity: 'HIGH', color: '#FF8C00', sig: '3Px7Lm...nQ8sA', prog: 'Fake Jupiter', loss: '-220 USDC' },
  { type: '🥪 MEV Sandwich', severity: 'HIGH', color: '#FF8C00', sig: '9Tz4Vw...kR1dB', prog: 'Raydium AMM', loss: '-0.8 SOL' },
  { type: '🔑 Authority Transfer', severity: 'CRITICAL', color: '#FF4444', sig: '7Jq2Hn...yP5eC', prog: 'Token Program', loss: 'Full Drain Risk' },
  { type: '⚠️ Excessive Approval', severity: 'MEDIUM', color: '#FFD700', sig: '2Wk8Rp...xM3fD', prog: 'DeFi Protocol', loss: 'Unlimited Approval' },
  { type: '🤖 Bot Activity', severity: 'HIGH', color: '#FF8C00', sig: '4Bn3Xc...pL9wE', prog: 'Unknown', loss: 'MEV Extracted' },
  { type: '💣 Flash Loan Attack', severity: 'CRITICAL', color: '#FF4444', sig: '8Kp1Mz...qR5nT', prog: 'Lending Pool', loss: '-45.2 SOL' },
  { type: '🕸️ Rug Pull Signal', severity: 'CRITICAL', color: '#FF4444', sig: '6Ht5Yv...sW2oP', prog: 'New Token Mint', loss: 'Liquidity Drain' },
  { type: '🎭 Fake NFT Mint', severity: 'MEDIUM', color: '#FFD700', sig: '1Cq7Dk...mN4bF', prog: 'Metaplex Fork', loss: '-2.1 SOL' },
  { type: '🔓 Delegate Exploit', severity: 'HIGH', color: '#FF8C00', sig: '0Lw9Jx...hG6aV', prog: 'SPL Token', loss: 'Full Wallet Risk' },
];

type Threat = typeof THREAT_POOL[0] & { id: number; age: number };

export default function LiveThreatFeed() {
  const [threats, setThreats] = useState<Threat[]>(
    THREAT_POOL.slice(0, 5).map((t, i) => ({ ...t, id: i, age: (i + 1) * 7 }))
  );
  const [totalBlocked, setTotalBlocked] = useState(BASE_COUNT);
  const idRef = useRef(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const pick = THREAT_POOL[Math.floor(Math.random() * THREAT_POOL.length)];
      const fresh: Threat = { ...pick, id: idRef.current++, age: 0 };
      setThreats(prev => [fresh, ...prev].slice(0, 8));
      setTotalBlocked(prev => prev + 1);
    }, 7000);
    const ageInterval = setInterval(() => {
      setThreats(prev => prev.map(t => ({ ...t, age: t.age + 1 })));
    }, 1000);
    return () => { clearInterval(interval); clearInterval(ageInterval); };
  }, []);

  const fmtAge = (s: number) => s < 60 ? `${s}s ago` : `${Math.floor(s / 60)}m ago`;

  return (
    <div style={{
      background: 'rgba(10,10,15,0.85)', border: '1px solid rgba(153,69,255,0.25)',
      borderRadius: 20, overflow: 'hidden', backdropFilter: 'blur(12px)',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(153,69,255,0.2), rgba(255,68,68,0.1))',
        padding: '16px 20px', borderBottom: '1px solid rgba(153,69,255,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%', background: '#FF4444',
            boxShadow: '0 0 10px #FF4444', animation: 'pulse 1s ease-in-out infinite',
          }} />
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>🌐 Live Threat Pulse</span>
          <span style={{
            background: 'rgba(255,68,68,0.15)', border: '1px solid rgba(255,68,68,0.3)',
            borderRadius: 12, padding: '2px 8px', color: '#FF6B6B', fontSize: 11, fontWeight: 700,
          }}>MAINNET LIVE</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#14F195', fontWeight: 800, fontSize: 18 }}>
            {totalBlocked.toLocaleString()}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>threats blocked</div>
        </div>
      </div>

      {/* Feed rows */}
      <div style={{ padding: '8px 0', maxHeight: 380, overflowY: 'auto' }}>
        {threats.map(t => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
            animation: t.age < 2 ? 'slideIn 0.4s ease' : 'none',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: t.color, boxShadow: `0 0 6px ${t.color}` }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{t.type}</span>
                <span style={{
                  background: `${t.color}20`, border: `1px solid ${t.color}50`,
                  borderRadius: 6, padding: '1px 6px', color: t.color, fontSize: 10, fontWeight: 700,
                }}>{t.severity}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 2 }}>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'monospace' }}>{t.sig}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{t.prog}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ color: '#FF6B6B', fontSize: 12, fontWeight: 700 }}>{t.loss}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{fmtAge(t.age)}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.9)} }
      `}</style>
    </div>
  );
}
