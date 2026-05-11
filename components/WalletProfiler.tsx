"use client"
import { useState } from 'react'
const DEMO_WALLET = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'
type WalletProfile = {
  walletAddress: string; overallRiskScore: number; overallVerdict: string
  totalTxsAnalyzed: number; recentTxs: Array<{signature:string;blockTime:number;riskScore:number;verdict:string}>
  riskBreakdown: {safeTxs:number;cautionTxs:number;highRiskTxs:number}
  topPrograms: string[]; aiSummary: string; recommendation: string; walletAge: string
}
export default function WalletProfiler() {
  const [walletAddress, setWalletAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<WalletProfile|null>(null)
  const [error, setError] = useState('')
  const [loadingStage, setLoadingStage] = useState(0)
  const [copied, setCopied] = useState(false)
  const stages = [
    '🔗 Fetching wallet transaction history from Solana mainnet...',
    '📊 Analyzing last 10 transactions for threat patterns...',
    '🤖 Running AI behavioral analysis with Gemini...',
    '📋 Building your wallet risk profile...',
  ]
  const handleProfile = async (addr?: string) => {
    const a = addr || walletAddress
    if (!a.trim()) return
    setIsLoading(true); setProfile(null); setError(''); setLoadingStage(0)
    const stageTimer = setInterval(() => setLoadingStage(p=>Math.min(p+1,3)), 1200)
    try {
      const res = await fetch('/api/wallet-profile', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ walletAddress:a }) })
      const data = await res.json()
      clearInterval(stageTimer)
      if (data.error) { setError(data.error); setIsLoading(false); return }
      setProfile(data); setIsLoading(false)
    } catch {
      clearInterval(stageTimer); setIsLoading(false); setError('Failed to fetch wallet profile. Please try again.')
    }
  }
  const verdictConfig: any = {
    CLEAN: { bg:'rgba(20,241,149,0.15)', color:'#14F195', border:'rgba(20,241,149,0.4)', label:'✅ CLEAN' },
    CAUTIOUS: { bg:'rgba(245,158,11,0.15)', color:'#F59E0B', border:'rgba(245,158,11,0.4)', label:'⚠️ CAUTIOUS' },
    RISKY: { bg:'rgba(249,115,22,0.15)', color:'#F97316', border:'rgba(249,115,22,0.4)', label:'🔶 RISKY' },
    DANGEROUS: { bg:'rgba(239,68,68,0.15)', color:'#EF4444', border:'rgba(239,68,68,0.4)', label:'🔴 DANGEROUS' },
  }
  const timeAgo = (ts: number) => {
    const d = (Date.now()/1000 - ts)
    if (d < 60) return `${Math.round(d)}s ago`
    if (d < 3600) return `${Math.round(d/60)}m ago`
    return `${Math.round(d/3600)}h ago`
  }
  const shareProfile = () => {
    if (!profile) return
    const { walletAddress:addr, overallRiskScore:score, overallVerdict:verdict, riskBreakdown:{safeTxs,cautionTxs,highRiskTxs}, aiSummary } = profile
    const text = `👛 AI-Sentinel Wallet Profile\n━━━━━━━━━━━━━━━━━━━\nWallet: ${addr.slice(0,8)}...${addr.slice(-8)}\nRisk Score: ${score}/100 — ${verdict}\n${safeTxs} Safe · ${cautionTxs} Caution · ${highRiskTxs} High Risk\nAI: ${aiSummary.slice(0,100)}...\n━━━━━━━━━━━━━━━━━━━\nProfile any wallet free: https://ai-sentinel-three.vercel.app\n@colosseum Frontier Hackathon 2026`
    navigator.clipboard.writeText(text).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000) })
  }
  return (
    <div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{background:'rgba(153,69,255,0.05)',border:'1px solid rgba(153,69,255,0.15)',borderRadius:12,padding:'16px 20px',marginBottom:20,fontSize:14,color:'#94A3B8',lineHeight:1.6}}>
        <strong style={{color:'#F8FAFC'}}>What is a wallet address?</strong><br/>
        Your Solana wallet address is a string of letters and numbers — like a bank account number. It&apos;s completely PUBLIC and safe to share. Paste any wallet address below to see its AI-generated security profile.
      </div>
      <div style={{position:'relative',marginBottom:12}}>
        <input value={walletAddress} onChange={e=>setWalletAddress(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleProfile()} placeholder="Paste any Solana wallet address (32-44 characters)..." style={{width:'100%',padding:'18px 180px 18px 20px',borderRadius:10,border:'1px solid #1e1e2e',background:'#111118',color:'#F8FAFC',fontSize:15,outline:'none',fontFamily:'monospace',boxSizing:'border-box',transition:'all 0.2s'}} onFocus={e=>{e.target.style.borderColor='#9945FF';e.target.style.boxShadow='0 0 0 3px rgba(153,69,255,0.15)'}} onBlur={e=>{if(!walletAddress){e.target.style.borderColor='#1e1e2e';e.target.style.boxShadow='none'}}} />
        <button onClick={()=>handleProfile()} disabled={isLoading} style={{position:'absolute',right:12,top:12,padding:'10px 20px',borderRadius:8,fontWeight:700,background:isLoading?'#1e1e2e':'linear-gradient(135deg,#9945FF,#14F195)',color:isLoading?'#94A3B8':'#0a0a0f',border:'none',cursor:isLoading?'not-allowed':'pointer',fontSize:14}}>
          {isLoading?'Profiling...':'Profile Wallet →'}
        </button>
      </div>
      <button onClick={()=>{setWalletAddress(DEMO_WALLET);handleProfile(DEMO_WALLET)}} style={{background:'none',border:'none',color:'#9945FF',fontSize:13,cursor:'pointer',textDecoration:'underline',marginBottom:24}}>→ Try Demo Wallet</button>
      {isLoading && (
        <div style={{background:'#111118',border:'1px solid #1e1e2e',borderRadius:16,padding:28,marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:24,height:24,border:'2px solid #9945FF',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
            <span style={{color:'#9945FF',fontWeight:600}}>{stages[loadingStage]}</span>
          </div>
        </div>
      )}
      {error && <div style={{color:'#EF4444',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:10,padding:16,marginBottom:16}}>{error}</div>}
      {profile && (()=>{
        const vc = verdictConfig[profile.overallVerdict] || verdictConfig.CLEAN
        const total = profile.totalTxsAnalyzed
        const safeW = total > 0 ? (profile.riskBreakdown.safeTxs/total*100) : 0
        const cautW = total > 0 ? (profile.riskBreakdown.cautionTxs/total*100) : 0
        const riskW = total > 0 ? (profile.riskBreakdown.highRiskTxs/total*100) : 0
        return (
          <div style={{background:'#111118',border:'1px solid #1e1e2e',borderRadius:16,overflow:'hidden',marginBottom:24}}>
            <div style={{padding:28,borderBottom:'1px solid #1e1e2e',display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,alignItems:'center'}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:56,fontWeight:800,background:'linear-gradient(135deg,#9945FF,#14F195)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>{profile.overallRiskScore}</div>
                <div style={{fontSize:12,color:'#94A3B8',marginTop:4}}>/100 Risk Score (lower = safer)</div>
              </div>
              <div>
                <div style={{display:'inline-block',padding:'8px 20px',borderRadius:9999,background:vc.bg,color:vc.color,border:`1px solid ${vc.border}`,fontWeight:700,fontSize:18,marginBottom:12}}>{vc.label}</div>
                <div style={{color:'#94A3B8',fontSize:14,lineHeight:1.6}}>
                  <div>{profile.walletAge}</div>
                  <div>{profile.totalTxsAnalyzed} recent transactions scanned</div>
                  <div style={{fontSize:12,color:'#64748B',marginTop:4}}>(like checking someone’s transaction history before lending them money)</div>
                </div>
              </div>
            </div>
            <div style={{padding:'20px 28px',borderBottom:'1px solid #1e1e2e'}}>
              <div style={{fontSize:13,color:'#64748B',fontWeight:600,marginBottom:10}}>📊 TRANSACTION RISK BREAKDOWN</div>
              <div style={{display:'flex',width:'100%',height:12,borderRadius:6,overflow:'hidden',background:'#1e1e2e',marginBottom:10}}>
                <div style={{width:safeW+'%',background:'#14F195',transition:'width 1s ease'}} />
                <div style={{width:cautW+'%',background:'#F59E0B',transition:'width 1s ease'}} />
                <div style={{width:riskW+'%',background:'#EF4444',transition:'width 1s ease'}} />
              </div>
              <div style={{display:'flex',gap:20,fontSize:13,color:'#94A3B8'}}>
                <span>✅ {profile.riskBreakdown.safeTxs} Safe</span>
                <span>⚠️ {profile.riskBreakdown.cautionTxs} Caution</span>
                <span>🔴 {profile.riskBreakdown.highRiskTxs} High Risk</span>
              </div>
            </div>
            {profile.recentTxs.length > 0 && (
              <div style={{padding:'20px 28px',borderBottom:'1px solid #1e1e2e'}}>
                <div style={{fontSize:13,color:'#64748B',fontWeight:600,marginBottom:12}}>📋 LAST {Math.min(5,profile.recentTxs.length)} TRANSACTIONS</div>
                {profile.recentTxs.slice(0,5).map((tx,i)=>{
                  const tvc = verdictConfig[tx.verdict] || verdictConfig.CLEAN
                  return (
                    <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #1e1e2e',gap:12,flexWrap:'wrap'}}>
                      <span style={{fontFamily:'monospace',fontSize:13,color:'#94A3B8'}}>{tx.signature.slice(0,8)}...{tx.signature.slice(-8)}</span>
                      <span style={{fontSize:12,color:'#64748B'}}>{timeAgo(tx.blockTime)}</span>
                      <span style={{padding:'2px 10px',borderRadius:9999,background:tvc.bg,color:tvc.color,fontSize:11,border:`1px solid ${tvc.border}`,fontWeight:600}}>{tx.verdict}</span>
                      <span style={{fontWeight:700,color:tvc.color,fontSize:14}}>{tx.riskScore}/100</span>
                    </div>
                  )
                })}
              </div>
            )}
            <div style={{padding:'20px 28px',borderBottom:'1px solid #1e1e2e'}}>
              <div style={{fontSize:13,color:'#64748B',fontWeight:600,marginBottom:10}}>🔗 PROGRAMS MOST USED <span style={{fontWeight:400,fontSize:12}}>(DeFi apps this wallet has interacted with)</span></div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {profile.topPrograms.map((p,i)=>(<span key={i} style={{padding:'4px 12px',borderRadius:9999,background:'#16161f',color:'#94A3B8',fontSize:12,border:'1px solid #1e1e2e'}}>{p}</span>))}
              </div>
            </div>
            <div style={{padding:'20px 28px',borderBottom:'1px solid #1e1e2e',background:'rgba(153,69,255,0.04)'}}>
              <div style={{fontSize:13,color:'#64748B',fontWeight:600,marginBottom:8}}>🔮 AI BEHAVIORAL ANALYSIS</div>
              <p style={{color:'#F8FAFC',lineHeight:1.7,fontSize:14,fontStyle:'italic'}}>{profile.aiSummary}</p>
            </div>
            <div style={{padding:'20px 28px',borderBottom:'1px solid #1e1e2e',background:vc.color==='#14F195'?'rgba(20,241,149,0.04)':'rgba(239,68,68,0.04)'}}>
              <div style={{fontSize:13,color:'#64748B',fontWeight:600,marginBottom:8}}>💡 WHAT SHOULD YOU DO?</div>
              <p style={{color:'#F8FAFC',lineHeight:1.7,fontSize:14,fontWeight:600}}>{profile.recommendation}</p>
            </div>
            <div style={{padding:'20px 28px',display:'flex',gap:12,flexWrap:'wrap'}}>
              <button onClick={shareProfile} style={{padding:'10px 20px',borderRadius:8,border:'1px solid #1e1e2e',background:'#16161f',color:'#F8FAFC',cursor:'pointer',fontSize:14,fontWeight:600}}>{copied?'✅ Copied!':'📤 Share Profile'}</button>
              <a href={`https://solscan.io/account/${profile.walletAddress}`} target="_blank" rel="noopener noreferrer" style={{padding:'10px 20px',borderRadius:8,border:'1px solid #1e1e2e',background:'#16161f',color:'#F8FAFC',textDecoration:'none',fontSize:14,fontWeight:600}}>📊 View on Solscan ↗</a>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
