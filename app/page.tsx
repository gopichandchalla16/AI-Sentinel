import HeroSection from '../components/HeroSection';
import StatsBar from '../components/StatsBar';
import ScannerPanel from '../components/ScannerPanel';
import HowItWorks from '../components/HowItWorks';
import LiveThreatPulse from '../components/LiveThreatPulse';
import MEVDetector from '../components/MEVDetector';
import AddressIntelligence from '../components/AddressIntelligence';
import SecurityScore from '../components/SecurityScore';
import BusinessModel from '../components/BusinessModel';
import Footer from '../components/Footer';
import MatrixRain from '../components/MatrixRain';

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] relative overflow-x-hidden">
      {/* Matrix rain background */}
      <MatrixRain />

      {/* Radial glow overlays */}
      <div style={{
        position: 'fixed',
        top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: 900,
        height: 500,
        background: 'radial-gradient(ellipse, rgba(153,69,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      <div style={{
        position: 'fixed',
        bottom: 0, right: 0,
        width: 600,
        height: 400,
        background: 'radial-gradient(ellipse, rgba(20,241,149,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* All content above the background */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <HeroSection />
        <StatsBar />

        {/* Main grid layout */}
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* System health + Live threat — side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 32 }} className="grid-responsive">
            <SecurityScore />
            <LiveThreatPulse />
          </div>

          {/* Scanner — full width, centered attention */}
          <div id="scanner" style={{ marginBottom: 32 }}>
            <div style={{
              textAlign: 'center',
              marginBottom: 20,
              padding: '6px 20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(153,69,255,0.1)',
              border: '1px solid rgba(153,69,255,0.3)',
              borderRadius: 30,
              margin: '0 auto 20px',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#9945FF', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#c084fc', fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>AI TRANSACTION FIREWALL</span>
            </div>
            <ScannerPanel />
          </div>

          {/* MEV + Address Intelligence — side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }} className="grid-responsive">
            <MEVDetector />
            <AddressIntelligence />
          </div>

          <HowItWorks />
          <BusinessModel />
        </div>

        <Footer />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @media (max-width: 768px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
        /* Glassmorphism scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(153,69,255,0.4); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(153,69,255,0.7); }
        /* Selection */
        ::selection { background: rgba(153,69,255,0.3); }
      `}</style>
    </main>
  );
}
