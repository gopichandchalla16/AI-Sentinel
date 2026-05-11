export const runtime = 'nodejs';
export const maxDuration = 30;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS });
}

// ── Gemini helper ──────────────────────────────────────────────────────────
async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return '';
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
        }),
        signal: AbortSignal.timeout(15000),
      }
    );
    if (!res.ok) return '';
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  } catch {
    return '';
  }
}

// ── Groq fallback (free, fast, no quota issues) ────────────────────────────
async function callGroq(prompt: string): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  // If no Groq key, still works — we use a smart rule-based fallback below
  if (!key) return '';
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content:
              'You are AI-Sentinel, a Solana blockchain security expert. Answer in 2-3 plain-English sentences. Be specific, accurate, and never hallucinate program names.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 256,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || '';
  } catch {
    return '';
  }
}

// ── Smart rule-based fallback (works with ZERO external API keys) ──────────
function buildRuleBasedReply(
  question: string,
  analysisResult: Record<string, unknown>,
  signature: string
): string {
  const q = question.toLowerCase();
  const verdict = (analysisResult?.verdict as string) || 'SAFE';
  const riskScore = (analysisResult?.riskScore as number) || 0;
  const summary = (analysisResult?.summary as string) || '';
  const redFlags = (analysisResult?.redFlags as string[]) || [];
  const threats = analysisResult?.threatCategories as Record<string, boolean> | undefined;
  const dataSource = (analysisResult?.dataSource as string) || '';
  const isLive = dataSource.includes('LIVE');

  // Question routing
  if (q.includes('safe') || q.includes('risk') || q.includes('dangerous')) {
    if (riskScore < 25)
      return `✅ This transaction has a risk score of ${riskScore}/100 — it appears safe. ${summary || 'No significant threats were detected.'}`;
    if (riskScore < 55)
      return `⚠️ This transaction has a moderate risk score of ${riskScore}/100. ${redFlags.length ? 'Red flags: ' + redFlags.slice(0, 2).join(', ') + '.' : summary}`;
    return `🚨 HIGH RISK — score ${riskScore}/100. ${redFlags.length ? 'Issues: ' + redFlags.join(', ') + '.' : ''} Do NOT sign this transaction.`;
  }

  if (q.includes('program') || q.includes('contract') || q.includes('doing')) {
    const cats = threats
      ? Object.entries(threats)
          .filter(([, v]) => v)
          .map(([k]) => k)
      : [];
    if (cats.length)
      return `This transaction triggers ${cats.length} threat flag(s): ${cats.join(', ')}. ${summary}`;
    return `This transaction interacts with standard Solana programs. ${summary || 'No unusual program activity detected.'}`;
  }

  if (q.includes('drain') || q.includes('steal') || q.includes('phish') || q.includes('scam')) {
    const drainer = threats?.drainerPattern || threats?.accountDrain;
    return drainer
      ? `🚨 YES — this transaction shows drainer patterns. ${redFlags.join('. ')}. Do NOT approve it.`
      : `✅ No drainer or phishing patterns were detected in this transaction. The risk score is ${riskScore}/100.`;
  }

  if (q.includes('sign') || q.includes('approve') || q.includes('proceed')) {
    if (verdict === 'SAFE' || verdict === 'CAUTION')
      return `Risk score is ${riskScore}/100 (${verdict}). ${riskScore < 30 ? 'Safe to proceed.' : 'Proceed with caution — review the red flags before signing.'}`;
    return `Risk score is ${riskScore}/100 (${verdict}). We recommend NOT signing this transaction.`;
  }

  if (q.includes('what') || q.includes('explain') || q.includes('tell me')) {
    return summary || `This is a Solana transaction with risk score ${riskScore}/100 (${verdict}). ${isLive ? 'Analyzed with live on-chain data via Helius + Gemini AI.' : 'Analyzed using simulated data (transaction may be too old or on devnet.'}`;
  }

  // Generic fallback
  return `${summary || `Transaction risk: ${riskScore}/100 (${verdict}).`} ${redFlags.length ? 'Key concerns: ' + redFlags.slice(0, 2).join(', ') + '.' : 'No major threats detected.'} ${isLive ? '(Live Solana mainnet data)' : '(Simulated data)'}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question: string = body.question || '';
    const analysisResult: Record<string, unknown> = body.analysisResult || {};
    const signature: string = body.signature || '';

    if (!question.trim()) {
      return Response.json({ reply: 'Please ask a question.' }, { headers: CORS });
    }

    const prompt = `You are AI-Sentinel, a Solana blockchain security expert.

Transaction scanned: ${signature || 'unknown'}
Analysis result: ${JSON.stringify(analysisResult)}

User question: "${question}"

Answer in 2-3 sentences using plain English. Be specific to this transaction's data.
If safe, reassure clearly. If risky, name the specific danger. Never say "I don't know" — use the analysis data provided.`;

    // Try Gemini first, then Groq, then rule-based
    let reply = await callGemini(prompt);
    if (!reply) reply = await callGroq(prompt);
    if (!reply) reply = buildRuleBasedReply(question, analysisResult, signature);

    return Response.json({ reply }, { headers: CORS });
  } catch (err) {
    console.error('[tx-chat] Error:', err);
    return Response.json(
      { reply: 'Analysis service temporarily unavailable. Please try again in a moment.' },
      { headers: CORS }
    );
  }
}
