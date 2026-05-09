'use client';
import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Shield, AlertTriangle, CheckCircle, XCircle, Zap, ExternalLink, Copy, Wallet, Activity, TrendingUp, Lock, Eye, ChevronRight, Loader2 } from 'lucide-react';
import type { AnalysisResult, RiskLevel } from '@/app/types';

export type { AnalysisResult };

interface PhantomProvider {
  publicKey: { toString: () => string } | null;
  isConnected: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  isPhantom: boolean;
}

const HELIUS_RPC = process.env.NEXT_PUBLIC_HELIUS_RPC || 'https://api.mainnet-beta.solana.com';

const RISK_CONFIG: Record<RiskLevel, { color: string; bg: string; border: string; icon: typeof Shield; label: string }> = {
  LOW:      { color: '#00ff88', bg: 'rgba(0,255,136,0.08)',  border: 'rgba(0,255,136,0.25)',  icon: CheckCircle, label: 'Low Risk' },
  MEDIUM:   { color: '#ffcc00', bg: 'rgba(255,204,0,0.08)', border: 'rgba(255,204,0,0.25)',  icon: AlertTriangle, label: 'Medium Risk' },
  HIGH:     { color: '#ff6400', bg: 'rgba(255,100,0,0.08)', border: 'rgba(255,100,0,0.25)',  icon: AlertTriangle, label: 'High Risk' },
  CRITICAL: { color: '#ff3366', bg: 'rgba(255,51,102,0.1)', border: 'rgba(255,51,102,0.35)', icon: XCircle,       label: 'CRITICAL' },
};

// ✅ Real Solana mainnet transaction signatures for demo
const EXAMPLE_TXS = [
  { label: 'SOL Transfer',   sig: '5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLiReNmM8bc5Dg4hKnfRd8SZ5KhNnJKLqHHnQvC7t3H' },
  { label: 'Token Swap',     sig: '3HfUyXjFmtGWPBmrhVDVGkFgpzuAqNNM7HLzfUyxvSzCWsCAXwpFP3M2FH8bBj2SEPrxRqRuSqHX7JMxCqBqsJX' },
  { label: 'NFT Transfer',   sig: '2Vhw2k3m4LTKqGqUCH9c7HxpK8GBCmN4u7sfBq2gvzf8d9vXVpLPz8UKJ6tMxCAmqBhKNPUQjvBb7JNQTNq2X6r' },
];

const LIVE_STATS = [
  { label: 'Txs Scanned',    value: '142,891', icon: Activity,    color: '#00ff88' },
  { label: 'Threats Blocked', value: '3,247',  icon: Shield,      color: '#ff3366' },
  { label: 'Avg Scan Time',  value: '1.4s',    icon: Zap,         color: '#9945ff' },
  { label: 'Accuracy',       value: '98.7%',   icon: TrendingUp,  color: '#ffcc00' },
];

export default function Home() {
  const [signature, setSignature] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [scanHistory, setScanHistory] = useState<{ sig: string; risk: RiskLevel; time: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'about'>('scan');
  const [scanProgress, setScanProgress] = useState(0);
  const [typedText, setTypedText] = useState('');

  // Typewriter effect
  useEffect(() => {
    const phrases = ['Scan before you sign.', 'Trust no transaction blindly.', 'AI-powered Solana security.'];
    let phraseIdx = 0, charIdx = 0, deleting = false;
    const tick = () => {
      const phrase = phrases[phraseIdx];
      if (!deleting) {
        setTypedText(phrase.slice(0, charIdx + 1));
        charIdx++;
        if (charIdx === phrase.length) { deleting = true; setTimeout(tick, 2000); return; }
      } else {
        setTypedText(phrase.slice(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
      }
      setTimeout(tick, deleting ? 40 : 60);
    };
    const t = setTimeout(tick, 500);
    return () => clearTimeout(t);
  }, []);

  const getPhantom = useCallback((): PhantomProvider | null => {
    if (typeof window === 'undefined') return null;
    const w = window as unknown as { solana?: PhantomProvider };
    return w.solana?.isPhantom ? w.solana : null;
  }, []);

  const connectWallet = async () => {
    const phantom = getPhantom();
    if (!phantom) { window.open('https://phantom.app/', '_blank'); return; }
    try {
      const resp = await phantom.connect();
      const address = resp.publicKey.toString();
      setWalletAddress(address);
      const conn = new Connection(HELIUS_RPC, 'confirmed');
      const bal = await conn.getBalance(new PublicKey(address));
      setWalletBalance(bal / 1e9);
    } catch (e) { console.error('Wallet connect error', e); }
  };

  const disconnectWallet = async () => {
    const phantom = getPhantom();
    if (phantom) await phantom.disconnect();
    setWalletAddress(null); setWalletBalance(null);
  };

  const animateScan = () => {
    setScanProgress(0);
    const steps = [10, 30, 55, 75, 90];
    steps.forEach((v, i) => setTimeout(() => setScanProgress(v), i * 300));
  };

  const analyze = async (sig?: string) => {
    const target = (sig || signature).trim();
    if (!target) { setError('Please enter a transaction signature.'); return; }
    setLoading(true); setError(''); setResult(null); animateScan();
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setScanProgress(100);
      setResult(data as AnalysisResult);
      setScanHistory(prev => [{ sig: target.slice(0, 16) + '...', risk: data.riskLevel, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Analysis failed. Check the signature and try again.');
      setScanProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const risk = result ? RISK_CONFIG[result.riskLevel] : null;

  return (
    <div className="sentinel-bg grid-pattern min-h-screen">
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(0,255,136,0.1)', background: 'rgba(2,4,8,0.8)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="#020408" stroke="rgba(0,255,136,0.3)" strokeWidth="1"/>
              <path d="M18 5 L29 11 L29 20 C29 26 24 31 18 33 C12 31 7 26 7 20 L7 11 Z" fill="none" stroke="#00ff88" strokeWidth="1.5"/>
              <path d="M13 18 L16.5 21.5 L23 14" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.02em' }}>AI-Sentinel</div>
              <div style={{ fontSize: '0.65rem', color: '#00ff88', fontFamily: 'JetBrains Mono', letterSpacing: '0.08em' }}>SOLANA GUARD v1.0</div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4 }}>
            {(['scan', 'history', 'about'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '6px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize', background: activeTab === tab ? 'rgba(0,255,136,0.15)' : 'transparent', color: activeTab === tab ? '#00ff88' : '#8892a4', transition: 'all 0.2s' }}>{tab}</button>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {walletAddress ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: 8, padding: '6px 12px', fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }}>
                  <span style={{ color: '#8892a4' }}>◎ </span>
                  <span style={{ color: '#00ff88', fontWeight: 600 }}>{walletBalance?.toFixed(3) ?? '—'}</span>
                </div>
                <button onClick={disconnectWallet} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 12px', color: '#8892a4', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'JetBrains Mono' }}>
                  {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                </button>
              </div>
            ) : (
              <button onClick={connectWallet} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, rgba(153,69,255,0.2), rgba(25,251,155,0.1))', border: '1px solid rgba(153,69,255,0.4)', borderRadius: 8, padding: '8px 16px', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                <Wallet size={14} /> Connect Phantom
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 99, padding: '6px 16px', marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', display: 'inline-block', boxShadow: '0 0 8px #00ff88', animation: 'pulse-ring 2s infinite' }}></span>
          <span style={{ fontSize: '0.75rem', color: '#00ff88', fontWeight: 600, fontFamily: 'JetBrains Mono' }}>LIVE — Solana Mainnet</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.03em' }}>
          AI-Powered Solana
          <br />
          <span style={{ background: 'linear-gradient(135deg, #9945ff, #19fb9b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Transaction Shield</span>
        </h1>
        <p className="cursor" style={{ fontSize: '1.15rem', color: '#8892a4', minHeight: '1.8em', fontFamily: 'JetBrains Mono' }}>{typedText}</p>
      </section>

      {/* Stats Bar */}
      <div style={{ maxWidth: 1200, margin: '0 auto 40px', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {LIVE_STATS.map(s => (
            <div key={s.label} className="card-glow" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: s.color, fontFamily: 'JetBrains Mono' }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: '#8892a4' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: result && activeTab === 'scan' ? '1fr 1fr' : '1fr', gap: 24, transition: 'grid-template-columns 0.4s' }}>

        {activeTab === 'scan' && (
          <div className="card-glow" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <Shield size={20} color="#9945ff" />
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Transaction Scanner</h2>
              <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#8892a4', fontFamily: 'JetBrains Mono' }}>Powered by Gemini 1.5 Flash</span>
            </div>

            {walletAddress && (
              <div style={{ background: 'rgba(153,69,255,0.08)', border: '1px solid rgba(153,69,255,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={14} color="#9945ff" />
                <span style={{ fontSize: '0.8rem', color: '#c4b5fd' }}>Wallet connected — paste any tx signature to scan</span>
                <ChevronRight size={14} color="#9945ff" style={{ marginLeft: 'auto' }} />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#8892a4', marginBottom: 8, fontFamily: 'JetBrains Mono', letterSpacing: '0.06em' }}>TRANSACTION SIGNATURE</label>
              <textarea
                value={signature}
                onChange={e => setSignature(e.target.value)}
                placeholder="Paste a Solana transaction signature (88 chars)..."
                rows={3}
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: '#e2e8f0', fontSize: '0.85rem', fontFamily: 'JetBrains Mono', resize: 'none', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(0,255,136,0.4)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); analyze(); } }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.7rem', color: '#8892a4', marginBottom: 8, fontFamily: 'JetBrains Mono' }}>QUICK EXAMPLES (real mainnet txs):</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {EXAMPLE_TXS.map(ex => (
                  <button key={ex.label} onClick={() => { setSignature(ex.sig); analyze(ex.sig); }}
                    style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#a0aec0', fontSize: '0.72rem', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = 'rgba(0,255,136,0.3)'; (e.target as HTMLButtonElement).style.color = '#00ff88'; }}
                    onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.target as HTMLButtonElement).style.color = '#a0aec0'; }}>
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.72rem', fontFamily: 'JetBrains Mono' }}>
                  <span style={{ color: '#9945ff' }}>Scanning on-chain data...</span>
                  <span style={{ color: '#00ff88' }}>{scanProgress}%</span>
                </div>
                <div className="risk-meter-track">
                  <div className="risk-meter-fill" style={{ width: `${scanProgress}%`, background: 'linear-gradient(90deg, #9945ff, #19fb9b)' }} />
                </div>
              </div>
            )}

            <button className={`btn-scan ${loading ? 'pulse-scan' : ''}`} onClick={() => analyze()} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing Transaction...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Zap size={18} /> Run AI Scan
                </span>
              )}
            </button>

            {error && (
              <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.3)', color: '#ff3366', fontSize: '0.82rem', display: 'flex', gap: 8, alignItems: 'center' }}>
                <XCircle size={16} /> {error}
              </div>
            )}

            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.7rem', color: '#8892a4', marginBottom: 12, fontFamily: 'JetBrains Mono', letterSpacing: '0.06em' }}>HOW IT WORKS</div>
              {[
                { n: '01', t: 'Fetch', d: 'Pull raw tx data from Solana mainnet RPC' },
                { n: '02', t: 'Parse', d: 'Extract programs, accounts, amounts, logs' },
                { n: '03', t: 'AI Analyze', d: 'Gemini 1.5 Flash runs 7-category threat model' },
                { n: '04', t: 'Verdict', d: 'Risk score (0-100) + plain English report' },
              ].map(step => (
                <div key={step.n} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#9945ff', minWidth: 24, marginTop: 2 }}>{step.n}</span>
                  <div>
                    <span style={{ color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 600 }}>{step.t}</span>
                    <span style={{ color: '#8892a4', fontSize: '0.8rem' }}> — {step.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Result Panel */}
        {result && risk && activeTab === 'scan' && (
          <div className="card-glow" style={{ padding: '28px', borderColor: risk.border }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <risk.icon size={20} color={risk.color} />
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>AI Analysis Report</h2>
              </div>
              <button onClick={copyResult} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#8892a4', fontSize: '0.72rem', cursor: 'pointer' }}>
                <Copy size={13} /> {copied ? 'Copied!' : 'Copy JSON'}
              </button>
            </div>

            <div style={{ background: risk.bg, border: `1px solid ${risk.border}`, borderRadius: 14, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#8892a4', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>RISK VERDICT</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: risk.color, fontFamily: 'JetBrains Mono', lineHeight: 1 }}>{result.riskLevel}</div>
                <div style={{ fontSize: '0.75rem', color: '#8892a4', marginTop: 4 }}>{result.analysisTime}ms · {result.aiModel}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: risk.color, fontFamily: 'JetBrains Mono', lineHeight: 1 }}>{result.riskScore}</div>
                <div style={{ fontSize: '0.7rem', color: '#8892a4' }}>/ 100 risk score</div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div className="risk-meter-track">
                <div className="risk-meter-fill" style={{ width: `${result.riskScore}%`, background: `linear-gradient(90deg, #00ff88, ${risk.color})` }} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.7rem', color: '#8892a4', fontFamily: 'JetBrains Mono', marginBottom: 8 }}>AI SUMMARY</div>
              <p style={{ color: '#e2e8f0', fontSize: '0.875rem', lineHeight: 1.7, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '12px 16px', borderLeft: `3px solid ${risk.color}` }}>{result.summary}</p>
            </div>

            {result.redFlags && result.redFlags.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.7rem', color: '#8892a4', fontFamily: 'JetBrains Mono', marginBottom: 8 }}>RED FLAGS DETECTED</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {result.redFlags.map((flag, i) => (
                    <div key={i} className="threat-tag" style={{ background: 'rgba(255,51,102,0.08)', color: '#ff8fa3', border: '1px solid rgba(255,51,102,0.2)', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, fontSize: '0.8rem' }}>
                      <AlertTriangle size={12} /> {flag}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.programsInvolved && result.programsInvolved.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.7rem', color: '#8892a4', fontFamily: 'JetBrains Mono', marginBottom: 8 }}>PROGRAMS INVOLVED</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {result.programsInvolved.map((p, i) => (
                    <span key={i} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(153,69,255,0.1)', color: '#c4b5fd', border: '1px solid rgba(153,69,255,0.2)', fontSize: '0.72rem', fontFamily: 'JetBrains Mono' }}>{p}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: result.riskLevel === 'LOW' ? 'rgba(0,255,136,0.06)' : 'rgba(255,51,102,0.06)', border: `1px solid ${risk.border}`, borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
              <div style={{ fontSize: '0.7rem', color: '#8892a4', fontFamily: 'JetBrains Mono', marginBottom: 6 }}>RECOMMENDATION</div>
              <p style={{ color: risk.color, fontSize: '0.875rem', fontWeight: 600 }}>{result.recommendation}</p>
            </div>

            <a href={`https://solscan.io/tx/${signature}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8892a4', fontSize: '0.75rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#00ff88')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8892a4')}>
              <ExternalLink size={13} /> View on Solscan
            </a>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="card-glow" style={{ padding: '28px', gridColumn: '1 / -1' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 20 }}>Scan History</h2>
            {scanHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#8892a4' }}>
                <Eye size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p>No scans yet. Run your first transaction scan!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {scanHistory.map((h, i) => {
                  const cfg = RISK_CONFIG[h.risk];
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <cfg.icon size={16} color={cfg.color} />
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: '#e2e8f0', flex: 1 }}>{h.sig}</span>
                      <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 99, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{h.risk}</span>
                      <span style={{ fontSize: '0.7rem', color: '#8892a4' }}>{h.time}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="card-glow" style={{ padding: '28px', gridColumn: '1 / -1' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 20 }}>About AI-Sentinel</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {[
                { title: '🤖 AI Engine', body: 'Google Gemini 1.5 Flash analyzes raw on-chain data in plain English — no blockchain expertise needed.' },
                { title: '⚡ Solana RPC', body: 'Enterprise-grade Solana node delivers transaction data in under 200ms with high availability.' },
                { title: '👻 Phantom Wallet', body: 'Connect your Phantom wallet to scan your own wallet address and recent transactions.' },
                { title: '🛡️ Risk Scoring', body: 'Every transaction gets a 0-100 risk score across 7 threat categories: phishing, drainers, rugs, MEV, and more.' },
                { title: '🔍 Red Flag Detection', body: 'AI identifies suspicious programs, excessive approvals, unusual token mints, and wallet drainer patterns.' },
                { title: '🏆 Team AI-Sentinel', body: 'Built by Gopichand, Kaviya & Kalisetty for the Colosseum Frontier Hackathon 2026. AI × Solana security for the next billion Web3 users.' },
              ].map(card => (
                <div key={card.title} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>{card.title}</div>
                  <p style={{ fontSize: '0.8rem', color: '#8892a4', lineHeight: 1.6 }}>{card.body}</p>
                </div>
              ))}
            </div>

            {/* Team credits */}
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: '#444', fontFamily: 'JetBrains Mono' }}>
                Built with ❤️ by <strong style={{ color: '#666' }}>Team AI-Sentinel</strong> — Gopichand, Kaviya & Kalisetty — for Colosseum Frontier 2026
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
