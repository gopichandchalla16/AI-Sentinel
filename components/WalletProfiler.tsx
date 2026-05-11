"use client"
import { useState } from 'react'

const DEMO_WALLET = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'

interface RecentTx {
  signature: string
  blockTime: number
  riskScore: number
  verdict: string
}

interface WalletProfile {
  walletAddress: string
  overallRiskScore: number
  overallVerdict: string
  totalTxsAnalyzed: number
  recentTxs: RecentTx[]
  riskBreakdown: { safeTxs: number; cautionTxs: number; highRiskTxs: number }
  topPrograms: string[]
  aiSummary: string
  recommendation: string
  walletAge: string
}

const VERDICT_COLORS: Record<string, string> = {
  CLEAN: '#14F195',
  CAUTIOUS: '#F59E0B',
  RISKY: '#F97316',
  DANGEROUS: '#EF4444',
}

function timeAgo(blockTime: number) {
  const diff = Math.floor((Date.now() / 1000) - blockTime)
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
  return Math.floor(diff / 86400) + 'd ago'
}

export default function WalletProfiler() {
  const [walletAddress, setWalletAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<WalletProfile | null>(null)
  const [error, setError] = useState('')
  const [loadingStage, setLoadingStage] = useState('')

  const handleScan = async (addr?: string) => {
    const target = addr || walletAddress
    if (!target.trim()) return
    setIsLoading(true)
    setError('')
    setProfile(null)
    setLoadingStage('Fetching wallet history from Solana mainnet...')
    try {
      const res = await fetch('/api/wallet-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: target.trim() }),
      })
      setLoadingStage('Running AI behavioral analysis...')
      const data = await res.json()
      if (data.error) setError(data.error)
      else setProfile(data)
    } catch {
      setError('Failed to profile wallet. Please try again.')
    }
    setIsLoading(false)
    setLoadingStage('')
  }

  const verdictColor = profile ? (VERDICT_COLORS[profile.overallVerdict] || '#94A3B8') : '#94A3B8'
  const total = profile ? Math.max(profile.totalTxsAnalyzed, 1) : 1

  return (
    <div>
      <div className="rounded-2xl border border-[#1e1e2e] p-6" style={{ backgroundColor: '#111118' }}>
        <h2 className="text-xl font-bold mb-1" style={{ color: '#F8FAFC' }}>👛 Wallet Address Risk Profiler</h2>
        <p className="text-sm mb-4" style={{ color: '#94A3B8' }}>Enter any Solana wallet to generate a full AI-powered risk profile</p>
        <div className="flex gap-3">
          <input
            value={walletAddress}
            onChange={e => setWalletAddress(e.target.value)}
            placeholder="Enter wallet address (44 chars)..."
            className="flex-1 px-4 py-3 rounded-xl border border-[#1e1e2e] text-sm outline-none focus:border-[#9945FF] transition-colors"
            style={{ backgroundColor: '#0a0a0f', color: '#F8FAFC' }}
            onKeyDown={e => e.key === 'Enter' && handleScan()}
          />
          <button
            onClick={() => handleScan()}
            disabled={isLoading || !walletAddress.trim()}
            className="px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #9945FF, #7c3aed)', color: '#fff' }}
          >
            {isLoading ? 'Scanning...' : 'Scan'}
          </button>
        </div>
        <button
          onClick={() => { setWalletAddress(DEMO_WALLET); handleScan(DEMO_WALLET) }}
          className="mt-2 text-xs hover:text-[#9945FF] transition-colors"
          style={{ color: '#94A3B8' }}
        >
          Try Demo Wallet →
        </button>
        {isLoading && loadingStage && (
          <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: '#9945FF' }}>
            <div className="w-2 h-2 rounded-full bg-[#9945FF] animate-pulse" />
            {loadingStage}
          </div>
        )}
        {error && <p className="mt-3 text-sm" style={{ color: '#EF4444' }}>{error}</p>}
      </div>

      {profile && (
        <div className="mt-4 rounded-2xl border p-6 animate-slide-in" style={{ backgroundColor: '#111118', borderColor: verdictColor + '40' }}>
          <div className="flex items-start gap-6 mb-6">
            <div className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center border-4" style={{ borderColor: verdictColor, backgroundColor: verdictColor + '15' }}>
              <span className="text-2xl font-extrabold" style={{ color: verdictColor }}>{profile.overallRiskScore}</span>
            </div>
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: verdictColor + '20', color: verdictColor }}>
                {profile.overallVerdict}
              </span>
              <p className="text-sm mt-2" style={{ color: '#94A3B8' }}>{profile.walletAddress.slice(0, 8)}...{profile.walletAddress.slice(-8)}</p>
              <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{profile.walletAge} · {profile.totalTxsAnalyzed} txs analyzed</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-xs font-bold mb-2" style={{ color: '#94A3B8' }}>📊 RISK BREAKDOWN</div>
            <div className="w-full h-3 rounded-full overflow-hidden flex" style={{ backgroundColor: '#1e1e2e' }}>
              <div style={{ width: (profile.riskBreakdown.safeTxs / total * 100) + '%', backgroundColor: '#14F195' }} />
              <div style={{ width: (profile.riskBreakdown.cautionTxs / total * 100) + '%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: (profile.riskBreakdown.highRiskTxs / total * 100) + '%', backgroundColor: '#EF4444' }} />
            </div>
            <div className="flex gap-4 mt-2 text-xs" style={{ color: '#94A3B8' }}>
              <span>✅ {profile.riskBreakdown.safeTxs} Safe</span>
              <span>⚠️ {profile.riskBreakdown.cautionTxs} Caution</span>
              <span>🔴 {profile.riskBreakdown.highRiskTxs} High Risk</span>
            </div>
          </div>

          {profile.recentTxs.length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-bold mb-2" style={{ color: '#94A3B8' }}>📋 RECENT TRANSACTIONS</div>
              <div className="space-y-2">
                {profile.recentTxs.slice(0, 5).map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-[#1e1e2e] text-sm" style={{ backgroundColor: '#0a0a0f' }}>
                    <span style={{ color: '#94A3B8', fontFamily: 'monospace' }}>{tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}</span>
                    <span style={{ color: '#94A3B8' }}>{timeAgo(tx.blockTime)}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: VERDICT_COLORS[tx.verdict] || '#94A3B8', backgroundColor: (VERDICT_COLORS[tx.verdict] || '#94A3B8') + '20' }}>{tx.verdict}</span>
                    <span style={{ color: '#94A3B8' }}>Score: {tx.riskScore}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.aiSummary && (
            <div className="mb-4 p-4 rounded-xl border border-[#1e1e2e]" style={{ backgroundColor: '#0a0a0f' }}>
              <div className="text-xs font-bold mb-2" style={{ color: '#9945FF' }}>🔮 AI WALLET SUMMARY</div>
              <p className="text-sm" style={{ color: '#94A3B8' }}>{profile.aiSummary}</p>
            </div>
          )}

          {profile.recommendation && (
            <div className="p-4 rounded-xl border border-[#14F195]/20" style={{ backgroundColor: 'rgba(20,241,149,0.05)' }}>
              <div className="text-xs font-bold mb-1" style={{ color: '#14F195' }}>💡 RECOMMENDATION</div>
              <p className="text-sm" style={{ color: '#F8FAFC' }}>{profile.recommendation}</p>
            </div>
          )}

          {profile.topPrograms && profile.topPrograms.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-bold mb-2" style={{ color: '#94A3B8' }}>🔗 TOP PROGRAMS USED</div>
              <div className="flex flex-wrap gap-2">
                {profile.topPrograms.map((p, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-lg border border-[#1e1e2e]" style={{ color: '#94A3B8', backgroundColor: '#0a0a0f' }}>{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
