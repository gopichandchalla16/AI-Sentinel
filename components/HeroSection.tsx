export default function HeroSection() {
  return (
    <section className="relative z-10 text-center pt-20 pb-10 px-4">
      {/* Hackathon badge */}
      <div
        className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border text-xs mono"
        style={{ borderColor: 'rgba(153,69,255,0.3)', background: 'rgba(153,69,255,0.07)', color: '#c084fc' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        Colosseum Frontier Hackathon 2026 — AI Platforms / Agents
      </div>

      {/* Main heading */}
      <h1 className="text-[2.6rem] sm:text-[3.4rem] font-extrabold leading-[1.1] tracking-tight mb-5">
        <span className="text-white">Scan Solana Txns.</span>
        <br />
        <span className="gradient-text">Know Before You Sign.</span>
      </h1>

      <p className="text-[#888] text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-8">
        AI-Sentinel fetches live on-chain data and runs it through{' '}
        <span className="text-white font-medium">Google Gemini AI</span> to give you
        a plain-English risk verdict in under 2 seconds.
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2.5 mb-10">
        {[
          { icon: '🔗', text: 'Live Solana RPC' },
          { icon: '🤖', text: 'Gemini 1.5 Flash' },
          { icon: '⚡', text: 'Sub-2s Analysis' },
          { icon: '🛡️', text: '4 Risk Levels' },
          { icon: '🔓', text: 'Open Source MIT' },
        ].map(({ icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs mono"
            style={{ background: '#111', border: '1px solid #1e1e1e', color: '#888' }}
          >
            <span>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      {/* CTA arrow */}
      <a
        href="#scan"
        className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-purple-400 transition-colors mono"
      >
        <span>Paste a tx signature below</span>
        <span className="text-lg">↓</span>
      </a>
    </section>
  )
}
