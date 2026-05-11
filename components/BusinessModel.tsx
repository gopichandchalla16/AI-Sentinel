"use client"

const TIERS = [
  {
    name: 'Free Tier',
    price: '$0',
    period: '/ month',
    badge: null,
    features: [
      '✅ 50 transaction scans/day',
      '✅ Wallet risk profiler',
      '✅ Program scanner',
      '✅ Basic threat feed',
      '✅ Open source MIT',
    ],
    cta: 'Use Now — Free',
    ctaStyle: { backgroundColor: '#1e1e2e', color: '#F8FAFC' },
  },
  {
    name: 'Pro Tier',
    price: '$29',
    period: '/ month',
    badge: 'Most Popular',
    features: [
      '✅ Unlimited scans',
      '✅ Real-time wallet monitoring alerts',
      '✅ API access (1,000 req/day)',
      '✅ Portfolio risk dashboard',
      '✅ Webhook notifications',
      '✅ Priority Gemini analysis',
    ],
    cta: 'Coming Soon',
    ctaStyle: { background: 'linear-gradient(135deg, #9945FF, #7c3aed)', color: '#fff' },
  },
  {
    name: 'Enterprise / SDK',
    price: 'Custom',
    period: '',
    badge: null,
    features: [
      '✅ White-label firewall SDK',
      '✅ dApp pre-signing integration',
      '✅ Custom threat models',
      '✅ SLA guarantee',
      '✅ On-premise deployment',
      '✅ Audit report export',
    ],
    cta: 'Contact Us',
    ctaStyle: { backgroundColor: '#1e1e2e', color: '#F8FAFC' },
    note: 'For wallets, dApps, and protocols',
  },
]

export default function BusinessModel() {
  return (
    <section className="relative z-10 max-w-5xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-extrabold text-center mb-2" style={{ color: '#F8FAFC' }}>Built to Scale</h2>
      <p className="text-center mb-10" style={{ color: '#94A3B8' }}>From hackathon to ecosystem infrastructure</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {TIERS.map(tier => (
          <div key={tier.name} className={`rounded-2xl p-6 border flex flex-col gap-4 ${tier.badge ? 'border-[#9945FF]/60' : 'border-[#1e1e2e]'}`} style={{ backgroundColor: '#111118' }}>
            {tier.badge && (
              <span className="self-start text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(153,69,255,0.2)', color: '#9945FF' }}>{tier.badge}</span>
            )}
            <div>
              <div className="font-bold text-lg" style={{ color: '#F8FAFC' }}>{tier.name}</div>
              <div className="text-3xl font-extrabold mt-1" style={{ color: '#14F195' }}>
                {tier.price}<span className="text-sm font-normal" style={{ color: '#94A3B8' }}>{tier.period}</span>
              </div>
              {tier.note && <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{tier.note}</p>}
            </div>
            <ul className="space-y-2 flex-1">
              {tier.features.map(f => (
                <li key={f} className="text-sm" style={{ color: '#94A3B8' }}>{f}</li>
              ))}
            </ul>
            <button className="w-full py-2.5 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90" style={tier.ctaStyle}>{tier.cta}</button>
          </div>
        ))}
      </div>
      <div className="text-center p-6 rounded-2xl border border-[#1e1e2e]" style={{ backgroundColor: '#111118' }}>
        <p className="text-lg font-bold mb-2" style={{ color: '#F8FAFC' }}>500M+ potential users · $4.2B lost in 2024 · 0 consumer-friendly AI scanners on Solana today</p>
        <p className="text-sm" style={{ color: '#94A3B8' }}>
          AI-Sentinel is the MetaMask Snaps equivalent for Solana — but smarter, faster, and built for everyone.
        </p>
      </div>
    </section>
  )
}
