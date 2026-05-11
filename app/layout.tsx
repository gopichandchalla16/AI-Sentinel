import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI-Sentinel | Solana Transaction Security Firewall',
  description: 'AI-powered security for Solana transactions. Know what you sign before it is too late. Free, instant, no wallet connection needed.',
  keywords: 'Solana,blockchain security,transaction scanner,DeFi safety,AI,Colosseum Hackathon',
  openGraph: {
    title: 'AI-Sentinel | Stop Crypto Scams Before They Happen',
    description: 'Paste any Solana transaction ID and get an AI security verdict in under 2 seconds. Live threat feed, MEV detector, wallet profiler.',
    url: 'https://ai-sentinel-three.vercel.app',
    type: 'website',
    images: [
      {
        url: 'https://ai-sentinel-three.vercel.app/og.png',
        width: 1200,
        height: 630,
        alt: 'AI-Sentinel — Solana Transaction Firewall',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Sentinel | Solana Security Firewall',
    description: 'AI security for Solana transactions — MEV detector, live threat feed, wallet profiler. Free & open source.',
    images: ['https://ai-sentinel-three.vercel.app/og.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#0a0a0f', color: '#F8FAFC', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
