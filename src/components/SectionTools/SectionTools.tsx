import { useReveal } from '../../hooks/useReveal'
import { useParallax } from '../../hooks/useParallax'
import './SectionTools.css'

const ARROW_ICON = '/assets/cd835b98a354fa50c5f884471dfaf5e5ee7b6920.svg'
const ICON_HOUSE_QUESTION = '/assets/icon-house-question.svg'
const ICON_DOCUMENT = '/assets/icon-document.svg'
const ICON_SACK_DOLLAR = '/assets/icon-sack-dollar.svg'

const TOOLS = [
  {
    id: 'habimetro',
    icon: ICON_HOUSE_QUESTION,
    title: 'Consulta cuánto vale mi casa.',
    description: 'Habímetro te calcula un precio de venta según el mercado. Muchos vendedores piden demasiado y su casa se queda meses sin vender. Otros piden muy poco y dejan dinero sobre la mesa.',
    ctaLabel: 'Consultar el precio de mi casa.',
    ctaHref: '#habi-habimetro',
  },
  {
    id: 'ficha',
    icon: ICON_DOCUMENT,
    title: 'Crear la ficha de mi casa.',
    description: 'La ficha es una ayuda-ventas en formato PDF elegante que puedes crear con los datos y las fotos de tu propiedad para compartir con los interesados que te contacten.',
    ctaLabel: 'Crear la ficha de mi casa.',
    ctaHref: '#crear-ficha',
  },
  {
    id: 'oferta',
    icon: ICON_SACK_DOLLAR,
    title: 'Solicita una oferta rápida por tu casa.',
    description: 'Si no quieres perder más tiempo esperando compradores que no están seguros de comprar, habi te hace una oferta de compra inmediata.',
    ctaLabel: 'Quiero una oferta ahora.',
    ctaHref: '#habi-oferta',
  },
]

const DecoIcon = () => (
  <svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="3" cy="11" r="3" fill="#A855F7"/>
    <circle cx="10" cy="15" r="3" fill="#7E22CE"/>
    <circle cx="31" cy="11" r="3" fill="#A855F7"/>
    <circle cx="24" cy="15" r="3" fill="#7E22CE"/>
    <circle cx="17" cy="19" r="3" fill="#430070"/>
    <circle cx="17" cy="3" r="3" fill="#A855F7"/>
    <circle cx="17" cy="11" r="3" fill="#7E22CE"/>
    <circle cx="17" cy="27" r="3" fill="#7E22CE"/>
    <circle cx="17" cy="35" r="3" fill="#A855F7"/>
    <circle cx="10" cy="23" r="3" fill="#7E22CE"/>
    <circle cx="3" cy="27" r="3" fill="#A855F7"/>
    <circle cx="24" cy="23" r="3" fill="#7E22CE"/>
    <circle cx="31" cy="27" r="3" fill="#A855F7"/>
  </svg>
)

function mergeRefs<T>(...refs: React.Ref<T>[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

export function SectionTools() {
  const headerRevealRef = useReveal<HTMLDivElement>()
  const headerParallaxRef = useParallax<HTMLDivElement>(-40)
  const cardsWrapperRef = useParallax<HTMLDivElement>(55)
  const cardsRef = useReveal<HTMLDivElement>()

  return (
    <section className="tools">
      <div ref={mergeRefs(headerRevealRef, headerParallaxRef)} className="tools__header reveal">
        <DecoIcon />
        <p className="tools__sub">Vender por tu cuenta no significa que estés solo.</p>
        <h2 className="tools__title">
          <span>Herramientas</span> que te ayudan a{' '}
          <em>vender mejor.</em>
        </h2>
      </div>
      <div ref={cardsWrapperRef} className="tools__cards-wrapper">
        <div ref={cardsRef} className="tools__cards reveal">
          {TOOLS.map((tool) => (
            <article key={tool.id} className="tools__card">
              <div className="tools__card-icon">
                <img src={tool.icon} alt="" width={24} height={24} />
              </div>
              <div className="tools__card-body">
                <h3 className="tools__card-title">{tool.title}</h3>
                <p className="tools__card-desc">{tool.description}</p>
              </div>
              <a href={tool.ctaHref} className="tools__card-cta">
                <span className="tools__card-cta-label">{tool.ctaLabel}</span>
                <span className="tools__card-cta-arrow">
                  <img src={ARROW_ICON} alt="" width={24} height={24} />
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
