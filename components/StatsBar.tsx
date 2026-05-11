"use client"
import { useState, useEffect, useRef } from 'react'

const STATS = [
  { emoji: '🛡️', value: 47382, suffix: '', label: 'Txs Scanned' },
  { emoji: '🎯', value: 94, suffix: '.3%', label: 'Detection Accuracy' },
  { emoji: '⚡', value: 1, suffix: '.8s', label: 'Avg Analysis Time' },
  { emoji: '🚨', value: 7, suffix: '', label: 'Threat Categories' },
]

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const started = useRef(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const step = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          setCount(Math.floor(eased * target))
          if (t < 1) requestAnimationFrame(step)
          else setCount(target)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

function StatCard({ emoji, value, suffix, label }: typeof STATS[0]) {
  const { count, ref } = useCountUp(value)
  return (
    <div ref={ref} style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, padding: '20px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 24, marginBottom: 4 }}>{emoji}</div>
      <div style={{ fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg,#9945FF,#14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>{label}</div>
    </div>
  )
}

export default function StatsBar() {
  return (
    <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>
    </section>
  )
}
