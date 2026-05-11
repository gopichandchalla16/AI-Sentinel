'use client';

const STEPS = [
  {
    icon: '📋',
    num: '01',
    title: 'Paste Signature',
    body: 'Copy any Solana transaction hash from your wallet, Solscan, or explorer. Paste it into the scanner.',
  },
  {
    icon: '🤖',
    num: '02',
    title: 'AI Simulates',
    body: 'We fetch live on-chain state via Helius RPC and run multi-layer LLM threat modeling with Gemini 1.5 Flash.',
  },
  {
    icon: '🛡️',
    num: '03',
    title: 'Get Verdict',
    body: 'Receive a 0–100 risk score, human-readable explanation, specific red flags, and a clear DO / DON\'T SIGN decision.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-xs font-mono font-bold text-[#9945FF] tracking-widest mb-3">HOW IT WORKS</p>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight">Three steps to security</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {STEPS.map((step, i) => (
          <div key={step.num} className="relative">
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 h-full hover:border-[#9945FF]/40 transition-colors">
              <div
                className="text-6xl font-black font-mono mb-4"
                style={{ color: 'rgba(153,69,255,0.15)' }}
              >
                {step.num}
              </div>
              <div className="text-3xl mb-3">{step.icon}</div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">{step.title}</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">{step.body}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-[#9945FF] text-xl font-bold">
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
