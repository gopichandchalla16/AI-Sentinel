"use client"

const CASES = [
  { emoji: '🎯', title: 'NFT Mint Trap', story: 'Maria received an NFT mint link promising a rare drop. AI-Sentinel detected the contract had freeze authority enabled and called 4 unknown programs. Verdict: DO NOT SIGN', threatType: 'Rug Pull Pattern', riskScore: 94, verdict: 'CRITICAL', color: '#EF4444' },
  { emoji: '💸', title: 'Wallet Drainer', story: 'Raj connected to a DeFi protocol offering 2400% APY. AI-Sentinel identified the approval granted unlimited token access to an unverified program. Verdict: DO NOT SIGN', threatType: 'Unlimited Approval', riskScore: 81, verdict: 'HIGH RISK', color: '#F97316' },
  { emoji: '✅', title: 'Safe Swap', story: 'Priya swapped 50 USDC for SOL on Jupiter. AI-Sentinel confirmed the program is Jupiter v6 (trust score: 95), found zero red flags. Verdict: SAFE TO PROCEED', threatType: 'No Threats Found', riskScore: 8, verdict: 'SAFE', color: '#14F195' },
  { emoji: '⚡', title: 'Flash Loan Attack', story: 'A developer noticed unusual activity in their team wallet. AI-Sentinel detected a flash loan pattern with same-block borrow-and-repay across 3 programs. Verdict: CAUTION', threatType: 'Flash Loan Vector', riskScore: 62, verdict: 'CAUTION', color: '#F59E0B' },
  { emoji: '🎭', title: 'Phishing Link', story: 'Kevin clicked a Discord link claiming to be Phantom support. AI-Sentinel detected the transaction would transfer authority of his wallet to an unknown program. Verdict: DO NOT SIGN', threatType: 'Authority Hijack', riskScore: 97, verdict: 'CRITICAL', color: '#EF4444' },
  { emoji: '🏦', title: 'Legit DeFi', story: 'Team NeuralForge interacted with Marinade Finance for staking. AI-Sentinel confirmed Marinade (trust: 90%), found only standard staking instructions. Verdict: SAFE TO PROCEED', threatType: 'Verified Protocol', riskScore: 11, verdict: 'SAFE', color: '#14F195' },
]

export default function UseCases() {
  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-extrabold text-center mb-2" style={{ color: '#F8FAFC' }}>Real Protection for Real People</h2>
      <p className="text-center mb-10" style={{ color: '#94A3B8' }}>AI-Sentinel stops these attacks every day</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CASES.map(c => (
          <div key={c.title} className="rounded-2xl p-6 border border-[#1e1e2e] hover:border-[#9945FF]/30 transition-colors flex flex-col gap-3" style={{ backgroundColor: '#111118' }}>
            <div className="flex items-center justify-between">
              <span className="text-3xl">{c.emoji}</span>
              <span className="text-xs font-semibold px-2 py-1 rounded-full border" style={{ color: c.color, borderColor: c.color + '40', backgroundColor: c.color + '15' }}>{c.threatType}</span>
            </div>
            <div className="font-bold" style={{ color: '#F8FAFC' }}>{c.title}</div>
            <p className="text-sm flex-1" style={{ color: '#94A3B8' }}>{c.story}</p>
            <div className="flex justify-end">
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: c.color + '20', color: c.color }}>{c.verdict} {c.riskScore}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
