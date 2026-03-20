import { useEffect, useMemo, useState } from 'react'
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

interface InmoFormStoredData {
  data: Record<string, string | string[] | boolean>
  step: number
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

const INMO_DETAIL_FIELDS: { key: string; label: string }[] = [
  { key: 'ciudad', label: 'Ciudad' },
  { key: 'barrio', label: 'Barrio' },
  { key: 'direccion', label: 'Dirección' },
  { key: 'tipo_inmueble', label: 'Tipo de inmueble' },
  { key: 'torre', label: 'Torre' },
  { key: 'piso', label: 'Piso' },
  { key: 'numero_vivienda', label: 'Nº Vivienda' },
  { key: 'tiene_ascensor', label: 'Ascensor' },
  { key: 'ultimo_piso', label: 'Último piso' },
  { key: 'relacion_inmueble', label: 'Relación' },
  { key: 'nombre_contacto', label: 'Nombre' },
  { key: 'email_contacto', label: 'Email' },
  { key: 'telefono_contacto', label: 'Teléfono' },
  { key: 'antiguedad', label: 'Antigüedad' },
  { key: 'area_m2', label: 'Área (m²)' },
  { key: 'habitaciones', label: 'Habitaciones' },
  { key: 'banos_completos', label: 'Baños completos' },
  { key: 'banos_medios', label: 'Baños medios' },
  { key: 'zonas', label: 'Zonas' },
  { key: 'parqueaderos', label: 'Parqueaderos' },
  { key: 'tipo_parqueadero', label: 'Tipo parqueadero' },
  { key: 'organizacion_parqueadero', label: 'Organización parq.' },
  { key: 'precio_venta', label: 'Precio de venta' },
  { key: 'valor_administracion', label: 'Administración' },
  { key: 'obra_gris', label: 'Obra gris' },
  { key: 'estrato', label: 'Estrato' },
  { key: 'gravamen', label: 'Gravamen' },
  { key: 'tipo_gravamen', label: 'Tipo de gravamen' },
  { key: 'estado_vivienda', label: 'Estado vivienda' },
  { key: 'zonas_comunes', label: 'Zonas comunes' },
  { key: 'motivo_venta', label: 'Motivo de venta' },
  { key: 'tiempo_vendiendo', label: 'Tiempo vendiendo' },
]

function loadFichaData(): FichaData | null {
  try {
    const s = localStorage.getItem('ficha-creator-data')
    if (s) return JSON.parse(s)
  } catch { /* ignore */ }
  return null
}

function loadInmoData(): InmoFormStoredData | null {
  try {
    const s = localStorage.getItem('inmo-form-data')
    if (s) return JSON.parse(s)
  } catch { /* ignore */ }
  return null
}

function hasMeaningfulFichaData(d: FichaData | null): boolean {
  if (!d) return false
  return !!(d.direccion || d.ciudad || d.barrio || d.tipoInmueble)
}

function hasMeaningfulInmoData(d: InmoFormStoredData | null): boolean {
  if (!d?.data) return false
  return !!(d.data.ciudad || d.data.direccion || d.data.tipo_inmueble)
}

function formatCurrency(value: string): string {
  const nums = value.replace(/\D/g, '')
  if (!nums) return ''
  return `$${Number(nums).toLocaleString('es-CO')}`
}

function formatInmoValue(key: string, value: string | string[] | boolean): string {
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  if (Array.isArray(value)) return value.join(', ')
  if ((key === 'precio_venta' || key === 'valor_administracion') && value) {
    return formatCurrency(value)
  }
  return value
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

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
  >
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

const ServiceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
)

interface Props {
  open: boolean
  onClose: () => void
}

export default function MiCasaModal({ open, onClose }: Props) {
  const [inmoDetailOpen, setInmoDetailOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    setInmoDetailOpen(false)
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

  const inmoStored = useMemo(() => loadInmoData(), [])
  const hasInmo = hasMeaningfulInmoData(inmoStored)
  const inmoData = inmoStored?.data
  const inmoIsCompleted = !!(inmoData?.nombre_contacto && inmoData?.precio_venta)

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

          {/* Section 4: InmoForm – Servicio inmobiliario */}
          <section className="micasa-card">
            <div className="micasa-card-header">
              <span className="micasa-card-dot micasa-card-dot--purple" />
              <h3 className="micasa-card-title">Servicio inmobiliario</h3>
              {inmoIsCompleted && <span className="micasa-badge">Completado</span>}
              {hasInmo && !inmoIsCompleted && <span className="micasa-badge micasa-badge--progress">En progreso</span>}
            </div>
            {hasInmo && inmoData ? (
              <>
                <div className="micasa-inmo-summary">
                  {inmoData.ciudad && (
                    <div className="micasa-prop">
                      <span className="micasa-prop-icon">🏙</span>
                      <div className="micasa-prop-text">
                        <span className="micasa-prop-label">Ciudad</span>
                        <span className="micasa-prop-value">{String(inmoData.ciudad)}</span>
                      </div>
                    </div>
                  )}
                  {inmoData.tipo_inmueble && (
                    <div className="micasa-prop">
                      <span className="micasa-prop-icon">🏠</span>
                      <div className="micasa-prop-text">
                        <span className="micasa-prop-label">Tipo</span>
                        <span className="micasa-prop-value">{String(inmoData.tipo_inmueble)}</span>
                      </div>
                    </div>
                  )}
                  {inmoData.direccion && (
                    <div className="micasa-prop">
                      <span className="micasa-prop-icon">📍</span>
                      <div className="micasa-prop-text">
                        <span className="micasa-prop-label">Dirección</span>
                        <span className="micasa-prop-value">{String(inmoData.direccion)}</span>
                      </div>
                    </div>
                  )}
                  {inmoData.precio_venta && (
                    <div className="micasa-price-bar">
                      <span className="micasa-price-label">Precio de venta</span>
                      <span className="micasa-price-value">{formatCurrency(String(inmoData.precio_venta))}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="micasa-detail-toggle"
                  onClick={() => setInmoDetailOpen(!inmoDetailOpen)}
                >
                  <span>Ver todos los datos</span>
                  <ChevronDown open={inmoDetailOpen} />
                </button>

                {inmoDetailOpen && (
                  <div className="micasa-inmo-details">
                    {INMO_DETAIL_FIELDS.map((field) => {
                      const val = inmoData[field.key]
                      if (!val || (typeof val === 'string' && !val.trim()) || (Array.isArray(val) && val.length === 0)) return null
                      return (
                        <div key={field.key} className="micasa-detail-row">
                          <span className="micasa-detail-label">{field.label}</span>
                          <span className="micasa-detail-value">{formatInmoValue(field.key, val)}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="micasa-empty">
                <p className="micasa-empty-text">No has solicitado el servicio inmobiliario.</p>
                <a href="#habi-oferta" className="micasa-cta" onClick={onClose}>
                  Solicitar servicio <ArrowIcon />
                </a>
              </div>
            )}
          </section>

          {/* Section 5: Interest */}
          <section className="micasa-card micasa-card--last">
            <div className="micasa-card-header">
              <span className="micasa-card-dot micasa-card-dot--pink" />
              <h3 className="micasa-card-title">Tu interés de venta</h3>
            </div>
            {(userInterest || hasInmo) ? (
              <div className="micasa-interests">
                {INTEREST_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    className={`micasa-interest ${opt.id === userInterest ? 'micasa-interest--active' : ''}`}
                  >
                    <Pill estado={opt.estado} mode="light" />
                  </div>
                ))}
                {hasInmo && (
                  <div className={`micasa-interest micasa-interest--active micasa-interest--service`}>
                    <span className="micasa-service-pill">
                      <ServiceIcon />
                      <span>Servicio inmobiliario</span>
                    </span>
                  </div>
                )}
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
