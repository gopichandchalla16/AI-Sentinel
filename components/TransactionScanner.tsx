'use client';
import { useState, useEffect } from 'react';

const DEMO_SIGNATURE = '5UfgJ5vVZxUxefDGqzqkVLHzHxVTyYH9StYyHKGSzYFRZyG3chLLt7cJKVCPbAgh9AE64tLcBQbZb3bqFqVG7RM';

interface ThreatCategories {
  drainerPattern: boolean;
  excessiveApprovals: boolean;
  unknownProgram: boolean;
  flashLoanVector: boolean;
  accountDrain: boolean;
  authorityTransfer: boolean;
  suspiciousData: boolean;
}

interface AnalysisResult {
  riskScore: number;
  verdict: 'SAFE' | 'CAUTION' | 'HIGH_RISK' | 'CRITICAL';
  summary: string;
  redFlags: string[];
  recommendation: 'SAFE_TO_PROCEED' | 'PROCEED_WITH_CAUTION' | 'DO_NOT_SIGN';
  threatCategories: ThreatCategories;
  affectedAssets: string[];
  estimatedLoss: string;
  dataSource?: string;
}

interface HistoryItem {
  signature: string;
  verdict: string;
  riskScore: number;
  timestamp: number;
}

const VERDICT_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  SAFE:      { bg: 'rgba(20,241,149,0.12)',  border: 'rgba(20,241,149,0.35)',  text: '#14F195' },
  CAUTION:   { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', text: '#F59E0B' },
  HIGH_RISK: { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.35)', text: '#F97316' },
  CRITICAL:  { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.35)',  text: '#EF4444' },
};

const REC_STYLE: Record<string, { bg: string; border: string; text: string; label: string }> = {
  SAFE_TO_PROCEED:      { bg: 'rgba(20,241,149,0.07)',  border: 'rgba(20,241,149,0.3)',  text: '#14F195', label: '✅ SAFE TO PROCEED — This transaction appears legitimate.' },
  PROCEED_WITH_CAUTION: { bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.3)', text: '#F59E0B', label: '⚠️ PROCEED WITH CAUTION — Review the flagged items before signing.' },
  DO_NOT_SIGN:          { bg: 'rgba(239,68,68,0.07)',   border: 'rgba(239,68,68,0.3)',   text: '#EF4444', label: '🚫 DO NOT SIGN — High risk detected. This transaction may drain your wallet.' },
};

const THREAT_META: Array<{ key: keyof ThreatCategories; icon: string; label: string }> = [
  { key: 'drainerPattern',     icon: '🦠', label: 'Drainer Pattern' },
  { key: 'excessiveApprovals', icon: '💳', label: 'Excess Approvals' },
  { key: 'unknownProgram',     icon: '❓', label: 'Unknown Program' },
  { key: 'flashLoanVector',    icon: '⚡', label: 'Flash Loan' },
  { key: 'accountDrain',       icon: '💸', label: 'Account Drain' },
  { key: 'authorityTransfer',  icon: '🔑', label: 'Authority Transfer' },
  { key: 'suspiciousData',     icon: '🕵️', label: 'Suspicious Data' },
];

function getRiskColor(score: number): string {
  if (score < 30) return '#14F195';
  if (score < 60) return '#F59E0B';
  if (score < 80) return '#F97316';
  return '#EF4444';
}

function truncateSig(sig: string): string {
  if (sig.length <= 16) return sig;
  return sig.slice(0, 8) + '...' + sig.slice(-8);
}

function timeAgo(ts: number): string {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return Math.floor(secs / 60) + 'm ago';
  if (secs < 86400) return Math.floor(secs / 3600) + 'h ago';
  return Math.floor(secs / 86400) + 'd ago';
}

function RiskGauge({ score }: { score: number }) {
  const R = 40;
  const circ = 2 * Math.PI * R;
  const offset = circ - (score / 100) * circ;
  const color = getRiskColor(score);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={R} fill="none" stroke="#1e1e2e" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={R} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease', filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
        <text x="50" y="46" textAnchor="middle" fill={color} fontSize="18" fontWeight="900" fontFamily="Inter, sans-serif">{score}</text>
        <text x="50" y="62" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="Inter, sans-serif">/ 100</text>
      </svg>
      <span style={{ fontSize: '0.65rem', fontWeight: 700, color, letterSpacing: '0.08em' }}>RISK SCORE</span>
    </div>
  );
}

export default function TransactionScanner() {
  const [signature, setSignature] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanStage, setScanStage] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai_sentinel_history');
      if (stored) setHistory(JSON.parse(stored));
    } catch (_) {}
  }, []);

  async function handleScan(sig?: string) {
    const target = (sig ?? signature).trim();
    if (!target || target.length < 40) {
      setError('Please enter a valid Solana transaction signature (87-88 characters).');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);
    setScanStage('Fetching on-chain data from Solana mainnet...');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: target }),
      });

      setScanStage('Running AI threat analysis with Gemini 1.5 Flash...');
      await new Promise((r) => setTimeout(r, 400));

      const data: AnalysisResult = await res.json();

      if (!res.ok) {
        const e = data as unknown as { error?: string };
        throw new Error(e.error ?? 'Server error');
      }

      setScanStage('Analysis complete ✓');
      setResult(data);

      const item: HistoryItem = {
        signature: target,
        verdict: data.verdict,
        riskScore: data.riskScore,
        timestamp: Date.now(),
      };
      const updated = [item, ...history.filter((h) => h.signature !== target)].slice(0, 5);
      setHistory(updated);
      try { localStorage.setItem('ai_sentinel_history', JSON.stringify(updated)); } catch (_) {}
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Analysis failed';
      setError(msg + ' — Check your signature or try the Demo Transaction.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDemo() {
    setSignature(DEMO_SIGNATURE);
    await handleScan(DEMO_SIGNATURE);
  }

  function clearHistory() {
    setHistory([]);
    try { localStorage.removeItem('ai_sentinel_history'); } catch (_) {}
  }

  async function shareResult() {
    if (!result) return;
    const text = `AI-Sentinel Security Report\nSignature: ${truncateSig(signature)}\nVerdict: ${result.verdict} (${result.riskScore}/100)\n${result.summary}\n\nScan yours: https://ai-sentinel.vercel.app`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const vs = result ? VERDICT_STYLE[result.verdict] ?? VERDICT_STYLE.SAFE : null;
  const rs = result ? REC_STYLE[result.recommendation] ?? REC_STYLE.SAFE_TO_PROCEED : null;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9945FF', letterSpacing: '0.12em', marginBottom: 6 }}>AI TRANSACTION FIREWALL</p>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F8FAFC', marginBottom: 6 }}>🔍 Analyze Any Solana Transaction</h2>
        <p style={{ fontSize: '0.88rem', color: '#94A3B8' }}>Paste a signature below. No wallet connection needed.</p>
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <input
          type="text"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleScan(); }}
          placeholder="Paste Solana transaction signature (e.g. 5KtP9x...)"
          className="flex-1 bg-[#111118] border border-[#1e1e2e] rounded-xl px-4 py-4 text-[#F8FAFC] font-mono text-sm focus:outline-none focus:border-[#9945FF] placeholder-[#475569] transition-colors"
          style={{ minWidth: 220 }}
        />
        <button
          onClick={() => handleScan()}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#9945FF] to-[#7c3aed] hover:from-[#8b3ff0] hover:to-[#6d28d9] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
        >
          {isLoading
            ? <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
            : '🛡️'}
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {/* Demo button */}
      <button
        onClick={handleDemo}
        disabled={isLoading}
        className="text-sm text-[#9945FF] hover:text-[#14F195] font-medium transition-colors disabled:opacity-50 mb-6"
      >
        → Try Demo Transaction (real mainnet tx)
      </button>

      {/* Progress */}
      {isLoading && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.78rem', color: '#9945FF', fontFamily: 'JetBrains Mono, monospace' }}>{scanStage}</span>
          </div>
          <div className="w-full bg-[#1e1e2e] rounded-full h-1 overflow-hidden">
            <div
              className="h-full rounded-full animate-progress"
              style={{ background: 'linear-gradient(90deg, #9945FF, #14F195)' }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5', fontSize: '0.84rem', marginBottom: 16 }}>
          ❌ {error}
        </div>
      )}

      {/* Result card */}
      {result && vs && rs && (
        <div
          className="animate-fade-in"
          style={{
            background: '#111118',
            border: `1px solid ${vs.border}`,
            borderRadius: 20,
            padding: 24,
            marginBottom: 24,
            boxShadow: `0 0 40px ${vs.bg}`,
          }}
        >
          {/* Score + Verdict row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 20 }}>
            <RiskGauge score={result.riskScore} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: 8 }}>VERDICT</div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  borderRadius: 99,
                  border: `1px solid ${vs.border}`,
                  background: vs.bg,
                  color: vs.text,
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  marginBottom: 10,
                }}
              >
                {result.verdict.replace('_', ' ')}
              </span>
              {result.dataSource && (
                <div style={{ fontSize: '0.65rem', color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>{result.dataSource}</div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={shareResult}
                style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e', borderRadius: 10, color: '#94A3B8', fontSize: '0.76rem', cursor: 'pointer' }}
              >
                {copied ? '✓ Copied!' : '📋 Share'}
              </button>
              <a
                href={`https://solscan.io/tx/${signature}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e', borderRadius: 10, color: '#94A3B8', fontSize: '0.76rem', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
              >
                🔍 Solscan
              </a>
            </div>
          </div>

          {/* Summary */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: 6 }}>AI SUMMARY</div>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.7, borderLeft: `3px solid ${vs.text}`, paddingLeft: 12 }}>
              {result.summary}
            </p>
          </div>

          {/* Red flags */}
          {result.redFlags && result.redFlags.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: 8 }}>🚩 RED FLAGS</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {result.redFlags.map((flag, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.84rem', color: '#94A3B8' }}>
                    <span style={{ color: '#F97316', flexShrink: 0, marginTop: 1 }}>⚠</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Threat categories */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: 8 }}>THREAT SCAN</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px,1fr))', gap: 8 }}>
              {THREAT_META.map(({ key, icon, label }) => {
                const active = result.threatCategories[key];
                return (
                  <div
                    key={key}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 10,
                      border: `1px solid ${active ? 'rgba(239,68,68,0.4)' : '#1e1e2e'}`,
                      background: active ? 'rgba(239,68,68,0.08)' : '#111118',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '1.1rem', marginBottom: 3 }}>{icon}</div>
                    <div style={{ fontSize: '0.62rem', fontWeight: 600, color: active ? '#EF4444' : '#475569', lineHeight: 1.2 }}>{label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendation */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 12,
              background: rs.bg,
              border: `1px solid ${rs.border}`,
              color: rs.text,
              fontSize: '0.9rem',
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            {rs.label}
          </div>

          {/* Estimated loss */}
          {result.estimatedLoss && (
            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              💸 <strong style={{ color: '#F8FAFC' }}>Estimated exposure:</strong> {result.estimatedLoss}
            </div>
          )}
        </div>
      )}

      {/* Scan history */}
      {history.length > 0 && (
        <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', letterSpacing: '0.1em' }}>RECENT SCANS</div>
            <button
              onClick={clearHistory}
              style={{ fontSize: '0.72rem', color: '#475569', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Clear
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.map((h, i) => {
              const hv = VERDICT_STYLE[h.verdict] ?? VERDICT_STYLE.SAFE;
              return (
                <div
                  key={i}
                  onClick={() => { setSignature(h.signature); handleScan(h.signature); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 10,
                    border: `1px solid ${hv.border}`, background: 'rgba(255,255,255,0.015)',
                    cursor: 'pointer', gap: 10,
                  }}
                >
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {truncateSig(h.signature)}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#475569', flexShrink: 0 }}>{timeAgo(h.timestamp)}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: hv.text, flexShrink: 0 }}>{h.verdict.replace('_', ' ')}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', fontWeight: 700, color: hv.text, flexShrink: 0 }}>{h.riskScore}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Wallet connect placeholder */}
      <div style={{ marginTop: 20, padding: '14px 18px', background: '#111118', border: '1px dashed #1e1e2e', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#F8FAFC', marginBottom: 2 }}>🔮 Phantom Wallet Connect</div>
          <div style={{ fontSize: '0.74rem', color: '#475569' }}>Auto-scan your recent transactions</div>
        </div>
        <button
          style={{ padding: '8px 16px', background: 'rgba(153,69,255,0.1)', border: '1px solid rgba(153,69,255,0.25)', borderRadius: 10, color: '#9945FF', fontSize: '0.76rem', fontWeight: 600, cursor: 'not-allowed', opacity: 0.7 }}
          disabled
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
}
