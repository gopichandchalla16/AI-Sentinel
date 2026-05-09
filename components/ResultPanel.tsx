'use client'
import { useState } from 'react'
import type { AnalysisResult } from '@/app/page'

interface Props {
  result: AnalysisResult
  signature: string
}

const RISK_MAP = {
  LOW:      { cls: 'risk-low',      icon: '✅', label: 'LOW RISK',      barColor: '#14F195', pct: 15 },
  MEDIUM:   { cls: 'risk-medium',   icon: '⚡', label: 'MEDIUM RISK',   barColor: '#FFC107', pct: 45 },
  HIGH:     { cls: 'risk-high',     icon: '⚠️', label: 'HIGH RISK',     barColor: '#FF6B35', pct: 72 },
  CRITICAL: { cls: 'risk-critical', icon: '🚨', label: 'CRITICAL RISK', barColor: '#FF3232', pct: 95 },
}

export default function ResultPanel({ result, signature }: Props) {
  const [copied, setCopied] = useState(false)
  const cfg = RISK_MAP[result.risk]
  const { txDetails: tx } = result

  const copy = () => {
    navigator.clipboard.writeText(signature)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTs = (ts?: number) =>
    ts ? new Date(ts * 1000).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

  const formatLamports = (l?: number) =>
    l ? `${l.toLocaleString()} lamports (~${(l / 1e9).toFixed(6)} SOL)` : '—'

  return (
    <div className="mt-5 space-y-4 animate-slide-up">
      {/* ── Risk Score Card ── */}
      <div className="card" style={{ background: '#0f0f0f' }}>
        <div className="flex items-start gap-4">
          <div className="text-4xl mt-0.5">{cfg.icon}</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold mono ${cfg.cls}`}>
                {cfg.label}
              </span>
              {tx?.err && (
                <span className="px-2 py-0.5 rounded text-[11px] mono" style={{ background: 'rgba(255,50,50,0.12)', border: '1px solid rgba(255,50,50,0.3)', color: '#ff6b6b' }}>
                  TX FAILED ON-CHAIN
                </span>
              )}
            </div>
            {/* Risk bar */}
            <div className="h-1.5 rounded-full mb-3" style={{ background: '#1e1e1e' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${cfg.pct}%`, background: cfg.barColor, boxShadow: `0 0 8px ${cfg.barColor}88` }}
              />
            </div>
            <p className="text-[#ccc] text-sm leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* ── Recommendation ── */}
      <div className="card">
        <h3 className="text-[11px] mono text-[#555] uppercase tracking-widest mb-3">🎯 Recommendation</h3>
        <p className="text-white text-sm leading-relaxed">{result.recommendation}</p>
      </div>

      {/* ── Security Flags ── */}
      {result.flags.length > 0 && (
        <div className="card">
          <h3 className="text-[11px] mono text-[#555] uppercase tracking-widest mb-3">🚩 Security Flags</h3>
          <ul className="space-y-2">
            {result.flags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 shrink-0" style={{ color: cfg.barColor }}>{'LOW' === result.risk ? '✓' : '•'}</span>
                <span className="text-[#bbb]">{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── On-Chain Details ── */}
      {tx && (
        <div className="card">
          <h3 className="text-[11px] mono text-[#555] uppercase tracking-widest mb-4">📊 On-Chain Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { label: 'Fee Paid',       value: formatLamports(tx.fee) },
              { label: 'Block Time',     value: formatTs(tx.blockTime) },
              { label: 'Slot',           value: tx.slot ? `#${tx.slot.toLocaleString()}` : '—' },
              { label: 'Dest. Balance',  value: tx.destBalance !== undefined ? `${tx.destBalance.toFixed(4)} SOL` : '—' },
              { label: 'Dest. Tx Count', value: tx.destHistory !== undefined ? `${tx.destHistory} recent` : '—' },
              { label: 'On-chain Status',value: tx.err ? '❌ Failed' : '✅ Confirmed' },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-lg" style={{ background: '#0d0d0d', border: '1px solid #1e1e1e' }}>
                <div className="text-[10px] mono text-[#444] uppercase tracking-wider mb-1">{label}</div>
                <div className="text-xs mono text-[#bbb] break-all">{value}</div>
              </div>
            ))}
          </div>

          {/* Accounts */}
          {tx.accounts && tx.accounts.length > 0 && (
            <div className="mt-4">
              <div className="text-[10px] mono text-[#444] uppercase tracking-wider mb-2">Account Keys Involved</div>
              <div className="space-y-1.5">
                {tx.accounts.map((acc, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] mono text-[#333] w-5 shrink-0">[{i}]</span>
                    <a
                      href={`https://solscan.io/account/${acc}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] mono text-purple-400/60 hover:text-purple-300 transition-colors truncate"
                      title={acc}
                    >
                      {acc}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Signature ── */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[11px] mono text-[#555] uppercase tracking-widest">🔗 Signature</h3>
          <div className="flex gap-2">
            <button
              onClick={copy}
              className="text-[11px] mono px-2 py-1 rounded transition-colors"
              style={{ color: copied ? '#14F195' : '#555', border: '1px solid #222' }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <a
              href={`https://solscan.io/tx/${signature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] mono px-2 py-1 rounded transition-colors"
              style={{ color: '#9945FF', border: '1px solid rgba(153,69,255,0.2)' }}
            >
              Solscan ↗
            </a>
          </div>
        </div>
        <p className="text-[11px] mono break-all" style={{ color: '#444' }}>{signature}</p>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[11px] mono px-4" style={{ color: '#333' }}>
        ⚠ For informational purposes only. Not financial advice. Always verify independently.
      </p>
    </div>
  )
}
