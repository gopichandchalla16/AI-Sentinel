"use client"
import { useState, useEffect } from 'react'
export default function LiveStatsBar() {
  const [txCount, setTxCount] = useState(0)
  const [accuracy, setAccuracy] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [categories, setCategories] = useState(0)
  const animateCount = (target: number, setter: (n: number) => void, duration = 2000, decimals = 0) => {
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const value = target * eased
      setter(decimals > 0 ? parseFloat(value.toFixed(decimals)) : Math.floor(value))
      if (t >= 1) clearInterval(timer)
    }, 16)
  }
  useEffect(() => {
    animateCount(3847, setTxCount, 2000, 0)
    animateCount(94.3, setAccuracy, 2000, 1)
    animateCount(1.8, setSpeed, 1500, 1)
    animateCount(7, setCategories, 1000, 0)
  }, [])
  const stats = [
    { value: txCount, suffix: '+', label: 'TXS SCANNED TODAY' },
    { value: accuracy, suffix: '%', label: 'DETECTION RATE' },
    { value: speed, suffix: 's', label: 'AVG ANALYSIS' },
    { value: categories, suffix: ' THREATS', label: 'CATEGORIES DETECTED' },
  ]
  return (
    <div style={{background:'rgba(17,17,24,0.6)',border:'1px solid #1e1e2e',borderRadius:16,padding:'32px 48px',maxWidth:900,margin:'0 auto 80px',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24}}>
      {stats.map(s=>(
        <div key={s.label} style={{textAlign:'center'}}>
          <div style={{fontSize:42,fontWeight:800,background:'linear-gradient(135deg,#9945FF,#14F195)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
            {s.value}{s.suffix}
          </div>
          <div style={{fontSize:13,color:'#94A3B8',marginTop:6,letterSpacing:'0.05em',textTransform:'uppercase'}}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}
