import { useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { VsaSidebar } from '../components/VsaSidebar'
import { InternalHero } from '../components/InternalHero/InternalHero'
import { Pill } from '../components/Pill/Pill'
import { VsaProgress } from '../components/VsaProgress'
import { CambioSteps } from '../components/CambioSteps/CambioSteps'
import { SectionHabimetro } from '../components/SectionHabimetro'
import { SectionFicha } from '../components/SectionFicha'
import { SectionCTAStats } from '../components/SectionCTAStats'
import './CambiarDeCasaPage.css'

const HERO_IMAGE = '/assets/img-categoria-cambio.png'

export function CambiarDeCasaPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
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
            subtitle="Si deseas vender de manera efectiva y rápida."
            description="La solución: No compramos directamente, pero con nuestro servicio de broker inmobiliario, hacemos el trabajo pesado por ti."
            ctas={[
              { label: 'Quiero el servicio inmobiliario', variant: 'primary' },
              { label: '¿Como funciona?', variant: 'outline' },
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
          <SectionHabimetro />
          <SectionFicha />
          <SectionCTAStats />
        </main>
      </div>
      <Footer />
    </>
  )
}
