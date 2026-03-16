import { useEffect, useMemo } from 'react'
import { Pill } from '../Pill/Pill'
import type { PillEstado } from '../Pill/Pill'
import './MiCasaModal.css'

interface FichaData {
  titulo: string
  tipoInmueble: string
  ciudad: string
  barrio: string
  direccion: string
  numeroApto: string
  areaM2: string
  antiguedad: string
  parqueaderos: string
  banos: string
  habitaciones: string
  piso: string
  estrato: string
  adminMes: string
  precioVenta: string
  descripcion: string
  features: string[]
  nombre: string
  email: string
  whatsapp: string
}

const STAGE_LABELS = [
  { id: 1, label: 'Precio y Difusión' },
  { id: 2, label: 'Visitas y Negociación' },
  { id: 3, label: 'Documentos y Pago' },
  { id: 4, label: 'Entrega' },
]

const INTEREST_OPTIONS: { id: string; estado: PillEstado; label: string }[] = [
  { id: 'sin-afan', estado: 'sin-afan', label: 'Vender sin afán' },
  { id: 'urgente', estado: 'urgente', label: 'Vender Urgente' },
  { id: 'cambiar', estado: 'cambio', label: 'Cambiar de casa' },
  { id: 'legal', estado: 'legal', label: 'Asunto legal' },
]

function loadFichaData(): FichaData | null {
  try {
    const s = localStorage.getItem('ficha-creator-data')
    if (s) return JSON.parse(s)
  } catch { /* ignore */ }
  return null
}

function hasMeaningfulFichaData(d: FichaData | null): boolean {
  if (!d) return false
  return !!(d.direccion || d.ciudad || d.barrio || d.tipoInmueble)
}

function formatCurrency(value: string): string {
  const nums = value.replace(/\D/g, '')
  if (!nums) return ''
  return `$${Number(nums).toLocaleString('es-CO')}`
}

const HouseIcon = () => (
  <svg className="micasa-hero-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const FileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

interface Props {
  open: boolean
  onClose: () => void
}

export default function MiCasaModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const fichaData = useMemo(() => loadFichaData(), [])
  const hasFicha = hasMeaningfulFichaData(fichaData)

  const activeStage = useMemo(() => {
    const s = localStorage.getItem('vsa-user-stage')
    return s ? parseInt(s, 10) : 0
  }, [])

  const userInterest = useMemo(() => {
    return localStorage.getItem('user-interest')
  }, [])

  if (!open) return null

  const propertyFields: { label: string; value: string; icon: string }[] = []
  if (fichaData) {
    if (fichaData.direccion) propertyFields.push({ label: 'Dirección', value: fichaData.direccion, icon: '📍' })
    if (fichaData.ciudad) propertyFields.push({ label: 'Ciudad', value: fichaData.ciudad, icon: '🏙' })
    if (fichaData.barrio) propertyFields.push({ label: 'Barrio', value: fichaData.barrio, icon: '📌' })
    if (fichaData.numeroApto) propertyFields.push({ label: 'Nº Apto', value: fichaData.numeroApto, icon: '🚪' })
    if (fichaData.tipoInmueble) propertyFields.push({ label: 'Tipo', value: fichaData.tipoInmueble, icon: '🏠' })
    if (fichaData.areaM2) propertyFields.push({ label: 'Área', value: `${fichaData.areaM2} m²`, icon: '📐' })
    if (fichaData.habitaciones) propertyFields.push({ label: 'Habitaciones', value: fichaData.habitaciones, icon: '🛏' })
    if (fichaData.banos) propertyFields.push({ label: 'Baños', value: fichaData.banos, icon: '🚿' })
    if (fichaData.parqueaderos) propertyFields.push({ label: 'Parqueaderos', value: fichaData.parqueaderos, icon: '🅿️' })
    if (fichaData.estrato) propertyFields.push({ label: 'Estrato', value: fichaData.estrato, icon: '⭐' })
  }

  return (
    <div className="micasa-overlay" onClick={onClose}>
      <div className="micasa-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="micasa-close" onClick={onClose} aria-label="Cerrar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Hero header */}
        <div className="micasa-hero">
          <HouseIcon />
          <h2 className="micasa-title">Mi casa</h2>
          <p className="micasa-subtitle">Resumen de tu proceso de venta</p>
        </div>

        <div className="micasa-scroll">
          {/* Section 1: Property Summary */}
          <section className="micasa-card">
            <div className="micasa-card-header">
              <span className="micasa-card-dot" />
              <h3 className="micasa-card-title">Datos de la propiedad</h3>
            </div>
            {hasFicha && fichaData ? (
              <>
                {fichaData.precioVenta && (
                  <div className="micasa-price-bar">
                    <span className="micasa-price-label">Precio de venta</span>
                    <span className="micasa-price-value">{formatCurrency(fichaData.precioVenta)}</span>
                  </div>
                )}
                <div className="micasa-props">
                  {propertyFields.map((f) => (
                    <div key={f.label} className="micasa-prop">
                      <span className="micasa-prop-icon">{f.icon}</span>
                      <div className="micasa-prop-text">
                        <span className="micasa-prop-label">{f.label}</span>
                        <span className="micasa-prop-value">{f.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {fichaData.features.length > 0 && (
                  <div className="micasa-features">
                    <span className="micasa-features-label">Características</span>
                    <div className="micasa-chips">
                      {fichaData.features.map((f) => (
                        <span key={f} className="micasa-chip">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="micasa-empty">
                <p className="micasa-empty-text">Aún no has ingresado datos de tu propiedad.</p>
                <a href="#crear-ficha" className="micasa-cta" onClick={onClose}>
                  Crear mi ficha <ArrowIcon />
                </a>
              </div>
            )}
          </section>

          {/* Section 2: Sale Stage */}
          <section className="micasa-card">
            <div className="micasa-card-header">
              <span className="micasa-card-dot micasa-card-dot--green" />
              <h3 className="micasa-card-title">Momento de venta</h3>
            </div>
            {activeStage > 0 ? (
              <div className="micasa-stepper">
                {STAGE_LABELS.map((stage, i) => {
                  const isCompleted = stage.id < activeStage
                  const isActive = stage.id === activeStage
                  const isLast = i === STAGE_LABELS.length - 1
                  return (
                    <div key={stage.id} className="micasa-step-group">
                      <div className={`micasa-step ${isCompleted ? 'micasa-step--done' : ''} ${isActive ? 'micasa-step--active' : ''}`}>
                        <div className="micasa-step-circle">
                          {isCompleted ? <CheckIcon /> : <span>{stage.id}</span>}
                        </div>
                        <span className="micasa-step-label">{stage.label}</span>
                      </div>
                      {!isLast && (
                        <div className={`micasa-step-line ${isCompleted ? 'micasa-step-line--done' : ''}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="micasa-empty">
                <p className="micasa-empty-text">No has marcado tu momento de venta aún.</p>
              </div>
            )}
          </section>

          {/* Section 3: Ficha Link */}
          <section className="micasa-card">
            <div className="micasa-card-header">
              <span className="micasa-card-dot micasa-card-dot--amber" />
              <h3 className="micasa-card-title">Tu ficha de venta</h3>
            </div>
            {hasFicha ? (
              <a href="#crear-ficha" className="micasa-ficha-link" onClick={onClose}>
                <div className="micasa-ficha-link-icon"><FileIcon /></div>
                <div className="micasa-ficha-link-text">
                  <span className="micasa-ficha-link-title">Ver la ficha de mi casa</span>
                  <span className="micasa-ficha-link-desc">Abre tu ficha para editarla o descargarla</span>
                </div>
                <ArrowIcon />
              </a>
            ) : (
              <div className="micasa-empty">
                <p className="micasa-empty-text">Aún no has creado tu ficha.</p>
                <a href="#crear-ficha" className="micasa-cta" onClick={onClose}>
                  Crear mi ficha <ArrowIcon />
                </a>
              </div>
            )}
          </section>

          {/* Section 4: Interest */}
          <section className="micasa-card micasa-card--last">
            <div className="micasa-card-header">
              <span className="micasa-card-dot micasa-card-dot--pink" />
              <h3 className="micasa-card-title">Tu interés de venta</h3>
            </div>
            {userInterest ? (
              <div className="micasa-interests">
                {INTEREST_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    className={`micasa-interest ${opt.id === userInterest ? 'micasa-interest--active' : ''}`}
                  >
                    <Pill estado={opt.estado} mode="light" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="micasa-empty">
                <p className="micasa-empty-text">Aún no has seleccionado tu interés de venta.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
