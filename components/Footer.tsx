export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: '#161616' }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: branding */}
          <div className="flex items-center gap-2.5">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="footerGrad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#9945FF" />
                  <stop offset="1" stopColor="#14F195" />
                </linearGradient>
              </defs>
              <path d="M16 2L4 7.5v8.8C4 23.5 9.4 29.5 16 31c6.6-1.5 12-7.5 12-14.7V7.5L16 2z"
                fill="url(#footerGrad)" fillOpacity="0.15" stroke="url(#footerGrad)" strokeWidth="1.5" />
              <circle cx="16" cy="15" r="4" fill="#14F195" fillOpacity="0.8" />
              <path d="M13.5 15l1.8 1.8 3.6-3.6" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <div className="text-white font-bold text-sm tracking-tight">AI-Sentinel</div>
              <div className="text-[10px] mono text-[#444] tracking-widest uppercase">Solana Guard</div>
            </div>
          </div>

          {/* Center: team */}
          <div className="text-center">
            <p className="text-xs text-[#444] mono">Built for Colosseum Frontier Hackathon 2026</p>
            <p className="text-[11px] text-[#333] mono mt-0.5">
              Gopichand · Kaviya · Kalisetty
            </p>
          </div>

          {/* Right: links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/gopichandchalla16/AI-Sentinel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] mono text-[#444] hover:text-purple-400 transition-colors"
            >
              GitHub ↗
            </a>
            <span className="text-[#222]">·</span>
            <a
              href="https://solscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] mono text-[#444] hover:text-green-400 transition-colors"
            >
              Solscan ↗
            </a>
            <span className="text-[#222]">·</span>
            <a
              href="https://helius.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] mono text-[#444] hover:text-green-400 transition-colors"
            >
              Helius ↗
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t text-center" style={{ borderColor: '#111' }}>
          <p className="text-[11px] mono" style={{ color: '#2a2a2a' }}>
            MIT License · Open Source · Not financial advice · Always verify independently
          </p>
        </div>
      </div>
    </footer>
  )
}
