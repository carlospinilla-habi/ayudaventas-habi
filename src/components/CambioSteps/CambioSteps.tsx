import './CambioSteps.css'

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

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7V12C3 17.5 7.02 22.28 12 23C16.98 22.28 21 17.5 21 12V7L12 2Z" stroke="#070707" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="#070707" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const STEPS_DATA = [
  {
    number: '1',
    pill: 'EMPIEZAS TÚ · 5 MIN',
    title: (
      <>
        Completa el formulario con los datos de tu hogar –{' '}
        <span className="cambio-steps__link">ver formulario</span>
      </>
    ),
    description: 'Cuéntanos lo básico: ubicación, tamaño, estado general y cuánto esperas recibir. Con eso ya podemos empezar a trabajar para ti.',
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
    pill: 'ANALIZAMOS · 3-5 DÍAS',
    title: 'Acordamos un contrato con reglas de precio y comisión',
    description: 'Después de la visita, nuestro equipo analiza el inmueble y te presenta un plan con precio sugerido, comisión y plazos. Tú decides si aceptas.',
    footnote: 'Propuesta escrita y detallada  •  Puedes rechazarla sin costo',
  },
  {
    number: '4',
    pill: 'CERRAR NEGOCIO · ~3 MESES',
    title: 'Te informamos de cada oferta recibida y tú aceptas',
    description: 'Publicamos tu propiedad, gestionamos visitas y negociamos con compradores potenciales. Tú solo decides cuál oferta aceptar.',
    footnote: 'Acompañamiento total  •  Tú tienes la última palabra',
  },
  {
    number: '5',
    pill: 'PAGO · ~4 MESES',
    title: 'Cuando vendemos, descontamos la comisión y tú recibes el dinero',
    description: 'Gestionamos todos los trámites notariales, los documentos y el pago. Descontamos la comisión acordada y el resto llega a tu cuenta.',
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
    icon: <ShieldIcon />,
    title: 'Tu información está segura',
    desc: 'Tu información nunca se comparte con terceros',
  },
  {
    icon: <RocketIcon />,
    title: 'Sin letra pequeña',
    desc: 'Todo claro, todo transparente, siempre',
  },
]

export function CambioSteps() {
  return (
    <section className="cambio-steps">
      <div className="cambio-steps__header">
        <p className="cambio-steps__header-label">Servicio inmobiliario Habi</p>
        <h2 className="cambio-steps__header-title">
          Más de 2500 agentes inmobiliarios
          <br />
          te ayudan a <em>venderlo</em>
        </h2>
        <p className="cambio-steps__header-subtitle">
          Sin incertidumbre, sin dolores de cabeza.
          <br />
          Nosotros nos encargamos de todo para que tú solo tengas que decir sí.
        </p>
      </div>

      <div className="cambio-steps__list-section">
        <h3 className="cambio-steps__list-title">Así funciona nuestro servicio inmobiliario:</h3>

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
              <p className="cambio-steps__summary-desc">
                Con el respaldo de más de 2500 agentes inmobiliarios trabajando por ti
              </p>
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
              <div className="cambio-steps__benefit-icon">{b.icon}</div>
              <div className="cambio-steps__benefit-text">
                <h5 className="cambio-steps__benefit-title">{b.title}</h5>
                <p className="cambio-steps__benefit-desc">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="cambio-steps__cta-wrap">
          <button type="button" className="cambio-steps__cta">
            <span className="cambio-steps__cta-label">Quiero el servicio inmobiliario</span>
            <span className="cambio-steps__cta-icon-wrap">
              <img src={ARROW_ICON} alt="" width={24} height={24} />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
