# 🛡️ AI-Sentinel: Real-time Solana Transaction Guard

> An autonomous AI firewall that protects Solana DeFi users from malicious transactions, phishing, and exploits — before they sign.

[![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=flat&logo=streamlit&logoColor=white)](https://streamlit.io)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat&logo=solana&logoColor=white)](https://solana.com)
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat&logo=google&logoColor=white)](https://aistudio.google.com)

## 🎯 The Problem

DeFi users on Solana lose **billions annually** to phishing attacks, malicious dApps, and complex exploit transactions they cannot read before clicking Confirm. Existing tools show raw blockchain logs. Nobody shows you **answers**.

## 💡 The Solution

AI-Sentinel intercepts any Solana transaction signature, fetches live on-chain state in real-time, and runs it through Google Gemini to generate:

- ✅ **Risk Score**: LOW / MEDIUM / HIGH / CRITICAL
- 🔎 **Red Flags**: Specific reasons for the risk level
- 📝 **Plain-English Summary**: What this transaction actually does
- 🚨 **Recommendation**: Proceed safely / Proceed with caution / DO NOT SIGN

## 🚀 Live Demo

> Deploy to Streamlit Cloud and add link here

## 🏗️ Architecture

```
User Input (tx signature)
    ↓
Solana JSON-RPC API (mainnet)
    ↓ (fetch tx data + wallet history + balance)
Google Gemini 1.5 Flash
    ↓ (LLM risk analysis)
Streamlit UI
    ↓
Risk Score + Plain-English Explanation
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Blockchain | Solana Mainnet JSON-RPC API |
| AI / LLM | Google Gemini 1.5 Flash |
| Backend | Python 3.11 |
| Frontend | Streamlit |
| Deployment | Streamlit Community Cloud |

## ⚡ Quick Start

```bash
git clone https://github.com/gopichandchalla16/AI-Sentinel
cd AI-Sentinel
pip install -r requirements.txt
export GEMINI_API_KEY="your_key_here"
streamlit run app.py
```

Get your free Gemini API key at: https://aistudio.google.com

Paste any Solana transaction signature from [solscan.io](https://solscan.io)

## 👥 Team

| Name | Role |
|---|---|
| **Gopichand Challa** | AI/Data Engineer & Project Lead |
| **Kaviya** | Frontend Engineer & UX Lead |
| **Kalisetty** | Backend Engineer & DevOps Lead |

## 📈 Business Model

- **Free tier**: 10 transaction scans/day
- **Pro ($9/mo)**: Unlimited scans + wallet monitoring alerts
- **Enterprise**: API access for protocols and wallets

## 🔮 Roadmap

- [ ] Browser extension for real-time wallet protection
- [ ] Anchor program for on-chain verification
- [ ] Webhook alerts for monitored wallets
- [ ] Multi-chain support
- [ ] API for protocol integrations

## 📄 License

MIT License — Open source and composable with the Solana ecosystem.

---

Built with ❤️ for the **Colosseum Frontier Hackathon 2026** 🏔️
