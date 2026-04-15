import { faker } from '@faker-js/faker'
import type { InmoFormData } from '@/components/InmoForm/useInmoForm'
import { submitColombiaLeadThroughMiddleware } from '@/services/leads/submitColombiaLead'
import * as envModule from '@/services/leads/env'

describe('submitColombiaLeadThroughMiddleware', () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

  afterEach(() => {
    warnSpy.mockClear()
  })

  afterAll(() => {
    warnSpy.mockRestore()
  })

  it('should complete georef then middleware on happy path', async () => {
    const homologated = faker.location.streetAddress()
    const fetchImpl = jest.fn().mockImplementation((url: string) => {
      if (url.includes('georeferencing')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            homologated_address: homologated,
            latitude: 4.7,
            longitude: -74.05,
          }),
        })
      }
      return Promise.resolve({ ok: true })
    })
    const ciudad = 'Medellín'
    const data: InmoFormData = {
      direccion: faker.location.streetAddress(),
      barrio: faker.location.county(),
      ciudad,
      telefono_contacto: faker.phone.number(),
      email_contacto: faker.internet.email(),
      precio_venta: '350000000',
    }
    await submitColombiaLeadThroughMiddleware(data, { fetchImpl: fetchImpl as unknown as typeof fetch })
    expect(fetchImpl).toHaveBeenCalled()
    const mwCall = fetchImpl.mock.calls.find((c) => String(c[0]).includes('post_middleware') || c[0] === process.env.VITE_SELLERS_MIDDLEWARE_URL)
    expect(mwCall).toBeDefined()
    const [, init] = mwCall as [string, RequestInit]
    expect(init.method).toBe('POST')
    const body = JSON.parse(init.body as string) as {
      homologated_address: string
      country: string
      strategy: string
      ciudad: string | null
    }
    expect(body.homologated_address).toBe(homologated)
    expect(body.country).toBe('CO')
    expect(body.strategy).toBe('help_to_sell')
    expect(body.ciudad).toBe(ciudad)
  })

  it('should no-op when lead country is not CO', async () => {
    const fetchImpl = jest.fn()
    await submitColombiaLeadThroughMiddleware(
      { ciudad: 'x' },
      { leadCountryCode: 'MX', fetchImpl: fetchImpl as unknown as typeof fetch }
    )
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('should use default middleware URL when VITE_SELLERS_MIDDLEWARE_URL is empty', async () => {
    const prevUrl = process.env.VITE_SELLERS_MIDDLEWARE_URL
    delete process.env.VITE_SELLERS_MIDDLEWARE_URL
    const homologated = faker.location.streetAddress()
    const fetchImpl = jest.fn().mockImplementation((url: string) => {
      if (url.includes('georeferencing')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            homologated_address: homologated,
            latitude: 0,
            longitude: 0,
          }),
        })
      }
      expect(url).toContain('execute-api.us-east-2.amazonaws.com')
      return Promise.resolve({ ok: true })
    })
    const data: InmoFormData = {
      direccion: 'd',
      barrio: 'b',
      ciudad: 'c',
      telefono_contacto: '1',
      email_contacto: 'a@b.co',
      precio_venta: '100000',
    }
    await submitColombiaLeadThroughMiddleware(data, { fetchImpl: fetchImpl as unknown as typeof fetch })
    if (prevUrl === undefined) delete process.env.VITE_SELLERS_MIDDLEWARE_URL
    else process.env.VITE_SELLERS_MIDDLEWARE_URL = prevUrl
  })

  it('should warn and skip when API keys missing', async () => {
    const readEnvSpy = jest.spyOn(envModule, 'readEnv').mockImplementation((key: string) => {
      if (key === 'VITE_GEOREFERENCE_API_KEY' || key === 'VITE_SELLERS_MIDDLEWARE_API_KEY') return ''
      if (key === 'VITE_SELLERS_MIDDLEWARE_URL') {
        return 'https://t7ln416bll.execute-api.us-east-2.amazonaws.com/dev/post_middleware'
      }
      return ''
    })
    const fetchImpl = jest.fn()
    await submitColombiaLeadThroughMiddleware({ ciudad: 'Bogotá' }, { fetchImpl: fetchImpl as unknown as typeof fetch })
    expect(fetchImpl).not.toHaveBeenCalled()
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[sellers-lead] Missing VITE_GEOREFERENCE_API_KEY')
    )
    readEnvSpy.mockRestore()
  })
})
