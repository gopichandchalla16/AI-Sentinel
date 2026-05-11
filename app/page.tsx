import AnimatedBackground from '@/components/AnimatedBackground'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import JudgeBanner from '@/components/JudgeBanner'
import LiveStatsBar from '@/components/LiveStatsBar'
import TabContainer from '@/components/TabContainer'
import HowItWorks from '@/components/HowItWorks'
import TrustComparison from '@/components/TrustComparison'
import UseCases from '@/components/UseCases'
import BusinessModel from '@/components/BusinessModel'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main style={{position:'relative',minHeight:'100vh',background:'#0a0a0f'}}>
      <AnimatedBackground />
      <div style={{position:'relative',zIndex:1}}>
        <Navbar />
        <HeroSection />
        <JudgeBanner />
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
          <LiveStatsBar />
        </div>
        <div id="tab-container" style={{maxWidth:1200,margin:'0 auto',padding:'40px 24px'}}>
          <TabContainer />
        </div>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
          <HowItWorks />
          <TrustComparison />
          <UseCases />
          <BusinessModel />
        </div>
        <Footer />
      </div>
    </main>
  )
}
