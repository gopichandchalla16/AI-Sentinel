import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a1a0f 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Top glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: 800,
            height: 400,
            background: 'radial-gradient(ellipse, rgba(153,69,255,0.3) 0%, transparent 70%)',
            transform: 'translateX(-50%)',
            display: 'flex',
          }}
        />
        {/* Bottom glow */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 600,
            height: 300,
            background: 'radial-gradient(ellipse, rgba(20,241,149,0.15) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Shield emoji */}
        <div style={{ fontSize: 80, marginBottom: 16, display: 'flex' }}>🛡️</div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: '-2px',
            background: 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            display: 'flex',
            marginBottom: 12,
          }}
        >
          AI-Sentinel
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: '#94A3B8',
            fontWeight: 600,
            marginBottom: 32,
            display: 'flex',
          }}
        >
          Solana&apos;s First Agentic Transaction Firewall
        </div>

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
          {[
            ['🛡️', '12,489+', 'Txs Scanned'],
            ['⚡', '<2s', 'AI Analysis'],
            ['🚨', '7', 'Threat Types'],
            ['🎯', '99.3%', 'Accuracy'],
          ].map(([icon, val, lbl]) => (
            <div
              key={lbl}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '12px 20px',
                minWidth: 120,
              }}
            >
              <span style={{ fontSize: 24, display: 'flex' }}>{icon}</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: '#14F195', display: 'flex' }}>{val}</span>
              <span style={{ fontSize: 12, color: '#94A3B8', display: 'flex' }}>{lbl}</span>
            </div>
          ))}
        </div>

        {/* Live badge */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            padding: '8px 20px',
            background: 'rgba(20,241,149,0.1)',
            border: '1px solid rgba(20,241,149,0.3)',
            borderRadius: 9999,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#14F195',
              display: 'flex',
            }}
          />
          <span
            style={{
              color: '#14F195',
              fontWeight: 700,
              fontSize: 16,
              display: 'flex',
            }}
          >
            LIVE · SOLANA MAINNET · COLOSSEUM FRONTIER 2026
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
