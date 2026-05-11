import { Connection, PublicKey } from '@solana/web3.js';
import type { TransactionContext, TokenBalanceChange } from '@/types/analysis';

const HELIUS_RPC = process.env.HELIUS_RPC ||
  process.env.NEXT_PUBLIC_HELIUS_RPC ||
  'https://api.mainnet-beta.solana.com';

const KNOWN_DANGEROUS: Record<string, string> = {
  '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP': 'Orca v1 (deprecated, flagged)',
  'GokivDYuQXPZCWRkwMhdH2h91KpDqF5jRCkdm2SxMoGV': 'Known Wallet Drainer',
  'HYPERfwdTjyJ2SCaKHmpF2MtrXqWxrsotYDsTrshHWq8': 'Hyperion Drainer',
  'noopb9bkMVfRmLyaqbmKv3j6f7gfxXfqGeTEdp3aQP': 'No-op Exploit',
  'BotZe3pQLkQFD3Zv8bFMcnpfwSt3YBzNkMRXeZmqJmK': 'MEV Bot (suspicious)',
};

const PROGRAM_LABELS: Record<string, string> = {
  '11111111111111111111111111111111': 'System Program',
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf8Ss623VQ5DA': 'SPL Token Program',
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1qSe': 'Associated Token Program',
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': 'Jupiter v6',
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc': 'Orca Whirlpool',
  'So11111111111111111111111111111111111111112': 'Wrapped SOL',
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s': 'Metaplex Token Metadata',
  'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ': 'Candy Machine v2',
  'ComputeBudget111111111111111111111111111111': 'Compute Budget',
  'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr': 'Memo Program',
  'Vote111111111111111111111111111111111111111': 'Vote Program',
  'Stake11111111111111111111111111111111111111': 'Stake Program',
  '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP': 'Orca v1 (deprecated)',
  'DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1': 'Orca v1',
  'PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY': 'Phoenix DEX',
  '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM': 'Raydium AMM v4',
};

export function createRpcConnection(): Connection {
  return new Connection(HELIUS_RPC, 'confirmed');
}

export async function fetchTransactionRaw(signature: string): Promise<Record<string, unknown> | null> {
  const res = await fetch(HELIUS_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTransaction',
      params: [signature, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0, commitment: 'confirmed' }],
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`RPC HTTP error: ${res.status}`);
  const data = await res.json() as { result?: Record<string, unknown>; error?: { message: string } };
  if (data.error) throw new Error(`RPC error: ${data.error.message}`);
  return data.result ?? null;
}

export function extractTransactionContext(
  tx: Record<string, unknown>,
  signature: string
): TransactionContext {
  const meta = (tx.meta ?? {}) as Record<string, unknown>;
  const transaction = (tx.transaction ?? {}) as Record<string, unknown>;
  const message = (transaction.message ?? {}) as Record<string, unknown>;
  const instructions = ((message.instructions ?? []) as Array<Record<string, unknown>>);
  const innerInstructionsRaw = ((meta.innerInstructions ?? []) as Array<Record<string, unknown>>);

  // Account keys
  const accountKeysRaw = (message.accountKeys ?? []) as Array<Record<string, unknown> | string>;
  const accountKeys: string[] = accountKeysRaw.map(k =>
    typeof k === 'string' ? k : ((k.pubkey ?? k.publicKey ?? '') as string)
  );

  // Program IDs
  const programIdSet = new Set<string>();
  for (const ix of instructions) {
    const pid = (ix.programId ?? ix.program ?? '') as string;
    if (pid) programIdSet.add(pid);
  }
  const programIds = [...programIdSet];

  // Known dangerous
  const knownDangerousPrograms = programIds.filter(p => KNOWN_DANGEROUS[p]);

  // SOL balance changes
  const preBalances = ((meta.preBalances ?? []) as number[]);
  const postBalances = ((meta.postBalances ?? []) as number[]);
  const solChanges: { account: string; change: number }[] = [];
  for (let i = 0; i < accountKeys.length; i++) {
    const change = ((postBalances[i] ?? 0) - (preBalances[i] ?? 0)) / 1e9;
    if (Math.abs(change) > 0.000001) {
      solChanges.push({ account: accountKeys[i], change: parseFloat(change.toFixed(6)) });
    }
  }

  // Token balance changes
  const preTok = ((meta.preTokenBalances ?? []) as Array<Record<string, unknown>>);
  const postTok = ((meta.postTokenBalances ?? []) as Array<Record<string, unknown>>);
  const tokenChanges: TokenBalanceChange[] = postTok.map(pt => {
    const pre = preTok.find(p => p.accountIndex === pt.accountIndex && p.mint === pt.mint);
    const ptInfo = (pt.uiTokenAmount ?? {}) as Record<string, unknown>;
    const preInfo = (pre?.uiTokenAmount ?? {}) as Record<string, unknown>;
    return {
      accountIndex: pt.accountIndex as number,
      mint: pt.mint as string,
      owner: (pt.owner ?? '') as string,
      preAmount: (preInfo.uiAmountString ?? '0') as string,
      postAmount: (ptInfo.uiAmountString ?? '0') as string,
      decimals: (ptInfo.decimals ?? 0) as number,
    };
  });

  // Log messages
  const logMessages = ((meta.logMessages ?? []) as string[]).slice(0, 30);

  // Detect dangerous patterns in instruction data
  let hasSetAuthority = false;
  let hasCloseAccount = false;
  let hasMaxApproval = false;

  const allIxData: string[] = [];
  for (const ix of instructions) {
    const parsed = ix.parsed as Record<string, unknown> | undefined;
    const type = (parsed?.type ?? '') as string;
    const info = (parsed?.info ?? {}) as Record<string, unknown>;
    if (type === 'setAuthority' || type === 'approve') {
      if (type === 'setAuthority') hasSetAuthority = true;
      const amt = info.amount as string | undefined;
      if (amt && parseInt(amt) > 1e15) hasMaxApproval = true;
    }
    if (type === 'closeAccount') hasCloseAccount = true;
    if (ix.data) allIxData.push(ix.data as string);
  }
  for (const inner of innerInstructionsRaw) {
    for (const ix of ((inner.instructions ?? []) as Array<Record<string, unknown>>)) {
      const parsed = ix.parsed as Record<string, unknown> | undefined;
      const type = (parsed?.type ?? '') as string;
      const info = (parsed?.info ?? {}) as Record<string, unknown>;
      if (type === 'setAuthority') hasSetAuthority = true;
      if (type === 'closeAccount') hasCloseAccount = true;
      if (type === 'approve') {
        const amt = info.amount as string | undefined;
        if (amt && parseInt(amt) > 1e15) hasMaxApproval = true;
      }
    }
  }

  const programLabels = programIds.map(p => PROGRAM_LABELS[p] || `Unknown(${p.slice(0, 8)}...)`);

  return {
    signature,
    blockTime: (tx.blockTime as number | null) ?? null,
    slot: (tx.slot as number) ?? 0,
    fee: ((meta.fee as number) ?? 0) / 1e9,
    status: meta.err ? 'failed' : 'success',
    accountKeys,
    programIds: programLabels,
    solChanges,
    tokenChanges,
    instructionCount: instructions.length,
    innerInstructionCount: innerInstructionsRaw.length,
    logMessages,
    knownDangerousPrograms: knownDangerousPrograms.map(p => KNOWN_DANGEROUS[p]),
    hasSetAuthority,
    hasCloseAccount,
    hasMaxApproval,
  };
}

export function truncateSignature(sig: string): string {
  if (sig.length <= 16) return sig;
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

export { PROGRAM_LABELS, KNOWN_DANGEROUS };
