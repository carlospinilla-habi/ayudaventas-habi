import './UrgSteps.css'

const ARROW_ICON = '/assets/cd835b98a354fa50c5f884471dfaf5e5ee7b6920.svg'

const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#070707" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="6" stroke="#070707" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="2" fill="#070707"/>
  </svg>
)

const RocketIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C12 2 5 7 5 14C5 16 6 18 6 18H18C18 18 19 16 19 14C19 7 12 2 12 2Z" stroke="#070707" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="2" fill="#070707"/>
    <path d="M5 18L3 22H21L19 18" stroke="#070707" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const STEPS_DATA = [
  {
    number: '1',
    pill: 'EMPIEZAS TÚ · 5 MIN',
    title: (
      <>
        Llena el formulario con los datos de tu casa –{' '}
        <span className="urg-steps__link">ver formulario</span>
      </>
    ),
    description: 'Cuéntanos lo básico: ubicación, tamaño, estado general y cuánto necesitas. Con eso ya podemos empezar a trabajar para ti.',
    footnote: 'Sin costo  •  Sin compromisos  •  100% en línea',
  },
  {
    number: '2',
    pill: 'NOSOTROS TE LLAMAMOS · 24-48 HRS',
    title: 'Te contacta alguien de Habi para agendar una visita',
    description: 'Un asesor experto se comunica contigo, resuelve tus dudas y coordina una visita técnica al inmueble. Sin presiones ni letra pequeña.',
    footnote: 'Respuesta en 24-48 hrs hábiles',
  },
  {
    number: '3',
    pill: 'ANALIZAMOS EL INMUEBLE · 3-5 DÍAS',
    title: 'Te hacemos una propuesta de compra',
    description: 'Después de la visita, nuestro equipo analiza el inmueble y te presenta una oferta real y transparente. Tú decides si aceptas o no, sin ningún tipo de presión.',
    footnote: 'Oferta escrita y detallada  •  Puedes rechazarla sin costo',
  },
  {
    number: '4',
    pill: 'CERRAR EL NEGOCIO · ~15 DÍAS DESDE EL INICIO',
    title: 'Firmamos y recibes tu dinero',
    description: 'Si aceptas la propuesta, gestionamos todos los trámites notariales, los documentos y el pago. Tú solo firmas y el dinero llega a tu cuenta.',
    footnote: 'Trámites incluidos  •  Pago directo a tu cuenta',
    isLast: true,
  },
]

const BENEFITS = [
  {
    icon: <TargetIcon />,
    title: 'Oferta garantizada',
    desc: 'Si llegamos a una visita, tendrás una oferta',
  },
  {
    icon: <RocketIcon />,
    title: 'Tu información está segura',
    desc: 'Tu información nunca se comparte con terceros',
  },
  {
    icon: <TargetIcon />,
    title: 'Sin letra pequeña',
    desc: 'Todo claro, todo transparente, siempre',
  },
]

export function UrgSteps() {
  return (
    <section className="urg-steps">
      {/* Section Header */}
      <div className="urg-steps__header">
        <p className="urg-steps__header-label">Habi te compra así de rápido</p>
        <h2 className="urg-steps__header-title">
          Habi te compra la casa
          <br />
          en tan <em>solo 10 días</em>
        </h2>
        <p className="urg-steps__header-subtitle">
          Sin intermediarios, sin incertidumbre, sin dolores de cabeza.
          <br />
          Nosotros nos encargamos de todo para que tú solo tengas que decir sí.
        </p>
      </div>

      {/* Steps */}
      <div className="urg-steps__list-section">
        <h3 className="urg-steps__list-title">Habi te compra así de simple:</h3>

        <div className="urg-steps__list">
          {STEPS_DATA.map((step) => (
            <div
              key={step.number}
              className={`urg-steps__item ${step.isLast ? 'urg-steps__item--last' : ''}`}
            >
              <span className="urg-steps__item-num">{step.number}</span>
              <div className="urg-steps__item-details">
                <span className="urg-steps__item-pill">{step.pill}</span>
                <h4 className="urg-steps__item-title">{step.title}</h4>
              </div>
              <div className="urg-steps__item-desc-wrap">
                <p className="urg-steps__item-desc">{step.description}</p>
                <p className="urg-steps__item-footnote">{step.footnote}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary card */}
        <div className="urg-steps__summary">
          <div className="urg-steps__summary-inner">
            <div className="urg-steps__summary-header">
              <h4 className="urg-steps__summary-title">
                <span className="urg-steps__summary-accent">¡Listo! Tu casa vendida</span>{' '}
                en ~15 días
              </h4>
              <p className="urg-steps__summary-desc">
                La manera más rápida de vender la propiedad sin tener que esperar
              </p>
            </div>
            <div className="urg-steps__summary-footer">
              <span className="urg-steps__summary-label">TRANQUILIDAD</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="#505e71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Benefits cards */}
        <div className="urg-steps__benefits">
          {BENEFITS.map((b) => (
            <div key={b.title} className="urg-steps__benefit-card">
              <div className="urg-steps__benefit-icon">{b.icon}</div>
              <div className="urg-steps__benefit-text">
                <h5 className="urg-steps__benefit-title">{b.title}</h5>
                <p className="urg-steps__benefit-desc">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="urg-steps__cta-wrap">
          <button type="button" className="urg-steps__cta">
            <span className="urg-steps__cta-label">Quiero vender con Habi</span>
            <span className="urg-steps__cta-icon-wrap">
              <img src={ARROW_ICON} alt="" width={24} height={24} />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
