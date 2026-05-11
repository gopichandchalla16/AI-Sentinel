'use client';
import { useEffect, useState } from 'react';

interface RiskGaugeProps {
  score: number;
  size?: number;
  animate?: boolean;
}

function getColor(score: number): string {
  if (score >= 76) return '#FF2D55';
  if (score >= 51) return '#FF6B35';
  if (score >= 26) return '#FFB800';
  return '#14F195';
}

function getLabel(score: number): string {
  if (score >= 76) return 'CRITICAL';
  if (score >= 51) return 'HIGH RISK';
  if (score >= 26) return 'CAUTION';
  return 'SAFE';
}

export default function RiskGauge({ score, size = 140, animate = true }: RiskGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;
  const color = getColor(displayScore);
  const label = getLabel(displayScore);

  useEffect(() => {
    if (!animate) { setDisplayScore(score); return; }
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score, animate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Glow filter */}
        <defs>
          <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Background ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.05s linear, stroke 0.3s ease', filter: `drop-shadow(0 0 8px ${color}88)` }}
          filter="url(#gauge-glow)"
        />
        {/* Score text */}
        <text
          x={size / 2} y={size / 2 - 8}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={size * 0.22} fontWeight="900"
          fill={color} fontFamily="'JetBrains Mono', monospace"
        >
          {displayScore}
        </text>
        {/* /100 text */}
        <text
          x={size / 2} y={size / 2 + 14}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={size * 0.09} fill="rgba(255,255,255,0.35)" fontFamily="Inter, sans-serif"
        >
          / 100
        </text>
      </svg>
      <span style={{
        fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em',
        color, textShadow: `0 0 12px ${color}88`,
      }}>{label}</span>
    </div>
  );
}
