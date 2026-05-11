"use client"

export default function Footer() {
  return (
    <footer style={{ background: '#111118', borderTop: '1px solid #1e1e2e', padding: '40px 16px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path d="M16 3L28 9V17C28 23.5 22.5 29.5 16 31C9.5 29.5 4 23.5 4 17V9Z" stroke="#9945FF" strokeWidth="1.8" fill="rgba(153,69,255,0.1)" />
            <path d="M10.5 16L14.5 20L21.5 13" stroke="#14F195" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontWeight: 800, fontSize: 16, background: 'linear-gradient(135deg,#9945FF,#14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI-Sentinel</span>
        </div>
        <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 6 }}>
          Built for{' '}
          <a href="https://colosseum.org/frontier" target="_blank" rel="noopener noreferrer" style={{ color: '#9945FF', textDecoration: 'none', fontWeight: 600 }}>Colosseum Frontier Hackathon 2026</a>
          {' '}· Track: AI Platforms / Agents
        </p>
        <p style={{ fontSize: 12, color: '#475569', marginBottom: 20 }}>Making Solana DeFi safe for the next billion users.</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>GitHub</a>
          <a href="https://twitter.com/GopichandAI" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>@GopichandAI</a>
          <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>Solscan</a>
          <span style={{ padding: '3px 10px', background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.25)', color: '#14F195', fontSize: 11, fontWeight: 700, borderRadius: 6 }}>MIT License</span>
        </div>
      </div>
    </footer>
  )
}
