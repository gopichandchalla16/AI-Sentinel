'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'ai';
  text: string;
  time: string;
}

interface Props {
  result: Record<string, unknown> | null;
  signature: string;
}

const SUGGESTED = [
  'Is this transaction safe to sign?',
  'What programs does this call?',
  'Could this drain my wallet?',
  'Explain the risk score',
];

function fmt(d: Date) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function TransactionChat({ result, signature }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset chat when a new scan result arrives
  useEffect(() => {
    if (result) {
      setMessages([
        {
          role: 'ai',
          text: `🛡️ Transaction scanned! Risk score: **${result.riskScore ?? 'N/A'}/100** (${result.verdict ?? 'UNKNOWN'}). ${result.summary ?? ''} Ask me anything about this transaction.`,
          time: fmt(new Date()),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [result?.riskScore, result?.verdict]);

  async function send(text?: string) {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput('');

    const userMsg: Message = { role: 'user', text: q, time: fmt(new Date()) };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/tx-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          analysisResult: result,
          signature,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data.reply || 'No response received. Please try again.';

      setMessages((m) => [
        ...m,
        { role: 'ai', text: reply, time: fmt(new Date()) },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: 'ai',
          text: `⚠️ Could not reach the AI service. Based on the scan data: risk score ${result?.riskScore ?? 0}/100, verdict ${result?.verdict ?? 'SAFE'}. ${result?.summary ?? ''}`,
          time: fmt(new Date()),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!result) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(153,69,255,0.2)',
        borderRadius: 16,
        padding: 32,
        textAlign: 'center',
        color: 'rgba(255,255,255,0.4)',
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>AI Chat Ready</div>
        <div style={{ fontSize: 14, marginTop: 8 }}>
          Scan a transaction first, then ask the AI anything about it in plain English.
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(153,69,255,0.25)',
      borderRadius: 16,
      overflow: 'hidden',
      fontFamily: 'inherit',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(153,69,255,0.3), rgba(20,241,149,0.15))',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(153,69,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ fontSize: 22 }}>🤖</span>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Ask AI About This Transaction</div>
          <div style={{ color: '#14F195', fontSize: 12 }}>Powered by Gemini 1.5 Flash · Ask in plain English</div>
        </div>
        <div style={{
          marginLeft: 'auto',
          background: 'rgba(20,241,149,0.15)',
          border: '1px solid #14F195',
          borderRadius: 20,
          padding: '2px 10px',
          color: '#14F195',
          fontSize: 11,
          fontWeight: 700,
        }}>
          ● LIVE
        </div>
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>Suggested questions:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{
                  background: 'rgba(153,69,255,0.15)',
                  border: '1px solid rgba(153,69,255,0.4)',
                  borderRadius: 20,
                  padding: '4px 12px',
                  color: '#c084fc',
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(153,69,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(153,69,255,0.15)';
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ padding: 16, maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: m.role === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-start' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: m.role === 'user' ? 'rgba(153,69,255,0.4)' : 'rgba(20,241,149,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              flexShrink: 0,
            }}>
              {m.role === 'user' ? '👤' : '🛡️'}
            </div>
            <div style={{ maxWidth: '78%' }}>
              <div style={{
                background: m.role === 'user'
                  ? 'rgba(153,69,255,0.2)'
                  : 'rgba(20,241,149,0.07)',
                border: `1px solid ${m.role === 'user' ? 'rgba(153,69,255,0.4)' : 'rgba(20,241,149,0.2)'}`,
                borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: 14,
                lineHeight: 1.5,
              }}>
                {m.text}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 4, textAlign: m.role === 'user' ? 'right' : 'left' }}>
                {m.time}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(20,241,149,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>🛡️</div>
            <div style={{
              background: 'rgba(20,241,149,0.07)',
              border: '1px solid rgba(20,241,149,0.2)',
              borderRadius: '4px 16px 16px 16px',
              padding: '12px 16px',
              display: 'flex',
              gap: 6,
              alignItems: 'center',
            }}>
              {[0,1,2].map((j) => (
                <div key={j} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#14F195',
                  animation: `bounce 1.2s infinite ${j * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        gap: 10,
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask about this transaction... (e.g. Is it safe to sign?)"
          disabled={loading}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(153,69,255,0.3)',
            borderRadius: 25,
            padding: '10px 18px',
            color: '#fff',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim()
              ? 'rgba(153,69,255,0.3)'
              : 'linear-gradient(135deg, #9945FF, #14F195)',
            border: 'none',
            borderRadius: 25,
            padding: '10px 20px',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
          }}
        >
          {loading ? '...' : 'Ask →'}
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
