import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI-Sentinel | Solana Transaction Security Firewall',
  description:
    'AI-powered security for Solana transactions. Know what you sign before it is too late. Free, instant, no wallet connection needed.',
  keywords: [
    'Solana',
    'blockchain security',
    'transaction scanner',
    'DeFi safety',
    'AI',
    'Colosseum Hackathon',
  ],
  openGraph: {
    title: 'AI-Sentinel | Stop Crypto Scams Before They Happen',
    description:
      'Paste any Solana transaction ID and get an AI security verdict in under 2 seconds.',
    type: 'website',
    url: 'https://ai-sentinel-three.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Sentinel',
    description: 'AI security for Solana transactions',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: '#0a0a0f',
          color: '#F8FAFC',
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  )
}
