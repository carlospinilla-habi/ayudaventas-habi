import { useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { VsaSidebar } from '../components/VsaSidebar'
import { InternalHero } from '../components/InternalHero/InternalHero'
import { VsaProgress } from '../components/VsaProgress'
import { UrgSteps } from '../components/UrgSteps/UrgSteps'
import { SectionHabimetro } from '../components/SectionHabimetro'
import { SectionFicha } from '../components/SectionFicha'
import { SectionCTAStats } from '../components/SectionCTAStats'
import './VenderSinAfanPage.css'
import './VenderUrgentePage.css'

const HERO_IMAGE = '/assets/00a2adc296074f0e6dd74893ba7c54090a9d988a.png'

const LightningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M9.74333 1.06333C9.84095 1.11766 9.91755 1.20312 9.96093 1.30607C10.0043 1.40902 10.012 1.52353 9.98267 1.63133L8.65467 6.5H13.5C13.5974 6.50001 13.6928 6.52848 13.7742 6.58193C13.8557 6.63538 13.9198 6.71147 13.9586 6.80085C13.9974 6.89023 14.0093 6.989 13.9927 7.08502C13.9761 7.18104 13.9319 7.27013 13.8653 7.34133L6.86533 14.8413C6.78909 14.9232 6.6876 14.9771 6.57708 14.9945C6.46657 15.0119 6.35343 14.9917 6.25574 14.9372C6.15806 14.8826 6.08148 14.7969 6.03826 14.6937C5.99504 14.5906 5.98767 14.4759 6.01733 14.368L7.34533 9.5H2.5C2.40256 9.49999 2.30724 9.47152 2.22577 9.41807C2.1443 9.36462 2.08021 9.28853 2.0414 9.19915C2.00259 9.10977 1.99074 9.011 2.00731 8.91498C2.02388 8.81896 2.06815 8.72987 2.13467 8.65867L9.13467 1.15867C9.21091 1.0771 9.31226 1.0234 9.42257 1.00612C9.53288 0.98884 9.6458 1.00898 9.74333 1.06333Z" fill="#9333EA"/>
  </svg>
)

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
            pill={{ icon: <LightningIcon />, text: 'La opción más rápida' }}
            title={
              <>
                Quiero vender{' '}
                <span className="int-hero__title-accent">lo antes posible</span>
              </>
            }
            subtitle="Habi te compra la casa en 10 días"
            description="Siendo honestos contigo: si necesitas el dinero ya, la forma más rápida y segura es que Habi te compre directamente tu casa."
            ctas={[
              { label: 'Quiero una oferta de Habi', variant: 'primary' },
              { label: 'Ver como funciona', variant: 'outline' },
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
            imageClassName="int-hero__couple-frame--urgente"
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
