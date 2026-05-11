import HeroSection from '@/components/HeroSection';
import TransactionScanner from '@/components/TransactionScanner';
import StatsBar from '@/components/StatsBar';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]">
      <HeroSection />
      <StatsBar />
      <section id="scanner" className="max-w-4xl mx-auto px-4 py-12">
        <TransactionScanner />
      </section>
      <HowItWorks />
      <Footer />
    </main>
  );
}
