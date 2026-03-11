import { useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { VsaSidebar } from '../components/VsaSidebar'
import { VsaHero } from '../components/VsaHero'
import { VsaProgress } from '../components/VsaProgress'
import { VsaGuide } from '../components/VsaGuide'
import './VenderSinAfanPage.css'

export function VenderSinAfanPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Navbar />
      <div className="vsa-body" data-node-id="309:51603">
        <VsaSidebar activePage="sin-afan" />
        <main className="vsa-content" data-node-id="309:51584">
          <VsaHero />
          <VsaProgress />
          <VsaGuide />
        </main>
      </div>
      <Footer />
    </>
  )
}
