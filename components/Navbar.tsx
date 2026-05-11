"use client"
import { useState, useEffect } from 'react'
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const scrollTo = (id: string) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
  const navLinks = [
    { label: 'Scanner', id: 'tab-container' },
    { label: 'Wallet Profiler', id: 'tab-container' },
    { label: 'Threat Feed', id: 'tab-container' },
    { label: 'Programs', id: 'tab-container' },
    { label: 'How It Works', id: 'how-it-works' },
  ]
  return (
    <div style={{position:'sticky',top:0,zIndex:50}}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <nav style={scrolled?{backgroundColor:'rgba(10,10,15,0.85)',backdropFilter:'blur(20px)',borderBottom:'1px solid #1e1e2e',boxShadow:'0 4px 24px rgba(0,0,0,0.4)',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:64}:{backgroundColor:'transparent',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:64}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:22,fontWeight:800}}>
            <span style={{color:'#9945FF'}}>AI</span>
            <span style={{color:'#F8FAFC'}}>-Sentinel</span>
          </span>
          <div style={{display:'inline-flex',alignItems:'center',gap:4,marginLeft:8,padding:'2px 8px',borderRadius:9999,background:'rgba(20,241,149,0.1)',border:'1px solid rgba(20,241,149,0.3)'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:'#14F195',animation:'pulse 2s infinite'}} />
            <span style={{fontSize:11,color:'#14F195',fontWeight:600}}>LIVE</span>
          </div>
        </div>
        <div style={{display:'flex',gap:28,alignItems:'center'}} className="hidden md:flex">
          {navLinks.map(l=>(
            <button key={l.label} onClick={()=>scrollTo(l.id)} style={{color:'#94A3B8',fontSize:14,fontWeight:500,cursor:'pointer',background:'none',border:'none',transition:'color 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.color='#F8FAFC')} onMouseLeave={e=>(e.currentTarget.style.color='#94A3B8')}>{l.label}</button>
          ))}
          <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer" style={{color:'#94A3B8',fontSize:14,fontWeight:500,textDecoration:'none',transition:'color 0.2s'}} onMouseEnter={e=>(e.currentTarget.style.color='#F8FAFC')} onMouseLeave={e=>(e.currentTarget.style.color='#94A3B8')}>GitHub ↗</a>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <button onClick={()=>scrollTo('tab-container')} style={{padding:'8px 20px',borderRadius:10,fontWeight:600,fontSize:14,background:'linear-gradient(135deg,#9945FF,#14F195)',color:'#0a0a0f',border:'none',cursor:'pointer'}}>Try Free →</button>
          <button onClick={()=>setMobileOpen(p=>!p)} style={{display:'flex',flexDirection:'column',gap:5,background:'none',border:'none',cursor:'pointer',padding:4}} aria-label="Menu">
            {[0,1,2].map(i=>(<div key={i} style={{width:22,height:2,background:'#94A3B8',borderRadius:2}} />))}
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div style={{background:'#111118',borderBottom:'1px solid #1e1e2e',padding:'12px 24px',display:'flex',flexDirection:'column',gap:4}}>
          {navLinks.map(l=>(
            <button key={l.label} onClick={()=>scrollTo(l.id)} style={{color:'#94A3B8',fontSize:15,fontWeight:500,cursor:'pointer',background:'none',border:'none',textAlign:'left',padding:'10px 0',borderBottom:'1px solid #1e1e2e'}}>{l.label}</button>
          ))}
          <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer" style={{color:'#94A3B8',fontSize:15,padding:'10px 0',textDecoration:'none'}}>GitHub ↗</a>
        </div>
      )}
    </div>
  )
}
