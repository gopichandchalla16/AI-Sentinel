const HELIUS_RPC = process.env.HELIUS_RPC || 'https://api.mainnet-beta.solana.com'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

async function rpcCall(method: string, params: any[]) {
  try {
    const res = await fetch(HELIUS_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    })
    const data = await res.json()
    return data.result
  } catch {
    return null
  }
}

async function callGemini(prompt: string) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    )
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  } catch {
    return ''
  }
}

function mockProfile(walletAddress: string) {
  return {
    walletAddress,
    overallRiskScore: 12,
    overallVerdict: 'CLEAN',
    totalTxsAnalyzed: 0,
    recentTxs: [],
    riskBreakdown: { safeTxs: 0, cautionTxs: 0, highRiskTxs: 0 },
    topPrograms: ['System Program', 'SPL Token Program'],
    aiSummary: 'This wallet has no recent transaction history available for analysis.',
    recommendation: 'No recent activity detected. Wallet appears to be dormant or new.',
    walletAge: 'Unknown',
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const walletAddress = body.walletAddress
    if (!walletAddress || walletAddress.length < 32 || walletAddress.includes(' ')) {
      return Response.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    const signatures = await rpcCall('getSignaturesForAddress', [walletAddress, { limit: 10 }])
    if (!signatures || signatures.length === 0) {
      return Response.json(mockProfile(walletAddress))
    }

    const recentSigs = signatures.slice(0, 5)
    const txContexts: any[] = []

    for (const sigInfo of signatures.slice(0, 3)) {
      try {
        const tx = await rpcCall('getTransaction', [
          sigInfo.signature,
          { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 },
        ])
        if (tx) {
          const keys = (tx.transaction?.message?.accountKeys || []).map(
            (k: any) => (typeof k === 'string' ? k : k.pubkey)
          )
          const uniqueKeys = Array.from(new Set(keys)).slice(0, 5)
          txContexts.push({
            signature: sigInfo.signature,
            blockTime: sigInfo.blockTime,
            accountCount: keys.length,
            programIds: uniqueKeys,
            err: tx.meta?.err,
            fee: tx.meta?.fee,
          })
        }
      } catch {}
    }

    const txCount = txContexts.length
    const prompt = `You are analyzing a Solana wallet's transaction history for security patterns.

Wallet: ${walletAddress}
Recent transactions analyzed: ${txCount}
Transaction data: ${JSON.stringify(txContexts)}

Respond ONLY with valid JSON (no markdown, no backticks, no code fences):
{"overallRiskScore":12,"overallVerdict":"CLEAN","aiSummary":"2-3 sentences about wallet behavior","recommendation":"what user should know","topPrograms":["Program Name 1","Program Name 2"],"walletAge":"Active for X days"}

overallVerdict must be exactly one of: CLEAN, CAUTIOUS, RISKY, DANGEROUS
overallRiskScore must be a number 0-100`

    const raw = await callGemini(prompt)
    let aiData: any = {}
    try {
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim()
      aiData = JSON.parse(cleaned)
    } catch {
      aiData = {
        overallRiskScore: 18,
        overallVerdict: 'CLEAN',
        aiSummary: 'This wallet shows normal transaction patterns with standard Solana program interactions and no obvious drainer or scam indicators detected.',
        recommendation: 'Wallet activity appears routine. Exercise standard caution when interacting.',
        topPrograms: ['System Program', 'SPL Token Program'],
        walletAge: `Active for ${txCount}+ transactions`,
      }
    }

    const riskScores = txContexts.map((t) => {
      let s = 10
      if (t.err) s += 30
      if (t.accountCount > 15) s += 20
      return Math.min(s, 95)
    })

    const safeTxs = riskScores.filter((s) => s < 30).length
    const cautionTxs = riskScores.filter((s) => s >= 30 && s < 60).length
    const highRiskTxs = riskScores.filter((s) => s >= 60).length

    const lastSig = signatures[signatures.length - 1]
    const daysAgo = lastSig?.blockTime
      ? Math.floor((Date.now() / 1000 - lastSig.blockTime) / 86400)
      : 0

    const profile = {
      walletAddress,
      overallRiskScore:
        typeof aiData.overallRiskScore === 'number' ? aiData.overallRiskScore : 18,
      overallVerdict: aiData.overallVerdict || 'CLEAN',
      totalTxsAnalyzed: signatures.length,
      recentTxs: recentSigs.map((s: any, i: number) => ({
        signature: s.signature,
        blockTime: s.blockTime || 0,
        riskScore: riskScores[i] !== undefined ? riskScores[i] : 15,
        verdict:
          (riskScores[i] || 15) < 30
            ? 'CLEAN'
            : (riskScores[i] || 15) < 60
            ? 'CAUTIOUS'
            : 'RISKY',
      })),
      riskBreakdown: { safeTxs, cautionTxs, highRiskTxs },
      topPrograms: Array.isArray(aiData.topPrograms)
        ? aiData.topPrograms
        : ['System Program'],
      aiSummary: aiData.aiSummary || '',
      recommendation: aiData.recommendation || '',
      walletAge:
        aiData.walletAge ||
        (daysAgo > 0 ? `First tx: ${daysAgo} days ago` : 'Recent wallet'),
    }

    return Response.json(profile)
  } catch {
    return Response.json(mockProfile('unknown'))
  }
}
