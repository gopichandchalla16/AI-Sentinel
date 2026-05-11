"use client"

const TIERS = [
  {
    name: 'Free Tier',
    price: '$0',
    period: '/ month',
    badge: null,
    badgeColor: null,
    features: ['✅ 50 transaction scans/day', '✅ Wallet risk profiler', '✅ Program scanner', '✅ Basic threat feed', '✅ AI transaction chat', '✅ Open source MIT'],
    cta: 'Use Now — Free',
    href: '#tabs',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/ month',
    badge: 'Most Popular',
    badgeColor: '#9945FF',
    features: ['✅ Unlimited scans', '✅ Real-time wallet monitoring', '✅ API access (1,000 req/day)', '✅ Portfolio risk dashboard', '✅ Webhook alerts', '✅ Priority AI analysis'],
    cta: 'Coming Soon',
    href: null,
    highlight: true,
  },
  {
    name: 'Enterprise / SDK',
    price: 'Custom',
    period: '',
    badge: null,
    badgeColor: null,
    features: ['✅ White-label firewall SDK', '✅ dApp pre-signing integration', '✅ Custom threat models', '✅ SLA guarantee', '✅ Audit report export', '✅ On-premise deployment'],
    cta: 'Contact Us',
    href: 'mailto:gopichandchalla16@gmail.com',
    highlight: false,
    note: 'For wallets, dApps, and protocols',
  },
]

export default function BusinessModel() {
  return (
    <section id="business" style={{ maxWidth: 960, margin: '0 auto', padding: '48px 16px 64px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9945FF', letterSpacing: '0.12em', marginBottom: 8 }}>BUSINESS MODEL</p>
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 900, color: '#F8FAFC', marginBottom: 8 }}>Built to Scale</h2>
        <p style={{ color: '#94A3B8', fontSize: 15 }}>From hackathon to ecosystem infrastructure</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, marginBottom: 32 }}>
        {TIERS.map(tier => (
          <div key={tier.name} style={{ background: '#111118', border: `1px solid ${tier.highlight ? 'rgba(153,69,255,0.5)' : '#1e1e2e'}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: tier.highlight ? '0 0 30px rgba(153,69,255,0.1)' : 'none' }}>
            {tier.badge && (
              <span style={{ alignSelf: 'flex-start', padding: '3px 12px', borderRadius: 9999, background: 'rgba(153,69,255,0.15)', color: '#9945FF', fontSize: 11, fontWeight: 700, border: '1px solid rgba(153,69,255,0.3)' }}>{tier.badge}</span>
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#F8FAFC' }}>{tier.name}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: '#14F195', marginTop: 4 }}>
                {tier.price}<span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 400 }}>{tier.period}</span>
              </div>
              {tier.note && <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{tier.note}</p>}
            </div>
            <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tier.features.map(f => <li key={f} style={{ fontSize: 13, color: '#94A3B8' }}>{f}</li>)}
            </ul>
            {tier.href ? (
              <a href={tier.href} style={{ display: 'block', textAlign: 'center', padding: '10px 0', borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: 'none', background: tier.highlight ? 'linear-gradient(135deg,#9945FF,#7c3aed)' : '#1e1e2e', color: tier.highlight ? '#fff' : '#F8FAFC' }}>{tier.cta}</a>
            ) : (
              <button style={{ padding: '10px 0', borderRadius: 10, fontWeight: 700, fontSize: 13, background: tier.highlight ? 'linear-gradient(135deg,#9945FF,#7c3aed)' : '#1e1e2e', color: tier.highlight ? '#fff' : '#94A3B8', border: 'none', cursor: 'default', opacity: 0.7 }}>{tier.cta}</button>
            )}
          </div>
        ))}
      </div>

      {/* TAM stats */}
      <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, padding: 28, textAlign: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32, marginBottom: 16 }}>
          {[['500M+', 'Potential Users'], ['$4.2B', 'Lost to DeFi Scams in 2024'], ['0', 'Consumer-Friendly AI Scanners on Solana']].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontSize: 26, fontWeight: 900, background: 'linear-gradient(135deg,#9945FF,#14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{val}</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 14, color: '#94A3B8', maxWidth: 560, margin: '0 auto' }}>
          AI-Sentinel is the MetaMask Snaps equivalent for Solana — but smarter, faster, and built for everyone. Every wallet on Solana is a potential user.
        </p>
      </div>
    </section>
  )
}
