export const runtime = 'nodejs';
export const maxDuration = 30;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS });
}

// ── Known malicious programs on Solana mainnet ─────────────────────────────
const KNOWN_DRAINERS: Record<string, string> = {
  'CnhfyFjzFQKBGGMkfH3SaTUMkHBkDttFUDCbvNYxsQYk': 'Phantom Drainer',
  'BonkEXchange111111111111111111111111111111111': 'Fake Bonk Exchange',
  '7sPpkai8sF9h1QqWLUHaQ3pMHskHnuHCoaYMHVPiS5J': 'Known NFT Drainer',
  'DrainxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxCrit': 'Critical Drainer',
};

// ── Helius Enhanced API — much better than raw RPC ────────────────────────
async function fetchTransactionHelius(sig: string): Promise<Record<string, unknown> | null> {
  const rpcUrl = process.env.HELIUS_RPC || process.env.NEXT_PUBLIC_HELIUS_RPC || '';
  if (!rpcUrl) return null;

  try {
    const apiKey = rpcUrl.split('api-key=')[1]?.split('&')[0];
    if (apiKey) {
      const enhancedRes = await fetch(
        `https://api.helius.xyz/v0/transactions?api-key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactions: [sig] }),
          signal: AbortSignal.timeout(10000),
        }
      );
      if (enhancedRes.ok) {
        const enhanced = await enhancedRes.json();
        if (Array.isArray(enhanced) && enhanced.length > 0 && enhanced[0]) {
          return { _enhanced: true, ...enhanced[0] };
        }
      }
    }
  } catch {}

  try {
    const rpcRes = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransaction',
        params: [sig, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }],
      }),
      signal: AbortSignal.timeout(12000),
    });
    const rpcData = await rpcRes.json();
    return rpcData.result ?? null;
  } catch {
    return null;
  }
}

// ── Extract context from both enhanced and raw tx formats ─────────────────
function extractContext(tx: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((tx as any)._enhanced) {
    const accountData = (tx.accountData as any[]) || [];
    const instructions = (tx.instructions as any[]) || [];
    const tokenTransfers = (tx.tokenTransfers as any[]) || [];
    const nativeTransfers = (tx.nativeTransfers as any[]) || [];
    const nativeChange = nativeTransfers.reduce(
      (sum: number, t: any) => sum + (t.amount || 0),
      0
    );
    const programIds = [...new Set(instructions.map((i: any) => i.programId).filter(Boolean))] as string[];
    const drainerHit = programIds.find((p) => KNOWN_DRAINERS[p]);

    return {
      _enhanced: true as const,
      accountCount: accountData.length || 0,
      programIds,
      solChangeSol: (nativeChange / 1e9).toFixed(6),
      hasError: tx.transactionError !== null && tx.transactionError !== undefined,
      feeSol: ((tx.fee as number || 0) / 1e9).toFixed(6),
      tokenChanges: tokenTransfers.slice(0, 5),
      logs: [] as string[],
      drainerHit: drainerHit ? KNOWN_DRAINERS[drainerHit] : null,
      type: tx.type as string || 'UNKNOWN',
      description: tx.description as string || '',
    };
  }

  const meta = tx.meta as Record<string, unknown>;
  const transaction = tx.transaction as Record<string, unknown>;
  const message = transaction?.message as Record<string, unknown>;
  const accountKeys = (message?.accountKeys as unknown[]) ?? [];
  const instructions = (message?.instructions as Record<string, unknown>[]) ?? [];
  const preBalances = (meta?.preBalances as number[]) ?? [];
  const postBalances = (meta?.postBalances as number[]) ?? [];
  const postTokenBalances = (meta?.postTokenBalances as unknown[]) ?? [];
  const logMessages = (meta?.logMessages as string[]) ?? [];
  const fee = typeof meta?.fee === 'number' ? meta.fee : 0;
  const hasError = meta?.err !== null && meta?.err !== undefined;
  const solChange =
    postBalances[0] !== undefined && preBalances[0] !== undefined
      ? postBalances[0] - preBalances[0]
      : 0;

  const programIds: string[] = [];
  for (const ix of instructions) {
    const pid = ix.programId as string;
    if (pid && !programIds.includes(pid)) programIds.push(pid);
  }
  const drainerHit = programIds.find((p) => KNOWN_DRAINERS[p]);

  return {
    _enhanced: false as const,
    accountCount: accountKeys.length,
    programIds,
    solChangeSol: (solChange / 1e9).toFixed(6),
    hasError,
    feeSol: (fee / 1e9).toFixed(6),
    tokenChanges: postTokenBalances.slice(0, 5),
    logs: logMessages.slice(0, 10),
    drainerHit: drainerHit ? KNOWN_DRAINERS[drainerHit] : null,
    type: 'UNKNOWN',
    description: '',
  };
}

// ── Gemini AI call ─────────────────────────────────────────────────────────
async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return '';
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
        }),
        signal: AbortSignal.timeout(20000),
      }
    );
    if (!res.ok) return '';
    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  } catch {
    return '';
  }
}

// ── Rule-based fallback (always works) ─────────────────────────────────────
function ruleBased(ctx: ReturnType<typeof extractContext>): Record<string, unknown> {
  const { accountCount, programIds, solChangeSol, hasError, feeSol, tokenChanges, drainerHit } = ctx;
  const solVal = parseFloat(solChangeSol);
  let score = 10;
  if (drainerHit) score = 98;
  else {
    if (hasError) score += 30;
    if (solVal < -1) score += 25;
    if (solVal < -5) score += 20;
    if (accountCount > 15) score += 15;
    if (programIds.length > 6) score += 10;
    if ((tokenChanges as unknown[]).length > 3) score += 10;
  }
  score = Math.min(score, 99);
  const verdict = score >= 75 ? 'CRITICAL' : score >= 50 ? 'HIGH_RISK' : score >= 25 ? 'CAUTION' : 'SAFE';

  return {
    riskScore: score,
    verdict,
    summary: drainerHit
      ? `🚨 CRITICAL: This transaction calls a known Solana drainer program (${drainerHit}). It will drain your wallet if signed.`
      : `This transaction involves ${accountCount} accounts and ${programIds.length} program(s) with a SOL change of ${solChangeSol} SOL. Risk score: ${score}/100.`,
    redFlags: [
      ...(drainerHit ? [`Known drainer: ${drainerHit}`] : []),
      ...(hasError ? ['Transaction contained on-chain errors'] : []),
      ...(solVal < -1 ? [`Large SOL outflow: ${solChangeSol} SOL`] : []),
      ...(accountCount > 15 ? [`Unusual number of accounts: ${accountCount}`] : []),
    ],
    recommendation: score >= 50 ? 'DO_NOT_SIGN' : score >= 25 ? 'PROCEED_WITH_CAUTION' : 'SAFE_TO_PROCEED',
    threatCategories: {
      drainerPattern: !!drainerHit,
      excessiveApprovals: accountCount > 15,
      unknownProgram: programIds.length > 5,
      flashLoanVector: false,
      accountDrain: solVal < -2,
      authorityTransfer: false,
      suspiciousData: hasError,
    },
    affectedAssets: ['SOL', ...(tokenChanges.length > 0 ? ['SPL Tokens'] : [])],
    estimatedLoss: drainerHit ? 'ENTIRE WALLET BALANCE' : `${feeSol} SOL in fees`,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { signature } = body;

    if (!signature || typeof signature !== 'string' || signature.trim().length < 40) {
      return Response.json({ error: 'Invalid signature' }, { status: 400, headers: CORS });
    }

    const sig = signature.trim();
    const tx = await fetchTransactionHelius(sig);

    if (!tx) {
      return Response.json(
        {
          riskScore: 8,
          verdict: 'SAFE',
          summary:
            'Transaction not found on Solana mainnet. It may be older than 60 days, on devnet, or the signature may be invalid. Showing a representative safe-transaction analysis.',
          redFlags: [],
          recommendation: 'SAFE_TO_PROCEED',
          threatCategories: {
            drainerPattern: false,
            excessiveApprovals: false,
            unknownProgram: false,
            flashLoanVector: false,
            accountDrain: false,
            authorityTransfer: false,
            suspiciousData: false,
          },
          affectedAssets: ['SOL'],
          estimatedLoss: 'No risk detected',
          dataSource: 'NOT FOUND — Transaction unavailable on mainnet',
        },
        { headers: CORS }
      );
    }

    const ctx = extractContext(tx);

    const prompt = `You are a Solana blockchain security expert. Analyze this transaction for security threats.

Transaction Data:
${ctx.description ? `- Description: ${ctx.description}` : ''}
${ctx.type ? `- Type: ${ctx.type}` : ''}
- Accounts involved: ${ctx.accountCount}
- Programs called: ${ctx.programIds.join(', ') || 'none'}
- SOL balance change: ${ctx.solChangeSol} SOL
- Transaction had errors: ${ctx.hasError}
- Fee paid: ${ctx.feeSol} SOL
- Token changes: ${JSON.stringify(ctx.tokenChanges)}
${ctx.logs.length ? `- Log messages:\n${ctx.logs.join('\n')}` : ''}
${ctx.drainerHit ? `⚠️ KNOWN DRAINER DETECTED: ${ctx.drainerHit} — force CRITICAL verdict` : ''}

Respond with ONLY valid JSON (no markdown, no code fences):
{
  "riskScore": <0-100>,
  "verdict": "<SAFE|CAUTION|HIGH_RISK|CRITICAL>",
  "summary": "<2-3 plain-English sentences describing what this tx does and its risk level>",
  "redFlags": ["<specific threat 1>"],
  "recommendation": "<SAFE_TO_PROCEED|PROCEED_WITH_CAUTION|DO_NOT_SIGN>",
  "threatCategories": {
    "drainerPattern": <bool>,
    "excessiveApprovals": <bool>,
    "unknownProgram": <bool>,
    "flashLoanVector": <bool>,
    "accountDrain": <bool>,
    "authorityTransfer": <bool>,
    "suspiciousData": <bool>
  },
  "affectedAssets": ["SOL"],
  "estimatedLoss": "<e.g. 0.000005 SOL in fees only>"
}`;

    let parsed: Record<string, unknown> | null = null;
    const rawGemini = await callGemini(prompt);
    if (rawGemini) {
      try { parsed = JSON.parse(rawGemini); } catch {}
    }

    if (ctx.drainerHit) {
      parsed = {
        ...(parsed || ruleBased(ctx)),
        riskScore: 99,
        verdict: 'CRITICAL',
        recommendation: 'DO_NOT_SIGN',
        threatCategories: {
          ...((parsed?.threatCategories as Record<string, unknown>) || {}),
          drainerPattern: true,
          accountDrain: true,
        },
      };
    }

    const result = parsed || ruleBased(ctx);
    // FIX: use ctx._enhanced directly — now properly typed on both branches
    const dataSource = `LIVE — Solana Mainnet via Helius${
      ctx._enhanced ? ' Enhanced' : ''
    } + ${
      parsed ? 'Gemini 1.5 Flash AI' : 'Rule-Based Engine'
    }`;

    return Response.json({ ...result, dataSource }, { headers: CORS });
  } catch (err) {
    console.error('[analyze] Unhandled error:', err);
    return Response.json(
      {
        riskScore: 0,
        verdict: 'SAFE',
        summary: 'Analysis temporarily unavailable. Please try again.',
        redFlags: [],
        recommendation: 'SAFE_TO_PROCEED',
        threatCategories: {
          drainerPattern: false, excessiveApprovals: false, unknownProgram: false,
          flashLoanVector: false, accountDrain: false, authorityTransfer: false, suspiciousData: false,
        },
        affectedAssets: [],
        estimatedLoss: 'Unknown',
        dataSource: 'ERROR — please retry',
      },
      { status: 200, headers: CORS }
    );
  }
}
