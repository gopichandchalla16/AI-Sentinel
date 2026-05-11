const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

export async function POST(request: Request) {
  try {
    const { question, analysisResult, signature } = await request.json()
    if (!question) return Response.json({ reply: 'Please ask a question.' })

    const prompt = `You are AI-Sentinel, a Solana blockchain security expert.
A user just scanned transaction: ${signature || 'unknown'}

Analysis result: ${JSON.stringify(analysisResult || {})}

User question: "${question}"

Answer in 2-3 sentences, plain English, no jargon.
Be direct and specific to their transaction.
If the transaction is safe, reassure them clearly.
If risky, explain the specific danger simply.`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    )
    const data = await res.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate a response. Please try again.'
    return Response.json({ reply })
  } catch (e) {
    return Response.json({ reply: 'Failed to get AI response. Please try again.' })
  }
}
