"use client"

export default function AnimatedBackground() {
  return (
    <>
      {/* Purple grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: [
          'linear-gradient(rgba(153,69,255,0.04) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(153,69,255,0.04) 1px, transparent 1px)',
        ].join(','),
        backgroundSize: '60px 60px',
      }} />
      {/* Top-center radial glow */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 900, height: 500, pointerEvents: 'none', zIndex: 0, opacity: 0.15,
        background: 'radial-gradient(ellipse, #9945FF 0%, transparent 65%)',
      }} />
    </>
  )
}
