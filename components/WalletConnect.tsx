'use client';
import { useState, useEffect } from 'react';
import { truncateSignature, formatTimestamp } from '@/lib/solana';

interface WalletTx {
  signature: string;
  blockTime: number | null;
  err: boolean;
}

interface WalletConnectProps {
  onSelectSignature?: (sig: string) => void;
}

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      publicKey?: { toString: () => string };
      isConnected?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
    };
  }
}

export default function WalletConnect({ onSelectSignature }: WalletConnectProps) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [txList, setTxList] = useState<WalletTx[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getPhantom = () => (typeof window !== 'undefined' ? window.solana : undefined);

  useEffect(() => {
    const ph = getPhantom();
    if (ph?.isConnected && ph.publicKey) {
      setConnected(true);
      setAddress(ph.publicKey.toString());
    }
  }, []);

  const fetchHistory = async (addr: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/wallet-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: addr }),
      });
      const data = await res.json() as { signatures?: WalletTx[]; error?: string };
      if (data.error && !data.signatures) { setError(data.error); return; }
      setTxList(data.signatures ?? []);
    } catch {
      setError('Failed to fetch transaction history');
    } finally {
      setLoading(false);
    }
  };

  const connect = async () => {
    const ph = getPhantom();
    if (!ph) { window.open('https://phantom.app/', '_blank'); return; }
    try {
      const res = await ph.connect();
      const addr = res.publicKey.toString();
      setConnected(true);
      setAddress(addr);
      await fetchHistory(addr);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Connection rejected';
      setError(msg);
    }
  };

  const disconnect = async () => {
    const ph = getPhantom();
    if (ph) try { await ph.disconnect(); } catch { /* ignore */ }
    setConnected(false); setAddress(null); setTxList([]); setError('');
  };

  return (
    <div style={{
      background: 'rgba(153,69,255,0.05)',
      border: '1px solid rgba(153,69,255,0.22)',
      borderRadius: 16, padding: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>👻</span> Phantom Wallet
        </div>
        {!connected ? (
          <button
            onClick={connect}
            style={{
              background: 'linear-gradient(135deg, #9945FF, #14F195)',
              border: 'none', borderRadius: 10,
              color: '#000', fontWeight: 700, fontSize: '0.78rem',
              padding: '8px 16px', cursor: 'pointer',
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={disconnect}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, color: '#9945FF', fontSize: '0.75rem',
              fontWeight: 600, padding: '6px 12px', cursor: 'pointer',
            }}
          >
            {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Disconnect'}
          </button>
        )}
      </div>

      {error && (
        <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', color: '#ff8fa3', fontSize: '0.78rem', marginBottom: 12 }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '16px 0', color: '#6b7280', fontSize: '0.8rem' }}>
          <span style={{ display: 'inline-block', animation: 'spin 0.9s linear infinite' }}>⟳</span> Loading transaction history...
        </div>
      )}

      {connected && !loading && txList.length > 0 && (
        <div>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4a5568', letterSpacing: '0.1em', marginBottom: 10 }}>RECENT TRANSACTIONS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {txList.slice(0, 8).map((tx) => (
              <div key={tx.signature} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)',
                gap: 8,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {truncateSignature(tx.signature)}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#4a5568', marginTop: 2 }}>
                    {formatTimestamp(tx.blockTime)} {tx.err && <span style={{ color: '#ff6b6b' }}> · failed</span>}
                  </div>
                </div>
                <button
                  onClick={() => onSelectSignature?.(tx.signature)}
                  style={{
                    background: 'rgba(20,241,149,0.08)', border: '1px solid rgba(20,241,149,0.2)',
                    borderRadius: 7, color: '#14F195', fontSize: '0.68rem', fontWeight: 600,
                    padding: '4px 10px', cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  Scan →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {connected && !loading && txList.length === 0 && !error && (
        <p style={{ fontSize: '0.8rem', color: '#4a5568', textAlign: 'center', padding: '12px 0' }}>
          No recent transactions found.
        </p>
      )}

      {!connected && (
        <p style={{ fontSize: '0.78rem', color: '#4a5568', lineHeight: 1.6 }}>
          Connect your Phantom wallet to automatically scan your recent transactions and detect any threats.
        </p>
      )}
    </div>
  );
}
