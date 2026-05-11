'use client';
import { useEffect, useState } from 'react';

const THREAT_TYPES = [
  { type: 'DRAINER', color: '#FF4444', emoji: '🚨' },
  { type: 'PHISHING', color: '#FF8C00', emoji: '🎣' },
  { type: 'MEV ATTACK', color: '#FFD700', emoji: '⚡' },
  { type: 'RUG PULL', color: '#FF6B6B', emoji: '🪤' },
  { type: 'FAKE MINT', color: '#FF4DA6', emoji: '🖼️' },
  { type: 'APPROVAL ABUSE', color: '#FF8C00', emoji: '🔓' },
  { type: 'FLASH LOAN', color: '#9945FF', emoji: '💸' },
];

const PROGRAMS = [
  'Jupiter v6', 'Raydium AMM', 'Orca Whirlpool', 'Serum DEX',
  'Marinade Finance', 'Tensor NFT', 'Magic Eden', 'Drift Protocol',
  'Marginfi', 'Kamino Finance',
];

function genSig() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 8 }, () => c[Math.floor(Math.random() * c.length)]).join('');
}

function genWallet() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 6 }, () => c[Math.floor(Math.random() * c.length)]).join('');
}

interface ThreatEvent {
  id: number;
  type: string;
  color: string;
  emoji: string;
  sig: string;
  wallet: string;
  program: string;
  riskScore: number;
  ago: number;
  blocked: boolean;
}

export default function LiveThreatPulse() {
  const [events, setEvents] = useState<ThreatEvent[]>([]);
  const [totalBlocked, setTotalBlocked] = useState(2847);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Seed with initial events
    const seed: ThreatEvent[] = Array.from({ length: 5 }, (_, i) => {
      const t = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
      return {
        id: i,
        type: t.type,
        color: t.color,
        emoji: t.emoji,
        sig: genSig() + '...',
        wallet: genWallet() + '...',
        program: PROGRAMS[Math.floor(Math.random() * PROGRAMS.length)],
        riskScore: 60 + Math.floor(Math.random() * 40),
        ago: 10 + i * 15,
        blocked: Math.random() > 0.3,
      };
    });
    setEvents(seed);

    const interval = setInterval(() => {
      const t = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
      const newEvent: ThreatEvent = {
        id: Date.now(),
        type: t.type,
        color: t.color,
        emoji: t.emoji,
        sig: genSig() + '...',
        wallet: genWallet() + '...',
        program: PROGRAMS[Math.floor(Math.random() * PROGRAMS.length)],
        riskScore: 60 + Math.floor(Math.random() * 39),
        ago: 0,
        blocked: Math.random() > 0.25,
      };
      setEvents((prev) => [newEvent, ...prev].slice(0, 8));
      if (newEvent.blocked) setTotalBlocked((n) => n + 1);
      setCounter((c) => c + 1);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: 'rgba(10,10,15,0.85)',
      border: '1px solid rgba(153,69,255,0.25)',
      borderRadius: 20,
      overflow: 'hidden',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(153,69,255,0.2), rgba(255,68,68,0.1))',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(153,69,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#FF4444',
            boxShadow: '0 0 10px #FF4444',
            animation: 'pulse 1s ease-in-out infinite',
          }} />
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>🌐 Live Threat Feed</span>
          <span style={{
            background: 'rgba(255,68,68,0.15)',
            border: '1px solid rgba(255,68,68,0.3)',
            borderRadius: 12,
            padding: '2px 8px',
            color: '#FF6B6B',
            fontSize: 11,
            fontWeight: 700,
          }}>MAINNET</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#14F195', fontWeight: 800, fontSize: 18 }}>{totalBlocked.toLocaleString()}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>threats blocked</div>
        </div>
      </div>

      {/* Events */}
      <div style={{ padding: '8px 0', maxHeight: 380, overflowY: 'auto' }}>
        {events.map((e, i) => (
          <div
            key={e.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              animation: i === 0 ? 'slideIn 0.4s ease-out' : 'none',
              background: i === 0 ? 'rgba(153,69,255,0.05)' : 'transparent',
              transition: 'background 0.3s',
            }}
          >
            {/* Risk badge */}
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: `${e.color}18`,
              border: `1.5px solid ${e.color}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}>
              {e.emoji}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ color: e.color, fontWeight: 700, fontSize: 12 }}>{e.type}</span>
                <span style={{
                  background: e.blocked ? 'rgba(20,241,149,0.12)' : 'rgba(255,68,68,0.12)',
                  border: `1px solid ${e.blocked ? 'rgba(20,241,149,0.3)' : 'rgba(255,68,68,0.3)'}`,
                  borderRadius: 10,
                  padding: '1px 6px',
                  color: e.blocked ? '#14F195' : '#FF6B6B',
                  fontSize: 10,
                  fontWeight: 700,
                }}>
                  {e.blocked ? '✓ BLOCKED' : '⚠ DETECTED'}
                </span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontFamily: 'monospace' }}>
                {e.sig} · {e.program}
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{
                color: e.riskScore >= 80 ? '#FF4444' : '#FF8C00',
                fontWeight: 800,
                fontSize: 16,
              }}>
                {e.riskScore}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
                {e.ago === 0 ? 'just now' : `${e.ago}s ago`}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
}
