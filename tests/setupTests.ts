import '@testing-library/jest-dom'

process.env.VITE_GEOREFERENCE_API_KEY = process.env.VITE_GEOREFERENCE_API_KEY ?? 'test-georef-key'
process.env.VITE_SELLERS_MIDDLEWARE_API_KEY = process.env.VITE_SELLERS_MIDDLEWARE_API_KEY ?? 'test-mw-key'
process.env.VITE_SELLERS_MIDDLEWARE_URL =
  process.env.VITE_SELLERS_MIDDLEWARE_URL ?? 'https://example.test/post_middleware'
