'use client'
import { useState, useRef, useEffect } from 'react'

interface Props {
  onAnalyze: (sig: string) => void
  loading: boolean
  walletAddress?: string | null
}

const SAMPLE_SIGS = [
  {
    label: 'SOL Transfer (LOW risk expected)',
    sig: '3nVfRMKR5vbFpPmJbopTfQzFRbDa7ELmhS6veAP5BFp6YqDHCLqZUBzmzPWCZ5fwjC6oBfQNWiHuTvJZZX3FBQS',
    risk: 'LOW',
  },
  {
    label: 'DeFi interaction (review carefully)',
    sig: '4uSekhFJBpBhvbVquvnpSBkaKRFcBhvQSTJSSMaKqNhSdB93z8vJR6W1rAXnhXAFEvqcERAC2N5dEeTBUqumkBBe',
    risk: 'MEDIUM',
  },
]

export default function ScannerPanel({ onAnalyze, loading, walletAddress }: Props) {
  const [sig, setSig] = useState('')
  const [charCount, setCharCount] = useState(0)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { setCharCount(sig.length) }, [sig])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (sig.trim() && !loading) onAnalyze(sig.trim())
  }

  const handlePaste = (sample: string) => {
    setSig(sample)
    inputRef.current?.focus()
  }

  const isValid = sig.trim().length >= 40
  const charColor = charCount === 0 ? '#333' : charCount >= 80 ? '#14F195' : charCount >= 40 ? '#FFC107' : '#FF6B35'

  return (
    <div className="relative mt-2">
      <div className="gradient-border">
        <div className="gradient-border-inner p-5">
          {/* Terminal header */}
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-3 text-xs text-[#333] mono">sentinel://scan — mainnet</span>
            <div className="ml-auto flex items-center gap-1.5">
              {walletAddress && (
                <span className="text-[10px] mono px-2 py-0.5 rounded" style={{ background: 'rgba(153,69,255,0.1)', color: '#9945FF', border: '1px solid rgba(153,69,255,0.2)' }}>
                  {walletAddress.slice(0,4)}...{walletAddress.slice(-4)}
                </span>
              )}
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-500 mono">ONLINE</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs mono text-[#555] uppercase tracking-widest">
                  Transaction Signature
                </label>
                <span className="text-[11px] mono transition-colors" style={{ color: charColor }}>
                  {charCount} / 88
                </span>
              </div>
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={sig}
                  onChange={e => setSig(e.target.value.replace(/\s/g, ''))}
                  placeholder="Paste 87-88 character Solana transaction signature..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl text-white mono text-sm placeholder-[#2a2a2a] focus:outline-none transition-all resize-none"
                  style={{
                    background: '#0a0a0a',
                    border: `1px solid ${isValid ? 'rgba(153,69,255,0.45)' : '#1e1e1e'}`,
                    boxShadow: isValid ? '0 0 0 3px rgba(153,69,255,0.07)' : 'none',
                    lineHeight: '1.6',
                  }}
                  disabled={loading}
                  spellCheck={false}
                  autoComplete="off"
                />
                {sig.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSig('')}
                    className="absolute top-2 right-2 text-[#333] hover:text-[#888] transition-colors text-xs w-5 h-5 flex items-center justify-center"
                    aria-label="Clear input"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading || !isValid}>
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Scanning Solana mainnet...
                </>
              ) : (
                <>
                  <span>⚡</span>
                  Analyze Transaction Risk
                </>
              )}
            </button>
          </form>

          {/* Samples */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: '#181818' }}>
            <p className="text-[11px] mono text-[#333] mb-2.5 uppercase tracking-wider">Try a sample signature:</p>
            <div className="flex flex-col gap-2">
              {SAMPLE_SIGS.map(({ label, sig: s, risk }) => (
                <button
                  key={s}
                  onClick={() => handlePaste(s)}
                  disabled={loading}
                  className="text-left text-[11px] mono flex items-center gap-2.5 group px-3 py-2 rounded-lg transition-colors"
                  style={{ border: '1px solid #181818', background: '#0a0a0a' }}
                >
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{
                    color: risk === 'LOW' ? '#14F195' : '#FFC107',
                    background: risk === 'LOW' ? 'rgba(20,241,149,0.1)' : 'rgba(255,193,7,0.1)',
                    border: `1px solid ${risk === 'LOW' ? 'rgba(20,241,149,0.2)' : 'rgba(255,193,7,0.2)'}`
                  }}>{risk}</span>
                  <span className="text-[#555] group-hover:text-[#888] transition-colors flex-1">{label}</span>
                  <span className="text-[#333] group-hover:text-purple-500 transition-colors">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] mono text-[#333] mt-2.5">
        Get real signatures from{' '}
        <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" className="text-purple-500/60 hover:text-purple-400 transition-colors">solscan.io</a>
        {' '}·{' '}
        <a href="https://explorer.solana.com" target="_blank" rel="noopener noreferrer" className="text-purple-500/60 hover:text-purple-400 transition-colors">explorer.solana.com</a>
      </p>
    </div>
  )
}
