'use client'
import { useState, useEffect } from 'react'

interface Props { scanCount: number }

declare global {
  interface Window {
    phantom?: { solana?: { isPhantom?: boolean; connect: () => Promise<{ publicKey: { toString: () => string } }>; disconnect: () => Promise<void>; publicKey?: { toString: () => string } } }
  }
}

export default function Header({ scanCount }: Props) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [phantomInstalled, setPhantomInstalled] = useState(false)

  useEffect(() => {
    const checkPhantom = () => {
      if (window.phantom?.solana?.isPhantom) {
        setPhantomInstalled(true)
        if (window.phantom.solana.publicKey) {
          setWalletAddress(window.phantom.solana.publicKey.toString())
        }
      }
    }
    checkPhantom()
    window.addEventListener('load', checkPhantom)
    return () => window.removeEventListener('load', checkPhantom)
  }, [])

  const connectWallet = async () => {
    if (!window.phantom?.solana) {
      window.open('https://phantom.com', '_blank')
      return
    }
    setConnecting(true)
    try {
      const resp = await window.phantom.solana.connect()
      setWalletAddress(resp.publicKey.toString())
    } catch (e) {
      console.error('Wallet connect error', e)
    } finally {
      setConnecting(false)
    }
  }

  const disconnectWallet = async () => {
    await window.phantom?.solana?.disconnect()
    setWalletAddress(null)
  }

  const short = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(20px)', borderColor: '#1e1e1e' }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AI-Sentinel shield logo">
            <defs>
              <linearGradient id="shieldGrad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#9945FF" />
                <stop offset="1" stopColor="#14F195" />
              </linearGradient>
            </defs>
            <path d="M16 2L4 7.5v8.8C4 23.5 9.4 29.5 16 31c6.6-1.5 12-7.5 12-14.7V7.5L16 2z"
              fill="url(#shieldGrad)" fillOpacity="0.18" stroke="url(#shieldGrad)" strokeWidth="1.6" />
            <circle cx="16" cy="15" r="4.5" fill="#14F195" fillOpacity="0.85" />
            <path d="M13 15l2 2 4-4" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <div className="font-bold text-white text-[15px] tracking-tight leading-none">AI-Sentinel</div>
            <div className="text-[10px] text-[#666] mono tracking-widest uppercase leading-none mt-0.5">Solana Guard</div>
          </div>
        </div>

        {/* Center: Live badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: 'rgba(20,241,149,0.2)', background: 'rgba(20,241,149,0.05)' }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400 mono">LIVE · Mainnet Beta</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {scanCount > 0 && (
            <span className="hidden sm:block text-xs mono" style={{ color: '#555' }}>
              {scanCount} scan{scanCount !== 1 ? 's' : ''}
            </span>
          )}

          {/* Phantom Wallet Button */}
          {walletAddress ? (
            <button
              onClick={disconnectWallet}
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-all mono group"
              style={{ borderColor: 'rgba(153,69,255,0.4)', background: 'rgba(153,69,255,0.08)', color: '#c084fc' }}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="group-hover:hidden">{short(walletAddress)}</span>
              <span className="hidden group-hover:inline text-red-400">Disconnect</span>
            </button>
          ) : (
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-all mono"
              style={{ borderColor: 'rgba(153,69,255,0.35)', background: 'rgba(153,69,255,0.06)', color: '#9945FF' }}
            >
              {connecting ? (
                <><span className="w-3 h-3 border border-purple-500 border-t-transparent rounded-full animate-spin" />Connecting...</>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                  {phantomInstalled ? 'Connect Phantom' : 'Install Phantom'}
                </>
              )}
            </button>
          )}

          <a
            href="https://github.com/gopichandchalla16/AI-Sentinel"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-xs px-3 py-1.5 rounded-lg border transition-colors mono"
            style={{ borderColor: '#2a2a2a', color: '#555' }}
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </header>
  )
}
