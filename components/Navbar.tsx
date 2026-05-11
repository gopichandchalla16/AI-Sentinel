"use client"
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'rgba(10,10,15,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid #1e1e2e' : '1px solid transparent',
      transition: 'all 0.3s',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => scrollTo('top')}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 3L28 9V17C28 23.5 22.5 29.5 16 31C9.5 29.5 4 23.5 4 17V9Z" stroke="#9945FF" strokeWidth="1.8" fill="rgba(153,69,255,0.1)" />
            <path d="M10.5 16L14.5 20L21.5 13" stroke="#14F195" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontWeight: 800, fontSize: 17, background: 'linear-gradient(135deg,#9945FF,#14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI-Sentinel</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.2)', borderRadius: 9999 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#14F195', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#14F195', letterSpacing: '0.08em' }}>LIVE</span>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { label: 'Scanner', id: 'tabs' },
            { label: 'Wallet', id: 'tabs' },
            { label: 'How It Works', id: 'how' },
            { label: 'Business', id: 'business' },
          ].map(({ label, id }) => (
            <button key={label} onClick={() => scrollTo(id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 13, fontWeight: 500, padding: '6px 10px', borderRadius: 8, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#F8FAFC'}
              onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
            >{label}</button>
          ))}
          <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer"
            style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#111118', border: '1px solid #1e1e2e', borderRadius: 8, color: '#F8FAFC', fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#9945FF')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e2e')}
          >⭐ GitHub</a>
        </div>
      </div>
    </nav>
  )
}
