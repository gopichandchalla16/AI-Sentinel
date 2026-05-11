export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AnalysisResult {
  riskLevel: RiskLevel;
  riskScore: number;
  summary: string;
  redFlags: string[];
  recommendation: string;
  programsInvolved: string[];
  transferDetails: string;
  aiModel: string;
  analysisTime: number;
}
