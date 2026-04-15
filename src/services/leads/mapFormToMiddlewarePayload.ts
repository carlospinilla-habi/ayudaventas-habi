import type { InmoFormData } from '@/components/InmoForm/useInmoForm'
import {
  COLOMBIA_LEAD_COUNTRY,
  SELLERS_MIDDLEWARE_SOURCE_ID,
  SELLERS_MIDDLEWARE_SUB_SOURCE_ID,
  SELLERS_STRATEGY_HELP_TO_SELL,
} from './constants'
import { buildInmoFormDetailFields } from './inmoFormDetailFields'
import type { GeorefHomologation, SellersMiddlewarePayload } from './types'

export function buildMiddlewarePayload(
  formData: InmoFormData,
  geo: GeorefHomologation
): SellersMiddlewarePayload {
  const detail = buildInmoFormDetailFields(formData)
  const lat = geo.latitude ?? 0
  const lng = geo.longitude ?? 0
  return {
    ...detail,
    source_id: SELLERS_MIDDLEWARE_SOURCE_ID,
    sub_source_id: SELLERS_MIDDLEWARE_SUB_SOURCE_ID,
    country: COLOMBIA_LEAD_COUNTRY,
    strategy: SELLERS_STRATEGY_HELP_TO_SELL,
    homologated_address: geo.homologated_address,
    latitude: lat,
    longitude: lng,
  }
}
