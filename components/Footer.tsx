export default function Footer() {
  return (
    <footer className="relative z-10 border-t py-10" style={{ borderColor: '#1a1a1a' }}>
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="fg" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#9945FF" /><stop offset="1" stopColor="#14F195" />
              </linearGradient>
            </defs>
            <path d="M16 2L4 7.5v8.8C4 23.5 9.4 29.5 16 31c6.6-1.5 12-7.5 12-14.7V7.5L16 2z"
              fill="url(#fg)" fillOpacity="0.18" stroke="url(#fg)" strokeWidth="1.6" />
            <circle cx="16" cy="15" r="4.5" fill="#14F195" fillOpacity="0.85" />
            <path d="M13 15l2 2 4-4" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-bold text-white text-sm">AI-Sentinel</span>
        </div>

        <p className="text-xs mono" style={{ color: '#444' }}>
          Built for{' '}
          <a href="https://www.colosseum.org" target="_blank" rel="noopener noreferrer" className="text-purple-500/60 hover:text-purple-400 transition-colors">Colosseum Frontier Hackathon 2026</a>
          {' '}·{' '}
          <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer" className="text-purple-500/60 hover:text-purple-400 transition-colors">MIT License</a>
          {' '}· Open Source
        </p>

        <p className="text-xs mono" style={{ color: '#333' }}>
          Team: Gopichand Challa · Kaviya · Kalisetty
        </p>

        <div className="flex justify-center gap-6 text-[11px] mono" style={{ color: '#444' }}>
          {[
            { href: 'https://github.com/gopichandchalla16/AI-Sentinel', label: 'GitHub' },
            { href: 'https://solana.com', label: 'Solana' },
            { href: 'https://solscan.io', label: 'Solscan' },
            { href: 'https://aistudio.google.com', label: 'Gemini AI' },
          ].map(({ href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors">
              {label} ↗
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
