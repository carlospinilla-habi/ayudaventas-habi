import { useState, useEffect, lazy, Suspense } from 'react'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'
import { SectionCTAStats } from '../components/SectionCTAStats'
import { SectionFeatures1 } from '../components/SectionFeatures1'
import { SectionTools } from '../components/SectionTools'
import { trackOfertaRequested, trackHabimetroRequested } from '../lib/storage-sync'

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
        trackOfertaRequested()
        return
      }
      const habimetroAnchor = target.closest('a[href="#habi-habimetro"]')
      if (habimetroAnchor) {
        e.preventDefault()
        setHabimetroOpen(true)
        trackHabimetroRequested()
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
        <SectionFeatures1 />
        <SectionTools />
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
