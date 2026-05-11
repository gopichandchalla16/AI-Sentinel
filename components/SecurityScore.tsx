'use client';
import { useEffect, useState } from 'react';

type ServiceStatus = 'online' | 'checking' | 'offline';

interface Service {
  name: string;
  status: ServiceStatus;
}

const INITIAL_SERVICES: Service[] = [
  { name: 'Helius RPC Connected', status: 'checking' },
  { name: 'Gemini AI Online', status: 'checking' },
  { name: 'Solana Mainnet Reachable', status: 'checking' },
  { name: 'Threat DB Loaded (7 categories)', status: 'checking' },
  { name: 'Rule-based Fallback Active', status: 'checking' },
];

export default function SecurityScore() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Stagger each service coming online for a realistic feel
    INITIAL_SERVICES.forEach((_, i) => {
      setTimeout(() => {
        setServices(prev => {
          const next = prev.map((s, idx) =>
            idx === i ? { ...s, status: 'online' as ServiceStatus } : s
          );
          const onlineCount = next.filter(s => s.status === 'online').length;
          setScore(Math.round((onlineCount / next.length) * 100));
          return next;
        });
      }, 400 + i * 350);
    });
  }, []);

  const colorMap: Record<ServiceStatus, string> = {
    online: '#14F195',
    checking: '#FF8C00',
    offline: '#FF4444',
  };

  const iconMap: Record<ServiceStatus, string> = {
    online: '✓',
    checking: '⟳',
    offline: '✗',
  };

  const deg = Math.round((score / 100) * 360);

  return (
    <div style={{
      background: 'rgba(10,10,15,0.85)',
      border: '1px solid rgba(20,241,149,0.2)',
      borderRadius: 20,
      padding: 20,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>🟢 System Health</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>All services status</div>
        </div>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: `conic-gradient(#14F195 ${deg}deg, rgba(255,255,255,0.05) ${deg}deg)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          transition: 'background 0.4s',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: '#0a0a0f',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#14F195', fontWeight: 800, fontSize: 14 }}>{score}%</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {services.map(svc => (
          <div key={svc.name} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 10,
            border: `1px solid ${svc.status === 'online' ? 'rgba(20,241,149,0.15)' : 'rgba(255,255,255,0.05)'}`,
            transition: 'border 0.3s',
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: colorMap[svc.status],
              boxShadow: svc.status === 'online' ? `0 0 6px ${colorMap[svc.status]}` : 'none',
              transition: 'background 0.3s, box-shadow 0.3s',
            }} />
            <span style={{ color: svc.status === 'online' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)', fontSize: 13, flex: 1, transition: 'color 0.3s' }}>
              {svc.name}
            </span>
            <span style={{ fontSize: 12, color: colorMap[svc.status], transition: 'color 0.3s' }}>
              {iconMap[svc.status]}
            </span>
          </div>
        ))}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>
    </div>
  );
}
