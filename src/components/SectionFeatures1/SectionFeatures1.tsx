import { useNavigate } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal'
import { useParallax } from '../../hooks/useParallax'
import { useScrollRevealText } from '../../hooks/useScrollRevealText'
import { Pill } from '../Pill/Pill'
import type { PillEstado } from '../Pill/Pill'
import './SectionFeatures1.css'

const CARD_BG_IMAGE = '/assets/3365f92b8af59d5372822ffb7e43537fa555db38.png'
const ARROW_ICON = '/assets/cd835b98a354fa50c5f884471dfaf5e5ee7b6920.svg'

const CheckGreen = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="7" fill="#22c55e"/>
    <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CheckWhite = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="7" fill="white"/>
    <path d="M4 7l2 2 4-4" stroke="#6b21a8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ACCENT_WORDS = ['Primero', 'lo', 'primero,']
const ALL_WORDS = 'Primero lo primero, ¿Con cual de estos momentos te identificas mejor?'.split(' ')

interface RightCard {
  id: string
  pillEstado: PillEstado
  title: string
  feature: string
  featureBold: string
  route: string
}

const RIGHT_CARDS: RightCard[] = [
  {
    id: 'urgente',
    pillEstado: 'urgente',
    title: 'Necesito vender lo antes posible.',
    feature: 'Puedes tomar',
    featureBold: '- 15 días',
    route: '/vender-urgente',
  },
  {
    id: 'cambiar',
    pillEstado: 'cambio',
    title: 'Necesito vender para comprar.',
    feature: 'Puedes tomar',
    featureBold: '- 3 meses',
    route: '',
  },
  {
    id: 'legal',
    pillEstado: 'legal',
    title: 'Necesito solucionar asuntos legales.',
    feature: 'Depende el caso',
    featureBold: '(Divorcio, sucesión, litigio u otro)',
    route: '',
  },
]

export function SectionFeatures1() {
  const navigate = useNavigate()
  const headerRef = useReveal<HTMLDivElement>()
  const boxRef = useReveal<HTMLDivElement>('center')
  const { containerRef, progress } = useScrollRevealText()

  const headerParallaxRef = useParallax<HTMLDivElement>(-40)
  const boxParallaxRef = useParallax<HTMLDivElement>(60)

  const revealedCount = Math.floor(progress * ALL_WORDS.length)

  return (
    <section className="features1" data-node-id="232:30594">
      <div className="features1__container">
        <div ref={(el) => {
          (headerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          (containerRef as React.MutableRefObject<HTMLElement | null>).current = el;
          (headerParallaxRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }} className="features1__header reveal">
          <span className="features1__pill">✦ Tu momento de venta ✦</span>
          <h2 className="features1__title">
            {ALL_WORDS.map((word, i) => {
              const isAccent = ACCENT_WORDS.includes(word)
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
          <p className="features1__subtitle">
            Dependiendo de lo que necesites, te podemos guiar mejor. 👇
          </p>
        </div>

        <div ref={(el) => {
          (boxParallaxRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }} className="features1__box-area">
          <div
            ref={boxRef}
            className="features1__box reveal-slide"
          >
            <div className="features1__box-inner">
              {/* Left: Vender sin afán card */}
              <article className="features1__left-card">
                <img
                  src={CARD_BG_IMAGE}
                  alt=""
                  className="features1__left-card-bg"
                  loading="lazy"
                  decoding="async"
                />
                <div className="features1__left-card-gradient" />
                <div className="features1__left-card-content">
                  <Pill estado="sin-afan" mode="light" />
                  <div className="features1__left-text">
                    <h3 className="features1__left-title">
                      Quiero vender bien, por mi cuenta y sin afán.
                    </h3>
                    <p className="features1__left-desc">
                      No tengo afán, puedo darme el lujo de esperar y vender al mejor precio, pero quisiera herramientas que me ayuden a hacerlo bien.
                    </p>
                    <p className="features1__left-feature">
                      <CheckGreen />
                      <span>Puedes tomar <strong>9 meses aprox</strong></span>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="features1__left-cta"
                    onClick={() => navigate('/vender-sin-afan')}
                  >
                    <span className="features1__left-cta-label">ESTE SOY YO</span>
                    <span className="features1__left-cta-arrow">
                      <img src={ARROW_ICON} alt="" width={24} height={24} />
                    </span>
                  </button>
                </div>
              </article>

              {/* Right: 3 compact cards */}
              <div className="features1__right-col">
                {RIGHT_CARDS.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    className="features1__right-card"
                    onClick={() => card.route && navigate(card.route)}
                  >
                    <div className="features1__right-card-text">
                      <Pill estado={card.pillEstado} mode="dark" />
                      <h4 className="features1__right-title">{card.title}</h4>
                      <p className="features1__right-feature">
                        <CheckWhite />
                        <span>
                          {card.feature}{' '}
                          <strong>{card.featureBold}</strong>
                        </span>
                      </p>
                    </div>
                    <span className="features1__right-arrow">
                      <img src={ARROW_ICON} alt="" width={24} height={24} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
