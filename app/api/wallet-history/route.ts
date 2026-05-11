import { NextRequest, NextResponse } from 'next/server';

const HELIUS_RPC = process.env.HELIUS_RPC || 'https://api.mainnet-beta.solana.com';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json() as { walletAddress?: string };
    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.length < 30) {
      return NextResponse.json({ error: 'Valid walletAddress required' }, { status: 400 });
    }

    await new Promise(r => setTimeout(r, 300)); // rate limit courtesy

    const res = await fetch(HELIUS_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1,
        method: 'getSignaturesForAddress',
        params: [walletAddress, { limit: 10, commitment: 'confirmed' }],
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(`RPC: ${data.error.message}`);

    const signatures = (data.result || []).map((item: Record<string, unknown>) => ({
      signature: item.signature as string,
      blockTime: item.blockTime as number | null,
      err: item.err,
    }));

    return NextResponse.json({ signatures });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
