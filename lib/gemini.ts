import type { TransactionContext, AnalysisResult, Verdict, Recommendation, ThreatCategories } from '@/types/analysis';
import { HIGH_RISK_PROGRAMS } from './solana';

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

export function buildPrompt(ctx: TransactionContext): string {
  return `You are a blockchain security expert specializing in Solana DeFi exploit patterns.
Analyze the transaction data and respond ONLY with valid JSON — no markdown, no code blocks.

Transaction Data:
${JSON.stringify(ctx, null, 2).slice(0, 4000)}

Respond with this exact JSON structure:
{
  "riskScore": <number 0-100>,
  "verdict": "SAFE" | "CAUTION" | "HIGH_RISK" | "CRITICAL",
  "summary": "<plain English 2-3 sentence description of what this transaction does>",
  "redFlags": ["<flag1>", "<flag2>"],
  "recommendation": "SAFE_TO_PROCEED" | "PROCEED_WITH_CAUTION" | "DO_NOT_SIGN",
  "threatCategories": {
    "drainerPattern": <boolean>,
    "excessiveApprovals": <boolean>,
    "unknownProgram": <boolean>,
    "flashLoanVector": <boolean>,
    "accountDrain": <boolean>,
    "authorityTransfer": <boolean>,
    "suspiciousData": <boolean>
  },
  "affectedAssets": ["<asset1>"],
  "estimatedLoss": "<e.g. Up to 5.2 SOL at risk>",
  "programsInvolved": ["<program name>"],
  "transferDetails": "<what assets moved>"
}

Risk scoring guide:
0-25: SAFE — Standard ops (System, SPL Token, Jupiter, known DEX)
26-50: CAUTION — Unknown programs, moderate token changes, DEX swaps
51-75: HIGH_RISK — Unusual approvals, large SOL drain, multiple unknowns
76-100: CRITICAL — Drainer patterns, setAuthority abuse, known exploits, bulk drains`;
}

export async function callGeminiApi(prompt: string): Promise<string> {
  if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY not set');
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 1200, topP: 0.9 },
      }),
      signal: AbortSignal.timeout(25000),
    }
  );
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function ruleBasedFallback(ctx: TransactionContext): AnalysisResult {
  let score = 10;
  const flags: string[] = [];
  const threats: ThreatCategories = {
    drainerPattern: false, excessiveApprovals: false, unknownProgram: false,
    flashLoanVector: false, accountDrain: false, authorityTransfer: false, suspiciousData: false,
  };

  if (ctx.hasHighRiskProgram) { score = Math.max(score, 92); threats.drainerPattern = true; flags.push('⛔ Known high-risk/drainer program detected'); }
  if (ctx.hasSetAuthority)    { score = Math.max(score, 72); threats.authorityTransfer = true; flags.push('⚠️ setAuthority instruction detected — authority transfer'); }
  if (ctx.hasCloseAccount)    { score = Math.max(score, 58); threats.accountDrain = true; flags.push('⚠️ closeAccount instruction — account being closed'); }
  if (ctx.maxSolDrain > 10)   { score = Math.max(score, 80); threats.accountDrain = true; flags.push(`🚨 Large SOL drain: ${ctx.maxSolDrain.toFixed(3)} SOL leaving an account`); }
  else if (ctx.maxSolDrain > 2) { score = Math.max(score, 45); flags.push(`⚠️ Moderate SOL movement: ${ctx.maxSolDrain.toFixed(3)} SOL`); }

  const unknownPrograms = ctx.programIds.filter(p => !HIGH_RISK_PROGRAMS.has(p) && !(ctx.programLabels.some(l => !l.startsWith('Unknown'))));
  if (unknownPrograms.length > 0) { score = Math.max(score, 40); threats.unknownProgram = true; flags.push(`⚠️ ${unknownPrograms.length} unrecognized program(s) involved`); }
  if (ctx.tokenChanges.length > 5) { score = Math.max(score, 55); threats.excessiveApprovals = true; flags.push('⚠️ Excessive token account changes (potential bulk drain)'); }
  if (ctx.innerInstructionCount > 10) { score = Math.max(score, 50); threats.flashLoanVector = true; flags.push('⚠️ High inner instruction count — possible flash loan pattern'); }
  if (ctx.status === 'failed') { flags.push('ℹ️ Transaction failed on-chain'); }

  let verdict: Verdict = 'SAFE';
  let rec: Recommendation = 'SAFE_TO_PROCEED';
  if (score >= 76) { verdict = 'CRITICAL'; rec = 'DO_NOT_SIGN'; }
  else if (score >= 51) { verdict = 'HIGH_RISK'; rec = 'DO_NOT_SIGN'; }
  else if (score >= 26) { verdict = 'CAUTION'; rec = 'PROCEED_WITH_CAUTION'; }

  return {
    riskScore: score,
    verdict,
    summary: `This transaction involves ${ctx.programLabels.slice(0, 3).join(', ')}. ${ctx.tokenChanges.length} token account(s) affected. ${ctx.maxSolDrain > 0 ? `Up to ${ctx.maxSolDrain.toFixed(3)} SOL moved.` : ''} (Rule-based analysis — Gemini unavailable)`,
    redFlags: flags.length > 0 ? flags : ['No significant threats detected by rule engine'],
    recommendation: rec,
    threatCategories: threats,
    affectedAssets: ctx.tokenChanges.map(t => t.mint).filter(Boolean).slice(0, 5),
    estimatedLoss: ctx.maxSolDrain > 0 ? `Up to ${ctx.maxSolDrain.toFixed(3)} SOL at risk` : 'No significant loss estimated',
    aiModel: 'Rule-based fallback (Gemini unavailable)',
    analysisTime: 0,
    programsInvolved: ctx.programLabels,
    transferDetails: ctx.solChanges.filter(s => Math.abs(s.change) > 0.001).map(s => `${s.account}: ${s.change > 0 ? '+' : ''}${s.change.toFixed(4)} SOL`).join('; ') || 'No significant SOL movement',
    rpcNote: 'Gemini API unavailable — rule-based analysis used',
  };
}

export async function analyzeTransaction(ctx: TransactionContext): Promise<AnalysisResult> {
  const start = Date.now();
  try {
    const prompt = buildPrompt(ctx);
    const raw = await callGeminiApi(prompt);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Gemini returned non-JSON response');
    const parsed = JSON.parse(jsonMatch[0]);

    // Validate & normalise
    const validVerdicts: Verdict[] = ['SAFE', 'CAUTION', 'HIGH_RISK', 'CRITICAL'];
    const validRecs: Recommendation[] = ['SAFE_TO_PROCEED', 'PROCEED_WITH_CAUTION', 'DO_NOT_SIGN'];
    if (!validVerdicts.includes(parsed.verdict)) parsed.verdict = 'CAUTION';
    if (!validRecs.includes(parsed.recommendation)) parsed.recommendation = 'PROCEED_WITH_CAUTION';
    if (typeof parsed.riskScore !== 'number') parsed.riskScore = 50;
    if (!Array.isArray(parsed.redFlags)) parsed.redFlags = [];
    if (!Array.isArray(parsed.affectedAssets)) parsed.affectedAssets = [];
    if (!parsed.threatCategories) parsed.threatCategories = { drainerPattern:false, excessiveApprovals:false, unknownProgram:false, flashLoanVector:false, accountDrain:false, authorityTransfer:false, suspiciousData:false };

    // Force CRITICAL if known drainer
    if (ctx.hasHighRiskProgram) {
      parsed.verdict = 'CRITICAL';
      parsed.riskScore = Math.max(parsed.riskScore, 95);
      parsed.recommendation = 'DO_NOT_SIGN';
      parsed.threatCategories.drainerPattern = true;
      if (!parsed.redFlags.some((f: string) => f.includes('drainer'))) {
        parsed.redFlags.unshift('⛔ Known drainer/high-risk program detected in this transaction');
      }
    }

    parsed.aiModel = 'Gemini 1.5 Flash';
    parsed.analysisTime = Date.now() - start;
    parsed.programsInvolved = parsed.programsInvolved || ctx.programLabels;
    parsed.transferDetails = parsed.transferDetails || 'See summary';
    return parsed as AnalysisResult;
  } catch (err) {
    console.warn('[AI-Sentinel] Gemini failed, using rule-based fallback:', err);
    const result = ruleBasedFallback(ctx);
    result.analysisTime = Date.now() - start;
    return result;
  }
}
