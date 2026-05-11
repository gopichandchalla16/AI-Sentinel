'use client';
import { useState, useRef, useCallback } from 'react';
import type { AnalysisResult, HistoryItem, Verdict } from '@/types/analysis';
import RiskGauge from '@/components/RiskGauge';
import { truncateSignature, formatTimestamp } from '@/lib/solana';

const VERDICT_CONFIG: Record<Verdict, { color: string; bg: string; border: string; label: string; emoji: string }> = {
  SAFE:      { color: '#14F195', bg: 'rgba(20,241,149,0.07)',  border: 'rgba(20,241,149,0.25)',  label: 'SAFE',      emoji: '✅' },
  CAUTION:   { color: '#FFB800', bg: 'rgba(255,184,0,0.07)',   border: 'rgba(255,184,0,0.25)',   label: 'CAUTION',   emoji: '⚡' },
  HIGH_RISK: { color: '#FF6B35', bg: 'rgba(255,107,53,0.07)',  border: 'rgba(255,107,53,0.25)',  label: 'HIGH RISK', emoji: '⚠️' },
  CRITICAL:  { color: '#FF2D55', bg: 'rgba(255,45,85,0.08)',   border: 'rgba(255,45,85,0.35)',   label: 'CRITICAL',  emoji: '🚨' },
};

const THREAT_ICONS: Record<string, string> = {
  drainerPattern:     '👻',
  excessiveApprovals: '🔓',
  unknownProgram:     '❓',
  flashLoanVector:    '⚡',
  accountDrain:       '💸',
  authorityTransfer:  '🔑',
  suspiciousData:     '🔍',
};

const THREAT_LABELS: Record<string, string> = {
  drainerPattern:     'Drainer Pattern',
  excessiveApprovals: 'Excessive Approvals',
  unknownProgram:     'Unknown Program',
  flashLoanVector:    'Flash Loan Vector',
  accountDrain:       'Account Drain',
  authorityTransfer:  'Authority Transfer',
  suspiciousData:     'Suspicious Data',
};

const DEMO_SIGS = [
  { label: '✅ Safe Transfer', sig: '5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLiReNmM8bc5Dg4hKnfRd8SZ5KhNnJKLqHHnQvC7t3H' },
  { label: '🔄 DEX Swap',      sig: '3HfUyXjFmtGWPBmrhVDVGkFgpzuAqNNM7HLzfUyxvSzCWsCAXwpFP3M2FH8bBj2SEPrxRqRuSqHX7JMxCqBqsJX' },
  { label: '🎨 NFT Mint',      sig: '2Vhw2k3m4LTKqGqUCH9c7HxpK8GBCmN4u7sfBq2gvzf8d9vXVpLPz8UKJ6tMxCAmqBhKNPUQjvBb7JNQTNq2X6r' },
];

type ScanStatus = 'idle' | 'fetching' | 'analyzing' | 'complete' | 'error';

const STATUS_LABELS: Record<ScanStatus, string> = {
  idle:      '',
  fetching:  '🔗 Fetching on-chain data from Solana mainnet...',
  analyzing: '🤖 Running Gemini AI security analysis...',
  complete:  '✅ Analysis complete!',
  error:     '❌ Analysis failed',
};

const STATUS_PROGRESS: Record<ScanStatus, number> = {
  idle: 0, fetching: 35, analyzing: 75, complete: 100, error: 0,
};

function getHistoryFromStorage(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('ai-sentinel-history') ?? '[]') as HistoryItem[];
  } catch { return []; }
}

function saveHistoryToStorage(items: HistoryItem[]) {
  try { localStorage.setItem('ai-sentinel-history', JSON.stringify(items.slice(0, 5))); } catch { /* ignore */ }
}

export default function TransactionScanner({ initialSig = '' }: { initialSig?: string }) {
  const [sig, setSig]         = useState(initialSig);
  const [status, setStatus]   = useState<ScanStatus>('idle');
  const [result, setResult]   = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(getHistoryFromStorage);
  const [copied, setCopied]   = useState(false);
  const resultRef             = useRef<HTMLDivElement>(null);
  const timersRef             = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };

  const scan = useCallback(async (overrideSig?: string) => {
    const target = (overrideSig ?? sig).trim();
    if (!target) return;
    if (target.length < 40) { setStatus('error'); return; }

    clearTimers();
    setStatus('fetching');
    setResult(null);

    const t1 = setTimeout(() => setStatus('analyzing'), 1400);
    timersRef.current.push(t1);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature: target }),
      });
      const data = await res.json() as AnalysisResult & { error?: string };

      clearTimers();
      if (!res.ok || data.error) throw new Error(data.error ?? `Server error ${res.status}`);

      setStatus('complete');
      setResult(data);

      const item: HistoryItem = {
        signature: target,
        timestamp: Date.now(),
        riskScore: data.riskScore,
        verdict: data.verdict,
        summary: data.summary,
      };
      const updated = [item, ...history.filter(h => h.signature !== target)].slice(0, 5);
      setHistory(updated);
      saveHistoryToStorage(updated);

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    } catch (e: unknown) {
      clearTimers();
      setStatus('error');
      const msg = e instanceof Error ? e.message : 'Analysis failed';
      setResult({ error: msg } as unknown as AnalysisResult);
    }
  }, [sig, history]);

  const shareResult = async () => {
    if (!result) return;
    const vc = VERDICT_CONFIG[result.verdict];
    const text = `AI-Sentinel Security Report Signature: ${truncateSignature(sig)} Verdict: ${vc.label} (${result.riskScore}/100) ${result.summary}  Scan your own transactions: https://ai-sentinel.vercel.app`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLoading = status === 'fetching' || status === 'analyzing';
  const progress  = STATUS_PROGRESS[status];
  const vc        = result && 'verdict' in result && result.verdict ? VERDICT_CONFIG[result.verdict] : null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: result && vc ? '1fr 1fr' : '1fr', gap: 24, alignItems: 'start' }}>

      {/* ─ Left: Input Panel ─ */}
      <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>
        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#4a5568', letterSpacing: '0.1em', marginBottom: 10 }}>
          TRANSACTION SIGNATURE
        </label>
        <textarea
          value={sig}
          onChange={e => setSig(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); scan(); } }}
          placeholder={'Paste Solana transaction signature...\n(e.g. 5KtP9x...)\n\nPress Enter to scan'}
          rows={4}
          style={{
            width: '100%', background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
            padding: '13px 15px', color: '#e2e8f0',
            fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace',
            resize: 'vertical', lineHeight: 1.65, outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => { e.target.style.borderColor = 'rgba(20,241,149,0.4)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        />
        <p style={{ fontSize: '0.65rem', color: '#374151', margin: '4px 0 16px' }}>Press Enter to scan · Shift+Enter for new line</p>

        {/* Demo buttons */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#374151', letterSpacing: '0.06em', marginBottom: 8 }}>DEMO MODE — REAL MAINNET TRANSACTIONS:</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {DEMO_SIGS.map(d => (
              <button
                key={d.label}
                onClick={() => { setSig(d.sig); scan(d.sig); }}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 8, color: '#9ca3af', fontSize: '0.72rem', fontWeight: 600,
                  padding: '5px 11px', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(20,241,149,0.3)'; e.currentTarget.style.color = '#14F195'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#9ca3af'; }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        {isLoading && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.72rem' }}>
              <span style={{ color: '#9945FF', fontFamily: 'JetBrains Mono, monospace' }}>{STATUS_LABELS[status]}</span>
              <span style={{ color: '#14F195', fontFamily: 'JetBrains Mono, monospace' }}>{progress}%</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99,
                background: 'linear-gradient(90deg, #9945FF, #14F195)',
                width: `${progress}%`,
                transition: 'width 0.6s ease',
                boxShadow: '0 0 10px rgba(153,69,255,0.5)',
              }} />
            </div>
          </div>
        )}
        {!isLoading && status === 'complete' && (
          <div style={{ marginBottom: 14, fontSize: '0.75rem', color: '#14F195', fontFamily: 'JetBrains Mono, monospace' }}>{STATUS_LABELS.complete}</div>
        )}

        {/* Scan button */}
        <button
          onClick={() => scan()}
          disabled={isLoading || !sig.trim()}
          style={{
            width: '100%', background: isLoading ? 'rgba(153,69,255,0.3)' : 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
            border: 'none', borderRadius: 13, color: isLoading ? '#888' : '#000',
            fontWeight: 800, fontSize: '0.95rem', padding: '15px',
            cursor: isLoading || !sig.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {isLoading ? (
            <><span style={{ display: 'inline-block', animation: 'spin 0.9s linear infinite', fontSize: '1.1rem' }}>⟳</span> Analyzing Transaction…</>
          ) : '🛡️ Analyze Transaction'}
        </button>

        {/* Error */}
        {status === 'error' && result && ('error' in (result as object)) && (
          <div style={{
            marginTop: 14, padding: '12px 15px', borderRadius: 12,
            background: 'rgba(255,45,85,0.06)', border: '1px solid rgba(255,45,85,0.2)',
            color: '#ff8fa3', fontSize: '0.82rem',
          }}>
            ❌ <strong>Error:</strong> {(result as unknown as { error: string }).error}
            <br /><span style={{ fontSize: '0.7rem', color: '#4a5568', marginTop: 4, display: 'block' }}>Try one of the Demo Mode buttons above to test with a real transaction.</span>
          </div>
        )}

        {/* Scan History */}
        {history.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4a5568', letterSpacing: '0.1em' }}>RECENT SCANS</div>
              <button
                onClick={() => { setHistory([]); saveHistoryToStorage([]); }}
                style={{ background: 'none', border: 'none', color: '#374151', fontSize: '0.68rem', cursor: 'pointer' }}
              >Clear</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {history.map((h, i) => {
                const c = VERDICT_CONFIG[h.verdict];
                return (
                  <div
                    key={i}
                    onClick={() => { setSig(h.signature); scan(h.signature); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                      borderRadius: 10, background: 'rgba(255,255,255,0.02)',
                      border: `1px solid ${c.border}`, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  >
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#9ca3af', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {truncateSignature(h.signature)}
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', fontWeight: 700, color: c.color }}>{h.riskScore}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: c.color, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 6, padding: '2px 7px' }}>{c.label}</span>
                    <span style={{ fontSize: '0.62rem', color: '#374151' }}>{formatTimestamp(Math.floor(h.timestamp / 1000))}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─ Right: Result Panel ─ */}
      {result && vc && !('error' in (result as object)) && (
        <div
          ref={resultRef}
          style={{
            background: '#0d1117', border: `1px solid ${vc.border}`,
            borderRadius: 20, padding: 28,
            boxShadow: `0 0 50px ${vc.bg}, 0 4px 32px rgba(0,0,0,0.5)`,
            animation: 'slideUp 0.4s ease forwards',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.4rem' }}>{vc.emoji}</span>
              <div>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>Security Report</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: '#4a5568' }}>
                  {result.analysisTime}ms · {result.aiModel}
                </div>
              </div>
            </div>
            <button
              onClick={shareResult}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 9, color: '#9ca3af', fontSize: '0.72rem', fontWeight: 600,
                padding: '6px 13px', cursor: 'pointer',
              }}
            >{copied ? '✓ Copied!' : '📋 Share'}</button>
          </div>

          {/* Gauge + Verdict */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 22, padding: '18px 20px', background: vc.bg, border: `1px solid ${vc.border}`, borderRadius: 14 }}>
            <RiskGauge score={result.riskScore} size={120} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#4a5568', marginBottom: 6, letterSpacing: '0.1em' }}>VERDICT</div>
              <div style={{
                fontSize: '1.6rem', fontWeight: 900, color: vc.color,
                textShadow: `0 0 20px ${vc.color}66`,
                animation: 'verdictPulse 2s ease-in-out infinite',
              }}>{vc.label}</div>
              <div style={{ fontSize: '0.8rem', color: vc.color, fontWeight: 700, marginTop: 5, opacity: 0.85 }}>
                {result.recommendation.replace(/_/g, ' ')}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#4a5568', marginTop: 4 }}>via {result.rpcSource}</div>
            </div>
          </div>

          {/* Summary */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4a5568', letterSpacing: '0.1em', marginBottom: 8 }}>AI SUMMARY</div>
            <p style={{
              color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.75,
              background: 'rgba(255,255,255,0.02)', borderRadius: 10,
              padding: '12px 14px', borderLeft: `3px solid ${vc.color}`,
            }}>{result.summary}</p>
          </div>

          {/* Red flags */}
          {result.redFlags && result.redFlags.length > 0 && result.redFlags[0] !== 'No threats detected by rule engine' && result.redFlags[0] !== 'No specific threats flagged' && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4a5568', letterSpacing: '0.1em', marginBottom: 8 }}>🚩 RED FLAGS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {result.redFlags.map((f, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 8, padding: '8px 12px',
                    borderRadius: 9, background: 'rgba(255,45,85,0.05)',
                    border: '1px solid rgba(255,45,85,0.14)', fontSize: '0.8rem', color: '#fca5a5', lineHeight: 1.5,
                  }}>
                    <span style={{ flexShrink: 0 }}>⚠️</span> {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SAFE banner */}
          {result.verdict === 'SAFE' && (
            <div style={{ marginBottom: 18, padding: '12px 14px', borderRadius: 10, background: 'rgba(20,241,149,0.05)', border: '1px solid rgba(20,241,149,0.14)', fontSize: '0.82rem', color: '#6ee7b7' }}>
              ✅ <strong>No threats detected.</strong> This transaction matches known safe patterns.
            </div>
          )}

          {/* Threat categories grid */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4a5568', letterSpacing: '0.1em', marginBottom: 10 }}>THREAT CATEGORY SCAN</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))', gap: 8 }}>
              {Object.entries(result.threatCategories).map(([key, active]) => (
                <div key={key} style={{
                  padding: '7px 10px', borderRadius: 9,
                  background: active ? 'rgba(255,45,85,0.07)' : 'rgba(20,241,149,0.04)',
                  border: `1px solid ${active ? 'rgba(255,45,85,0.22)' : 'rgba(20,241,149,0.12)'}`,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: '0.85rem' }}>{active ? '🔴' : '🟢'}</span>
                  <div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: active ? '#ff8fa3' : '#6ee7b7', lineHeight: 1.2 }}>{THREAT_ICONS[key]} {THREAT_LABELS[key]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assets / Loss */}
          {result.estimatedLoss && result.estimatedLoss !== 'Unknown' && (
            <div style={{ marginBottom: 18, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4a5568', letterSpacing: '0.1em', marginBottom: 4 }}>💸 ESTIMATED EXPOSURE</div>
              <div style={{ fontSize: '0.85rem', color: vc.color, fontWeight: 700 }}>{result.estimatedLoss}</div>
            </div>
          )}

          {/* Programs */}
          {result.programsInvolved && result.programsInvolved.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4a5568', letterSpacing: '0.1em', marginBottom: 8 }}>⚙️ PROGRAMS CALLED</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {result.programsInvolved.map((p, i) => (
                  <span key={i} style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.68rem', fontWeight: 600, padding: '3px 10px',
                    borderRadius: 7, background: 'rgba(153,69,255,0.09)',
                    color: '#c4b5fd', border: '1px solid rgba(153,69,255,0.2)',
                  }}>{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation box */}
          <div style={{
            padding: '14px 16px', borderRadius: 12,
            background: result.verdict === 'SAFE' ? 'rgba(20,241,149,0.05)' : 'rgba(255,45,85,0.05)',
            border: `1px solid ${vc.border}`, marginBottom: 16,
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4a5568', letterSpacing: '0.1em', marginBottom: 5 }}>🎯 RECOMMENDATION</div>
            <p style={{ color: vc.color, fontSize: '0.92rem', fontWeight: 800 }}>{result.recommendation.replace(/_/g, ' ')}</p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href={`https://solscan.io/tx/${sig}`} target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '10px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                color: '#6b7280', fontSize: '0.76rem', textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#14F195'; e.currentTarget.style.borderColor = 'rgba(20,241,149,0.28)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              🔍 View on Solscan
            </a>
            <button
              onClick={() => { setResult(null); setSig(''); setStatus('idle'); }}
              style={{
                flex: 1, padding: '10px', borderRadius: 10,
                background: 'rgba(153,69,255,0.07)', border: '1px solid rgba(153,69,255,0.2)',
                color: '#c4b5fd', fontSize: '0.76rem', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(153,69,255,0.14)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(153,69,255,0.07)'; }}
            >
              🔄 Scan Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
