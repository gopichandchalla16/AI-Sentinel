// Kept minimal — all RPC calls are done inline in the API route via raw fetch.
// This file exists only to satisfy any imports and provide shared types.

export function truncateSignature(sig: string): string {
  if (!sig || sig.length <= 16) return sig;
  return sig.slice(0, 8) + '...' + sig.slice(-8);
}

export function formatTimestamp(blockTime: number | null): string {
  if (!blockTime) return 'Unknown time';
  const secs = Math.floor(Date.now() / 1000) - blockTime;
  if (secs < 60) return 'just now';
  if (secs < 3600) return Math.floor(secs / 60) + ' mins ago';
  if (secs < 86400) return Math.floor(secs / 3600) + ' hours ago';
  return Math.floor(secs / 86400) + ' days ago';
}
