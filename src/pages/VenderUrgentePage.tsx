import { useState, useEffect, lazy, Suspense } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { VsaSidebar } from '../components/VsaSidebar'
import { InternalHero } from '../components/InternalHero/InternalHero'
import { Pill } from '../components/Pill/Pill'
import { VsaProgress } from '../components/VsaProgress'
import { UrgSteps } from '../components/UrgSteps/UrgSteps'
import { SectionHabimetro } from '../components/SectionHabimetro'
import { SectionFicha } from '../components/SectionFicha'
import { SectionCTAStats } from '../components/SectionCTAStats'
import { trackOfertaRequested, trackHabimetroRequested } from '../lib/storage-sync'
import './VenderSinAfanPage.css'
import './VenderUrgentePage.css'

const FichaCreator = lazy(() => import('../components/FichaCreator/FichaCreator'))
const HabiOfertaModal = lazy(() => import('../components/HabiOfertaModal/HabiOfertaModal'))
const MiCasaModal = lazy(() => import('../components/MiCasaModal/MiCasaModal'))
const HERO_IMAGE = '/assets/img-categoria-urgente.png'
const HABIMETRO_URL = 'https://habi.co/habimetro/valor-comercial-en-linea'

export function VenderUrgentePage() {
  const [fichaOpen, setFichaOpen] = useState(false)
  const [ofertaOpen, setOfertaOpen] = useState(false)
  const [habimetroOpen, setHabimetroOpen] = useState(false)
  const [miCasaOpen, setMiCasaOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
      <div className="vsa-body vender-urgente">
        <VsaSidebar activePage="urgente" />
        <main className="vsa-content">
          <InternalHero
            pill={<Pill estado="urgente" label="Venta urgente" />}
            title={
              <>
                Quiero vender{' '}
                <span className="int-hero__title-accent">lo antes posible</span>
              </>
            }
            subtitle="Habi te compra la casa en 10 días"
            description="Siendo honestos contigo: si necesitas el dinero ya, la forma más rápida y segura es que Habi te compre directamente"
            ctas={[
              { label: 'Quiero una oferta de Habi', variant: 'primary' as const, onClick: () => { setOfertaOpen(true); trackOfertaRequested() } },
              { label: '¿Cómo funciona?', variant: 'outline' },
            ]}
            benefits={[
              { text: 'Oferta en 24 horas hábiles' },
              { text: 'Cierre garantizado en ~15 días' },
              { text: 'Sin intermediarios, sin incertidumbre' },
              { text: 'Nosotros nos encargamos de todos los trámites' },
            ]}
            tip={{
              title: 'Te hablamos con la verdad:',
              description: (
                <p>
                  Quizás no obtengas el precio más alto del mercado, pero obtienes certeza, velocidad y cero dolores de cabeza. Para una situación urgente, eso vale muchísimo.
                </p>
              ),
            }}
            heroImage={HERO_IMAGE}
          />
          <VsaProgress
            storageKey="urg-user-stage"
            scrollTarget=""
            dispatchEvent={false}
          />
          <UrgSteps />
          <SectionHabimetro />
          <SectionFicha />
          <SectionCTAStats />
        </main>
      </div>
      <Footer />
      <Suspense fallback={null}>
        {fichaOpen && <FichaCreator open={fichaOpen} onClose={() => setFichaOpen(false)} />}
        {ofertaOpen && <HabiOfertaModal open={ofertaOpen} onClose={() => setOfertaOpen(false)} />}
        {habimetroOpen && <HabiOfertaModal open={habimetroOpen} onClose={() => setHabimetroOpen(false)} url={HABIMETRO_URL} />}
        {miCasaOpen && <MiCasaModal open={miCasaOpen} onClose={() => setMiCasaOpen(false)} />}
      </Suspense>
    </>
  )
}
