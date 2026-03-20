import { useState, useEffect, lazy, Suspense } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { VsaSidebar } from '../components/VsaSidebar'
import { InternalHero } from '../components/InternalHero/InternalHero'
import { Pill } from '../components/Pill/Pill'
import { VsaProgress } from '../components/VsaProgress'
import { CambioSteps } from '../components/CambioSteps/CambioSteps'
import { SectionTools } from '../components/SectionTools'
import { SectionCTAStats } from '../components/SectionCTAStats'
import { trackOfertaRequested, trackHabimetroRequested } from '../lib/storage-sync'
import './CambiarDeCasaPage.css'

const FichaCreator = lazy(() => import('../components/FichaCreator/FichaCreator'))
const HabiOfertaModal = lazy(() => import('../components/HabiOfertaModal/HabiOfertaModal'))
const MiCasaModal = lazy(() => import('../components/MiCasaModal/MiCasaModal'))
const InmoForm = lazy(() => import('../components/InmoForm/InmoForm'))
const HERO_IMAGE = '/assets/img-categoria-cambio.png'
const HABIMETRO_URL = 'https://habi.co/habimetro/valor-comercial-en-linea'

export function CambiarDeCasaPage() {
  const [fichaOpen, setFichaOpen] = useState(false)
  const [ofertaOpen, setOfertaOpen] = useState(false)
  const [habimetroOpen, setHabimetroOpen] = useState(false)
  const [miCasaOpen, setMiCasaOpen] = useState(false)
  const [inmoFormOpen, setInmoFormOpen] = useState(false)

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
        return
      }
      const inmoFormAnchor = target.closest('a[href="#inmo-form"]')
      if (inmoFormAnchor) {
        e.preventDefault()
        setInmoFormOpen(true)
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return (
    <>
      <Navbar />
      <div className="vsa-body cambiar-de-casa">
        <VsaSidebar activePage="cambiar" />
        <main className="vsa-content">
          <InternalHero
            pill={<Pill estado="cambio" />}
            title={
              <>
                Servicio Inmobiliario Habi:{' '}
                <span className="int-hero__title-accent">lo mejor de ambos mundos</span>
              </>
            }
            subtitle="La red de brokers mas grande del país lo venden por tí."
            description="La solución: No compramos directamente, pero con nuestro servicio de broker inmobiliario, hacemos el trabajo pesado por ti."
            ctas={[
              { label: 'Quiero el servicio inmobiliario', variant: 'primary', onClick: () => setInmoFormOpen(true) },
              { label: '¿Como funciona?', variant: 'outline', href: '#como-funciona' },
            ]}
            benefits={[
              { text: 'Asesoría profesional en precios y estrategias' },
              { text: 'Publicación en el portal de Habi con miles de compradores' },
              { text: 'Negociación experta a tu favor' },
              { text: <>Tiempo estimado: <strong>3 meses aprox</strong> con buenos resultados</> },
            ]}
            tip={{
              title: 'Esto es para ti si:',
              description: (
                <p>
                  No quieres perder tiempo aprendiendo todo el proceso, tienes un presupuesto para tu próxima casa y necesitas vender antes de comprar.
                </p>
              ),
            }}
            heroImage={HERO_IMAGE}
            heroSection="03"
          />
          <VsaProgress
            storageKey="cambio-user-stage"
            scrollTarget=""
            dispatchEvent={false}
          />
          <CambioSteps />
          <SectionTools />
          <SectionCTAStats />
        </main>
      </div>
      <Footer />
      <Suspense fallback={null}>
        {fichaOpen && <FichaCreator open={fichaOpen} onClose={() => setFichaOpen(false)} />}
        {ofertaOpen && <HabiOfertaModal open={ofertaOpen} onClose={() => setOfertaOpen(false)} />}
        {habimetroOpen && <HabiOfertaModal open={habimetroOpen} onClose={() => setHabimetroOpen(false)} url={HABIMETRO_URL} />}
        {miCasaOpen && <MiCasaModal open={miCasaOpen} onClose={() => setMiCasaOpen(false)} />}
        {inmoFormOpen && <InmoForm open={inmoFormOpen} onClose={() => setInmoFormOpen(false)} />}
      </Suspense>
    </>
  )
}
