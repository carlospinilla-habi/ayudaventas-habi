import { useState, useEffect, lazy, Suspense } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { VsaSidebar } from '../components/VsaSidebar'
import { InternalHero } from '../components/InternalHero/InternalHero'
import { Pill } from '../components/Pill/Pill'
import { LegalCaseCards } from '../components/LegalCaseCards/LegalCaseCards'
import { VsaProgress } from '../components/VsaProgress'
import { VsaGuide } from '../components/VsaGuide'
import { SectionHabimetro } from '../components/SectionHabimetro'
import { SectionFicha } from '../components/SectionFicha'
import { SectionCTAStats } from '../components/SectionCTAStats'
import { trackOfertaRequested, trackHabimetroRequested } from '../lib/storage-sync'
import './TemaLegalPage.css'

const HabiOfertaModal = lazy(() => import('../components/HabiOfertaModal/HabiOfertaModal'))
const MiCasaModal = lazy(() => import('../components/MiCasaModal/MiCasaModal'))
const HERO_IMAGE = '/assets/img-categoria-legal.png'
const HABIMETRO_URL = 'https://habi.co/habimetro/valor-comercial-en-linea'

export function TemaLegalPage() {
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
      <div className="vsa-body tema-legal">
        <VsaSidebar activePage="legal" />
        <main className="vsa-content">
          <InternalHero
            pill={<Pill estado="legal" />}
            title={
              <>
                Asesoría especializada en ventas{' '}
                <span className="int-hero__title-accent">con temas legales</span>
              </>
            }
            subtitle="Los temas legales añaden capas de complejidad"
            description="Sabemos que esto puede ser difícil pero con el acompañamiento correcto se resuelven."
            ctas={[
              { label: 'Hablar con un asesor legal', variant: 'primary', onClick: () => window.open('https://wa.link/97x21j', '_blank') },
              { label: 'Ver el proceso general', variant: 'outline' },
            ]}
            benefits={[
              { text: 'Revisión del estado legal del inmueble' },
              { text: 'Orientación en procesos de sucesión y divorcio' },
              { text: 'Coordinación con abogados especializados' },
              { text: 'Acompañamiento hasta el cierre definitivo' },
            ]}
            heroImage={HERO_IMAGE}
            heroSection="04"
          />
          <LegalCaseCards />
          <VsaProgress
            storageKey="legal-user-stage"
            scrollTarget=""
            dispatchEvent={false}
          />
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
