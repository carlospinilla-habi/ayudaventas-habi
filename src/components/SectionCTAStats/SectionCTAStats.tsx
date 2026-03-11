import { useEffect, useRef, useState, useCallback } from 'react'
import { useReveal } from '../../hooks/useReveal'
import { useParallax } from '../../hooks/useParallax'
import './SectionCTAStats.css'

const BG_IMAGE = '/assets/cta-stats-bg.jpg'
const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

function NumberTicker({ value, delay = 0 }: { value: string; delay?: number }) {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const activate = useCallback(() => {
    if (delay > 0) {
      setTimeout(() => setActive(true), delay)
    } else {
      setActive(true)
    }
  }, [delay])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          activate()
          io.disconnect()
        }
      },
      { rootMargin: '-10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [activate])

  const chars = value.split('')
  let digitIndex = 0

  return (
    <span ref={ref} className="ticker" aria-label={value}>
      {chars.map((char, i) => {
        const isDigit = /\d/.test(char)
        if (isDigit) {
          const idx = digitIndex++
          const targetNum = parseInt(char, 10)
          const spinDuration = 1.2 + idx * 0.15
          const charDelay = idx * 0.08

          return (
            <span key={i} className="ticker__col" style={{ height: '1em' }}>
              <span
                className={`ticker__reel ${active ? 'ticker__reel--active' : ''}`}
                style={{
                  transform: active ? `translateY(-${targetNum * 10}%)` : 'translateY(0)',
                  transitionDuration: `${spinDuration}s`,
                  transitionDelay: `${charDelay}s`,
                }}
              >
                {DIGITS.map((d) => (
                  <span key={d} className="ticker__digit">{d}</span>
                ))}
              </span>
            </span>
          )
        }
        return (
          <span
            key={i}
            className={`ticker__char ${active ? 'ticker__char--visible' : ''}`}
            style={{ transitionDelay: `${0.8 + i * 0.05}s` }}
          >
            {char}
          </span>
        )
      })}
    </span>
  )
}

function CityIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(1.67, 1.67)">
        <path opacity="0.4" d="M11 0C8.60677 0 6.66667 1.9401 6.66667 4.33333V5.33333H4.33333C1.9401 5.33333 0 7.27343 0 9.66667V27.6667C0 28.2189 0.447715 28.6667 1 28.6667H21C21.5523 28.6667 22 28.2189 22 27.6667V4.33333C22 1.9401 20.0599 0 17.6667 0H11Z" fill="white"/>
      </g>
      <g transform="translate(0.33, 7.67)">
        <path d="M18 1C18 1.55228 17.5523 2 17 2H14.3333C13.781 2 13.3333 1.55228 13.3333 1C13.3333 0.447715 13.781 0 14.3333 0H17C17.5523 0 18 0.447715 18 1Z" fill="white"/>
        <path d="M23.3333 2H25.6667C28.0599 2 30 3.9401 30 6.33333V20.6667H30.3333C30.8856 20.6667 31.3333 21.1144 31.3333 21.6667C31.3333 22.2189 30.8856 22.6667 30.3333 22.6667H1C0.447716 22.6667 0 22.2189 0 21.6667C0 21.1144 0.447716 20.6667 1 20.6667H23.3333V2Z" fill="white"/>
        <path d="M18 5C18 5.55228 17.5523 6 17 6H14.3333C13.781 6 13.3333 5.55228 13.3333 5C13.3333 4.44771 13.781 4 14.3333 4H17C17.5523 4 18 4.44771 18 5Z" fill="white"/>
        <path d="M17 14C17.5523 14 18 13.5523 18 13C18 12.4477 17.5523 12 17 12H14.3333C13.781 12 13.3333 12.4477 13.3333 13C13.3333 13.5523 13.781 14 14.3333 14H17Z" fill="white"/>
        <path d="M17 10C17.5523 10 18 9.55228 18 9C18 8.44771 17.5523 8 17 8H14.3333C13.781 8 13.3333 8.44771 13.3333 9C13.3333 9.55228 13.781 10 14.3333 10H17Z" fill="white"/>
        <path d="M18 17C18 17.5523 17.5523 18 17 18H14.3333C13.781 18 13.3333 17.5523 13.3333 17C13.3333 16.4477 13.781 16 14.3333 16H17C17.5523 16 18 16.4477 18 17Z" fill="white"/>
        <path d="M6 11.6667C6 12.219 6.44772 12.6667 7 12.6667C7.55229 12.6667 8 12.219 8 11.6667V10.3333C8 9.78105 7.55229 9.33333 7 9.33333C6.44772 9.33333 6 9.78105 6 10.3333V11.6667Z" fill="white"/>
        <path d="M7 7.33333C6.44772 7.33333 6 6.88562 6 6.33333V5C6 4.44771 6.44772 4 7 4C7.55229 4 8 4.44771 8 5V6.33333C8 6.88562 7.55229 7.33333 7 7.33333Z" fill="white"/>
        <path d="M6 17C6 17.5523 6.44772 18 7 18C7.55229 18 8 17.5523 8 17V15.6667C8 15.1144 7.55229 14.6667 7 14.6667C6.44772 14.6667 6 15.1144 6 15.6667V17Z" fill="white"/>
      </g>
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(1.67, 3.0)">
        <path opacity="0.4" d="M20.2435 0H8.42318C7.15326 0 6.13919 0 5.32018 0.0669C4.48016 0.1355 3.75765 0.2795 3.09405 0.6176C2.0278 1.1609 1.16091 2.0278 0.61763 3.094C0.27951 3.7576 0.13553 4.4802 0.0669 5.3202C0 6.1392 0 7.1533 0 8.4232V20.2435C0 21.5134 0 22.5275 0.0669 23.3465C0.13553 24.1865 0.27951 24.909 0.61763 25.5726C1.16091 26.6389 2.0278 27.5058 3.09405 28.049C3.75765 28.3872 4.48016 28.5311 5.32018 28.5998C6.13917 28.6667 7.1532 28.6667 8.42307 28.6667H20.2435C21.5134 28.6667 22.5275 28.6667 23.3465 28.5998C24.1865 28.5311 24.909 28.3872 25.5726 28.049C26.6389 27.5058 27.5058 26.6389 28.049 25.5726C28.3872 24.909 28.5311 24.1865 28.5998 23.3465C28.6667 22.5275 28.6667 21.5135 28.6667 20.2436V8.42316C28.6667 7.15329 28.6667 6.13917 28.5998 5.32018C28.5311 4.48016 28.3872 3.75765 28.049 3.094C27.5058 2.0278 26.6389 1.1609 25.5726 0.6176C24.909 0.2795 24.1865 0.1355 23.3465 0.0669C22.5275 0 21.5134 0 20.2435 0Z" fill="white"/>
      </g>
      <g transform="translate(1.67, 0.33)">
        <path d="M9 0C9.55229 0 10 0.4477 10 1V2.6667H18.6667V1C18.6667 0.4477 19.1144 0 19.6667 0C20.219 0 20.6667 0.4477 20.6667 1V2.6668C21.7414 2.6675 22.6205 2.6743 23.3465 2.7336C24.1865 2.8022 24.909 2.9462 25.5726 3.2843C26.6388 3.8276 27.5057 4.6945 28.049 5.7607C28.3871 6.4243 28.5311 7.1468 28.5997 7.9869C28.6612 8.7396 28.6662 9.6571 28.6666 10.7866V11H0.2133C0.1386 11 0.1013 11 0.0728 10.9855C0.0477 10.9727 0.0273 10.9523 0.0145 10.9272C0 10.8986 0 10.8613 0 10.7866C0.0004 9.6571 0.0054 8.7396 0.0669 7.9869C0.1355 7.1468 0.2795 6.4243 0.6176 5.7607C1.1609 4.6945 2.0278 3.8276 3.094 3.2843C3.7576 2.9462 4.4801 2.8022 5.3202 2.7336C6.0461 2.6743 6.9253 2.6675 8 2.6668V1C8 0.4477 8.4477 0 9 0Z" fill="white"/>
        <circle cx="8.333" cy="14.667" r="1.333" fill="white"/>
        <circle cx="14.333" cy="14.667" r="1.333" fill="white"/>
        <circle cx="20.333" cy="14.667" r="1.333" fill="white"/>
        <circle cx="8.333" cy="20" r="1.333" fill="white"/>
        <circle cx="14.333" cy="20" r="1.333" fill="white"/>
        <circle cx="20.333" cy="20" r="1.333" fill="white"/>
      </g>
    </svg>
  )
}

function UserHeartIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M4.67 19.67C2.83 20.72 -1.08 22.67 1.86 25.17C3.27 26.37 4.84 27.33 6.83 27.33H15.17C17.16 27.33 18.73 26.37 20.14 25.17C23.08 22.67 19.17 20.72 17.33 19.67C13.97 17.74 8.03 17.74 4.67 19.67Z" fill="white"/>
      <path d="M11 14.67C14.13 14.67 16.67 12.13 16.67 9C16.67 5.87 14.13 3.33 11 3.33C7.87 3.33 5.33 5.87 5.33 9C5.33 12.13 7.87 14.67 11 14.67Z" fill="white"/>
      <path d="M25.36 5.3C24.06 4.11 21.97 4.19 20.76 5.52L20.67 5.62L20.57 5.52C19.36 4.19 17.27 4.11 15.97 5.3C14.5 6.64 14.42 9.02 15.74 10.47L19.78 14.89C20.27 15.43 21.06 15.43 21.55 14.89L25.59 10.47C26.91 9.02 26.83 6.64 25.36 5.3Z" fill="white"/>
    </svg>
  )
}

const stats = [
  { value: '50', suffix: 'K+', label: 'Casas vendidas', icon: <CityIcon />, delay: 0 },
  { value: '15', prefix: '-', suffix: ' Días', label: 'Para venta urgente', icon: <CalendarIcon />, delay: 200 },
  { value: '98', suffix: '%', label: 'Clientes satisfechos', icon: <UserHeartIcon />, delay: 400 },
]

export function SectionCTAStats() {
  const innerRef = useReveal<HTMLDivElement>()
  const contentRef = useParallax<HTMLDivElement>(-15)

  return (
    <section className="cta-stats" data-node-id="232:30777">
      <img src={BG_IMAGE} alt="" className="cta-stats__bg-img" loading="lazy" decoding="async" />
      <div ref={innerRef} className="cta-stats__inner reveal">
        <div className="cta-stats__inner-content">
          <div ref={contentRef} className="cta-stats__content">
            <div className="cta-stats__text">
              <h2 className="cta-stats__title">
                A veces vender solo es más difícil de lo que parece
              </h2>
              <p className="cta-stats__desc">
                Nuestro equipo está listo para acompañarte. Cuéntanos tu situación y
                te decimos cómo podemos ayudarte.
              </p>
            </div>
            <div className="cta-stats__buttons">
              <a href="#oferta" className="cta-stats__btn cta-stats__btn--primary">
                Solicitar una oferta
              </a>
              <a href="#asesor" className="cta-stats__btn cta-stats__btn--secondary">
                Hablar con un asesor
              </a>
            </div>
          </div>
          <div className="cta-stats__numbers">
            {stats.map((stat) => (
              <div key={stat.label} className="cta-stats__stat">
                <div className="cta-stats__stat-icon">
                  {stat.icon}
                </div>
                <span className="cta-stats__stat-value">
                  {stat.prefix && <span className="ticker__static">{stat.prefix}</span>}
                  <NumberTicker value={stat.value} delay={stat.delay} />
                  {stat.suffix && <span className="ticker__static">{stat.suffix}</span>}
                </span>
                <span className="cta-stats__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
