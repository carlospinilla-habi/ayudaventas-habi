import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { VenderSinAfanPage } from './pages/VenderSinAfanPage'
import { VenderUrgentePage } from './pages/VenderUrgentePage'
import { CambiarDeCasaPage } from './pages/CambiarDeCasaPage'
import { TemaLegalPage } from './pages/TemaLegalPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/vender-sin-afan" element={<VenderSinAfanPage />} />
      <Route path="/vender-urgente" element={<VenderUrgentePage />} />
      <Route path="/cambiar-de-casa" element={<CambiarDeCasaPage />} />
      <Route path="/tema-legal" element={<TemaLegalPage />} />
    </Routes>
  )
}

export default App
