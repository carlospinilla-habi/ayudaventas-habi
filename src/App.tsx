import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { VenderSinAfanPage } from './pages/VenderSinAfanPage'
import { VenderUrgentePage } from './pages/VenderUrgentePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/vender-sin-afan" element={<VenderSinAfanPage />} />
      <Route path="/vender-urgente" element={<VenderUrgentePage />} />
    </Routes>
  )
}

export default App
