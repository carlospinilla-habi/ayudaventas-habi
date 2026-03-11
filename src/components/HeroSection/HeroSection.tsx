import { useParallax } from '../../hooks/useParallax'
import './HeroSection.css'

const HERO_IMAGE = '/assets/hero-bg-opt.webp'

export function HeroSection() {
  const bgRef = useParallax<HTMLDivElement>(40)
  const contentRef = useParallax<HTMLDivElement>(-20)

  return (
    <section
      className="hero"
      data-node-id="232:30580"
      aria-label="¿Listo para vender tu casa?"
    >
      <div className="hero__main">
        <div className="hero__bg" data-node-id="232:30584">
          <div className="hero__bg-image">
            <div ref={bgRef} className="hero__bg-img-inner">
              <img src={HERO_IMAGE} alt="" loading="eager" decoding="async" />
            </div>
          </div>
          <div className="hero__bg-overlay" />
        </div>

        <div ref={contentRef} className="hero__content" data-node-id="232:30589">
          <p
            className="hero__pill hero-enter hero-enter--d1"
            data-node-id="232:30590"
          >
            La forma mas facil de vender
          </p>
          <div className="hero__header" data-node-id="232:30591">
            <h1 className="hero__title" data-node-id="232:30592">
              <span className="hero__title-mask">
                <span className="hero__title-line hero__title-line--1">¿Listo para vender</span>
              </span>
              <span className="hero__title-mask">
                <span className="hero__title-line hero__title-line--2">tu casa?</span>
              </span>
            </h1>
            <p
              className="hero__subtitle hero-subtitle-enter"
              data-node-id="232:30593"
            >
              Hacerlo es mucho más fácil con la guia de la experiencia a tu lado.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
