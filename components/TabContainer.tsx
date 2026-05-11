"use client"
import { useState, useEffect } from 'react'
import TransactionScanner from './TransactionScanner'
import WalletProfiler from './WalletProfiler'
import ThreatFeed from './ThreatFeed'
import ProgramScanner from './ProgramScanner'

const TABS = [
  { id: 'scanner', label: 'Tx Scanner', emoji: '🔍' },
  { id: 'wallet', label: 'Wallet Profiler', emoji: '👛' },
  { id: 'threats', label: 'Live Threat Feed', emoji: '📡' },
  { id: 'program', label: 'Program Scanner', emoji: '🔬' },
]

export default function TabContainer() {
  const [active, setActive] = useState('scanner')
  const [scannerSig, setScannerSig] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('sentinel_scan_sig')
    if (stored) {
      setScannerSig(stored)
      setActive('scanner')
      localStorage.removeItem('sentinel_scan_sig')
    }
  }, [])

  const switchToScanner = (sig: string) => {
    localStorage.setItem('sentinel_scan_sig', sig)
    setScannerSig(sig)
    setActive('scanner')
  }

  return (
    <section id="tabs" className="relative z-10 max-w-5xl mx-auto px-4 pb-8">
      <div className="flex border-b border-[#1e1e2e] overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className="px-6 py-3 text-sm font-medium whitespace-nowrap transition-all"
            style={{
              color: active === tab.id ? '#9945FF' : '#94A3B8',
              borderBottom: active === tab.id ? '2px solid #9945FF' : '2px solid transparent',
              backgroundColor: active === tab.id ? 'rgba(153,69,255,0.08)' : 'transparent',
            }}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {active === 'scanner' && <TransactionScanner prefillSig={scannerSig} />}
        {active === 'wallet'  && <WalletProfiler />}
        {active === 'threats' && <ThreatFeed onScanDetails={switchToScanner} />}
        {active === 'program' && <ProgramScanner />}
      </div>
    </section>
  )
}
