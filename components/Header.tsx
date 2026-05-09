'use client'
interface Props { scanCount: number }

export default function Header({ scanCount }: Props) {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(10,10,10,0.88)',
        backdropFilter: 'blur(16px)',
        borderColor: '#1e1e1e',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AI-Sentinel shield logo">
            <defs>
              <linearGradient id="shieldGrad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#9945FF" />
                <stop offset="1" stopColor="#14F195" />
              </linearGradient>
            </defs>
            <path d="M16 2L4 7.5v8.8C4 23.5 9.4 29.5 16 31c6.6-1.5 12-7.5 12-14.7V7.5L16 2z"
              fill="url(#shieldGrad)" fillOpacity="0.18" stroke="url(#shieldGrad)" strokeWidth="1.6" />
            <circle cx="16" cy="15" r="4.5" fill="#14F195" fillOpacity="0.85" />
            <path d="M13 15l2 2 4-4" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div className="font-bold text-white text-[15px] tracking-tight leading-none">AI-Sentinel</div>
            <div className="text-[10px] text-[#666] mono tracking-widest uppercase leading-none mt-0.5">Solana Guard</div>
          </div>
        </div>

        {/* Live badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: 'rgba(20,241,149,0.2)', background: 'rgba(20,241,149,0.05)' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 mono">LIVE · Mainnet Beta</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {scanCount > 0 && (
            <span className="text-xs mono" style={{ color: '#666' }}>
              {scanCount} scan{scanCount !== 1 ? 's' : ''}
            </span>
          )}
          <a
            href="https://solscan.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg border transition-colors mono"
            style={{ borderColor: '#2a2a2a', color: '#666' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = '#9945FF'; (e.target as HTMLElement).style.borderColor = 'rgba(153,69,255,0.3)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = '#666'; (e.target as HTMLElement).style.borderColor = '#2a2a2a' }}
          >
            Solscan ↗
          </a>
          <a
            href="https://github.com/gopichandchalla16/AI-Sentinel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg border transition-colors mono"
            style={{ borderColor: '#2a2a2a', color: '#666' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = '#9945FF'; (e.target as HTMLElement).style.borderColor = 'rgba(153,69,255,0.3)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = '#666'; (e.target as HTMLElement).style.borderColor = '#2a2a2a' }}
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </header>
  )
}
