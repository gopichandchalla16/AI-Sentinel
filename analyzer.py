import google.generativeai as genai
import json
import os

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set. Get your free key at https://aistudio.google.com")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

def analyze(tx_data, wallet_history, balance):
    """Analyze a Solana transaction for security risks using Gemini AI"""
    tx_str = json.dumps(tx_data, indent=2)[:3000]
    hist_str = json.dumps(wallet_history, indent=2)[:800]

    prompt = f"""You are a Solana blockchain security expert.
Analyze this transaction and respond in this EXACT format:

RISK: [LOW / MEDIUM / HIGH / CRITICAL]
FLAGS:
- [Red flag 1]
- [Red flag 2 if any]
SUMMARY: [One sentence: what this transaction does]
RECOMMENDATION: [Proceed safely / Proceed with caution / DO NOT SIGN - reason]

Transaction Data:
{tx_str}

Destination Wallet History (last 5 txns):
{hist_str}

Destination Wallet SOL Balance: {balance} SOL

Analyze for: wallet age, balance levels, transaction type, token amounts, suspicious program calls, destination wallet history, and known exploit patterns.
Be concise and direct."""

    response = model.generate_content(prompt)
    return response.text
