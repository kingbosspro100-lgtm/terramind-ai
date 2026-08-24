import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import TrustStats from "../components/landing/TrustStats";
import WhyTerraMind from "../components/landing/WhyTerraMind";
import Testimonials from "../components/landing/Testimonials";
import Footer from "../components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0914] text-white selection:bg-emerald-600 selection:text-white">
      <Navbar />
      <Hero />
      <TrustStats />
      <WhyTerraMind />
      <Testimonials />
      <Footer />
    </main>
  );
}
