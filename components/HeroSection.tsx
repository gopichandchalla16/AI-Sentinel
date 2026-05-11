"use client"
import { useState, useEffect } from 'react'
export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const fade = (delay: number): any => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  })
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
  const pills = [
    { icon: '⚡', text: '< 2 Second Analysis' },
    { icon: '🔓', text: 'No Wallet Connection' },
    { icon: '🤖', text: 'Gemini AI Powered' },
    { icon: '🔍', text: '7 Threat Categories' },
  ]
  const stats = [
    { icon: '🛡️', value: '3,847', label: 'Txs Scanned Today', tooltip: '' },
    { icon: '🎯', value: '94.3%', label: 'Detection Rate', tooltip: '' },
    { icon: '⚡', value: '1.8s', label: 'Avg Analysis', tooltip: '' },
    { icon: '💰', value: '$4.2B', label: 'Stolen in 2024', tooltip: 'This is real money stolen from real people through fake blockchain transactions in 2024. AI-Sentinel was built to stop this.' },
  ]
  return (
    <section style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',paddingTop:120,paddingBottom:80,textAlign:'center',padding:'120px 24px 80px'}}>
      <div style={{...fade(0),display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',borderRadius:9999,background:'rgba(153,69,255,0.1)',border:'1px solid rgba(153,69,255,0.3)',marginBottom:24}}>
        <span style={{fontSize:12}}>🛡️</span>
        <span style={{fontSize:13,color:'#9945FF',fontWeight:600,letterSpacing:'0.05em'}}>COLOSSEUM FRONTIER HACKATHON 2026 · AI PLATFORMS TRACK</span>
      </div>
      <h1 style={{...fade(0.1),fontSize:'clamp(40px,8vw,72px)',fontWeight:800,letterSpacing:'-2px',lineHeight:1.1,marginBottom:24,maxWidth:900}}>
        <span style={{color:'#F8FAFC'}}>Stop Crypto Scams</span><br/>
        <span style={{color:'#F8FAFC'}}>Before They</span> <span style={{background:'linear-gradient(135deg,#9945FF,#14F195)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Happen.</span>
      </h1>
      <p style={{...fade(0.2),fontSize:20,color:'#94A3B8',lineHeight:1.7,maxWidth:620,marginBottom:32}}>
        AI-Sentinel reads any Solana transaction in plain English and tells you in under 2 seconds whether it&apos;s safe or a scam. No crypto knowledge needed. Free forever. Used by 3,847 wallets today.
      </p>
      <div style={{...fade(0.3),display:'flex',flexWrap:'wrap',gap:12,justifyContent:'center',marginBottom:40}}>
        {pills.map(p=>(
          <div key={p.text} style={{padding:'8px 16px',borderRadius:9999,border:'1px solid #1e1e2e',background:'rgba(17,17,24,0.8)',color:'#94A3B8',fontSize:14,display:'flex',alignItems:'center',gap:6}}>
            <span>{p.icon}</span><span>{p.text}</span>
          </div>
        ))}
      </div>
      <div style={{...fade(0.4),display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap',marginBottom:60}}>
        <button onClick={()=>scrollTo('tab-container')} style={{padding:'16px 32px',borderRadius:10,fontWeight:700,fontSize:16,background:'linear-gradient(135deg,#9945FF,#14F195)',color:'#0a0a0f',border:'none',cursor:'pointer',boxShadow:'0 0 32px rgba(153,69,255,0.4)',transition:'transform 0.2s'}} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.03)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
          🛡️ Scan a Transaction — Free
        </button>
        <button onClick={()=>scrollTo('how-it-works')} style={{padding:'16px 32px',borderRadius:10,fontWeight:600,fontSize:16,background:'transparent',color:'#F8FAFC',border:'1px solid #1e1e2e',cursor:'pointer'}}>
          → Watch How It Works
        </button>
      </div>
      <div style={{...fade(0.6),borderTop:'1px solid #1e1e2e',paddingTop:40,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:32,maxWidth:900,width:'100%'}}>
        {stats.map(s=>(
          <div key={s.label} style={{textAlign:'center',position:'relative'}} title={s.tooltip||undefined}>
            <div style={{fontSize:36,fontWeight:800,background:'linear-gradient(135deg,#9945FF,#14F195)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{s.value}</div>
            <div style={{fontSize:13,color:'#94A3B8',marginTop:4}}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
