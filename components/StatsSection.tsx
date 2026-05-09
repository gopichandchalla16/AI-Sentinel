export default function StatsSection() {
  const stats = [
    { value: '$4.2B+', label: 'Lost to Solana exploits in 2024', color: '#FF3232' },
    { value: '<2s',    label: 'Average analysis time',          color: '#14F195' },
    { value: '7',      label: 'Security parameters checked',    color: '#9945FF' },
    { value: '4',      label: 'Risk levels: LOW → CRITICAL',    color: '#FFC107' },
  ]

  return (
    <section className="relative z-10 max-w-3xl mx-auto px-4 pb-14">
      <div
        className="rounded-2xl p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
        style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}
      >
        {stats.map(({ value, label, color }) => (
          <div key={label}>
            <div className="text-2xl sm:text-3xl font-extrabold mono mb-1" style={{ color }}>{value}</div>
            <div className="text-[11px] text-[#555] leading-tight">{label}</div>
          </div>
        ))}
      </div>

      {/* Sponsor badges */}
      <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
        <span className="text-[11px] mono text-[#333] uppercase tracking-wider">Powered by</span>
        {[
          { name: 'Phantom', color: '#9945FF', url: 'https://phantom.com' },
          { name: 'Helius RPC', color: '#14F195', url: 'https://helius.dev' },
          { name: 'Gemini AI', color: '#4285F4', url: 'https://aistudio.google.com' },
          { name: 'Solana', color: '#9945FF', url: 'https://solana.com' },
          { name: 'Vercel', color: '#fff', url: 'https://vercel.com' },
        ].map(({ name, color, url }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] mono px-3 py-1.5 rounded-full transition-all hover:opacity-100 opacity-60"
            style={{ border: `1px solid ${color}30`, color }}
          >
            {name}
          </a>
        ))}
      </div>
    </section>
  )
}
