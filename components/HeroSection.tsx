"use client"

export default function HeroSection() {
  return (
    <section className="relative z-10 pt-20 pb-12 text-center px-4">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#9945FF]/30 text-xs font-semibold mb-6" style={{ backgroundColor: 'rgba(153,69,255,0.08)', color: '#9945FF' }}>
        🏆 Colosseum Frontier Hackathon 2026 — AI Platforms / Agents Track
      </div>
      <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight">
        <span style={{ color: '#F8FAFC' }}>The AI Firewall for</span>
        <br />
        <span style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Solana Transactions
        </span>
      </h1>
      <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: '#94A3B8' }}>
        AI-Sentinel scans any Solana transaction, wallet, or program in seconds —
        detecting drainers, rug pulls, and malicious approvals before you lose funds.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => document.getElementById('tabs')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-transform hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #9945FF, #7c3aed)', color: '#fff' }}
        >
          🔍 Scan a Transaction
        </button>
        <a
          href="https://github.com/gopichandchalla16/AI-Sentinel"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-3 rounded-xl font-semibold text-sm border border-[#1e1e2e] transition-colors hover:border-[#9945FF]/60"
          style={{ color: '#94A3B8' }}
        >
          ⭐ Star on GitHub
        </a>
      </div>
    </section>
  )
}
