import { useMemo } from 'react'
import type { LeadRow, Segment } from '../../lib/dashboard-queries'
import { computeMaturity, getSegment, SEGMENT_LABELS, STAGE_LABELS } from '../../lib/dashboard-queries'
import './DashboardProfile.css'

interface Props {
  leads: LeadRow[]
}

const SEGMENT_ORDER: Segment[] = ['urgente', 'cambiar', 'sin-afan', 'legal', 'sin-interes']

export function DashboardProfile({ leads }: Props) {
  const segments = useMemo(() => {
    const grouped: Record<Segment, LeadRow[]> = {
      urgente: [],
      cambiar: [],
      'sin-afan': [],
      legal: [],
      'sin-interes': [],
    }

    for (const lead of leads) {
      grouped[getSegment(lead)].push(lead)
    }

    for (const key of Object.keys(grouped) as Segment[]) {
      grouped[key].sort((a, b) => computeMaturity(b) - computeMaturity(a))
    }

    return grouped
  }, [leads])

  return (
    <div className="dash-profile">
      {SEGMENT_ORDER.map((seg) => {
        const segLeads = segments[seg]
        if (segLeads.length === 0) return null

        const withContact = segLeads.filter((l) => l.nombre || l.email || l.whatsapp).length
        const withFicha = segLeads.filter((l) => l.ficha_created).length
        const withInmo = segLeads.filter((l) => l.inmo_status === 'completed').length
        const avgMaturity = Math.round(segLeads.reduce((s, l) => s + computeMaturity(l), 0) / segLeads.length)

        return (
          <div key={seg} className="dash-profile__segment">
            <div className="dash-profile__segment-header">
              <h3 className="dash-profile__segment-title">{SEGMENT_LABELS[seg]}</h3>
              <span className="dash-profile__segment-count">{segLeads.length} leads</span>
            </div>

            <div className="dash-profile__segment-stats">
              <div className="dash-profile__stat">
                <span className="dash-profile__stat-value">{avgMaturity}</span>
                <span className="dash-profile__stat-label">Score promedio</span>
              </div>
              <div className="dash-profile__stat">
                <span className="dash-profile__stat-value">{withContact}</span>
                <span className="dash-profile__stat-label">Con contacto</span>
              </div>
              <div className="dash-profile__stat">
                <span className="dash-profile__stat-value">{withFicha}</span>
                <span className="dash-profile__stat-label">Con ficha</span>
              </div>
              <div className="dash-profile__stat">
                <span className="dash-profile__stat-value">{withInmo}</span>
                <span className="dash-profile__stat-label">Form completo</span>
              </div>
            </div>

            <div className="dash-profile__leads">
              {segLeads.slice(0, 20).map((lead) => {
                const maturity = computeMaturity(lead)
                const matClass = maturity >= 60 ? 'high' : maturity >= 30 ? 'mid' : 'low'
                return (
                  <div key={lead.id} className="dash-profile__lead">
                    <div className="dash-profile__lead-info">
                      <div className="dash-profile__lead-name">
                        {lead.nombre ?? lead.email ?? lead.id.slice(0, 12)}
                      </div>
                      <div className="dash-profile__lead-meta">
                        {lead.ciudad && <span>{lead.ciudad}</span>}
                        {lead.precio_venta && <span>${Number(lead.precio_venta).toLocaleString('es-CO')}</span>}
                        {lead.checklist_total > 0 && (
                          <span>Checklist: {lead.checklist_done}/{lead.checklist_total}</span>
                        )}
                      </div>
                    </div>

                    {lead.active_stage && (
                      <span className={`dash-profile__stage-pill dash-profile__stage-pill--${lead.active_stage}`}>
                        {STAGE_LABELS[lead.active_stage]}
                      </span>
                    )}

                    <div className="dash-profile__maturity">
                      <div className="dash-profile__maturity-bar">
                        <div
                          className={`dash-profile__maturity-fill dash-profile__maturity-fill--${matClass}`}
                          style={{ width: `${maturity}%` }}
                        />
                      </div>
                      <span className="dash-profile__maturity-score">{maturity}</span>
                    </div>
                  </div>
                )
              })}
              {segLeads.length > 20 && (
                <div className="dash-profile__empty">
                  +{segLeads.length - 20} leads adicionales
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
