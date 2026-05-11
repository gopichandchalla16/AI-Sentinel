"use client"
import { useState, useEffect } from 'react'
import TransactionChat from './TransactionChat'

const VERDICT_COLORS: Record<string, string> = {
  SAFE: '#14F195',
  CAUTION: '#F59E0B',
  HIGH_RISK: '#F97316',
  CRITICAL: '#EF4444',
  'HIGH RISK': '#F97316',
  'DO NOT SIGN': '#EF4444',
  DANGEROUS: '#EF4444',
}

const VERDICT_LABELS: Record<string, string> = {
  SAFE: '✅ SAFE',
  CAUTION: '⚠️ CAUTION',
  HIGH_RISK: '🔴 HIGH RISK',
  CRITICAL: '🚨 CRITICAL',
  'HIGH RISK': '🔴 HIGH RISK',
  'DO NOT SIGN': '🚫 DO NOT SIGN',
  DANGEROUS: '🚨 DANGEROUS',
}

const REC_LABELS: Record<string, string> = {
  SAFE_TO_PROCEED: '✅ Safe to Proceed',
  PROCEED_WITH_CAUTION: '⚠️ Proceed with Caution',
  DO_NOT_SIGN: '🚫 Do Not Sign — High Risk Detected',
}

const REAL_DEMO_SIGS = [
  '3fmRCe3E5JKbTaBXRyDWXnjjCKqe5pGCZf8i7nKQjJ6WxZwZQf2N8r9qHkLBBm9VnjqNitnUEvSmfuvfWYRBrca',
  '5Ry9KqzBkCGpqhQ8y7eWvN2A4bXdLmRjFsZu3YoP1TqV6wHkDnIcBgEf0aJ8sQ2mXvNrLtyPQs8ZcVfXhBmD3',
]

export default function ScannerPanel({ prefillSig }: { prefillSig?: string }) {
  const [signature, setSignature] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')

  const loadingMsgs = [
    '🔗 Fetching transaction from Solana mainnet...',
    '🔍 Parsing accounts, programs, token flows...',
    '🤖 Running Gemini AI threat analysis...',
    '📊 Generating security verdict...',
  ]

  useEffect(() => {
    if (prefillSig && prefillSig.trim()) setSignature(prefillSig)
  }, [prefillSig])

  const handleScan = async (sig?: string) => {
    const target = sig || signature
    if (!target.trim()) return
    setIsLoading(true)
    setError('')
    setResult(null)
    setLoadingMsg(loadingMsgs[0])
    let msgIdx = 0
    const msgTimer = setInterval(() => {
      msgIdx = Math.min(msgIdx + 1, loadingMsgs.length - 1)
      setLoadingMsg(loadingMsgs[msgIdx])
    }, 1800)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: target.trim() }),
      })
      const data = await res.json()
      clearInterval(msgTimer)
      if (data.error) setError(data.error)
      else setResult(data)
    } catch {
      clearInterval(msgTimer)
      setError('Failed to connect to AI analysis server. Please try again.')
    }
    setIsLoading(false)
  }

  const handleShare = () => {
    if (!result) return
    const shortSig = signature.slice(0, 8) + '...' + signature.slice(-8)
    const redFlagsCount = Array.isArray(result.redFlags) ? result.redFlags.length : 0
    const text = [
      '🛡️ AI-Sentinel Transaction Scan',
      '━━━━━━━━━━━━━━━━━━━',
      `Signature: ${shortSig}`,
      `Risk Score: ${result.riskScore}/100`,
      `Verdict: ${result.verdict}`,
      redFlagsCount > 0 ? `⚠️ ${redFlagsCount} red flags detected` : '✅ No red flags found',
      `Recommendation: ${result.recommendation}`,
      '━━━━━━━━━━━━━━━━━━━',
      'Scan yours free: https://ai-sentinel-three.vercel.app',
      'Built for @colosseum Frontier Hackathon 2026 | @GopichandAI',
    ].join('\n')
    try {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } catch {}
  }

  const verdictColor = result ? (VERDICT_COLORS[result.verdict] || '#94A3B8') : '#94A3B8'
  const verdictLabel = result ? (VERDICT_LABELS[result.verdict] || result.verdict) : ''
  const recLabel = result ? (REC_LABELS[result.recommendation] || result.recommendation) : ''

  const tc = result?.threatCategories || {}
  const activeThreats = Object.entries(tc).filter(([, v]) => v === true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-12px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin { to { transform:rotate(360deg) } }
        .scan-result { animation: slideDown 0.4s ease }
      `}</style>

      {/* Input Card */}
      <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#9945FF', letterSpacing: '0.12em', marginBottom: 6 }}>AI TRANSACTION FIREWALL</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#F8FAFC', marginBottom: 4 }}>🔍 Scan Any Solana Transaction</h2>
        <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 16 }}>Paste a transaction signature — our AI detects drainers, phishing, and malicious programs instantly.</p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            value={signature}
            onChange={e => setSignature(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleScan()}
            placeholder="Paste Solana transaction signature (88 chars)..."
            style={{ flex: 1, minWidth: 220, padding: '14px 16px', borderRadius: 10, border: `1px solid ${signature ? '#9945FF' : '#1e1e2e'}`, background: '#0a0a0f', color: '#F8FAFC', fontSize: 13, fontFamily: 'monospace', outline: 'none', transition: 'border-color 0.2s' }}
          />
          <button
            onClick={() => handleScan()}
            disabled={isLoading || !signature.trim()}
            style={{ padding: '14px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14, background: isLoading ? '#1e1e2e' : 'linear-gradient(135deg, #9945FF, #7c3aed)', color: isLoading ? '#94A3B8' : '#fff', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
          >
            {isLoading ? 'Analyzing...' : '🛡️ Analyze'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
          {REAL_DEMO_SIGS.map((s, i) => (
            <button key={i} onClick={() => { setSignature(s); handleScan(s) }}
              style={{ background: 'none', border: 'none', color: '#9945FF', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
              → Try Demo #{i + 1}
            </button>
          ))}
        </div>

        {isLoading && (
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(153,69,255,0.08)', borderRadius: 10, border: '1px solid rgba(153,69,255,0.2)' }}>
            <div style={{ width: 20, height: 20, border: '2px solid #9945FF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#9945FF', fontWeight: 600 }}>{loadingMsg}</span>
          </div>
        )}

        {error && (
          <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#EF4444', fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      {/* Result Card */}
      {result && (
        <div className="scan-result" style={{ background: '#111118', border: `1px solid ${verdictColor}40`, borderRadius: 16, overflow: 'hidden' }}>

          {/* Header row */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Risk score circle */}
              <div style={{ width: 80, height: 80, borderRadius: '50%', border: `3px solid ${verdictColor}`, background: verdictColor + '15', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: verdictColor, lineHeight: 1 }}>{result.riskScore}</span>
                <span style={{ fontSize: 10, color: '#94A3B8' }}>/100</span>
              </div>
              <div>
                <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 9999, background: verdictColor + '20', color: verdictColor, fontWeight: 700, fontSize: 14, border: `1px solid ${verdictColor}40`, marginBottom: 8 }}>{verdictLabel}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>Risk Score — lower is safer</div>
                {result.dataSource && <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>📡 {result.dataSource}</div>}
              </div>
            </div>
            <button onClick={handleShare}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #1e1e2e', background: '#16161f', color: '#94A3B8', cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {copied ? '✅ Copied!' : '📤 Share'}
            </button>
          </div>

          {/* AI Summary */}
          {(result.summary || result.explanation) && (
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e1e2e', background: 'rgba(153,69,255,0.04)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#9945FF', letterSpacing: '0.1em', marginBottom: 8 }}>🧠 AI ANALYSIS</div>
              <p style={{ fontSize: 14, color: '#F8FAFC', lineHeight: 1.7 }}>{result.summary || result.explanation}</p>
            </div>
          )}

          {/* Threat Categories */}
          {activeThreats.length > 0 && (
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e1e2e' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', letterSpacing: '0.1em', marginBottom: 10 }}>🚨 THREAT CATEGORIES DETECTED</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {activeThreats.map(([key]) => (
                  <span key={key} style={{ padding: '4px 12px', borderRadius: 9999, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: 12, fontWeight: 600 }}>
                    ⚠️ {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Red Flags */}
          {Array.isArray(result.redFlags) && result.redFlags.length > 0 && (
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e1e2e' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B', letterSpacing: '0.1em', marginBottom: 10 }}>⚠️ RED FLAGS ({result.redFlags.length})</div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {result.redFlags.map((f: string, i: number) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#94A3B8' }}>
                    <span style={{ color: '#F59E0B', flexShrink: 0 }}>•</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Affected Assets */}
          {Array.isArray(result.affectedAssets) && result.affectedAssets.length > 0 && (
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>AFFECTED ASSETS</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {result.affectedAssets.map((a: string, i: number) => (
                    <span key={i} style={{ padding: '2px 10px', borderRadius: 9999, background: '#1e1e2e', color: '#F8FAFC', fontSize: 12 }}>{a}</span>
                  ))}
                </div>
              </div>
              {result.estimatedLoss && (
                <div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 4 }}>ESTIMATED EXPOSURE</div>
                  <div style={{ fontSize: 13, color: '#F8FAFC', fontWeight: 600 }}>{result.estimatedLoss}</div>
                </div>
              )}
            </div>
          )}

          {/* Recommendation */}
          {result.recommendation && (
            <div style={{ padding: '16px 24px', background: result.verdict === 'SAFE' ? 'rgba(20,241,149,0.05)' : 'rgba(239,68,68,0.05)', borderTop: `1px solid ${verdictColor}25` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: verdictColor, letterSpacing: '0.1em', marginBottom: 6 }}>💡 VERDICT</div>
              <p style={{ fontSize: 15, color: '#F8FAFC', fontWeight: 700 }}>{recLabel}</p>
            </div>
          )}

          {/* Solscan link */}
          <div style={{ padding: '12px 24px', borderTop: '1px solid #1e1e2e', display: 'flex', gap: 10 }}>
            <a href={`https://solscan.io/tx/${signature}`} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: '#9945FF', textDecoration: 'none' }}>🔍 View on Solscan ↗</a>
            <a href={`https://explorer.solana.com/tx/${signature}`} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: '#94A3B8', textDecoration: 'none' }}>Solana Explorer ↗</a>
          </div>
        </div>
      )}

      {/* AI Chat */}
      {result && (
        <TransactionChat result={result} signature={signature} />
      )}
    </div>
  )
}
