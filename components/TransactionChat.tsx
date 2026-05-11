"use client"
import { useState } from 'react'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

const SUGGESTED = [
  'Is my SOL at risk?',
  'What is this program doing?',
  'Should I sign this?',
  'What are the red flags exactly?',
  'Explain this in simpler terms',
]

export default function TransactionChat({ analysisResult, signature }: { analysisResult: any; signature: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = async (q?: string) => {
    const question = q || input
    if (!question.trim()) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: question, timestamp: new Date() }])
    setIsTyping(true)
    try {
      const res = await fetch('/api/tx-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, analysisResult, signature }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', content: data.reply || 'Sorry, I could not process that.', timestamp: new Date() }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Failed to get AI response. Please try again.', timestamp: new Date() }])
    }
    setIsTyping(false)
  }

  return (
    <div className="mt-4 rounded-2xl border border-[#1e1e2e] p-6" style={{ backgroundColor: '#111118' }}>
      <h3 className="text-base font-bold mb-3" style={{ color: '#F8FAFC' }}>🧠 Ask AI About This Transaction</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {SUGGESTED.map(q => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-full text-xs border border-[#1e1e2e] transition-colors hover:border-[#9945FF]/60 hover:text-[#9945FF]"
            style={{ color: '#94A3B8', backgroundColor: '#0a0a0f' }}
          >
            {q}
          </button>
        ))}
      </div>

      {messages.length > 0 && (
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`p-3 rounded-2xl text-sm ${m.role === 'user' ? 'ml-8 rounded-tr-sm' : 'mr-8 rounded-tl-sm'}`}
              style={{
                backgroundColor: m.role === 'user' ? 'rgba(153,69,255,0.15)' : '#0a0a0f',
                border: m.role === 'user' ? '1px solid rgba(153,69,255,0.3)' : '1px solid #1e1e2e',
                color: '#F8FAFC',
              }}
            >
              <span className="text-xs font-bold mr-2" style={{ color: m.role === 'user' ? '#9945FF' : '#14F195' }}>
                {m.role === 'user' ? 'You' : '🧠 AI'}
              </span>
              {m.content}
            </div>
          ))}
          {isTyping && (
            <div className="mr-8 p-3 rounded-2xl rounded-tl-sm border border-[#1e1e2e]" style={{ backgroundColor: '#0a0a0f' }}>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#9945FF', animationDelay: i * 0.15 + 's' }} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about this transaction..."
          className="flex-1 px-4 py-2 rounded-xl border border-[#1e1e2e] text-sm outline-none focus:border-[#9945FF]"
          style={{ backgroundColor: '#0a0a0f', color: '#F8FAFC' }}
        />
        <button
          onClick={() => handleSend()}
          disabled={isTyping || !input.trim()}
          className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #9945FF, #7c3aed)', color: '#fff' }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
