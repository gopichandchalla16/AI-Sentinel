"use client"

export default function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1e1e2e] backdrop-blur-md" style={{ backgroundColor: 'rgba(10,10,15,0.85)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold" style={{ background: 'linear-gradient(135deg, #9945FF, #14F195)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              🛡️ AI-Sentinel
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border border-[#14F195]/30" style={{ color: '#14F195', backgroundColor: 'rgba(20,241,149,0.08)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-pulse inline-block" />
              LIVE
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Scanner', id: 'tabs' },
              { label: 'Wallet', id: 'tabs' },
              { label: 'Threat Feed', id: 'tabs' },
              { label: 'Programs', id: 'tabs' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.id)}
                className="px-3 py-1.5 text-sm rounded-lg transition-colors"
                style={{ color: '#94A3B8' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F8FAFC')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >
                {item.label}
              </button>
            ))}
            <a
              href="https://github.com/gopichandchalla16/AI-Sentinel"
              target="_blank"
              rel="noreferrer"
              className="ml-2 px-3 py-1.5 text-sm rounded-lg border border-[#1e1e2e] transition-colors"
              style={{ color: '#94A3B8' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#9945FF'; e.currentTarget.style.borderColor = '#9945FF' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.borderColor = '#1e1e2e' }}
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
