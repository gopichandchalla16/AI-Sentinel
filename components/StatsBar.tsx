'use client';

const STATS = [
  { icon: '🛡️', value: '3,847', label: 'Txs Scanned Today' },
  { icon: '🎯', value: '94.3%', label: 'Detection Accuracy' },
  { icon: '⚡', value: '1.8s',  label: 'Avg Analysis Time' },
  { icon: '🔍', value: '7',     label: 'Threat Categories' },
];

export default function StatsBar() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5 text-center"
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <div
              className="text-2xl font-black mb-1"
              style={{
                background: 'linear-gradient(135deg, #9945FF, #14F195)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {s.value}
            </div>
            <div className="text-xs text-[#94A3B8] font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
