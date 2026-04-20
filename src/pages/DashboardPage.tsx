import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { fetchLeads, computeKPIs, type LeadRow, type KPIs, type SourceFilter, type TableFilters } from '../lib/dashboard-queries'
import { DashboardKPIs } from '../components/DashboardKPIs/DashboardKPIs'
import { DashboardTable } from '../components/DashboardTable/DashboardTable'
import { DashboardProfile } from '../components/DashboardProfile/DashboardProfile'
import './DashboardPage.css'

type Tab = 'kpis' | 'table' | 'profile'

export function DashboardPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('kpis')
  const [source, setSource] = useState<SourceFilter>('all')
  const [leads, setLeads] = useState<LeadRow[]>([])
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [tableFilters, setTableFilters] = useState<TableFilters>({})
  const [filterKey, setFilterKey] = useState(0)

  const handleDrillDown = useCallback((filter: TableFilters) => {
    setTableFilters(filter)
    setFilterKey((k) => k + 1)
    setTab('table')
  }, [])

  const handleSourceClick = useCallback((src: SourceFilter) => {
    setSource(src)
    setTableFilters({})
    setFilterKey((k) => k + 1)
    setTab('table')
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    const data = await fetchLeads(source)
    setLeads(data)
    setKpis(computeKPIs(data))
    setLastUpdate(new Date())
    setLoading(false)
  }, [source])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate('/dashboard/login')
        return
      }
      loadData()
    })
  }, [navigate, loadData])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/dashboard/login')
  }

  return (
    <div className="dashboard">
      <div className="dashboard__topbar">
        <div className="dashboard__topbar-left">
          <div className="dashboard__topbar-logo">
            <img src="/2bc36bdde701d513cede283c7a15271c0c1b36bf.svg" alt="Habi" />
          </div>
          <span className="dashboard__topbar-title">
            Ayuda<span>ventas</span> Dashboard
          </span>
        </div>
        <div className="dashboard__topbar-right">
          {lastUpdate && (
            <span className="dashboard__last-update">
              Actualizado: {lastUpdate.toLocaleTimeString('es-CO')}
            </span>
          )}
          <select
            className="dashboard__source-select"
            value={source}
            onChange={(e) => setSource(e.target.value as SourceFilter)}
          >
            <option value="all">Todas las fuentes</option>
            <option value="ayudaventas">Ayudaventas</option>
            <option value="resgestion">Resgestion</option>
          </select>
          <button className="dashboard__refresh-btn" onClick={loadData} disabled={loading}>
            {loading ? 'Cargando...' : '↻ Actualizar'}
          </button>
          <button className="dashboard__logout-btn" onClick={handleLogout}>Salir</button>
        </div>
      </div>

      <div className="dashboard__tabs">
        <button className={`dashboard__tab${tab === 'kpis' ? ' dashboard__tab--active' : ''}`} onClick={() => setTab('kpis')}>
          Resumen
        </button>
        <button className={`dashboard__tab${tab === 'table' ? ' dashboard__tab--active' : ''}`} onClick={() => setTab('table')}>
          Tabla de leads
        </button>
        <button className={`dashboard__tab${tab === 'profile' ? ' dashboard__tab--active' : ''}`} onClick={() => setTab('profile')}>
          Perfilamiento
        </button>
      </div>

      <div className="dashboard__content">
        {loading ? (
          <div className="dashboard__loading">
            <div className="dashboard__spinner" />
            Cargando datos...
          </div>
        ) : (
          <>
            {tab === 'kpis' && kpis && (
              <DashboardKPIs
                kpis={kpis}
                onDrillDown={handleDrillDown}
                onSourceClick={handleSourceClick}
              />
            )}
            {tab === 'table' && <DashboardTable leads={leads} initialFilters={tableFilters} filterKey={filterKey} />}
            {tab === 'profile' && <DashboardProfile leads={leads} />}
          </>
        )}
      </div>
    </div>
  )
}
