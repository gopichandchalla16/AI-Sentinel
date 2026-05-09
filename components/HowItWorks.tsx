export default function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Paste Signature',
      desc: 'Copy any Solana transaction signature from Solscan or your wallet history.',
      icon: '📋',
      color: '#9945FF',
    },
    {
      n: '02',
      title: 'Live RPC Fetch',
      desc: 'AI-Sentinel calls Helius RPC to get real-time tx data, account balances, and wallet history.',
      icon: '⚡',
      color: '#14F195',
    },
    {
      n: '03',
      title: 'Gemini AI Analysis',
      desc: 'Google Gemini 1.5 Flash analyses 7 security parameters and generates a structured risk verdict.',
      icon: '🤖',
      color: '#9945FF',
    },
    {
      n: '04',
      title: 'Instant Verdict',
      desc: 'You get a risk score, specific red flags, a plain-English summary, and a clear recommendation in under 2 seconds.',
      icon: '🛡️',
      color: '#14F195',
    },
  ]

  return (
    <section className="relative z-10 max-w-3xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">How It Works</h2>
        <p className="text-sm text-[#555] mono">4 steps · under 2 seconds · no wallet needed</p>
      </div>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-[22px] top-8 bottom-8 w-px hidden sm:block" style={{ background: 'linear-gradient(to bottom, #9945FF44, #14F19544)' }} />

        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.n} className="flex gap-5 items-start group">
              <div
                className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg relative z-10 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${step.color}12`, border: `1px solid ${step.color}30` }}
              >
                {step.icon}
              </div>
              <div
                className="flex-1 p-4 rounded-xl transition-all duration-300 group-hover:border-[#2a2a2a]"
                style={{ background: '#0f0f0f', border: '1px solid #1a1a1a' }}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-[10px] mono font-bold" style={{ color: step.color }}>{step.n}</span>
                  <span className="text-sm font-semibold text-white">{step.title}</span>
                </div>
                <p className="text-xs text-[#666] leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
