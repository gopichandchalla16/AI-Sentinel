import { NextRequest, NextResponse } from 'next/server'

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com'

const rpcPost = async (method: string, params: unknown[]) => {
  const res = await fetch(SOLANA_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    cache: 'no-store',
  })
  return res.json()
}

async function getTransaction(sig: string) {
  return rpcPost('getTransaction', [sig, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }])
}

async function getBalance(address: string): Promise<number> {
  const data = await rpcPost('getBalance', [address])
  return (data?.result?.value ?? 0) / 1e9
}

async function getSignatureCount(address: string): Promise<number> {
  const data = await rpcPost('getSignaturesForAddress', [address, { limit: 20 }])
  return Array.isArray(data?.result) ? data.result.length : 0
}

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY is not set in environment variables')

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.15, maxOutputTokens: 700 },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        ],
      }),
    }
  )
  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

function parseResponse(text: string) {
  const riskMatch = text.match(/RISK:\s*(LOW|MEDIUM|HIGH|CRITICAL)/i)
  const risk = (riskMatch?.[1]?.toUpperCase() ?? 'MEDIUM') as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

  const flagsMatch = text.match(/FLAGS?:[\s\S]*?(?=SUMMARY:|$)/i)
  const flags = (flagsMatch?.[0] ?? '')
    .split('\n')
    .slice(1)
    .map((l: string) => l.replace(/^[\-\*•]\s*/, '').trim())
    .filter((l: string) => l.length > 4)

  const summaryMatch = text.match(/SUMMARY:\s*(.+?)(?=\nRECOMMENDATION:|$)/is)
  const summary = summaryMatch?.[1]?.trim() ?? 'Transaction analyzed.'

  const recMatch = text.match(/RECOMMENDATION:\s*([\s\S]+?)$/i)
  const recommendation = recMatch?.[1]?.trim() ?? 'Review carefully before proceeding.'

  return { risk, flags, summary, recommendation }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const signature: string = body?.signature ?? ''

    if (!signature || signature.length < 40 || signature.length > 120) {
      return NextResponse.json(
        { error: 'Invalid signature. A Solana transaction signature is 87-88 characters long.' },
        { status: 400 }
      )
    }

    // Fetch transaction from Solana
    const txData = await getTransaction(signature)

    if (!txData?.result) {
      return NextResponse.json(
        { error: 'Transaction not found on Solana mainnet. It may be too old (>60 days) or the signature is incorrect. Find a fresh transaction on solscan.io.' },
        { status: 404 }
      )
    }

    const tx = txData.result
    const accounts: string[] = []
    try {
      const keys = tx?.transaction?.message?.accountKeys ?? []
      for (const k of keys) accounts.push(typeof k === 'string' ? k : k.pubkey)
    } catch { /* empty */ }

    // Fetch destination wallet info in parallel
    const dest = accounts[1] ?? accounts[0] ?? null
    const [destBalance, destHistory] = dest
      ? await Promise.all([getBalance(dest), getSignatureCount(dest)])
      : [0, 0]

    // Build a focused context for Gemini
    const context = {
      fee_lamports: tx.meta?.fee,
      transaction_error: tx.meta?.err,
      block_time_unix: tx.blockTime,
      slot: tx.slot,
      accounts_involved: accounts.slice(0, 8),
      sol_balance_changes: (tx.meta?.preBalances ?? []).map((pre: number, i: number) => ({
        account: accounts[i] ?? i,
        change_sol: (((tx.meta?.postBalances?.[i] ?? 0) - pre) / 1e9).toFixed(6),
      })).slice(0, 6),
      program_logs: (tx.meta?.logMessages ?? []).slice(0, 10),
      inner_instruction_count: tx.meta?.innerInstructions?.length ?? 0,
      destination_wallet: {
        address: dest,
        balance_sol: destBalance.toFixed(4),
        recent_tx_count: destHistory,
        is_new_wallet: destHistory < 3,
        is_empty: destBalance < 0.01,
      },
    }

    const prompt = `You are a Solana blockchain security expert. Analyze the following transaction data and return a structured security assessment.

Respond in EXACTLY this format — no extra sections:
RISK: [LOW / MEDIUM / HIGH / CRITICAL]
FLAGS:
- [red flag 1, or "No significant red flags" if LOW]
- [red flag 2 if present]
SUMMARY: [one clear sentence — what this transaction does and to whom]
RECOMMENDATION: [one of: "Proceed safely." / "Proceed with caution — [reason]." / "DO NOT SIGN — [specific reason]."]

Transaction Analysis Context:
${JSON.stringify(context, null, 2)}

Security checklist — consider each:
1. Is the destination wallet new (< 3 txs) or empty? → HIGH risk indicator
2. Large SOL outflows to unknown wallets? → HIGH/CRITICAL
3. Transaction failed (err field non-null)? → note it
4. Abnormally high fees (> 100,000 lamports)? → suspicious
5. Suspicious program logs mentioning known exploit patterns?
6. Token draining patterns (many SPL token transfers)?
7. Inner instruction complexity (> 5 could be obfuscation)?

Be direct. Be specific. Do not hedge excessively.`

    const geminiText = await callGemini(prompt)
    const parsed = parseResponse(geminiText)

    return NextResponse.json({
      ...parsed,
      txDetails: {
        fee: tx.meta?.fee,
        blockTime: tx.blockTime,
        slot: tx.slot,
        accounts: accounts.slice(0, 5),
        destBalance,
        destHistory,
        err: !!tx.meta?.err,
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected server error'
    console.error('[AI-Sentinel API Error]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
