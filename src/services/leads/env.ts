/**
 * Lee variables VITE_*: Jest usa process.env; Vite sustituye process.env.VITE_* vía `define` en vite.config.
 */
export function readEnv(key: string): string {
  if (typeof process !== 'undefined' && process.env[key] != null && process.env[key] !== '') {
    return process.env[key] as string
  }
  switch (key) {
    case 'VITE_GEOREFERENCE_API_KEY':
      return 'NNKqq91UqB7mUraiwkmgm2b53FOSzeh14wDYPqvQ'
    case 'VITE_SELLERS_MIDDLEWARE_API_KEY':
      return 'TN30vMr7Eg5ks2cbLzBtz3oAOvP7sD0HaYbm5QPS'
    case 'VITE_SELLERS_MIDDLEWARE_URL':
      return 'https://8eqyvzr6u9.execute-api.us-east-2.amazonaws.com/prod/post_middleware'
    case 'VITE_ENABLE_SELLERS_MIDDLEWARE_CO':
      return 'true'
    default:
      return ''
  }
}
