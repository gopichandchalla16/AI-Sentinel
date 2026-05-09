'use client'
import { useState, useRef } from 'react'

interface Props {
  onAnalyze: (sig: string) => void
  loading: boolean
}

const SAMPLE_SIGS = [
  {
    label: 'Recent Jupiter swap',
    sig: '4uSekhFJBpBhvbVquvnpSBkaKRFcBhvQSTJSSMaKqNhSdB93z8vJR6W1rAXnhXAFEvqcERAC2N5dEeTBUqumkBBe',
  },
  {
    label: 'SOL transfer example',
    sig: '3F8E9kVeH6jXC2zLKwL1d7qJjXw8LpJkSDxmRQ6aN5gJpEbDv8GdCzRkE4HHxaT5oN3WpqVnUCkJWKzGhxSMBFT',
  },
]

export default function ScannerPanel({ onAnalyze, loading }: Props) {
  const [sig, setSig] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (sig.trim() && !loading) onAnalyze(sig.trim())
  }

  const handlePaste = (sample: string) => {
    setSig(sample)
    inputRef.current?.focus()
  }

  const isValid = sig.trim().length >= 40

  return (
    <div className="relative mt-2">
      {/* Animated gradient border wrapper */}
      <div className="gradient-border">
        <div className="gradient-border-inner p-6">
          {/* Terminal header */}
          <div className="flex items-center gap-1.5 mb-5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-3 text-xs text-[#444] mono">sentinel://scan — mainnet</span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-500 mono">ONLINE</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs mono text-[#666] mb-2 uppercase tracking-widest">
                Transaction Signature
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={sig}
                  onChange={e => setSig(e.target.value)}
                  placeholder="Paste 87-88 character Solana tx signature..."
                  className="w-full px-4 py-3.5 rounded-xl text-white mono text-sm placeholder-[#333] focus:outline-none transition-all pr-16"
                  style={{
                    background: '#0d0d0d',
                    border: `1px solid ${isValid ? 'rgba(153,69,255,0.4)' : '#222'}`,
                    boxShadow: isValid ? '0 0 0 3px rgba(153,69,255,0.08)' : 'none',
                  }}
                  disabled={loading}
                  spellCheck={false}
                  autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {sig.length > 0 && (
                    <>
                      <span className={`text-[11px] mono ${sig.length >= 80 ? 'text-green-400' : 'text-[#444]'}`}>
                        {sig.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSig('')}
                        className="text-[#444] hover:text-[#888] transition-colors text-xs"
                        aria-label="Clear input"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading || !isValid}>
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                  Scanning on-chain data...
                </>
              ) : (
                <>
                  <span>⚡</span>
                  Analyze Transaction Risk
                </>
              )}
            </button>
          </form>

          {/* Sample signatures */}
          <div className="mt-5 pt-4 border-t" style={{ borderColor: '#1a1a1a' }}>
            <p className="text-[11px] mono text-[#444] mb-2 uppercase tracking-wider">Load a sample signature:</p>
            <div className="flex flex-col gap-1.5">
              {SAMPLE_SIGS.map(({ label, sig: s }) => (
                <button
                  key={s}
                  onClick={() => handlePaste(s)}
                  disabled={loading}
                  className="text-left text-[11px] mono text-[#555] hover:text-purple-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="text-[#333] group-hover:text-purple-500">→</span>
                  <span className="text-[#666] group-hover:text-[#888] mr-1">{label}:</span>
                  <span className="truncate">{s.slice(0, 32)}...</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] mono text-[#444] mt-3">
        Get signatures from{' '}
        <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" className="text-purple-500/70 hover:text-purple-400 transition-colors">solscan.io</a>
        {' '}or{' '}
        <a href="https://explorer.solana.com" target="_blank" rel="noopener noreferrer" className="text-purple-500/70 hover:text-purple-400 transition-colors">explorer.solana.com</a>
      </p>
    </div>
  )
}
