import type { KPIs } from '../../lib/dashboard-queries'
import { INTEREST_LABELS, STAGE_LABELS } from '../../lib/dashboard-queries'
import './DashboardKPIs.css'

interface Props {
  kpis: KPIs
}

export function DashboardKPIs({ kpis }: Props) {
  const maxStage = Math.max(...Object.values(kpis.byStage), 1)

  return (
    <div className="dash-kpis">
      {/* Main counters */}
      <div className="dash-kpis__row">
        <div className="dash-kpis__card dash-kpis__card--highlight">
          <span className="dash-kpis__card-label">Leads totales</span>
          <span className="dash-kpis__card-value">{kpis.totalLeads}</span>
        </div>
        <div className="dash-kpis__card">
          <span className="dash-kpis__card-label">Oferta Habi solicitada</span>
          <span className="dash-kpis__card-value">{kpis.ofertaRequested}</span>
        </div>
        <div className="dash-kpis__card">
          <span className="dash-kpis__card-label">Formulario inmobiliario</span>
          <span className="dash-kpis__card-value">{kpis.inmoCompleted}</span>
        </div>
        <div className="dash-kpis__card">
          <span className="dash-kpis__card-label">Fichas creadas</span>
          <span className="dash-kpis__card-value">{kpis.fichaCreated}</span>
        </div>
      </div>

      {/* By interest */}
      <h3 className="dash-kpis__section-title">Interés de venta</h3>
      <div className="dash-kpis__row">
        {Object.entries(INTEREST_LABELS).map(([key, label]) => (
          <div key={key} className="dash-kpis__card">
            <span className="dash-kpis__card-label">{label}</span>
            <span className="dash-kpis__card-value">{kpis.byInterest[key] ?? 0}</span>
          </div>
        ))}
      </div>

      {/* By source */}
      {Object.keys(kpis.bySource).length > 0 && (
        <>
          <h3 className="dash-kpis__section-title">Por fuente</h3>
          <div className="dash-kpis__row">
            {Object.entries(kpis.bySource).map(([src, count]) => (
              <div key={src} className="dash-kpis__card">
                <span className="dash-kpis__card-label">{src === 'ayudaventas' ? 'Ayudaventas' : src === 'resgestion' ? 'Resgestion' : src}</span>
                <span className="dash-kpis__card-value">{count}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Stage distribution */}
      <h3 className="dash-kpis__section-title">Momento de venta</h3>
      <div className="dash-kpis__bar-group">
        {[1, 2, 3, 4].map((stage) => {
          const count = kpis.byStage[stage] ?? 0
          const pct = maxStage > 0 ? (count / maxStage) * 100 : 0
          return (
            <div key={stage} className="dash-kpis__bar-item">
              <span className="dash-kpis__bar-label">{STAGE_LABELS[stage]}</span>
              <div className="dash-kpis__bar-track">
                <div className="dash-kpis__bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="dash-kpis__bar-count">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
