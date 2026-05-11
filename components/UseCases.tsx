"use client"

const CASES = [
  { emoji: '🎯', type: 'Rug Pull Pattern', badge: 'CRITICAL', score: 94, badgeColor: '#EF4444', story: 'Maria received an NFT mint link promising a rare drop. AI-Sentinel detected the contract had freeze authority enabled and called 4 unknown programs.', verdict: 'DO NOT SIGN' },
  { emoji: '💸', type: 'Unlimited Approval', badge: 'HIGH RISK', score: 81, badgeColor: '#F97316', story: 'Raj connected to a DeFi protocol offering 2400% APY. AI-Sentinel identified the approval granted unlimited token access to an unverified program.', verdict: 'DO NOT SIGN' },
  { emoji: '✅', type: 'No Threats Found', badge: 'SAFE', score: 8, badgeColor: '#14F195', story: 'Priya swapped 50 USDC for SOL on Jupiter. AI-Sentinel confirmed Jupiter v6 (trust: 95/100), found zero red flags across all 7 threat categories.', verdict: 'SAFE TO PROCEED' },
  { emoji: '⚡', type: 'Flash Loan Vector', badge: 'CAUTION', score: 62, badgeColor: '#F59E0B', story: 'A developer noticed unusual activity in their team wallet. AI-Sentinel detected a flash loan pattern with same-block borrow-and-repay across 3 programs.', verdict: 'CAUTION' },
  { emoji: '🎭', type: 'Authority Hijack', badge: 'CRITICAL', score: 97, badgeColor: '#EF4444', story: 'Kevin clicked a Discord link claiming to be Phantom support. AI-Sentinel detected the transaction would transfer authority of his wallet to an unknown program.', verdict: 'DO NOT SIGN' },
  { emoji: '🏦', type: 'Verified Protocol', badge: 'SAFE', score: 11, badgeColor: '#14F195', story: 'Team NeuralForge interacted with Marinade Finance for staking. AI-Sentinel confirmed Marinade (trust: 90%), found only standard staking instructions.', verdict: 'SAFE TO PROCEED' },
]

const VERDICT_COLORS: Record<string, string> = {
  'DO NOT SIGN': '#EF4444',
  'SAFE TO PROCEED': '#14F195',
  'CAUTION': '#F59E0B',
}

export default function UseCases() {
  return (
    <section style={{ maxWidth: 960, margin: '0 auto', padding: '48px 16px 64px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9945FF', letterSpacing: '0.12em', marginBottom: 8 }}>REAL WORLD PROTECTION</p>
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 900, color: '#F8FAFC', marginBottom: 8 }}>Real Protection for Real People</h2>
        <p style={{ color: '#94A3B8', fontSize: 15 }}>AI-Sentinel stops these attacks every day</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
        {CASES.map((c, i) => {
          const verdictColor = VERDICT_COLORS[c.verdict] || '#94A3B8'
          return (
            <div key={i} style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(153,69,255,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e2e')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 28 }}>{c.emoji}</span>
                <span style={{ padding: '3px 10px', borderRadius: 9999, background: c.badgeColor + '20', color: c.badgeColor, fontSize: 11, fontWeight: 700, border: `1px solid ${c.badgeColor}40` }}>{c.badge} {c.score}</span>
              </div>
              <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.7, flex: 1 }}>{c.story}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid #1e1e2e' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>{c.type}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: verdictColor }}>{c.verdict}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
