import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI-Sentinel | Solana Transaction Firewall',
  description: 'Paste any Solana transaction signature and get an AI security verdict in under 2 seconds. Detect drainers, phishing, and malicious programs before you sign.',
  keywords: ['Solana', 'blockchain security', 'transaction scanner', 'DeFi safety', 'AI', 'Colosseum Hackathon'],
  openGraph: {
    title: 'AI-Sentinel | Solana Transaction Firewall',
    description: 'AI-powered Solana transaction security. Know what you sign.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body className="bg-[#0a0a0f] text-[#F8FAFC] min-h-screen">
        {children}
      </body>
    </html>
  );
}
