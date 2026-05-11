"use client"

const STEPS = [
  { icon: '📋', title: 'Paste Transaction', desc: 'Copy any Solana transaction signature from your wallet or explorer.' },
  { icon: '🔍', title: 'AI Decodes It', desc: 'Gemini AI reads every instruction, program, and token movement in the transaction.' },
  { icon: '🧠', title: 'Risk Scored', desc: 'Our engine assigns a 0-100 risk score based on patterns, red flags, and program trust.' },
  { icon: '🛡️', title: 'Verdict Delivered', desc: 'Clear SAFE / CAUTION / RISKY / DANGEROUS verdict with explanation in plain English.' },
]

export default function HowItWorks() {
  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-extrabold text-center mb-2" style={{ color: '#F8FAFC' }}>How It Works</h2>
      <p className="text-center mb-10" style={{ color: '#94A3B8' }}>Four steps from paste to protection</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((s, i) => (
          <div key={s.title} className="rounded-2xl p-6 border border-[#1e1e2e] hover:border-[#9945FF]/40 transition-colors" style={{ backgroundColor: '#111118' }}>
            <div className="text-4xl mb-3">{s.icon}</div>
            <div className="text-xs font-bold mb-1" style={{ color: '#9945FF' }}>STEP {i + 1}</div>
            <div className="font-semibold mb-2" style={{ color: '#F8FAFC' }}>{s.title}</div>
            <p className="text-sm" style={{ color: '#94A3B8' }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
