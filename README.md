# 🛡️ AI-Sentinel: Real-time Solana Transaction Guard

> An autonomous AI security guard that analyzes Solana transactions for phishing, exploits, and drainers — powered by Google Gemini AI and live on-chain data — **before you sign**.

[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat&logo=solana&logoColor=white)](https://solana.com)
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat&logo=google&logoColor=white)](https://aistudio.google.com)
[![Vercel](https://img.shields.io/badge/Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🎯 The Problem

DeFi users on Solana lost **$4.2B+** to phishing attacks, malicious dApps, and exploit transactions in 2024. Existing block explorers show raw data that most users **cannot interpret before clicking Confirm**.

## 💡 The Solution

AI-Sentinel accepts any Solana transaction signature, fetches **live on-chain data in real-time**, and runs it through **Google Gemini 1.5 Flash** to return:

- ✅ **Risk Score**: `LOW` / `MEDIUM` / `HIGH` / `CRITICAL`
- 🚩 **Red Flags**: Specific reasons for the risk level
- 📝 **Plain-English Summary**: What this transaction actually does
- 🎯 **Clear Recommendation**: Proceed safely / Proceed with caution / **DO NOT SIGN**

All in **under 2 seconds**.

---

## 🏗️ Architecture

```
User Input (tx signature)
        ↓
Next.js API Route (/api/analyze)
        ↓
Solana JSON-RPC Mainnet (getTransaction + getBalance + getSignaturesForAddress)
        ↓
Google Gemini 1.5 Flash (LLM risk analysis with structured prompt)
        ↓
Parsed JSON response → React UI
        ↓
Risk verdict + flags + recommendation
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + Custom CSS |
| Backend | Next.js API Routes (Edge-compatible) |
| Blockchain | Solana JSON-RPC API (mainnet-beta) |
| AI / LLM | Google Gemini 1.5 Flash |
| Deployment | Vercel |

## ⚡ Quick Start

```bash
git clone https://github.com/gopichandchalla16/AI-Sentinel
cd AI-Sentinel
npm install

# Add your Gemini API key (free at aistudio.google.com)
echo GEMINI_API_KEY=your_key_here > .env.local

npm run dev
# Open http://localhost:3000
```

## 🚀 Deploy to Vercel

1. Import this repo at [vercel.com/new](https://vercel.com/new)
2. Add environment variable: `GEMINI_API_KEY=your_key`
3. Deploy — done.

## 👥 Team

| Name | Role |
|---|---|
| **Gopichand Challa** | Lead Engineer · AI/ML + Blockchain |
| **Kaviya** | Frontend Engineer · UX Design |
| **Kalisetty** | Backend Engineer · DevOps |

## 📈 Business Model

- **Free tier**: 20 scans/day
- **Pro ($9/mo)**: Unlimited + wallet monitoring alerts
- **Enterprise API**: For wallets and protocols

## 🔮 Roadmap

- [ ] Browser extension (Chrome/Firefox)
- [ ] Real-time wallet monitoring with alerts
- [ ] Helius webhook integration for streaming txs
- [ ] Phantom Connect wallet integration (Colosseum sponsor)
- [ ] Multi-chain support (Ethereum, Base)

---

*Built with ❤️ for the **Colosseum Frontier Hackathon 2026** 🏔️*
