export type Verdict = 'SAFE' | 'CAUTION' | 'HIGH_RISK' | 'CRITICAL';
export type Recommendation = 'SAFE_TO_PROCEED' | 'PROCEED_WITH_CAUTION' | 'DO_NOT_SIGN';

export interface ThreatCategories {
  drainerPattern: boolean;
  excessiveApprovals: boolean;
  unknownProgram: boolean;
  flashLoanVector: boolean;
  accountDrain: boolean;
  authorityTransfer: boolean;
  suspiciousData: boolean;
}

export interface AnalysisResult {
  riskScore: number;
  verdict: Verdict;
  summary: string;
  redFlags: string[];
  recommendation: Recommendation;
  threatCategories: ThreatCategories;
  affectedAssets: string[];
  estimatedLoss: string;
  programsInvolved: string[];
  analysisTime: number;
  aiModel: string;
  rpcSource: string;
}

export interface HistoryItem {
  signature: string;
  timestamp: number;
  riskScore: number;
  verdict: Verdict;
  summary: string;
}

export interface TokenBalanceChange {
  accountIndex: number;
  mint: string;
  owner: string;
  preAmount: string;
  postAmount: string;
  decimals: number;
}

export interface TransactionContext {
  signature: string;
  blockTime: number | null;
  slot: number;
  fee: number;
  status: 'success' | 'failed';
  accountKeys: string[];
  programIds: string[];
  solChanges: { account: string; change: number }[];
  tokenChanges: TokenBalanceChange[];
  instructionCount: number;
  innerInstructionCount: number;
  logMessages: string[];
  knownDangerousPrograms: string[];
  hasSetAuthority: boolean;
  hasCloseAccount: boolean;
  hasMaxApproval: boolean;
}
