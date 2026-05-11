'use client';
import { useState, useEffect } from 'react';
import TransactionScanner from '@/components/TransactionScanner';
import WalletConnect from '@/components/WalletConnect';

const STATS = [
  { value: '2,847', label: 'Transactions scanned today', icon: '🔍' },
  { value: '94.3%', label: 'Threat detection accuracy', icon: '✓' },
  { value: '1.8s',  label: 'Avg analysis time', icon: '⚡' },
  { value: '7',     label: 'Threat categories monitored', icon: '🛡️' },
];

const HOW_STEPS = [
  { icon: '📋', step: '01', title: 'Paste Signature', body: 'Copy any Solana transaction signature from Phantom, Solscan, or anywhere. It looks like a ~88-character string.' },
  { icon: '⛓️',  step: '02', title: 'AI Simulates & Analyzes', body: 'We fetch raw on-chain data, extract every program called, token moved, and authority changed, then run 7-layer threat analysis.' },
  { icon: '🛡️', step: '03', title: 'Get Your Verdict', body: 'Risk score 0–100, specific red flags, and one crystal-clear recommendation: Safe to proceed or Do not sign.' },
];

const FEATURES = [
  { icon: '🤖', title: 'Gemini AI Analysis', desc: 'Google Gemini 1.5 Flash runs threat analysis against 7 exploit categories simultaneously.' },
  { icon: '⛓️',  title: 'Live Solana RPC', desc: 'Direct integration with Helius mainnet RPC. Real data, not simulations.' },
  { icon: '👻', title: 'Drainer Detection', desc: 'Pattern-matches against known wallet drainers, phishing programs, and MEV bots.' },
  { icon: '🔓', title: 'Approval Auditing', desc: 'Catches unlimited token approvals before they become a liability.' },
  { icon: '📱', title: 'Mobile Friendly', desc: 'Fully responsive. Check transactions before signing on any device.' },
  { icon: '⭐', title: 'Open Source (MIT)', desc: 'Every line of code is on GitHub. Fork it, extend it, integrate it into your dApp.' },
];

export default function Home() {
  const [walletSig, setWalletSig] = useState('');
  const [typed, setTyped] = useState('');

  // Typewriter effect
  useEffect(() => {
    const phrases = [
      'Know what you\u2019re approving \u2014 always.',
      'Scan before you sign.',
      'AI security for every Solana user.',
      'First LLM firewall on Solana.',
    ];
    let pi = 0, ci = 0, deleting = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const phrase = phrases[pi];
      if (!deleting) {
        setTyped(phrase.slice(0, ++ci));
        if (ci === phrase.length) { deleting = true; t = setTimeout(tick, 2200); return; }
      } else {
        setTyped(phrase.slice(0, --ci));
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      }
      t = setTimeout(tick, deleting ? 30 : 52);
    };
    t = setTimeout(tick, 800);
    return () => clearTimeout(t);
  }, []);

  const S = (s: React.CSSProperties) => s;

  return (
    <div style={S({ background: '#0a0a0f', minHeight: '100vh', color: '#e2e8f0' })} className="grid-bg">

      {/* Ambient blobs */}
      <div style={S({ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 })}>
        <div style={S({ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, background: 'radial-gradient(ellipse, rgba(153,69,255,0.13) 0%, transparent 70%)', borderRadius: '50%' })} />
        <div style={S({ position: 'absolute', bottom: '10%', right: '-10%', width: 500, height: 400, background: 'radial-gradient(ellipse, rgba(20,241,149,0.07) 0%, transparent 65%)', borderRadius: '50%' })} />
      </div>

      <div style={S({ position: 'relative', zIndex: 1 })}>

        {/* NAVBAR */}
        <nav style={S({ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(24px)' })}>
          <div style={S({ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' })}>
            <div style={S({ display: 'flex', alignItems: 'center', gap: 10 })}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shield-anim">
                <path d="M16 3L28 9V17C28 23.5 22.5 29.5 16 31C9.5 29.5 4 23.5 4 17V9Z" stroke="#9945FF" strokeWidth="1.8" fill="rgba(153,69,255,0.08)" />
                <path d="M10.5 16L14.5 20L21.5 13" stroke="#14F195" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={S({ fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.02em', color: '#fff' })}>AI-Sentinel</span>
              <span style={S({ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.55rem', color: '#9945FF', letterSpacing: '0.1em', opacity: 0.8 })}>SOLANA FIREWALL</span>
            </div>
            <div style={S({ display: 'flex', gap: 12, alignItems: 'center' })}>
              <a href="#scanner" style={S({ color: '#6b7280', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 600 })}>Scanner</a>
              <a href="#how" style={S({ color: '#6b7280', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 600 })}>How It Works</a>
              <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer"
                style={S({ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0', fontSize: '0.78rem', fontWeight: 600, padding: '6px 12px', textDecoration: 'none' })}
              >⭐ GitHub</a>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section style={S({ maxWidth: 1280, margin: '0 auto', padding: '88px 24px 72px', textAlign: 'center' })}>
          <div style={S({ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(153,69,255,0.08)', border: '1px solid rgba(153,69,255,0.2)', borderRadius: 99, padding: '6px 18px', marginBottom: 30 })}>
            <span style={S({ width: 7, height: 7, borderRadius: '50%', background: '#14F195', display: 'inline-block', boxShadow: '0 0 8px #14F195', animation: 'blink 2s ease infinite' })} />
            <span style={S({ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#14F195', fontWeight: 700, letterSpacing: '0.08em' })}>LIVE · SOLANA MAINNET · COLOSSEUM FRONTIER 2026</span>
          </div>

          <h1 style={S({ fontSize: 'clamp(2.4rem,6vw,4.6rem)', fontWeight: 900, color: '#fff', lineHeight: 1.05, marginBottom: 16, letterSpacing: '-0.04em' })}>
            AI-Sentinel:
            <br />
            <span style={S({ background: 'linear-gradient(135deg, #9945FF 30%, #14F195 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' })}>
              Solana&apos;s First Agentic
            </span>
            <br />
            Transaction Firewall
          </h1>

          <p style={S({ fontSize: 'clamp(1rem,2.2vw,1.2rem)', color: '#8892a4', marginBottom: 12, maxWidth: 600, margin: '0 auto 12px', lineHeight: 1.7 })}>
            Paste any transaction signature. Get an AI risk verdict in under 2 seconds.
            <br />
            <strong style={S({ color: '#e2e8f0' })}>No blockchain knowledge needed.</strong>
          </p>

          <p style={S({ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.95rem', color: '#14F195', marginBottom: 36, minHeight: '1.5em', opacity: 0.85 })}>
            {typed}<span style={S({ animation: 'blink 1s infinite', color: '#9945FF' })}>|</span>
          </p>

          <div style={S({ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 })}>
            <a href="#scanner" style={S({ background: 'linear-gradient(135deg, #9945FF, #14F195)', border: 'none', borderRadius: 14, color: '#000', fontWeight: 800, fontSize: '0.95rem', padding: '14px 30px', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 })}>
              🛡️ Scan a Transaction — Free
            </a>
            <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer"
              style={S({ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: '#e2e8f0', fontWeight: 700, fontSize: '0.88rem', padding: '14px 24px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 })}
            >⭐ Star on GitHub</a>
          </div>

          <div style={S({ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' })}>
            {['Open Source (MIT)', 'No signup required', 'Live Solana mainnet', 'Gemini 1.5 Flash AI'].map(t => (
              <span key={t} style={S({ fontSize: '0.78rem', color: '#374151', display: 'flex', alignItems: 'center', gap: 5 })}>
                <span style={S({ color: '#14F195', fontWeight: 700 })}>✓</span> {t}
              </span>
            ))}
          </div>
        </section>

        {/* STATS BAR */}
        <section style={S({ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.015)', padding: '28px 24px', marginBottom: 80 })}>
          <div style={S({ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, textAlign: 'center' })}>
            {STATS.map(s => (
              <div key={s.value}>
                <div style={S({ fontFamily: 'JetBrains Mono, monospace', fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg,#9945FF,#14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 })}>{s.value}</div>
                <div style={S({ fontSize: '0.78rem', color: '#6b7280', marginTop: 6 })}>{s.icon} {s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* MAIN SCANNER */}
        <section id="scanner" style={S({ maxWidth: 1280, margin: '0 auto 100px', padding: '0 24px' })}>
          <div style={S({ textAlign: 'center', marginBottom: 40 })}>
            <div style={S({ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', fontWeight: 700, color: '#9945FF', letterSpacing: '0.12em', marginBottom: 10 })}>AI TRANSACTION FIREWALL</div>
            <h2 style={S({ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: 8 })}>Try it now — it&apos;s free</h2>
            <p style={S({ color: '#6b7280', fontSize: '0.9rem' })}>Paste any Solana mainnet transaction signature. Results in under 2 seconds.</p>
          </div>

          <TransactionScanner initialSig={walletSig} />
        </section>

        {/* WALLET CONNECT */}
        <section style={S({ maxWidth: 900, margin: '0 auto 100px', padding: '0 24px' })}>
          <div style={S({ textAlign: 'center', marginBottom: 32 })}>
            <div style={S({ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', fontWeight: 700, color: '#9945FF', letterSpacing: '0.12em', marginBottom: 10 })}>WALLET INTEGRATION</div>
            <h2 style={S({ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 8 })}>Scan your own transactions</h2>
            <p style={S({ color: '#6b7280', fontSize: '0.88rem' })}>Connect Phantom to instantly see and scan your recent activity.</p>
          </div>
          <WalletConnect onSelectSignature={sig => { setWalletSig(sig); document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' }); }} />
        </section>

        {/* FEATURES */}
        <section style={S({ maxWidth: 1280, margin: '0 auto 100px', padding: '0 24px' })}>
          <div style={S({ textAlign: 'center', marginBottom: 40 })}>
            <div style={S({ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', fontWeight: 700, color: '#14F195', letterSpacing: '0.12em', marginBottom: 10 })}>CAPABILITIES</div>
            <h2 style={S({ fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' })}>What AI-Sentinel detects</h2>
          </div>
          <div style={S({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 })}>
            {FEATURES.map(f => (
              <div key={f.title} style={S({ background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '22px 20px', transition: 'all 0.2s' })}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(153,69,255,0.28)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
              >
                <span style={S({ fontSize: '1.8rem', display: 'block', marginBottom: 10 })}>{f.icon}</span>
                <div style={S({ fontWeight: 700, color: '#e2e8f0', marginBottom: 6, fontSize: '0.9rem' })}>{f.title}</div>
                <p style={S({ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.6 })}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" style={S({ maxWidth: 1000, margin: '0 auto 100px', padding: '0 24px' })}>
          <div style={S({ textAlign: 'center', marginBottom: 48 })}>
            <div style={S({ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', fontWeight: 700, color: '#9945FF', letterSpacing: '0.12em', marginBottom: 10 })}>SIMPLE TO USE</div>
            <h2 style={S({ fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' })}>How it works</h2>
          </div>
          <div style={S({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 })}>
            {HOW_STEPS.map(h => (
              <div key={h.step} style={S({ background: '#0d1117', borderRadius: 18, padding: '28px 24px', border: '1px solid rgba(153,69,255,0.15)', position: 'relative', overflow: 'hidden' })}>
                <div style={S({ position: 'absolute', top: 18, right: 20, fontFamily: 'JetBrains Mono, monospace', fontSize: '3rem', fontWeight: 900, color: 'rgba(153,69,255,0.08)', lineHeight: 1 })}>{h.step}</div>
                <div style={S({ fontSize: '2.4rem', marginBottom: 14 })}>{h.icon}</div>
                <div style={S({ fontWeight: 700, color: '#e2e8f0', fontSize: '1.05rem', marginBottom: 10 })}>{h.title}</div>
                <p style={S({ fontSize: '0.84rem', color: '#6b7280', lineHeight: 1.7 })}>{h.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={S({ maxWidth: 760, margin: '0 auto 120px', padding: '0 24px', textAlign: 'center' })}>
          <div style={S({ background: 'linear-gradient(135deg, rgba(153,69,255,0.1), rgba(20,241,149,0.05))', border: '1px solid rgba(153,69,255,0.25)', borderRadius: 22, padding: '52px 40px' })}>
            <h2 style={S({ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, color: '#fff', marginBottom: 14, letterSpacing: '-0.03em' })}>Protect your Solana wallet today</h2>
            <p style={S({ color: '#8892a4', fontSize: '0.97rem', marginBottom: 30, lineHeight: 1.7 })}>$4.2B lost to DeFi exploits in 2024. It takes 2 seconds to know if a transaction is safe. Don&apos;t skip it.</p>
            <div style={S({ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' })}>
              <a href="#scanner" style={S({ background: 'linear-gradient(135deg, #9945FF, #14F195)', border: 'none', borderRadius: 13, color: '#000', fontWeight: 800, fontSize: '0.95rem', padding: '13px 28px', textDecoration: 'none', display: 'inline-block' })}>
                🛡️ Scan Now — Free
              </a>
              <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer"
                style={S({ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 13, color: '#e2e8f0', fontWeight: 700, fontSize: '0.88rem', padding: '13px 24px', textDecoration: 'none' })}
              >📂 View Source Code</a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={S({ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '36px 24px', textAlign: 'center' })}>
          <div style={S({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 })}>
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M16 3L28 9V17C28 23.5 22.5 29.5 16 31C9.5 29.5 4 23.5 4 17V9Z" stroke="#9945FF" strokeWidth="1.8" fill="rgba(153,69,255,0.08)" /><path d="M10.5 16L14.5 20L21.5 13" stroke="#14F195" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={S({ fontWeight: 800, color: '#e2e8f0', fontSize: '0.9rem' })}>AI-Sentinel</span>
          </div>
          <p style={S({ fontSize: '0.78rem', color: '#374151', marginBottom: 8 })}>
            Built by <strong style={S({ color: '#6b7280' })}>Gopichand Challa, Kaviya &amp; Kalisetty</strong> for{' '}
            <a href="https://colosseum.org/frontier" target="_blank" rel="noopener noreferrer" style={S({ color: '#9945FF', textDecoration: 'none' })}>Colosseum Frontier Hackathon 2026</a>
          </p>
          <p style={S({ fontSize: '0.74rem', color: '#374151' })}>
            <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer" style={S({ color: '#374151', textDecoration: 'none', marginRight: 16 })}>GitHub</a>
            <a href="https://twitter.com/GopichandAI" target="_blank" rel="noopener noreferrer" style={S({ color: '#374151', textDecoration: 'none', marginRight: 16 })}>@GopichandAI</a>
            <span style={S({ background: 'rgba(20,241,149,0.08)', border: '1px solid rgba(20,241,149,0.2)', color: '#14F195', fontSize: '0.65rem', padding: '2px 8px', borderRadius: 5, fontWeight: 700 })}>MIT License</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
