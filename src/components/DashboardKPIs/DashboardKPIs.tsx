import type { KPIs, SourceFilter, TableFilters } from '../../lib/dashboard-queries'
import { INTEREST_LABELS, STAGE_LABELS } from '../../lib/dashboard-queries'
import { InterestDonutChart } from './InterestDonutChart'
import './DashboardKPIs.css'

interface Props {
  kpis: KPIs
  onDrillDown?: (filter: TableFilters) => void
  onSourceClick?: (source: SourceFilter) => void
}

const INTEREST_COLORS: Record<string, string> = {
  'sin-afan': '#3b82f6',
  urgente: '#ef4444',
  cambiar: '#10b981',
  legal: '#a855f7',
}

const KNOWN_SOURCES = new Set<SourceFilter>(['ayudaventas', 'resgestion'])

export function DashboardKPIs({ kpis, onDrillDown, onSourceClick }: Props) {
  const maxStage = Math.max(...Object.values(kpis.byStage), 1)
  const totalLeads = kpis.totalLeads
  const pct = (n: number) => (totalLeads > 0 ? Math.round((n / totalLeads) * 100) : 0)

  function drill(filter: TableFilters) {
    onDrillDown?.(filter)
  }

  function keyActivate(e: React.KeyboardEvent, handler: () => void) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handler()
    }
  }

  const sourceEntries = Object.entries(kpis.bySource)
  const hasSources = sourceEntries.length > 0

  return (
    <div className="dash-kpis">
      {/* ── Hero row: Total (primaria) + 3 secundarias ─────── */}
      <div className="dash-kpis__hero">
        <div className="dash-kpis__hero-main">
          <button
            type="button"
            className="dash-kpis__hero-header"
            onClick={() => drill({})}
            title="Ver todos los leads"
          >
            <span className="dash-kpis__hero-eyebrow">Leads totales</span>
            <span className="dash-kpis__hero-value">{totalLeads}</span>
            <span className="dash-kpis__hero-sub">
              Registros en base · click para ver todos
            </span>
            <span className="dash-kpis__hero-arrow">→</span>
          </button>

          {hasSources && (
            <div className="dash-kpis__hero-sources">
              <span className="dash-kpis__hero-sources-label">Por fuente</span>
              <div className="dash-kpis__hero-sources-row">
                {sourceEntries.map(([src, count]) => {
                  const label =
                    src === 'ayudaventas'
                      ? 'Ayudaventas'
                      : src === 'resgestion'
                        ? 'Resgestion'
                        : src
                  const isClickable =
                    Boolean(onSourceClick) && KNOWN_SOURCES.has(src as SourceFilter)
                  const percent = pct(count)
                  const handleClick = () => {
                    if (isClickable) onSourceClick?.(src as SourceFilter)
                  }
                  const Tag: 'button' | 'div' = isClickable ? 'button' : 'div'
                  return (
                    <Tag
                      key={src}
                      {...(isClickable
                        ? { type: 'button' as const, onClick: handleClick, onKeyDown: (e: React.KeyboardEvent) => keyActivate(e, handleClick) }
                        : {})}
                      className={`dash-kpis__hero-source${isClickable ? ' dash-kpis__hero-source--clickable' : ''}`}
                    >
                      <div className="dash-kpis__hero-source-top">
                        <span className="dash-kpis__hero-source-name">{label}</span>
                        <span className="dash-kpis__hero-source-count">{count}</span>
                      </div>
                      <div className="dash-kpis__hero-source-bar">
                        <div
                          className="dash-kpis__hero-source-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="dash-kpis__hero-source-pct">{percent}%</span>
                    </Tag>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="dash-kpis__hero-side">
          <button
            type="button"
            className="dash-kpis__stat dash-kpis__stat--oferta"
            onClick={() => drill({ oferta: true })}
          >
            <span className="dash-kpis__stat-label">Oferta Habi solicitada</span>
            <div className="dash-kpis__stat-value-row">
              <span className="dash-kpis__stat-value">{kpis.ofertaRequested}</span>
              <span className="dash-kpis__stat-pct">{pct(kpis.ofertaRequested)}%</span>
            </div>
            <div className="dash-kpis__stat-track">
              <div
                className="dash-kpis__stat-fill dash-kpis__stat-fill--oferta"
                style={{ width: `${pct(kpis.ofertaRequested)}%` }}
              />
            </div>
          </button>

          <button
            type="button"
            className="dash-kpis__stat dash-kpis__stat--inmo"
            onClick={() => drill({ inmo: 'completed' })}
          >
            <span className="dash-kpis__stat-label">Formulario inmobiliario</span>
            <div className="dash-kpis__stat-value-row">
              <span className="dash-kpis__stat-value">{kpis.inmoCompleted}</span>
              <span className="dash-kpis__stat-pct">{pct(kpis.inmoCompleted)}%</span>
            </div>
            <div className="dash-kpis__stat-track">
              <div
                className="dash-kpis__stat-fill dash-kpis__stat-fill--inmo"
                style={{ width: `${pct(kpis.inmoCompleted)}%` }}
              />
            </div>
          </button>

          <button
            type="button"
            className="dash-kpis__stat dash-kpis__stat--ficha"
            onClick={() => drill({ ficha: true })}
          >
            <span className="dash-kpis__stat-label">Fichas creadas</span>
            <div className="dash-kpis__stat-value-row">
              <span className="dash-kpis__stat-value">{kpis.fichaCreated}</span>
              <span className="dash-kpis__stat-pct">{pct(kpis.fichaCreated)}%</span>
            </div>
            <div className="dash-kpis__stat-track">
              <div
                className="dash-kpis__stat-fill dash-kpis__stat-fill--ficha"
                style={{ width: `${pct(kpis.fichaCreated)}%` }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* ── Sección Interés (primaria) ───────────────────────── */}
      <section className="dash-kpis__section dash-kpis__section--interest">
        <header className="dash-kpis__section-header">
          <h3 className="dash-kpis__section-title">Interés de venta</h3>
          <span className="dash-kpis__section-hint">
            Click en la dona o en una tarjeta para filtrar
          </span>
        </header>
        <div className="dash-kpis__interest-layout">
          <div className="dash-kpis__interest-chart">
            <InterestDonutChart
              byInterest={kpis.byInterest}
              onSliceClick={(key) => drill({ interest: key })}
            />
          </div>
          <div className="dash-kpis__interest-list">
            {Object.entries(INTEREST_LABELS).map(([key, label]) => {
              const count = kpis.byInterest[key] ?? 0
              const percent = pct(count)
              const color = INTEREST_COLORS[key] ?? '#9ca3af'
              return (
                <button
                  key={key}
                  type="button"
                  className="dash-kpis__interest-chip"
                  onClick={() => drill({ interest: key })}
                  onKeyDown={(e) => keyActivate(e, () => drill({ interest: key }))}
                >
                  <span className="dash-kpis__interest-dot" style={{ background: color }} />
                  <div className="dash-kpis__interest-chip-body">
                    <div className="dash-kpis__interest-chip-top">
                      <span className="dash-kpis__interest-chip-label">{label}</span>
                      <span className="dash-kpis__interest-chip-value">{count}</span>
                    </div>
                    <div className="dash-kpis__interest-chip-bar">
                      <div
                        className="dash-kpis__interest-chip-fill"
                        style={{ width: `${percent}%`, background: color }}
                      />
                    </div>
                    <span className="dash-kpis__interest-chip-pct">{percent}% del total</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Sección Momento de venta (secundaria) ────────────── */}
      <section className="dash-kpis__section">
        <header className="dash-kpis__section-header">
          <h3 className="dash-kpis__section-title">Momento de venta</h3>
          <span className="dash-kpis__section-hint">Click en una etapa para filtrar</span>
        </header>
        <div className="dash-kpis__bar-group">
          {[1, 2, 3, 4].map((stage) => {
            const count = kpis.byStage[stage] ?? 0
            const width = maxStage > 0 ? (count / maxStage) * 100 : 0
            return (
              <button
                key={stage}
                type="button"
                className="dash-kpis__bar-item"
                onClick={() => drill({ stage })}
              >
                <span className="dash-kpis__bar-step">{stage}</span>
                <span className="dash-kpis__bar-label">{STAGE_LABELS[stage]}</span>
                <div className="dash-kpis__bar-track">
                  <div className="dash-kpis__bar-fill" style={{ width: `${width}%` }} />
                </div>
                <span className="dash-kpis__bar-count">{count}</span>
              </button>
            )
          })}
        </div>
      </section>

    </div>
  )
}
