import {
  SELLERS_MIDDLEWARE_SOURCE_ID,
  SELLERS_MIDDLEWARE_SUB_SOURCE_ID,
} from './constants'

export type SellersCountryCode = 'CO'

/** Alineado con `SELLERS_STRATEGY_HELP_TO_SELL` en `constants.ts`. */
export type SellersStrategy = 'help_to_sell'

export interface GeorefHomologation {
  homologated_address: string
  latitude?: number
  longitude?: number
}

/** Campos del formulario tal como se persisten en Supabase (`inmo_form_submissions`). */
export interface InmoFormDetailFields {
  ciudad: string | null
  barrio: string | null
  direccion: string | null
  tipo_inmueble: string | null
  torre: string | null
  piso: string | null
  numero_vivienda: string | null
  tiene_ascensor: string | null
  ultimo_piso: string | null
  relacion_inmueble: string | null
  nombre_contacto: string | null
  email_contacto: string | null
  telefono_contacto: string | null
  acepta_terminos: boolean
  antiguedad: string | null
  area_m2: string | null
  habitaciones: string | null
  banos_completos: string | null
  banos_medios: string | null
  zonas: string[] | null
  parqueaderos: string | null
  tipo_parqueadero: string | null
  organizacion_parqueadero: string | null
  precio_venta: string | null
  valor_administracion: string | null
  obra_gris: string | null
  estrato: string | null
  gravamen: string | null
  tipo_gravamen: string | null
  estado_vivienda: string | null
  zonas_comunes: string[] | null
  motivo_venta: string | null
  tiempo_vendiendo: string | null
}

export interface SellersMiddlewarePayload extends InmoFormDetailFields {
  source_id: typeof SELLERS_MIDDLEWARE_SOURCE_ID
  sub_source_id: typeof SELLERS_MIDDLEWARE_SUB_SOURCE_ID
  country: SellersCountryCode
  strategy: SellersStrategy
  homologated_address: string
  latitude: number
  longitude: number
}
