"use client"
import { useState, useRef, useEffect } from 'react'
type ChatMessage = { role: 'user'|'ai'; content: string; timestamp: Date }
const SUGGESTIONS = [
  'Is my money at risk?',
  'What exactly is this program doing?',
  'Should I sign this transaction?',
  'Explain the red flags in simple terms',
  'Explain this like I\'ve never used crypto before',
  'How does this compare to a normal bank transfer?',
  'Who sent money and who received it?',
]
export default function TransactionChat({ result, signature }: { result: any; signature: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])
  const handleSend = async (q?: string) => {
    const question = q || input
    if (!question.trim() || isTyping) return
    setInput('')
    setMessages(prev => [...prev, { role:'user', content:question, timestamp:new Date() }])
    setIsTyping(true)
    try {
      const res = await fetch('/api/tx-chat', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ question, analysisResult:result, signature }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role:'ai', content:data.reply, timestamp:new Date() }])
    } catch {
      setMessages(prev => [...prev, { role:'ai', content:'Sorry, I could not process your question. Please try again.', timestamp:new Date() }])
    }
    setIsTyping(false)
  }
  const fmt = (d: Date) => d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
  return (
    <div style={{background:'#111118',border:'1px solid #1e1e2e',borderRadius:16,overflow:'hidden',marginBottom:24}}>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
      <div style={{padding:'20px 24px',borderBottom:'1px solid #1e1e2e'}}>
        <div style={{fontSize:18,fontWeight:700,color:'#F8FAFC',marginBottom:4}}>💬 Ask AI About This Transaction</div>
        <div style={{fontSize:13,color:'#94A3B8'}}>Have questions? Ask in plain English — no crypto knowledge needed.</div>
      </div>
      {messages.length===0 && (
        <div style={{padding:'20px 24px',borderBottom:'1px solid #1e1e2e'}}>
          <div style={{fontSize:13,color:'#64748B',marginBottom:12,fontWeight:600}}>SUGGESTED QUESTIONS</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {SUGGESTIONS.map(s=>(
              <button key={s} onClick={()=>handleSend(s)} style={{padding:'8px 16px',borderRadius:9999,border:'1px solid #1e1e2e',background:'rgba(153,69,255,0.06)',color:'#94A3B8',fontSize:13,cursor:'pointer',transition:'all 0.2s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='#9945FF';e.currentTarget.style.color='#9945FF'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='#1e1e2e';e.currentTarget.style.color='#94A3B8'}}>{s}</button>
            ))}
          </div>
        </div>
      )}
      <div style={{maxHeight:400,overflowY:'auto',padding:16,display:'flex',flexDirection:'column',gap:12}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:'flex',flexDirection:'column',alignItems:m.role==='user'?'flex-end':'flex-start'}}>
            <div style={m.role==='user'?{background:'rgba(153,69,255,0.15)',border:'1px solid rgba(153,69,255,0.3)',borderRadius:'16px 16px 2px 16px',padding:'12px 16px',maxWidth:'75%',color:'#F8FAFC',fontSize:14}:{background:'#16161f',border:'1px solid #1e1e2e',borderRadius:'16px 16px 16px 2px',padding:'12px 16px',maxWidth:'75%',color:'#F8FAFC',fontSize:14}}>
              {m.role==='ai'&&<span style={{marginRight:6}}>🛡️</span>}{m.content}
            </div>
            <div style={{fontSize:11,color:'#64748B',marginTop:4}}>{fmt(m.timestamp)}</div>
          </div>
        ))}
        {isTyping && (
          <div style={{display:'flex',alignItems:'center',gap:4,background:'#16161f',border:'1px solid #1e1e2e',borderRadius:'16px 16px 16px 2px',padding:'12px 16px',width:'fit-content'}}>
            <span style={{fontSize:12,color:'#94A3B8',marginRight:4}}>AI-Sentinel is thinking</span>
            {[0,1,2].map(i=>(<div key={i} style={{width:6,height:6,borderRadius:'50%',background:'#9945FF',animation:'bounce 1.2s infinite',animationDelay:i*0.2+'s'}} />))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{padding:16,borderTop:'1px solid #1e1e2e',display:'flex',gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();handleSend()}}} placeholder="Ask anything about this transaction..." style={{flex:1,padding:'12px 16px',borderRadius:10,border:'1px solid #1e1e2e',background:'#16161f',color:'#F8FAFC',fontSize:14,outline:'none'}} onFocus={e=>e.target.style.borderColor='#9945FF'} onBlur={e=>e.target.style.borderColor='#1e1e2e'} />
        <button onClick={()=>handleSend()} disabled={isTyping} style={{padding:'12px 20px',borderRadius:10,fontWeight:700,background:'linear-gradient(135deg,#9945FF,#14F195)',color:'#0a0a0f',border:'none',cursor:'pointer',fontSize:14,whiteSpace:'nowrap'}}>Send →</button>
      </div>
    </div>
  )
}
