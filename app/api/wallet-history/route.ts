import { NextRequest, NextResponse } from 'next/server';

const HELIUS_RPC = process.env.HELIUS_RPC || 'https://api.mainnet-beta.solana.com';

export const runtime = 'nodejs';
export const maxDuration = 30;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { walletAddress?: string };
    const { walletAddress } = body;

    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.length < 32) {
      return NextResponse.json(
        { error: 'Valid wallet address is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Add small delay to respect rate limits
    await new Promise(r => setTimeout(r, 200));

    const res = await fetch(HELIUS_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [
          walletAddress,
          { limit: 10, commitment: 'confirmed' },
        ],
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) throw new Error(`RPC HTTP error: ${res.status}`);
    const data = await res.json() as {
      result?: Array<{ signature: string; blockTime: number | null; err: unknown }>;
      error?: { message: string };
    };

    if (data.error) throw new Error(`RPC: ${data.error.message}`);

    const signatures = (data.result ?? []).slice(0, 10).map(s => ({
      signature: s.signature,
      blockTime: s.blockTime,
      err: s.err !== null,
    }));

    return NextResponse.json({ signatures }, { status: 200, headers: corsHeaders });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[wallet-history] Error:', msg);
    return NextResponse.json(
      { error: `Failed to fetch wallet history: ${msg}`, signatures: [] },
      { status: 200, headers: corsHeaders } // Return 200 with empty so UI handles gracefully
    );
  }
}
