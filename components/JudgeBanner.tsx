"use client"

export default function JudgeBanner() {
  return (
    <div className="relative z-10 text-center py-3 border-y border-[#1e1e2e]" style={{ backgroundColor: 'rgba(17,17,24,0.5)' }}>
      <p className="text-sm" style={{ color: '#94A3B8' }}>
        🏆 Submitted to{' '}
        <span className="font-semibold" style={{ color: '#9945FF' }}>Colosseum Frontier Hackathon 2026</span>
        {' '}· Track: AI Platforms / Agents · Team: Gopichand, Kaviya, Kalisetty
      </p>
    </div>
  )
}
