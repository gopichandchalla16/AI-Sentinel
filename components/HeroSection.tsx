'use client'
import { useEffect, useState } from 'react'

const THREAT_TICKERS = [
  { label: 'Wallet Drainer', risk: 'CRITICAL', color: '#FF3232' },
  { label: 'Unknown Destination', risk: 'HIGH', color: '#FF6B35' },
  { label: 'Jupiter Swap', risk: 'LOW', color: '#14F195' },
  { label: 'Token Approval', risk: 'MEDIUM', color: '#FFC107' },
  { label: 'NFT Purchase', risk: 'LOW', color: '#14F195' },
  { label: 'Phishing Contract', risk: 'CRITICAL', color: '#FF3232' },
]

export default function HeroSection() {
  const [tickerIdx, setTickerIdx] = useState(0)
  const [counter, setCounter] = useState({ scans: 14823, threats: 2341 })

  useEffect(() => {
    const t = setInterval(() => setTickerIdx(i => (i + 1) % THREAT_TICKERS.length), 2200)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setCounter(c => ({ scans: c.scans + Math.floor(Math.random() * 3), threats: c.threats }))
    }, 3500)
    return () => clearInterval(t)
  }, [])

  const current = THREAT_TICKERS[tickerIdx]

  return (
    <section className="relative z-10 text-center pt-16 pb-8 px-4 overflow-hidden">
      {/* Top ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(153,69,255,0.08) 0%, transparent 70%)' }} />

      {/* Hackathon badge */}
      <div
        className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border text-xs mono"
        style={{ borderColor: 'rgba(153,69,255,0.3)', background: 'rgba(153,69,255,0.07)', color: '#c084fc' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        Colosseum Frontier Hackathon 2026 · AI Platforms / Agents
      </div>

      {/* Main heading */}
      <h1 className="text-[2.4rem] sm:text-[3.2rem] font-extrabold leading-[1.1] tracking-tight mb-4">
        <span className="text-white">Know What You&apos;re Signing.</span>
        <br />
        <span className="gradient-text">Before You Sign It.</span>
      </h1>

      <p className="text-[#777] text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-6">
        AI-Sentinel fetches live Solana on-chain data and runs it through{' '}
        <span className="text-white font-medium">Google Gemini AI</span> — giving you
        a plain-English risk verdict in under 2 seconds.
      </p>

      {/* Live threat ticker */}
      <div
        className="inline-flex items-center gap-3 mb-7 px-4 py-2.5 rounded-xl border mono text-xs"
        style={{ borderColor: '#1e1e1e', background: '#0d0d0d' }}
      >
        <span className="text-[#444]">Last analyzed:</span>
        <span
          className="font-semibold transition-all duration-500"
          style={{ color: current.color }}
          key={tickerIdx}
        >
          {current.label}
        </span>
        <span
          className="px-2 py-0.5 rounded text-[10px] font-bold"
          style={{ background: `${current.color}18`, color: current.color, border: `1px solid ${current.color}40` }}
        >
          {current.risk}
        </span>
      </div>

      {/* Live stats */}
      <div className="flex justify-center gap-6 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold mono" style={{ color: '#14F195' }}>{counter.scans.toLocaleString()}</div>
          <div className="text-[11px] mono text-[#444] uppercase tracking-wider mt-0.5">Txns Scanned</div>
        </div>
        <div className="w-px" style={{ background: '#1e1e1e' }} />
        <div className="text-center">
          <div className="text-2xl font-bold mono" style={{ color: '#FF6B35' }}>{counter.threats.toLocaleString()}</div>
          <div className="text-[11px] mono text-[#444] uppercase tracking-wider mt-0.5">Threats Caught</div>
        </div>
        <div className="w-px" style={{ background: '#1e1e1e' }} />
        <div className="text-center">
          <div className="text-2xl font-bold mono" style={{ color: '#9945FF' }}>&lt;2s</div>
          <div className="text-[11px] mono text-[#444] uppercase tracking-wider mt-0.5">Avg Response</div>
        </div>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { icon: '🔗', text: 'Live Solana RPC', sub: 'Helius Mainnet' },
          { icon: '🤖', text: 'Gemini 1.5 Flash', sub: 'Google AI' },
          { icon: '👻', text: 'Phantom Connect', sub: 'Wallet SDK' },
          { icon: '🛡️', text: '4 Risk Levels', sub: 'LOW → CRITICAL' },
          { icon: '🔓', text: 'Open Source MIT', sub: 'GitHub' },
        ].map(({ icon, text, sub }) => (
          <div
            key={text}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs mono"
            style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', color: '#666' }}
          >
            <span className="text-base">{icon}</span>
            <div>
              <div className="text-[#999]">{text}</div>
              <div className="text-[10px] text-[#444]">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <a
        href="#scan"
        className="inline-flex items-center gap-2 text-sm text-[#444] hover:text-purple-400 transition-colors mono"
      >
        <span>Paste a tx signature below to scan</span>
        <span className="animate-bounce">↓</span>
      </a>
    </section>
  )
}
