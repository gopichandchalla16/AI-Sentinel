import { NextRequest, NextResponse } from 'next/server';

// ─── Helius RPC endpoint (set HELIUS_RPC in Vercel env vars) ──────────────────
const HELIUS_RPC = process.env.HELIUS_RPC || 'https://api.mainnet-beta.solana.com';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// ─── Known program labels ─────────────────────────────────────────────────────
const PROGRAM_LABELS: Record<string, string> = {
  '11111111111111111111111111111111': 'System Program',
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf8Ss623VQ5DA': 'SPL Token',
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1qSe': 'Associated Token Program',
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': 'Jupiter v6',
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc': 'Orca Whirlpool',
  'So11111111111111111111111111111111111111112': 'Wrapped SOL',
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s': 'Metaplex Token Metadata',
  'MagicEden_v2': 'Magic Eden v2',
  'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ': 'Candy Machine v2',
  'NativeLoader1111111111111111111111111111111': 'Native Loader',
};

// ─── Fetch transaction from Helius RPC ────────────────────────────────────────
async function fetchTransaction(signature: string) {
  const body = {
    jsonrpc: '2.0',
    id: 1,
    method: 'getTransaction',
    params: [signature, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }],
  };
  const res = await fetch(HELIUS_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`RPC error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`RPC: ${data.error.message}`);
  return data.result;
}

// ─── Parse programs and key metrics ──────────────────────────────────────────
function parseTransaction(tx: Record<string, unknown>) {
  const programs: string[] = [];
  const meta = tx?.meta as Record<string, unknown>;
  const transaction = tx?.transaction as Record<string, unknown>;
  const message = transaction?.message as Record<string, unknown>;
  const instructions = (message?.instructions as Array<Record<string, unknown>>) || [];

  for (const ix of instructions) {
    const pid = (ix.programId as string) || (ix.program as string) || '';
    if (pid) programs.push(PROGRAM_LABELS[pid] || pid.slice(0, 12) + '...');
  }

  const preBalances = (meta?.preBalances as number[]) || [];
  const postBalances = (meta?.postBalances as number[]) || [];
  const solChange = preBalances[0] && postBalances[0]
    ? ((postBalances[0] - preBalances[0]) / 1e9).toFixed(4)
    : null;

  const preTokenBalances = (meta?.preTokenBalances as Array<Record<string, unknown>>) || [];
  const postTokenBalances = (meta?.postTokenBalances as Array<Record<string, unknown>>) || [];
  const tokenChanges = postTokenBalances.length - preTokenBalances.length;
  const logMessages = ((meta?.logMessages as string[]) || []).slice(0, 20).join('\n');
  const err = meta?.err;

  return {
    programs: [...new Set(programs)],
    solChange,
    tokenChanges,
    logMessages,
    err,
    accountCount: ((message?.accountKeys as unknown[]) || []).length,
    instructionCount: instructions.length,
    blockTime: tx?.blockTime,
    fee: meta?.fee,
  };
}

// ─── Build Gemini prompt ──────────────────────────────────────────────────────
function buildPrompt(parsed: ReturnType<typeof parseTransaction>, rawSummary: string): string {
  return `You are AI-Sentinel, a specialized Solana blockchain security AI. Analyze this transaction data and return ONLY a valid JSON object with no markdown, no code fences, no explanation.

Transaction Summary:
${rawSummary}

Programs involved: ${parsed.programs.join(', ')}
SOL change: ${parsed.solChange ?? 'unknown'} SOL
Token balance changes: ${parsed.tokenChanges}
Instruction count: ${parsed.instructionCount}
Account count: ${parsed.accountCount}
Transaction fee: ${parsed.fee ? (parsed.fee / 1e9).toFixed(6) + ' SOL' : 'unknown'}
Status: ${parsed.err ? 'FAILED - ' + JSON.stringify(parsed.err) : 'SUCCESS'}
Log messages (partial):
${parsed.logMessages || 'None'}

Return this EXACT JSON schema:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "riskScore": <integer 0-100>,
  "summary": "<2-3 sentences in plain English explaining what this transaction does>",
  "redFlags": ["<specific red flag 1>", ...],
  "recommendation": "<one clear action sentence: SAFE TO PROCEED / PROCEED WITH CAUTION / DO NOT SIGN>",
  "programsInvolved": ["<program name>", ...],
  "transferDetails": "<what assets moved and where>",
  "aiModel": "Gemini 1.5 Flash"
}

Risk scoring guide:
0-25: LOW - Standard system/token program operations, small SOL transfers
26-50: MEDIUM - DEX swaps, NFT mints, unknown programs with reasonable patterns
51-75: HIGH - Unusual approvals, unknown programs, large transfers to unknown wallets
76-100: CRITICAL - Drainer patterns, unlimited approvals, known exploit signatures, phishing programs`;
}

// ─── Call Gemini API ──────────────────────────────────────────────────────────
async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const { signature } = await req.json();
    if (!signature || typeof signature !== 'string' || signature.length < 40) {
      return NextResponse.json({ error: 'Invalid transaction signature.' }, { status: 400 });
    }
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured. Add GEMINI_API_KEY in Vercel env vars.' }, { status: 500 });
    }

    // 1. Fetch from Helius RPC
    const tx = await fetchTransaction(signature.trim());
    if (!tx) return NextResponse.json({ error: 'Transaction not found. It may be too old or on devnet.' }, { status: 404 });

    // 2. Parse
    const parsed = parseTransaction(tx);
    const rawSummary = JSON.stringify(tx).slice(0, 2000);

    // 3. Analyze with Gemini
    const prompt = buildPrompt(parsed, rawSummary);
    const aiText = await callGemini(prompt);

    // 4. Parse JSON response
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('AI returned invalid format. Try again.');
    const result = JSON.parse(jsonMatch[0]);
    result.analysisTime = Date.now() - start;

    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AI-Sentinel] Error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
