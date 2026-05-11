"use client"

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#1e1e2e] mt-16" style={{ backgroundColor: '#0a0a0f' }}>
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-extrabold text-lg" style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🛡️ AI-Sentinel
          </div>
          <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>The AI Firewall for Solana — Colosseum Frontier Hackathon 2026</p>
        </div>
        <div className="flex gap-4 text-sm" style={{ color: '#94A3B8' }}>
          <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noreferrer" className="hover:text-[#9945FF] transition-colors">GitHub</a>
          <a href="https://solana.com" target="_blank" rel="noreferrer" className="hover:text-[#9945FF] transition-colors">Solana</a>
          <a href="https://colosseum.org" target="_blank" rel="noreferrer" className="hover:text-[#9945FF] transition-colors">Colosseum</a>
        </div>
        <p className="text-xs" style={{ color: '#94A3B8' }}>MIT License · Open Source · Built on Solana Mainnet</p>
      </div>
    </footer>
  )
}
