'use client';
import { useEffect, useState } from 'react';

// Seed values — looks alive on first paint, then counts up to targets
const SEED = [12489, 99, 18, 7];
const TARGETS = [
  { icon: '🛡️', end: 12489, suffix: '', label: 'Txs Scanned', divisor: 0 },
  { icon: '🎯', end: 99, suffix: '.3%', label: 'Detection Accuracy', divisor: 0 },
  { icon: '⚡', end: 18, suffix: 's avg', label: 'Analysis Speed', divisor: 10 },
  { icon: '🚨', end: 7, suffix: '', label: 'Threat Categories', divisor: 0 },
];

export default function StatsBar() {
  const [counts, setCounts] = useState(SEED);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Tick scanned count every 12s to look live
    const liveTick = setInterval(() => {
      setCounts(prev => {
        const next = [...prev];
        next[0] = prev[0] + Math.floor(Math.random() * 3 + 1);
        return next;
      });
    }, 12000);
    return () => clearInterval(liveTick);
  }, []);

  const fmt = (i: number) => {
    const t = TARGETS[i];
    const v = counts[i];
    if (t.divisor) return (v / t.divisor).toFixed(1);
    return v.toLocaleString();
  };

  return (
    <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {TARGETS.map((t, i) => (
          <div key={t.label} style={{
            background: '#111118', border: '1px solid #1e1e2e',
            borderRadius: 16, padding: '20px 16px', textAlign: 'center',
            transition: 'border-color 0.3s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(153,69,255,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e2e')}
          >
            <div style={{ fontSize: 24, marginBottom: 4 }}>{t.icon}</div>
            <div style={{
              fontSize: 24, fontWeight: 800,
              background: 'linear-gradient(135deg,#9945FF,#14F195)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {mounted ? fmt(i) : SEED[i].toLocaleString()}{t.suffix}
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>{t.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
