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

const DEMO_SIG =
  '5KtP9xzMrCGpqhQ8y7eWvN2A4bXdLmRjFsZu3YoP1TqV6wHkDnIcBgEf0aJ8sQ2mXvNrL'

export default function ScannerPanel({ prefillSig }: { prefillSig?: string }) {
  const [signature, setSignature] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (prefillSig && prefillSig.trim()) setSignature(prefillSig)
  }, [prefillSig])

  const handleScan = async (sig?: string) => {
    const target = sig || signature
    if (!target.trim()) return
    setIsLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: target.trim() }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setResult(data)
    } catch {
      setError('Failed to analyze transaction. Please check the signature and try again.')
    }
    setIsLoading(false)
  }

  const handleShare = () => {
    if (!result) return
    const shortSig = signature.slice(0, 8) + '...' + signature.slice(-8)
    const redFlagsCount = Array.isArray(result.redFlags) ? result.redFlags.length : 0
    const text =
      `🛡️ AI-Sentinel Transaction Scan\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `Signature: ${shortSig}\n` +
      `Risk Score: ${result.riskScore}/100\n` +
      `Verdict: ${result.verdict}\n` +
      `${redFlagsCount > 0 ? '⚠️ ' + redFlagsCount + ' red flags detected' : '✅ No red flags found'}\n` +
      `Recommendation: ${result.recommendation}\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `Scan yours free: https://ai-sentinel-three.vercel.app\n` +
      `Built for @colosseum Frontier Hackathon 2026 | @GopichandAI`
    try {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } catch {}
  }

  const verdictColor = result
    ? VERDICT_COLORS[result.verdict] || '#94A3B8'
    : '#94A3B8'

  return (
    <div>
      {/* Input card */}
      <div
        className="rounded-2xl border border-[#1e1e2e] p-6"
        style={{ backgroundColor: '#111118' }}
      >
        <h2 className="text-xl font-bold mb-1" style={{ color: '#F8FAFC' }}>
          🔍 Transaction Scanner
        </h2>
        <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>
          Paste any Solana transaction signature to get an instant AI risk analysis
        </p>
        <div className="flex gap-3">
          <input
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Paste transaction signature..."
            className="flex-1 px-4 py-3 rounded-xl border border-[#1e1e2e] text-sm outline-none focus:border-[#9945FF] transition-colors"
            style={{ backgroundColor: '#0a0a0f', color: '#F8FAFC' }}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
          />
          <button
            onClick={() => handleScan()}
            disabled={isLoading || !signature.trim()}
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #9945FF, #7c3aed)',
              color: '#fff',
            }}
          >
            {isLoading ? 'Scanning...' : 'Scan'}
          </button>
        </div>

        <button
          onClick={() => {
            setSignature(DEMO_SIG)
            handleScan(DEMO_SIG)
          }}
          className="mt-2 text-xs transition-colors"
          style={{ color: '#94A3B8' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#9945FF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
        >
          Try Demo Transaction →
        </button>

        {isLoading && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: '#9945FF',
                    animationDelay: i * 0.15 + 's',
                  }}
                />
              ))}
            </div>
            <span className="text-sm" style={{ color: '#9945FF' }}>
              AI is analyzing the transaction...
            </span>
          </div>
        )}

        {error && (
          <p className="mt-3 text-sm" style={{ color: '#EF4444' }}>
            {error}
          </p>
        )}
      </div>

      {/* Result card */}
      {result && (
        <div
          className="mt-4 rounded-2xl border p-6 animate-slide-in"
          style={{
            backgroundColor: '#111118',
            borderColor: verdictColor + '40',
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: verdictColor + '20',
                  color: verdictColor,
                }}
              >
                {result.verdict}
              </span>
              <div
                className="text-4xl font-extrabold mt-2"
                style={{ color: verdictColor }}
              >
                {result.riskScore}
                <span className="text-lg">/100</span>
              </div>
              <div className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                Risk Score
              </div>
            </div>
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl text-sm border border-[#1e1e2e] transition-colors"
              style={{ color: '#94A3B8' }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = 'rgba(153,69,255,0.6)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = '#1e1e2e')
              }
            >
              {copied ? '✅ Copied!' : '📤 Share Result'}
            </button>
          </div>

          {Array.isArray(result.redFlags) && result.redFlags.length > 0 && (
            <div className="mb-4">
              <div
                className="text-xs font-bold mb-2"
                style={{ color: '#EF4444' }}
              >
                ⚠️ RED FLAGS ({result.redFlags.length})
              </div>
              <ul className="space-y-1">
                {result.redFlags.map((f: string, i: number) => (
                  <li
                    key={i}
                    className="text-sm flex items-start gap-2"
                    style={{ color: '#94A3B8' }}
                  >
                    <span style={{ color: '#EF4444' }}>•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.explanation && (
            <div
              className="mb-4 p-4 rounded-xl border border-[#1e1e2e]"
              style={{ backgroundColor: '#0a0a0f' }}
            >
              <div
                className="text-xs font-bold mb-2"
                style={{ color: '#9945FF' }}
              >
                🧠 AI ANALYSIS
              </div>
              <p className="text-sm" style={{ color: '#94A3B8' }}>
                {result.explanation}
              </p>
            </div>
          )}

          {result.recommendation && (
            <div
              className="p-4 rounded-xl border border-[#14F195]/20"
              style={{ backgroundColor: 'rgba(20,241,149,0.05)' }}
            >
              <div
                className="text-xs font-bold mb-1"
                style={{ color: '#14F195' }}
              >
                💡 RECOMMENDATION
              </div>
              <p className="text-sm" style={{ color: '#F8FAFC' }}>
                {result.recommendation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* AI Chat — shown after scan */}
      {result && (
        <TransactionChat analysisResult={result} signature={signature} />
      )}
    </div>
  )
}
