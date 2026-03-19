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

const FEATURE_ICON_MAP: Record<string, string> = {
  'Vigilancia privada': '/assets/icon-feat-vigilancia.svg',
  'Piscina': '/assets/icon-feat-piscina.svg',
  'Walking closet': '/assets/icon-feat-vestier.svg',
  'Ascensor': '/assets/icon-feat-ascensor.svg',
  'Cuarto de servicio': '/assets/icon-feat-cuarto-servicio.svg',
  'Parqueadero': '/assets/icon-feat-parqueadero.svg',
  'Estudio': '/assets/icon-feat-estudio.svg',
  'Gimnasio': '/assets/icon-feat-gimnasio.svg',
  'Depósito': '/assets/icon-feat-deposito.svg',
  'Pisos de madera': '/assets/icon-feat-piso-madera.svg',
  'Terraza': '/assets/icon-feat-terraza.svg',
  'Salón social': '/assets/icon-feat-salon-social.svg',
  'Parque infantil': '/assets/icon-feat-parque-infantil.svg',
  'BBQ': '/assets/icon-feat-bbq.svg',
  'Vista exterior': '/assets/icon-feat-vista-exterior.svg',
  'Chimenea': '/assets/icon-feat-chimenea.svg',
  'Vestier': '/assets/icon-feat-vestier.svg',
  'Piso de madera': '/assets/icon-feat-piso-madera.svg',
}

const GEOCODE_URL = 'https://nominatim.openstreetmap.org/search'

const VIA_ABBREVS: Record<string, string> = {
  cll: 'Calle', cl: 'Calle', calle: 'Calle',
  cra: 'Carrera', cr: 'Carrera', kr: 'Carrera', kra: 'Carrera', carrera: 'Carrera',
  dg: 'Diagonal', diagonal: 'Diagonal',
  tv: 'Transversal', trans: 'Transversal', transversal: 'Transversal',
  av: 'Avenida', avenida: 'Avenida',
}

function parseColombianAddress(direccion: string): { via1: string; via2: string } | null {
  const parts = direccion.split('#')
  if (parts.length < 2) return null

  const beforeHash = parts[0].trim()
  const afterHash = parts[1].trim()

  const viaMatch = beforeHash.match(/^(\w+)\.?\s+(.+)$/i)
  if (!viaMatch) return null

  const viaType = VIA_ABBREVS[viaMatch[1].toLowerCase()]
  if (!viaType) return null
  const viaNum = viaMatch[2].trim()

  const crossNum = afterHash.match(/^(\d+)/)?.[1]
  if (!crossNum) return null

  const crossType = (viaType === 'Calle') ? 'Carrera'
    : (viaType === 'Carrera') ? 'Calle'
    : 'Carrera'

  return { via1: `${viaType} ${viaNum}`, via2: `${crossType} ${crossNum}` }
}

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

      const DEFAULT_LAT = 4.711, DEFAULT_LNG = -74.0721
      let lat = DEFAULT_LAT, lng = DEFAULT_LNG
      const isDefault = () => lat === DEFAULT_LAT && lng === DEFAULT_LNG

      const headers = { 'Accept-Language': 'es' }
      const base = `${GEOCODE_URL}?format=json&limit=1&countrycodes=co`

      const geocodeQuery = async (q: string) => {
        const res = await fetch(`${base}&q=${encodeURIComponent(q)}`, { headers })
        const results = await res.json()
        if (results.length > 0) return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) }
        return null
      }

      try {
        // Strategy 1: intersection — parse address into two streets, geocode each within barrio
        if (data.direccion && data.ciudad) {
          const parsed = parseColombianAddress(data.direccion)
          if (parsed) {
            const scope = [data.barrio, data.ciudad, 'Colombia'].filter(Boolean).join(', ')
            const [r1, r2] = await Promise.all([
              geocodeQuery(`${parsed.via1}, ${scope}`),
              geocodeQuery(`${parsed.via2}, ${scope}`),
            ])
            if (r1 && r2) {
              lat = (r1.lat + r2.lat) / 2
              lng = (r1.lng + r2.lng) / 2
            } else if (r1) {
              lat = r1.lat; lng = r1.lng
            } else if (r2) {
              lat = r2.lat; lng = r2.lng
            }
          }
        }

        // Strategy 2: free-text full address + barrio + city
        if (isDefault() && data.direccion && data.ciudad) {
          const parts = [data.direccion, data.barrio, data.ciudad, 'Colombia'].filter(Boolean)
          const r = await geocodeQuery(parts.join(', '))
          if (r) { lat = r.lat; lng = r.lng }
        }

        // Strategy 3: free-text address + city (no barrio)
        if (isDefault() && data.direccion && data.ciudad) {
          const r = await geocodeQuery([data.direccion, data.ciudad, 'Colombia'].join(', '))
          if (r) { lat = r.lat; lng = r.lng }
        }

        // Strategy 4: barrio + city
        if (isDefault() && data.barrio && data.ciudad) {
          const r = await geocodeQuery([data.barrio, data.ciudad, 'Colombia'].join(', '))
          if (r) { lat = r.lat; lng = r.lng }
        }

        // Strategy 5: just city
        if (isDefault() && data.ciudad) {
          const r = await geocodeQuery(data.ciudad + ', Colombia')
          if (r) { lat = r.lat; lng = r.lng }
        }
      } catch { /* fallback to Bogotá coords */ }

      if (cancelled || !mapRef.current) return

      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
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

      const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map)

      marker.on('dragend', () => {
        const pos = marker.getLatLng()
        map.panTo(pos)
      })

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
            <span>{[data.direccion, data.numeroApto ? `Apto ${data.numeroApto}` : '', data.barrio, data.ciudad, 'Colombia'].filter(Boolean).join(', ')}</span>
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
            <h2>Propiedad en venta</h2>
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
          <p className="ficha-preview-map-hint">Arrastra el pin para ajustar la ubicación</p>
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
                  <img src={FEATURE_ICON_MAP[f]} alt="" className="ficha-preview-feature-icon-img" />
                </span>
                <div className="ficha-preview-feature-text">
                  <span className="ficha-preview-feature-name">{f}</span>
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
