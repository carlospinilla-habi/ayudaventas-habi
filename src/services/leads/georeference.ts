import { GEOREFERENCE_BASE_URL } from './constants'
import type { GeorefHomologation } from './types'

const ADDRESS_KEYS = [
  'homologated_address',
  'homologatedAddress',
  'formatted_address',
  'formattedAddress',
  'full_address',
  'fullAddress',
  'normalized_address',
  'normalizedAddress',
  'direccion_homologada',
  'direccionHomologada',
  'direccion',
  'address',
  'display_name',
  'displayName',
  'label',
  'place_name',
  'placeName',
  'formatted',
  'description',
] as const

function num(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(',', '.'))
    if (!Number.isNaN(n)) return n
  }
  return undefined
}

function readAddressString(o: Record<string, unknown>, depth = 0): string {
  if (depth > 4) return ''
  for (const k of ADDRESS_KEYS) {
    const v = o[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  const nestedAddr = o.address
  if (nestedAddr && typeof nestedAddr === 'object' && nestedAddr !== null && !Array.isArray(nestedAddr)) {
    const s = readAddressString(nestedAddr as Record<string, unknown>, depth + 1)
    if (s) return s
  }
  return ''
}

/** Desempaqueta respuestas tipo { data: {...} }, { result: [...] }, etc. */
function pickRecord(json: unknown, depth = 0): Record<string, unknown> | null {
  if (depth > 5) return null
  if (json === null || json === undefined) return null
  if (Array.isArray(json)) {
    if (json.length === 0) return null
    return pickRecord(json[0], depth + 1)
  }
  if (typeof json !== 'object') return null
  const o = json as Record<string, unknown>
  const wrap = o.data ?? o.result ?? o.response ?? o.payload ?? o.body
  if (wrap !== undefined && wrap !== null) {
    const inner = pickRecord(wrap, depth + 1)
    if (inner) return inner
  }
  if (Array.isArray(o.results) && o.results.length > 0) {
    const inner = pickRecord(o.results[0], depth + 1)
    if (inner) return inner
  }
  return o
}

export function parseGeorefResponse(json: unknown, fallbackAddressLine?: string): GeorefHomologation {
  const root = pickRecord(json) ?? (Array.isArray(json) && json[0] && typeof json[0] === 'object'
    ? (json[0] as Record<string, unknown>)
    : null)
  if (!root || typeof root !== 'object') {
    throw new Error('Invalid georef response shape')
  }
  let homologated_address = readAddressString(root)
  if (!homologated_address && typeof fallbackAddressLine === 'string' && fallbackAddressLine.trim()) {
    homologated_address = fallbackAddressLine.trim()
  }
  if (!homologated_address) {
    throw new Error('Missing homologated address in georef response')
  }

  const latitude =
    num(root.latitude) ?? num(root.lat) ?? num((root.location as Record<string, unknown> | undefined)?.lat) ??
    num((root.coordinates as Record<string, unknown> | undefined)?.latitude) ??
    num((root.geo as Record<string, unknown> | undefined)?.lat)
  const longitude =
    num(root.longitude) ??
    num(root.lng) ??
    num(root.lon) ??
    num((root.location as Record<string, unknown> | undefined)?.lng) ??
    num((root.location as Record<string, unknown> | undefined)?.lon) ??
    num((root.coordinates as Record<string, unknown> | undefined)?.longitude) ??
    num((root.geo as Record<string, unknown> | undefined)?.lng)

  return {
    homologated_address,
    latitude,
    longitude,
  }
}

export async function fetchGeoreferenceHomologation(
  params: { country: string; addressLine: string; apiKey: string },
  fetchImpl: typeof fetch
): Promise<GeorefHomologation> {
  const url = new URL(GEOREFERENCE_BASE_URL)
  url.searchParams.set('country', params.country)
  url.searchParams.set('address', params.addressLine)
  const res = await fetchImpl(url.toString(), {
    headers: { 'x-api-key': params.apiKey },
  })
  if (!res.ok) {
    throw new Error(`Georeference HTTP ${res.status}`)
  }
  const json: unknown = await res.json()
  return parseGeorefResponse(json, params.addressLine)
}
