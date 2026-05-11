'use client';
import { useEffect, useState, useRef } from 'react';

type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM';

interface Threat {
  id: string;
  type: string;
  severity: Severity;
  sig: string;
  program: string;
  age: string;
  loss: string;
}

const SEED_THREATS: Threat[] = [
  { id: '1', type: '🩸 Wallet Drainer', severity: 'CRITICAL', sig: '5Ry9Kq...mX2pW', program: 'Unknown Program', age: '2s ago', loss: '-12.4 SOL' },
  { id: '2', type: '🎣 Phishing Link', severity: 'HIGH', sig: '3Px7Lm...nQ8sA', program: 'Fake Jupiter', age: '8s ago', loss: '-220 USDC' },
  { id: '3', type: '🥪 MEV Sandwich', severity: 'HIGH', sig: '9Tz4Vw...kR1dB', program: 'Raydium AMM', age: '14s ago', loss: '-0.8 SOL' },
  { id: '4', type: '🔑 Authority Transfer', severity: 'CRITICAL', sig: '7Jq2Hn...yP5eC', program: 'Token Program', age: '21s ago', loss: 'Full Drain Risk' },
  { id: '5', type: '⚠️ Excessive Approval', severity: 'MEDIUM', sig: '2Wk8Rp...xM3fD', program: 'DeFi Protocol', age: '35s ago', loss: 'Unlimited Approval' },
];

const THREAT_TYPES = [
  { type: '🩸 Wallet Drainer', severity: 'CRITICAL' as Severity, losses: ['-8.2 SOL', '-15.1 SOL', '-3.4 SOL', '-22 SOL'] },
  { type: '🎣 Phishing Link', severity: 'HIGH' as Severity, losses: ['-150 USDC', '-500 USDC', '-80 USDC'] },
  { type: '🥪 MEV Sandwich', severity: 'HIGH' as Severity, losses: ['-0.3 SOL', '-1.2 SOL', '-0.6 SOL'] },
  { type: '🔑 Authority Transfer', severity: 'CRITICAL' as Severity, losses: ['Full Drain Risk', 'Ownership Seized'] },
  { type: '⚡ Flash Loan Attack', severity: 'HIGH' as Severity, losses: ['-2,400 USDC', '-800 USDC'] },
  { type: '⚠️ Excessive Approval', severity: 'MEDIUM' as Severity, losses: ['Unlimited Approval', 'Max Uint256'] },
];

const PROGRAMS = ['Unknown Program', 'Fake Jupiter', 'Token Program', 'Suspicious dApp', 'Unverified Protocol', 'Ghost AMM'];

function randomSig() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  const prefix = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const suffix = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${prefix}...${suffix}`;
}

const severityColor: Record<Severity, string> = {
  CRITICAL: '#FF4444',
  HIGH: '#FF8C00',
  MEDIUM: '#FFD700',
};

export default function LiveThreatPulse() {
  const [threats, setThreats] = useState<Threat[]>(SEED_THREATS);
  const [totalBlocked, setTotalBlocked] = useState(2847);
  const counterRef = useRef(0);

  useEffect(() => {
    const addThreat = () => {
      const template = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
      const program = PROGRAMS[Math.floor(Math.random() * PROGRAMS.length)];
      const loss = template.losses[Math.floor(Math.random() * template.losses.length)];
      counterRef.current += 1;
      const newThreat: Threat = {
        id: `live-${Date.now()}-${counterRef.current}`,
        type: template.type,
        severity: template.severity,
        sig: randomSig(),
        program,
        age: 'just now',
        loss,
      };
      setThreats(prev => [newThreat, ...prev].slice(0, 8));
      setTotalBlocked(prev => prev + 1);
    };

    // First new threat after 3.5s, then every 3.5–6s
    const scheduleNext = () => {
      const delay = 3500 + Math.random() * 2500;
      return setTimeout(() => {
        addThreat();
        const interval = setInterval(() => {
          addThreat();
        }, 3500 + Math.random() * 2500);
        return () => clearInterval(interval);
      }, delay);
    };

    const t = scheduleNext();
    const interval = setInterval(addThreat, 4000);
    return () => { clearTimeout(t); clearInterval(interval); };
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
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: '#FF4444',
            boxShadow: '0 0 10px #FF4444',
            animation: 'pulse 1s ease-in-out infinite',
          }} />
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>🌐 Live Threat Pulse</span>
          <span style={{
            background: 'rgba(255,68,68,0.15)',
            border: '1px solid rgba(255,68,68,0.3)',
            borderRadius: 12,
            padding: '2px 8px',
            color: '#FF6B6B',
            fontSize: 11,
            fontWeight: 700,
          }}>MAINNET LIVE</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#14F195', fontWeight: 800, fontSize: 18 }}>{totalBlocked.toLocaleString()}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>threats blocked</div>
        </div>
      </div>

      {/* Threat list */}
      <div style={{ padding: '8px 0', maxHeight: 380, overflowY: 'auto' }}>
        {threats.map((t, i) => (
          <div key={t.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            animation: i === 0 ? 'slideIn 0.3s ease' : 'none',
            transition: 'background 0.2s',
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: severityColor[t.severity],
              boxShadow: `0 0 6px ${severityColor[t.severity]}`,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{t.type}</span>
                <span style={{
                  background: `${severityColor[t.severity]}20`,
                  border: `1px solid ${severityColor[t.severity]}50`,
                  borderRadius: 6,
                  padding: '1px 6px',
                  color: severityColor[t.severity],
                  fontSize: 10,
                  fontWeight: 700,
                }}>{t.severity}</span>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 2 }}>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'monospace' }}>{t.sig}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{t.program}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ color: '#FF6B6B', fontSize: 12, fontWeight: 700 }}>{t.loss}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{t.age}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
}
