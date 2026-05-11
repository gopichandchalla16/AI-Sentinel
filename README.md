# 🛡️ AI-Sentinel — Solana’s First Agentic Transaction Firewall

> **Colosseum Frontier Hackathon 2026** — Deadline: May 11, 2026

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ai--sentinel.vercel.app-9945FF?style=for-the-badge)](https://ai-sentinel.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-14F195?style=for-the-badge)](LICENSE)
[![Solana](https://img.shields.io/badge/Solana-Mainnet-9945FF?style=for-the-badge)](https://solana.com)

---

## 🚨 The Problem

**$4.2 billion** was lost to DeFi exploits, wallet drainers, and phishing attacks in 2024 alone.

The data to prevent these attacks exists on-chain — but 99% of users cannot read raw blockchain logs or identify malicious program signatures. When a wallet asks you to “sign this transaction”, most users have no idea what they’re actually approving.

---

## ✅ The Solution

**AI-Sentinel** is a real-time AI security firewall for Solana.

- 🔍 **Paste any transaction signature** — from your wallet, Solscan, or any source
- 🤖 **Gemini 1.5 Flash AI** analyzes the transaction against 7 threat categories
- 🛡️ **Get a plain-English verdict** in under 2 seconds — Safe, Caution, High Risk, or Critical

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────┐
│         USER / WALLET DAPP                  │
│   Paste tx signature OR connect Phantom      │
└────────────────────────────────────────────┘
                       │
                 POST /api/analyze
                       │
┌────────────────────────────────────────────┐
│       NEXT.JS API ROUTE (Vercel Edge)        │
│   1. Validate signature (base58 check)       │
│   2. Fetch tx from Helius RPC                │
│   3. extractTransactionContext()             │
│      - Account keys & program IDs            │
│      - SOL balance changes                   │
│      - Token balance changes                 │
│      - setAuthority / closeAccount flags     │
│      - Known dangerous program check         │
│   4. analyzeTransaction() -> Gemini 1.5 Flash│
│   5. Rule-based fallback if Gemini fails     │
│   6. Force CRITICAL if known drainer         │
└────────────────────────────────────────────┘
       │                         │
  Helius RPC               Gemini 1.5 Flash
  (Solana mainnet)         (Google AI Studio)
```

---

## ✨ Features

| Feature | Status |
|---|---|
| Real-time transaction analysis | ✅ Live |
| Gemini 1.5 Flash AI engine | ✅ Live |
| Rule-based fallback (Gemini down) | ✅ Live |
| 7 threat categories scan | ✅ Live |
| Known drainer program database | ✅ Live |
| Phantom wallet connect | ✅ Live |
| Wallet transaction history | ✅ Live |
| Scan history (localStorage) | ✅ Live |
| Mobile responsive | ✅ Live |
| Open source (MIT) | ✅ Live |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS + inline styles |
| AI Engine | Google Gemini 1.5 Flash |
| Blockchain | Helius RPC (Solana mainnet) |
| Wallet | Phantom Wallet (custom adapter) |
| Deployment | Vercel Edge Network |
| License | MIT |

---

## 🚀 Quick Start

```bash
git clone https://github.com/gopichandchalla16/AI-Sentinel
cd AI-Sentinel
npm install
cp .env.example .env.local
# Add your GEMINI_API_KEY and HELIUS_RPC to .env.local
npm run dev
```

Visit: http://localhost:3000

---

## 🔑 Environment Variables

```
GEMINI_API_KEY=your_google_ai_studio_key
HELIUS_RPC=https://mainnet.helius-rpc.com/?api-key=your_helius_key
NEXT_PUBLIC_HELIUS_RPC=https://mainnet.helius-rpc.com/?api-key=your_helius_key
```

Get keys:
- Gemini: https://aistudio.google.com/app/apikey
- Helius: https://helius.dev

---

## 🏆 Colosseum Judging Criteria Alignment

| Criterion | How AI-Sentinel scores |
|---|---|
| **Functionality** | Fully deployed on Vercel. Live RPC + Gemini AI. Rule-based fallback ensures 100% uptime. <2s per scan. |
| **Potential Impact** | $4.2B market problem. 500M+ potential users. Every Solana wallet user is a customer. |
| **Novelty** | First open-source LLM-powered transaction firewall on Solana. Category creator. |
| **UX** | Any non-technical user gets a plain-English verdict. Demo Mode requires zero blockchain knowledge. |
| **Open Source** | MIT license. Full source at github.com/gopichandchalla16/AI-Sentinel. Composable — any dApp can integrate the `/api/analyze` endpoint. |
| **Business Plan** | Freemium API (100 scans/day free), Premium SDK ($99/mo), Enterprise wallet monitoring ($999/mo), Insurance protocol integrations. |

---

## 💼 Business Model

```
Tier 1: Free API (100 scans/day)
  └→ Consumer wallets, individual traders

Tier 2: Developer API ($99/month)
  └→ 100,000 scans/month
  └→ Webhook alerts
  └→ Custom threat rules

Tier 3: Enterprise SDK ($999/month)
  └→ Unlimited scans
  └→ Real-time wallet monitoring
  └→ Custom model fine-tuning
  └→ Insurance protocol integrations

Tier 4: Wallet Extension (freemium)
  └→ Auto-scan before every Phantom approve
  └→ Subscription for premium alerts
```

---

## 👥 Team

| Name | Role | Colosseum |
|---|---|---|
| Gopichand Challa | Lead Engineer (AI + Solana) | @gopichand_web3 |
| Kaviya | Frontend + UX | @Kaviya |
| Kalisetty | Backend + DevOps | @Romeyy123 |

---

**🌐 Live:** https://ai-sentinel.vercel.app  
**📂 Repo:** https://github.com/gopichandchalla16/AI-Sentinel  
**📜 License:** MIT
