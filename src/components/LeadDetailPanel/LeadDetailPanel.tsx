import { useEffect, useState } from 'react'
import type { LeadRow, LeadDetail } from '../../lib/dashboard-queries'
import {
  INTEREST_LABELS,
  STAGE_LABELS,
  fetchLeadDetail,
  formatCiudadDisplay,
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

  const ciudadRaw = detail?.property.ciudad ?? lead.ciudad
  const barrioRaw = detail?.property.barrio ?? lead.barrio
  const displayCiudad = formatCiudadDisplay(ciudadRaw, barrioRaw)

  const showFichaSection =
    detail &&
    (detail.source === 'properties' ||
      detail.ficha.titulo ||
      detail.ficha.descripcion ||
      detail.ficha.features)

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
          <section className="lead-panel__section">
            <h3 className="lead-panel__section-title">Contacto</h3>
            <div className="lead-panel__grid">
              <Field label="Nombre" value={detail?.contact.nombre ?? lead.nombre} loading={loading} />
              <Field label="Email" value={displayEmail} loading={loading} />
              <Field label="WhatsApp" value={displayWhatsapp} loading={loading} />
              <Field label="Ciudad" value={displayCiudad} loading={loading} />
              <Field
                label="Relación con el inmueble"
                value={detail?.contact.relacion_inmueble ?? lead.relacion_inmueble}
                loading={loading}
              />
            </div>
          </section>

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

          <section className="lead-panel__section">
            <h3 className="lead-panel__section-title">Datos del inmueble</h3>
            {loading && !detail && <div className="lead-panel__skeleton" />}
            {error && (
              <div className="lead-panel__error">No se pudo cargar el detalle: {error}</div>
            )}
            {detail && <PropertyGrid detail={detail} fallback={lead} />}
          </section>

          {showFichaSection && detail && (
            <section className="lead-panel__section">
              <h3 className="lead-panel__section-title">Ficha del inmueble</h3>
              <div className="lead-panel__grid">
                <Field label="Título" value={detail.ficha.titulo} loading={false} />
                <Field label="Descripción" value={detail.ficha.descripcion} loading={false} />
                <Field label="Características" value={detail.ficha.features} loading={false} />
              </div>
            </section>
          )}

          {detail?.activity && (
            <section className="lead-panel__section">
              <h3 className="lead-panel__section-title">Actividad</h3>
              <ActivityTimeline activity={detail.activity} />
            </section>
          )}

          {detail && detail.checklistSteps.length > 0 && (
            <section className="lead-panel__section">
              <h3 className="lead-panel__section-title">Checklist</h3>
              <ul className="lead-panel__checklist">
                {detail.checklistSteps.map((step) => (
                  <li key={step.step_number} className="lead-panel__checklist-item">
                    <span className="lead-panel__checklist-step">Paso {step.step_number}</span>
                    <span className="lead-panel__checklist-progress">
                      {step.done}/{step.total} tareas
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </aside>
    </div>
  )
}

function PropertyGrid({ detail, fallback }: { detail: LeadDetail; fallback: LeadRow }) {
  const p = detail.property

  const items: Array<[string, string | null]> = [
    ['Tipo inmueble', p.tipo_inmueble ?? fallback.tipo_inmueble],
    ['Ciudad', formatCiudadDisplay(p.ciudad ?? fallback.ciudad, p.barrio ?? fallback.barrio)],
    ['Barrio', p.barrio ?? fallback.barrio],
    ['Dirección', p.direccion ?? fallback.direccion],
    ['Área (m²)', p.area_m2],
    ['Habitaciones', p.habitaciones],
    ['Baños completos', p.banos_completos],
    ['Baños medios', p.banos_medios],
    ['Parqueaderos', p.parqueaderos],
    ['Tipo parqueadero', p.tipo_parqueadero],
    ['Organización parqueadero', p.organizacion_parqueadero],
    ['Estrato', p.estrato],
    ['Antigüedad', p.antiguedad],
    ['Estado', p.estado_vivienda],
    ['Torre', p.torre],
    ['Piso', p.piso_inmueble],
    ['Número vivienda', p.numero_vivienda],
    ['Ascensor', p.tiene_ascensor],
    ['Último piso', p.ultimo_piso],
    ['Zonas del inmueble', p.zonas],
    ['Zonas comunes', p.zonas_comunes],
    ['Gravamen', p.gravamen],
    ['Obra gris', p.obra_gris],
    ['Precio venta', formatMoney(p.precio_venta ?? fallback.precio_venta)],
    ['Administración', formatMoney(p.valor_administracion)],
    ['Motivo de venta', p.motivo_venta],
    ['Tiempo vendiendo', p.tiempo_vendiendo ?? fallback.tiempo_vendiendo],
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

function ActivityTimeline({ activity }: { activity: NonNullable<LeadDetail['activity']> }) {
  const rows: Array<{ label: string; at: string | null; active: boolean }> = [
    {
      label: activity.user_interest
        ? `Interés: ${INTEREST_LABELS[activity.user_interest] ?? activity.user_interest}`
        : 'Interés',
      at: activity.interest_selected_at,
      active: Boolean(activity.user_interest),
    },
    { label: 'Ficha creada', at: activity.ficha_created_at, active: Boolean(activity.ficha_created) },
    {
      label: 'Oferta Habi solicitada',
      at: activity.oferta_requested_at,
      active: Boolean(activity.oferta_requested),
    },
    {
      label: 'Habímetro solicitado',
      at: activity.habimetro_requested_at,
      active: Boolean(activity.habimetro_requested),
    },
  ]

  return (
    <ul className="lead-panel__timeline">
      {rows.map((row) => (
        <li
          key={row.label}
          className={`lead-panel__timeline-item${row.active ? ' lead-panel__timeline-item--active' : ''}`}
        >
          <span className="lead-panel__timeline-label">{row.label}</span>
          <span className="lead-panel__timeline-date">
            {row.at ? formatActivityDate(row.at) : row.active ? 'Sí (sin fecha)' : '—'}
          </span>
        </li>
      ))}
    </ul>
  )
}

function formatActivityDate(iso: string): string {
  return new Date(iso).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
  const trimmed = String(raw).trim()
  if (!trimmed) return null
  const digits = trimmed.replace(/[^0-9.-]/g, '')
  const num = Number(digits)
  if (Number.isFinite(num) && num !== 0) {
    return `$${num.toLocaleString('es-CO')}`
  }
  if (/\d/.test(trimmed)) return trimmed
  return null
}
