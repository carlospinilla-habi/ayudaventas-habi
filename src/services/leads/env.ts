/**
 * Lee variables VITE_*: Jest usa process.env; Vite sustituye process.env.VITE_* vía `define` en vite.config.
 */
export function readEnv(key: string): string {
  if (typeof process !== 'undefined' && process.env[key] != null && process.env[key] !== '') {
    return process.env[key] as string
  }
  switch (key) {
    case 'VITE_GEOREFERENCE_API_KEY':
      return 'bNvse3hoUWaATmKopmWXs3a8ifHCPDSK6qzMjpO1'
    case 'VITE_SELLERS_MIDDLEWARE_API_KEY':
      return 'ZIsF5E6vCD5W3i8fu4cxGHeHUQXgBLT3aI1drg26'
    case 'VITE_SELLERS_MIDDLEWARE_URL':
      return 'https://t7ln416bll.execute-api.us-east-2.amazonaws.com/dev/post_middleware'
    case 'VITE_ENABLE_SELLERS_MIDDLEWARE_CO':
      return 'true'
    default:
      return ''
  }
}
