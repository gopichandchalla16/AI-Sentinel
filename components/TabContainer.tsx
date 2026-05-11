"use client"
import { useState, useEffect } from 'react'
import TransactionScanner from './TransactionScanner'
import TransactionChat from './TransactionChat'
import WalletProfiler from './WalletProfiler'
import ThreatFeed from './ThreatFeed'
import ProgramScanner from './ProgramScanner'
export default function TabContainer() {
  const [activeTab, setActiveTab] = useState<'scanner'|'wallet'|'threats'|'program'>('scanner')
  const [txResult, setTxResult] = useState<any>(null)
  const [txSignature, setTxSignature] = useState('')
  useEffect(() => {
    const saved = localStorage.getItem('activeTab') as any
    if (saved) setActiveTab(saved)
    const pending = localStorage.getItem('pendingScan')
    if (pending) { setActiveTab('scanner'); localStorage.removeItem('pendingScan') }
  }, [])
  const tabs = [
    { id: 'scanner', label: '🔍 Tx Scanner' },
    { id: 'wallet', label: '👛 Wallet Profiler' },
    { id: 'threats', label: '📡 Live Threats' },
    { id: 'program', label: '🔬 Program Scanner' },
  ] as const
  const hints: Record<string,string> = {
    scanner: '💡 Paste any Solana transaction ID from your wallet — we analyze it in under 2 seconds',
    wallet: '💡 Enter any wallet address to see its AI-generated risk profile — like a credit check for wallets',
    threats: '💡 Real-time feed of suspicious Solana transactions being flagged by our AI right now',
    program: '💡 Verify if a DeFi app (smart contract) is safe before connecting your wallet to it',
  }
  const switchTab = (id: any) => { setActiveTab(id); localStorage.setItem('activeTab', id); if (id !== 'scanner') { setTxResult(null) } }
  return (
    <div>
      <div style={{position:'sticky',top:64,zIndex:40,background:'rgba(10,10,15,0.9)',backdropFilter:'blur(20px)',borderBottom:'1px solid #1e1e2e',display:'flex',overflowX:'auto',padding:'0 0'}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>switchTab(t.id)} style={{padding:'16px 24px',fontSize:14,fontWeight:600,cursor:'pointer',borderBottom:`2px solid ${activeTab===t.id?'#9945FF':'transparent'}`,whiteSpace:'nowrap',transition:'all 0.2s',background:'transparent',border:'none',borderBottom:`2px solid ${activeTab===t.id?'#9945FF':'transparent'}`,color:activeTab===t.id?'#9945FF':'#94A3B8',backgroundColor:activeTab===t.id?'rgba(153,69,255,0.08)':'transparent'}}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{padding:'10px 0 0',fontSize:13,color:'#94A3B8',background:'rgba(153,69,255,0.05)',borderBottom:'1px solid #1e1e2e',textAlign:'center',padding:'10px 24px'}}>
        {hints[activeTab]}
      </div>
      <div style={{paddingTop:32}}>
        {activeTab==='scanner' && (
          <>
            <TransactionScanner onResult={(r,sig)=>{setTxResult(r);setTxSignature(sig)}} />
            {txResult && <TransactionChat result={txResult} signature={txSignature} />}
          </>
        )}
        {activeTab==='wallet' && <WalletProfiler />}
        {activeTab==='threats' && <ThreatFeed onScanRequest={(sig)=>{localStorage.setItem('pendingScan',sig);setActiveTab('scanner')}} />}
        {activeTab==='program' && <ProgramScanner />}
      </div>
    </div>
  )
}
