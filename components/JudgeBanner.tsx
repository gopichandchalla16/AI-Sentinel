"use client"

export default function JudgeBanner() {
  return (
    <div style={{ borderTop: '1px solid #1e1e2e', borderBottom: '1px solid #1e1e2e', background: 'rgba(17,17,24,0.7)', padding: '10px 16px', textAlign: 'center' }}>
      <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>
        🏆 Submitted to{' '}
        <a href="https://colosseum.org/frontier" target="_blank" rel="noopener noreferrer" style={{ color: '#9945FF', fontWeight: 700, textDecoration: 'none' }}>Colosseum Frontier Hackathon 2026</a>
        {' '}· Track: AI Platforms / Agents · Team: Gopichand, Kaviya, Kalisetty
        {' '}·{' '}
        <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer" style={{ color: '#14F195', fontWeight: 600, textDecoration: 'none' }}>MIT Open Source ↗</a>
      </p>
    </div>
  )
}
