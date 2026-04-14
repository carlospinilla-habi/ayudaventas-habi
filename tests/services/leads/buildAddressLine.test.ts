import { faker } from '@faker-js/faker'
import type { InmoFormData } from '@/components/InmoForm/useInmoForm'
import { buildAddressLineForGeoref } from '@/services/leads/buildAddressLine'

describe('buildAddressLineForGeoref', () => {
  it('should join direccion, barrio, ciudad and Colombia', () => {
    const direccion = faker.location.streetAddress()
    const barrio = faker.location.county()
    const ciudad = faker.location.city()
    const data: InmoFormData = {
      direccion,
      barrio,
      ciudad,
    }
    const line = buildAddressLineForGeoref(data)
    expect(line).toBe(`${direccion}, ${barrio}, ${ciudad}, Colombia`)
  })

  it('should omit empty segments', () => {
    const data: InmoFormData = {
      direccion: 'Calle 1',
      ciudad: 'Bogotá',
    }
    expect(buildAddressLineForGeoref(data)).toBe('Calle 1, Bogotá, Colombia')
  })
})
