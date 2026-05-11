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
  aiModel: string;
  analysisTime: number;
  programsInvolved: string[];
  transferDetails: string;
  rpcNote?: string;
}

export interface HistoryItem {
  signature: string;
  timestamp: number;
  riskScore: number;
  verdict: Verdict;
  summary: string;
}

export interface TransactionContext {
  signature: string;
  blockTime: number | null;
  fee: number;
  status: 'success' | 'failed';
  accountKeys: string[];
  programIds: string[];
  programLabels: string[];
  solChanges: { account: string; change: number }[];
  tokenChanges: {
    account: string;
    mint: string;
    uiAmountBefore: number | null;
    uiAmountAfter: number | null;
  }[];
  instructionCount: number;
  innerInstructionCount: number;
  logMessages: string[];
  hasSetAuthority: boolean;
  hasCloseAccount: boolean;
  hasHighRiskProgram: boolean;
  highRiskProgramNames: string[];
  maxSolDrain: number;
}
