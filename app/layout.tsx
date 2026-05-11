import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI-Sentinel — Real-time Solana Transaction Guard',
  description: 'AI-powered transaction security scanner for Solana. Paste any transaction signature and get an instant risk verdict in plain English. Built for the Colosseum Frontier Hackathon 2026.',
  keywords: ['Solana', 'blockchain security', 'transaction scanner', 'AI', 'DeFi safety', 'wallet guard', 'phishing protection'],
  openGraph: {
    title: 'AI-Sentinel — Real-time Solana Transaction Guard',
    description: 'Protect your Solana wallet with AI. Scan any transaction in under 2 seconds.',
    url: 'https://ai-sentinel.vercel.app',
    siteName: 'AI-Sentinel',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'AI-Sentinel', description: 'AI-powered Solana transaction security scanner.' },
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#020408" />
      </head>
      <body>{children}</body>
    </html>
  );
}
