import './CambioSteps.css'

const ARROW_ICON = '/assets/cd835b98a354fa50c5f884471dfaf5e5ee7b6920.svg'
const ICON_COIN_DOLLAR = '/assets/icon-coin-dollar.svg'
const ICON_LOCK_KEYHOLE = '/assets/icon-lock-keyhole.svg'
const ICON_MEMO_SEARCH = '/assets/icon-memo-search.svg'

const STEPS_DATA = [
  {
    number: '1',
    pill: 'Empiezas tú · 5 minutos',
    title: (
      <>
        Completa el formulario con los datos de tu hogar -{' '}
        <a href="#inmo-form" className="cambio-steps__link">Llenar formulario</a>
      </>
    ),
    description: 'Cuéntanos lo básico: ubicación, tamaño, estado general y cuánto necesitas. Con eso podemos empezar a trabajar para ti.',
    footnote: 'Sin costo • Sin compromisos • 100% en línea',
  },
  {
    number: '2',
    pill: 'Nosotros te llamamos · 24-48 horas',
    title: 'Te contacta alguien de Habi para agendar una visita',
    description: 'Un asesor experto se comunica contigo, resuelve tus dudas y coordina una visita técnica al inmueble. Sin presiones ni letra pequeña.',
    footnote: 'Respuesta en 24-48 horas hábiles',
  },
  {
    number: '3',
    pill: 'Analizamos el inmueble · 3-5 días',
    title: 'Acordamos un contrato con reglas de precio y comisión',
    description: 'Después de la visita, nuestro equipo analiza el inmueble y te presenta una oferta real y transparente. Tú decides si aceptas o no, sin ningún tipo de presión.',
    footnote: 'Oferta escrita y detallada • Puedes rechazarla sin costo',
  },
  {
    number: '4',
    pill: 'Cerrar el negocio · aproximadamente 3 meses',
    title: 'Te informamos de cada oferta recibida y tú aceptas.',
    description: 'Nosotros traemos a los interesados y tú recibes visitas. Negociamos con los interesados para lograr la mejor oferta posible, te las informamos y tú aceptas.',
    footnote: 'Buscamos compradores • Recibes 3 veces más ofertas',
  },
  {
    number: '5',
    pill: 'Pago · aproximadamente 4 meses desde el inicio',
    title: 'Cuando vendemos, descontamos la comisión y tú recibes el dinero.',
    description: 'Si aceptas la propuesta, gestionamos todos los trámites notariales, los documentos y el pago con el comprador. Tú solo firmas y el dinero llega a tu cuenta.',
    footnote: 'Trámites incluidos • Pago directo a tu cuenta',
    isLast: true,
  },
]

const BENEFITS = [
  {
    icon: ICON_COIN_DOLLAR,
    title: 'Oferta garantizada',
    desc: 'Si llegamos a una visita, tendrás una oferta.',
  },
  {
    icon: ICON_LOCK_KEYHOLE,
    title: 'Tu información está segura.',
    desc: 'Tu información nunca se comparte con terceros.',
  },
  {
    icon: ICON_MEMO_SEARCH,
    title: 'Sin letra pequeña.',
    desc: 'Todo claro, todo transparente, siempre.',
  },
]

export function CambioSteps() {
  return (
    <section className="cambio-steps">
      <div className="cambio-steps__header">
        <p className="cambio-steps__header-label">Tu inmueble llega a los interesados mas rápido</p>
        <h2 className="cambio-steps__header-title">
          Más de <em>2500 agentes</em> inmobiliarios venden tu casa
        </h2>
        <p className="cambio-steps__header-subtitle">
          Sin intermediarios, sin incertidumbre, sin dolores de cabeza. Nosotros nos encargamos de todo para que tú solo tengas que decir que sí.
        </p>
      </div>

      <div className="cambio-steps__list-section">
        <h3 className="cambio-steps__list-title">Los agentes inmobiliarios de Habi te ayudan a vender así de simple.:</h3>

        <div className="cambio-steps__list">
          {STEPS_DATA.map((step) => (
            <div
              key={step.number}
              className={`cambio-steps__item ${step.isLast ? 'cambio-steps__item--last' : ''}`}
            >
              <span className="cambio-steps__item-num">{step.number}</span>
              <div className="cambio-steps__item-details">
                <span className="cambio-steps__item-pill">{step.pill}</span>
                <h4 className="cambio-steps__item-title">{step.title}</h4>
              </div>
              <div className="cambio-steps__item-desc-wrap">
                <p className="cambio-steps__item-desc">{step.description}</p>
                <p className="cambio-steps__item-footnote">{step.footnote}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="cambio-steps__summary">
          <div className="cambio-steps__summary-inner">
            <div className="cambio-steps__summary-header">
              <h4 className="cambio-steps__summary-title">
                <span className="cambio-steps__summary-accent">¡Listo! Tu casa vendida</span>{' '}
                en 3 meses aprox
              </h4>
              <div className="cambio-steps__summary-right">
                <p className="cambio-steps__summary-desc">
                  Miles de agentes inmobiliarios buscan un buen comprador para ti.
                </p>
                <a href="#inmo-form" className="cambio-steps__cta">
                  <span className="cambio-steps__cta-label">Quiero el servicio inmobiliario</span>
                  <span className="cambio-steps__cta-icon-wrap">
                    <img src={ARROW_ICON} alt="" width={24} height={24} />
                  </span>
                </a>
              </div>
            </div>
            <div className="cambio-steps__summary-footer">
              <span className="cambio-steps__summary-label">TRANQUILIDAD</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="#505e71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="cambio-steps__benefits">
          {BENEFITS.map((b) => (
            <div key={b.title} className="cambio-steps__benefit-card">
              <div className="cambio-steps__benefit-icon">
                <img src={b.icon} alt="" width={24} height={24} />
              </div>
              <div className="cambio-steps__benefit-text">
                <h5 className="cambio-steps__benefit-title">{b.title}</h5>
                <p className="cambio-steps__benefit-desc">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
