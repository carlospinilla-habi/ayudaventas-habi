import { useEffect, useState } from 'react'
import type { LeadRow, LeadDetail } from '../../lib/dashboard-queries'
import {
  INTEREST_LABELS,
  STAGE_LABELS,
  fetchLeadDetail,
} from '../../lib/dashboard-queries'
import './LeadDetailPanel.css'

interface Props {
  lead: LeadRow | null
  onClose: () => void
}

export function LeadDetailPanel({ lead, onClose }: Props) {
  const [detail, setDetail] = useState<LeadDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!lead) {
      setDetail(null)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)
    setDetail(null)

    fetchLeadDetail(lead.id)
      .then((d) => {
        if (!cancelled) setDetail(d)
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? 'Error cargando detalle')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [lead])

  useEffect(() => {
    if (!lead) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lead, onClose])

  if (!lead) return null

  const displayName =
    detail?.contact.nombre ?? lead.nombre ?? detail?.contact.email ?? lead.email ?? 'Lead sin nombre'
  const displayEmail = detail?.contact.email ?? lead.email
  const displayWhatsapp = detail?.contact.whatsapp ?? lead.whatsapp
  const activeStage = lead.active_stage ?? 0

  return (
    <div className="lead-panel-root">
      <div className="lead-panel__overlay" onClick={onClose} />
      <aside className="lead-panel" role="dialog" aria-modal="true">
        <header className="lead-panel__header">
          <div className="lead-panel__header-main">
            <span className="lead-panel__eyebrow">Lead</span>
            <h2 className="lead-panel__title">{displayName}</h2>
            <div className="lead-panel__meta">
              <span>
                ID: <code>{lead.id.slice(0, 8)}</code>
              </span>
              {lead.source && <span className="lead-panel__badge">{lead.source}</span>}
              {lead.user_interest && (
                <span className="lead-panel__badge lead-panel__badge--interest">
                  {INTEREST_LABELS[lead.user_interest] ?? lead.user_interest}
                </span>
              )}
            </div>
          </div>
          <button className="lead-panel__close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>

        <div className="lead-panel__body">
          {/* Contact */}
          <section className="lead-panel__section">
            <h3 className="lead-panel__section-title">Contacto</h3>
            <div className="lead-panel__grid">
              <Field label="Nombre" value={detail?.contact.nombre ?? lead.nombre} loading={loading} />
              <Field label="Email" value={displayEmail} loading={loading} />
              <Field label="WhatsApp" value={displayWhatsapp} loading={loading} />
              <Field
                label="Ciudad"
                value={detail?.property.ciudad ?? lead.ciudad}
                loading={loading}
              />
            </div>
          </section>

          {/* Momento de venta stepper */}
          <section className="lead-panel__section">
            <h3 className="lead-panel__section-title">Momento de venta</h3>
            <div className="lead-panel__stepper">
              {[1, 2, 3, 4].map((stage) => {
                const state =
                  activeStage === stage ? 'active' : activeStage > stage ? 'done' : 'pending'
                return (
                  <div key={stage} className={`lead-panel__step lead-panel__step--${state}`}>
                    <div className="lead-panel__step-circle">{stage}</div>
                    <span className="lead-panel__step-label">{STAGE_LABELS[stage]}</span>
                  </div>
                )
              })}
            </div>
            {activeStage === 0 && (
              <p className="lead-panel__empty-hint">
                El lead aún no ha marcado un momento de venta.
              </p>
            )}
          </section>

          {/* Property */}
          <section className="lead-panel__section">
            <h3 className="lead-panel__section-title">Datos del inmueble</h3>
            {loading && !detail && <div className="lead-panel__skeleton" />}
            {error && (
              <div className="lead-panel__error">No se pudo cargar el detalle: {error}</div>
            )}
            {detail && <PropertyGrid detail={detail} fallback={lead} />}
          </section>
        </div>
      </aside>
    </div>
  )
}

function PropertyGrid({ detail, fallback }: { detail: LeadDetail; fallback: LeadRow }) {
  const p = detail.property

  const items: Array<[string, string | null]> = [
    ['Tipo inmueble', p.tipo_inmueble ?? fallback.tipo_inmueble],
    ['Ciudad', p.ciudad ?? fallback.ciudad],
    ['Barrio', p.barrio],
    ['Dirección', p.direccion],
    ['Área (m²)', p.area_m2],
    ['Habitaciones', p.habitaciones],
    ['Baños completos', p.banos_completos],
    ['Baños medios', p.banos_medios],
    ['Parqueaderos', p.parqueaderos],
    ['Estrato', p.estrato],
    ['Antigüedad', p.antiguedad],
    ['Estado', p.estado_vivienda],
    ['Precio venta', formatMoney(p.precio_venta ?? fallback.precio_venta)],
    ['Administración', formatMoney(p.valor_administracion)],
    ['Motivo de venta', p.motivo_venta],
  ]

  const nonEmpty = items.filter(([, v]) => v && String(v).trim().length > 0)

  if (nonEmpty.length === 0) {
    return (
      <p className="lead-panel__empty-hint">
        Este lead aún no ha registrado información del inmueble.
      </p>
    )
  }

  return (
    <div className="lead-panel__grid">
      {nonEmpty.map(([label, value]) => (
        <Field key={label} label={label} value={value} loading={false} />
      ))}
    </div>
  )
}

function Field({
  label,
  value,
  loading,
}: {
  label: string
  value: string | null | undefined
  loading: boolean
}) {
  return (
    <div className="lead-panel__field">
      <span className="lead-panel__field-label">{label}</span>
      {loading && !value ? (
        <span className="lead-panel__field-placeholder" />
      ) : (
        <span className="lead-panel__field-value">{value && String(value).trim() ? value : '—'}</span>
      )}
    </div>
  )
}

function formatMoney(raw: string | null | undefined): string | null {
  if (!raw) return null
  const digits = String(raw).replace(/[^0-9.-]/g, '')
  const num = Number(digits)
  if (!Number.isFinite(num) || num === 0) return null
  return `$${num.toLocaleString('es-CO')}`
}
