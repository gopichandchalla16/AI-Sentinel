# 🛡️ AI-Sentinel — Real-Time Solana Transaction Guard

> **Colosseum Frontier Hackathon Submission** — AI × Solana Security Tooling

[![Live Demo](https://img.shields.io/badge/Live-Vercel-black?logo=vercel)](https://ai-sentinel.vercel.app)
[![Solana](https://img.shields.io/badge/Solana-Mainnet-9945ff?logo=solana)](https://solana.com)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

## 🚨 The Problem

DeFi users lost **$4.2B+** to exploits, phishing, and drainer contracts in 2024. Existing explorers show raw blockchain logs that 99% of users cannot interpret. There is no simple tool that tells you in plain English: *"Is this transaction safe?"*

## 💡 The Solution

AI-Sentinel is an autonomous AI firewall for Solana. Paste any transaction signature, and in under 2 seconds you get:

- ✅ **Risk Score** (0-100) with clear LOW / MEDIUM / HIGH / CRITICAL verdict
- 🔴 **Red Flags** — specific threats detected (drainer patterns, excessive approvals, unknown programs)
- 📖 **Plain English Summary** — what the transaction actually does
- ⚡ **Recommendation** — SAFE TO PROCEED / PROCEED WITH CAUTION / DO NOT SIGN
- 👻 **Phantom Wallet Integration** — connect your wallet and scan recent txs

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| AI Engine | Google Gemini 1.5 Flash |
| Blockchain RPC | Helius (Enterprise Solana Node) |
| Wallet | Phantom Wallet Adapter |
| Deployment | Vercel Edge Network |

## 🚀 Quick Start

```bash
git clone https://github.com/gopichandchalla16/AI-Sentinel
cd AI-Sentinel
npm install

# Add env vars
echo "GEMINI_API_KEY=your_key" > .env.local
echo "HELIUS_RPC=https://mainnet.helius-rpc.com/?api-key=your_key" >> .env.local

npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key |
| `HELIUS_RPC` | Optional | Helius RPC URL (defaults to public mainnet) |

## 📸 Features

- **Real-time scanning** — live Solana mainnet data via Helius RPC
- **AI threat modeling** — 7 threat categories analyzed per transaction
- **Phantom wallet connect** — scan your own recent transactions
- **Scan history** — track your last 5 scans with risk levels
- **Dark cyberpunk UI** — built for Solana's aesthetic
- **Mobile responsive** — works on any device

## 🏆 Colosseum Hackathon

Track: **AI Platforms / Agents**  
Mission: Making Web3 safer for the next billion users through autonomous AI security agents on Solana.

---

Built with ❤️ by [@GopichandAI](https://twitter.com/GopichandAI) for Colosseum Frontier 2026
