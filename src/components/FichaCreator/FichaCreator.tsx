import { useState, useCallback, useEffect, useRef } from 'react'
import FichaPreview from './FichaPreview'
import { toJpeg } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { saveFichaData, trackFichaCreated } from '../../lib/storage-sync'
import './FichaCreator.css'

/* ── Types ─────────────────────────────── */

export interface FichaData {
  titulo: string
  tipoInmueble: string
  ciudad: string
  barrio: string
  direccion: string
  numeroApto: string
  areaM2: string
  antiguedad: string
  parqueaderos: string
  banos: string
  habitaciones: string
  piso: string
  estrato: string
  adminMes: string
  precioVenta: string
  descripcion: string
  features: string[]
  nombre: string
  email: string
  whatsapp: string
}

const EMPTY_DATA: FichaData = {
  titulo: '', tipoInmueble: '', ciudad: '', barrio: '', direccion: '',
  numeroApto: '', areaM2: '', antiguedad: '', parqueaderos: '', banos: '',
  habitaciones: '', piso: '', estrato: '', adminMes: '', precioVenta: '',
  descripcion: '', features: [], nombre: '', email: '', whatsapp: '',
}

const STORAGE_KEY = 'ficha-creator-data'
const STORAGE_PHOTOS_KEY = 'ficha-creator-photos'

const CIUDADES = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Manizales', 'Santa Marta', 'Ibagué']
const TIPOS = ['Apartamento', 'Casa', 'Oficina', 'Local comercial', 'Lote', 'Finca']
const ESTRATOS = ['1', '2', '3', '4', '5', '6']
const NUMS_14 = ['1', '2', '3', '4+']
const NUMS_03 = ['0', '1', '2', '3+']

const ALL_FEATURES = [
  'Vigilancia privada', 'Piscina', 'Walking closet', 'Ascensor',
  'Cuarto de servicio', 'Parqueadero', 'Estudio', 'Gimnasio',
  'Depósito', 'Pisos de madera', 'Terraza', 'Salón social',
  'Parque infantil', 'BBQ', 'Vista exterior', 'Chimenea',
]

/* ── Helpers ────────────────────────────── */

function formatCurrency(value: string): string {
  const nums = value.replace(/\D/g, '')
  if (!nums) return ''
  return Number(nums).toLocaleString('es-CO')
}

function parseCurrencyRaw(formatted: string): string {
  return formatted.replace(/\D/g, '')
}

function seedFromInmo(): Partial<FichaData> {
  try {
    const raw = localStorage.getItem('inmo-form-data')
    if (!raw) return {}
    const { data } = JSON.parse(raw) as { data: Record<string, string | string[] | boolean> }
    if (!data) return {}
    const seeded: Partial<FichaData> = {}

    const map: [keyof FichaData, string][] = [
      ['ciudad', 'ciudad'],
      ['barrio', 'barrio'],
      ['direccion', 'direccion'],
      ['numeroApto', 'numero_vivienda'],
      ['piso', 'piso'],
      ['areaM2', 'area_m2'],
      ['habitaciones', 'habitaciones'],
      ['banos', 'banos_completos'],
      ['parqueaderos', 'parqueaderos'],
      ['estrato', 'estrato'],
      ['adminMes', 'valor_administracion'],
      ['precioVenta', 'precio_venta'],
      ['nombre', 'nombre_contacto'],
      ['email', 'email_contacto'],
      ['whatsapp', 'telefono_contacto'],
    ]
    for (const [fichaKey, inmoKey] of map) {
      const v = data[inmoKey]
      if (typeof v === 'string' && v.trim()) {
        (seeded as Record<string, string>)[fichaKey] = v.trim()
      }
    }
    return seeded
  } catch { return {} }
}

function loadData(): FichaData {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) {
      const existing = { ...EMPTY_DATA, ...JSON.parse(s) }
      const hasMeaningful = !!(existing.direccion || existing.ciudad || existing.barrio || existing.tipoInmueble)
      if (hasMeaningful) return existing
    }
  } catch { /* ignore */ }

  const inmoSeeded = seedFromInmo()
  return { ...EMPTY_DATA, ...inmoSeeded }
}

function saveData(d: FichaData) {
  saveFichaData(STORAGE_KEY, d as unknown as Record<string, unknown>)
}

function loadPhotos(): string[] {
  try {
    const s = localStorage.getItem(STORAGE_PHOTOS_KEY)
    if (s) return JSON.parse(s)
  } catch { /* ignore */ }
  return []
}

function savePhotos(photos: string[]) {
  try {
    localStorage.setItem(STORAGE_PHOTOS_KEY, JSON.stringify(photos))
  } catch { /* quota exceeded — clear and skip */ }
}

/* ── Component ─────────────────────────── */

interface Props {
  open: boolean
  onClose: () => void
}

export default function FichaCreator({ open, onClose }: Props) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FichaData>(loadData)
  const [photos, setPhotos] = useState<string[]>(loadPhotos)
  const [dragOver, setDragOver] = useState(false)
  const [generating, setGenerating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => { saveData(data) }, [data])
  useEffect(() => { savePhotos(photos) }, [photos])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const set = useCallback(<K extends keyof FichaData>(key: K, value: FichaData[K]) => {
    setData(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleFeature = useCallback((f: string) => {
    setData(prev => {
      const has = prev.features.includes(f)
      return { ...prev, features: has ? prev.features.filter(x => x !== f) : [...prev.features, f] }
    })
  }, [])

  /* Photo handling */
  const addPhotos = useCallback((files: FileList | File[]) => {
    const remaining = 8 - photos.length
    const toProcess = Array.from(files).slice(0, remaining)
    toProcess.forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX = 1200
          let w = img.width, h = img.height
          if (w > MAX || h > MAX) {
            if (w > h) { h = Math.round(h * MAX / w); w = MAX }
            else { w = Math.round(w * MAX / h); h = MAX }
          }
          canvas.width = w; canvas.height = h
          canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
          setPhotos(prev => prev.length < 8 ? [...prev, dataUrl] : prev)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }, [photos.length])

  const removePhoto = useCallback((idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx))
  }, [])

  /* PDF generation */
  const handleDownload = useCallback(async () => {
    if (!previewRef.current || generating) return
    setGenerating(true)
    try {
      const el = previewRef.current
      const dataUrl = await toJpeg(el, { quality: 0.92, pixelRatio: 2, backgroundColor: '#fff' })
      const img = new Image()
      img.src = dataUrl
      await new Promise(resolve => { img.onload = resolve })

      const pxW = img.width
      const pxH = img.height
      const pdfW = 210
      const pdfH = (pxH * pdfW) / pxW

      const pdf = new jsPDF({ orientation: pdfH > pdfW ? 'portrait' : 'landscape', unit: 'mm', format: [pdfW, pdfH] })
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfW, pdfH)
      pdf.save(`ficha-${data.titulo || 'inmueble'}.pdf`)
    } catch (err) {
      console.error('PDF generation error:', err)
    } finally {
      setGenerating(false)
    }
  }, [data.titulo, generating])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) addPhotos(e.dataTransfer.files)
  }, [addPhotos])

  if (!open) return null

  const canGoStep2 = data.titulo.trim() !== '' && data.direccion.trim() !== ''
  const canGoStep3 = photos.length > 0

  return (
    <div className="ficha-overlay" onClick={onClose}>
      <div className="ficha-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ficha-header">
          <div className="ficha-header-left">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M29.3337 13.0881V20.9334C29.3337 23.1736 29.3337 24.2937 28.8977 25.1493C28.5142 25.902 27.9023 26.5139 27.1496 26.8974C26.294 27.3334 25.1739 27.3334 22.9337 27.3334H9.06699C6.82678 27.3334 5.70668 27.3334 4.85103 26.8974C4.09838 26.5139 3.48646 25.902 3.10297 25.1493C2.66699 24.2937 2.66699 23.1736 2.66699 20.9334V13.0881C2.66699 12.9242 2.66699 12.8423 2.66953 12.7712C2.73821 10.8423 4.17454 9.23751 6.08407 8.95623C6.15451 8.94585 6.23592 8.93681 6.39875 8.91871L6.58614 8.89789C7.88359 8.75373 9.0195 7.96168 9.60331 6.79406C10.2552 5.49026 11.5878 4.66669 13.0455 4.66669H18.9552C20.4129 4.66669 21.7454 5.49026 22.3973 6.79406C22.9812 7.96168 24.1171 8.75373 25.4145 8.89789L25.6019 8.91871C25.7647 8.93681 25.8461 8.94585 25.9166 8.95623C27.8261 9.23751 29.2624 10.8423 29.3311 12.7712C29.3337 12.8423 29.3337 12.9242 29.3337 13.0881Z" fill="#6B21A8"/><path d="M22.6663 11.6667C22.1141 11.6667 21.6663 12.1144 21.6663 12.6667C21.6663 13.219 22.1141 13.6667 22.6663 13.6667H23.9997C24.552 13.6667 24.9997 13.219 24.9997 12.6667C24.9997 12.1144 24.552 11.6667 23.9997 11.6667H22.6663Z" fill="#6B21A8"/><path d="M15.9997 22.6667C18.5699 22.6667 20.6663 20.5703 20.6663 18C20.6663 15.4298 18.5699 13.3334 15.9997 13.3334C13.4294 13.3334 11.333 15.4298 11.333 18C11.333 20.5703 13.4294 22.6667 15.9997 22.6667Z" fill="#6B21A8"/></svg>
            <h2 className="ficha-header-title">{step < 3 ? 'Crea la ficha de tu casa' : 'Vista previa'}</h2>
          </div>
          <button className="ficha-close-btn" onClick={onClose} type="button" aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Stepper — only on steps 1-3 */}
        {step < 4 && (
          <div className="ficha-stepper">
            <div className="ficha-stepper-inner">
              <StepBadge n={1} label="Datos" current={step} done={step > 1} />
              <div className={`ficha-stepper-line ${step > 1 ? 'ficha-stepper-line--done' : ''}`} />
              <StepBadge n={2} label="Fotos" current={step} done={step > 2} locked={step < 2} />
              <div className={`ficha-stepper-line ${step > 2 ? 'ficha-stepper-line--done' : ''}`} />
              <StepBadge n={3} label="Vista previa" current={step} done={step > 3} locked={step < 3} />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="ficha-body">
          {step === 1 && (
            <Step1Form data={data} set={set} toggleFeature={toggleFeature} />
          )}
          {step === 2 && (
            <Step2Photos
              photos={photos}
              dragOver={dragOver}
              setDragOver={setDragOver}
              handleDrop={handleDrop}
              addPhotos={addPhotos}
              removePhoto={removePhoto}
              fileInputRef={fileInputRef}
            />
          )}
          {step === 3 && (
            <div className="ficha-step3">
              <div className="ficha-step3-scroll">
                <FichaPreview ref={previewRef} data={data} photos={photos} />
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="ficha-footer">
          {step > 1 && (
            <button type="button" className="ficha-btn-prev" onClick={() => setStep(s => s - 1)}>
              Anterior
            </button>
          )}
          {step === 1 && (
            <button
              type="button"
              className="ficha-btn-next"
              disabled={!canGoStep2}
              onClick={() => setStep(2)}
            >
              <span>Continuar a fotos</span>
              <span className="ficha-btn-next-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H7M17 7v10" stroke="#7955f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </button>
          )}
          {step === 2 && (
            <button
              type="button"
              className="ficha-btn-next"
              disabled={!canGoStep3}
              onClick={() => { setStep(3); trackFichaCreated() }}
            >
              <span>Vista previa</span>
              <span className="ficha-btn-next-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H7M17 7v10" stroke="#7955f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </button>
          )}
          {step === 3 && (
            <button
              type="button"
              className="ficha-btn-download"
              disabled={generating}
              onClick={handleDownload}
            >
              <span>{generating ? 'Generando...' : 'Descargar'}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.333v9.334M8 10.667l-3-3M8 10.667l3-3M2.667 12.667h10.666" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Stepper badge ─────────────────────── */

function StepBadge({ n, label, current, done, locked }: { n: number; label: string; current: number; done: boolean; locked?: boolean }) {
  const isActive = current === n
  return (
    <div className={`ficha-step-badge ${isActive ? 'ficha-step-badge--active' : ''} ${done ? 'ficha-step-badge--done' : ''} ${locked ? 'ficha-step-badge--locked' : ''}`}>
      <div className="ficha-step-circle">
        {done ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10.5l4 4 8-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ) : locked ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="2" stroke="#999" strokeWidth="1.5"/><path d="M5 7V5a3 3 0 016 0v2" stroke="#999" strokeWidth="1.5" strokeLinecap="round"/></svg>
        ) : (
          <span>{n}</span>
        )}
      </div>
      <span className="ficha-step-label">{label}</span>
    </div>
  )
}

/* ── Step 1: Form ─────────────────────── */

function Step1Form({ data, set, toggleFeature }: {
  data: FichaData
  set: <K extends keyof FichaData>(key: K, value: FichaData[K]) => void
  toggleFeature: (f: string) => void
}) {
  return (
    <div className="ficha-form">
      {/* Datos del inmueble */}
      <h3 className="ficha-section-title">Datos de tu inmueble</h3>
      <div className="ficha-grid ficha-grid--3col">
        <div className="ficha-field ficha-field--span2">
          <label className="ficha-label">Título del anuncio</label>
          <input className="ficha-input" placeholder="Ejm: Hermoso apartamento en Chapinero con vista a la ciudad" value={data.titulo} onChange={e => set('titulo', e.target.value)} />
        </div>
        <div className="ficha-field">
          <label className="ficha-label">Tipo de inmueble</label>
          <select className="ficha-select" value={data.tipoInmueble} onChange={e => set('tipoInmueble', e.target.value)}>
            <option value="">Seleccione</option>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="ficha-field">
          <label className="ficha-label">Ciudad</label>
          <select className="ficha-select" value={data.ciudad} onChange={e => set('ciudad', e.target.value)}>
            <option value="">Seleccione</option>
            {CIUDADES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="ficha-field">
          <label className="ficha-label">Barrio</label>
          <input className="ficha-input" placeholder="Ejm: Chapinero" value={data.barrio} onChange={e => set('barrio', e.target.value)} />
        </div>
        <div className="ficha-field">
          <label className="ficha-label">Dirección</label>
          <input className="ficha-input" placeholder="Ejm: calle 24B # 16-14" value={data.direccion} onChange={e => set('direccion', e.target.value)} />
        </div>

        <div className="ficha-field">
          <label className="ficha-label">Numero de apto</label>
          <input className="ficha-input" placeholder="Ejm: 203" value={data.numeroApto} onChange={e => set('numeroApto', e.target.value)} />
        </div>
        <div className="ficha-field">
          <label className="ficha-label">Área (m²)</label>
          <input className="ficha-input" placeholder="Ejm: 57" value={data.areaM2} onChange={e => set('areaM2', e.target.value.replace(/\D/g, ''))} />
        </div>
        <div className="ficha-field">
          <label className="ficha-label">Antigüedad / Años</label>
          <input className="ficha-input" placeholder="Ejm: 25" value={data.antiguedad} onChange={e => set('antiguedad', e.target.value.replace(/\D/g, ''))} />
        </div>
        <div className="ficha-field">
          <label className="ficha-label">Parqueaderos</label>
          <select className="ficha-select" value={data.parqueaderos} onChange={e => set('parqueaderos', e.target.value)}>
            <option value="">Seleccione</option>
            {NUMS_03.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div className="ficha-field">
          <label className="ficha-label">Baños</label>
          <select className="ficha-select" value={data.banos} onChange={e => set('banos', e.target.value)}>
            <option value="">Seleccione</option>
            {NUMS_14.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="ficha-field">
          <label className="ficha-label">Habitaciones</label>
          <select className="ficha-select" value={data.habitaciones} onChange={e => set('habitaciones', e.target.value)}>
            <option value="">Seleccione</option>
            {NUMS_14.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="ficha-field">
          <label className="ficha-label">Piso</label>
          <input className="ficha-input" placeholder="Ejm: 5" value={data.piso} onChange={e => set('piso', e.target.value.replace(/\D/g, ''))} />
        </div>

        <div className="ficha-field">
          <label className="ficha-label">Estrato</label>
          <select className="ficha-select" value={data.estrato} onChange={e => set('estrato', e.target.value)}>
            <option value="">Seleccione</option>
            {ESTRATOS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="ficha-field">
          <label className="ficha-label">Valor de la administración / Mes</label>
          <div className="ficha-currency-wrap">
            <span className="ficha-currency-sign">$</span>
            <input
              className="ficha-input ficha-input--currency"
              placeholder="0"
              value={formatCurrency(data.adminMes)}
              onChange={e => set('adminMes', parseCurrencyRaw(e.target.value))}
            />
          </div>
        </div>
        <div className="ficha-field">
          <label className="ficha-label">Precio de venta</label>
          <div className="ficha-currency-wrap">
            <span className="ficha-currency-sign">$</span>
            <input
              className="ficha-input ficha-input--currency"
              placeholder="0"
              value={formatCurrency(data.precioVenta)}
              onChange={e => set('precioVenta', parseCurrencyRaw(e.target.value))}
            />
          </div>
        </div>

        <div className="ficha-field ficha-field--span2">
          <label className="ficha-label">Descripción de la propiedad</label>
          <textarea
            className="ficha-textarea"
            placeholder="Cuenta los detalles que hacen especial tu casa, como la ubicación, características, reformas, zonas comunes, vías principales, seguridad, etc."
            value={data.descripcion}
            onChange={e => set('descripcion', e.target.value)}
            maxLength={500}
          />
          <span className="ficha-char-count">{data.descripcion.length} / 500</span>
        </div>
      </div>

      {/* Características */}
      <h3 className="ficha-section-title">Características destacadas</h3>
      <div className="ficha-features-grid">
        {ALL_FEATURES.map(f => (
          <label key={f} className="ficha-feature-item">
            <input
              type="checkbox"
              checked={data.features.includes(f)}
              onChange={() => toggleFeature(f)}
            />
            <span className="ficha-feature-box" />
            <span className="ficha-feature-label">{f}</span>
          </label>
        ))}
      </div>

      {/* Datos de contacto */}
      <h3 className="ficha-section-title">Datos de contacto</h3>
      <div className="ficha-grid ficha-grid--3col">
        <div className="ficha-field">
          <label className="ficha-label">Tu nombre / contacto</label>
          <input className="ficha-input" placeholder="Nombre" value={data.nombre} onChange={e => set('nombre', e.target.value)} />
        </div>
        <div className="ficha-field">
          <label className="ficha-label">Email</label>
          <input className="ficha-input" type="email" placeholder="Correo electrónico" value={data.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div className="ficha-field">
          <label className="ficha-label">WhatsApp</label>
          <input className="ficha-input" type="tel" placeholder="Número" value={data.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
        </div>
      </div>
    </div>
  )
}

/* ── Step 2: Photos ───────────────────── */

function Step2Photos({ photos, dragOver, setDragOver, handleDrop, addPhotos, removePhoto, fileInputRef }: {
  photos: string[]
  dragOver: boolean
  setDragOver: (v: boolean) => void
  handleDrop: (e: React.DragEvent) => void
  addPhotos: (files: FileList | File[]) => void
  removePhoto: (i: number) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <div className="ficha-photos">
      <h3 className="ficha-section-title">Fotos de tu inmueble</h3>
      <p className="ficha-photos-subtitle">Sube hasta 8 fotos. La primera será la foto principal de la ficha. Arrastra para reordenar.</p>

      {/* Dropzone */}
      <div
        className={`ficha-dropzone ${dragOver ? 'ficha-dropzone--active' : ''} ${photos.length > 0 ? 'ficha-dropzone--has-photos' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => photos.length < 8 && fileInputRef.current?.click()}
      >
        {photos.length === 0 ? (
          <div className="ficha-dropzone-empty">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path opacity="0.4" d="M20 6.667c-3.928 0-5.893 0-7.39.764a7.111 7.111 0 00-2.96 2.96c-.764 1.496-.764 3.46-.764 7.39v12.438c0 3.928 0 5.893.764 7.39a7.111 7.111 0 002.96 2.96c1.496.764 3.46.764 7.39.764h8c3.928 0 5.893 0 7.39-.764a7.111 7.111 0 002.96-2.96c.764-1.496.764-3.46.764-7.39V17.78c0-3.928 0-5.893-.764-7.39a7.111 7.111 0 00-2.96-2.96c-1.496-.764-3.46-.764-7.39-.764h-8z" fill="#9333EA"/>
              <path d="M24 17.333a4 4 0 100 8 4 4 0 000-8z" fill="#9333EA"/>
              <path d="M12 36l5.172-5.172a4 4 0 015.656 0L24 32l3.172-3.172a4 4 0 015.656 0L36 32" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="ficha-dropzone-text">Haz clic o arrastra tus fotos aquí</p>
            <p className="ficha-dropzone-hint">JPG, PNG · Máximo 8 fotos</p>
          </div>
        ) : (
          <div className="ficha-photos-grid">
            {photos.map((src, i) => (
              <div key={i} className="ficha-photo-thumb">
                <img src={src} alt={`Foto ${i + 1}`} />
                {i === 0 && <span className="ficha-photo-badge">★ Foto de portada</span>}
                <button type="button" className="ficha-photo-remove" onClick={e => { e.stopPropagation(); removePhoto(i) }} aria-label="Eliminar">×</button>
              </div>
            ))}
            {photos.length < 8 && (
              <div className="ficha-photo-add">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 8v16M8 16h16" stroke="#9333EA" strokeWidth="2" strokeLinecap="round"/></svg>
                <span>Agregar</span>
              </div>
            )}
          </div>
        )}
        <input
          ref={fileInputRef as React.RefObject<HTMLInputElement>}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files) addPhotos(e.target.files); e.target.value = '' }}
        />
      </div>

      <p className="ficha-photos-note">
        <strong>Dato importante:</strong> La primera foto que subas será la portada de tu ficha. Elige la mejor.
      </p>
    </div>
  )
}
