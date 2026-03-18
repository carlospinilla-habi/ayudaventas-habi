import { useReveal } from '../../hooks/useReveal'
import { useParallax } from '../../hooks/useParallax'
import './SectionTools.css'

const ARROW_ICON = '/assets/cd835b98a354fa50c5f884471dfaf5e5ee7b6920.svg'

function HouseQuestionIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M13.0515 0.93C12.4436 0.775 11.8066 0.775 11.1988 0.93C10.508 1.106 9.89381 1.549 9.00352 2.19L4.2532 5.61C3.36888 6.247 2.79935 6.657 2.38063 7.193C2.01059 7.667 1.73395 8.207 1.56541 8.785C1.37471 9.438 1.37486 10.14 1.37508 11.229L1.3751 15.999C1.37509 16.952 1.37509 17.712 1.42527 18.327C1.47675 18.957 1.58473 19.499 1.83832 19.996C2.24578 20.796 2.89595 21.446 3.69564 21.853C4.19334 22.107 4.73522 22.215 5.36523 22.267C5.97948 22.317 6.74 22.317 7.69241 22.317H16.5578C17.5102 22.317 18.2708 22.317 18.885 22.267C19.515 22.215 20.0569 22.107 20.5546 21.853C21.3543 21.446 22.0044 20.796 22.4119 19.996C22.6655 19.499 22.7735 18.957 22.825 18.327C22.8751 17.712 22.8751 16.952 22.875 16L22.875 11.229C22.8754 10.14 22.8755 9.438 22.6848 8.785C22.5163 8.207 22.2396 7.667 21.8696 7.193C21.4509 6.657 20.8814 6.247 19.997 5.61L15.2467 2.19C14.3564 1.549 13.7422 1.106 13.0515 0.93Z" fill="#9333ea"/>
      <path d="M10.875 10.317C10.875 9.489 11.5465 8.817 12.375 8.817C13.2035 8.817 13.875 9.489 13.875 10.317C13.875 10.736 13.7045 11.113 13.4273 11.386C13.2786 11.532 13.1423 11.609 12.9336 11.727C12.8883 11.753 12.8395 11.78 12.7866 11.811C12.495 11.979 12.1258 12.221 11.8625 12.714C11.6674 13.079 11.8054 13.534 12.1708 13.729C12.5361 13.924 12.9905 13.786 13.1857 13.42C13.2513 13.298 13.3289 13.23 13.536 13.11C13.5647 13.094 13.5973 13.076 13.633 13.056C13.8475 12.937 14.1757 12.754 14.4797 12.455C15.0315 11.912 15.375 11.154 15.375 10.317C15.375 8.66 14.0319 7.317 12.375 7.317C10.7181 7.317 9.375 8.66 9.375 10.317C9.375 10.503 9.3956 10.673 9.4227 10.816C9.4996 11.223 9.8919 11.49 10.2989 11.414C10.7059 11.337 10.9735 10.944 10.8966 10.537C10.8836 10.469 10.875 10.394 10.875 10.317Z" fill="#9333ea"/>
      <path d="M12.375 14.567C11.8227 14.567 11.375 15.015 11.375 15.567C11.375 16.12 11.8227 16.567 12.375 16.567C12.9273 16.567 13.3751 16.12 13.3751 15.567C13.3751 15.015 12.9273 14.567 12.375 14.567Z" fill="#9333ea"/>
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M5.969 1.25H13.531C14.205 1.25 14.756 1.25 15.203 1.286C15.666 1.324 16.085 1.405 16.476 1.604C17.087 1.916 17.584 2.413 17.896 3.024C18.095 3.415 18.176 3.834 18.213 4.297C18.25 4.744 18.25 5.295 18.25 5.968V20.5C18.25 21.735 19.245 22.737 20.476 22.75H7.567C6.615 22.75 5.854 22.75 5.24 22.7C4.61 22.648 4.068 22.54 3.571 22.287C2.771 21.879 2.121 21.229 1.713 20.429C1.46 19.932 1.352 19.39 1.3 18.76C1.25 18.145 1.25 17.385 1.25 16.432V5.969C1.25 5.295 1.25 4.744 1.287 4.297C1.324 3.834 1.405 3.415 1.604 3.025C1.916 2.413 2.413 1.916 3.025 1.604C3.415 1.405 3.834 1.324 4.297 1.287C4.744 1.25 5.295 1.25 5.969 1.25Z" fill="#9333ea"/>
      <path d="M5.25 7.5C5.25 7.086 5.586 6.75 6 6.75H14.5C14.914 6.75 15.25 7.086 15.25 7.5C15.25 7.914 14.914 8.25 14.5 8.25H6C5.586 8.25 5.25 7.914 5.25 7.5Z" fill="#9333ea"/>
      <path d="M5.25 11.5C5.25 11.086 5.586 10.75 6 10.75H14.5C14.914 10.75 15.25 11.086 15.25 11.5C15.25 11.914 14.914 12.25 14.5 12.25H6C5.586 12.25 5.25 11.914 5.25 11.5Z" fill="#9333ea"/>
      <path d="M5.25 15.5C5.25 15.086 5.586 14.75 6 14.75H11C11.414 14.75 11.75 15.086 11.75 15.5C11.75 15.914 11.414 16.25 11 16.25H6C5.586 16.25 5.25 15.914 5.25 15.5Z" fill="#9333ea"/>
      <path d="M23.75 12.5C23.75 12.086 23.414 11.75 23 11.75H19.25V20C19.25 21.243 20.257 22.25 21.5 22.25C22.743 22.25 23.75 21.243 23.75 20V12.5Z" fill="#9333ea"/>
    </svg>
  )
}

function SackDollarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.4" d="M8.907 3.25H15.093C15.111 3.259 15.128 3.269 15.146 3.278C19.211 5.446 21.75 9.678 21.75 14.285V15.25C21.75 17.874 19.623 20 17 20H7C4.377 20 2.25 17.874 2.25 15.25V14.285C2.25 9.678 4.789 5.446 8.854 3.278C8.872 3.269 8.889 3.259 8.907 3.25Z" fill="#9333ea"/>
      <path d="M9.819 1.25C8.654 1.25 7.896 2.476 8.417 3.518C8.952 4.588 9.808 5.453 10.854 6H17.14C18.186 5.453 19.042 4.588 19.576 3.518C20.097 2.476 19.339 1.25 18.174 1.25H9.819Z" fill="#9333ea"/>
      <path d="M14.747 10.812C14.923 10.846 15.097 10.895 15.273 10.965C15.671 11.123 16.038 11.369 16.45 11.681C16.78 11.931 16.845 12.401 16.595 12.732C16.345 13.062 15.874 13.127 15.544 12.877C15.156 12.583 14.922 12.439 14.72 12.359C14.536 12.286 14.337 12.25 13.997 12.25C13.503 12.25 13.173 12.367 12.987 12.501C12.823 12.62 12.747 12.764 12.747 12.965C12.747 13.202 12.838 13.331 13.063 13.457C13.336 13.61 13.715 13.693 14.12 13.76C14.515 13.826 15.136 13.938 15.663 14.234C16.238 14.555 16.747 15.126 16.747 16.035C16.747 16.736 16.423 17.325 15.887 17.713C15.559 17.95 15.169 18.103 14.747 18.183V18.5C14.747 18.914 14.411 19.25 13.997 19.25C13.583 19.25 13.247 18.914 13.247 18.5V18.188C13.07 18.154 12.897 18.105 12.72 18.035C12.322 17.877 11.956 17.631 11.544 17.319C11.214 17.069 11.149 16.599 11.399 16.268C11.649 15.938 12.119 15.873 12.45 16.123C12.838 16.417 13.072 16.561 13.273 16.641C13.458 16.714 13.656 16.75 13.997 16.75C14.49 16.75 14.821 16.633 15.007 16.499C15.17 16.38 15.247 16.236 15.247 16.035C15.247 15.798 15.156 15.669 14.93 15.542C14.658 15.39 14.278 15.307 13.874 15.24C13.478 15.174 12.858 15.061 12.33 14.766C11.756 14.445 11.247 13.874 11.247 12.965C11.247 12.264 11.57 11.675 12.107 11.287C12.434 11.05 12.824 10.897 13.247 10.817V10.5C13.247 10.086 13.583 9.75 13.997 9.75C14.411 9.75 14.747 10.086 14.747 10.5V10.812Z" fill="#9333ea"/>
    </svg>
  )
}

const TOOLS = [
  {
    id: 'habimetro',
    icon: <HouseQuestionIcon />,
    title: 'Consulta cuánto vale mi casa.',
    description: 'Habímetro te calcula un precio de venta según el mercado. Muchos vendedores piden demasiado y su casa se queda meses sin vender. Otros piden muy poco y dejan dinero sobre la mesa.',
    ctaLabel: 'Consultar el precio de mi casa.',
    ctaHref: '#habi-habimetro',
  },
  {
    id: 'ficha',
    icon: <DocumentIcon />,
    title: 'Crear la ficha de mi casa.',
    description: 'La ficha es una ayuda-ventas en formato PDF elegante que puedes crear con los datos y las fotos de tu propiedad para compartir con los interesados que te contacten.',
    ctaLabel: 'Crear la ficha de mi casa.',
    ctaHref: '#crear-ficha',
  },
  {
    id: 'oferta',
    icon: <SackDollarIcon />,
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
              <div className="tools__card-icon">{tool.icon}</div>
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
