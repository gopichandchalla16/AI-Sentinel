import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI-Sentinel | Solana Transaction Guard',
  description: 'Real-time AI-powered security guard for Solana transactions. Detect phishing, exploits, and malicious contracts before you sign — powered by Google Gemini AI.',
  keywords: ['Solana', 'security', 'AI', 'transaction', 'blockchain', 'DeFi', 'phishing', 'Gemini'],
  openGraph: {
    title: 'AI-Sentinel | Solana Transaction Guard',
    description: 'Scan any Solana transaction for risks in real-time using AI.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
