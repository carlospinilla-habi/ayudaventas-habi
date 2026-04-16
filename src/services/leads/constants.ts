/** País piloto para registro en middleware sellers. */
export const COLOMBIA_LEAD_COUNTRY = 'CO' as const

/** Estrategia de negocio para leads que quieren vender. */
export const SELLERS_STRATEGY_HELP_TO_SELL = 'help_to_sell' as const

export const GEOREFERENCE_BASE_URL =
  'https://apiv2.habi.co/web-global-api-georeferencing/v1.0/georeference'

export const DEFAULT_MIDDLEWARE_URL =
  'https://8eqyvzr6u9.execute-api.us-east-2.amazonaws.com/prod/post_middleware'

/** Identificadores de origen para el body de `post_middleware` (Ayudaventas). */
export const SELLERS_MIDDLEWARE_SOURCE_ID = 3 as const
export const SELLERS_MIDDLEWARE_SUB_SOURCE_ID = 133 as const
