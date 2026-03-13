import { useEffect } from 'react'
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
import './VenderSinAfanPage.css'
import './VenderUrgentePage.css'

const HERO_IMAGE = '/assets/img-categoria-urgente.png'

export function VenderUrgentePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
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
              { label: 'Quiero una oferta de Habi', variant: 'primary' },
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
    </>
  )
}
