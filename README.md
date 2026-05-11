# 🛡️ AI-Sentinel — Solana's First Agentic Transaction Firewall

> **Colosseum Frontier Hackathon 2026** — Deadline: May 11, 2026

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ai--sentinel--three.vercel.app-9945FF?style=for-the-badge)](https://ai-sentinel-three.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-14F195?style=for-the-badge)](LICENSE)
[![Solana](https://img.shields.io/badge/Solana-Mainnet-9945FF?style=for-the-badge)](https://solana.com)
[![Built with Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4?style=for-the-badge)](https://aistudio.google.com)

---

## 🌐 Live Demo

**➡️ [https://ai-sentinel-three.vercel.app](https://ai-sentinel-three.vercel.app)**

---

## 🚨 The Problem

**$4.2 billion** was lost to DeFi exploits, wallet drainers, and phishing attacks in 2024 alone.

The data to prevent these attacks exists on-chain — but 99% of users cannot read raw blockchain logs or identify malicious program signatures. When a wallet asks you to “sign this transaction”, most users have no idea what they’re actually approving.

---

## ✅ The Solution

**AI-Sentinel** is a real-time AI security firewall for Solana.

- 🔍 **Paste any transaction signature** — from your wallet, Solscan, or any source
- 🤖 **Gemini 1.5 Flash AI** analyzes the transaction against 7 threat categories in real-time
- 🛡️ **Get a plain-English verdict** in under 2 seconds — Safe, Caution, High Risk, or Critical
- 👛 **Wallet Profiler** — paste any wallet address to get a full AI behavioral risk profile
- 📡 **Live Threat Feed** — real-time Solana mainnet threat monitoring
- 🔬 **Program Scanner** — verify any Solana smart contract before interacting
- 💬 **AI Chat** — ask follow-up questions in plain English after any scan

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────┐
│            USER / WALLET / dAPP                  │
│   Paste tx signature, wallet address, program ID  │
└────────────────────────────────────────────┘
                        │
         ┌────────────┤ 4 API Routes ├────────────┐
         │      │            │            │      │
    /api/analyze  /api/wallet  /api/program  /api/threat
    (Tx Scanner)  -profile     -scan         -feed
    (Gemini AI)   (Gemini AI)  (Gemini AI)   (RPC Fetch)
         │      │            │            │      │
         └──────┴────────────┴────────────┴──────┘
                        │
              Helius RPC + Gemini 1.5 Flash
              (Solana Mainnet Real-time Data)
```

---

## ✨ Features

| Feature | Status |
|---|---|
| 🔍 Real-time transaction scanner | ✅ Live |
| 🤖 Gemini 1.5 Flash AI analysis | ✅ Live |
| 👛 Wallet behavioral profiler | ✅ Live |
| 📡 Live threat feed | ✅ Live |
| 🔬 Program / dApp scanner | ✅ Live |
| 💬 AI chat (ask follow-up questions) | ✅ Live |
| ⚠️ 7 threat categories detection | ✅ Live |
| 📤 Share scan results | ✅ Live |
| 📈 Count-up animated stats bar | ✅ Live |
| 📱 Mobile responsive | ✅ Live |
| 🔓 No wallet connection required | ✅ Live |
| 📂 Open source MIT | ✅ Live |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS + inline styles |
| AI Engine | Google Gemini 1.5 Flash |
| Blockchain RPC | Helius (Solana mainnet) |
| Deployment | Vercel Edge Network |
| License | MIT |

---

## 🚀 Quick Start

```bash
git clone https://github.com/gopichandchalla16/AI-Sentinel
cd AI-Sentinel
npm install
cp .env.example .env.local
# Fill in your keys in .env.local
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

```env
# Google AI Studio — https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_google_gemini_api_key

# Helius RPC — https://helius.dev (free tier: 100k req/day)
HELIUS_RPC=https://mainnet.helius-rpc.com/?api-key=your_helius_api_key

# Public RPC fallback (optional, used client-side)
NEXT_PUBLIC_HELIUS_RPC=https://mainnet.helius-rpc.com/?api-key=your_helius_api_key
```

---

## 🏆 Colosseum Judging Criteria

| Criterion | AI-Sentinel Score |
|---|---|
| **Functionality** | 4 fully wired API routes. Gemini + Helius live. Rule-based fallback ensures 100% uptime. <2s per scan. |
| **Potential Impact** | $4.2B problem. 500M+ potential users. Every Solana wallet user is a customer. |
| **Novelty** | First open-source LLM-powered transaction firewall + wallet profiler on Solana. |
| **UX** | Plain-English verdicts. AI chat. Tab navigation. Share button. No login required. |
| **Open Source** | MIT. Composable — any dApp can call `/api/analyze` directly. |
| **Business Plan** | 3-tier pricing (Free / Pro $29 / Enterprise Custom). Real TAM stats. |

---

## 💼 Business Model

```
Free     — $0/mo   : 50 tx scans/day, wallet profiler, program scanner
Pro      — $29/mo  : Unlimited scans, API access, real-time alerts
Enterprise — Custom : White-label SDK, custom threat models, SLA, on-premise
```

**TAM:** 500M+ users · $4.2B lost in 2024 · 0 consumer-friendly AI scanners on Solana today

---

## 👥 Team

| Name | Role |
|---|---|
| Gopichand Challa | Lead Engineer (AI + Solana) |
| Kaviya | Frontend + UX |
| Kalisetty | Backend + DevOps |

---

**🌐 Live:** [https://ai-sentinel-three.vercel.app](https://ai-sentinel-three.vercel.app)  
**📂 Repo:** [https://github.com/gopichandchalla16/AI-Sentinel](https://github.com/gopichandchalla16/AI-Sentinel)  
**📜 License:** MIT  
**🏆 Hackathon:** [Colosseum Frontier 2026](https://colosseum.org/frontier)
