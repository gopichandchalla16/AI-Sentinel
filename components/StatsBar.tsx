'use client';
import { useEffect, useState } from 'react';

const TARGETS = [
  { icon: '🛡️', end: 48291, label: 'Txs Scanned', suffix: '' },
  { icon: '🎯', end: 99, label: 'Detection Accuracy', suffix: '.3%' },
  { icon: '⚡', end: 1, label: 'Avg Analysis Time', suffix: '.8s' },
  { icon: '🚨', end: 7, label: 'Threat Categories', suffix: '' },
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
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts(TARGETS.map(t => Math.floor(t.end * ease)));
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {TARGETS.map((t, i) => (
          <div key={t.label} style={{
            background: '#111118',
            border: '1px solid #1e1e2e',
            borderRadius: 16,
            padding: '20px 16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{t.icon}</div>
            <div style={{
              fontSize: 24,
              fontWeight: 800,
              background: 'linear-gradient(135deg,#9945FF,#14F195)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {counts[i].toLocaleString()}{t.suffix}
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>{t.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
