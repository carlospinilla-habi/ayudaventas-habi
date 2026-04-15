import { COLOMBIA_LEAD_COUNTRY } from './constants'
import { readEnv } from './env'

/**
 * Reglas de producto: piloto solo para Colombia; se puede desactivar vía env en despliegues.
 */
export function shouldRegisterLeadOnMiddleware(leadCountryCode: string): boolean {
  if (leadCountryCode !== COLOMBIA_LEAD_COUNTRY) {
    return false
  }
  if (readEnv('VITE_ENABLE_SELLERS_MIDDLEWARE_CO') === 'false') {
    return false
  }
  return true
}
