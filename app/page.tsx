import Navbar from '@/components/Navbar'
import AnimatedBackground from '@/components/AnimatedBackground'
import HeroSection from '@/components/HeroSection'
import JudgeBanner from '@/components/JudgeBanner'
import StatsBar from '@/components/StatsBar'
import TabContainer from '@/components/TabContainer'
import HowItWorks from '@/components/HowItWorks'
import UseCases from '@/components/UseCases'
import BusinessModel from '@/components/BusinessModel'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0a0a0f' }}>
      <AnimatedBackground />
      <Navbar />
      <HeroSection />
      <JudgeBanner />
      <StatsBar />
      <TabContainer />
      <HowItWorks />
      <UseCases />
      <BusinessModel />
      <Footer />
    </main>
  )
}
