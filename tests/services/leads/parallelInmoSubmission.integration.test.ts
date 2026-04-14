/**
 * Integración: `runParallelInmoSubmission` con Supabase y fetch mockeados.
 */

import { faker } from '@faker-js/faker'
import { runParallelInmoSubmission } from '@/services/leads'
import { syncInmoFormSubmission } from '@/lib/supabase'

jest.mock('@/lib/supabase', () => ({
  syncInmoFormSubmission: jest.fn().mockResolvedValue(undefined),
}))

const syncMock = syncInmoFormSubmission as jest.MockedFunction<typeof syncInmoFormSubmission>

function buildValidFormData() {
  return {
    direccion: faker.location.streetAddress(),
    barrio: faker.location.county(),
    ciudad: faker.location.city(),
    telefono_contacto: faker.phone.number(),
    email_contacto: faker.internet.email(),
    precio_venta: String(faker.number.int({ min: 50_000_000, max: 800_000_000 })),
  }
}

describe('runParallelInmoSubmission', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('integration with mocked IO', () => {
    it('should call syncInmoFormSubmission and complete middleware when fetch succeeds', async () => {
      const fetchImpl = jest.fn().mockImplementation((url: string) => {
        if (url.includes('georeferencing')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              homologated_address: faker.location.streetAddress(),
              latitude: 4.65,
              longitude: -74.05,
            }),
          })
        }
        return Promise.resolve({ ok: true })
      })
      global.fetch = fetchImpl as unknown as typeof fetch
      const formData = buildValidFormData()
      await runParallelInmoSubmission(formData)
      expect(syncMock).toHaveBeenCalledWith(formData)
      expect(fetchImpl).toHaveBeenCalled()
    })

    it('should log middleware error and still invoke Supabase when georef fails', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      global.fetch = jest.fn().mockRejectedValue(new Error('georef down')) as unknown as typeof fetch
      const formData = buildValidFormData()
      await runParallelInmoSubmission(formData)
      expect(syncMock).toHaveBeenCalledWith(formData)
      expect(warnSpy).toHaveBeenCalledWith('[InmoForm] middleware lead error:', expect.any(Error))
      warnSpy.mockRestore()
    })

    it('should log supabase error when sync fails', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
      syncMock.mockRejectedValueOnce(new Error('supabase fail'))
      const fetchImpl = jest.fn().mockImplementation((url: string) => {
        if (url.includes('georeferencing')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              homologated_address: faker.location.streetAddress(),
              latitude: 0,
              longitude: 0,
            }),
          })
        }
        return Promise.resolve({ ok: true })
      })
      global.fetch = fetchImpl as unknown as typeof fetch
      await runParallelInmoSubmission(buildValidFormData())
      expect(warnSpy).toHaveBeenCalledWith('[InmoForm] submission error:', expect.any(Error))
      warnSpy.mockRestore()
      syncMock.mockResolvedValue(undefined)
    })
  })
})
