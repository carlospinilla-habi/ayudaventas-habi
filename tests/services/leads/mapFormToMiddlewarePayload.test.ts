import { faker } from '@faker-js/faker'
import type { InmoFormData } from '@/components/InmoForm/useInmoForm'
import { COLOMBIA_LEAD_COUNTRY, SELLERS_STRATEGY_HELP_TO_SELL } from '@/services/leads/constants'
import { buildMiddlewarePayload } from '@/services/leads/mapFormToMiddlewarePayload'

describe('buildMiddlewarePayload', () => {
  it('should set country CO, strategy help_to_sell, detail fields and homologated fields', () => {
    const price = faker.number.int({ min: 100_000, max: 500_000_000 })
    const homologated = faker.location.streetAddress()
    const lat = faker.number.float({ min: 4, max: 5, fractionDigits: 6 })
    const lng = faker.number.float({ min: -75, max: -73, fractionDigits: 6 })
    const ciudad = faker.location.city()
    const formData: InmoFormData = {
      direccion: faker.location.streetAddress(),
      barrio: faker.location.county(),
      ciudad,
      ciudad_checkbox: true,
      telefono_contacto: faker.phone.number(),
      email_contacto: faker.internet.email(),
      precio_venta: String(price),
    }
    const payload = buildMiddlewarePayload(formData, {
      homologated_address: homologated,
      latitude: lat,
      longitude: lng,
    })
    expect(payload.country).toBe(COLOMBIA_LEAD_COUNTRY)
    expect(payload.strategy).toBe(SELLERS_STRATEGY_HELP_TO_SELL)
    expect(payload.homologated_address).toBe(homologated)
    expect(payload.latitude).toBe(lat)
    expect(payload.longitude).toBe(lng)
    expect(payload.precio_venta).toBe(String(price))
    expect(payload.ciudad).toBe(ciudad)
    expect(payload.acepta_terminos).toBe(true)
    expect(payload.source_id).toBe(3)
    expect(payload.sub_source_id).toBe(133)
  })

  it('should default latitude and longitude to 0 when missing in geo', () => {
    const formData: InmoFormData = {
      direccion: 'x',
      barrio: 'y',
      ciudad: 'z',
      telefono_contacto: '300',
      email_contacto: 'a@b.co',
      precio_venta: '100000',
    }
    const payload = buildMiddlewarePayload(formData, { homologated_address: 'H' })
    expect(payload.latitude).toBe(0)
    expect(payload.longitude).toBe(0)
  })
})
