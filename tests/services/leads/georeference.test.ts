import { faker } from '@faker-js/faker'
import { GEOREFERENCE_BASE_URL } from '@/services/leads/constants'
import { fetchGeoreferenceHomologation, parseGeorefResponse } from '@/services/leads/georeference'

describe('parseGeorefResponse', () => {
  it('should read homologated_address from object', () => {
    const addr = faker.location.streetAddress()
    const r = parseGeorefResponse({
      homologated_address: addr,
      latitude: 4.6,
      longitude: -74.07,
    })
    expect(r.homologated_address).toBe(addr)
    expect(r.latitude).toBe(4.6)
    expect(r.longitude).toBe(-74.07)
  })

  it('should use first element when response is array', () => {
    const addr = faker.location.streetAddress()
    const r = parseGeorefResponse([{ homologated_address: addr, lat: 1, lng: 2 }])
    expect(r.homologated_address).toBe(addr)
    expect(r.latitude).toBe(1)
    expect(r.longitude).toBe(2)
  })

  it('should read longitude from lon when lng is absent', () => {
    const addr = faker.location.streetAddress()
    const r = parseGeorefResponse({
      homologated_address: addr,
      lon: -74.2,
    })
    expect(r.longitude).toBe(-74.2)
  })

  it('should throw when homologated address missing', () => {
    expect(() => parseGeorefResponse({})).toThrow('Missing homologated address')
  })

  it('should use fallback address line when API omits text fields', () => {
    const fallback = 'Calle 1 #2-3, Barrio, Bogotá, Colombia'
    const r = parseGeorefResponse({ latitude: 4.65, longitude: -74.05 }, fallback)
    expect(r.homologated_address).toBe(fallback)
    expect(r.latitude).toBe(4.65)
    expect(r.longitude).toBe(-74.05)
  })

  it('should unwrap data / results and read direccion', () => {
    const addr = 'Carrera 7 #12-34'
    const r = parseGeorefResponse({
      data: {
        results: [{ direccion: addr, lat: '4.6', lng: '-74.1' }],
      },
    })
    expect(r.homologated_address).toBe(addr)
    expect(r.latitude).toBe(4.6)
    expect(r.longitude).toBe(-74.1)
  })

  it('should throw when response is not an object', () => {
    expect(() => parseGeorefResponse('bad')).toThrow('Invalid georef response shape')
  })
})

describe('fetchGeoreferenceHomologation', () => {
  it('should call georeference URL with query and header', async () => {
    const addr = faker.location.streetAddress()
    const country = 'CO'
    const apiKey = faker.string.alphanumeric(32)
    const json = {
      homologated_address: faker.location.streetAddress(),
      latitude: 4,
      longitude: -74,
    }
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => json,
    })
    const result = await fetchGeoreferenceHomologation(
      { country, addressLine: addr, apiKey },
      fetchImpl as unknown as typeof fetch
    )
    expect(fetchImpl).toHaveBeenCalledTimes(1)
    const calledUrl = (fetchImpl.mock.calls[0] as [string])[0]
    expect(calledUrl).toContain(GEOREFERENCE_BASE_URL)
    expect(calledUrl).toContain(`country=${country}`)
    expect(calledUrl).toContain('address=')
    expect(result.homologated_address).toBe(json.homologated_address)
  })

  it('should throw on non-ok HTTP', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ ok: false, status: 500 })
    await expect(
      fetchGeoreferenceHomologation(
        { country: 'CO', addressLine: 'x', apiKey: 'k' },
        fetchImpl as unknown as typeof fetch
      )
    ).rejects.toThrow('Georeference HTTP 500')
  })
})
