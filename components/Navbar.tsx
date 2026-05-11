'use client';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Scanner', href: '#scanner' },
  { label: 'MEV Detector', href: '#mev' },
  { label: 'Address Intel', href: '#address' },
  { label: 'How It Works', href: '#how' },
  { label: 'Pricing', href: '#business' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(10,10,15,0.92)' : 'rgba(10,10,15,0.5)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid rgba(153,69,255,0.2)' : '1px solid transparent',
      transition: 'all 0.3s ease',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', height: 60, gap: 16 }}>
        {/* Logo */}
        <a href="#top" onClick={e => { e.preventDefault(); scrollTo('#top'); }} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 3L28 9V17C28 23.5 22.5 29.5 16 31C9.5 29.5 4 23.5 4 17V9Z" stroke="#9945FF" strokeWidth="1.6" fill="rgba(153,69,255,0.1)"/>
            <path d="M10.5 16L14.5 20L21.5 13" stroke="#14F195" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontWeight: 900, fontSize: 16, background: 'linear-gradient(135deg,#9945FF,#14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI-Sentinel</span>
        </a>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: 4, flex: 1, justifyContent: 'center' }} className="nav-desktop">
          {NAV_LINKS.map(l => (
            <button key={l.label} onClick={() => scrollTo(l.href)} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '6px 12px',
              borderRadius: 8, transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff', e.currentTarget.style.background = 'rgba(153,69,255,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)', e.currentTarget.style.background = 'none')}
            >{l.label}</button>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#14F195', boxShadow: '0 0 8px #14F195', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 11, color: '#14F195', fontWeight: 700 }}>LIVE</span>
          <button
            onClick={() => scrollTo('#scanner')}
            style={{
              background: 'linear-gradient(135deg,#9945FF,#14F195)', border: 'none',
              borderRadius: 8, padding: '7px 16px', color: '#0a0a0f',
              fontWeight: 800, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >🛡️ Try Now</button>
          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="nav-hamburger" style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
            padding: '6px 10px', color: '#fff', cursor: 'pointer', fontSize: 16, display: 'none',
          }}>☰</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(10,10,15,0.98)', borderTop: '1px solid rgba(153,69,255,0.2)',
          padding: '12px 24px 20px',
        }}>
          {NAV_LINKS.map(l => (
            <button key={l.label} onClick={() => scrollTo(l.href)} style={{
              display: 'block', width: '100%', textAlign: 'left',
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)',
              fontSize: 15, fontWeight: 600, cursor: 'pointer', padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>{l.label}</button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 680px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
      `}</style>
    </nav>
  );
}
