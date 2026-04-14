/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEOREFERENCE_API_KEY: string
  readonly VITE_SELLERS_MIDDLEWARE_API_KEY: string
  readonly VITE_SELLERS_MIDDLEWARE_URL: string
  readonly VITE_ENABLE_SELLERS_MIDDLEWARE_CO?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
