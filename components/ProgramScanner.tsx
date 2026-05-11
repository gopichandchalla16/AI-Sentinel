"use client"
import { useState } from 'react'

interface ProgramResult {
  programId: string
  trustLevel: string
  trustScore: number
  isKnownProtocol: boolean
  protocolName: string
  aiAnalysis: string
  recentActivity: { totalInteractions: number; uniqueUsers: string; lastActivity: string }
  redFlags: string[]
  safeToInteract: boolean
  verificationBadge: string
}

const QUICK_PROGRAMS = [
  { label: 'Raydium', id: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8' },
  { label: 'Jupiter', id: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4' },
  { label: 'SPL Token', id: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
  { label: 'Marinade', id: 'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD' },
  { label: 'Metaplex', id: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' },
]

const TRUST_COLORS: Record<string, string> = {
  VERIFIED: '#14F195',
  UNVERIFIED: '#F59E0B',
  SUSPICIOUS: '#F97316',
  DANGEROUS: '#EF4444',
}

export default function ProgramScanner() {
  const [programId, setProgramId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ProgramResult | null>(null)
  const [error, setError] = useState('')

  const handleScan = async (id?: string) => {
    const target = id || programId
    if (!target.trim()) return
    setIsLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/program-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId: target.trim() }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setResult(data)
    } catch {
      setError('Failed to scan program. Please try again.')
    }
    setIsLoading(false)
  }

  const trustColor = result ? (TRUST_COLORS[result.trustLevel] || '#94A3B8') : '#94A3B8'

  return (
    <div>
      <div className="rounded-2xl border border-[#1e1e2e] p-6" style={{ backgroundColor: '#111118' }}>
        <h2 className="text-xl font-bold mb-1" style={{ color: '#F8FAFC' }}>🔬 Program / dApp Scanner</h2>
        <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>Verify any Solana smart contract before interacting</p>
        <div className="flex gap-3">
          <input
            value={programId}
            onChange={e => setProgramId(e.target.value)}
            placeholder="Paste Solana Program ID..."
            className="flex-1 px-4 py-3 rounded-xl border border-[#1e1e2e] text-sm outline-none focus:border-[#9945FF] transition-colors"
            style={{ backgroundColor: '#0a0a0f', color: '#F8FAFC' }}
            onKeyDown={e => e.key === 'Enter' && handleScan()}
          />
          <button
            onClick={() => handleScan()}
            disabled={isLoading || !programId.trim()}
            className="px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #9945FF, #7c3aed)', color: '#fff' }}
          >
            {isLoading ? 'Scanning...' : 'Scan Program'}
          </button>
        </div>

        <div className="mt-3">
          <p className="text-xs mb-2" style={{ color: '#94A3B8' }}>📚 Known Safe Programs (quick-scan):</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROGRAMS.map(p => (
              <button
                key={p.id}
                onClick={() => { setProgramId(p.id); handleScan(p.id) }}
                className="px-3 py-1 rounded-full border border-[#1e1e2e] text-sm transition-colors hover:border-[#9945FF] hover:text-[#9945FF]"
                style={{ backgroundColor: '#111118', color: '#94A3B8' }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="mt-3 text-sm" style={{ color: '#EF4444' }}>{error}</p>}
      </div>

      {result && (
        <div className="mt-4 rounded-2xl border p-6 animate-slide-in" style={{ backgroundColor: '#111118', borderColor: trustColor + '40' }}>
          <div className="flex items-start gap-6 mb-6">
            <div className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center border-4" style={{ borderColor: trustColor, backgroundColor: trustColor + '15' }}>
              <span className="text-2xl font-extrabold" style={{ color: trustColor }}>{result.trustScore}</span>
            </div>
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: trustColor + '20', color: trustColor }}>
                {result.verificationBadge}
              </span>
              <div className="font-bold mt-2" style={{ color: '#F8FAFC' }}>{result.protocolName}</div>
              <p className="text-xs mt-1" style={{ color: '#94A3B8', fontFamily: 'monospace' }}>{result.programId.slice(0, 8)}...{result.programId.slice(-8)}</p>
            </div>
          </div>

          <div className="mb-4 p-3 rounded-xl border border-[#1e1e2e]" style={{ backgroundColor: '#0a0a0f' }}>
            <div className="text-xs font-bold mb-1" style={{ color: '#94A3B8' }}>📊 ACTIVITY STATS</div>
            <p className="text-sm" style={{ color: '#94A3B8' }}>
              {result.recentActivity.totalInteractions} interactions checked
              {result.recentActivity.lastActivity && ` · Last: ${result.recentActivity.lastActivity}`}
            </p>
          </div>

          {result.aiAnalysis && (
            <div className="mb-4 p-4 rounded-xl border border-[#1e1e2e]" style={{ backgroundColor: '#0a0a0f' }}>
              <div className="text-xs font-bold mb-2" style={{ color: '#9945FF' }}>🔮 AI ASSESSMENT</div>
              <p className="text-sm" style={{ color: '#94A3B8' }}>{result.aiAnalysis}</p>
            </div>
          )}

          {result.redFlags && result.redFlags.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-bold mb-2" style={{ color: '#EF4444' }}>⚠️ RED FLAGS</div>
              <ul className="space-y-1">
                {result.redFlags.map((f: string, i: number) => (
                  <li key={i} className="text-sm" style={{ color: '#94A3B8' }}><span style={{ color: '#EF4444' }}>•</span> {f}</li>
                ))}
              </ul>
            </div>
          )}

          <div className={`p-4 rounded-xl border ${result.safeToInteract ? 'border-[#14F195]/20' : 'border-[#EF4444]/20'}`}
            style={{ backgroundColor: result.safeToInteract ? 'rgba(20,241,149,0.05)' : 'rgba(239,68,68,0.05)' }}>
            <p className="font-semibold text-sm" style={{ color: result.safeToInteract ? '#14F195' : '#EF4444' }}>
              {result.safeToInteract ? '✅ Safe to Interact' : '❌ Exercise Caution'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
