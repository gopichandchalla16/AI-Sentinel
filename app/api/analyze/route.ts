import { NextRequest, NextResponse } from 'next/server';

const HELIUS_RPC = process.env.HELIUS_RPC || 'https://api.mainnet-beta.solana.com';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const PROGRAM_LABELS: Record<string, string> = {
  '11111111111111111111111111111111': 'System Program',
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf8Ss623VQ5DA': 'SPL Token Program',
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1qSe': 'Associated Token Program',
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': 'Jupiter Aggregator v6',
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc': 'Orca Whirlpool',
  'So11111111111111111111111111111111111111112': 'Wrapped SOL',
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s': 'Metaplex Token Metadata',
  'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ': 'Candy Machine v2',
  'NativeLoader1111111111111111111111111111111': 'Native Loader',
  'Vote111111111111111111111111111111111111111': 'Vote Program',
  'Stake11111111111111111111111111111111111111': 'Stake Program',
  'ComputeBudget111111111111111111111111111111': 'Compute Budget',
  'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr': 'Memo Program',
  '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM': 'Raydium AMM v4',
  'DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1': 'Orca v1',
  'PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY': 'Phoenix DEX',
};

// Known high-risk / drainer program IDs
const HIGH_RISK_PROGRAMS = new Set([
  'GokivDYuQXPZCWRkwMhdH2h91KpDqF5jRCkdm2SxMoGV', // known drainer
  'HYPERfwdTjyJ2SCaKHmpF2MtrXqWxrsotYDsTrshHWq8', // hyperion drainer
]);

async function fetchTransaction(signature: string) {
  const res = await fetch(HELIUS_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', id: 1,
      method: 'getTransaction',
      params: [signature, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }],
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`RPC error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`RPC: ${data.error.message}`);
  return data.result;
}

function parseTransaction(tx: Record<string, unknown>) {
  const meta = tx?.meta as Record<string, unknown>;
  const transaction = tx?.transaction as Record<string, unknown>;
  const message = transaction?.message as Record<string, unknown>;
  const instructions = (message?.instructions as Array<Record<string, unknown>>) || [];
  const innerInstructions = (meta?.innerInstructions as Array<Record<string, unknown>>) || [];

  const programIds: string[] = [];
  const programs: string[] = [];
  let hasHighRiskProgram = false;

  for (const ix of instructions) {
    const pid = (ix.programId as string) || '';
    if (pid) {
      programIds.push(pid);
      programs.push(PROGRAM_LABELS[pid] || `Unknown(${pid.slice(0,8)}...)`);
      if (HIGH_RISK_PROGRAMS.has(pid)) hasHighRiskProgram = true;
    }
  }

  // Check inner instructions too
  for (const inner of innerInstructions) {
    const ixs = (inner.instructions as Array<Record<string, unknown>>) || [];
    for (const ix of ixs) {
      const pid = (ix.programId as string) || '';
      if (pid && HIGH_RISK_PROGRAMS.has(pid)) hasHighRiskProgram = true;
    }
  }

  const preBalances = (meta?.preBalances as number[]) || [];
  const postBalances = (meta?.postBalances as number[]) || [];
  const solChange = preBalances[0] != null && postBalances[0] != null
    ? ((postBalances[0] - preBalances[0]) / 1e9).toFixed(6)
    : null;

  const preTokenBalances = (meta?.preTokenBalances as Array<Record<string, unknown>>) || [];
  const postTokenBalances = (meta?.postTokenBalances as Array<Record<string, unknown>>) || [];
  const tokenChanges = Math.abs(postTokenBalances.length - preTokenBalances.length);
  const logMessages = ((meta?.logMessages as string[]) || []).slice(0, 25).join('\n');
  const err = meta?.err;
  const fee = meta?.fee as number;

  // Check for large SOL drain (>5 SOL moved)
  let maxSolDrain = 0;
  for (let i = 0; i < preBalances.length; i++) {
    const change = (preBalances[i] - (postBalances[i] || 0)) / 1e9;
    if (change > maxSolDrain) maxSolDrain = change;
  }

  const accountKeys = (message?.accountKeys as unknown[]) || [];
  const signers = accountKeys.filter((k: unknown) => (k as Record<string,unknown>)?.signer === true).length;

  return {
    programs: [...new Set(programs)],
    programIds: [...new Set(programIds)],
    hasHighRiskProgram,
    solChange,
    maxSolDrain,
    tokenChanges,
    logMessages,
    err,
    accountCount: accountKeys.length,
    instructionCount: instructions.length,
    innerInstructionCount: innerInstructions.length,
    blockTime: tx?.blockTime,
    fee,
    signers,
  };
}

function buildPrompt(parsed: ReturnType<typeof parseTransaction>, rawSummary: string): string {
  return `You are AI-Sentinel, a specialized Solana blockchain security AI model built for the Colosseum Frontier Hackathon 2026.

Analyze the following Solana transaction and return ONLY a valid JSON object. No markdown. No code fences. No text outside the JSON.

=== TRANSACTION DATA ===
Programs called: ${parsed.programs.join(', ')}
SOL balance change (sender): ${parsed.solChange ?? 'unknown'} SOL
Largest SOL drain detected: ${parsed.maxSolDrain.toFixed(4)} SOL
Token balance changes: ${parsed.tokenChanges} accounts affected
Instruction count: ${parsed.instructionCount} (outer) + ${parsed.innerInstructionCount} (inner)
Account count: ${parsed.accountCount}
Signer count: ${parsed.signers}
Transaction fee: ${parsed.fee ? (parsed.fee / 1e9).toFixed(6) + ' SOL' : 'unknown'}
Transaction status: ${parsed.err ? 'FAILED — ' + JSON.stringify(parsed.err) : 'SUCCESS'}
Known high-risk program detected: ${parsed.hasHighRiskProgram}
Log messages:
${parsed.logMessages || 'None available'}

Raw transaction context (first 2500 chars):
${rawSummary}

=== THREAT CATEGORIES TO CHECK ===
1. Wallet drainer patterns (bulk token transfers, close authority abuse)
2. Phishing programs (impersonation of known protocols)
3. Unlimited/excessive token approvals
4. Rug pull signals (large LP removal, mint authority changes)
5. MEV/sandwich attack signatures
6. Flash loan multi-step exploits
7. Unknown unverified programs with suspicious behavior

=== RISK SCORING GUIDE ===
0-25 LOW: System Program, SPL Token, known DEX (Jupiter, Orca), small SOL amounts
26-50 MEDIUM: Unknown but plausible programs, moderate token changes, DEX swaps
51-75 HIGH: Unusual approvals, large SOL movement, multiple unknown programs
76-100 CRITICAL: Drainer patterns, known exploit signatures, bulk account drains

=== REQUIRED JSON OUTPUT (exact schema, no extra fields) ===
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "riskScore": <integer 0-100>,
  "summary": "<2-3 plain English sentences describing what this transaction does — accessible to a non-technical user>",
  "redFlags": ["<specific threat 1>", "<specific threat 2>"],
  "recommendation": "<single clear sentence starting with SAFE TO PROCEED / PROCEED WITH CAUTION / DO NOT SIGN>",
  "programsInvolved": ["<program name 1>", "<program name 2>"],
  "transferDetails": "<describe exactly what assets moved, how much, and to/from where in plain English>",
  "aiModel": "Gemini 1.5 Flash"
}`;
}

async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1200, topP: 0.9 },
      }),
      signal: AbortSignal.timeout(25000),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const body = await req.json();
    const { signature } = body;

    if (!signature || typeof signature !== 'string' || signature.trim().length < 40) {
      return NextResponse.json({ error: 'Please provide a valid Solana transaction signature (minimum 40 characters).' }, { status: 400 });
    }
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY environment variable is not set. Please add it in Vercel → Settings → Environment Variables.' }, { status: 500 });
    }

    const tx = await fetchTransaction(signature.trim());
    if (!tx) {
      return NextResponse.json({ error: 'Transaction not found on Solana mainnet. It may be very old (>1 year), on devnet, or the signature is incorrect.' }, { status: 404 });
    }

    const parsed = parseTransaction(tx);
    const rawSummary = JSON.stringify(tx).slice(0, 2500);
    const prompt = buildPrompt(parsed, rawSummary);
    const aiText = await callGemini(prompt);

    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI returned an invalid format. Please try again.');

    const result = JSON.parse(jsonMatch[0]);

    // Safety: ensure required fields exist
    if (!result.riskLevel || !['LOW','MEDIUM','HIGH','CRITICAL'].includes(result.riskLevel)) result.riskLevel = 'MEDIUM';
    if (typeof result.riskScore !== 'number') result.riskScore = 50;
    if (!Array.isArray(result.redFlags)) result.redFlags = [];
    if (!Array.isArray(result.programsInvolved)) result.programsInvolved = parsed.programs;
    if (!result.summary) result.summary = 'Analysis complete.';
    if (!result.recommendation) result.recommendation = 'Review carefully before proceeding.';
    if (!result.transferDetails) result.transferDetails = `SOL change: ${parsed.solChange} SOL`;
    result.aiModel = 'Gemini 1.5 Flash';
    result.analysisTime = Date.now() - start;

    // Override: force CRITICAL if known drainer detected
    if (parsed.hasHighRiskProgram) {
      result.riskLevel = 'CRITICAL';
      result.riskScore = Math.max(result.riskScore, 95);
      result.redFlags.unshift('⛔ Known high-risk/drainer program detected in this transaction');
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown server error';
    console.error('[AI-Sentinel] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
