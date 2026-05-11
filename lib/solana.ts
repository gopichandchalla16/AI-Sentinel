import type { TransactionContext } from '@/types/analysis';

export const HELIUS_RPC = process.env.NEXT_PUBLIC_HELIUS_RPC || 'https://api.mainnet-beta.solana.com';

export const PROGRAM_LABELS: Record<string, string> = {
  '11111111111111111111111111111111': 'System Program',
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf8Ss623VQ5DA': 'SPL Token Program',
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1qSe': 'Associated Token Account Program',
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': 'Jupiter Aggregator v6',
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc': 'Orca Whirlpool',
  'So11111111111111111111111111111111111111112': 'Wrapped SOL',
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s': 'Metaplex Token Metadata',
  'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ': 'Candy Machine v2',
  'ComputeBudget111111111111111111111111111111': 'Compute Budget Program',
  'Vote111111111111111111111111111111111111111': 'Vote Program',
  'Stake11111111111111111111111111111111111111': 'Stake Program',
  'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr': 'Memo Program',
  '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP': 'Orca v1 (Flagged)',
  'DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1': 'Orca v2',
  '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM': 'Raydium AMM v4',
  'PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY': 'Phoenix DEX',
  'NativeLoader1111111111111111111111111111111': 'Native Loader',
  'BPFLoaderUpgradeab1e11111111111111111111111': 'BPF Loader',
};

export const HIGH_RISK_PROGRAMS = new Set([
  'GokivDYuQXPZCWRkwMhdH2h91KpDqF5jRCkdm2SxMoGV',
  'HYPERfwdTjyJ2SCaKHmpF2MtrXqWxrsotYDsTrshHWq8',
  '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP',
  'DrainVoaTgABKF1CaGEsq3BspNBgCK4VcGBPFbMQP4Ar',
]);

export function truncateSignature(sig: string): string {
  if (sig.length <= 12) return sig;
  return `${sig.slice(0, 6)}...${sig.slice(-4)}`;
}

export function formatTimestamp(blockTime: number | null): string {
  if (!blockTime) return 'Unknown time';
  const diff = Math.floor(Date.now() / 1000) - blockTime;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export async function fetchTransactionRpc(signature: string): Promise<Record<string, unknown> | null> {
  const rpc = process.env.HELIUS_RPC || HELIUS_RPC;
  const res = await fetch(rpc, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', id: 1,
      method: 'getTransaction',
      params: [signature, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0, commitment: 'confirmed' }],
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`RPC HTTP error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`RPC error: ${data.error.message}`);
  return data.result;
}

export function extractTransactionContext(tx: Record<string, unknown>, signature: string): TransactionContext {
  const meta = tx.meta as Record<string, unknown>;
  const transaction = tx.transaction as Record<string, unknown>;
  const message = transaction?.message as Record<string, unknown>;
  const instructions = (message?.instructions as Array<Record<string, unknown>>) || [];
  const innerInstructions = (meta?.innerInstructions as Array<Record<string, unknown>>) || [];
  const accountKeys = (message?.accountKeys as Array<Record<string, unknown>>) || [];
  const preBalances = (meta?.preBalances as number[]) || [];
  const postBalances = (meta?.postBalances as number[]) || [];
  const preTokenBalances = (meta?.preTokenBalances as Array<Record<string, unknown>>) || [];
  const postTokenBalances = (meta?.postTokenBalances as Array<Record<string, unknown>>) || [];
  const logMessages = ((meta?.logMessages as string[]) || []).slice(0, 30);

  const programIds: string[] = [];
  const programLabels: string[] = [];
  let hasSetAuthority = false;
  let hasCloseAccount = false;
  let hasHighRiskProgram = false;
  const highRiskProgramNames: string[] = [];

  for (const ix of instructions) {
    const pid = (ix.programId as string) || '';
    if (pid) {
      programIds.push(pid);
      const label = PROGRAM_LABELS[pid] || `Unknown(${pid.slice(0, 8)}...)`;
      programLabels.push(label);
      if (HIGH_RISK_PROGRAMS.has(pid)) {
        hasHighRiskProgram = true;
        highRiskProgramNames.push(label);
      }
    }
    const parsed = ix.parsed as Record<string, unknown>;
    const ixType = (parsed?.type as string) || (ix.data as string) || '';
    if (ixType.toLowerCase().includes('setauthority')) hasSetAuthority = true;
    if (ixType.toLowerCase().includes('closeaccount')) hasCloseAccount = true;
  }

  for (const inner of innerInstructions) {
    for (const ix of (inner.instructions as Array<Record<string, unknown>>) || []) {
      const pid = (ix.programId as string) || '';
      if (pid && HIGH_RISK_PROGRAMS.has(pid)) { hasHighRiskProgram = true; }
      const parsed = ix.parsed as Record<string, unknown>;
      const ixType = (parsed?.type as string) || '';
      if (ixType.toLowerCase().includes('setauthority')) hasSetAuthority = true;
      if (ixType.toLowerCase().includes('closeaccount')) hasCloseAccount = true;
    }
  }

  const logStr = logMessages.join(' ');
  if (logStr.toLowerCase().includes('setauthority')) hasSetAuthority = true;
  if (logStr.toLowerCase().includes('closeaccount')) hasCloseAccount = true;

  const solChanges = accountKeys.map((k, i) => ({
    account: truncateSignature((k.pubkey as string) || ''),
    change: ((postBalances[i] || 0) - (preBalances[i] || 0)) / 1e9,
  }));

  let maxSolDrain = 0;
  for (let i = 0; i < preBalances.length; i++) {
    const drain = (preBalances[i] - (postBalances[i] || 0)) / 1e9;
    if (drain > maxSolDrain) maxSolDrain = drain;
  }

  const tokenChanges = postTokenBalances.map((pb) => {
    const pre = preTokenBalances.find(
      (pr) => (pr.accountIndex as number) === (pb.accountIndex as number) && (pr.mint as string) === (pb.mint as string)
    );
    return {
      account: truncateSignature((pb.owner as string) || String(pb.accountIndex)),
      mint: truncateSignature((pb.mint as string) || ''),
      uiAmountBefore: (pre?.uiTokenAmount as Record<string,unknown>)?.uiAmount as number | null ?? null,
      uiAmountAfter: (pb.uiTokenAmount as Record<string,unknown>)?.uiAmount as number | null ?? null,
    };
  });

  return {
    signature,
    blockTime: tx.blockTime as number | null,
    fee: (meta?.fee as number || 0) / 1e9,
    status: meta?.err ? 'failed' : 'success',
    accountKeys: accountKeys.map(k => (k.pubkey as string) || '').filter(Boolean),
    programIds: [...new Set(programIds)],
    programLabels: [...new Set(programLabels)],
    solChanges,
    tokenChanges,
    instructionCount: instructions.length,
    innerInstructionCount: innerInstructions.length,
    logMessages,
    hasSetAuthority,
    hasCloseAccount,
    hasHighRiskProgram,
    highRiskProgramNames,
    maxSolDrain,
  };
}
