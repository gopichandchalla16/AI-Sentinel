'use client';

export default function Footer() {
  return (
    <footer className="bg-[#111118] border-t border-[#1e1e2e] py-10 mt-8">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            <path d="M16 3L28 9V17C28 23.5 22.5 29.5 16 31C9.5 29.5 4 23.5 4 17V9Z" stroke="#9945FF" strokeWidth="1.8" fill="rgba(153,69,255,0.1)" />
            <path d="M10.5 16L14.5 20L21.5 13" stroke="#14F195" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-bold text-base">AI-Sentinel</span>
        </div>

        <p className="text-sm text-[#94A3B8] mb-2">
          Built for{' '}
          <a href="https://colosseum.org/frontier" target="_blank" rel="noopener noreferrer" className="text-[#9945FF] hover:underline">
            Colosseum Frontier Hackathon 2026
          </a>
          {' '}· Track: AI Platforms / Agents
        </p>

        <p className="text-xs text-[#475569] mb-4">
          Making Solana DeFi safe for the next billion users.
        </p>

        <div className="flex items-center justify-center gap-6 text-sm">
          <a
            href="https://github.com/gopichandchalla16/AI-Sentinel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#94A3B8] hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com/GopichandAI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#94A3B8] hover:text-white transition-colors"
          >
            @GopichandAI
          </a>
          <span className="px-2 py-0.5 bg-[#14F195]/10 border border-[#14F195]/25 text-[#14F195] text-xs font-bold rounded">
            MIT License
          </span>
        </div>
      </div>
    </footer>
  );
}
