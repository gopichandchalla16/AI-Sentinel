export default function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Paste Signature',
      desc: 'Copy any transaction signature from Solscan, Explorer, or your wallet.',
      icon: '📋',
    },
    {
      n: '02',
      title: 'Live RPC Fetch',
      desc: 'We pull real-time on-chain data: accounts, balances, logs, and instructions.',
      icon: '🔗',
    },
    {
      n: '03',
      title: 'Gemini AI Scan',
      desc: 'Google Gemini 1.5 Flash analyzes for exploits, phishing, and drain patterns.',
      icon: '🤖',
    },
    {
      n: '04',
      title: 'Risk Verdict',
      desc: 'Get a plain-English verdict: LOW / MEDIUM / HIGH / CRITICAL with specific flags.',
      icon: '🛡️',
    },
  ]

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white mb-2">How It Works</h2>
        <p className="text-[#555] text-sm mono">Four steps. Under 2 seconds.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map(({ n, title, desc, icon }) => (
          <div
            key={n}
            className="relative p-5 rounded-xl"
            style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}
          >
            <div className="text-2xl mb-3">{icon}</div>
            <div className="text-[10px] mono text-purple-500 mb-1 uppercase tracking-widest">Step {n}</div>
            <h3 className="font-semibold text-white text-sm mb-2">{title}</h3>
            <p className="text-[#666] text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
