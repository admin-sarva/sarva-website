import ExperiencesToFeel from "../components/sections/experiences-to-feel"
import FinalCTA from "../components/sections/final-cta"
import Footer from "../components/sections/footer"
import HeroSection from "../components/sections/hero-section"
import PlacesToWander from "../components/sections/places-to-wander"
import RecommendedResorts from "../components/sections/recommended-resorts"
import Testimonials from "../components/sections/Testimonials"
import WanderNotes from "../components/sections/wander-notes"
import WhySarva from "../components/sections/why-sarva"

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <HeroSection />
      <PlacesToWander />
      <WhySarva />
      <ExperiencesToFeel />
      <RecommendedResorts />
      <WanderNotes />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  )
}
