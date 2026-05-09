export default function StatsSection() {
  const stats = [
    { value: '$4.2B+', label: 'Lost to DeFi hacks in 2024', sub: 'Source: Chainalysis' },
    { value: '< 2s',   label: 'Average scan time',          sub: 'Solana mainnet RPC' },
    { value: '4',      label: 'Risk detection levels',       sub: 'LOW → CRITICAL' },
    { value: '100%',   label: 'Open source code',            sub: 'MIT License' },
  ]

  return (
    <section
      className="relative z-10 border-y py-12 mt-0"
      style={{ borderColor: '#1a1a1a', background: 'rgba(153,69,255,0.025)' }}
    >
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map(({ value, label, sub }) => (
          <div key={label} className="text-center">
            <div className="text-3xl font-extrabold gradient-text font-mono mb-1">{value}</div>
            <div className="text-sm text-white font-medium mb-0.5">{label}</div>
            <div className="text-[11px] mono" style={{ color: '#555' }}>{sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
