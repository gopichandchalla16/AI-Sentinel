'use client';
import { useState } from 'react';

// Simulated wallet connect — no npm deps needed, works in browser
// Shows Phantom/Backpack/Solflare detection UI
const WALLETS = [
  { name: 'Phantom', icon: '👻', color: '#AB9FF2', desc: 'Most popular Solana wallet' },
  { name: 'Backpack', icon: '🎒', color: '#E33E3F', desc: 'xNFT wallet by Coral' },
  { name: 'Solflare', icon: '🔆', color: '#FC9A26', desc: 'Feature-rich Solana wallet' },
];

export default function WalletConnect({ onConnected }: { onConnected?: (addr: string) => void }) {
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState('');
  const [connected, setConnected] = useState<{ name: string; addr: string } | null>(null);

  const connect = async (walletName: string) => {
    setConnecting(walletName);
    // Try real Phantom connect first
    if (walletName === 'Phantom' && typeof window !== 'undefined') {
      const provider = (window as any)?.solana || (window as any)?.phantom?.solana;
      if (provider?.isPhantom) {
        try {
          const resp = await provider.connect();
          const addr = resp.publicKey.toString();
          const shortAddr = addr.slice(0, 4) + '...' + addr.slice(-4);
          setConnected({ name: 'Phantom', addr: shortAddr });
          setConnecting('');
          setOpen(false);
          onConnected?.(addr);
          return;
        } catch {}
      }
    }
    // Fallback: simulate connection for demo
    await new Promise(r => setTimeout(r, 1200));
    const demoAddresses: Record<string, string> = {
      Phantom: 'Gy5Kq...mX2p',
      Backpack: '4Px7L...nQ8s',
      Solflare: '9Tz4V...kR1d',
    };
    const addr = demoAddresses[walletName];
    setConnected({ name: walletName, addr });
    setConnecting('');
    setOpen(false);
    onConnected?.(addr);
  };

  const disconnect = () => setConnected(null);

  if (connected) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.3)',
          borderRadius: 10, padding: '6px 12px',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#14F195', display: 'inline-block' }} />
          <span style={{ color: '#14F195', fontSize: 12, fontWeight: 700 }}>{connected.name}</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'monospace' }}>{connected.addr}</span>
        </div>
        <button onClick={disconnect} style={{
          background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)',
          borderRadius: 8, padding: '5px 10px', color: '#FF6B6B',
          fontSize: 11, cursor: 'pointer', fontWeight: 600,
        }}>Disconnect</button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'rgba(153,69,255,0.12)', border: '1px solid rgba(153,69,255,0.4)',
          borderRadius: 10, padding: '7px 16px', color: '#c084fc',
          fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          transition: 'all 0.2s',
        }}
      >
        <span>🔗</span> Connect Wallet
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '110%', right: 0, width: 260,
          background: '#111118', border: '1px solid rgba(153,69,255,0.3)',
          borderRadius: 16, padding: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          zIndex: 9999, animation: 'fadeUp 0.2s ease',
        }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 10, paddingLeft: 4 }}>SELECT WALLET</div>
          {WALLETS.map(w => (
            <button
              key={w.name}
              onClick={() => connect(w.name)}
              disabled={!!connecting}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                background: connecting === w.name ? 'rgba(153,69,255,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${connecting === w.name ? 'rgba(153,69,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 10, padding: '10px 12px', cursor: 'pointer',
                marginBottom: 6, transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 20 }}>{w.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>
                  {connecting === w.name ? 'Connecting...' : w.name}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{w.desc}</div>
              </div>
              {connecting === w.name && (
                <span style={{ marginLeft: 'auto', color: '#9945FF', fontSize: 12 }}>⟳</span>
              )}
            </button>
          ))}
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 8 }}>
            No wallet? <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" style={{ color: '#9945FF' }}>Get Phantom free →</a>
          </div>
        </div>
      )}
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
