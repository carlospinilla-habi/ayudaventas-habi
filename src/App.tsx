import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { VenderSinAfanPage } from './pages/VenderSinAfanPage'
import { VenderUrgentePage } from './pages/VenderUrgentePage'
import { CambiarDeCasaPage } from './pages/CambiarDeCasaPage'
import { TemaLegalPage } from './pages/TemaLegalPage'
import { getOrCreateUserId } from './lib/supabase'

const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const DashboardLoginPage = lazy(() => import('./pages/DashboardLoginPage').then(m => ({ default: m.DashboardLoginPage })))

getOrCreateUserId()

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/vender-sin-afan" element={<VenderSinAfanPage />} />
      <Route path="/vender-urgente" element={<VenderUrgentePage />} />
      <Route path="/cambiar-de-casa" element={<CambiarDeCasaPage />} />
      <Route path="/tema-legal" element={<TemaLegalPage />} />
      <Route path="/dashboard" element={<Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>}><DashboardPage /></Suspense>} />
      <Route path="/dashboard/login" element={<Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>}><DashboardLoginPage /></Suspense>} />
    </Routes>
  )
}

export default App
