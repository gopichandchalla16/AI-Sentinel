"use client"

export default function HeroSection() {
  const scrollToScanner = () => {
    document.getElementById('tabs')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="top" style={{ position: 'relative', overflow: 'hidden', paddingTop: 60, paddingBottom: 60 }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(153,69,255,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 16px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* LIVE badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 9999, marginBottom: 28 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#14F195', boxShadow: '0 0 8px #14F195', animation: 'pulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#14F195', letterSpacing: '0.12em' }}>LIVE · SOLANA MAINNET · COLOSSEUM FRONTIER 2026</span>
        </div>

        {/* Logo icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <svg width="88" height="88" viewBox="0 0 32 32" fill="none" style={{ filter: 'drop-shadow(0 0 20px rgba(153,69,255,0.5))', animation: 'pulse 2.5s ease-in-out infinite' }}>
            <path d="M16 3L28 9V17C28 23.5 22.5 29.5 16 31C9.5 29.5 4 23.5 4 17V9Z" stroke="#9945FF" strokeWidth="1.4" fill="rgba(153,69,255,0.08)" />
            <path d="M10.5 16L14.5 20L21.5 13" stroke="#14F195" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: 'clamp(2.4rem,6vw,4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 12, letterSpacing: '-0.02em' }}>
          <span style={{ background: 'linear-gradient(135deg,#9945FF 0%,#14F195 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI-Sentinel</span>
        </h1>
        <h2 style={{ fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', color: '#94A3B8', fontWeight: 600, marginBottom: 16 }}>Solana&apos;s First Agentic Transaction Firewall</h2>
        <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.8, maxWidth: 580, margin: '0 auto 32px', fontWeight: 400 }}>
          Paste any Solana transaction signature. Our AI fetches live on-chain data, detects drainers, phishing &amp; malicious programs, and delivers a security verdict in under 2 seconds. Built for the next billion DeFi users.
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {['🔴 Real-time Analysis', '🤖 Gemini AI Powered', '⚡ &lt;2 Seconds', '🔓 No Wallet Needed', '🧠 Wallet Profiler', '📡 Live Threat Feed', '🔬 Program Scanner'].map(f => (
            <span key={f} style={{ padding: '6px 14px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 9999, fontSize: 12, color: '#94A3B8' }} dangerouslySetInnerHTML={{ __html: f }} />
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={scrollToScanner}
            style={{ padding: '14px 32px', borderRadius: 12, fontWeight: 800, fontSize: 15, background: 'linear-gradient(135deg,#9945FF,#14F195)', color: '#0a0a0f', border: 'none', cursor: 'pointer', letterSpacing: '-0.01em' }}>
            🛡️ Analyze a Transaction — Free
          </button>
          <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer"
            style={{ padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 15, background: 'transparent', border: '1px solid #1e1e2e', color: '#F8FAFC', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            ⭐ View on GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
