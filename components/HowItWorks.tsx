"use client"

const STEPS = [
  { num: '01', icon: '📋', title: 'Paste Signature', desc: 'Copy any Solana transaction hash from your wallet, Solscan, or Phantom. Paste it into the scanner — no login or wallet connection required.' },
  { num: '02', icon: '⛓️', title: 'Live Chain Fetch', desc: 'AI-Sentinel fetches the full transaction in real-time via Helius RPC: all accounts, program calls, token flows, and balance changes.' },
  { num: '03', icon: '🤖', title: 'Gemini AI Analysis', desc: 'Google Gemini 1.5 Flash analyzes 7 threat categories: drainer patterns, authority transfers, flash loan vectors, excessive approvals, and more.' },
  { num: '04', icon: '🛡️', title: 'Instant Verdict', desc: 'Get a 0-100 risk score, clear SAFE / CAUTION / DO NOT SIGN verdict, specific red flags, and an AI chat to ask follow-up questions.' },
]

export default function HowItWorks() {
  return (
    <section id="how" style={{ maxWidth: 960, margin: '0 auto', padding: '64px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9945FF', letterSpacing: '0.12em', marginBottom: 8 }}>HOW IT WORKS</p>
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 900, color: '#F8FAFC', marginBottom: 8 }}>Four steps to complete security</h2>
        <p style={{ color: '#94A3B8', fontSize: 15 }}>From paste to verdict in under 2 seconds</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
        {STEPS.map((s, i) => (
          <div key={s.num} style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24, position: 'relative', transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(153,69,255,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e2e')}
          >
            <div style={{ fontSize: 48, fontWeight: 900, fontFamily: 'monospace', color: 'rgba(153,69,255,0.12)', lineHeight: 1, marginBottom: 12 }}>{s.num}</div>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC', marginBottom: 8 }}>{s.title}</h3>
            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7 }}>{s.desc}</p>
            {i < STEPS.length - 1 && (
              <div style={{ display: 'none' }} className="md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
