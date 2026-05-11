'use client';
import { useState } from 'react';

const FREE = ['✅ 50 transaction scans/day', '✅ Wallet risk profiler', '✅ Program scanner', '✅ Basic threat feed', '✅ AI transaction chat', '✅ Open source MIT'];
const PRO = ['✅ Unlimited scans', '✅ Real-time wallet monitoring', '✅ API access (1,000 req/day)', '✅ Portfolio risk dashboard', '✅ Webhook alerts', '✅ Priority AI analysis'];
const ENT = ['✅ White-label firewall SDK', '✅ dApp pre-signing integration', '✅ Custom threat models', '✅ SLA guarantee', '✅ Audit report export', '✅ On-premise deployment'];

export default function BusinessModel() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const join = () => {
    if (email.includes('@')) setJoined(true);
  };

  return (
    <section id="business" style={{ maxWidth: 960, margin: '0 auto', padding: '48px 16px 64px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9945FF', letterSpacing: '0.12em', marginBottom: 8 }}>BUSINESS MODEL</p>
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 900, color: '#F8FAFC', marginBottom: 8 }}>Built to Scale</h2>
        <p style={{ color: '#94A3B8', fontSize: 15 }}>From hackathon to ecosystem infrastructure</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, marginBottom: 32 }}>
        {/* Free */}
        <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#F8FAFC' }}>Free Tier</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#14F195', marginTop: 4 }}>$0<span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 400 }}>/ month</span></div>
          </div>
          <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FREE.map(f => <li key={f} style={{ fontSize: 13, color: '#94A3B8' }}>{f}</li>)}
          </ul>
          <a href="#scanner" style={{ display: 'block', textAlign: 'center', padding: '10px 0', borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: 'none', background: '#1e1e2e', color: '#F8FAFC' }}>Use Now — Free</a>
        </div>

        {/* Pro */}
        <div style={{ background: '#111118', border: '1px solid rgba(153,69,255,0.5)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 0 30px rgba(153,69,255,0.1)' }}>
          <span style={{ alignSelf: 'flex-start', padding: '3px 12px', borderRadius: 9999, background: 'rgba(153,69,255,0.15)', color: '#9945FF', fontSize: 11, fontWeight: 700, border: '1px solid rgba(153,69,255,0.3)' }}>Most Popular</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#F8FAFC' }}>Pro</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#14F195', marginTop: 4 }}>$29<span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 400 }}>/ month</span></div>
          </div>
          <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PRO.map(f => <li key={f} style={{ fontSize: 13, color: '#94A3B8' }}>{f}</li>)}
          </ul>
          {joined ? (
            <div style={{ textAlign: 'center', padding: '10px 0', borderRadius: 10, background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.3)', color: '#14F195', fontSize: 13, fontWeight: 700 }}>✅ You&apos;re on the waitlist!</div>
          ) : (
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="email" placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && join()}
                style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(153,69,255,0.3)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 12, outline: 'none' }}
              />
              <button
                onClick={join}
                style={{ padding: '8px 14px', borderRadius: 8, fontWeight: 700, fontSize: 12, background: 'linear-gradient(135deg,#9945FF,#7c3aed)', color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >Join Waitlist</button>
            </div>
          )}
        </div>

        {/* Enterprise */}
        <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#F8FAFC' }}>Enterprise / SDK</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#14F195', marginTop: 4 }}>Custom</div>
            <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>For wallets, dApps, and protocols</p>
          </div>
          <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ENT.map(f => <li key={f} style={{ fontSize: 13, color: '#94A3B8' }}>{f}</li>)}
          </ul>
          <a href="mailto:gopichandchalla16@gmail.com" style={{ display: 'block', textAlign: 'center', padding: '10px 0', borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: 'none', background: '#1e1e2e', color: '#F8FAFC' }}>Contact Us</a>
        </div>
      </div>

      {/* Market stats */}
      <div style={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: 16, padding: 28, textAlign: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32, marginBottom: 16 }}>
          {[['500M+', 'Potential Users'], ['$4.2B', 'Lost to DeFi Scams in 2024'], ['0', 'Consumer-Friendly AI Scanners on Solana']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: 26, fontWeight: 900, background: 'linear-gradient(135deg,#9945FF,#14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{v}</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 14, color: '#94A3B8', maxWidth: 560, margin: '0 auto' }}>AI-Sentinel is the MetaMask Snaps equivalent for Solana — but smarter, faster, and built for everyone. Every wallet on Solana is a potential user.</p>
      </div>
    </section>
  );
}
