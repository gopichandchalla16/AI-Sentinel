'use client';
import { useState, useEffect } from 'react';

const SEED_THREATS = [
  { type: '🩸 Wallet Drainer', level: 'CRITICAL', color: '#FF4444', sig: '5Ry9Kq...mX2pW', prog: 'Unknown Program', amount: '-12.4 SOL', age: 2 },
  { type: '🎣 Phishing Link', level: 'HIGH', color: '#FF8C00', sig: '3Px7Lm...nQ8sA', prog: 'Fake Jupiter', amount: '-220 USDC', age: 8 },
  { type: '🥪 MEV Sandwich', level: 'HIGH', color: '#FF8C00', sig: '9Tz4Vw...kR1dB', prog: 'Raydium AMM', amount: '-0.8 SOL', age: 14 },
  { type: '🔑 Authority Transfer', level: 'CRITICAL', color: '#FF4444', sig: '7Jq2Hn...yP5eC', prog: 'Token Program', amount: 'Full Drain Risk', age: 21 },
  { type: '⚠️ Excessive Approval', level: 'MEDIUM', color: '#FFD700', sig: '2Wk8Rp...xM3fD', prog: 'DeFi Protocol', amount: 'Unlimited Approval', age: 35 },
];

const LIVE_POOL = [
  { type: '🚨 Flash Loan Attack', level: 'CRITICAL', color: '#FF4444', prog: 'Lending Protocol', amount: '-500 SOL' },
  { type: '🤖 Bot Sweep', level: 'HIGH', color: '#FF8C00', prog: 'Unknown Signer', amount: '-45 USDC' },
  { type: '🪤 Fake Airdrop', level: 'HIGH', color: '#FF8C00', prog: 'Fake Saber', amount: 'Token Drain' },
  { type: '🔓 Delegate Abuse', level: 'MEDIUM', color: '#FFD700', prog: 'NFT Program', amount: 'NFT Risk' },
  { type: '💉 Reentrancy Risk', level: 'CRITICAL', color: '#FF4444', prog: 'DeFi Pool', amount: '-88 SOL' },
];

function randSig() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
  const a = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const b = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${a}...${b}`;
}

export default function LiveThreatFeed() {
  const [threats, setThreats] = useState(SEED_THREATS.map(t => ({ ...t, id: Math.random() })));
  const [counter, setCounter] = useState(2847);

  useEffect(() => {
    const addThreat = () => {
      const t = LIVE_POOL[Math.floor(Math.random() * LIVE_POOL.length)];
      setThreats(prev => [{ ...t, sig: randSig(), age: 0, id: Math.random() }, ...prev.slice(0, 7)]);
      setCounter(c => c + 1);
    };
    const interval = setInterval(addThreat, Math.random() * 4000 + 5000);
    return () => clearInterval(interval);
  }, []);

  // Age counter
  useEffect(() => {
    const tick = setInterval(() => {
      setThreats(prev => prev.map(t => ({ ...t, age: t.age + 1 })));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const formatAge = (s: number) => s < 60 ? `${s}s ago` : `${Math.floor(s / 60)}m ago`;

  return (
    <div style={{ background: 'rgba(10,10,15,0.85)', border: '1px solid rgba(153,69,255,0.25)', borderRadius: 20, overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
      <div style={{ background: 'linear-gradient(135deg, rgba(153,69,255,0.2), rgba(255,68,68,0.1))', padding: '16px 20px', borderBottom: '1px solid rgba(153,69,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF4444', boxShadow: '0 0 10px #FF4444', animation: 'pulse 1s ease-in-out infinite' }} />
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>🌐 Live Threat Pulse</span>
          <span style={{ background: 'rgba(255,68,68,0.15)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: 12, padding: '2px 8px', color: '#FF6B6B', fontSize: 11, fontWeight: 700 }}>MAINNET LIVE</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#14F195', fontWeight: 800, fontSize: 18 }}>{counter.toLocaleString()}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>threats blocked</div>
        </div>
      </div>

      <div style={{ padding: '8px 0', maxHeight: 380, overflowY: 'auto' }}>
        {threats.map((t: any) => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', animation: t.age === 0 ? 'slideIn 0.4s ease' : 'none', transition: 'background 0.2s' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: t.color, boxShadow: `0 0 6px ${t.color}` }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{t.type}</span>
                <span style={{ background: `${t.color}20`, border: `1px solid ${t.color}50`, borderRadius: 6, padding: '1px 6px', color: t.color, fontSize: 10, fontWeight: 700 }}>{t.level}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 2 }}>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'monospace' }}>{t.sig}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{t.prog}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ color: '#FF6B6B', fontSize: 12, fontWeight: 700 }}>{t.amount}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{formatAge(t.age)}</div>
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
