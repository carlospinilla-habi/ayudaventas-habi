import { InternalHero } from '../InternalHero/InternalHero'

const COUPLE_IMAGE = '/assets/b9fab7a40164b57fac15efa615a28c9014e3ed25.png'
const ICON_SNAIL = '/assets/1447c528364d117425a31f7a26826bbed7f1f1c1.svg'

export function VsaHero() {
  return (
    <InternalHero
      pill={{ icon: ICON_SNAIL, text: 'Vender sin afán' }}
      title={
        <>
          <span className="int-hero__title-accent">Vende a tu ritmo</span>{' '}
          y al precio que necesitas
        </>
      }
      subtitle="Tienes el mejor activo para vender bien: Tiempo."
      description="Con calma y la estrategia correcta, puedes sacar el máximo precio sin apuros. Te damos herramientas gratis que te ayudan a hacerlo bien."
      ctas={[
        { label: '¿Cómo puedo hacerlo?', variant: 'primary' },
      ]}
      benefits={[
        { text: 'Tú controlas cuándo y a qué precio' },
        { text: 'Mayor exposición = mejores ofertas' },
        { text: 'Te guiamos en cada etapa del proceso' },
        { text: 'En promedio ~9 meses para vender a buen precio' },
      ]}
      tip={{
        title: 'Tip de expertos:',
        description: (
          <p>
            <strong>El precio correcto al inicio es clave.</strong> Casas sobrevaluadas terminan vendiéndose más barato porque pierden relevancia en el mercado. Usa gratis nuestra calculadora <a href="#habimetro">Habimetro</a> para arrancar bien.
          </p>
        ),
      }}
      heroImage={COUPLE_IMAGE}
    />
  )
}
