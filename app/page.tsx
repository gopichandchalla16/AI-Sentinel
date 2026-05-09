'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import ScannerPanel from '@/components/ScannerPanel'
import ResultPanel from '@/components/ResultPanel'
import StatsSection from '@/components/StatsSection'
import HowItWorks from '@/components/HowItWorks'
import Footer from '@/components/Footer'

export type AnalysisResult = {
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  flags: string[]
  summary: string
  recommendation: string
  txDetails?: {
    fee?: number
    blockTime?: number
    slot?: number
    accounts?: string[]
    destBalance?: number
    destHistory?: number
    err?: boolean
  }
}

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txSig, setTxSig] = useState('')
  const [scanCount, setScanCount] = useState(0)

  const handleAnalyze = async (signature: string) => {
    if (!signature.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setTxSig(signature.trim())

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: signature.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Analysis failed. Please check the signature and try again.')
      } else {
        setResult(data)
        setScanCount(c => c + 1)
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen grid-bg relative">
      {/* Top ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(153,69,255,0.1) 0%, transparent 65%)' }}
      />

      <Header scanCount={scanCount} />
      <HeroSection />

      {/* Main scanner area */}
      <section id="scan" className="relative z-10 max-w-3xl mx-auto px-4 pb-6">
        <ScannerPanel onAnalyze={handleAnalyze} loading={loading} />

        {error && (
          <div className="mt-5 p-4 rounded-xl border border-red-500/25 bg-red-500/8 text-red-400 text-sm mono flex items-start gap-3 animate-slide-up">
            <span className="text-red-400 shrink-0 mt-0.5">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {loading && <LoadingSkeleton />}
        {result && !loading && (
          <ResultPanel result={result} signature={txSig} />
        )}
      </section>

      <HowItWorks />
      <StatsSection />
      <Footer />
    </main>
  )
}

function LoadingSkeleton() {
  return (
    <div className="mt-5 space-y-3 animate-fade-in">
      <div className="card relative overflow-hidden">
        <div className="scan-line" />
        <div className="flex items-center gap-3 mb-5">
          <div className="skeleton w-9 h-9 rounded-full" />
          <div className="space-y-1.5">
            <div className="skeleton h-4 w-36" />
            <div className="skeleton h-3 w-24" />
          </div>
        </div>
        <div className="space-y-2.5">
          <div className="skeleton h-3.5 w-full" />
          <div className="skeleton h-3.5 w-5/6" />
          <div className="skeleton h-3.5 w-4/6" />
        </div>
        <div className="mt-6 pt-5 border-t border-[#1e1e1e] text-center">
          <p className="text-sm text-purple-400 mono animate-pulse">🔗 Fetching live data from Solana mainnet...</p>
          <p className="text-xs text-[#555] mt-1 mono">Running Gemini AI security analysis...</p>
        </div>
      </div>
    </div>
  )
}
