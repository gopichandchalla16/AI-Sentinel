"use client"
import { useState, useEffect } from 'react'
const DEMO_SIG = '5UfDuX7WBFGSecEvFGawmxTFKSakDeMMNJRjSHsxWqoH2RzKhEBFbhxGQ5LSwTtfmU14TRGxgFzqHCQSNDj1Hq7'
const STEPS = [
  '🔗 Connecting to Solana mainnet via Helius RPC...',
  '📊 Fetching transaction data and account states...',
  '🤖 Running Gemini AI threat analysis...',
  '🛡️ Generating security verdict...',
]
export default function TransactionScanner({ onResult }: { onResult: (result: any, sig: string) => void }) {
  const [signature, setSignature] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const pending = localStorage.getItem('pendingScan')
    if (pending) { setSignature(pending); localStorage.removeItem('pendingScan'); handleScan(pending) }
  }, [])
  const handleScan = async (sig?: string) => {
    const s = sig || signature
    if (!s.trim()) return
    setIsLoading(true); setResult(null); setError(''); setLoadingStep(0); setProgress(0)
    const stepTimer = setInterval(() => { setLoadingStep(p => Math.min(p+1,3)) }, 800)
    const progressTimer = setInterval(() => { setProgress(p => Math.min(p+2,95)) }, 64)
    try {
      const res = await fetch('/api/analyze', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ signature: s }) })
      const data = await res.json()
      clearInterval(stepTimer); clearInterval(progressTimer); setProgress(100)
      setTimeout(() => { setIsLoading(false); setResult(data); onResult(data, s) }, 300)
    } catch {
      clearInterval(stepTimer); clearInterval(progressTimer)
      setIsLoading(false); setError('Failed to analyze transaction. Please try again.')
    }
  }
  const verdictConfig: any = {
    SAFE: { bg:'rgba(20,241,149,0.1)', border:'rgba(20,241,149,0.3)', color:'#14F195', label:'✅ SAFE TO SIGN' },
    CAUTION: { bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.3)', color:'#F59E0B', label:'⚠️ PROCEED WITH CAUTION' },
    HIGH_RISK: { bg:'rgba(249,115,22,0.1)', border:'rgba(249,115,22,0.3)', color:'#F97316', label:'🔴 DO NOT SIGN' },
    DANGEROUS: { bg:'rgba(239,68,68,0.1)', border:'rgba(239,68,68,0.3)', color:'#EF4444', label:'🚨 CRITICAL THREAT' },
  }
  const vc = result ? (verdictConfig[result.verdict] || verdictConfig.CAUTION) : null
  const shareResult = () => {
    if (!result) return
    const text = `🛡️ AI-Sentinel Security Scan\n━━━━━━━━━━━━━━━━━━━\nSignature: ${signature.slice(0,8)}...${signature.slice(-8)}\nRisk Score: ${result.riskScore}/100\nVerdict: ${result.verdict}\n${result.redFlags?.length>0?'⚠️ '+result.redFlags.length+' red flags detected':'✅ No red flags found'}\nRecommendation: ${result.recommendation}\n━━━━━━━━━━━━━━━━━━━\nScan yours free: https://ai-sentinel-three.vercel.app\nBuilt for @colosseum Frontier Hackathon 2026`
    navigator.clipboard.writeText(text).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000) })
  }
  return (
    <div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{position:'relative',marginBottom:12}}>
        <input
          value={signature}
          onChange={e=>setSignature(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&handleScan()}
          placeholder="Paste any Solana transaction signature (88 characters)..."
          style={{width:'100%',padding:'18px 160px 18px 20px',borderRadius:10,border:`1px solid ${signature?'#9945FF':'#1e1e2e'}`,background:'#111118',color:'#F8FAFC',fontSize:15,outline:'none',fontFamily:'monospace',boxSizing:'border-box',transition:'border-color 0.2s, box-shadow 0.2s',boxShadow:signature?'0 0 0 3px rgba(153,69,255,0.15)':'none'}}
          onFocus={e=>{e.target.style.borderColor='#9945FF';e.target.style.boxShadow='0 0 0 3px rgba(153,69,255,0.15)'}}
          onBlur={e=>{if(!signature){e.target.style.borderColor='#1e1e2e';e.target.style.boxShadow='none'}}}
        />
        <button onClick={()=>handleScan()} disabled={isLoading} style={{position:'absolute',right:12,top:12,padding:'10px 20px',borderRadius:8,fontWeight:700,background:isLoading?'#1e1e2e':'linear-gradient(135deg,#9945FF,#14F195)',color:isLoading?'#94A3B8':'#0a0a0f',border:'none',cursor:isLoading?'not-allowed':'pointer',fontSize:14,transition:'all 0.2s'}}>
          {isLoading?'Analyzing...':'Analyze →'}
        </button>
      </div>
      <button onClick={()=>{setSignature(DEMO_SIG);handleScan(DEMO_SIG)}} style={{background:'none',border:'none',color:'#9945FF',fontSize:13,cursor:'pointer',textDecoration:'underline',marginBottom:24}}>→ Try Demo Transaction</button>
      {isLoading && (
        <div style={{background:'#111118',border:'1px solid #1e1e2e',borderRadius:16,padding:28,marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
            <div style={{width:24,height:24,border:'2px solid #9945FF',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}} />
            <span style={{color:'#9945FF',fontWeight:600,fontSize:15}}>{STEPS[loadingStep]}</span>
          </div>
          <div style={{width:'100%',height:6,background:'#1e1e2e',borderRadius:3,overflow:'hidden'}}>
            <div style={{height:'100%',background:'linear-gradient(135deg,#9945FF,#14F195)',borderRadius:3,width:`${progress}%`,transition:'width 0.1s ease'}} />
          </div>
          <div style={{fontSize:12,color:'#64748B',marginTop:8,textAlign:'right'}}>{progress}%</div>
        </div>
      )}
      {error && <div style={{color:'#EF4444',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:10,padding:16,marginBottom:16}}>{error}</div>}
      {result && vc && (
        <div style={{background:'#111118',border:'1px solid #1e1e2e',borderRadius:16,overflow:'hidden',marginBottom:24}}>
          <div style={{background:vc.bg,border:`1px solid ${vc.border}`,padding:'20px 28px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
            <div style={{fontSize:22,fontWeight:800,color:vc.color}}>{vc.label}</div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:36,fontWeight:800,color:vc.color}}>{result.riskScore}</div>
              <div style={{fontSize:12,color:'#94A3B8'}}>/100 Risk Score</div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,padding:28}} className="result-grid">
            <div>
              <div style={{fontSize:13,color:'#64748B',fontWeight:600,marginBottom:8}}>📋 TRANSACTION SUMMARY</div>
              <p style={{color:'#F8FAFC',lineHeight:1.7,fontSize:15}}>{result.summary}</p>
              <div style={{marginTop:20}}>
                <div style={{fontSize:13,color:'#64748B',fontWeight:600,marginBottom:8}}>💡 RECOMMENDATION</div>
                <p style={{color:'#94A3B8',lineHeight:1.7,fontSize:14}}>{result.recommendation}</p>
              </div>
            </div>
            <div>
              <div style={{fontSize:13,color:'#64748B',fontWeight:600,marginBottom:8}}>🚩 RED FLAGS</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:16}}>
                {result.redFlags?.length>0
                  ? result.redFlags.map((f: string,i: number)=>(<span key={i} style={{padding:'4px 12px',borderRadius:9999,background:'rgba(239,68,68,0.1)',color:'#EF4444',fontSize:12,border:'1px solid rgba(239,68,68,0.3)'}}>{f}</span>))
                  : <span style={{color:'#14F195',fontSize:14}}>✅ No red flags found</span>
                }
              </div>
              <div style={{fontSize:13,color:'#64748B',fontWeight:600,marginBottom:8}}>📦 PROGRAMS CALLED</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:16}}>
                {(result.programsInvolved||[]).map((p: string,i: number)=>(<span key={i} style={{padding:'4px 12px',borderRadius:9999,background:'#16161f',color:'#94A3B8',fontSize:12,border:'1px solid #1e1e2e'}}>{p}</span>))}
              </div>
              {result.balanceChanges && (
                <>
                  <div style={{fontSize:13,color:'#64748B',fontWeight:600,marginBottom:8}}>💰 BALANCE CHANGES</div>
                  <div style={{fontSize:14,color:result.balanceChanges.includes('-')?'#EF4444':'#14F195'}}>{result.balanceChanges}</div>
                </>
              )}
            </div>
          </div>
          <div style={{padding:'0 28px 28px',display:'flex',gap:12,flexWrap:'wrap'}}>
            <button onClick={shareResult} style={{padding:'10px 20px',borderRadius:8,border:'1px solid #1e1e2e',background:'#16161f',color:'#F8FAFC',cursor:'pointer',fontSize:14,fontWeight:600}}>{copied?'✅ Copied!':'📤 Share Result'}</button>
            <a href={`https://solscan.io/tx/${signature}`} target="_blank" rel="noopener noreferrer" style={{padding:'10px 20px',borderRadius:8,border:'1px solid #1e1e2e',background:'#16161f',color:'#F8FAFC',textDecoration:'none',fontSize:14,fontWeight:600}}>🔍 View on Solscan ↗</a>
          </div>
        </div>
      )}
    </div>
  )
}
