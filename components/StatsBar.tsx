"use client"
import { useEffect, useState } from 'react'

function useCountUp(target: number, duration: number = 2000) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(target * eased))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return value
}

const STATS = [
  { label: 'Transactions Scanned', target: 48291, suffix: '+' },
  { label: 'Threats Detected', target: 3847, suffix: '+' },
  { label: 'Wallets Protected', target: 12043, suffix: '+' },
  { label: 'Programs Verified', target: 891, suffix: '+' },
]

function StatItem({ label, target, suffix }: { label: string; target: number; suffix: string }) {
  const val = useCountUp(target)
  return (
    <div className="text-center px-6 py-4">
      <div className="text-2xl font-extrabold" style={{ color: '#14F195' }}>
        {val.toLocaleString()}{suffix}
      </div>
      <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>{label}</div>
    </div>
  )
}

export default function StatsBar() {
  return (
    <div className="relative z-10 border-y border-[#1e1e2e] my-6" style={{ backgroundColor: '#111118' }}>
      <div className="max-w-5xl mx-auto flex flex-wrap justify-around divide-x divide-[#1e1e2e]">
        {STATS.map(s => <StatItem key={s.label} {...s} />)}
      </div>
    </div>
  )
}
