import { useReveal } from '../../hooks/useReveal'
import { useParallax } from '../../hooks/useParallax'
import './SectionHabimetro.css'

const BG_IMAGE = '/assets/18c4346dc08fdfe0822c370548573738b5eaa50a.png'
const SCREEN_IMG = '/assets/e96a1e3b2a7cbc0f5c9c623918f00a7894799c11.png'
const ARROW_ICON = '/assets/cd835b98a354fa50c5f884471dfaf5e5ee7b6920.svg'

export function SectionHabimetro() {
  const innerRef = useReveal<HTMLDivElement>()
  const contentRef = useParallax<HTMLDivElement>(-8)
  const deviceRef = useParallax<HTMLDivElement>(8)

  return (
    <section className="habimetro" data-node-id="243:34252">
      <div ref={innerRef} className="habimetro__inner reveal reveal--up-lg">
        <img src={BG_IMAGE} alt="" className="habimetro__bg-img" loading="lazy" decoding="async" />

        <div ref={contentRef} className="habimetro__content">
          <span className="habimetro__pill">✦ Valor comercial de mi casa ✦</span>
          <div className="habimetro__text">
            <h2 className="habimetro__title">
              Consulta el valor de tu propiedad en el mercado con Habimetro.
            </h2>
            <p className="habimetro__desc">
              Con un valor de venta estimado más claro, puedes negociar mejor.
            </p>
          </div>
          <a href="#habi-habimetro" className="habimetro__btn">
            <span className="habimetro__btn-text">Consultar el valor de mi casa.</span>
            <span className="habimetro__btn-circle">
              <img src={ARROW_ICON} alt="" className="habimetro__btn-arrow" />
            </span>
          </a>
        </div>

        <div className="habimetro__device" data-node-id="250:14679">
          <div ref={deviceRef} className="habimetro__laptop">
            <div className="habimetro__screen">
              <img src={SCREEN_IMG} alt="Habímetro" className="habimetro__screen-img" loading="lazy" decoding="async" />
            </div>
            <div className="habimetro__base">
              <div className="habimetro__base-notch" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
