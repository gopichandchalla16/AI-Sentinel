"use client"

export default function AnimatedBackground() {
  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(153,69,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(153,69,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none z-0 opacity-20"
        style={{ background: 'radial-gradient(ellipse, #9945FF 0%, transparent 70%)' }}
      />
    </>
  )
}
