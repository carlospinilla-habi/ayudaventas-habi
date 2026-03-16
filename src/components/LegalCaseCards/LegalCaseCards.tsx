import './LegalCaseCards.css'

const ICON_SUCESION = '/assets/icon-legal-sucesion.svg'
const ICON_DIVORCIO = '/assets/icon-legal-divorcio.svg'
const ICON_LITIGIO = '/assets/icon-legal-litigio.svg'

const CASES = [
  {
    icon: ICON_SUCESION,
    title: 'Sucesión',
    description: 'Herencias y liquidaciones. El inmueble debe estar en proceso o ya con escritura de herencia.',
  },
  {
    icon: ICON_DIVORCIO,
    title: 'Divorcio',
    description: 'Venta de bienes en sociedad conyugal. Necesitas acuerdo de ambas partes o fallo judicial.',
  },
  {
    icon: ICON_LITIGIO,
    title: 'Litigio',
    description: 'Disputas de propiedad. Necesita resolución judicial antes de poder vender.',
  },
]

export function LegalCaseCards() {
  return (
    <div className="legal-cards">
      <div className="legal-cards__container">
        {CASES.map((c) => (
          <div key={c.title} className="legal-cards__card">
            <div className="legal-cards__header">
              <span className="legal-cards__icon-box">
                <img src={c.icon} alt="" className="legal-cards__icon-img" />
              </span>
              <h3 className="legal-cards__title">{c.title}</h3>
            </div>
            <p className="legal-cards__desc">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
