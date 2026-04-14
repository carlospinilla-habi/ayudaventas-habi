import type { InmoFormData } from '@/components/InmoForm/useInmoForm'
import { COLOMBIA_LEAD_COUNTRY, DEFAULT_MIDDLEWARE_URL } from './constants'
import { readEnv } from './env'
import { fetchGeoreferenceHomologation } from './georeference'
import { buildAddressLineForGeoref } from './buildAddressLine'
import { buildMiddlewarePayload } from './mapFormToMiddlewarePayload'
import { postSellersMiddleware } from './middleware'
import { shouldRegisterLeadOnMiddleware } from './shouldRegisterLead'

export interface SubmitColombiaLeadOptions {
  /** Por defecto CO (InmoForm actual es solo Colombia). */
  leadCountryCode?: string
  fetchImpl?: typeof fetch
}

/**
 * Georeferencia + POST a post_middleware. No modifica Supabase.
 */
export async function submitColombiaLeadThroughMiddleware(
  formData: InmoFormData,
  options?: SubmitColombiaLeadOptions
): Promise<void> {
  const leadCountry = options?.leadCountryCode ?? COLOMBIA_LEAD_COUNTRY
  if (!shouldRegisterLeadOnMiddleware(leadCountry)) {
    return
  }

  const geoKey = readEnv('VITE_GEOREFERENCE_API_KEY')
  const mwKey = readEnv('VITE_SELLERS_MIDDLEWARE_API_KEY')
  const mwUrl = readEnv('VITE_SELLERS_MIDDLEWARE_URL') || DEFAULT_MIDDLEWARE_URL
  const fetchImpl = options?.fetchImpl ?? fetch

  if (!geoKey || !mwKey) {
    console.warn(
      '[sellers-lead] Missing VITE_GEOREFERENCE_API_KEY or VITE_SELLERS_MIDDLEWARE_API_KEY; skipping middleware registration.'
    )
    return
  }

  const addressLine = buildAddressLineForGeoref(formData)
  const geo = await fetchGeoreferenceHomologation(
    { country: COLOMBIA_LEAD_COUNTRY, addressLine: addressLine, apiKey: geoKey },
    fetchImpl
  )
  const body = buildMiddlewarePayload(formData, geo)
  await postSellersMiddleware(body, mwKey, mwUrl, fetchImpl)
}
