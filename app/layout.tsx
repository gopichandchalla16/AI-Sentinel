import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI-Sentinel | Solana Transaction Firewall',
  description: 'AI-Sentinel is an autonomous agentic security firewall for Solana. Paste any transaction signature and get an instant AI risk verdict. Built for Colosseum Frontier Hackathon 2026.',
  keywords: ['Solana', 'blockchain security', 'transaction scanner', 'AI', 'DeFi safety', 'wallet protection', 'phishing', 'drainer detection'],
  openGraph: {
    title: 'AI-Sentinel | Solana Transaction Firewall',
    description: 'Paste any Solana transaction signature. Get an AI security verdict in under 2 seconds.',
    url: 'https://ai-sentinel.vercel.app',
    siteName: 'AI-Sentinel',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Sentinel',
    description: 'AI-powered Solana transaction security firewall.',
    creator: '@GopichandAI',
  },
  robots: 'index, follow',
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0a0a0f', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
