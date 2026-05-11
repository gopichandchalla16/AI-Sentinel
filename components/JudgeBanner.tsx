"use client"
export default function JudgeBanner() {
  return (
    <div style={{background:'rgba(153,69,255,0.05)',borderTop:'1px solid rgba(153,69,255,0.2)',borderBottom:'1px solid rgba(153,69,255,0.2)',padding:'12px 24px',textAlign:'center',fontSize:13,color:'#94A3B8'}}>
      🏆 Submitted to{' '}
      <span style={{color:'#9945FF',fontWeight:700}}>Colosseum Frontier Hackathon 2026</span>
      {' '}· Track: AI Platforms / Agents · Team: Gopichand, Kaviya, Kalisetty ·{' '}
      <a href="https://colosseum.org/frontier" target="_blank" rel="noopener noreferrer" style={{color:'#14F195',textDecoration:'none'}}>colosseum.org/frontier ↗</a>
    </div>
  )
}
