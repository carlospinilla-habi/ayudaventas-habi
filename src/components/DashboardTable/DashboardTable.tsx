import { Fragment, useMemo, useState } from 'react'
import type { LeadRow } from '../../lib/dashboard-queries'
import { INTEREST_LABELS, STAGE_LABELS, computeMaturity } from '../../lib/dashboard-queries'
import './DashboardTable.css'

interface Props {
  leads: LeadRow[]
}

type SortKey = 'created_at' | 'source' | 'user_interest' | 'active_stage' | 'nombre' | 'ciudad' | 'maturity'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 25

export function DashboardTable({ leads }: Props) {
  const [search, setSearch] = useState('')
  const [interestFilter, setInterestFilter] = useState('all')
  const [stageFilter, setStageFilter] = useState('all')
  const [inmoFilter, setInmoFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    let rows = leads

    if (search) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.nombre?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.whatsapp?.includes(q)
      )
    }

    if (interestFilter !== 'all') {
      rows = rows.filter((r) => r.user_interest === interestFilter)
    }
    if (stageFilter !== 'all') {
      rows = rows.filter((r) => r.active_stage === Number(stageFilter))
    }
    if (inmoFilter !== 'all') {
      rows = rows.filter((r) => {
        if (inmoFilter === 'completed') return r.inmo_status === 'completed'
        if (inmoFilter === 'in_progress') return r.inmo_status === 'in_progress'
        return !r.inmo_status
      })
    }

    rows = [...rows].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'maturity') {
        cmp = computeMaturity(a) - computeMaturity(b)
      } else {
        const av = a[sortKey] ?? ''
        const bv = b[sortKey] ?? ''
        cmp = String(av).localeCompare(String(bv))
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return rows
  }, [leads, search, interestFilter, stageFilter, inmoFilter, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
    setPage(0)
  }

  function SortIcon({ col }: { col: SortKey }) {
    const active = sortKey === col
    return (
      <span className={`dash-table__sort-icon${active ? ' dash-table__sort-icon--active' : ''}`}>
        {active ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
      </span>
    )
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="dash-table">
      <div className="dash-table__filters">
        <input
          className="dash-table__search"
          placeholder="Buscar por nombre, email, ID..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
        />
        <select className="dash-table__select" value={interestFilter} onChange={(e) => { setInterestFilter(e.target.value); setPage(0) }}>
          <option value="all">Todo interés</option>
          {Object.entries(INTEREST_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select className="dash-table__select" value={stageFilter} onChange={(e) => { setStageFilter(e.target.value); setPage(0) }}>
          <option value="all">Todo momento</option>
          {Object.entries(STAGE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select className="dash-table__select" value={inmoFilter} onChange={(e) => { setInmoFilter(e.target.value); setPage(0) }}>
          <option value="all">Formulario: todos</option>
          <option value="completed">Completado</option>
          <option value="in_progress">En progreso</option>
          <option value="none">Sin formulario</option>
        </select>
        <span className="dash-table__count">{filtered.length} leads</span>
      </div>

      <div className="dash-table__wrap">
        <table className="dash-table__table">
          <thead>
            <tr>
              <th onClick={() => handleSort('created_at')}>Fecha <SortIcon col="created_at" /></th>
              <th>ID</th>
              <th onClick={() => handleSort('source')}>Source <SortIcon col="source" /></th>
              <th onClick={() => handleSort('user_interest')}>Interés <SortIcon col="user_interest" /></th>
              <th onClick={() => handleSort('active_stage')}>Momento <SortIcon col="active_stage" /></th>
              <th>Ficha</th>
              <th>Inmo form</th>
              <th>Oferta</th>
              <th onClick={() => handleSort('nombre')}>Contacto <SortIcon col="nombre" /></th>
              <th onClick={() => handleSort('ciudad')}>Ciudad <SortIcon col="ciudad" /></th>
              <th onClick={() => handleSort('maturity')}>Score <SortIcon col="maturity" /></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((lead) => {
              const expanded = expandedId === lead.id
              const maturity = computeMaturity(lead)
              return (
                <Fragment key={lead.id}>
                  <tr className={expanded ? 'dash-table__row--expanded' : ''}>
                    <td>{formatDate(lead.created_at)}</td>
                    <td><span className="dash-table__id">{lead.id.slice(0, 8)}</span></td>
                    <td><span className="dash-table__badge dash-table__badge--source">{lead.source ?? '—'}</span></td>
                    <td>{lead.user_interest ? (INTEREST_LABELS[lead.user_interest] ?? lead.user_interest) : '—'}</td>
                    <td>{lead.active_stage ? STAGE_LABELS[lead.active_stage] : '—'}</td>
                    <td>{lead.ficha_created ? <span className="dash-table__badge dash-table__badge--yes">Sí</span> : '—'}</td>
                    <td>
                      {lead.inmo_status === 'completed' && <span className="dash-table__badge dash-table__badge--completed">Completado</span>}
                      {lead.inmo_status === 'in_progress' && <span className="dash-table__badge dash-table__badge--progress">En progreso</span>}
                      {!lead.inmo_status && '—'}
                    </td>
                    <td>{lead.oferta_requested ? <span className="dash-table__badge dash-table__badge--yes">Sí</span> : '—'}</td>
                    <td>
                      {lead.nombre || lead.email || lead.whatsapp ? (
                        <div style={{ lineHeight: 1.4 }}>
                          {lead.nombre && <div>{lead.nombre}</div>}
                          {lead.email && <div style={{ fontSize: 11, color: '#6b7280' }}>{lead.email}</div>}
                          {lead.whatsapp && <div style={{ fontSize: 11, color: '#6b7280' }}>{lead.whatsapp}</div>}
                        </div>
                      ) : '—'}
                    </td>
                    <td>{lead.ciudad ?? '—'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 40, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${maturity}%`, height: '100%', background: maturity >= 60 ? '#22c55e' : maturity >= 30 ? '#eab308' : '#d1d5db', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{maturity}</span>
                      </div>
                    </td>
                    <td>
                      <button className="dash-table__toggle" onClick={() => setExpandedId(expanded ? null : lead.id)}>
                        {expanded ? '▲ Cerrar' : '▼ Ver'}
                      </button>
                    </td>
                  </tr>
                  {expanded && (
                    <tr className="dash-table__detail">
                      <td colSpan={12}>
                        <div className="dash-table__detail-grid">
                          <DetailItem label="ID completo" value={lead.id} />
                          <DetailItem label="Fecha registro" value={formatDate(lead.created_at)} />
                          <DetailItem label="Source" value={lead.source ?? '—'} />
                          <DetailItem label="Interés" value={lead.user_interest ? (INTEREST_LABELS[lead.user_interest] ?? lead.user_interest) : '—'} />
                          <DetailItem label="Momento venta" value={lead.active_stage ? STAGE_LABELS[lead.active_stage] : '—'} />
                          <DetailItem label="Tipo inmueble" value={lead.tipo_inmueble ?? '—'} />
                          <DetailItem label="Ciudad" value={lead.ciudad ?? '—'} />
                          <DetailItem label="Precio venta" value={lead.precio_venta ? `$${Number(lead.precio_venta).toLocaleString('es-CO')}` : '—'} />
                          <DetailItem label="Nombre" value={lead.nombre ?? '—'} />
                          <DetailItem label="Email" value={lead.email ?? '—'} />
                          <DetailItem label="WhatsApp" value={lead.whatsapp ?? '—'} />
                          <DetailItem label="Ficha creada" value={lead.ficha_created ? 'Sí' : 'No'} />
                          <DetailItem label="Oferta solicitada" value={lead.oferta_requested ? 'Sí' : 'No'} />
                          <DetailItem label="Form inmobiliario" value={lead.inmo_status ?? 'No iniciado'} />
                          <DetailItem label="Form completado" value={lead.inmo_completed_at ? formatDate(lead.inmo_completed_at) : '—'} />
                          <DetailItem label="Checklist" value={lead.checklist_total > 0 ? `${lead.checklist_done}/${lead.checklist_total} tareas` : 'Sin progreso'} />
                          <DetailItem label="Score madurez" value={`${maturity}/100`} />
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
            {paged.length === 0 && (
              <tr><td colSpan={12} style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>No se encontraron leads</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="dash-table__pagination">
          <button className="dash-table__page-btn" disabled={page === 0} onClick={() => setPage(page - 1)}>← Anterior</button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = totalPages <= 7 ? i : page <= 3 ? i : page >= totalPages - 4 ? totalPages - 7 + i : page - 3 + i
            return (
              <button key={p} className={`dash-table__page-btn${p === page ? ' dash-table__page-btn--active' : ''}`} onClick={() => setPage(p)}>
                {p + 1}
              </button>
            )
          })}
          <button className="dash-table__page-btn" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Siguiente →</button>
        </div>
      )}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="dash-table__detail-item">
      <span className="dash-table__detail-label">{label}</span>
      <span className="dash-table__detail-value">{value}</span>
    </div>
  )
}

