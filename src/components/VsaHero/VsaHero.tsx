import { InternalHero } from '../InternalHero/InternalHero'
import { Pill } from '../Pill/Pill'

const HERO_IMAGE = '/assets/img-categoria-sinafan.png'

export function VsaHero() {
  return (
    <InternalHero
      pill={<Pill estado="sin-afan" />}
      title={
        <>
          <span className="int-hero__title-accent">Vende a tu ritmo</span>{' '}
          y al precio que necesites.
        </>
      }
      subtitle="Tienes el mejor activo para vender bien: el tiempo."
      description="Con calma y la estrategia correcta, puedes obtener el máximo precio sin apuros. Te ofrecemos herramientas gratuitas que te ayudarán a hacerlo bien."
      ctas={[
        { label: '¿Cómo puedo hacerlo?', variant: 'primary' },
      ]}
      benefits={[
        { text: 'Tú controlas cuándo y a qué precio.' },
        { text: 'Mayor exposición = mejores ofertas.' },
        { text: 'Te guiamos en cada etapa del proceso.' },
        { text: 'En promedio, toma alrededor de 9 meses vender a buen precio.' },
      ]}
      tip={{
        title: 'Consejo de expertos:',
        description: (
          <p>
            <strong>El precio correcto al inicio es clave.</strong> Las casas sobrevaloradas terminan vendiéndose más baratas porque pierden relevancia en el mercado. Usa gratis nuestra calculadora <a href="#habi-habimetro">Habímetro</a> para comenzar bien.
          </p>
        ),
      }}
      heroImage={HERO_IMAGE}
      heroSection="01"
    />
  )
}
