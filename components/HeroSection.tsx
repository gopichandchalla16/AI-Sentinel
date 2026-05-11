'use client';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div
        style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 400,
          background: 'radial-gradient(ellipse, rgba(153,69,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        {/* Navbar */}
        <nav className="flex items-center justify-between mb-16 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <ShieldIcon />
            <span className="font-bold text-lg tracking-tight">AI-Sentinel</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#scanner"
              className="text-[#94A3B8] hover:text-white text-sm font-medium transition-colors"
            >
              Scanner
            </a>
            <a
              href="#how"
              className="text-[#94A3B8] hover:text-white text-sm font-medium transition-colors"
            >
              How It Works
            </a>
            <a
              href="https://github.com/gopichandchalla16/AI-Sentinel"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#111118] border border-[#1e1e2e] rounded-lg text-sm font-medium hover:border-[#9945FF] transition-colors"
            >
              ⭐ GitHub
            </a>
          </div>
        </nav>

        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#111118] border border-[#1e1e2e] rounded-full mb-8">
          <span
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#14F195',
              boxShadow: '0 0 8px #14F195',
              display: 'inline-block',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          <span className="text-xs font-mono text-[#14F195] font-semibold tracking-widest">
            LIVE · SOLANA MAINNET · COLOSSEUM FRONTIER 2026
          </span>
        </div>

        {/* Shield icon */}
        <div className="flex justify-center mb-8">
          <ShieldLarge />
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 leading-tight">
          <span
            style={{
              background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            AI-Sentinel
          </span>
        </h1>

        <h2 className="text-xl md:text-2xl text-[#94A3B8] font-semibold mb-6">
          Solana&apos;s First Agentic Transaction Firewall
        </h2>

        <p className="text-[#94A3B8] text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Paste any Solana transaction signature. Our AI agent fetches on-chain data,
          simulates the outcome, and delivers a security verdict in under 2 seconds.
          Built for the next billion DeFi users.
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {[
            { icon: '🔴', label: 'Real-time Analysis' },
            { icon: '🤖', label: 'LLM-Powered' },
            { icon: '⚡', label: '< 2 Seconds' },
            { icon: '🔓', label: 'Open Source MIT' },
          ].map((b) => (
            <span
              key={b.label}
              className="flex items-center gap-2 px-4 py-2 bg-[#111118] border border-[#1e1e2e] rounded-full text-sm font-medium text-[#94A3B8]"
            >
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </span>
          ))}
        </div>

        <a
          href="#scanner"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #9945FF, #14F195)',
            color: '#000',
            fontWeight: 800,
            fontSize: '1rem',
            padding: '14px 32px',
            borderRadius: 14,
            textDecoration: 'none',
          }}
        >
          🛡️ Analyze a Transaction — Free
        </a>
      </div>
    </section>
  );
}

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 3L28 9V17C28 23.5 22.5 29.5 16 31C9.5 29.5 4 23.5 4 17V9Z"
        stroke="#9945FF" strokeWidth="1.8" fill="rgba(153,69,255,0.1)"
      />
      <path
        d="M10.5 16L14.5 20L21.5 13"
        stroke="#14F195" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldLarge() {
  return (
    <svg
      width="90" height="90" viewBox="0 0 32 32" fill="none"
      style={{ filter: 'drop-shadow(0 0 18px rgba(153,69,255,0.5))', animation: 'pulse 2.5s ease-in-out infinite' }}
    >
      <path
        d="M16 3L28 9V17C28 23.5 22.5 29.5 16 31C9.5 29.5 4 23.5 4 17V9Z"
        stroke="#9945FF" strokeWidth="1.4" fill="rgba(153,69,255,0.08)"
      />
      <path
        d="M10.5 16L14.5 20L21.5 13"
        stroke="#14F195" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
