import { forwardRef, useEffect, useRef, useState } from 'react'
import type { FichaData } from './FichaCreator'
import './FichaPreview.css'

interface Props {
  data: FichaData
  photos: string[]
}

function formatPrice(raw: string): string {
  if (!raw) return '$0'
  return '$' + Number(raw).toLocaleString('es-CO')
}

function generateHeroTitle(data: FichaData): string {
  if (data.barrio) return `Tu hogar cerca de ${data.barrio}.`
  if (data.ciudad) return `Tu hogar en ${data.ciudad}.`
  return 'Tu próximo hogar.'
}

const FEATURE_ICON_MAP: Record<string, JSX.Element> = {
  'Vigilancia privada': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1.667l6.667 2.5v5c0 4.166-2.834 7.5-6.667 8.833-3.833-1.333-6.667-4.667-6.667-8.833v-5L10 1.667z" stroke="#404040" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  'Piscina': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2.5 13.333c1.667 1.667 3.333 1.667 5 0 1.667-1.666 3.333-1.666 5 0 1.667 1.667 3.333 1.667 5 0M2.5 16.667c1.667 1.666 3.333 1.666 5 0 1.667-1.667 3.333-1.667 5 0 1.667 1.666 3.333 1.666 5 0M5.833 10V5M14.167 10V5M5.833 7.5h8.334" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  'Vestier': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6.667 2.5h6.666M10 2.5V5M5 5h10l-1.25 12.5H6.25L5 5z" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  'Ascensor': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3.333" y="2.5" width="13.333" height="15" rx="1.5" stroke="#404040" strokeWidth="1.2"/><path d="M10 2.5v15M7 8l-1.5-2L4 8M13 12l1.5 2L16 12" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  'Cuarto de servicio': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3.333" y="5.833" width="13.333" height="10" rx="1.5" stroke="#404040" strokeWidth="1.2"/><path d="M7.5 5.833V4.167a2.5 2.5 0 015 0v1.666" stroke="#404040" strokeWidth="1.2" strokeLinecap="round"/><circle cx="10" cy="10.833" r="1.667" stroke="#404040" strokeWidth="1.2"/></svg>,
  'Parqueadero': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="2.5" width="15" height="15" rx="2.5" stroke="#404040" strokeWidth="1.2"/><path d="M7.5 14.167V5.833h3.75a2.917 2.917 0 010 5.834H7.5" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  'Estudio': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3.333 5l6.667-2.5L16.667 5l-6.667 2.5L3.333 5z" stroke="#404040" strokeWidth="1.2" strokeLinejoin="round"/><path d="M3.333 5v5M16.667 5v5M6.667 6.25v5c0 1.38 1.49 2.5 3.333 2.5s3.333-1.12 3.333-2.5v-5" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  'Gimnasio': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6.667 7.5v5M13.333 7.5v5M6.667 10h6.666M4.167 8.333v3.334M15.833 8.333v3.334M2.5 9.167v1.666M17.5 9.167v1.666" stroke="#404040" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  'Depósito': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3.333 8.333L10 4.167l6.667 4.166V15.833a.833.833 0 01-.834.834H4.167a.833.833 0 01-.834-.834V8.333z" stroke="#404040" strokeWidth="1.2" strokeLinejoin="round"/><path d="M7.5 16.667v-5h5v5" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  'Piso de madera': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="3.333" width="15" height="13.333" rx="1" stroke="#404040" strokeWidth="1.2"/><path d="M2.5 10h15M10 3.333V10M7.5 10v6.667M12.5 10v6.667" stroke="#404040" strokeWidth="1.2"/></svg>,
  'Terraza': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2.5 17.5h15M10 5v12.5M5 10l5-5 5 5M3.333 17.5V12.5M16.667 17.5V12.5" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  'Salón social': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17.5 12.5c0 2.761-3.358 5-7.5 5s-7.5-2.239-7.5-5 3.358-5 7.5-5 7.5 2.239 7.5 5z" stroke="#404040" strokeWidth="1.2"/><path d="M10 2.5a2.5 2.5 0 00-2.5 2.5v2.5h5V5A2.5 2.5 0 0010 2.5z" stroke="#404040" strokeWidth="1.2"/></svg>,
  'Parques infantil': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 17.5V5M15 17.5V5M5 5h10M5 10h10" stroke="#404040" strokeWidth="1.2" strokeLinecap="round"/><path d="M7.5 10l-2.5 5M12.5 10l2.5 5" stroke="#404040" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  'BBQ': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="5.833" stroke="#404040" strokeWidth="1.2"/><path d="M7.5 15.833l-1.667 2.5M12.5 15.833l1.667 2.5M10 15.833V18.333M8.333 4.167c0 .92.746 1.666 1.667 1.666s1.667-.746 1.667-1.666" stroke="#404040" strokeWidth="1.2" strokeLinecap="round"/><path d="M7.5 10h5" stroke="#404040" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  'Vista exterior': <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2.5 15.833l4.167-5.833 3.333 4.167L13.333 10l4.167 5.833" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14.167" cy="6.667" r="1.667" stroke="#404040" strokeWidth="1.2"/></svg>,
}

const GEOCODE_URL = 'https://nominatim.openstreetmap.org/search'

const FichaPreview = forwardRef<HTMLDivElement, Props>(({ data, photos }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [, setMapReady] = useState(false)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    let cancelled = false

    const initMap = async () => {
      const L = await import('leaflet')
      await import('leaflet/dist/leaflet.css')

      if (cancelled || !mapRef.current) return

      const address = [data.direccion, data.barrio, data.ciudad, 'Colombia'].filter(Boolean).join(', ')

      let lat = 4.711, lng = -74.0721
      try {
        const res = await fetch(`${GEOCODE_URL}?q=${encodeURIComponent(address)}&format=json&limit=1`, {
          headers: { 'Accept-Language': 'es' }
        })
        const results = await res.json()
        if (results.length > 0) {
          lat = parseFloat(results[0].lat)
          lng = parseFloat(results[0].lon)
        }
      } catch { /* fallback to Bogotá coords */ }

      if (cancelled || !mapRef.current) return

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map)

      const icon = L.divIcon({
        className: 'ficha-map-marker',
        html: '<div class="ficha-map-pin"><svg width="32" height="40" viewBox="0 0 32 40" fill="none"><path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24C32 7.163 24.837 0 16 0z" fill="#7955f9"/><circle cx="16" cy="16" r="6" fill="#fff"/></svg></div>',
        iconSize: [32, 40],
        iconAnchor: [16, 40],
      })

      L.marker([lat, lng], { icon }).addTo(map)

      mapInstanceRef.current = map
      setMapReady(true)
    }

    initMap()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [data.direccion, data.barrio, data.ciudad])

  const mainPhoto = photos[0] || ''
  const gridPhotos = photos.slice(1, 9)
  const displayTitle = data.titulo || 'Tu propiedad'
  const heroTitle = generateHeroTitle(data)

  const resumenItems: string[] = []
  if (data.tipoInmueble) resumenItems.push(data.tipoInmueble)
  if (data.antiguedad) resumenItems.push(`Construido hace ${data.antiguedad} años`)
  if (data.parqueaderos && data.parqueaderos !== '0') resumenItems.push(`${data.parqueaderos} espacio${data.parqueaderos !== '1' ? 's' : ''} de parqueadero`)
  if (data.adminMes) resumenItems.push(`$${Number(data.adminMes).toLocaleString('es-CO')} cuota mensual de admin.`)
  if (data.areaM2) resumenItems.push(`${data.areaM2} metros cuadrados`)
  if (data.piso) resumenItems.push(`Piso ${data.piso}`)
  if (data.estrato) resumenItems.push(`Estrato ${data.estrato}`)

  return (
    <div className="ficha-preview" ref={ref}>
      {/* Header */}
      <div className="ficha-preview-header">
        <div className="ficha-preview-header-left">
          <div className="ficha-preview-stars">★★★★★</div>
          <h1 className="ficha-preview-title">{displayTitle.toUpperCase()}.</h1>
          <div className="ficha-preview-address">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.167A4.083 4.083 0 002.917 5.25C2.917 8.167 7 12.833 7 12.833s4.083-4.667 4.083-7.583A4.083 4.083 0 007 1.167zm0 5.541a1.458 1.458 0 110-2.916 1.458 1.458 0 010 2.917z" fill="#737373"/></svg>
            <span>{[data.direccion, data.barrio, data.ciudad, 'Colombia'].filter(Boolean).join(', ')}</span>
          </div>
        </div>
        <div className="ficha-preview-header-right">
          <span className="ficha-preview-price">{formatPrice(data.precioVenta)}.</span>
        </div>
      </div>

      {/* Badges */}
      <div className="ficha-preview-badges">
        {data.habitaciones && (
          <span className="ficha-preview-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="7" width="12" height="6" rx="1" stroke="#404040" strokeWidth="1.2"/><path d="M4 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#404040" strokeWidth="1.2"/></svg>
            {data.habitaciones} habitación{data.habitaciones !== '1' ? 'es' : ''}
          </span>
        )}
        {data.banos && (
          <span className="ficha-preview-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12M4 8V4a2 2 0 012-2h0a2 2 0 012 2v4M2 8v3a3 3 0 003 3h6a3 3 0 003-3V8" stroke="#404040" strokeWidth="1.2" strokeLinecap="round"/></svg>
            {data.banos} baño{data.banos !== '1' ? 's' : ''}
          </span>
        )}
        {data.parqueaderos && data.parqueaderos !== '0' && (
          <span className="ficha-preview-badge">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="#404040" strokeWidth="1.2"/><path d="M6 11V5h2.5a2 2 0 010 4H6" stroke="#404040" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {data.parqueaderos} parqueadero{data.parqueaderos !== '1' ? 's' : ''}
          </span>
        )}
      </div>

      {/* Hero photo with overlay title */}
      {mainPhoto && (
        <div className="ficha-preview-hero">
          <img src={mainPhoto} alt="Foto principal" />
          <div className="ficha-preview-hero-overlay">
            <h2>{heroTitle}</h2>
            <p>Facilita la venta de tu casa y avanza.</p>
          </div>
        </div>
      )}

      {/* Photo grid — 2 rows x 4 cols = up to 8 photos */}
      {gridPhotos.length > 0 && (
        <div className="ficha-preview-photo-grid">
          {gridPhotos.map((src, i) => (
            <div key={i} className="ficha-preview-photo-cell">
              <img src={src} alt={`Foto ${i + 2}`} />
            </div>
          ))}
        </div>
      )}

      {/* Description + Contact */}
      <div className="ficha-preview-two-col">
        <div className="ficha-preview-desc-col">
          <h3>Acerca de la propiedad.</h3>
          <p>{data.descripcion || 'Sin descripción proporcionada.'}</p>
        </div>
        <div className="ficha-preview-contact-col">
          <h3>Contacto.</h3>
          {data.nombre && (
            <div className="ficha-preview-contact-row">
              <strong>{data.nombre}</strong>
            </div>
          )}
          {data.email && (
            <div className="ficha-preview-contact-row">
              <span className="ficha-preview-contact-label">Correo electrónico:</span>
              <div className="ficha-preview-contact-value">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4l6 4 6-4M2 4v8h12V4H2z" stroke="#737373" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                <span>{data.email}</span>
              </div>
            </div>
          )}
          {data.whatsapp && (
            <div className="ficha-preview-contact-row">
              <span className="ficha-preview-contact-label">Contacto:</span>
              <div className="ficha-preview-contact-value">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1a7 7 0 00-6.09 10.49L1 15l3.56-.93A7 7 0 108 1z" stroke="#737373" strokeWidth="1.2"/></svg>
                <span>{data.whatsapp}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map + Resumen */}
      <div className="ficha-preview-map-resumen">
        <div className="ficha-preview-map-wrap">
          <div className="ficha-preview-map" ref={mapRef} />
        </div>
        {resumenItems.length > 0 && (
          <div className="ficha-preview-resumen">
            <h3>Resumen.</h3>
            <ul className="ficha-preview-resumen-list">
              {resumenItems.map((item, i) => (
                <li key={i}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="#737373" strokeWidth="1"/><circle cx="7" cy="7" r="2" fill="#737373"/></svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Aspectos destacados */}
      {data.features.length > 0 && (
        <div className="ficha-preview-features">
          <h3>Aspectos destacados de la propiedad.</h3>
          <div className="ficha-preview-features-grid">
            {data.features.map(f => (
              <div key={f} className="ficha-preview-feature-item">
                <span className="ficha-preview-feature-icon">
                  {FEATURE_ICON_MAP[f] || <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="#404040" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
                <div className="ficha-preview-feature-text">
                  <span className="ficha-preview-feature-name">{f}.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

FichaPreview.displayName = 'FichaPreview'
export default FichaPreview
