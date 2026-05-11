import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsBar from '../components/StatsBar';
import LiveThreatFeed from '../components/LiveThreatFeed';
import ScannerPanel from '../components/ScannerPanel';
import MEVDetector from '../components/MEVDetector';
import AddressIntelligence from '../components/AddressIntelligence';
import WalletProfiler from '../components/WalletProfiler';
import Web3Explainer from '../components/Web3Explainer';
import HowItWorks from '../components/HowItWorks';
import BusinessModel from '../components/BusinessModel';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] relative overflow-x-hidden">
      {/* Matrix rain background */}
      <AnimatedBackground />
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: 900, height: 500, background: 'radial-gradient(ellipse, rgba(153,69,255,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />
      <div style={{ position: 'fixed', bottom: 0, right: 0, width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(20,241,149,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <Navbar />
        <div style={{ paddingTop: 60 }}>

          <HeroSection />
          <StatsBar />

          {/* Live Threat Feed */}
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px 32px' }}>
            <LiveThreatFeed />
          </div>

          {/* Main Scanner */}
          <div id="scanner" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px 32px', scrollMarginTop: 72 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 20px', background: 'rgba(153,69,255,0.1)',
                border: '1px solid rgba(153,69,255,0.3)', borderRadius: 30,
                color: '#c084fc', fontSize: 13, fontWeight: 700, letterSpacing: 1,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#9945FF', display: 'inline-block' }} />
                AI TRANSACTION FIREWALL
              </span>
            </div>
            <ScannerPanel />
          </div>

          {/* MEV + Address Intel grid */}
          <div id="mev" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 20 }}>
              <MEVDetector />
              <div id="address"><AddressIntelligence /></div>
            </div>
          </div>

          {/* Wallet Profiler — full width */}
          <div id="wallet" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px 32px', scrollMarginTop: 72 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 20px', background: 'rgba(20,241,149,0.08)',
                border: '1px solid rgba(20,241,149,0.3)', borderRadius: 30,
                color: '#14F195', fontSize: 13, fontWeight: 700, letterSpacing: 1,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#14F195', display: 'inline-block' }} />
                WALLET RISK PROFILER
              </span>
            </div>
            <WalletProfiler />
          </div>

          <Web3Explainer />
          <div id="how"><HowItWorks /></div>
          <div id="business"><BusinessModel /></div>
          <Footer />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @media (max-width: 768px) {
          #mev > div { grid-template-columns: 1fr !important; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(153,69,255,0.4); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(153,69,255,0.7); }
        ::selection { background: rgba(153,69,255,0.3); }
      `}</style>
    </main>
  );
}
