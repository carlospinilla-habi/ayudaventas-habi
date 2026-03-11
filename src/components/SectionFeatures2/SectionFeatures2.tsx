import { useReveal } from '../../hooks/useReveal'
import { useParallax } from '../../hooks/useParallax'
import { useScrollRevealText } from '../../hooks/useScrollRevealText'
import './SectionFeatures2.css'

const ICON_LIGHTNING = '/assets/6bcd3609af0841b23174cb50a20ff3abe9122f8a.svg'
const ICON_HOUSE = '/assets/9181246ffbe1ae1c81907fb9b93a7cbfad54a590.svg'
const ICON_GAVEL = '/assets/1310b413939ce95781b95c6a3f32181573aecf25.svg'
const ICON_CHECKMARK = '/assets/6a6f1798ac463a687c468a0daefac090874afbf3.svg'

const ACCENT_WORD = 'necesidades.'
const ALL_WORDS = 'Si lo necesitas existen servicios de venta para estas necesidades.'.split(' ')

const cards = [
  {
    pill: 'Urgente',
    pillIcon: ICON_LIGHTNING,
    title: 'Necesito vender lo antes posible',
    desc: 'No pedo espera, necesito vender lo antes posible.',
    featurePrefix: 'Puedes vender en',
    featureBold: '10 días',
    tag: 'El más soliciitado',
    variant: 'highlight' as const,
  },
  {
    pill: 'Cambiar de casa',
    pillIcon: ICON_HOUSE,
    title: 'Necesito vender para comprar otra casa',
    desc: 'Necesito vender rápido y a buen precio para comprar mi nueva casa',
    featurePrefix: 'Puedes vender en',
    featureBold: '3 meses aprx',
    variant: 'default' as const,
  },
  {
    pill: 'Tema legal',
    pillIcon: ICON_GAVEL,
    title: 'Necesito solucionar asuntos legales',
    desc: 'Divorcio, sucesión, litigio u otro... hay un tema legal de por medio y necesito ayuda',
    featurePrefix: 'Asesoría dependiendo del caso',
    featureBold: '',
    variant: 'default' as const,
  },
]

export function SectionFeatures2() {
  const containerRef = useReveal<HTMLDivElement>()
  const cardsRef = useReveal<HTMLDivElement>('center')
  const { containerRef: scrollRef, progress } = useScrollRevealText()

  const headerParallaxRef = useParallax<HTMLDivElement>(-40)
  const cardsParallaxRef = useParallax<HTMLDivElement>(60)

  const revealedCount = Math.floor(progress * ALL_WORDS.length)

  return (
    <section className="f2" data-node-id="232:30649">
      <div ref={(el) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        (scrollRef as React.MutableRefObject<HTMLElement | null>).current = el;
        (headerParallaxRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }} className="f2__header reveal">
        <span className="f2__pill">✦ Otros momentos de venta ✦</span>
        <h2 className="f2__title">
          {ALL_WORDS.map((word, i) => {
            const isAccent = word === ACCENT_WORD
            const revealed = i < revealedCount
            return (
              <span
                key={i}
                className={`srt-word${isAccent ? ' srt-word--accent' : ''}${revealed ? ' is-revealed' : ''}`}
              >
                {word}{' '}
              </span>
            )
          })}
        </h2>
        <p className="f2__subtitle">
          Selecciona la que te interesa más según tu momento de venta.
        </p>
      </div>

      <div
        ref={(el) => {
          (cardsRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          (cardsParallaxRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        className="f2__cards-container f2-stagger"
        data-node-id="232:30678"
      >
        {cards.map((card) => (
          <article
            key={card.pill}
            className={`f2__card f2__card--${card.variant}`}
          >
            <div className="f2__card-wrapper">
              {card.tag && <span className="f2__card-tag">{card.tag}</span>}
              <div className="f2__card-inner">
                <div className="f2__card-body">
                  <span className="f2__card-pill">
                    <img src={card.pillIcon} alt="" className="f2__card-pill-icon" />
                    {card.pill}
                  </span>
                  <h3 className="f2__card-title">{card.title}</h3>
                  <p className="f2__card-desc">{card.desc}</p>
                </div>
                <div className="f2__card-footer">
                  <p className="f2__card-feature">
                    <img src={ICON_CHECKMARK} alt="" className="f2__bullet-icon" />
                    {card.featurePrefix}
                    {card.featureBold && (
                      <>
                        {' '}<strong>{card.featureBold}</strong>
                      </>
                    )}
                  </p>
                  <button
                    type="button"
                    className={`f2__card-btn f2__card-btn--${card.variant}`}
                  >
                    Este soy yó
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
