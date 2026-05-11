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
  dataSource?: string;
  analysisTime?: number;
  aiModel?: string;
  rpcSource?: string;
  programsInvolved?: string[];
  error?: string;
}

export interface HistoryItem {
  signature: string;
  timestamp: number;
  riskScore: number;
  verdict: Verdict;
  summary?: string;
}

export interface TransactionContext {
  signature: string;
  accountCount: number;
  programIds: string[];
  solChange: number;
  hasError: boolean;
  fee: number;
  logMessages: string[];
  tokenChanges: unknown[];
}
