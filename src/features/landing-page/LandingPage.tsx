import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'
import { ATSSection } from './components/ATSSection'
import { TemplatesSection } from './components/TemplatesSection'
import { TestimonialSection } from './components/TestimonialSection'
import { FAQSection } from './components/FAQSection'
import { Footer } from './components/Footer'

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ATSSection />
        <TemplatesSection />
        <TestimonialSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
