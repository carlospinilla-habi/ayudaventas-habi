import { useNavigate } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal'
import { useParallax } from '../../hooks/useParallax'
import { useScrollRevealText } from '../../hooks/useScrollRevealText'
import { Pill } from '../Pill/Pill'
import type { PillEstado } from '../Pill/Pill'
import { saveUserInterest } from '../../lib/storage-sync'
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
const ALL_WORDS = 'Primero lo primero, ¿cómo quieres vender tu casa?'.split(' ')

const WHATSAPP_ASESOR = 'https://wa.link/97x21j'

interface RightCard {
  id: string
  pillEstado: PillEstado
  title: string
  featureText: string
  route?: string
  isLegal?: boolean
}

const RIGHT_CARDS: RightCard[] = [
  {
    id: 'urgente',
    pillEstado: 'urgente',
    title: 'Necesito vender lo antes posible.',
    featureText: 'Tiempo estimado: 10 días.',
    route: '/vender-urgente',
  },
  {
    id: 'cambiar',
    pillEstado: 'cambio',
    title: 'Necesito vender para comprar.',
    featureText: 'Tiempo estimado: 3 meses.',
    route: '/cambiar-de-casa',
  },
  {
    id: 'legal',
    pillEstado: 'legal',
    title: 'Necesito solucionar asuntos legales.',
    featureText: 'El tiempo depende del caso (divorcio, sucesión, litigio u otro).',
    isLegal: true,
  },
]

export function SectionFeatures1() {
  const navigate = useNavigate()
  const headerRef = useReveal<HTMLDivElement>()
  const boxRef = useReveal<HTMLDivElement>('center')
  const { containerRef, progress } = useScrollRevealText()

  const headerParallaxRef = useParallax<HTMLDivElement>(-60)
  const boxParallaxRef = useParallax<HTMLDivElement>(80)

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
            Selecciona el motivo de venta que mejor te identifique 👇
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
                      Quiero vender por mi cuenta y a buen precio.
                    </h3>
                    <p className="features1__left-desc">
                      No tengo prisa, puedo darme el lujo de esperar y vender al mejor precio, pero quisiera herramientas que me ayuden a hacerlo bien.
                    </p>
                    <p className="features1__left-feature">
                      <CheckGreen />
                      <span>Tiempo estimado: 9 meses.</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="features1__left-cta"
                    onClick={() => { saveUserInterest('sin-afan'); navigate('/vender-sin-afan') }}
                  >
                    <span className="features1__left-cta-label">ESTE SOY YO.</span>
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
                    className={`features1__right-card${card.isLegal ? ' features1__right-card--legal' : ''}`}
                    onClick={() => { if (card.route) { saveUserInterest(card.id); navigate(card.route) } }}
                  >
                    <div className="features1__right-card-text">
                      <Pill estado={card.pillEstado} mode="dark" />
                      <h4 className="features1__right-title">{card.title}</h4>
                      <p className="features1__right-feature">
                        <CheckWhite />
                        <span>{card.featureText}</span>
                      </p>
                      {card.isLegal && (
                        <a
                          href={WHATSAPP_ASESOR}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="features1__right-asesor-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Hablar con un asesor
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.0312 3.40625C15.1562 1.51562 12.6562 0.46875 10 0.46875C4.53125 0.46875 0.078125 4.92188 0.078125 10.3906C0.078125 12.1406 0.53125 13.8438 1.39062 15.3438L0 20.4688L5.25 19.1094C6.69531 19.8906 8.32812 20.3125 10 20.3125C15.4688 20.3125 19.9219 15.8594 19.9219 10.3906C19.9219 7.75 18.9062 5.29688 17.0312 3.40625Z" fill="white"/>
                          </svg>
                        </a>
                      )}
                    </div>
                    {!card.isLegal && (
                      <span className="features1__right-arrow">
                        <img src={ARROW_ICON} alt="" width={24} height={24} />
                      </span>
                    )}
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
