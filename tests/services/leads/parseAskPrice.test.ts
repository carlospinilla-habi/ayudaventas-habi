import { faker } from '@faker-js/faker'
import { parseAskPriceFromForm } from '@/services/leads/parseAskPrice'

describe('parseAskPriceFromForm', () => {
  it('should parse numeric string with currency symbols', () => {
    const n = faker.number.int({ min: 100_000, max: 900_000_000 })
    const formatted = `$ ${n.toLocaleString('es-CO')}`
    expect(parseAskPriceFromForm(formatted)).toBe(n)
  })

  it('should return 0 for empty or invalid', () => {
    expect(parseAskPriceFromForm('')).toBe(0)
    expect(parseAskPriceFromForm(undefined)).toBe(0)
  })

  it('should return 0 when digits do not form a finite number', () => {
    expect(parseAskPriceFromForm('abc')).toBe(0)
  })
})
