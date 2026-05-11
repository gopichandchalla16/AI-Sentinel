'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import type { AnalysisResult, RiskLevel } from '@/app/types';
export type { AnalysisResult };

// ── Phantom wallet type ────────────────────────────────────────────────────
interface PhantomProvider {
  publicKey: { toString: () => string } | null;
  isConnected: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  isPhantom: boolean;
}

// ── Constants ──────────────────────────────────────────────────────────────
const RPC = process.env.NEXT_PUBLIC_HELIUS_RPC || 'https://api.mainnet-beta.solana.com';

const RISK_CFG: Record<RiskLevel, {
  color: string; bg: string; border: string; glow: string;
  label: string; emoji: string; action: string;
}> = {
  LOW:      { color:'#00ff88', bg:'rgba(0,255,136,0.07)',  border:'rgba(0,255,136,0.3)',  glow:'rgba(0,255,136,0.15)',  label:'Low Risk',      emoji:'✅', action:'SAFE TO PROCEED' },
  MEDIUM:   { color:'#ffcc00', bg:'rgba(255,204,0,0.07)',  border:'rgba(255,204,0,0.3)',  glow:'rgba(255,204,0,0.12)',  label:'Medium Risk',   emoji:'⚡', action:'PROCEED WITH CAUTION' },
  HIGH:     { color:'#ff6400', bg:'rgba(255,100,0,0.07)',  border:'rgba(255,100,0,0.3)',  glow:'rgba(255,100,0,0.12)',  label:'High Risk',     emoji:'⚠️', action:'REVIEW CAREFULLY' },
  CRITICAL: { color:'#ff3366', bg:'rgba(255,51,102,0.09)', border:'rgba(255,51,102,0.4)', glow:'rgba(255,51,102,0.18)', label:'Critical Risk', emoji:'🚨', action:'DO NOT SIGN' },
};

const EXAMPLES = [
  { label:'✅ Safe Transfer',  sig:'5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLiReNmM8bc5Dg4hKnfRd8SZ5KhNnJKLqHHnQvC7t3H', type:'low' },
  { label:'🔄 Token Swap',     sig:'3HfUyXjFmtGWPBmrhVDVGkFgpzuAqNNM7HLzfUyxvSzCWsCAXwpFP3M2FH8bBj2SEPrxRqRuSqHX7JMxCqBqsJX', type:'medium' },
  { label:'🎨 NFT Transfer',   sig:'2Vhw2k3m4LTKqGqUCH9c7HxpK8GBCmN4u7sfBq2gvzf8d9vXVpLPz8UKJ6tMxCAmqBhKNPUQjvBb7JNQTNq2X6r', type:'low' },
];

const HOW_IT_WORKS = [
  { step:'01', icon:'🔍', title:'Paste Any Transaction', desc:'Copy any Solana transaction ID from your wallet, Solscan, or anywhere. It looks like a long string of letters and numbers.' },
  { step:'02', icon:'⛓️', title:'We Fetch Live Blockchain Data', desc:'AI-Sentinel instantly pulls the raw transaction data from the Solana blockchain — programs called, accounts touched, SOL moved.' },
  { step:'03', icon:'🤖', title:'AI Analyzes for Threats', desc:'Our Gemini 1.5 Flash AI model runs the data through 7 threat categories: phishing, drainers, exploits, rug pulls, and more.' },
  { step:'04', icon:'🛡️', title:'You Get a Plain-English Verdict', desc:'You receive a risk score (0–100), specific red flags, and one clear recommendation: Safe to proceed or Do not sign.' },
];

const WHY_MATTERS = [
  { icon:'💸', stat:'$4.2B', label:'Lost to crypto exploits in 2024', color:'#ff3366' },
  { icon:'😰', stat:'99%', label:'of users cannot read raw blockchain data', color:'#ffcc00' },
  { icon:'⚡', stat:'<2s', label:'Time for AI-Sentinel to analyze any transaction', color:'#00ff88' },
  { icon:'🎯', stat:'7', label:'Threat categories checked per transaction', color:'#9945ff' },
];

const THREAT_CATEGORIES = [
  { name:'Wallet Drainers', desc:'Contracts that secretly transfer all your tokens', icon:'🕳️' },
  { name:'Phishing Programs', desc:'Fake dApps mimicking legitimate protocols', icon:'🎣' },
  { name:'Unlimited Approvals', desc:'Permissions that let apps take tokens forever', icon:'🔓' },
  { name:'Rug Pull Patterns', desc:'Liquidity removal and creator exit signals', icon:'🚪' },
  { name:'MEV Exploits', desc:'Front-running and sandwich attack signatures', icon:'🥪' },
  { name:'Flash Loan Attacks', desc:'Complex multi-step exploit patterns', icon:'⚡' },
  { name:'Unknown Programs', desc:'Unverified contracts with no track record', icon:'❓' },
];

const TECH_STACK = [
  { name:'Google Gemini 1.5 Flash', role:'AI threat analysis engine', color:'#4285f4', icon:'🤖' },
  { name:'Solana Mainnet RPC', role:'Live on-chain data in <200ms', color:'#9945ff', icon:'⛓️' },
  { name:'Next.js 14 + TypeScript', role:'Production-grade frontend', color:'#00ff88', icon:'⚡' },
  { name:'Phantom Wallet Adapter', role:'Secure wallet connection', color:'#ab9ff2', icon:'👻' },
  { name:'Vercel Edge Network', role:'Global sub-100ms deployment', color:'#fff', icon:'🌐' },
];

// ── Main Component ─────────────────────────────────────────────────────────
export default function Home() {
  const [sig, setSig]           = useState('');
  const [result, setResult]     = useState<AnalysisResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [copied, setCopied]     = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);
  const [wallet, setWallet]     = useState<string|null>(null);
  const [balance, setBalance]   = useState<number|null>(null);
  const [history, setHistory]   = useState<{sig:string;risk:RiskLevel;time:string;score:number}[]>([]);
  const [tab, setTab]           = useState<'scan'|'about'|'history'>('scan');
  const [typed, setTyped]       = useState('');
  const scanRef = useRef<HTMLDivElement>(null);

  // Typewriter
  useEffect(() => {
    const phrases = ['Scan before you sign.', 'AI security for every Solana user.', 'Know what you\'re signing — always.', 'Protect your wallet in 2 seconds.'];
    let pi = 0, ci = 0, del = false;
    const tick = () => {
      const p = phrases[pi];
      if (!del) {
        setTyped(p.slice(0, ++ci));
        if (ci === p.length) { del = true; setTimeout(tick, 2200); return; }
      } else {
        setTyped(p.slice(0, --ci));
        if (ci === 0) { del = false; pi = (pi+1)%phrases.length; }
      }
      setTimeout(tick, del ? 35 : 58);
    };
    const t = setTimeout(tick, 800);
    return () => clearTimeout(t);
  }, []);

  // Phantom helpers
  const getPhantom = useCallback((): PhantomProvider|null => {
    if (typeof window === 'undefined') return null;
    const w = window as unknown as { solana?: PhantomProvider };
    return w.solana?.isPhantom ? w.solana : null;
  }, []);

  const connectWallet = async () => {
    const ph = getPhantom();
    if (!ph) { window.open('https://phantom.app/','_blank'); return; }
    try {
      const r = await ph.connect();
      const addr = r.publicKey.toString();
      setWallet(addr);
      const conn = new Connection(RPC, 'confirmed');
      const bal = await conn.getBalance(new PublicKey(addr));
      setBalance(bal / 1e9);
    } catch(e) { console.error(e); }
  };

  const disconnectWallet = async () => {
    const ph = getPhantom();
    if (ph) await ph.disconnect();
    setWallet(null); setBalance(null);
  };

  // Analyze
  const analyze = async (signature?: string) => {
    const target = (signature || sig).trim();
    if (!target) { setError('Please paste a Solana transaction signature.'); return; }
    setLoading(true); setError(''); setResult(null);

    const steps = [
      [8,  'Fetching transaction from Solana mainnet...'],
      [30, 'Parsing programs and account instructions...'],
      [55, 'Running Gemini AI threat analysis...'],
      [80, 'Scoring 7 threat categories...'],
      [92, 'Generating plain-English report...'],
    ] as [number, string][];
    steps.forEach(([v, label], i) => setTimeout(() => { setProgress(v); setProgressLabel(label); }, i * 380));

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setProgress(100); setProgressLabel('Analysis complete!');
      setTimeout(() => { setProgress(0); setProgressLabel(''); }, 1200);
      setResult(data as AnalysisResult);
      setHistory(prev => [{ sig: target.slice(0,20)+'...', risk: data.riskLevel, time: new Date().toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'}), score: data.riskScore }, ...prev.slice(0,9)]);
      setTimeout(() => scanRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 200);
    } catch(e: unknown) {
      setError(e instanceof Error ? e.message : 'Analysis failed. Please check the signature and try again.');
      setProgress(0); setProgressLabel('');
    } finally {
      setLoading(false);
    }
  };

  const scrollToScanner = () => document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' });

  const risk = result ? RISK_CFG[result.riskLevel] : null;

  return (
    <div className="app-bg grid-bg">

      {/* ══════════════════ HEADER ══════════════════ */}
      <header style={{ position:'sticky', top:0, zIndex:50, borderBottom:'1px solid rgba(0,255,136,0.08)', background:'rgba(2,4,8,0.85)', backdropFilter:'blur(24px)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>

          {/* Logo */}
          <a href="#" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2 L19 6.5 L19 13.5 C19 17.5 15.5 21 11 22 C6.5 21 3 17.5 3 13.5 L3 6.5 Z" fill="none" stroke="#00ff88" strokeWidth="1.5"/>
                <path d="M7.5 11 L10 13.5 L14.5 8.5" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:'1rem', color:'#fff', letterSpacing:'-0.02em' }}>AI-Sentinel</div>
              <div className="mono" style={{ fontSize:'0.6rem', color:'#00ff88', letterSpacing:'0.1em' }}>SOLANA GUARD</div>
            </div>
          </a>

          {/* Nav */}
          <nav style={{ display:'flex', gap:4 }}>
            {(['scan','about','history'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding:'7px 16px', borderRadius:9, border:`1px solid ${tab===t ? 'rgba(0,255,136,0.3)' : 'transparent'}`, background: tab===t ? 'rgba(0,255,136,0.1)' : 'transparent', color: tab===t ? '#00ff88' : '#8892a4', fontSize:'0.8rem', fontWeight:600, cursor:'pointer', transition:'all 0.2s', textTransform:'capitalize' }}>{t}</button>
            ))}
          </nav>

          {/* Wallet */}
          {wallet ? (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.2)', borderRadius:9, padding:'6px 12px', fontSize:'0.75rem' }}>
                <span className="mono" style={{ color:'#00ff88', fontWeight:700 }}>◎ {balance?.toFixed(3)}</span>
              </div>
              <button onClick={disconnectWallet} className="btn-secondary" style={{ fontSize:'0.72rem', padding:'6px 12px' }}>
                {wallet.slice(0,4)}...{wallet.slice(-4)}
              </button>
            </div>
          ) : (
            <button onClick={connectWallet} className="btn-ghost">
              👻 Connect Phantom
            </button>
          )}
        </div>
      </header>

      {/* ══════════════════ SCAN TAB ══════════════════ */}
      {tab === 'scan' && (
        <>

          {/* ── HERO ── */}
          <section style={{ maxWidth:1280, margin:'0 auto', padding:'80px 24px 60px', textAlign:'center' }}>

            {/* Live badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(0,255,136,0.07)', border:'1px solid rgba(0,255,136,0.18)', borderRadius:99, padding:'7px 18px', marginBottom:28 }}>
              <span className="pulse-dot" style={{ width:7, height:7, borderRadius:'50%', background:'#00ff88', display:'inline-block', boxShadow:'0 0 10px #00ff88' }}></span>
              <span className="mono" style={{ fontSize:'0.72rem', color:'#00ff88', fontWeight:700, letterSpacing:'0.08em' }}>LIVE ON SOLANA MAINNET — Frontier Hackathon 2026</span>
            </div>

            {/* Headline */}
            <h1 style={{ fontSize:'clamp(2.8rem, 7vw, 5rem)', fontWeight:900, color:'#fff', lineHeight:1.05, marginBottom:20, letterSpacing:'-0.04em' }}>
              The AI Security Layer
              <br />
              <span style={{ background:'linear-gradient(135deg, #9945ff 30%, #19fb9b 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                for Solana
              </span>
            </h1>

            {/* Subline */}
            <p style={{ fontSize:'1.2rem', color:'#8892a4', marginBottom:16, maxWidth:600, margin:'0 auto 16px', lineHeight:1.6 }}>
              Paste any transaction signature. Get an instant AI verdict —
              <br />
              <strong style={{ color:'#e2e8f0' }}>safe or dangerous</strong> — in plain English. No blockchain knowledge needed.
            </p>

            {/* Typewriter */}
            <p className="cursor mono" style={{ fontSize:'1rem', color:'#00ff88', marginBottom:40, minHeight:'1.5em', opacity:0.8 }}>{typed}</p>

            {/* CTA */}
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <button className="btn-primary" onClick={scrollToScanner} style={{ display:'flex', alignItems:'center', gap:8 }}>
                🛡️ Scan a Transaction Free
              </button>
              <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display:'flex', alignItems:'center', gap:6, textDecoration:'none' }}>
                ⭐ Star on GitHub
              </a>
            </div>

            {/* Trust bar */}
            <div style={{ display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap', marginTop:36 }}>
              {['Open Source (MIT)', 'No wallet required to scan', 'Free to use', '< 2 second analysis'].map(t => (
                <span key={t} style={{ fontSize:'0.78rem', color:'#4a5568', display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ color:'#00ff88' }}>✓</span> {t}
                </span>
              ))}
            </div>
          </section>

          {/* ── WHY IT MATTERS ── */}
          <section style={{ maxWidth:1280, margin:'0 auto 64px', padding:'0 24px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16 }}>
              {WHY_MATTERS.map(w => (
                <div key={w.stat} className="card" style={{ padding:'24px 20px', textAlign:'center' }}>
                  <div style={{ fontSize:'2rem', marginBottom:10 }}>{w.icon}</div>
                  <div style={{ fontSize:'2.2rem', fontWeight:900, color:w.color, fontFamily:'JetBrains Mono', letterSpacing:'-0.03em', lineHeight:1 }}>{w.stat}</div>
                  <div style={{ fontSize:'0.78rem', color:'#6b7280', marginTop:8, lineHeight:1.5 }}>{w.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── HOW IT WORKS ── */}
          <section style={{ maxWidth:1280, margin:'0 auto 80px', padding:'0 24px' }}>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <div className="mono" style={{ fontSize:'0.72rem', color:'#00ff88', letterSpacing:'0.15em', marginBottom:12 }}>HOW IT WORKS</div>
              <h2 style={{ fontSize:'clamp(1.8rem, 4vw, 2.8rem)', fontWeight:800, color:'#fff', letterSpacing:'-0.03em' }}>Simple for everyone.</h2>
              <p style={{ color:'#6b7280', marginTop:12, fontSize:'1rem', maxWidth:480, margin:'12px auto 0' }}>You don't need to understand blockchain. We explain everything in plain English.</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:20 }}>
              {HOW_IT_WORKS.map((h, i) => (
                <div key={h.step} className="card card-hover-lift" style={{ padding:'28px 24px', position:'relative', overflow:'hidden' }}>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div style={{ position:'absolute', top:32, right:-20, color:'rgba(0,255,136,0.2)', fontSize:'1.2rem', display:'none' }}>→</div>
                  )}
                  <div className="mono" style={{ fontSize:'0.65rem', color:'rgba(0,255,136,0.4)', letterSpacing:'0.1em', marginBottom:14 }}>STEP {h.step}</div>
                  <div style={{ fontSize:'2.2rem', marginBottom:14 }}>{h.icon}</div>
                  <div style={{ fontWeight:700, color:'#e2e8f0', marginBottom:10, fontSize:'1rem' }}>{h.title}</div>
                  <p style={{ fontSize:'0.83rem', color:'#6b7280', lineHeight:1.65 }}>{h.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── SCANNER ── */}
          <section id="scanner" ref={scanRef} style={{ maxWidth:1280, margin:'0 auto 80px', padding:'0 24px' }}>
            <div style={{ textAlign:'center', marginBottom:40 }}>
              <div className="mono" style={{ fontSize:'0.72rem', color:'#9945ff', letterSpacing:'0.15em', marginBottom:12 }}>AI TRANSACTION SCANNER</div>
              <h2 style={{ fontSize:'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight:800, color:'#fff', letterSpacing:'-0.03em' }}>Try it now — it's free</h2>
              <p style={{ color:'#6b7280', marginTop:10, fontSize:'0.9rem' }}>Paste any Solana transaction signature below</p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap:24, transition:'grid-template-columns 0.4s' }}>

              {/* Input panel */}
              <div className="card" style={{ padding:32 }}>
                {/* Wallet hint */}
                {wallet && (
                  <div style={{ background:'rgba(153,69,255,0.07)', border:'1px solid rgba(153,69,255,0.2)', borderRadius:12, padding:'12px 16px', marginBottom:20, display:'flex', alignItems:'center', gap:8 }}>
                    <span>👻</span>
                    <span style={{ fontSize:'0.8rem', color:'#c4b5fd' }}>Wallet connected: {wallet.slice(0,6)}...{wallet.slice(-4)}</span>
                  </div>
                )}

                {/* Textarea */}
                <label style={{ display:'block', fontSize:'0.72rem', fontWeight:700, color:'#4a5568', marginBottom:10, letterSpacing:'0.1em' }} className="mono">TRANSACTION SIGNATURE</label>
                <textarea
                  value={sig}
                  onChange={e => setSig(e.target.value)}
                  onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); analyze(); } }}
                  placeholder="Paste a Solana transaction signature here...&#10;Example: 5VERv8NMvzbJ...H3H"
                  rows={4}
                  className="input-glow mono"
                  style={{ width:'100%', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'14px 16px', color:'#e2e8f0', fontSize:'0.82rem', resize:'vertical', transition:'border-color 0.2s, box-shadow 0.2s', lineHeight:1.6 }}
                />
                <p style={{ fontSize:'0.72rem', color:'#374151', marginTop:6 }}>Press Enter to scan · Shift+Enter for new line</p>

                {/* Examples */}
                <div style={{ marginTop:18, marginBottom:20 }}>
                  <div className="mono" style={{ fontSize:'0.68rem', color:'#374151', marginBottom:10, letterSpacing:'0.08em' }}>QUICK EXAMPLES (real mainnet transactions):</div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {EXAMPLES.map(ex => (
                      <button key={ex.label} onClick={() => { setSig(ex.sig); analyze(ex.sig); }} className="btn-secondary" style={{ fontSize:'0.72rem', padding:'5px 12px' }}>
                        {ex.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                {loading && (
                  <div style={{ marginBottom:20 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:'0.72rem' }}>
                      <span className="mono" style={{ color:'#9945ff' }}>{progressLabel}</span>
                      <span className="mono" style={{ color:'#00ff88' }}>{progress}%</span>
                    </div>
                    <div className="meter-track">
                      <div className="meter-fill" style={{ width:`${progress}%`, background:'linear-gradient(90deg, #9945ff, #19fb9b)', boxShadow:'0 0 10px rgba(153,69,255,0.5)' }} />
                    </div>
                  </div>
                )}

                {/* Button */}
                <button className="btn-primary" onClick={() => analyze()} disabled={loading} style={{ width:'100%', fontSize:'1rem' }}>
                  {loading ? (
                    <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                      <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="40" strokeDashoffset="10"/></svg>
                      Analyzing Transaction...
                    </span>
                  ) : '🛡️ Run AI Security Scan'}
                </button>

                {/* Error */}
                {error && (
                  <div style={{ marginTop:16, padding:'14px 16px', borderRadius:12, background:'rgba(255,51,102,0.07)', border:'1px solid rgba(255,51,102,0.25)', color:'#ff6b8a', fontSize:'0.83rem', display:'flex', gap:8, alignItems:'flex-start' }}>
                    <span style={{ flexShrink:0, marginTop:1 }}>❌</span>
                    <div>
                      <strong>Error:</strong> {error}
                      <br/><span style={{ fontSize:'0.75rem', color:'#6b7280', marginTop:4, display:'block' }}>Try the example buttons above to test with real transactions.</span>
                    </div>
                  </div>
                )}

                {/* What is a transaction sig */}
                {!result && !loading && (
                  <div style={{ marginTop:24, padding:'16px', borderRadius:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#4a5568', marginBottom:8 }}>💡 What is a transaction signature?</div>
                    <p style={{ fontSize:'0.78rem', color:'#374151', lineHeight:1.6 }}>Every action on Solana (sending SOL, swapping tokens, minting NFTs) creates a unique ID — the transaction signature. It looks like a long string: <span className="mono" style={{ color:'#6b7280', fontSize:'0.7rem' }}>5VERv8NMvz...H3H</span>. Find it in your Phantom wallet under "Activity", or on Solscan.</p>
                  </div>
                )}
              </div>

              {/* Result panel */}
              {result && risk && (
                <div className="card slide-up" style={{ padding:32, borderColor:risk.border, boxShadow:`0 0 60px ${risk.glow}, 0 4px 32px rgba(0,0,0,0.5)` }}>

                  {/* Result header */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:'1.6rem' }}>{risk.emoji}</span>
                      <div>
                        <div style={{ fontWeight:800, color:'#fff', fontSize:'1rem' }}>AI Analysis Report</div>
                        <div className="mono" style={{ fontSize:'0.65rem', color:'#4a5568' }}>{result.analysisTime}ms · {result.aiModel}</div>
                      </div>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(result,null,2)); setCopiedResult(true); setTimeout(()=>setCopiedResult(false),2000); }} className="btn-secondary" style={{ fontSize:'0.72rem', padding:'6px 12px' }}>
                      {copiedResult ? '✓ Copied' : '📋 Copy JSON'}
                    </button>
                  </div>

                  {/* Risk score hero */}
                  <div style={{ background:risk.bg, border:`1px solid ${risk.border}`, borderRadius:16, padding:'20px 24px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div>
                      <div className="mono" style={{ fontSize:'0.65rem', color:'#4a5568', marginBottom:6 }}>VERDICT</div>
                      <div style={{ fontSize:'1.8rem', fontWeight:900, color:risk.color, lineHeight:1 }}>{result.riskLevel}</div>
                      <div style={{ fontSize:'0.78rem', color:risk.color, fontWeight:700, marginTop:6, opacity:0.85 }}>{risk.action}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:'4rem', fontWeight:900, color:risk.color, fontFamily:'JetBrains Mono', lineHeight:1 }}>{result.riskScore}</div>
                      <div style={{ fontSize:'0.7rem', color:'#4a5568' }}>/ 100 risk score</div>
                    </div>
                  </div>

                  {/* Meter */}
                  <div style={{ marginBottom:20 }}>
                    <div className="meter-track">
                      <div className="meter-fill" style={{ width:`${result.riskScore}%`, background:`linear-gradient(90deg, #00ff88, ${risk.color})`, boxShadow:`0 0 12px ${risk.color}66` }} />
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', marginTop:5, fontSize:'0.65rem', color:'#374151' }}>
                      <span className="mono">0 — SAFE</span>
                      <span className="mono">100 — CRITICAL</span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div style={{ marginBottom:18 }}>
                    <div className="mono" style={{ fontSize:'0.65rem', color:'#4a5568', marginBottom:8, letterSpacing:'0.08em' }}>AI SUMMARY</div>
                    <p style={{ color:'#e2e8f0', fontSize:'0.875rem', lineHeight:1.75, background:'rgba(255,255,255,0.02)', borderRadius:10, padding:'14px 16px', borderLeft:`3px solid ${risk.color}` }}>{result.summary}</p>
                  </div>

                  {/* Red flags */}
                  {result.redFlags && result.redFlags.length > 0 && (
                    <div style={{ marginBottom:18 }}>
                      <div className="mono" style={{ fontSize:'0.65rem', color:'#4a5568', marginBottom:8, letterSpacing:'0.08em' }}>🚩 RED FLAGS DETECTED</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                        {result.redFlags.map((f,i) => (
                          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'8px 12px', borderRadius:9, background:'rgba(255,51,102,0.06)', border:'1px solid rgba(255,51,102,0.15)', fontSize:'0.8rem', color:'#ff8fa3', lineHeight:1.5 }}>
                            <span style={{ flexShrink:0, marginTop:1 }}>▸</span> {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Low risk positive signals */}
                  {result.riskLevel === 'LOW' && (
                    <div style={{ marginBottom:18, padding:'14px 16px', borderRadius:10, background:'rgba(0,255,136,0.05)', border:'1px solid rgba(0,255,136,0.15)', fontSize:'0.82rem', color:'#6ee7b7' }}>
                      ✅ <strong>No threats detected.</strong> This transaction shows patterns consistent with standard, safe Solana operations.
                    </div>
                  )}

                  {/* Programs */}
                  {result.programsInvolved && result.programsInvolved.length > 0 && (
                    <div style={{ marginBottom:18 }}>
                      <div className="mono" style={{ fontSize:'0.65rem', color:'#4a5568', marginBottom:8, letterSpacing:'0.08em' }}>⚙️ PROGRAMS CALLED</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                        {result.programsInvolved.map((p,i) => (<span key={i} className="chip">{p}</span>))}
                      </div>
                    </div>
                  )}

                  {/* Transfer details */}
                  {result.transferDetails && (
                    <div style={{ marginBottom:18 }}>
                      <div className="mono" style={{ fontSize:'0.65rem', color:'#4a5568', marginBottom:8, letterSpacing:'0.08em' }}>💸 WHAT MOVED</div>
                      <p style={{ fontSize:'0.82rem', color:'#a0aec0', background:'rgba(255,255,255,0.02)', borderRadius:9, padding:'12px 14px', lineHeight:1.6 }}>{result.transferDetails}</p>
                    </div>
                  )}

                  {/* Recommendation */}
                  <div style={{ padding:'16px', borderRadius:12, background: result.riskLevel==='LOW' ? 'rgba(0,255,136,0.06)' : 'rgba(255,51,102,0.06)', border:`1px solid ${risk.border}`, marginBottom:16 }}>
                    <div className="mono" style={{ fontSize:'0.65rem', color:'#4a5568', marginBottom:6 }}>🎯 RECOMMENDATION</div>
                    <p style={{ color:risk.color, fontSize:'0.9rem', fontWeight:700, lineHeight:1.5 }}>{result.recommendation}</p>
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', gap:8 }}>
                    <a href={`https://solscan.io/tx/${sig}`} target="_blank" rel="noopener noreferrer" style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#8892a4', fontSize:'0.78rem', textDecoration:'none', transition:'all 0.2s' }}
                      onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.color='#00ff88';(e.currentTarget as HTMLAnchorElement).style.borderColor='rgba(0,255,136,0.3)';}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.color='#8892a4';(e.currentTarget as HTMLAnchorElement).style.borderColor='rgba(255,255,255,0.08)';}}>
                      🔍 View on Solscan
                    </a>
                    <button onClick={()=>{setResult(null); setSig('');}} style={{ flex:1, padding:'10px', borderRadius:10, background:'rgba(153,69,255,0.07)', border:'1px solid rgba(153,69,255,0.2)', color:'#c4b5fd', fontSize:'0.78rem', cursor:'pointer', transition:'all 0.2s' }}
                      onMouseEnter={e=>{(e.currentTarget).style.background='rgba(153,69,255,0.14)';}}
                      onMouseLeave={e=>{(e.currentTarget).style.background='rgba(153,69,255,0.07)';}}>
                      🔄 Scan Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── THREAT CATEGORIES ── */}
          <section style={{ maxWidth:1280, margin:'0 auto 80px', padding:'0 24px' }}>
            <div style={{ textAlign:'center', marginBottom:40 }}>
              <div className="mono" style={{ fontSize:'0.72rem', color:'#ff3366', letterSpacing:'0.15em', marginBottom:12 }}>THREAT DETECTION</div>
              <h2 style={{ fontSize:'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight:800, color:'#fff', letterSpacing:'-0.03em' }}>7 threat categories analyzed</h2>
              <p style={{ color:'#6b7280', marginTop:10, fontSize:'0.9rem' }}>Every transaction is scanned across all of these attack vectors simultaneously.</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14 }}>
              {THREAT_CATEGORIES.map(t => (
                <div key={t.name} className="card card-hover-lift" style={{ padding:'20px', display:'flex', flexDirection:'column', gap:10 }}>
                  <span style={{ fontSize:'1.8rem' }}>{t.icon}</span>
                  <div style={{ fontWeight:700, color:'#e2e8f0', fontSize:'0.875rem' }}>{t.name}</div>
                  <p style={{ fontSize:'0.78rem', color:'#6b7280', lineHeight:1.5 }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── TECH STACK ── */}
          <section style={{ maxWidth:1280, margin:'0 auto 80px', padding:'0 24px' }}>
            <div style={{ textAlign:'center', marginBottom:40 }}>
              <div className="mono" style={{ fontSize:'0.72rem', color:'#9945ff', letterSpacing:'0.15em', marginBottom:12 }}>BUILT WITH</div>
              <h2 style={{ fontSize:'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight:800, color:'#fff', letterSpacing:'-0.03em' }}>Production-grade tech stack</h2>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:14, justifyContent:'center' }}>
              {TECH_STACK.map(t => (
                <div key={t.name} className="card" style={{ padding:'18px 22px', display:'flex', alignItems:'center', gap:12, minWidth:200 }}>
                  <span style={{ fontSize:'1.5rem' }}>{t.icon}</span>
                  <div>
                    <div style={{ fontWeight:700, color:t.color, fontSize:'0.875rem' }}>{t.name}</div>
                    <div style={{ fontSize:'0.75rem', color:'#6b7280', marginTop:2 }}>{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA BOTTOM ── */}
          <section style={{ maxWidth:800, margin:'0 auto 100px', padding:'0 24px', textAlign:'center' }}>
            <div className="card" style={{ padding:'48px 40px', background:'linear-gradient(135deg, rgba(153,69,255,0.08), rgba(0,255,136,0.04))', borderColor:'rgba(153,69,255,0.25)' }}>
              <h2 style={{ fontSize:'clamp(1.8rem, 4vw, 2.4rem)', fontWeight:900, color:'#fff', marginBottom:16, letterSpacing:'-0.03em' }}>Protect your wallet today</h2>
              <p style={{ color:'#8892a4', fontSize:'1rem', marginBottom:28, lineHeight:1.6 }}>Scan any transaction before you sign. Free, instant, no signup required.</p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <button className="btn-primary" onClick={scrollToScanner} style={{ display:'flex', alignItems:'center', gap:8 }}>🛡️ Scan Now — It's Free</button>
                <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:6 }}>View Source Code</a>
              </div>
            </div>
          </section>

        </> // end scan tab
      )}

      {/* ══════════════════ HISTORY TAB ══════════════════ */}
      {tab === 'history' && (
        <section style={{ maxWidth:900, margin:'60px auto 100px', padding:'0 24px' }}>
          <h2 style={{ fontSize:'1.4rem', fontWeight:800, color:'#fff', marginBottom:8 }}>Scan History</h2>
          <p style={{ color:'#6b7280', fontSize:'0.875rem', marginBottom:32 }}>Your last 10 scans this session (not stored anywhere).</p>
          {history.length === 0 ? (
            <div className="card" style={{ padding:'64px', textAlign:'center', color:'#374151' }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>🔍</div>
              <p style={{ fontSize:'1rem', marginBottom:8, color:'#6b7280' }}>No scans yet this session.</p>
              <button className="btn-primary" onClick={() => setTab('scan')} style={{ marginTop:16, padding:'12px 28px', fontSize:'0.9rem' }}>Go scan a transaction</button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {history.map((h, i) => {
                const c = RISK_CFG[h.risk];
                return (
                  <div key={i} className="card" style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:16, borderColor:c.border }}>
                    <span style={{ fontSize:'1.4rem' }}>{c.emoji}</span>
                    <div className="mono" style={{ fontSize:'0.8rem', color:'#e2e8f0', flex:1 }}>{h.sig}</div>
                    <span className={`badge badge-${h.risk.toLowerCase()}`}>{h.risk}</span>
                    <span className="mono" style={{ fontSize:'0.7rem', color:'#374151', minWidth:60 }}>{h.time}</span>
                    <span style={{ fontSize:'1.4rem', fontWeight:900, color:c.color, fontFamily:'JetBrains Mono' }}>{h.score}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ══════════════════ ABOUT TAB ══════════════════ */}
      {tab === 'about' && (
        <section style={{ maxWidth:1100, margin:'60px auto 100px', padding:'0 24px' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <h2 style={{ fontSize:'clamp(1.8rem, 4vw, 2.8rem)', fontWeight:900, color:'#fff', letterSpacing:'-0.03em', marginBottom:12 }}>About AI-Sentinel</h2>
            <p style={{ color:'#6b7280', fontSize:'1rem', maxWidth:560, margin:'0 auto', lineHeight:1.7 }}>An open-source AI security layer for Solana, built for the Colosseum Frontier Hackathon 2026.</p>
          </div>

          {/* Mission */}
          <div className="card" style={{ padding:'32px', marginBottom:24, borderColor:'rgba(153,69,255,0.25)', background:'linear-gradient(135deg, rgba(153,69,255,0.06), rgba(0,255,136,0.03))' }}>
            <h3 style={{ color:'#fff', fontWeight:800, marginBottom:12, fontSize:'1.1rem' }}>🎯 Our Mission</h3>
            <p style={{ color:'#a0aec0', lineHeight:1.8, fontSize:'0.9rem' }}>DeFi users lost over <strong style={{ color:'#ff3366' }}>$4.2 billion</strong> to wallet drainers, phishing attacks, and smart contract exploits in 2024. The tools to see this data exist — but 99% of users can't read raw blockchain logs. AI-Sentinel bridges this gap: we translate complex on-chain data into a simple verdict any user can act on. Our goal is to make Web3 safe for the next billion users.</p>
          </div>

          {/* Team */}
          <div className="card" style={{ padding:'32px', marginBottom:24 }}>
            <h3 style={{ color:'#fff', fontWeight:800, marginBottom:20, fontSize:'1.1rem' }}>👥 Team AI-Sentinel</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16 }}>
              {[
                { name:'Gopichand Challa', role:'Lead Engineer · AI/ML + Blockchain', handle:'@gopichand_web3', emoji:'👨‍💻' },
                { name:'Kaviya',           role:'Frontend Engineer · UX Design',       handle:'@Kaviya',       emoji:'🎨' },
                { name:'Kalisetty',        role:'Backend Engineer · DevOps',           handle:'@Romeyy123',    emoji:'⚙️' },
              ].map(m => (
                <div key={m.name} style={{ padding:'20px', borderRadius:14, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', textAlign:'center' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:10 }}>{m.emoji}</div>
                  <div style={{ fontWeight:700, color:'#e2e8f0', marginBottom:4 }}>{m.name}</div>
                  <div style={{ fontSize:'0.78rem', color:'#6b7280', marginBottom:8, lineHeight:1.5 }}>{m.role}</div>
                  <div className="mono" style={{ fontSize:'0.7rem', color:'#9945ff' }}>{m.handle}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Judging criteria alignment */}
          <div className="card" style={{ padding:'32px', marginBottom:24 }}>
            <h3 style={{ color:'#fff', fontWeight:800, marginBottom:20, fontSize:'1.1rem' }}>🏆 How We Score on Judging Criteria</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:14 }}>
              {[
                { label:'Functionality', score:'✅ Live & working', desc:'Fully deployed on Vercel, real Solana mainnet data, Gemini AI analysis in <2s' },
                { label:'Potential Impact', score:'🌍 $4.2B problem', desc:'Addresses the largest threat to Solana users — exploits and phishing at scale' },
                { label:'Novelty', score:'🆕 First of its kind', desc:'No open-source, consumer-friendly AI transaction scanner exists for Solana today' },
                { label:'UX', score:'🎨 No-code required', desc:'Any user can paste a signature and get a plain-English verdict — zero blockchain knowledge needed' },
                { label:'Open Source', score:'⭐ MIT License', desc:'100% open source at github.com/gopichandchalla16/AI-Sentinel, composable for other dApps' },
                { label:'Business Plan', score:'💼 Clear revenue path', desc:'Premium API for dApps, enterprise wallet safety monitoring, insurance protocol integrations' },
              ].map(c => (
                <div key={c.label} style={{ padding:'16px', borderRadius:12, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontWeight:700, color:'#e2e8f0', fontSize:'0.875rem' }}>{c.label}</span>
                    <span style={{ fontSize:'0.72rem', color:'#00ff88' }}>{c.score}</span>
                  </div>
                  <p style={{ fontSize:'0.78rem', color:'#6b7280', lineHeight:1.5 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
            <a href="https://ai-sentinel.vercel.app" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:8 }}>🌐 Live Demo</a>
            <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6 }}>📂 GitHub Repo</a>
          </div>
        </section>
      )}

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'32px 24px', textAlign:'center' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:10 }}>
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
            <path d="M11 2 L19 6.5 L19 13.5 C19 17.5 15.5 21 11 22 C6.5 21 3 17.5 3 13.5 L3 6.5 Z" fill="none" stroke="#00ff88" strokeWidth="1.5"/>
            <path d="M7.5 11 L10 13.5 L14.5 8.5" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontWeight:700, color:'#e2e8f0', fontSize:'0.875rem' }}>AI-Sentinel</span>
        </div>
        <p style={{ fontSize:'0.78rem', color:'#374151' }}>
          Built with ❤️ by <strong style={{ color:'#6b7280' }}>Team AI-Sentinel</strong> — Gopichand, Kaviya & Kalisetty — for <a href="https://colosseum.org" target="_blank" rel="noopener noreferrer" style={{ color:'#9945ff', textDecoration:'none' }}>Colosseum Frontier 2026</a>
        </p>
        <p style={{ fontSize:'0.7rem', color:'#1f2937', marginTop:6 }}>Open source · MIT License · <a href="https://github.com/gopichandchalla16/AI-Sentinel" target="_blank" rel="noopener noreferrer" style={{ color:'#374151', textDecoration:'none' }}>github.com/gopichandchalla16/AI-Sentinel</a></p>
      </footer>
    </div>
  );
}
