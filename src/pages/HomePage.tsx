import { Footer } from '../components/Footer'
import { HeroSection } from '../components/HeroSection'
import { Navbar } from '../components/Navbar'
import { SectionCTAStats } from '../components/SectionCTAStats'
import { SectionFicha } from '../components/SectionFicha'
import { SectionFeatures1 } from '../components/SectionFeatures1'
import { SectionHabimetro } from '../components/SectionHabimetro'

export function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <SectionFeatures1 />
        <SectionHabimetro />
        <SectionFicha />
        <SectionCTAStats />
        <Footer />
      </main>
    </>
  )
}
