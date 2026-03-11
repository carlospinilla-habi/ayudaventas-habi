import { useReveal } from '../../hooks/useReveal'
import { useParallax } from '../../hooks/useParallax'
import './SectionFicha.css'

const GRID_IMAGES = [
  '/assets/ficha-1.jpg',
  '/assets/ficha-2.jpg',
  '/assets/ficha-3.jpg',
  '/assets/ficha-4.jpg',
]
const ARROW_ICON = '/assets/cd835b98a354fa50c5f884471dfaf5e5ee7b6920.svg'

export function SectionFicha() {
  const innerRef = useReveal<HTMLDivElement>()
  const gridRef = useReveal<HTMLDivElement>()
  const colLeftRef = useParallax<HTMLDivElement>(40)
  const colRightRef = useParallax<HTMLDivElement>(-40)

  return (
    <section className="ficha" data-node-id="232:30758">
      <div ref={innerRef} className="ficha__inner reveal">
        <div className="ficha__content">
          <div className="ficha__text">
            <h2 className="ficha__title">
              Crea la ficha ayudaventas de tu casa y compartela en redes
            </h2>
            <p className="ficha__desc">
              Los interesados compradores revisan varias propiedades. Esta ficha te ayuda a que siempre tengan a la mano tu información.
            </p>
          </div>
          <a href="#crear" className="ficha__btn">
            <span className="ficha__btn-text">Crear el ayudaventas</span>
            <span className="ficha__btn-circle">
              <img src={ARROW_ICON} alt="" className="ficha__btn-arrow" />
            </span>
          </a>
        </div>
        <div ref={gridRef} className="ficha__grid ficha-stagger">
          <div ref={colLeftRef} className="ficha__grid-col ficha__grid-col--left">
            {GRID_IMAGES.slice(0, 2).map((src, i) => (
              <div
                key={i}
                className={`ficha__grid-item ficha__grid-item--s${i + 1} ${i === 0 ? 'ficha__grid-item--bordered' : ''}`}
              >
                <img src={src} alt="" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
          <div ref={colRightRef} className="ficha__grid-col ficha__grid-col--right">
            {GRID_IMAGES.slice(2, 4).map((src, i) => (
              <div
                key={i + 2}
                className={`ficha__grid-item ficha__grid-item--s${i + 3}`}
              >
                <img src={src} alt="" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
