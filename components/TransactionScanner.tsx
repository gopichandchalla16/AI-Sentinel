"use client"
import { useState, useEffect } from 'react'
import TransactionChat from './TransactionChat'

const VERDICT_COLORS: Record<string, string> = {
  SAFE: '#14F195',
  CAUTION: '#F59E0B',
  'HIGH RISK': '#F97316',
  DANGEROUS: '#EF4444',
  'DO NOT SIGN': '#EF4444',
}

export default function TransactionScanner({ prefillSig }: { prefillSig?: string }) {
  const [signature, setSignature] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (prefillSig) setSignature(prefillSig)
  }, [prefillSig])

  const handleScan = async () => {
    if (!signature.trim()) return
    setIsLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: signature.trim() }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setResult(data)
    } catch (e) {
      setError('Failed to analyze transaction. Please try again.')
    }
    setIsLoading(false)
  }

  const handleShare = () => {
    if (!result) return
    const shortSig = signature.slice(0, 8) + '...' + signature.slice(-8)
    const redFlagsCount = result.redFlags?.length || 0
    const text = `🛡️ AI-Sentinel Transaction Scan\n━━━━━━━━━━━━━━━━━━━\nSignature: ${shortSig}\nRisk Score: ${result.riskScore}/100\nVerdict: ${result.verdict}\n${redFlagsCount > 0 ? '⚠️ ' + redFlagsCount + ' red flags detected' : '✅ No red flags found'}\nRecommendation: ${result.recommendation}\n━━━━━━━━━━━━━━━━━━━\nScan yours free: https://ai-sentinel-three.vercel.app\nBuilt for @colosseum Frontier Hackathon 2026 | @GopichandAI`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const verdictColor = result ? (VERDICT_COLORS[result.verdict] || '#94A3B8') : '#94A3B8'

  return (
    <div>
      <div className="rounded-2xl border border-[#1e1e2e] p-6" style={{ backgroundColor: '#111118' }}>
        <h2 className="text-xl font-bold mb-1" style={{ color: '#F8FAFC' }}>🔍 Transaction Scanner</h2>
        <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>Paste any Solana transaction signature to get an instant AI risk analysis</p>
        <div className="flex gap-3">
          <input
            value={signature}
            onChange={e => setSignature(e.target.value)}
            placeholder="Paste transaction signature (88 chars)..."
            className="flex-1 px-4 py-3 rounded-xl border border-[#1e1e2e] text-sm outline-none focus:border-[#9945FF] transition-colors"
            style={{ backgroundColor: '#0a0a0f', color: '#F8FAFC' }}
            onKeyDown={e => e.key === 'Enter' && handleScan()}
          />
          <button
            onClick={handleScan}
            disabled={isLoading || !signature.trim()}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #9945FF, #7c3aed)', color: '#fff' }}
          >
            {isLoading ? 'Scanning...' : 'Scan'}
          </button>
        </div>
        {error && <p className="mt-3 text-sm" style={{ color: '#EF4444' }}>{error}</p>}
      </div>

      {result && (
        <div className="mt-4 rounded-2xl border p-6 animate-slide-in" style={{ backgroundColor: '#111118', borderColor: verdictColor + '40' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: verdictColor + '20', color: verdictColor }}>
                {result.verdict}
              </span>
              <div className="text-4xl font-extrabold mt-2" style={{ color: verdictColor }}>{result.riskScore}<span className="text-lg">/100</span></div>
              <div className="text-sm mt-1" style={{ color: '#94A3B8' }}>Risk Score</div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleShare} className="px-4 py-2 rounded-xl text-sm border border-[#1e1e2e] transition-colors hover:border-[#9945FF]/60" style={{ color: '#94A3B8' }}>
                {copied ? '✅ Copied!' : '📤 Share Result'}
              </button>
            </div>
          </div>

          {result.redFlags && result.redFlags.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-bold mb-2" style={{ color: '#EF4444' }}>⚠️ RED FLAGS ({result.redFlags.length})</div>
              <ul className="space-y-1">
                {result.redFlags.map((f: string, i: number) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#94A3B8' }}>
                    <span style={{ color: '#EF4444' }}>•</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.explanation && (
            <div className="mb-4 p-4 rounded-xl border border-[#1e1e2e]" style={{ backgroundColor: '#0a0a0f' }}>
              <div className="text-xs font-bold mb-2" style={{ color: '#9945FF' }}>🧠 AI ANALYSIS</div>
              <p className="text-sm" style={{ color: '#94A3B8' }}>{result.explanation}</p>
            </div>
          )}

          {result.recommendation && (
            <div className="p-4 rounded-xl border border-[#14F195]/20" style={{ backgroundColor: 'rgba(20,241,149,0.05)' }}>
              <div className="text-xs font-bold mb-1" style={{ color: '#14F195' }}>💡 RECOMMENDATION</div>
              <p className="text-sm" style={{ color: '#F8FAFC' }}>{result.recommendation}</p>
            </div>
          )}
        </div>
      )}

      {result && <TransactionChat analysisResult={result} signature={signature} />}
    </div>
  )
}
