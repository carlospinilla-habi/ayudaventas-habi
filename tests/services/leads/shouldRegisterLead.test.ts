import { shouldRegisterLeadOnMiddleware } from '@/services/leads/shouldRegisterLead'

describe('shouldRegisterLeadOnMiddleware', () => {
  const prev = process.env.VITE_ENABLE_SELLERS_MIDDLEWARE_CO

  afterEach(() => {
    if (prev === undefined) {
      delete process.env.VITE_ENABLE_SELLERS_MIDDLEWARE_CO
    } else {
      process.env.VITE_ENABLE_SELLERS_MIDDLEWARE_CO = prev
    }
  })

  it('should return true for CO when feature flag unset', () => {
    delete process.env.VITE_ENABLE_SELLERS_MIDDLEWARE_CO
    expect(shouldRegisterLeadOnMiddleware('CO')).toBe(true)
  })

  it('should return false when country is not CO', () => {
    expect(shouldRegisterLeadOnMiddleware('MX')).toBe(false)
  })

  it('should return false when feature flag is false', () => {
    process.env.VITE_ENABLE_SELLERS_MIDDLEWARE_CO = 'false'
    expect(shouldRegisterLeadOnMiddleware('CO')).toBe(false)
  })
})
