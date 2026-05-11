'use client';
import { useState } from 'react';
import ScannerPanel from './ScannerPanel';
import WalletProfiler from './WalletProfiler';
import ThreatFeed from './ThreatFeed';
import ProgramScanner from './ProgramScanner';
import MEVDetector from './MEVDetector';
import AddressIntelligence from './AddressIntelligence';

type Tab = 'scanner' | 'wallet' | 'threats' | 'program' | 'mev' | 'address';

export default function TabContainer() {
  const [active, setActive] = useState<Tab>('scanner');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'scanner', label: 'TX Scanner', icon: '🔍' },
    { id: 'wallet', label: 'Wallet Profiler', icon: '👛' },
    { id: 'threats', label: 'Live Threats', icon: '📡' },
    { id: 'program', label: 'Program Scanner', icon: '🔬' },
    { id: 'mev', label: 'MEV Detector', icon: '⚡' },
    { id: 'address', label: 'Address Intel', icon: '🔎' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>
      {/* Tab Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid rgba(153,69,255,0.3)',
        paddingBottom: '0.75rem',
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: active === t.id ? '1px solid #9945FF' : '1px solid rgba(153,69,255,0.3)',
              background: active === t.id ? 'rgba(153,69,255,0.2)' : 'rgba(0,0,0,0.3)',
              color: active === t.id ? '#fff' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: active === t.id ? 700 : 400,
              transition: 'all 0.2s',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: '0.5rem' }}>
        {active === 'scanner' && <ScannerPanel />}
        {active === 'wallet' && <WalletProfiler />}
        {active === 'threats' && <ThreatFeed />}
        {active === 'program' && <ProgramScanner />}
        {active === 'mev' && <MEVDetector />}
        {active === 'address' && <AddressIntelligence />}
      </div>
    </div>
  );
}
