'use client';
import { useEffect, useState } from 'react';

const TARGETS = [
  { icon: '🛡️', end: 12489, suffix: '', label: 'Txs Scanned' },
  { icon: '🎯', end: 99, suffix: '.3%', label: 'Detection Accuracy' },
  { icon: '⚡', end: 18, suffix: 's avg', label: 'Analysis Speed', divisor: 10 },
  { icon: '🚨', end: 7, suffix: '', label: 'Threat Categories' },
];

export default function StatsBar() {
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const duration = 1800;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts(TARGETS.map(t => Math.round(t.end * ease)));
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {TARGETS.map((t, i) => (
          <div key={t.label} style={{
            background: '#111118', border: '1px solid #1e1e2e',
            borderRadius: 16, padding: '20px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{t.icon}</div>
            <div style={{
              fontSize: 24, fontWeight: 800,
              background: 'linear-gradient(135deg,#9945FF,#14F195)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {t.divisor ? (counts[i] / t.divisor).toFixed(1) : counts[i].toLocaleString()}{t.suffix}
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>{t.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
