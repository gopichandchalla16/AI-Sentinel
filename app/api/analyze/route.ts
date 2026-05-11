import { NextRequest, NextResponse } from 'next/server';
import { fetchTransactionRpc, extractTransactionContext } from '@/lib/solana';
import { analyzeTransaction } from '@/lib/gemini';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await req.json();
    const { signature } = body as { signature?: string };

    if (!signature || typeof signature !== 'string') {
      return NextResponse.json({ error: 'signature field is required' }, { status: 400, headers: corsHeaders });
    }
    const clean = signature.trim();
    if (clean.length < 40 || clean.length > 100) {
      return NextResponse.json({ error: 'Invalid signature length. Solana signatures are 87-88 characters (base58).' }, { status: 400, headers: corsHeaders });
    }
    // Rough base58 check
    if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(clean)) {
      return NextResponse.json({ error: 'Signature contains invalid characters. Must be base58.' }, { status: 400, headers: corsHeaders });
    }

    // 1. Fetch from Helius RPC
    let tx: Record<string, unknown> | null = null;
    try {
      tx = await fetchTransactionRpc(clean);
    } catch (rpcErr) {
      console.error('[AI-Sentinel] RPC fetch failed:', rpcErr);
      return NextResponse.json({
        error: `RPC unavailable: ${rpcErr instanceof Error ? rpcErr.message : 'Unknown RPC error'}. Check your HELIUS_RPC env var.`,
        rpcNote: 'RPC fetch failed',
      }, { status: 502, headers: corsHeaders });
    }

    if (!tx) {
      return NextResponse.json({
        error: 'Transaction not found on Solana mainnet. It may be older than 1 year, on devnet, or the signature is incorrect.',
      }, { status: 404, headers: corsHeaders });
    }

    // 2. Extract context
    const ctx = extractTransactionContext(tx, clean);

    // 3. Run AI analysis (Gemini + rule fallback)
    const result = await analyzeTransaction(ctx);

    return NextResponse.json(result, { headers: corsHeaders });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown server error';
    console.error('[AI-Sentinel] Unhandled error:', msg);
    return NextResponse.json({ error: msg }, { status: 500, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
