'use client'
import { useState, useEffect } from 'react'
import type { AnalysisResult } from '@/app/types'

interface Props {
  result: AnalysisResult
  signature: string
}

const RISK_MAP = {
  LOW:      { icon: '✅', label: 'LOW RISK',      barColor: '#14F195', pct: 15, glow: 'rgba(20,241,149,0.15)',  cls: 'risk-low' },
  MEDIUM:   { icon: '⚡', label: 'MEDIUM RISK',   barColor: '#FFC107', pct: 48, glow: 'rgba(255,193,7,0.15)',   cls: 'risk-medium' },
  HIGH:     { icon: '⚠️', label: 'HIGH RISK',     barColor: '#FF6B35', pct: 73, glow: 'rgba(255,107,53,0.15)',  cls: 'risk-high' },
  CRITICAL: { icon: '🚨', label: 'CRITICAL RISK', barColor: '#FF3232', pct: 96, glow: 'rgba(255,50,50,0.18)',   cls: 'risk-critical' },
}

export default function ResultPanel({ result, signature }: Props) {
  const [copied, setCopied] = useState(false)
  const [barWidth, setBarWidth] = useState(0)
  // Use riskLevel (matches API response field name)
  const riskKey = result.riskLevel as keyof typeof RISK_MAP
  const cfg = RISK_MAP[riskKey] ?? RISK_MAP['LOW']

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(result.riskScore), 120)
    return () => clearTimeout(t)
  }, [result.riskScore])

  const copy = () => {
    navigator.clipboard.writeText(signature)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-5 space-y-3 animate-slide-up">

      {/* ── Risk Score Card ── */}
      <div
        className="card relative overflow-hidden"
        style={{ boxShadow: `0 0 40px ${cfg.glow}, 0 0 0 1px ${cfg.barColor}22` }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${cfg.glow}, transparent 70%)` }} />

        <div className="relative flex items-start gap-4">
          <div className="text-4xl mt-0.5 select-none">{cfg.icon}</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold mono ${cfg.cls}`}>
                {cfg.label}
              </span>
            </div>

            {/* Animated risk bar */}
            <div className="h-2 rounded-full mb-3 overflow-hidden" style={{ background: '#111' }}>
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${barWidth}%`,
                  background: `linear-gradient(90deg, ${cfg.barColor}99, ${cfg.barColor})`,
                  boxShadow: `0 0 12px ${cfg.barColor}88`
                }}
              />
            </div>

            {/* Score */}
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: cfg.barColor, fontFamily: 'JetBrains Mono', lineHeight: 1, marginBottom: 8 }}>
              {result.riskScore}<span style={{ fontSize: '1rem', color: '#555' }}>/100</span>
            </div>

            <p className="text-[#ccc] text-sm leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* ── Recommendation ── */}
      <div className="card">
        <h3 className="text-[10px] mono text-[#444] uppercase tracking-widest mb-2.5">🎯 Recommendation</h3>
        <p
          className="text-sm leading-relaxed font-medium"
          style={{ color: result.riskLevel === 'LOW' ? '#14F195' : result.riskLevel === 'CRITICAL' ? '#FF6B6B' : '#f0f0f0' }}
        >
          {result.recommendation}
        </p>
      </div>

      {/* ── Red Flags ── */}
      {result.redFlags && result.redFlags.length > 0 && (
        <div className="card">
          <h3 className="text-[10px] mono text-[#444] uppercase tracking-widest mb-3">🚩 Security Flags Detected</h3>
          <ul className="space-y-2">
            {result.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 shrink-0 text-sm" style={{ color: cfg.barColor }}>
                  {result.riskLevel === 'LOW' ? '✓' : '▸'}
                </span>
                <span className="text-[#aaa] leading-relaxed">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Programs Involved ── */}
      {result.programsInvolved && result.programsInvolved.length > 0 && (
        <div className="card">
          <h3 className="text-[10px] mono text-[#444] uppercase tracking-widest mb-3">⚙️ Programs Involved</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {result.programsInvolved.map((p, i) => (
              <span key={i} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(153,69,255,0.1)', color: '#c4b5fd', border: '1px solid rgba(153,69,255,0.2)', fontSize: '0.72rem', fontFamily: 'monospace' }}>{p}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Transfer Details ── */}
      {result.transferDetails && (
        <div className="card">
          <h3 className="text-[10px] mono text-[#444] uppercase tracking-widest mb-2.5">💸 Transfer Details</h3>
          <p className="text-sm text-[#aaa] leading-relaxed">{result.transferDetails}</p>
        </div>
      )}

      {/* ── Signature + Actions ── */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] mono text-[#444] uppercase tracking-widest">🔗 Transaction Signature</h3>
          <div className="flex gap-2">
            <button
              onClick={copy}
              className="text-[11px] mono px-2.5 py-1 rounded-lg transition-all"
              style={{ color: copied ? '#14F195' : '#555', border: `1px solid ${copied ? 'rgba(20,241,149,0.3)' : '#222'}`, background: copied ? 'rgba(20,241,149,0.05)' : 'transparent' }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <a
              href={`https://solscan.io/tx/${signature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] mono px-2.5 py-1 rounded-lg transition-colors"
              style={{ color: '#9945FF', border: '1px solid rgba(153,69,255,0.25)', background: 'rgba(153,69,255,0.05)' }}
            >
              View on Solscan ↗
            </a>
          </div>
        </div>
        <p className="text-[11px] mono break-all leading-relaxed" style={{ color: '#333' }}>{signature}</p>
      </div>

      {/* Scan metadata */}
      <p className="text-center text-[11px] mono px-4" style={{ color: '#2a2a2a' }}>
        ⚡ Analyzed in {result.analysisTime}ms · {result.aiModel}
      </p>

      {/* Disclaimer */}
      <p className="text-center text-[10px] mono px-4 pb-2" style={{ color: '#1e1e1e' }}>
        ⚠ AI analysis for informational purposes only. Not financial advice. Always verify independently.
      </p>
    </div>
  )
}
