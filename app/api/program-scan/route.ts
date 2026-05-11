const HELIUS_RPC = process.env.HELIUS_RPC || 'https://api.mainnet-beta.solana.com'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

const KNOWN_PROGRAMS: Record<string, { name: string; trust: number; verified: boolean }> = {
  '11111111111111111111111111111111': { name: 'System Program', trust: 100, verified: true },
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': { name: 'SPL Token Program', trust: 100, verified: true },
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8': { name: 'Raydium AMM', trust: 92, verified: true },
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': { name: 'Jupiter Aggregator v6', trust: 95, verified: true },
  '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP': { name: 'Orca Whirlpool', trust: 60, verified: false },
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s': { name: 'Metaplex Token Metadata', trust: 90, verified: true },
  'So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo': { name: 'Solend Protocol', trust: 85, verified: true },
  'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD': { name: 'Marinade Finance', trust: 90, verified: true },
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

function timeAgo(blockTime: number): string {
  const diff = Math.floor(Date.now() / 1000 - blockTime)
  if (diff < 60) return diff + ' seconds ago'
  if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago'
  if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago'
  return Math.floor(diff / 86400) + ' days ago'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const programId = body.programId
    if (!programId || programId.length < 32) {
      return Response.json({ error: 'Invalid program ID' }, { status: 400 })
    }

    const knownData = KNOWN_PROGRAMS[programId] || null

    let sigCount = 0
    let lastActivity = 'Unknown'
    try {
      const sigsRes = await fetch(HELIUS_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getSignaturesForAddress',
          params: [programId, { limit: 10 }],
        }),
      })
      const sigsData = await sigsRes.json()
      const sigs = sigsData.result || []
      sigCount = sigs.length
      if (sigs[0]?.blockTime) lastActivity = timeAgo(sigs[0].blockTime)
    } catch {}

    const prompt = `Analyze this Solana program for security and legitimacy:
Program ID: ${programId}
Known protocol: ${knownData?.name || 'Unknown'}
Known trust score: ${knownData?.trust !== undefined ? knownData.trust : 'Not in database'}
Recent transactions count: ${sigCount}
Last activity: ${lastActivity}

Respond with ONLY valid JSON (no markdown, no backticks, no code fences):
{"trustScore":50,"trustLevel":"UNVERIFIED","protocolName":"Unknown Protocol","aiAnalysis":"2-3 sentence assessment","redFlags":[],"safeToInteract":false,"verificationBadge":"Unaudited","isKnownProtocol":false}

trustLevel must be exactly one of: VERIFIED, UNVERIFIED, SUSPICIOUS, DANGEROUS
trustScore must be a number 0-100`

    const raw = await callGemini(prompt)
    let aiData: any = {}
    try {
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim()
      aiData = JSON.parse(cleaned)
    } catch {
      aiData = {
        trustScore: knownData?.trust || 50,
        trustLevel: knownData?.verified ? 'VERIFIED' : 'UNVERIFIED',
        protocolName: knownData?.name || 'Unknown Protocol',
        aiAnalysis: knownData
          ? `${knownData.name} is a ${knownData.verified ? 'verified' : 'unverified'} Solana program with a trust score of ${knownData.trust}/100. It has ${sigCount} recent interactions on-chain.`
          : 'This program is not in our known protocols database. Exercise caution when interacting with unknown programs.',
        redFlags: knownData?.verified ? [] : ['Not in known programs database'],
        safeToInteract: knownData ? knownData.trust >= 70 : false,
        verificationBadge: knownData?.verified ? '✅ Community Verified' : '⚠️ Unaudited',
        isKnownProtocol: !!knownData,
      }
    }

    const result = {
      programId,
      trustScore: knownData ? knownData.trust : (typeof aiData.trustScore === 'number' ? aiData.trustScore : 50),
      trustLevel: knownData?.verified ? 'VERIFIED' : (aiData.trustLevel || 'UNVERIFIED'),
      isKnownProtocol: !!knownData || (aiData.isKnownProtocol === true),
      protocolName: knownData?.name || aiData.protocolName || 'Unknown Protocol',
      aiAnalysis: aiData.aiAnalysis || '',
      recentActivity: { totalInteractions: sigCount, uniqueUsers: 'N/A', lastActivity },
      redFlags: Array.isArray(aiData.redFlags) ? aiData.redFlags : [],
      safeToInteract: knownData ? knownData.trust >= 70 : (aiData.safeToInteract === true),
      verificationBadge: knownData?.verified
        ? '✅ Community Verified'
        : (aiData.verificationBadge || '⚠️ Unaudited'),
    }

    return Response.json(result)
  } catch {
    return Response.json({ error: 'Failed to scan program' }, { status: 500 })
  }
}
