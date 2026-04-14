/**
 * Campos de detalle del InmoForm alineados con `syncInmoFormSubmission` en `lib/supabase.ts`
 * (misma lógica toStr / toArr / ciudad_checkbox).
 */
import type { InmoFormDetailFields } from './types'

export function buildInmoFormDetailFields(
  formData: Record<string, string | string[] | boolean>
): InmoFormDetailFields {
  const toStr = (key: string) => {
    const v = formData[key]
    return typeof v === 'string' ? v : null
  }

  const toArr = (key: string) => {
    const v = formData[key]
    return Array.isArray(v) ? v : null
  }

  return {
    ciudad: toStr('ciudad'),
    barrio: toStr('barrio'),
    direccion: toStr('direccion'),
    tipo_inmueble: toStr('tipo_inmueble'),
    torre: toStr('torre'),
    piso: toStr('piso'),
    numero_vivienda: toStr('numero_vivienda'),
    tiene_ascensor: toStr('tiene_ascensor'),
    ultimo_piso: toStr('ultimo_piso'),
    relacion_inmueble: toStr('relacion_inmueble'),
    nombre_contacto: toStr('nombre_contacto'),
    email_contacto: toStr('email_contacto'),
    telefono_contacto: toStr('telefono_contacto'),
    acepta_terminos: !!formData['ciudad_checkbox'],
    antiguedad: toStr('antiguedad'),
    area_m2: toStr('area_m2'),
    habitaciones: toStr('habitaciones'),
    banos_completos: toStr('banos_completos'),
    banos_medios: toStr('banos_medios'),
    zonas: toArr('zonas') ?? (toStr('zonas') ? [toStr('zonas')!] : null),
    parqueaderos: toStr('parqueaderos'),
    tipo_parqueadero: toStr('tipo_parqueadero'),
    organizacion_parqueadero: toStr('organizacion_parqueadero'),
    precio_venta: toStr('precio_venta'),
    valor_administracion: toStr('valor_administracion'),
    obra_gris: toStr('obra_gris'),
    estrato: toStr('estrato'),
    gravamen: toStr('gravamen'),
    tipo_gravamen: toStr('tipo_gravamen'),
    estado_vivienda: toStr('estado_vivienda'),
    zonas_comunes: toArr('zonas_comunes'),
    motivo_venta: toStr('motivo_venta'),
    tiempo_vendiendo: toStr('tiempo_vendiendo'),
  }
}
