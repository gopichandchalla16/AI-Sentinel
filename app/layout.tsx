import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI-Sentinel | Real-Time Solana Transaction Guard',
  description: 'AI-powered firewall that protects Solana users from malicious transactions, phishing, and exploits. Connect Phantom wallet, scan any transaction, get instant AI risk verdict.',
  keywords: 'Solana, AI, security, transaction scanner, Phantom wallet, DeFi protection, blockchain',
  openGraph: {
    title: 'AI-Sentinel — Real-Time Solana Transaction Guard',
    description: 'Scan any Solana transaction with AI. Get instant risk score, threat flags, and human-readable verdict before you sign.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%23020408'/><path d='M16 4 L26 9 L26 17 C26 22 21 27 16 29 C11 27 6 22 6 17 L6 9 Z' fill='none' stroke='%2300ff88' stroke-width='2'/><path d='M12 16 L15 19 L20 13' stroke='%2300ff88' stroke-width='2' stroke-linecap='round' fill='none'/></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
