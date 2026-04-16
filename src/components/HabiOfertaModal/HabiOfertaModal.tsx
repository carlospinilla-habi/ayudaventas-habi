import { useEffect } from 'react'
import './HabiOfertaModal.css'

const DEFAULT_URL = ' https://habi.co/formulario-inmueble/direccion?utm_content=help_to_sell'

interface Props {
  open: boolean
  onClose: () => void
  url?: string
}

export default function HabiOfertaModal({ open, onClose, url = DEFAULT_URL }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="habi-modal-overlay" onClick={onClose}>
      <div className="habi-modal-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="habi-modal-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <iframe
          src={url}
          className="habi-modal-iframe"
          title="Formulario Habi"
          allow="geolocation"
        />
      </div>
    </div>
  )
}
