import type { InmoFormData } from '@/components/InmoForm/useInmoForm'

function toStr(v: string | string[] | boolean | undefined): string {
  return typeof v === 'string' ? v.trim() : ''
}

/**
 * Construye una sola línea de dirección para el servicio de georeferenciación.
 */
export function buildAddressLineForGeoref(formData: InmoFormData): string {
  const parts = [toStr(formData.direccion), toStr(formData.barrio), toStr(formData.ciudad), 'Colombia'].filter(
    (p) => p.length > 0
  )
  return parts.join(', ')
}
