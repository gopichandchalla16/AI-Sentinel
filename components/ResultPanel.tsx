'use client'
import { useState, useEffect } from 'react'
import type { AnalysisResult } from '@/app/page'

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
  const cfg = RISK_MAP[result.risk]
  const { txDetails: tx } = result

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(cfg.pct), 120)
    return () => clearTimeout(t)
  }, [cfg.pct])

  const copy = () => {
    navigator.clipboard.writeText(signature)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTs = (ts?: number) =>
    ts ? new Date(ts * 1000).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

  const formatLamports = (l?: number) =>
    l ? `${l.toLocaleString()} (${(l / 1e9).toFixed(6)} SOL)` : '—'

  return (
    <div className="mt-5 space-y-3 animate-slide-up">

      {/* ── Risk Score Card ── */}
      <div
        className="card relative overflow-hidden"
        style={{ boxShadow: `0 0 40px ${cfg.glow}, 0 0 0 1px ${cfg.barColor}22` }}
      >
        {/* Background glow blob */}
        <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${cfg.glow}, transparent 70%)` }} />

        <div className="relative flex items-start gap-4">
          <div className="text-4xl mt-0.5 select-none">{cfg.icon}</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold mono ${cfg.cls}`}>
                {cfg.label}
              </span>
              {tx?.err && (
                <span className="px-2 py-0.5 rounded text-[11px] mono" style={{ background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.25)', color: '#ff6b6b' }}>
                  TX FAILED ON-CHAIN
                </span>
              )}
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

            <p className="text-[#ccc] text-sm leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* ── Recommendation ── */}
      <div className="card">
        <h3 className="text-[10px] mono text-[#444] uppercase tracking-widest mb-2.5">🎯 Recommendation</h3>
        <p
          className="text-sm leading-relaxed font-medium"
          style={{ color: result.risk === 'LOW' ? '#14F195' : result.risk === 'CRITICAL' ? '#FF6B6B' : '#f0f0f0' }}
        >
          {result.recommendation}
        </p>
      </div>

      {/* ── Security Flags ── */}
      {result.flags.length > 0 && (
        <div className="card">
          <h3 className="text-[10px] mono text-[#444] uppercase tracking-widest mb-3">🚩 Security Flags Detected</h3>
          <ul className="space-y-2">
            {result.flags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 shrink-0 text-sm" style={{ color: cfg.barColor }}>
                  {result.risk === 'LOW' ? '✓' : '▸'}
                </span>
                <span className="text-[#aaa] leading-relaxed">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── On-Chain Intelligence ── */}
      {tx && (
        <div className="card">
          <h3 className="text-[10px] mono text-[#444] uppercase tracking-widest mb-4">📊 On-Chain Intelligence</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: 'Network Fee',     value: formatLamports(tx.fee),                              icon: '⛽' },
              { label: 'Block Time',      value: formatTs(tx.blockTime),                               icon: '🕐' },
              { label: 'Slot',            value: tx.slot ? `#${tx.slot.toLocaleString()}` : '—',       icon: '🔢' },
              { label: 'Dest. Balance',   value: tx.destBalance !== undefined ? `${tx.destBalance.toFixed(4)} SOL` : '—', icon: '💰' },
              { label: 'Dest. Tx History',value: tx.destHistory !== undefined ? `${tx.destHistory} txns` : '—',           icon: '📜' },
              { label: 'Chain Status',    value: tx.err ? '❌ Failed' : '✅ Confirmed',                icon: '🔗' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="p-3 rounded-xl flex flex-col gap-1" style={{ background: '#0d0d0d', border: '1px solid #1a1a1a' }}>
                <div className="text-[10px] mono text-[#333] uppercase tracking-wider flex items-center gap-1">
                  <span>{icon}</span><span>{label}</span>
                </div>
                <div className="text-xs mono text-[#bbb] break-all leading-tight">{value}</div>
              </div>
            ))}
          </div>

          {/* Account Keys */}
          {tx.accounts && tx.accounts.length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] mono text-[#333] uppercase tracking-wider mb-2.5">🔑 Accounts Involved</div>
              <div className="space-y-1.5">
                {tx.accounts.map((acc, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: '#0a0a0a', border: '1px solid #161616' }}>
                    <span className="text-[10px] mono shrink-0 px-1.5 py-0.5 rounded" style={{ background: i === 0 ? 'rgba(153,69,255,0.15)' : '#111', color: i === 0 ? '#9945FF' : '#444' }}>
                      {i === 0 ? 'SIGNER' : `[${i}]`}
                    </span>
                    <a
                      href={`https://solscan.io/account/${acc}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] mono text-purple-400/50 hover:text-purple-300 transition-colors truncate flex-1"
                      title={acc}
                    >
                      {acc}
                    </a>
                    <span className="text-[10px] text-[#333] mono shrink-0">↗</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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

      {/* Disclaimer */}
      <p className="text-center text-[11px] mono px-4 pb-2" style={{ color: '#2a2a2a' }}>
        ⚠ AI analysis for informational purposes. Not financial advice. Always verify independently.
      </p>
    </div>
  )
}
