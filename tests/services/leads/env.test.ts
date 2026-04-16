import { readEnv } from '@/services/leads/env'

describe('readEnv', () => {
  it('should prefer process.env in tests', () => {
    const key = 'VITE_READENV_TEST_KEY'
    const val = `v-${Math.random().toString(36).slice(2)}`
    process.env[key] = val
    expect(readEnv(key)).toBe(val)
    delete process.env[key]
  })

  it('should resolve known VITE_* keys via switch when dynamic lookup is empty', () => {
    const prev = process.env.VITE_SELLERS_MIDDLEWARE_API_KEY
    delete process.env.VITE_SELLERS_MIDDLEWARE_API_KEY
    expect(readEnv('VITE_SELLERS_MIDDLEWARE_API_KEY')).toBe('TN30vMr7Eg5ks2cbLzBtz3oAOvP7sD0HaYbm5QPS')
    process.env.VITE_SELLERS_MIDDLEWARE_API_KEY = 'k-from-switch'
    expect(readEnv('VITE_SELLERS_MIDDLEWARE_API_KEY')).toBe('k-from-switch')
    if (prev === undefined) {
      delete process.env.VITE_SELLERS_MIDDLEWARE_API_KEY
    } else {
      process.env.VITE_SELLERS_MIDDLEWARE_API_KEY = prev
    }
  })

  it('should return middleware URL and enable flag from switch', () => {
    const pu = process.env.VITE_SELLERS_MIDDLEWARE_URL
    const pe = process.env.VITE_ENABLE_SELLERS_MIDDLEWARE_CO
    process.env.VITE_SELLERS_MIDDLEWARE_URL = 'https://mw.example.test'
    process.env.VITE_ENABLE_SELLERS_MIDDLEWARE_CO = 'true'
    expect(readEnv('VITE_SELLERS_MIDDLEWARE_URL')).toBe('https://mw.example.test')
    expect(readEnv('VITE_ENABLE_SELLERS_MIDDLEWARE_CO')).toBe('true')
    if (pu === undefined) delete process.env.VITE_SELLERS_MIDDLEWARE_URL
    else process.env.VITE_SELLERS_MIDDLEWARE_URL = pu
    if (pe === undefined) delete process.env.VITE_ENABLE_SELLERS_MIDDLEWARE_CO
    else process.env.VITE_ENABLE_SELLERS_MIDDLEWARE_CO = pe
  })

  it('should hit switch for URL when dynamic env key is unset', () => {
    const prev = process.env.VITE_SELLERS_MIDDLEWARE_URL
    delete process.env.VITE_SELLERS_MIDDLEWARE_URL
    expect(readEnv('VITE_SELLERS_MIDDLEWARE_URL')).toBe(
      'https://8eqyvzr6u9.execute-api.us-east-2.amazonaws.com/prod/post_middleware'
    )
    if (prev !== undefined) process.env.VITE_SELLERS_MIDDLEWARE_URL = prev
  })

  it('should return empty string for unknown keys', () => {
    expect(readEnv('VITE_NON_EXISTENT_KEY_XYZ')).toBe('')
  })
})
