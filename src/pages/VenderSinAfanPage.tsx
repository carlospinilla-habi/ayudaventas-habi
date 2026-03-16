import { useState, useEffect, lazy, Suspense } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { VsaSidebar } from '../components/VsaSidebar'
import { VsaHero } from '../components/VsaHero'
import { VsaProgress } from '../components/VsaProgress'
import { VsaGuide } from '../components/VsaGuide'
import { SectionHabimetro } from '../components/SectionHabimetro'
import { SectionFicha } from '../components/SectionFicha'
import { SectionCTAStats } from '../components/SectionCTAStats'
import './VenderSinAfanPage.css'

const HabiOfertaModal = lazy(() => import('../components/HabiOfertaModal/HabiOfertaModal'))
const MiCasaModal = lazy(() => import('../components/MiCasaModal/MiCasaModal'))
const HABIMETRO_URL = 'https://habi.co/habimetro/valor-comercial-en-linea'

export function VenderSinAfanPage() {
  const [ofertaOpen, setOfertaOpen] = useState(false)
  const [habimetroOpen, setHabimetroOpen] = useState(false)
  const [miCasaOpen, setMiCasaOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
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
      <div className="vsa-body" data-node-id="309:51603">
        <VsaSidebar activePage="sin-afan" />
        <main className="vsa-content" data-node-id="309:51584">
          <VsaHero />
          <VsaProgress />
          <VsaGuide />
          <SectionHabimetro />
          <SectionFicha />
          <SectionCTAStats />
        </main>
      </div>
      <Footer />
      <Suspense fallback={null}>
        {ofertaOpen && <HabiOfertaModal open={ofertaOpen} onClose={() => setOfertaOpen(false)} />}
        {habimetroOpen && <HabiOfertaModal open={habimetroOpen} onClose={() => setHabimetroOpen(false)} url={HABIMETRO_URL} />}
        {miCasaOpen && <MiCasaModal open={miCasaOpen} onClose={() => setMiCasaOpen(false)} />}
      </Suspense>
    </>
  )
}
