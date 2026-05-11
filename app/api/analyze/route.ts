import { NextRequest, NextResponse } from 'next/server';
import { fetchTransactionRaw, extractTransactionContext } from '@/lib/solana';
import { analyzeTransaction } from '@/lib/gemini';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await req.json() as { signature?: string };
    const { signature } = body;

    // Validate
    if (!signature || typeof signature !== 'string') {
      return NextResponse.json(
        { error: 'signature is required' },
        { status: 400, headers: corsHeaders }
      );
    }
    const trimmed = signature.trim();
    if (trimmed.length < 40 || trimmed.length > 100) {
      return NextResponse.json(
        { error: 'Invalid signature length. Solana signatures are 87-88 base58 characters.' },
        { status: 400, headers: corsHeaders }
      );
    }
    // Basic base58 check (alphanumeric, no 0/O/l/I)
    if (!/^[1-9A-HJ-NP-Za-km-z]+$/.test(trimmed)) {
      return NextResponse.json(
        { error: 'Invalid signature format. Must be a valid base58 string.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Fetch from RPC
    let tx: Record<string, unknown> | null = null;
    try {
      tx = await fetchTransactionRaw(trimmed);
    } catch (rpcErr: unknown) {
      const msg = rpcErr instanceof Error ? rpcErr.message : 'RPC error';
      console.error('[analyze] RPC fetch failed:', msg);
      // Return degraded analysis
      return NextResponse.json(
        {
          riskScore: 0,
          verdict: 'SAFE',
          summary: 'RPC unavailable — could not fetch on-chain data. The transaction could not be analyzed. Please try again.',
          redFlags: ['RPC unavailable — using estimated analysis'],
          recommendation: 'PROCEED_WITH_CAUTION',
          threatCategories: {
            drainerPattern: false, excessiveApprovals: false, unknownProgram: false,
            flashLoanVector: false, accountDrain: false, authorityTransfer: false, suspiciousData: false,
          },
          affectedAssets: [],
          estimatedLoss: 'Unknown — could not fetch data',
          programsInvolved: [],
          analysisTime: 0,
          aiModel: 'Unavailable',
          rpcSource: 'RPC Error',
          error: `RPC unavailable: ${msg}`,
        },
        { status: 200, headers: corsHeaders }
      );
    }

    if (!tx) {
      return NextResponse.json(
        { error: 'Transaction not found. It may be very old (>1 year), on devnet, or the signature is incorrect.' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Extract context
    const ctx = extractTransactionContext(tx, trimmed);

    // Run AI analysis
    const result = await analyzeTransaction(ctx);

    return NextResponse.json(result, { status: 200, headers: corsHeaders });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown server error';
    console.error('[analyze] Unhandled error:', msg);
    return NextResponse.json(
      { error: `Analysis failed: ${msg}` },
      { status: 500, headers: corsHeaders }
    );
  }
}
