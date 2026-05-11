'use client';
import { useState } from 'react';

const FAQS = [
  {
    q: '🤔 What is Solana? I never heard of it.',
    a: 'Solana is a digital payment network — like UPI, but global and instant. Instead of a bank controlling your money, thousands of computers worldwide do it together. No one can freeze your account or block your payment. Think of it as "Internet ka apna bank" — nobody owns it, everyone can use it.',
  },
  {
    q: '💸 What is a crypto transaction? How is it different from UPI?',
    a: 'When you send money via UPI, your bank writes it in their private book. In Solana, the transfer is written in a public book (blockchain) that anyone can see but nobody can change. Once done, it is final — no chargebacks, no "server down". AI-Sentinel reads this public book to check if a transaction is safe BEFORE you approve it.',
  },
  {
    q: '🕵️ What is a wallet drainer? How do I get scammed?',
    a: 'Imagine someone sends you a link: "Claim free airdrop! Sign this transaction." You click approve in your wallet — and instantly your entire balance disappears. This is a wallet drainer. Scammers create smart contracts that silently transfer everything the moment you sign. AI-Sentinel detects these BEFORE you sign.',
  },
  {
    q: '🥪 What is an MEV sandwich attack?',
    a: 'MEV (Maximal Extractable Value) bots watch your swap transaction and place their own buy BEFORE yours and sell AFTER — like cutting in line at a shop and then reselling to you at a higher price. You end up paying more than you should. AI-Sentinel flags this automatically.',
  },
  {
    q: '🔑 Do I need a wallet to use AI-Sentinel?',
    a: 'No! You can paste any Solana transaction ID from Solscan, Twitter, or anywhere — totally free, zero wallet needed. If you DO connect your wallet, we can automatically scan your recent transactions and alert you to past threats.',
  },
  {
    q: '🇮🇳 Is this useful for Indians? Is crypto legal in India?',
    a: 'Yes! Crypto trading is legal in India (30% tax applies on profits). Many Indians use Solana for remittances — sending money abroad is 100x cheaper than SWIFT/Western Union. AI-Sentinel protects Indian users from scams that cost the DeFi community ₹35,000 crore ($4.2B) last year.',
  },
];

export default function Web3Explainer() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="learn" style={{ maxWidth: 960, margin: '0 auto', padding: '64px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#14F195', letterSpacing: '0.12em', marginBottom: 8 }}>UNDERSTAND WEB3</p>
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 900, color: '#F8FAFC', marginBottom: 8 }}>New to Crypto? No Problem 🇮🇳</h2>
        <p style={{ color: '#94A3B8', fontSize: 15, maxWidth: 520, margin: '0 auto' }}>Plain-language answers to every question — no jargon, no confusion. Made especially for first-time DeFi users.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {FAQS.map((faq, i) => (
          <div
            key={i}
            style={{
              background: open === i ? 'rgba(153,69,255,0.06)' : '#111118',
              border: `1px solid ${open === i ? 'rgba(153,69,255,0.35)' : '#1e1e2e'}`,
              borderRadius: 14, overflow: 'hidden', transition: 'all 0.25s',
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%', textAlign: 'left', padding: '16px 20px',
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
              }}
            >
              <span style={{ color: '#F8FAFC', fontWeight: 700, fontSize: 14 }}>{faq.q}</span>
              <span style={{
                color: open === i ? '#9945FF' : '#94A3B8',
                fontSize: 18, transform: open === i ? 'rotate(45deg)' : 'none',
                transition: 'all 0.2s', flexShrink: 0,
              }}>+</span>
            </button>
            {open === i && (
              <div style={{ padding: '0 20px 16px', color: '#94A3B8', fontSize: 14, lineHeight: 1.75 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA for beginners */}
      <div style={{
        marginTop: 32, padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(153,69,255,0.1), rgba(20,241,149,0.05))',
        border: '1px solid rgba(153,69,255,0.25)', borderRadius: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🚀</div>
        <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Ready to try it? It is completely free.</h3>
        <p style={{ color: '#94A3B8', fontSize: 14, marginBottom: 16 }}>No account. No wallet needed. Just paste any Solana transaction and see the magic.</p>
        <button
          onClick={() => document.getElementById('scanner')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            background: 'linear-gradient(135deg,#9945FF,#14F195)', border: 'none',
            borderRadius: 12, padding: '12px 32px', color: '#0a0a0f',
            fontWeight: 800, fontSize: 15, cursor: 'pointer',
          }}
        >🛡️ Start Scanning — Free</button>
      </div>
    </section>
  );
}
