import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI-Sentinel | Real-time Solana Transaction Guard',
  description: 'AI-powered real-time security analysis for Solana transactions. Detect phishing, wallet drainers, and exploits before you sign — powered by Helius RPC and Google Gemini AI.',
  keywords: ['Solana', 'security', 'blockchain', 'AI', 'transaction', 'phishing', 'DeFi', 'Phantom', 'Helius', 'Colosseum'],
  openGraph: {
    title: 'AI-Sentinel | Real-time Solana Transaction Guard',
    description: 'Know what you are signing before you sign it. AI-powered Solana security.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Sentinel | Solana Transaction Guard',
    description: 'AI-powered real-time security analysis for Solana transactions.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
