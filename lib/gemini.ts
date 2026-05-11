import type { TransactionContext, AnalysisResult, Verdict, Recommendation, ThreatCategories } from '@/types/analysis';

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

const SECURITY_PROMPT = (ctx: TransactionContext): string => `You are a blockchain security expert specializing in Solana DeFi exploit patterns.
Analyze this transaction and respond ONLY with valid JSON — no markdown, no code blocks, no extra text.

Transaction Data:
${JSON.stringify(ctx, null, 2)}

Security context:
- Known dangerous programs found: ${ctx.knownDangerousPrograms.length > 0 ? ctx.knownDangerousPrograms.join(', ') : 'none'}
- SetAuthority instruction: ${ctx.hasSetAuthority}
- CloseAccount instruction: ${ctx.hasCloseAccount}
- Max approval detected: ${ctx.hasMaxApproval}
- Transaction status: ${ctx.status}
- Fee paid: ${ctx.fee} SOL
- SOL flows: ${JSON.stringify(ctx.solChanges)}
- Token changes: ${ctx.tokenChanges.length} accounts affected

Threat patterns to check:
1. DRAINER: bulk token transfers to unknown wallets, close account patterns
2. EXCESSIVE_APPROVAL: approve instructions with amount > 1e15 (unlimited)
3. UNKNOWN_PROGRAM: unrecognized program IDs doing token operations
4. FLASH_LOAN: multiple borrow/repay in same tx with price impact
5. ACCOUNT_DRAIN: pre-balance >> post-balance for signer
6. AUTHORITY_TRANSFER: setAuthority changing mint/freeze authority
7. SUSPICIOUS_DATA: base58 instruction data encoding non-standard operations

Risk scoring:
- 0-25: SAFE — standard SPL/system ops, known DEX swaps, small amounts
- 26-50: CAUTION — unknown programs, moderate amounts, unusual patterns
- 51-75: HIGH_RISK — dangerous flags present, large amounts, suspicious approvals
- 76-100: CRITICAL — drainer patterns, known malicious programs, authority theft

Respond with EXACTLY this JSON structure:
{
  "riskScore": <integer 0-100>,
  "verdict": "<SAFE|CAUTION|HIGH_RISK|CRITICAL>",
  "summary": "<plain English 2-3 sentence description any user can understand>",
  "redFlags": ["<specific threat found>"],
  "recommendation": "<SAFE_TO_PROCEED|PROCEED_WITH_CAUTION|DO_NOT_SIGN>",
  "threatCategories": {
    "drainerPattern": <true|false>,
    "excessiveApprovals": <true|false>,
    "unknownProgram": <true|false>,
    "flashLoanVector": <true|false>,
    "accountDrain": <true|false>,
    "authorityTransfer": <true|false>,
    "suspiciousData": <true|false>
  },
  "affectedAssets": ["<asset description>"],
  "estimatedLoss": "<e.g. Up to 5.2 SOL at risk or No assets at risk>"
}`;

function ruleBasedAnalysis(ctx: TransactionContext): AnalysisResult {
  let riskScore = 0;
  const redFlags: string[] = [];
  const threats: ThreatCategories = {
    drainerPattern: false, excessiveApprovals: false, unknownProgram: false,
    flashLoanVector: false, accountDrain: false, authorityTransfer: false, suspiciousData: false,
  };

  if (ctx.knownDangerousPrograms.length > 0) {
    riskScore += 60;
    threats.drainerPattern = true;
    redFlags.push(`Known dangerous program: ${ctx.knownDangerousPrograms.join(', ')}`);
  }
  if (ctx.hasMaxApproval) {
    riskScore += 35;
    threats.excessiveApprovals = true;
    redFlags.push('Unlimited token approval detected — wallet could be drained at any time');
  }
  if (ctx.hasSetAuthority) {
    riskScore += 25;
    threats.authorityTransfer = true;
    redFlags.push('Authority transfer instruction — control of a token account may change');
  }
  if (ctx.hasCloseAccount) {
    riskScore += 15;
    threats.accountDrain = true;
    redFlags.push('Account close instruction — tokens may be swept from a token account');
  }
  const maxDrain = Math.max(...ctx.solChanges.map(s => -s.change), 0);
  if (maxDrain > 5) {
    riskScore += 20;
    threats.accountDrain = true;
    redFlags.push(`Large SOL movement: ${maxDrain.toFixed(2)} SOL leaving an account`);
  }
  const hasUnknown = ctx.programIds.some(p => p.startsWith('Unknown('));
  if (hasUnknown) {
    riskScore += 15;
    threats.unknownProgram = true;
    redFlags.push('Unverified program ID — smart contract with no public audit');
  }
  if (ctx.status === 'failed') riskScore = Math.max(riskScore, 10);

  riskScore = Math.min(100, riskScore);

  const verdict: Verdict = riskScore >= 76 ? 'CRITICAL' : riskScore >= 51 ? 'HIGH_RISK' : riskScore >= 26 ? 'CAUTION' : 'SAFE';
  const recommendation: Recommendation = riskScore >= 51 ? 'DO_NOT_SIGN' : riskScore >= 26 ? 'PROCEED_WITH_CAUTION' : 'SAFE_TO_PROCEED';

  const summarySol = ctx.solChanges.length > 0 ? `${Math.abs(ctx.solChanges[0].change).toFixed(4)} SOL` : 'no SOL';

  return {
    riskScore,
    verdict,
    summary: redFlags.length > 0
      ? `This transaction triggers ${redFlags.length} security warning(s). It involves ${ctx.programIds.slice(0, 2).join(', ')} and moves ${summarySol}. ${verdict === 'CRITICAL' || verdict === 'HIGH_RISK' ? 'This pattern is commonly associated with wallet draining attacks.' : 'Review carefully before signing.'}`
      : `This appears to be a standard Solana transaction involving ${ctx.programIds.slice(0, 2).join(', ')}. It moves ${summarySol} across ${ctx.accountKeys.length} accounts. No obvious threat patterns detected.`,
    redFlags: redFlags.length > 0 ? redFlags : ['No threats detected by rule engine'],
    recommendation,
    threatCategories: threats,
    affectedAssets: ctx.tokenChanges.length > 0 ? ctx.tokenChanges.map(t => `Token ${t.mint.slice(0, 8)}... (${t.preAmount} → ${t.postAmount})`) : ['SOL only'],
    estimatedLoss: maxDrain > 0 ? `Up to ${maxDrain.toFixed(4)} SOL at risk` : 'No significant assets at risk',
    programsInvolved: ctx.programIds,
    analysisTime: 0,
    aiModel: 'Rule-Based Fallback',
    rpcSource: 'Helius RPC',
  };
}

export async function analyzeTransaction(ctx: TransactionContext): Promise<AnalysisResult> {
  const start = Date.now();

  if (!GEMINI_KEY) {
    console.warn('[AI-Sentinel] GEMINI_API_KEY not set, using rule-based analysis');
    const result = ruleBasedAnalysis(ctx);
    result.analysisTime = Date.now() - start;
    return result;
  }

  try {
    const prompt = SECURITY_PROMPT(ctx);
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1500, topP: 0.9 },
        }),
        signal: AbortSignal.timeout(25000),
      }
    );

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Strip markdown fences
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON found in Gemini response');

    const parsed = JSON.parse(match[0]) as Partial<AnalysisResult>;

    // Validate and fill missing fields
    const validVerdicts: Verdict[] = ['SAFE', 'CAUTION', 'HIGH_RISK', 'CRITICAL'];
    const verdict: Verdict = validVerdicts.includes(parsed.verdict as Verdict) ? parsed.verdict as Verdict : 'CAUTION';
    const validRecs: Recommendation[] = ['SAFE_TO_PROCEED', 'PROCEED_WITH_CAUTION', 'DO_NOT_SIGN'];
    const recommendation: Recommendation = validRecs.includes(parsed.recommendation as Recommendation) ? parsed.recommendation as Recommendation : 'PROCEED_WITH_CAUTION';

    // Override if known dangerous program — always CRITICAL
    const finalVerdict: Verdict = ctx.knownDangerousPrograms.length > 0 ? 'CRITICAL' : verdict;
    const finalScore = ctx.knownDangerousPrograms.length > 0 ? Math.max((parsed.riskScore ?? 0), 90) : Math.min(100, Math.max(0, parsed.riskScore ?? 50));
    const finalRec: Recommendation = ctx.knownDangerousPrograms.length > 0 ? 'DO_NOT_SIGN' : recommendation;

    const defaultThreats: ThreatCategories = {
      drainerPattern: false, excessiveApprovals: false, unknownProgram: false,
      flashLoanVector: false, accountDrain: false, authorityTransfer: false, suspiciousData: false,
    };

    return {
      riskScore: finalScore,
      verdict: finalVerdict,
      summary: parsed.summary ?? 'Analysis complete.',
      redFlags: Array.isArray(parsed.redFlags) && parsed.redFlags.length > 0 ? parsed.redFlags : ['No specific threats flagged'],
      recommendation: finalRec,
      threatCategories: { ...defaultThreats, ...(parsed.threatCategories ?? {}) },
      affectedAssets: Array.isArray(parsed.affectedAssets) ? parsed.affectedAssets : [],
      estimatedLoss: parsed.estimatedLoss ?? 'Unknown',
      programsInvolved: ctx.programIds,
      analysisTime: Date.now() - start,
      aiModel: 'Gemini 1.5 Flash',
      rpcSource: 'Helius RPC',
    };
  } catch (err) {
    console.error('[AI-Sentinel] Gemini failed, falling back to rule-based:', err);
    const fallback = ruleBasedAnalysis(ctx);
    fallback.analysisTime = Date.now() - start;
    fallback.aiModel = 'Rule-Based Fallback (Gemini unavailable)';
    return fallback;
  }
}
