import { useState, useEffect, lazy, Suspense } from 'react'
import { Footer } from '../components/Footer'
import { HeroSection } from '../components/HeroSection'
import { Navbar } from '../components/Navbar'
import { SectionCTAStats } from '../components/SectionCTAStats'
import { SectionFicha } from '../components/SectionFicha'
import { SectionFeatures1 } from '../components/SectionFeatures1'
import { SectionHabimetro } from '../components/SectionHabimetro'

const FichaCreator = lazy(() => import('../components/FichaCreator/FichaCreator'))
const HabiOfertaModal = lazy(() => import('../components/HabiOfertaModal/HabiOfertaModal'))
const MiCasaModal = lazy(() => import('../components/MiCasaModal/MiCasaModal'))

const HABIMETRO_URL = 'https://habi.co/habimetro/valor-comercial-en-linea'

export function HomePage() {
  const [fichaOpen, setFichaOpen] = useState(false)
  const [ofertaOpen, setOfertaOpen] = useState(false)
  const [habimetroOpen, setHabimetroOpen] = useState(false)
  const [miCasaOpen, setMiCasaOpen] = useState(false)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const fichaAnchor = target.closest('a[href="#crear-ficha"]')
      if (fichaAnchor) {
        e.preventDefault()
        setFichaOpen(true)
        return
      }
      const ofertaAnchor = target.closest('a[href="#habi-oferta"]')
      if (ofertaAnchor) {
        e.preventDefault()
        setOfertaOpen(true)
        return
      }
      const habimetroAnchor = target.closest('a[href="#habi-habimetro"]')
      if (habimetroAnchor) {
        e.preventDefault()
        setHabimetroOpen(true)
        return
      }
      const miCasaAnchor = target.closest('a[href="#mi-casa"]')
      if (miCasaAnchor) {
        e.preventDefault()
        setMiCasaOpen(true)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

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
      <Suspense fallback={null}>
        {fichaOpen && <FichaCreator open={fichaOpen} onClose={() => setFichaOpen(false)} />}
        {ofertaOpen && <HabiOfertaModal open={ofertaOpen} onClose={() => setOfertaOpen(false)} />}
        {habimetroOpen && <HabiOfertaModal open={habimetroOpen} onClose={() => setHabimetroOpen(false)} url={HABIMETRO_URL} />}
        {miCasaOpen && <MiCasaModal open={miCasaOpen} onClose={() => setMiCasaOpen(false)} />}
      </Suspense>
    </>
  )
}
