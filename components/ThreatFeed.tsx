"use client"
import { useState, useEffect, useCallback } from 'react'

interface ThreatItem {
  id: string
  signature: string
  shortSig: string
  timestamp: Date
  riskScore: number
  verdict: string
  threatType: string
  affectedToken: string
  estimatedValue: string
  isNew: boolean
}

const SEED_THREATS: ThreatItem[] = [
  { id: 's1', signature: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2', shortSig: 'a1b2c3d4...e5f6a1b2', timestamp: new Date(Date.now() - 2 * 60000), riskScore: 78, verdict: 'HIGH RISK', threatType: 'Excessive Token Approval', affectedToken: 'USDC', estimatedValue: '~2.4 SOL', isNew: true },
  { id: 's2', signature: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3', shortSig: 'b2c3d4e5...f6a1b2c3', timestamp: new Date(Date.now() - 5 * 60000), riskScore: 52, verdict: 'CAUTION', threatType: 'Unknown Program Call', affectedToken: 'SOL', estimatedValue: '~0.8 SOL', isNew: false },
  { id: 's3', signature: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', shortSig: 'c3d4e5f6...a1b2c3d4', timestamp: new Date(Date.now() - 7 * 60000), riskScore: 88, verdict: 'HIGH RISK', threatType: 'Multi-account Drain', affectedToken: 'BONK', estimatedValue: '~15.2 SOL', isNew: false },
  { id: 's4', signature: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5', shortSig: 'd4e5f6a1...b2c3d4e5', timestamp: new Date(Date.now() - 9 * 60000), riskScore: 65, verdict: 'CAUTION', threatType: 'Suspicious SetAuthority', affectedToken: 'JUP', estimatedValue: '~3.1 SOL', isNew: false },
  { id: 's5', signature: 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6', shortSig: 'e5f6a1b2...c3d4e5f6', timestamp: new Date(Date.now() - 11 * 60000), riskScore: 82, verdict: 'HIGH RISK', threatType: 'Flash Loan Pattern', affectedToken: 'WIF', estimatedValue: '~9.7 SOL', isNew: false },
  { id: 's6', signature: 'f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1', shortSig: 'f6a1b2c3...d4e5f6a1', timestamp: new Date(Date.now() - 13 * 60000), riskScore: 71, verdict: 'HIGH RISK', threatType: 'Authority Transfer', affectedToken: 'USDC', estimatedValue: '~5.5 SOL', isNew: false },
  { id: 's7', signature: 'a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8', shortSig: 'a7b8c9d0...e1f2a7b8', timestamp: new Date(Date.now() - 14 * 60000), riskScore: 45, verdict: 'CAUTION', threatType: 'Large SOL Transfer', affectedToken: 'SOL', estimatedValue: '~44 SOL', isNew: false },
  { id: 's8', signature: 'b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9d0e1f2a7b8c9', shortSig: 'b8c9d0e1...f2a7b8c9', timestamp: new Date(Date.now() - 15 * 60000), riskScore: 60, verdict: 'CAUTION', threatType: 'MEV Sandwich', affectedToken: 'BONK', estimatedValue: '~1.2 SOL', isNew: false },
]

const VERDICT_COLORS: Record<string, string> = {
  'HIGH RISK': '#EF4444',
  DANGEROUS: '#EF4444',
  CAUTION: '#F59E0B',
  SAFE: '#14F195',
}

function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diff < 60) return diff + 's ago'
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
  return Math.floor(diff / 3600) + 'h ago'
}

export default function ThreatFeed({ onScanDetails }: { onScanDetails?: (sig: string) => void }) {
  const [threats, setThreats] = useState<ThreatItem[]>(SEED_THREATS)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  const loadThreats = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/threat-feed')
      const data = await res.json()
      if (data.threats && Array.isArray(data.threats) && data.threats.length > 0) {
        const newThreats = data.threats.map((t: any) => ({ ...t, timestamp: new Date(t.timestamp), isNew: true }))
        setThreats(prev => {
          const combined = [...newThreats, ...prev.map(p => ({ ...p, isNew: false }))]
          return combined.slice(0, 20)
        })
      }
    } catch {}
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }, [])

  useEffect(() => {
    loadThreats()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(loadThreats, 30000)
    return () => clearInterval(interval)
  }, [autoRefresh, loadThreats])

  return (
    <div>
      <div className="rounded-2xl border border-[#1e1e2e] p-6 mb-4" style={{ backgroundColor: '#111118' }}>
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#F8FAFC' }}>📡 Live Threat Feed</h2>
            <p className="text-sm" style={{ color: '#94A3B8' }}>Monitoring Solana mainnet in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: '#94A3B8' }}>Auto-refresh</span>
              <button onClick={() => setAutoRefresh(v => !v)} className="relative w-10 h-5 rounded-full transition-colors" style={{ backgroundColor: autoRefresh ? '#9945FF' : '#1e1e2e' }}>
                <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: autoRefresh ? '22px' : '2px' }} />
              </button>
            </div>
            <button onClick={loadThreats} disabled={isRefreshing} className="px-3 py-1.5 rounded-lg text-xs border border-[#1e1e2e] transition-colors hover:border-[#9945FF]/60 disabled:opacity-50" style={{ color: '#94A3B8' }}>
              {isRefreshing ? 'Refreshing...' : '🔄 Refresh'}
            </button>
          </div>
        </div>
        {lastUpdated && (
          <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Last updated: {timeAgo(lastUpdated)}</p>
        )}
      </div>

      <div className="space-y-3">
        {threats.map((threat, i) => {
          const color = VERDICT_COLORS[threat.verdict] || '#94A3B8'
          return (
            <div
              key={threat.id}
              className={`rounded-2xl border p-4 transition-all ${threat.isNew ? 'animate-slide-in' : ''}`}
              style={{ backgroundColor: '#111118', borderColor: threat.isNew ? color + '60' : '#1e1e2e' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: color + '20', color }}>
                      {threat.verdict === 'HIGH RISK' || threat.verdict === 'DANGEROUS' ? '🔴' : '⚠️'} {threat.verdict}
                    </span>
                    <span className="text-xs" style={{ color: '#94A3B8' }}>Score: {threat.riskScore}</span>
                    <span className="text-xs" style={{ color: '#94A3B8' }}>{timeAgo(threat.timestamp)}</span>
                  </div>
                  <div className="font-semibold text-sm mb-1" style={{ color: '#F8FAFC' }}>{threat.threatType}</div>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>
                    <span style={{ fontFamily: 'monospace' }}>{threat.shortSig}</span>
                    {' '}· {threat.affectedToken} · {threat.estimatedValue}
                  </div>
                </div>
                {onScanDetails && (
                  <button
                    onClick={() => onScanDetails(threat.signature)}
                    className="ml-4 px-3 py-1.5 rounded-lg text-xs border border-[#1e1e2e] transition-colors hover:border-[#9945FF]/60 whitespace-nowrap"
                    style={{ color: '#9945FF' }}
                  >
                    Scan Details →
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
