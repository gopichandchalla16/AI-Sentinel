'use client'
import { useState, useEffect } from 'react'
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

declare global {
  interface Window {
    phantom?: { solana?: { isPhantom?: boolean; publicKey?: { toString: () => string } } }
  }
}

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txSig, setTxSig] = useState('')
  const [scanCount, setScanCount] = useState(0)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    const check = () => {
      if (window.phantom?.solana?.publicKey) {
        setWalletAddress(window.phantom.solana.publicKey.toString())
      }
    }
    check()
    window.addEventListener('focus', check)
    return () => window.removeEventListener('focus', check)
  }, [])

  const handleAnalyze = async (signature: string) => {
    if (!signature.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setTxSig(signature.trim())
    window.scrollTo({ top: 0, behavior: 'smooth' })

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
        // Scroll down to results
        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
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
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(153,69,255,0.07) 0%, transparent 65%)' }}
      />

      <Header scanCount={scanCount} />
      <HeroSection />

      {/* Main scanner area */}
      <section id="scan" className="relative z-10 max-w-3xl mx-auto px-4 pb-6">
        <ScannerPanel onAnalyze={handleAnalyze} loading={loading} walletAddress={walletAddress} />

        {/* Error */}
        {error && (
          <div
            id="results"
            className="mt-4 p-4 rounded-xl border text-sm mono flex items-start gap-3 animate-slide-up"
            style={{ borderColor: 'rgba(255,50,50,0.2)', background: 'rgba(255,50,50,0.05)', color: '#ff6b6b' }}
          >
            <span className="shrink-0 mt-0.5">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <LoadingSkeleton />}

        {/* Results */}
        {result && !loading && (
          <div id="results">
            <ResultPanel result={result} signature={txSig} />
          </div>
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
    <div id="results" className="mt-4 space-y-3 animate-fade-in">
      <div className="card relative overflow-hidden">
        <div className="scan-line" />
        <div className="flex items-center gap-3 mb-5">
          <div className="skeleton w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <div className="skeleton h-4 w-40" />
            <div className="skeleton h-3 w-28" />
          </div>
        </div>
        <div className="space-y-2.5">
          <div className="skeleton h-3.5 w-full" />
          <div className="skeleton h-3.5 w-5/6" />
          <div className="skeleton h-3.5 w-4/6" />
        </div>
        <div className="mt-6 pt-5 border-t border-[#1a1a1a] text-center space-y-1">
          <p className="text-sm text-purple-400 mono animate-pulse">🔗 Fetching live data from Helius RPC...</p>
          <p className="text-xs text-[#444] mono">Running Gemini 1.5 Flash security analysis...</p>
          <p className="text-[11px] text-[#333] mono">Checking 7 security parameters...</p>
        </div>
      </div>
    </div>
  )
}
